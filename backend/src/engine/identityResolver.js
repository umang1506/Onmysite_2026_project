/**
 * Identity Resolution Engine.
 * Evaluates patient identity based on exact patient_id, normalized phone,
 * name similarity (Levenshtein), and symptom overlap without ML.
 */

import { normalizePhone, stringSimilarityScore } from '../utils/stringUtils.js';

export function resolveIdentity(event, currentState) {
  let score = 0.0;
  const matchDetails = [];
  const eventData = typeof event.data === 'object' ? event.data : {};

  const incomingPatientId = event.patient_id || eventData.patient_id;
  const incomingPhone = normalizePhone(eventData.phone || eventData.contact);
  const incomingName = eventData.name || eventData.patient_name;

  const currentPatientId = currentState.patient_id;
  const currentPhone = normalizePhone(currentState.identity.phone);
  const currentName = currentState.identity.name;

  // 1. Exact patient_id match -> +1.0
  if (incomingPatientId && currentPatientId && incomingPatientId === currentPatientId) {
    score += 1.0;
    matchDetails.push(`Exact patient_id match ('${incomingPatientId}') (+1.0)`);
  } else if (incomingPatientId && !currentPatientId) {
    score += 0.5;
    matchDetails.push(`Initial patient_id assigned ('${incomingPatientId}') (+0.5)`);
  }

  // 2. Phone match (normalized) -> +0.4
  if (incomingPhone && currentPhone && incomingPhone === currentPhone) {
    score += 0.4;
    matchDetails.push(`Normalized phone match ('${incomingPhone}') (+0.4)`);
  }

  // 3. Name partial match (Levenshtein / substring) -> +0.3
  if (incomingName && currentName) {
    const nameSim = stringSimilarityScore(incomingName, currentName);
    if (nameSim >= 0.7) {
      const addedScore = Number((0.3 * nameSim).toFixed(2));
      score += addedScore;
      matchDetails.push(`Name similarity match ('${incomingName}' ~ '${currentName}' score: ${(nameSim * 100).toFixed(0)}%) (+${addedScore})`);
    }
  }

  // 4. Symptom pattern overlap -> +0.2
  if (eventData.symptoms && currentState.latest_symptom) {
    const s1 = String(eventData.symptoms).toLowerCase();
    const s2 = String(currentState.latest_symptom).toLowerCase();
    if (s1.includes(s2) || s2.includes(s1)) {
      score += 0.2;
      matchDetails.push(`Symptom pattern overlap (+0.2)`);
    }
  }

  const finalScore = Number(Math.min(1.0, score).toFixed(2));
  const isResolved = finalScore >= 0.6 || Boolean(incomingPatientId && (!currentPatientId || incomingPatientId === currentPatientId));

  const resolvedPatientId = incomingPatientId || currentPatientId || `P-TEMP-${currentState.session_id.substring(0, 6)}`;
  const resolvedName = incomingName || currentName || null;
  const resolvedPhone = incomingPhone || currentPhone || null;

  return {
    patient_id: resolvedPatientId,
    identity: {
      name: resolvedName,
      phone: resolvedPhone,
      matchScore: finalScore,
      resolved: isResolved,
      explanation: matchDetails.length > 0 ? matchDetails.join(', ') : 'No identity match indicators found'
    }
  };
}
