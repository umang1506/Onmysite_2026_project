/**
 * In-memory Store for Patient Sessions.
 * Keeps track of session states, processed event IDs (for idempotency), and audit history.
 */

class SessionStore {
  constructor() {
    this.sessions = new Map();
  }

  createInitialState(sessionId) {
    return {
      session_id: sessionId,
      patient_id: null,
      identity: {
        name: null,
        phone: null,
        matchScore: 0.0,
        resolved: false
      },
      latest_symptom: null,
      latest_telemetry: {
        heart_rate: null,
        spo2: null,
        timestamp: null
      },
      triageDecision: null,
      events: [],
      processedEventIds: new Set(),
      auditTrail: [],
      lastActivityTimestamp: null
    };
  }

  getSession(sessionId) {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, this.createInitialState(sessionId));
    }
    return this.sessions.get(sessionId);
  }

  saveSession(sessionState) {
    this.sessions.set(sessionState.session_id, sessionState);
    return sessionState;
  }

  resetSession(sessionId) {
    const freshState = this.createInitialState(sessionId);
    this.sessions.set(sessionId, freshState);
    return freshState;
  }

  clearAll() {
    this.sessions.clear();
  }
}

export const sessionStore = new SessionStore();
