import express from 'express';
import { sessionStore } from '../store/sessionStore.js';
import { processEvent } from '../engine/triageEngine.js';

const router = express.Router();

/**
 * POST /events
 * Body: { event_id?, source, timestamp, data, patient_id?, session_id }
 */
router.post('/', (req, res) => {
  try {
    const { session_id, source, timestamp, data } = req.body;

    if (!session_id) {
      return res.status(400).json({ error: 'Missing required field: session_id' });
    }
    if (!source || !['audio', 'text', 'sensor'].includes(source)) {
      return res.status(400).json({ error: 'Invalid or missing field: source must be audio, text, or sensor' });
    }

    const eventTimestamp = timestamp || new Date().toISOString();
    const event = {
      event_id: req.body.event_id,
      source,
      timestamp: eventTimestamp,
      data: data ?? '',
      patient_id: req.body.patient_id || null,
      session_id
    };

    const sessionState = sessionStore.getSession(session_id);
    const result = processEvent(event, sessionState);
    sessionStore.saveSession(sessionState);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to process event', details: error.message });
  }
});

export default router;
