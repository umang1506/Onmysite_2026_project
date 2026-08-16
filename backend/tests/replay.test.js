import { processEvent, evaluateFinalTriage } from '../src/engine/triageEngine.js';

describe('Event Replay Determinism', () => {
  it('should produce 100% identical outputs when replaying the same sequence of events twice', () => {
    const fixtureEvents = [
      { event_id: 'e1', source: 'text', timestamp: '2026-08-16T10:00:00Z', data: 'Experiencing sudden chest pain' },
      { event_id: 'e2', source: 'sensor', timestamp: '2026-08-16T10:01:00Z', data: { heart_rate: 140, spo2: 95 } }
    ];

    function runPass() {
      const state = {
        session_id: 's_replay',
        patient_id: null,
        identity: { name: null, phone: null, matchScore: 0, resolved: false },
        latest_symptom: null,
        latest_telemetry: { heart_rate: null, spo2: null, timestamp: null },
        events: [],
        processedEventIds: new Set(),
        auditTrail: []
      };

      for (const ev of fixtureEvents) {
        processEvent(ev, state);
      }
      return evaluateFinalTriage(state);
    }

    const run1 = runPass();
    const run2 = runPass();

    expect(run1.decision).toBe(run2.decision);
    expect(run1.explanation).toBe(run2.explanation);
    expect(run1.patient_id).toBe(run2.patient_id);
  });
});
