/**
 * In-memory Store for Patient Sessions.
 * Keeps track of session states, processed event IDs, state machine transitions, and audit history.
 */

class SessionStore {
  constructor() {
    this.sessions = new Map();
  }

  createInitialState(sessionId) {
    return {
      session_id: sessionId,
      patient_id: null,
      intakeState: 'GREETING', // States: GREETING -> SYMPTOM_COLLECTION -> AWAITING_VITALS -> TRIAGE_READY -> TRIAGE_COMPLETED
      identity: {
        name: null,
        phone: null,
        matchScore: 0.0,
        resolved: false
      },
      latest_symptom: null,
      normalized_symptom: null,
      symptomChart: [],
      latest_telemetry: {
        heart_rate: null,
        spo2: null,
        timestamp: null
      },
      triageDecision: null,
      holdingGateStatus: null,
      fallbackPrompt: null,
      clarificationPrompt: null,
      handoffConfirmation: null,
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
