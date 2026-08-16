import { reconcileTemporalState } from '../src/engine/temporalReconciler.js';
import { resolveConflicts } from '../src/engine/conflictResolver.js';

describe('Conflict Resolution & Temporal Reconciliation Engine', () => {
  it('should sort out-of-order events by timestamp (latest timestamp wins)', () => {
    const events = [
      { event_id: 'e2', source: 'text', timestamp: '2026-08-16T12:10:00Z', data: 'Feeling much better now' },
      { event_id: 'e1', source: 'text', timestamp: '2026-08-16T12:00:00Z', data: 'Experiencing mild dizziness' }
    ];

    const reconciled = reconcileTemporalState(events);
    expect(reconciled.sortedEvents[0].event_id).toBe('e1');
    expect(reconciled.sortedEvents[1].event_id).toBe('e2');
    expect(reconciled.latestSymptom).toBe('Feeling much better now');
  });

  it('should flag conflict when sensor emergency overrides non-emergency text', () => {
    const telemetry = { heart_rate: 165, spo2: 87, timestamp: '2026-08-16T12:15:00Z' };
    const symptomText = 'I am just having a slight headache';

    const conflicts = resolveConflicts(telemetry, symptomText);
    expect(conflicts.isEmergency).toBe(true);
    expect(conflicts.sensorEmergency).toBe(true);
    expect(conflicts.conflicts.some(c => c.type === 'EMERGENCY_OVERRIDE_CONFLICT')).toBe(true);
  });
});
