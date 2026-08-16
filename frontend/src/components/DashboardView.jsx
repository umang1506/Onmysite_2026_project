import React from 'react';

export default function DashboardView({ onNavigate }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>Dashboard Overview</h2>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
          Real-time metrics across Emergency Department intake and triage streams.
        </p>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <div className="card-panel" style={{ borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase' }}>Active Emergency Cases</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0' }}>14</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>4 Override events in last hour</div>
        </div>

        <div className="card-panel" style={{ borderLeft: '4px solid #0284c7' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>Total Active Streams</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0' }}>128</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Multimodal feeds stable</div>
        </div>

        <div className="card-panel" style={{ borderLeft: '4px solid #a855f7' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9333ea', textTransform: 'uppercase' }}>Mental Health Triage</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0' }}>8</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Specialized queue assigned</div>
        </div>

        <div className="card-panel" style={{ borderLeft: '4px solid #22c55e' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase' }}>System Latency</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0' }}>12ms</div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>● 100% Deterministic Engine</div>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="card-panel" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Clinical Intelligence Triage Gateway</h3>
          <p style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '0.25rem' }}>
            Live Stream Feed is currently active for session <strong>#8842</strong>. View real-time temporal reconciliation and sensor overrides.
          </p>
        </div>
        <button className="btn-new-session" style={{ background: '#ffffff', color: '#0284c7', margin: 0 }} onClick={() => onNavigate('triage-feed')}>
          Open Triage Feed →
        </button>
      </div>
    </div>
  );
}
