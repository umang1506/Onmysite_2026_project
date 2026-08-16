import React from 'react';
import { UserCheck, HeartPulse, Stethoscope, Phone } from 'lucide-react';

export default function PatientStatePanel({ sessionState }) {
  if (!sessionState) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <UserCheck size={20} color="#6366f1" /> Resolved Patient State
          </h3>
        </div>
        <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '2rem' }}>
          Select session to view resolved identity and state.
        </p>
      </div>
    );
  }

  const { patient_id, identity = {}, latest_symptom, latest_telemetry = {} } = sessionState;

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <UserCheck size={20} color="#6366f1" /> Patient State & Identity
        </h3>
        <span style={{ fontSize: '0.8rem', color: identity.resolved ? 'var(--emerald)' : 'var(--amber)' }}>
          {identity.resolved ? '✓ Identity Resolved' : '⚠ Partial Match'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Patient ID</span>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {patient_id || 'Unassigned'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Match Score: <strong>{((identity.matchScore || 0) * 100).toFixed(0)}%</strong>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Demographics</span>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
            {identity.name || 'Anonymous'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
            <Phone size={12} /> {identity.phone || 'No phone'}
          </div>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Stethoscope size={16} color="#818cf8" /> Latest Symptom Report
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {latest_symptom ? `"${latest_symptom}"` : 'No text/audio symptom recorded yet.'}
        </p>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <HeartPulse size={16} color="#38bdf8" /> Latest Sensor Telemetry
        </div>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem' }}>
          <div>SpO₂: <strong style={{ color: latest_telemetry.spo2 < 90 ? 'var(--rose)' : 'var(--emerald)' }}>{latest_telemetry.spo2 ?? 'N/A'}%</strong></div>
          <div>HR: <strong style={{ color: (latest_telemetry.heart_rate > 150 || latest_telemetry.heart_rate < 40) ? 'var(--rose)' : 'var(--emerald)' }}>{latest_telemetry.heart_rate ?? 'N/A'} bpm</strong></div>
        </div>
      </div>
    </div>
  );
}
