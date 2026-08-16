/**
 * Triage Rules & Decision Gate Engine.
 * Evaluates Emergency, Mental Health, General, and Timeout states with dynamic interpolated explanations.
 */

export function evaluateTriageRules(state, currentTime = new Date()) {
  const events = state.events || [];
  const telemetry = state.latest_telemetry || {};
  const symptomText = state.latest_symptom || '';

  const hasTextOrAudio = events.some(e => e.source === 'text' || e.source === 'audio');
  const hasSensor = events.some(e => e.source === 'sensor');

  // Check explicit text confirmation keyword
  const hasExplicitConfirmation = symptomText.toLowerCase().includes('confirm') ||
    symptomText.toLowerCase().includes('verified') ||
    symptomText.toLowerCase().includes('confirmed');

  // Decision Gate Check: Must have (text/audio AND (sensor OR confirmation))
  const meetsDecisionGate = hasTextOrAudio && (hasSensor || hasExplicitConfirmation);

  // Check Hanging Session Timeout (if session sits > 5 minutes with incomplete data)
  const TIMEOUT_MS = 5 * 60 * 1000;
  const lastActivityTime = state.lastActivityTimestamp ? new Date(state.lastActivityTimestamp).getTime() : 0;
  const nowMs = new Date(currentTime).getTime();
  const isTimedOut = lastActivityTime > 0 && (nowMs - lastActivityTime >= TIMEOUT_MS);

  // 1. Hanging Session Timeout Edge Case
  if (!meetsDecisionGate && isTimedOut && hasTextOrAudio) {
    return {
      decision: 'Pending - Incomplete Data (Timeout)',
      explanation: `Session timed out after 5 minutes waiting for sensor telemetry. Text input recorded ("${symptomText}"), but required SpO2/HR vitals never arrived due to possible device disconnection.`,
      timestamp: new Date().toISOString(),
      gateStatus: 'TIMED_OUT'
    };
  }

  // 2. Gate blocked if incomplete data without timeout
  if (!meetsDecisionGate) {
    return {
      decision: 'Pending - Incomplete Data',
      explanation: `Decision gate blocked: Requires ≥1 text/audio input AND (≥1 sensor telemetry OR explicit confirmation phrase). Currently recorded: text=${hasTextOrAudio ? 'yes' : 'no'}, sensor=${hasSensor ? 'yes' : 'no'}.`,
      timestamp: new Date().toISOString(),
      gateStatus: 'BLOCKED'
    };
  }

  // 3. Evaluate Emergency Rules (Sensor Vitals OR Emergency Keywords)
  const spo2 = telemetry.spo2;
  const hr = telemetry.heart_rate;

  const isSensorEmergency = (spo2 !== null && spo2 !== undefined && spo2 < 90) ||
    (hr !== null && hr !== undefined && (hr > 150 || hr < 40));

  const emergencyKeywords = [
    'chest pain', "can't breathe", 'cannot breathe', 'unconscious',
    'severe bleeding', 'heart attack', 'stroke', 'choking', 'anaphylaxis'
  ];

  let matchedEmergencyKeyword = null;
  if (symptomText) {
    const lowerSymptom = symptomText.toLowerCase();
    for (const kw of emergencyKeywords) {
      if (lowerSymptom.includes(kw)) {
        matchedEmergencyKeyword = kw;
        break;
      }
    }
  }

  if (isSensorEmergency || matchedEmergencyKeyword) {
    let explanationParts = [];
    if (isSensorEmergency) {
      explanationParts.push(`Critical vitals recorded: SpO2=${spo2 ?? 'N/A'}% (threshold <90%), HR=${hr ?? 'N/A'} bpm (threshold 40-150 bpm)`);
    }
    if (matchedEmergencyKeyword) {
      explanationParts.push(`Emergency keyword matched in patient report: "${matchedEmergencyKeyword}"`);
    }
    if (isSensorEmergency && symptomText && !matchedEmergencyKeyword) {
      explanationParts.push(`Late sensor spike overridden stable patient text input ("${symptomText}")`);
    }

    return {
      decision: 'Emergency',
      explanation: `Escalated to Emergency: ${explanationParts.join('. ')}.`,
      timestamp: new Date().toISOString(),
      gateStatus: 'PASSED'
    };
  }

  // 4. Evaluate Mental Health Triggers
  const mentalHealthKeywords = [
    'suicidal', 'self-harm', 'self harm', 'panic attack',
    'depression', 'anxiety crisis', 'want to die', 'overwhelmed'
  ];

  let matchedMentalHealthKeyword = null;
  if (symptomText) {
    const lowerSymptom = symptomText.toLowerCase();
    for (const kw of mentalHealthKeywords) {
      if (lowerSymptom.includes(kw)) {
        matchedMentalHealthKeyword = kw;
        break;
      }
    }
  }

  if (matchedMentalHealthKeyword) {
    return {
      decision: 'Mental Health',
      explanation: `Flagged for Mental Health Triage: Patient text indicated psychological distress keyword ("${matchedMentalHealthKeyword}"). Vital signs remain within non-emergency baseline (SpO2=${spo2 ?? 'normal'}, HR=${hr ?? 'normal'}).`,
      timestamp: new Date().toISOString(),
      gateStatus: 'PASSED'
    };
  }

  // 5. General Triage (Default when no emergency or mental health indicators exist)
  return {
    decision: 'General',
    explanation: `Assigned to General Triage: Patient reported symptoms ("${symptomText || 'routine check'}") with vital signs in normal ranges (SpO2=${spo2 ?? 'N/A'}%, HR=${hr ?? 'N/A'} bpm). No emergency or mental health flags detected.`,
    timestamp: new Date().toISOString(),
    gateStatus: 'PASSED'
  };
}
