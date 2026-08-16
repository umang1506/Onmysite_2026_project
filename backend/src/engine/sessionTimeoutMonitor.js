import { SESSION_TIMEOUT_MS } from '../config.js';
import { buildExplanation } from './templates/explanations.js';
import { hasTextOrAudio, hasSensor, checkTextConfirmation } from './triageRules.js';

export function checkSessionTimeout(session, now = new Date()) {
  if (!session.firstEventTimestamp) return null;

  const hasText = hasTextOrAudio(session);
  const hasTel = hasSensor(session);
  const confirmed = checkTextConfirmation(session);

  if (hasText && !hasTel && !confirmed) {
    const elapsed = now - new Date(session.firstEventTimestamp);
    if (elapsed > SESSION_TIMEOUT_MS) {
      const receivedSources = session.events.map((e) => e.source).filter((v, i, a) => a.indexOf(v) === i);
      const ctx = {
        receivedSources: receivedSources.length ? receivedSources : ['none'],
        missingSources: ['sensor or text confirmation'],
        elapsedMinutes: Math.floor(elapsed / 60000)
      };
      return {
        decision: 'Pending - Incomplete Data',
        explanation: buildExplanation('PENDING_INCOMPLETE', ctx),
        completionStatus: 'timed_out',
        missingInputs: ['sensor']
      };
    }
    session.completionStatus = 'pending';
    session.missingInputs = ['sensor'];
  }
  return null;
}
