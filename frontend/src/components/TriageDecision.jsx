import React from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, Clock, FileText } from 'lucide-react';

export default function TriageDecision({ triageData }) {
  if (!triageData) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <ShieldAlert size={20} color="#6366f1" /> Triage Decision Gate
          </h3>
        </div>
        <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '2rem' }}>
          Awaiting event evaluation...
        </p>
      </div>
    );
  }

  const { decision, explanation, timestamp, audit_trail } = triageData;

  const getDecisionBadge = (dec) => {
    if (!dec) return <span className="badge badge-pending">PENDING</span>;
    if (dec.includes('Emergency')) return <span className="badge badge-emergency">🚨 EMERGENCY</span>;
    if (dec.includes('Mental')) return <span className="badge badge-mental">💜 MENTAL HEALTH</span>;
    if (dec.includes('General')) return <span className="badge badge-general">✅ GENERAL</span>;
    return <span className="badge badge-pending">⏳ {dec.toUpperCase()}</span>;
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <ShieldAlert size={20} color="#6366f1" /> Triage Decision & Explanation
        </h3>
        {getDecisionBadge(decision)}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>
          Status: {decision || 'Pending Evaluation'}
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid var(--primary)' }}>
          {explanation || 'No decision evaluated yet.'}
        </p>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          Timestamp: {timestamp ? new Date(timestamp).toLocaleString() : 'N/A'}
        </span>
      </div>

      <div style={{ marginTop: '0.5rem' }}>
        <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <FileText size={14} /> Audit Trail History ({audit_trail?.length || 0})
        </h4>
        <div className="audit-trail">
          {audit_trail && audit_trail.length > 0 ? (
            audit_trail.map((aud, i) => (
              <div key={aud.audit_id || i} style={{ color: aud.action === 'ignored' ? '#f87171' : '#a7f3d0' }}>
                [{new Date(aud.timestamp).toLocaleTimeString()}] [{aud.action.toUpperCase()}] {aud.reason}
              </div>
            ))
          ) : (
            <div style={{ color: 'var(--text-dim)' }}>No audit logs recorded yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
