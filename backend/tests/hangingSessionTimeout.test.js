import { processEvent, evaluateFinalTriage } from '../src/engine/triageEngine.js';

describe('Hanging Session Timeout Handling', () => {
  it('should flag session as Pending - Incomplete Data (Timeout) if session sits idle past 5 minutes without sensor data', () => {
    const state = {
      session_id: 's_timeout',
      patient_id: 'P-5555',
      identity: { name: 'Bob Vance', phone: '5559990000', matchScore: 1.0, resolved: true },
      latest_symptom: null,
      latest_telemetry: { heart_rate: null, spo2: null, timestamp: null },
      events: [],
      processedEventIds: new Set(),
      auditTrail: [],
      lastActivityTimestamp: '2026-08-16T10:00:00Z'
    };

    const textEvent = {
      event_id: 'evt_t1',
      source: 'text',
      timestamp: '2026-08-16T10:00:00Z',
      data: 'Chest tightness and shortness of breath'
    };

    processEvent(textEvent, state);

    // Evaluate 10 minutes later (past 5 min timeout threshold)
    const futureTime = new Date('2026-08-16T10:10:00Z');
    const result = evaluateFinalTriage(state, futureTime);

    expect(result.decision).toBe('Pending - Incomplete Data (Timeout)');
    expect(result.explanation).toContain('Session timed out after 5 minutes');
  });
});
