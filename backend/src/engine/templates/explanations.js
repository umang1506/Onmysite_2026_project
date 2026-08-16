export const templates = {
  EMERGENCY_SENSOR_OVERRIDE: (ctx) =>
    `Escalated to Emergency: SpO2 level (${ctx.spo2}%) overrode stable text input ('${ctx.symptomText}') at ${ctx.sensorTimestamp}.`,

  EMERGENCY_KEYWORD: (ctx) =>
    `Escalated to Emergency: life-threatening keyword '${ctx.matchedKeyword}' detected in ${ctx.source} input.`,

  MENTAL_HEALTH: (ctx) =>
    `Routed to Mental Health: crisis indicator '${ctx.matchedKeyword}' in text input; vitals stable (HR ${ctx.hr ?? 'N/A'}, SpO2 ${ctx.spo2 ?? 'N/A'}%).`,

  GENERAL: (ctx) =>
    `Assigned General: symptoms ('${ctx.symptomText || 'none reported'}') with stable vitals (HR ${ctx.hr ?? 'N/A'}, SpO2 ${ctx.spo2 ?? 'N/A'}%). No emergency indicators.`,

  PENDING_INCOMPLETE: (ctx) =>
    `Pending - Incomplete Data: received ${ctx.receivedSources.join(', ')} but missing ${ctx.missingSources.join(', ')} after ${ctx.elapsedMinutes} min. Device may be disconnected.`,

  CONFLICT_RESOLVED: (ctx) =>
    `Conflict resolved: ${ctx.winningSource} (${ctx.winningTimestamp}) prioritized over ${ctx.losingSource} for ${ctx.field}.`,

  IDENTITY_RESOLVED: (ctx) =>
    `Identity resolved: patient_id '${ctx.patientId}' selected (completeness score ${ctx.score}) over '${ctx.rejectedId}'.`
};

export function buildExplanation(templateKey, ctx) {
  const fn = templates[templateKey];
  return fn ? fn(ctx) : 'Decision computed by triage engine.';
}
