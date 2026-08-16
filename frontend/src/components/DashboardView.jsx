import React from 'react';
import { Activity, AlertTriangle, Users, HeartPulse, ShieldCheck, Database, Cpu, ArrowUpRight, ArrowDownRight, Clock, Plus, Video, Radio } from 'lucide-react';

export default function DashboardView({ currentUser, onNavigate }) {
  const userRole = currentUser?.id || 'physician';

  // Live recent high-priority patient feed for dashboard table
  const recentAlerts = [
    { id: '#8842', name: 'John Doe', age: '45M', spo2: 88, hr: 112, decision: 'EMERGENCY', level: 'LEVEL 1', reason: 'SpO2 < 90% Override', time: '10:42 AM' },
    { id: '#8840', name: 'Aarav Patel', age: '33M', spo2: 99, hr: 88, decision: 'MENTAL HEALTH', level: 'MH-URGENT', reason: 'Panic Attack Keyword', time: '12:45 PM' },
    { id: '#8841', name: 'Sarah Smith', age: '28F', spo2: 97, hr: 78, decision: 'GENERAL', level: 'LEVEL 4', reason: 'Dizziness evaluation', time: '12:12 PM' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Welcome Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0284c7 100%)',
        borderRadius: '16px',
        padding: '1.75rem 2rem',
        color: '#ffffff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 10px 25px rgba(2, 132, 199, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ● LIVE GATEWAY ACTIVE
            </span>
            <span style={{ fontSize: '0.8rem', color: '#93c5fd' }}>Unit 7-B Emergency Center</span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
            Welcome back, {currentUser?.name || 'Dr. Alex Rivera'}
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '0.35rem', maxWidth: '600px' }}>
            Deterministic Triage Engine running at <strong>12ms latency</strong>. 4 SpO₂ overrides recorded in the last hour.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', zIndex: 2 }}>
          {userRole !== 'admin' && (
            <button
              className="btn-new-session"
              style={{ background: '#ffffff', color: '#0284c7', fontWeight: 700, padding: '0.75rem 1.25rem', margin: 0, borderRadius: '10px' }}
              onClick={() => onNavigate('triage-feed')}
            >
              Open Live Triage Feed →
            </button>
          )}
        </div>
      </div>

      {/* Role-tailored metrics grid */}
      {userRole === 'physician' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
          <div className="card-panel" style={{ borderLeft: '4px solid #ef4444', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Emergency Cases</span>
              <AlertTriangle size={18} color="#ef4444" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0 0.1rem 0' }}>14</div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <ArrowUpRight size={14} /> +12% from last shift (4 Overrides)
            </div>
          </div>

          <div className="card-panel" style={{ borderLeft: '4px solid #0284c7', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Direct Admissions</span>
              <Users size={18} color="#0284c7" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0 0.1rem 0' }}>3</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ICU & Cardiac Wards assigned</div>
          </div>

          <div className="card-panel" style={{ borderLeft: '4px solid #9333ea', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9333ea', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Telehealth Video Calls</span>
              <Video size={18} color="#9333ea" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0 0.1rem 0' }}>8</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Live remote consultations ready</div>
          </div>

          <div className="card-panel" style={{ borderLeft: '4px solid #16a34a', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Engine Latency</span>
              <Activity size={18} color="#16a34a" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0 0.1rem 0' }}>12ms</div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>● Deterministic Engine Active</div>
          </div>
        </div>
      )}

      {userRole === 'nurse' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
          <div className="card-panel" style={{ borderLeft: '4px solid #0284c7' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>Active Intake Streams</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0 0.1rem 0' }}>128</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Audio & text feeds processing</div>
          </div>
          <div className="card-panel" style={{ borderLeft: '4px solid #10b981' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase' }}>Connected IoT Sensors</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0 0.1rem 0' }}>94</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>SpO₂ & Heart rate streaming</div>
          </div>
          <div className="card-panel" style={{ borderLeft: '4px solid #f59e0b' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase' }}>Pending Vitals Ingestion</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0 0.1rem 0' }}>5</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Awaiting sensor attachment</div>
          </div>
          <div className="card-panel" style={{ borderLeft: '4px solid #6366f1' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase' }}>Resolved Identities</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0 0.1rem 0' }}>96%</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Phone & Levenshtein matched</div>
          </div>
        </div>
      )}

      {userRole === 'psychiatrist' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
          <div className="card-panel" style={{ borderLeft: '4px solid #9333ea' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9333ea', textTransform: 'uppercase' }}>Mental Health Queue</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0 0.1rem 0' }}>8</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Flagged for crisis evaluation</div>
          </div>
          <div className="card-panel" style={{ borderLeft: '4px solid #ef4444' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase' }}>High Risk Triggers</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0 0.1rem 0' }}>3</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Panic attack & anxiety keywords</div>
          </div>
          <div className="card-panel" style={{ borderLeft: '4px solid #0284c7' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>Counselor Consults</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0 0.1rem 0' }}>12</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Assigned to duty psychiatric staff</div>
          </div>
          <div className="card-panel" style={{ borderLeft: '4px solid #16a34a' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase' }}>Stable Telemetry</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0 0.1rem 0' }}>100%</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Normal physiological vitals</div>
          </div>
        </div>
      )}

      {userRole === 'admin' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
          <div className="card-panel" style={{ borderLeft: '4px solid #16a34a' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase' }}>Express API Status</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0 0.1rem 0' }}>99.9%</div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>● localhost:3000 Healthy</div>
          </div>
          <div className="card-panel" style={{ borderLeft: '4px solid #0284c7' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>Engine Latency</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0 0.1rem 0' }}>12ms</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Sub-second evaluation</div>
          </div>
          <div className="card-panel" style={{ borderLeft: '4px solid #a855f7' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9333ea', textTransform: 'uppercase' }}>Deterministic Replays</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0 0.1rem 0' }}>100%</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>All 7 fixtures passed</div>
          </div>
          <div className="card-panel" style={{ borderLeft: '4px solid #6366f1' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase' }}>Idempotency Gate</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0 0.1rem 0' }}>Active</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Duplicate events blocked</div>
          </div>
        </div>
      )}

      {/* Interactive Analytics & Recent Triage Live Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
        {/* Recent Triage Priority Queue */}
        <div className="card-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div className="card-title" style={{ margin: 0 }}>
              <Clock size={18} color="#0284c7" /> Live Priority Triage Feed
            </div>
            <button className="btn-ctrl" onClick={() => onNavigate('session-overview')}>View All Sessions →</button>
          </div>

          <table className="session-table">
            <thead>
              <tr>
                <th>Session ID</th>
                <th>Patient Name</th>
                <th>Vitals (SpO₂ / HR)</th>
                <th>Decision</th>
                <th>Rule Rationale</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {recentAlerts.map((row) => (
                <tr key={row.id} style={{ cursor: 'pointer' }} onClick={() => onNavigate('triage-feed')}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{row.id}</td>
                  <td style={{ fontWeight: 600 }}>{row.name} <span style={{ fontSize: '0.75rem', color: '#64748b' }}>({row.age})</span></td>
                  <td>
                    <span style={{ color: row.spo2 < 90 ? '#dc2626' : '#16a34a', fontWeight: 700 }}>{row.spo2}%</span> / {row.hr} bpm
                  </td>
                  <td>
                    <span className={row.decision === 'EMERGENCY' ? 'badge-level1' : row.decision === 'MENTAL HEALTH' ? 'badge-mhurgent' : 'badge-level4'}>
                      {row.level}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: '#475569' }}>{row.reason}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: '#64748b', fontSize: '0.75rem' }}>{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Real-time System Metrics & Gateway Health Panel */}
        <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card-title">
            <Radio size={18} color="#16a34a" /> Gateway Health Monitor
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.85rem', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ fontWeight: 600, color: '#475569' }}>Bluetooth BLE Gateway</span>
              <span style={{ color: '#16a34a', fontWeight: 700 }}>Connected (99.4%)</span>
            </div>
            <div style={{ width: '100%', background: '#e2e8f0', height: '6px', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ width: '99.4%', background: '#16a34a', height: '100%' }}></div>
            </div>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.85rem', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ fontWeight: 600, color: '#475569' }}>Deterministic Rule Engine</span>
              <span style={{ color: '#0284c7', fontWeight: 700 }}>100% Pass (0 Errors)</span>
            </div>
            <div style={{ width: '100%', background: '#e2e8f0', height: '6px', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ width: '100%', background: '#0284c7', height: '100%' }}></div>
            </div>
          </div>

          <div style={{ background: '#faf5ff', border: '1px solid #d8b4fe', padding: '0.85rem', borderRadius: '10px', color: '#9333ea', fontSize: '0.8rem' }}>
            <strong>💡 Identity Resolver Active:</strong> Scoring matches patient records using Levenshtein distance on names & phone normalization.
          </div>
        </div>
      </div>
    </div>
  );
}
