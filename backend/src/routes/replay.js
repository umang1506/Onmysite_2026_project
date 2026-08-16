import express from 'express';
import { processEvent, evaluateFinalTriage } from '../engine/triageEngine.js';

const router = express.Router();

/**
 * POST /replay
 * Body: { events: [...] } or array of events [...]
 * Evaluates events in an isolated transient session state to ensure exact determinism and repeatability.
 */
router.post('/', (req, res) => {
  try {
    const events = Array.isArray(req.body) ? req.body : req.body.events;

    if (!events || !Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: 'Request body must contain non-empty events array' });
    }

    const replaySessionId = `replay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Create fresh isolated session state
    const transientState = {
      session_id: replaySessionId,
      patient_id: null,
      identity: { name: null, phone: null, matchScore: 0.0, resolved: false },
      latest_symptom: null,
      latest_telemetry: { heart_rate: null, spo2: null, timestamp: null },
      triageDecision: null,
      events: [],
      processedEventIds: new Set(),
      auditTrail: [],
      lastActivityTimestamp: null
    };

    for (const event of events) {
      processEvent(event, transientState);
    }

    const finalResult = evaluateFinalTriage(transientState);

    return res.status(200).json({
      status: 'replay_complete',
      total_events_processed: events.length,
      final_state: finalResult
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to replay events', details: error.message });
  }
});

export default router;
