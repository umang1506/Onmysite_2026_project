import React from 'react';
import { Activity, AlertTriangle, Users, HeartPulse, ShieldCheck, Database, Cpu } from 'lucide-react';

export default function DashboardView({ currentUser, onNavigate }) {
  const userRole = currentUser?.id || 'physician';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
            {userRole === 'physician' && '👨‍⚕️ Emergency Command Dashboard'}
            {userRole === 'nurse' && '👩‍⚕️ Patient Intake & Sensor Stream Overview'}
            {userRole === 'psychiatrist' && '🧠 Mental Health Crisis Triage Dashboard'}
            {userRole === 'admin' && '⚙️ IT System Health & Determinism Governance'}
          </h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
          Real-time clinical intelligence metrics tailored for <strong>{currentUser?.name || 'Dr. Alex Rivera'}</strong> ({currentUser?.role}).
        </p>
      </div>

      {/* Role-tailored metrics cards */}
      {userRole === 'physician' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          <div className="card-panel" style={{ borderLeft: '4px solid #ef4444' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase' }}>Active Emergency Cases</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0' }}>14</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>4 SpO₂ Override events in last hour</div>
          </div>
          <div className="card-panel" style={{ borderLeft: '4px solid #0284c7' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>Direct Admissions</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0' }}>3</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ICU & Cardiac Wards assigned</div>
          </div>
          <div className="card-panel" style={{ borderLeft: '4px solid #a855f7' }}>
            <div style={{ fontSize: '0.75rem', fontWeight 700, color: '#9333ea', textTransform: 'uppercase' }}>Telehealth Intakes</div>
            <div style={{ fontSize: '1.8rem', fontWeight 800, color: '#0f172a', margin: '0.25rem 0' }}>8</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Live video evaluations ready</div>
          </div>
          <div className="card-panel" style={{ borderLeft: '4px solid #22c55e' }}>
            <div style={{ fontSize: '0.75rem', fontWeight 700, color: '#16a34a', textTransform: 'uppercase' }}>System Latency</div>
            <div style={{ fontSize: '1.8rem', fontWeight 800, color: '#0f172a', margin: '0.25rem 0' }}>12ms</div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>● Deterministic Engine Active</div>
          </div>
        </div>
      )}

      {userRole === 'nurse' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          <div className="card-panel" style={{ borderLeft: '4px solid #0284c7' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>Active Intake Streams</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0' }}>128</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Audio & text feeds processing</div>
          </div>
          <div className="card-panel" style={{ borderLeft: '4px solid #10b981' }}>
            <div style={{ fontSize: '0.75rem', fontWeight 700, color: '#16a34a', textTransform: 'uppercase' }}>Connected IoT Sensors</div>
            <div style={{ fontSize: '1.8rem', fontWeight 800, color: '#0f172a', margin: '0.25rem 0' }}>94</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>SpO₂ & Heart rate streaming</div>
          </div>
          <div className="card-panel" style={{ borderLeft: '4px solid #f59e0b' }}>
            <div style={{ fontSize: '0.75rem', fontWeight 700, color: '#d97706', textTransform: 'uppercase' }}>Pending Vitals Ingestion</div>
            <div style={{ fontSize: '1.8rem', fontWeight 800, color: '#0f172a', margin: '0.25rem 0' }}>5</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Awaiting sensor attachment</div>
          </div>
          <div className="card-panel" style={{ borderLeft: '4px solid #6366f1' }}>
            <div style={{ fontSize: '0.75rem', fontWeight 700, color: '#4f46e5', textTransform: 'uppercase' }}>Resolved Identities</div>
            <div style={{ fontSize: '1.8rem', fontWeight 800, color: '#0f172a', margin: '0.25rem 0' }}>96%</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Phone & Levenshtein matched</div>
          </div>
        </div>
      )}

      {userRole === 'psychiatrist' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          <div className="card-panel" style={{ borderLeft: '4px solid #9333ea' }}>
            <div style={{ fontSize: '0.75rem', fontWeight 700, color: '#9333ea', textTransform: 'uppercase' }}>Mental Health Queue</div>
            <div style={{ fontSize: '1.8rem', fontWeight 800, color: '#0f172a', margin: '0.25rem 0' }}>8</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Flagged for crisis evaluation</div>
          </div>
          <div className="card-panel" style={{ borderLeft: '4px solid #ef4444' }}>
            <div style={{ fontSize: '0.75rem', fontWeight 700, color: '#dc2626', textTransform: 'uppercase' }}>High Risk Triggers</div>
            <div style={{ fontSize: '1.8rem', fontWeight 800, color: '#0f172a', margin: '0.25rem 0' }}>3</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Panic attack & self-harm keywords</div>
          </div>
          <div className="card-panel" style={{ borderLeft: '4px solid #0284c7' }}>
            <div style={{ fontSize: '0.75rem', fontWeight 700, color: '#0284c7', textTransform: 'uppercase' }}>Counselor Consults</div>
            <div style={{ fontSize: '1.8rem', fontWeight 800, color: '#0f172a', margin: '0.25rem 0' }}>12</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Assigned to duty psychiatric staff</div>
          </div>
          <div className="card-panel" style={{ borderLeft: '4px solid #22c55e' }}>
            <div style={{ fontSize: '0.75rem', fontWeight 700, color: '#16a34a', textTransform: 'uppercase' }}>Stable Telemetry</div>
            <div style={{ fontSize: '1.8rem', fontWeight 800, color: '#0f172a', margin: '0.25rem 0' }}>100%</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Normal physiological vitals</div>
          </div>
        </div>
      )}

      {userRole === 'admin' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          <div className="card-panel" style={{ borderLeft: '4px solid #16a34a' }}>
            <div style={{ fontSize: '0.75rem', fontWeight 700, color: '#16a34a', textTransform: 'uppercase' }}>Express API Status</div>
            <div style={{ fontSize: '1.8rem', fontWeight 800, color: '#0f172a', margin: '0.25rem 0' }}>99.9%</div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>● localhost:3000 Healthy</div>
          </div>
          <div className="card-panel" style={{ borderLeft: '4px solid #0284c7' }}>
            <div style={{ fontSize: '0.75rem', fontWeight 700, color: '#0284c7', textTransform: 'uppercase' }}>Engine Latency</div>
            <div style={{ fontSize: '1.8rem', fontWeight 800, color: '#0f172a', margin: '0.25rem 0' }}>12ms</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Sub-second evaluation</div>
          </div>
          <div className="card-panel" style={{ borderLeft: '4px solid #a855f7' }}>
            <div style={{ fontSize: '0.75rem', fontWeight 700, color: '#9333ea', textTransform: 'uppercase' }}>Deterministic Replays</div>
            <div style={{ fontSize: '1.8rem', fontWeight 800, color: '#0f172a', margin: '0.25rem 0' }}>100%</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>All 7 fixtures passed</div>
          </div>
          <div className="card-panel" style={{ borderLeft: '4px solid #6366f1' }}>
            <div style={{ fontSize: '0.75rem', fontWeight 700, color: '#4f46e5', textTransform: 'uppercase' }}>Idempotency Gate</div>
            <div style={{ fontSize: '1.8rem', fontWeight 800, color: '#0f172a', margin: '0.25rem 0' }}>Active</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Duplicate events blocked</div>
          </div>
        </div>
      )}

      {/* Role Action Banner */}
      <div className="card-panel" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Clinical Intelligence Triage Gateway</h3>
          <p style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '0.25rem' }}>
            Log in as <strong>{currentUser?.name}</strong> ({currentUser?.role}). Current workspace permissions enabled.
          </p>
        </div>
        {userRole !== 'admin' && (
          <button className="btn-new-session" style={{ background: '#ffffff', color: '#0284c7', margin: 0 }} onClick={() => onNavigate('triage-feed')}>
            Open Triage Feed →
          </button>
        )}
      </div>
    </div>
  );
}
