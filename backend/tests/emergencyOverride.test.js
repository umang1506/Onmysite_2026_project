import { processEvent, evaluateFinalTriage } from '../src/engine/triageEngine.js';

describe('Emergency Override Triage Rules', () => {
  it('should trigger Emergency decision when SpO2 < 90 even if text says mild symptoms', () => {
    const state = {
      session_id: 's_emerg',
      patient_id: 'P-9999',
      identity: { name: 'Alice Smith', phone: '5550001111', matchScore: 1.0, resolved: true },
      latest_symptom: null,
      latest_telemetry: { heart_rate: null, spo2: null, timestamp: null },
      events: [],
      processedEventIds: new Set(),
      auditTrail: []
    };

    const textEvent = {
      event_id: 'evt_text_1',
      source: 'text',
      timestamp: '2026-08-16T12:00:00Z',
      data: 'Feeling a little fatigued'
    };

    const sensorEvent = {
      event_id: 'evt_sensor_1',
      source: 'sensor',
      timestamp: '2026-08-16T12:05:00Z',
      data: { heart_rate: 110, spo2: 85 } // Critical SpO2 < 90
    };

    processEvent(textEvent, state);
    processEvent(sensorEvent, state);

    const triage = evaluateFinalTriage(state);
    expect(triage.decision).toBe('Emergency');
    expect(triage.explanation).toContain('SpO2=85%');
  });
});
