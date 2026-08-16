import { resolveIdentity } from '../src/engine/identityResolver.js';

describe('Identity Resolution Engine', () => {
  it('should match exact patient_id with score 1.0', () => {
    const currentState = {
      session_id: 's1',
      patient_id: 'P-1001',
      identity: { name: 'John Doe', phone: '5551234567', matchScore: 1.0, resolved: true },
      latest_symptom: null
    };

    const event = {
      event_id: 'e1',
      source: 'text',
      patient_id: 'P-1001',
      data: { phone: '555-123-4567', name: 'John Doe' }
    };

    const res = resolveIdentity(event, currentState);
    expect(res.patient_id).toBe('P-1001');
    expect(res.identity.matchScore).toBe(1.0);
    expect(res.identity.resolved).toBe(true);
  });

  it('should resolve partial phone match and Levenshtein name match', () => {
    const currentState = {
      session_id: 's2',
      patient_id: null,
      identity: { name: 'Jonathan Smith', phone: '15559876543', matchScore: 0.0, resolved: false },
      latest_symptom: null
    };

    const event = {
      event_id: 'e2',
      source: 'audio',
      data: { name: 'Jonathon Smith', phone: '(555) 987-6543' }
    };

    const res = resolveIdentity(event, currentState);
    expect(res.identity.matchScore).toBeGreaterThanOrEqual(0.6);
    expect(res.identity.resolved).toBe(true);
  });
});
