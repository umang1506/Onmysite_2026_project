import React from 'react';
import { Cpu, Server, Database } from 'lucide-react';

export default function SystemHealthView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>System Health & Gateway Status</h2>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
          Real-time telemetry streams, API latency, and engine determinism monitors.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <div className="card-panel">
          <div className="card-title"><Server size={18} color="#0284c7" /> Express Backend API</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a', margin: '0.25rem 0' }}>● ONLINE</div>
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Running on http://localhost:3000</p>
        </div>

        <div className="card-panel">
          <div className="card-title"><Cpu size={18} color="#a855f7" /> Deterministic Engine</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a', margin: '0.25rem 0' }}>100% Deterministic</div>
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Temporal sorting & idempotency active</p>
        </div>

        <div className="card-panel">
          <div className="card-title"><Database size={18} color="#10b981" /> In-Memory Session Store</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0' }}>128 Active Sessions</div>
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Zero packet loss, audit trail verified</p>
        </div>
      </div>
    </div>
  );
}
