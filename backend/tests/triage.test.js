import { resetStore } from '../src/store/sessionStore.js';
import { ingestEvent, getTriageDecision, replayEvents } from '../src/engine/triageEngine.js';
import { resolveIdentity } from '../src/engine/identityResolver.js';
import { SESSION_TIMEOUT_MS } from '../src/config.js';

beforeEach(() => resetStore());

describe('Identity resolution', () => {
  test('partial phone match links patient_id', () => {
    ingestEvent({
      event_id: 'e1', source: 'text', timestamp: '2026-08-16T10:00:00+05:30',
      data: { text: 'bukhar', name: 'Ramesh', phone: '+91-8765432109' },
      session_id: 's1'
    });
    ingestEvent({
      event_id: 'e2', source: 'audio', timestamp: '2026-08-16T10:02:00+05:30',
      data: { transcript: 'Ramesh Kumar', phone: '8765432109' },
      patient_id: 'PAT-IN-2045', session_id: 's1'
    });
    const d = getTriageDecision('s1');
    expect(d.patient_id).toBe('PAT-IN-2045');
  });

  test('weighted match score prefers complete identity', () => {
    const session = { patient_id: 'A', identity: { name: 'X', phone: null, matchScore: 0.5 } };
    const result = resolveIdentity(session, {
      patient_id: 'B',
      data: { name: 'Priya Sharma', phone: '+91-9876543210' }
    });
    expect(result.patient_id).toBe('B');
  });
});

describe('Conflict resolution', () => {
  test('late sensor SpO2 override triggers Emergency', () => {
    ingestEvent({ event_id: 'a', source: 'text', timestamp: '2026-08-16T09:58:00+05:30', data: { text: 'halka sar dard' }, patient_id: 'P1', session_id: 's2' });
    ingestEvent({ event_id: 'b', source: 'sensor', timestamp: '2026-08-16T09:59:00+05:30', data: { heart_rate: 78, spo2: 97 }, patient_id: 'P1', session_id: 's2' });
    ingestEvent({ event_id: 'c', source: 'sensor', timestamp: '2026-08-16T10:05:00+05:30', data: { heart_rate: 110, spo2: 88 }, patient_id: 'P1', session_id: 's2' });
    const d = getTriageDecision('s2');
    expect(d.decision).toBe('Emergency');
    expect(d.explanation).toContain('88');
  });
});

describe('Replay determinism', () => {
  test('same events produce identical output', () => {
    const events = [
      { event_id: 'r1', source: 'text', timestamp: '2026-08-16T10:00:00+05:30', data: { text: 'confirm symptoms' }, patient_id: 'P1', session_id: 'sr' },
      { event_id: 'r2', source: 'sensor', timestamp: '2026-08-16T10:01:00+05:30', data: { heart_rate: 80, spo2: 97 }, patient_id: 'P1', session_id: 'sr' }
    ];
    const d1 = replayEvents(events);
    const d2 = replayEvents(events);
    expect(d1.decision).toBe(d2.decision);
    expect(d1.explanation).toBe(d2.explanation);
  });
});

describe('Duplicate events', () => {
  test('duplicate event_id is ignored', () => {
    const ev = { event_id: 'dup-1', source: 'text', timestamp: '2026-08-16T10:00:00+05:30', data: { text: 'pet dard' }, patient_id: 'P1', session_id: 'sd' };
    ingestEvent(ev);
    ingestEvent(ev);
    ingestEvent({ event_id: 's1', source: 'sensor', timestamp: '2026-08-16T10:01:00+05:30', data: { heart_rate: 76, spo2: 98 }, patient_id: 'P1', session_id: 'sd' });
    const d = getTriageDecision('sd');
    const ignored = d.audit_trail.filter((a) => a.action === 'ignored');
    expect(ignored.length).toBe(1);
  });
});

describe('Emergency override', () => {
  test('sensor emergency beats calm text', () => {
    ingestEvent({ event_id: 'x1', source: 'text', timestamp: '2026-08-16T10:00:00+05:30', data: { text: 'mild headache' }, patient_id: 'P1', session_id: 'se' });
    ingestEvent({ event_id: 'x2', source: 'sensor', timestamp: '2026-08-16T10:01:00+05:30', data: { heart_rate: 80, spo2: 97 }, patient_id: 'P1', session_id: 'se' });
    ingestEvent({ event_id: 'x3', source: 'sensor', timestamp: '2026-08-16T10:02:00+05:30', data: { heart_rate: 130, spo2: 87 }, patient_id: 'P1', session_id: 'se' });
    const d = getTriageDecision('se');
    expect(d.decision).toBe('Emergency');
    expect(d.explanation).toMatch(/SpO2|SpO2 level \(87%\)/);
  });
});

describe('Hanging session timeout', () => {
  test('flags Pending after timeout without sensor', () => {
    ingestEvent({
      event_id: 'h1', source: 'text', timestamp: '2026-08-16T07:00:00+05:30',
      data: { text: 'chakkar aa rahe hain' }, patient_id: 'PAT-IN-8800', session_id: 'sh'
    });
    const future = new Date(new Date('2026-08-16T07:00:00+05:30').getTime() + SESSION_TIMEOUT_MS + 1000);
    const d = getTriageDecision('sh', future);
    expect(d.decision).toBe('Pending - Incomplete Data');
    expect(d.explanation).toContain('sensor');
  });
});

describe('Mental health triage', () => {
  test('routes crisis keywords to Mental Health', () => {
    ingestEvent({ event_id: 'm1', source: 'text', timestamp: '2026-08-16T16:20:00+05:30', data: { text: "I don't want to live anymore" }, patient_id: 'P1', session_id: 'sm' });
    ingestEvent({ event_id: 'm2', source: 'sensor', timestamp: '2026-08-16T16:22:00+05:30', data: { heart_rate: 72, spo2: 98 }, patient_id: 'P1', session_id: 'sm' });
    const d = getTriageDecision('sm');
    expect(d.decision).toBe('Mental Health');
  });
});
