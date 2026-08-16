/**
 * Main Triage Engine Orchestrator.
 * Handles event ingestion, idempotency, identity resolution, temporal reconciliation, conflict resolution, and rule evaluation.
 */

import { resolveIdentity } from './identityResolver.js';
import { reconcileTemporalState } from './temporalReconciler.js';
import { resolveConflicts } from './conflictResolver.js';
import { evaluateTriageRules } from './triageRules.js';
import { createAuditEntry } from '../utils/auditTrail.js';

export function processEvent(event, currentState) {
  // 1. Check Idempotency (processedEventIds)
  const eventId = event.event_id || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  event.event_id = eventId;

  if (currentState.processedEventIds.has(eventId)) {
    const auditEntry = createAuditEntry({
      action: 'ignored',
      reason: `Duplicate event_id ("${eventId}") ignored for idempotency.`,
      details: { event_id: eventId, source: event.source, timestamp: event.timestamp }
    });
    currentState.auditTrail.push(auditEntry);
    return {
      status: 'ignored',
      reason: 'duplicate_event_id',
      session_state_summary: getSessionSummary(currentState),
      audit_entry: auditEntry
    };
  }

  // Mark event as processed
  currentState.processedEventIds.add(eventId);
  currentState.events.push(event);
  currentState.lastActivityTimestamp = event.timestamp || new Date().toISOString();

  // 2. Identity Resolution
  const identityResult = resolveIdentity(event, currentState);
  currentState.patient_id = identityResult.patient_id;
  currentState.identity = identityResult.identity;

  // 3. Temporal Reconciliation
  const temporalResult = reconcileTemporalState(currentState.events);
  currentState.events = temporalResult.sortedEvents;
  currentState.latest_symptom = temporalResult.latestSymptom;
  currentState.latest_telemetry = temporalResult.latestTelemetry;

  // 4. Conflict Resolution
  const conflictResult = resolveConflicts(currentState.latest_telemetry, currentState.latest_symptom);

  // 5. Evaluate Triage Rules & Decision Gate
  const triageDecision = evaluateTriageRules(currentState);
  currentState.triageDecision = triageDecision;

  // 6. Record Audit Trail Entry
  const auditEntry = createAuditEntry({
    action: 'ingested',
    reason: `Ingested ${event.source.toUpperCase()} event (${eventId}). State updated: decision="${triageDecision.decision}".`,
    details: {
      event_id: eventId,
      source: event.source,
      timestamp: event.timestamp,
      patient_id: currentState.patient_id,
      matchScore: currentState.identity.matchScore,
      conflicts: conflictResult.conflicts,
      triageDecision
    }
  });
  currentState.auditTrail.push(auditEntry);

  return {
    status: 'success',
    session_state_summary: getSessionSummary(currentState),
    audit_entry: auditEntry
  };
}

export function evaluateFinalTriage(currentState, currentTime = new Date()) {
  const decision = evaluateTriageRules(currentState, currentTime);
  currentState.triageDecision = decision;

  const auditEntry = createAuditEntry({
    action: 'evaluated',
    reason: `Final decision gate evaluated: ${decision.decision}. Explanation: ${decision.explanation}`,
    details: { decision }
  });
  currentState.auditTrail.push(auditEntry);

  return {
    decision: decision.decision,
    explanation: decision.explanation,
    patient_id: currentState.patient_id,
    session_id: currentState.session_id,
    timestamp: decision.timestamp,
    patient_state: {
      identity: currentState.identity,
      latest_symptom: currentState.latest_symptom,
      latest_telemetry: currentState.latest_telemetry
    },
    audit_trail: currentState.auditTrail
  };
}

export function getSessionSummary(currentState) {
  return {
    session_id: currentState.session_id,
    patient_id: currentState.patient_id,
    identity_resolved: currentState.identity.resolved,
    event_count: currentState.events.length,
    latest_symptom: currentState.latest_symptom,
    latest_telemetry: currentState.latest_telemetry,
    triage_decision: currentState.triageDecision?.decision || 'Pending'
  };
}
