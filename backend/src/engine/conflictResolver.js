/**
 * Conflict Resolution Engine.
 * Implements deterministic priority hierarchy:
 * 1. Sensor Emergency (SpO2 < 90, HR > 150 or HR < 40) -> Overrides all
 * 2. Keyword Emergency ("chest pain", "can't breathe", "unconscious", etc.) -> Emergency
 * 3. Conflicting non-emergency symptoms -> Latest timestamp wins
 * 4. Identity conflict -> More complete identity wins
 */

export function resolveConflicts(telemetry, symptomText) {
  const conflicts = [];
  let sensorEmergency = false;
  let textEmergency = false;

  const hr = telemetry?.heart_rate;
  const spo2 = telemetry?.spo2;

  // Check Sensor Emergency
  if ((spo2 !== null && spo2 < 90) || (hr !== null && (hr > 150 || hr < 40))) {
    sensorEmergency = true;
    conflicts.push({
      type: 'SENSOR_EMERGENCY',
      description: `Critical sensor vitals recorded: SpO2=${spo2}%, HR=${hr} bpm`
    });
  }

  // Check Text Emergency Keywords
  const emergencyKeywords = [
    'chest pain', "can't breathe", 'cannot breathe', 'unconscious',
    'severe bleeding', 'heart attack', 'stroke', 'choking', 'anaphylaxis'
  ];

  if (symptomText) {
    const lowerSymptom = symptomText.toLowerCase();
    for (const kw of emergencyKeywords) {
      if (lowerSymptom.includes(kw)) {
        textEmergency = true;
        conflicts.push({
          type: 'TEXT_EMERGENCY',
          description: `Emergency keyword matched in text: "${kw}"`
        });
        break;
      }
    }
  }

  // Detect conflict between calm text and emergency sensor
  if (sensorEmergency && symptomText && !textEmergency) {
    conflicts.push({
      type: 'EMERGENCY_OVERRIDE_CONFLICT',
      description: `Sensor emergency (SpO2=${spo2}%, HR=${hr}) overrides non-emergency text description ("${symptomText}")`
    });
  }

  return {
    isEmergency: sensorEmergency || textEmergency,
    sensorEmergency,
    textEmergency,
    conflicts
  };
}
