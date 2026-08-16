/**
 * Temporal Reconciliation Engine.
 * Sorts events strictly by timestamp (not arrival order) and handles late-arriving vitals/overrides.
 */

export function reconcileTemporalState(allEvents) {
  // Sort events strictly by ISO timestamp ascending
  const sortedEvents = [...allEvents].sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    if (timeA !== timeB) return timeA - timeB;
    return (a.event_id || '').localeCompare(b.event_id || '');
  });

  let latestSymptom = null;
  let latestSymptomTimestamp = null;

  let latestTelemetry = {
    heart_rate: null,
    spo2: null,
    timestamp: null
  };

  for (const event of sortedEvents) {
    const eventTime = new Date(event.timestamp).getTime();
    const eventData = typeof event.data === 'object' ? event.data : { text: String(event.data) };

    // Update symptoms if text/audio event is latest
    if (event.source === 'text' || event.source === 'audio') {
      const textContent = eventData.symptoms || eventData.text || (typeof event.data === 'string' ? event.data : '');
      if (textContent && (!latestSymptomTimestamp || eventTime >= latestSymptomTimestamp)) {
        latestSymptom = textContent;
        latestSymptomTimestamp = eventTime;
      }
    }

    // Update telemetry if sensor event is latest
    if (event.source === 'sensor') {
      const hr = eventData.heart_rate ?? eventData.hr;
      const spo2 = eventData.spo2 ?? eventData.SpO2;

      if (hr !== undefined && hr !== null) {
        latestTelemetry.heart_rate = Number(hr);
      }
      if (spo2 !== undefined && spo2 !== null) {
        latestTelemetry.spo2 = Number(spo2);
      }
      if (!latestTelemetry.timestamp || eventTime >= new Date(latestTelemetry.timestamp).getTime()) {
        latestTelemetry.timestamp = event.timestamp;
      }
    }
  }

  return {
    sortedEvents,
    latestSymptom,
    latestTelemetry
  };
}
