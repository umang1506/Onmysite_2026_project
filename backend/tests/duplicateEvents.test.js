import { processEvent } from '../src/engine/triageEngine.js';

describe('Idempotency & Duplicate Event Handling', () => {
  it('should ignore duplicate event_id arrivals without altering state count', () => {
    const state = {
      session_id: 's_dup',
      patient_id: null,
      identity: { name: null, phone: null, matchScore: 0, resolved: false },
      latest_symptom: null,
      latest_telemetry: { heart_rate: null, spo2: null, timestamp: null },
      events: [],
      processedEventIds: new Set(),
      auditTrail: []
    };

    const event = {
      event_id: 'evt_fixed_123',
      source: 'sensor',
      timestamp: '2026-08-16T12:00:00Z',
      data: { heart_rate: 82, spo2: 98 }
    };

    const firstRun = processEvent(event, state);
    expect(firstRun.status).toBe('success');
    expect(state.events.length).toBe(1);

    const secondRun = processEvent(event, state);
    expect(secondRun.status).toBe('ignored');
    expect(secondRun.reason).toBe('duplicate_event_id');
    expect(state.events.length).toBe(1); // Event count did not increase
  });
});
