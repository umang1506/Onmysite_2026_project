/**
 * Main Triage Engine Orchestrator.
 * Handles event ingestion, idempotency, duplicate rejection, identity resolution,
 * temporal reconciliation, modality normalization, keyword chart compilation,
 * clarification prompts, holding gates, and final hand-off confirmations.
 */

import { resolveIdentity } from './identityResolver.js';
import { reconcileTemporalState } from './temporalReconciler.js';
import { resolveConflicts } from './conflictResolver.js';
import { evaluateTriageRules } from './triageRules.js';
import { normalizeTranscript, compileSymptomChart, generateClarificationPrompt } from './dataParser.js';
import { createAuditEntry } from '../utils/auditTrail.js';

export function processEvent(event, currentState) {
  const eventId = event.event_id || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  event.event_id = eventId;

  // 1. Idempotency Check & Duplicate Event Rejection Alert
  if (currentState.processedEventIds.has(eventId)) {
    const auditEntry = createAuditEntry({
      action: 'ignored',
      reason: `Duplicate event_id ("${eventId}") rejected for idempotency.`,
      details: { event_id: eventId, source: event.source, timestamp: event.timestamp }
    });
    currentState.auditTrail.push(auditEntry);
    return {
      status: 'ignored',
      reason: 'duplicate_event_id',
      duplicateAlert: `Duplicate Alert: Event ID ${eventId} was already recorded for this session.`,
      session_state_summary: getSessionSummary(currentState),
      audit_entry: auditEntry
    };
  }

  // Duplicate Text Symptom Submission Rejection Alert Check
  const incomingData = typeof event.data === 'object' ? event.data : { text: String(event.data) };
  const incomingText = incomingData.symptoms || incomingData.text || '';
  if (incomingText && currentState.latest_symptom && incomingText.trim().toLowerCase() === currentState.latest_symptom.trim().toLowerCase()) {
    const duplicateAlert = `Duplicate Alert: The exact symptom text ("${incomingText}") was already recorded for this session at ${currentState.lastActivityTimestamp || 'earlier'}.`;
    const auditEntry = createAuditEntry({
      action: 'ignored',
      reason: duplicateAlert,
      details: { text: incomingText }
    });
    currentState.auditTrail.push(auditEntry);
    return {
      status: 'ignored',
      reason: 'duplicate_symptom_text',
      duplicateAlert,
      session_state_summary: getSessionSummary(currentState),
      audit_entry: auditEntry
    };
  }

  // Mark event as processed
  currentState.processedEventIds.add(eventId);
  currentState.events.push(event);
  currentState.lastActivityTimestamp = event.timestamp || new Date().toISOString();

  // Update Intake State Machine
  if (currentState.intakeState === 'GREETING') {
    currentState.intakeState = 'SYMPTOM_COLLECTION';
  }

  // 2. Identity Resolution & Missing Identity Fallback Loops
  const identityResult = resolveIdentity(event, currentState);
  currentState.patient_id = identityResult.patient_id;
  currentState.identity = identityResult.identity;

  if (!currentState.patient_id && (!currentState.identity || !currentState.identity.name)) {
    currentState.fallbackPrompt = 'Missing Identity Fallback Prompt: Please provide patient full name or 10-digit mobile number to resolve identity.';
  } else {
    currentState.fallbackPrompt = null;
  }

  // 3. Temporal Reconciliation & Modality Normalization
  const temporalResult = reconcileTemporalState(currentState.events);
  currentState.events = temporalResult.sortedEvents;
  currentState.latest_symptom = temporalResult.latestSymptom;
  currentState.latest_telemetry = temporalResult.latestTelemetry;

  if (currentState.latest_symptom) {
    currentState.normalized_symptom = normalizeTranscript(currentState.latest_symptom);
  }

  // 4. Keyword-Driven Triage Chart Generation
  currentState.symptomChart = compileSymptomChart(currentState.normalized_symptom || currentState.latest_symptom, currentState.latest_telemetry);

  // 5. Automated Clarification Prompts (Conflicting Severities)
  currentState.clarificationPrompt = generateClarificationPrompt(currentState.normalized_symptom || currentState.latest_symptom);

  // 6. Conflict Resolution & Evaluate Triage Rules (Holding Gates / State Machine)
  const conflictResult = resolveConflicts(currentState.latest_telemetry, currentState.latest_symptom);
  const triageDecision = evaluateTriageRules(currentState);
  currentState.triageDecision = triageDecision;

  // 7. Record Audit Trail Entry
  const auditEntry = createAuditEntry({
    action: 'ingested',
    reason: `Ingested ${event.source.toUpperCase()} event (${eventId}). State="${currentState.intakeState}", Decision="${triageDecision.decision}".`,
    details: {
      event_id: eventId,
      source: event.source,
      timestamp: event.timestamp,
      patient_id: currentState.patient_id,
      matchScore: currentState.identity.matchScore,
      conflicts: conflictResult.conflicts,
      intakeState: currentState.intakeState,
      symptomChart: currentState.symptomChart,
      fallbackPrompt: currentState.fallbackPrompt,
      clarificationPrompt: currentState.clarificationPrompt,
      handoffConfirmation: currentState.handoffConfirmation,
      triageDecision
    }
  });
  currentState.auditTrail.push(auditEntry);

  return {
    status: 'success',
    intakeState: currentState.intakeState,
    symptomChart: currentState.symptomChart,
    fallbackPrompt: currentState.fallbackPrompt,
    clarificationPrompt: currentState.clarificationPrompt,
    handoffConfirmation: currentState.handoffConfirmation,
    session_state_summary: getSessionSummary(currentState),
    audit_entry: auditEntry
  };
}

export function evaluateFinalTriage(currentState, currentTime = new Date()) {
  const decision = evaluateTriageRules(currentState, currentTime);
  currentState.triageDecision = decision;

  const auditEntry = createAuditEntry({
    action: 'evaluated',
    reason: `Final decision gate evaluated: ${decision.decision}. Hand-off: ${currentState.handoffConfirmation}`,
    details: { decision, intakeState: currentState.intakeState }
  });
  currentState.auditTrail.push(auditEntry);

  return {
    decision: decision.decision,
    explanation: decision.explanation,
    patient_id: currentState.patient_id,
    session_id: currentState.session_id,
    timestamp: decision.timestamp,
    intakeState: currentState.intakeState,
    symptomChart: currentState.symptomChart || [],
    fallbackPrompt: currentState.fallbackPrompt,
    clarificationPrompt: currentState.clarificationPrompt,
    handoffConfirmation: currentState.handoffConfirmation || decision.handoffConfirmation,
    patient_state: {
      identity: currentState.identity,
      latest_symptom: currentState.latest_symptom,
      normalized_symptom: currentState.normalized_symptom,
      latest_telemetry: currentState.latest_telemetry
    },
    audit_trail: currentState.auditTrail
  };
}

export function getSessionSummary(currentState) {
  return {
    session_id: currentState.session_id,
    patient_id: currentState.patient_id,
    intakeState: currentState.intakeState,
    identity_resolved: currentState.identity.resolved,
    event_count: currentState.events.length,
    latest_symptom: currentState.latest_symptom,
    latest_telemetry: currentState.latest_telemetry,
    symptomChart: currentState.symptomChart || [],
    fallbackPrompt: currentState.fallbackPrompt,
    clarificationPrompt: currentState.clarificationPrompt,
    handoffConfirmation: currentState.handoffConfirmation,
    triage_decision: currentState.triageDecision?.decision || 'Pending'
  };
}
