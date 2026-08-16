/**
 * Audit Trail utility for creating structured, timestamped audit entries.
 */

export function createAuditEntry({ action, reason, details = {}, timestamp = new Date().toISOString() }) {
  return {
    audit_id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp,
    action,
    reason,
    details
  };
}

export function formatAuditLogSummary(entry) {
  const time = entry.timestamp ? new Date(entry.timestamp).toISOString() : new Date().toISOString();
  return `[${time}] [${entry.action.toUpperCase()}] ${entry.reason}`;
}
