import express from 'express';
import { sessionStore } from '../store/sessionStore.js';
import { evaluateFinalTriage } from '../engine/triageEngine.js';

const router = express.Router();

/**
 * POST /triage
 * Body: { session_id } or { patient_id }
 */
router.post('/', (req, res) => {
  try {
    const { session_id, patient_id } = req.body;

    let targetSessionId = session_id;

    if (!targetSessionId && patient_id) {
      // Find session by patient_id
      for (const [sId, state] of sessionStore.sessions.entries()) {
        if (state.patient_id === patient_id) {
          targetSessionId = sId;
          break;
        }
      }
    }

    if (!targetSessionId) {
      return res.status(404).json({ error: 'Session not found for provided session_id or patient_id' });
    }

    const sessionState = sessionStore.getSession(targetSessionId);
    const fullResponse = evaluateFinalTriage(sessionState);

    return res.status(200).json(fullResponse);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to evaluate triage', details: error.message });
  }
});

export default router;
