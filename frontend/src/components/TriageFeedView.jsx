import React, { useState } from 'react';
import { AlertTriangle, Fingerprint, Activity, Mic, MessageSquare, Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export default function TriageFeedView({ sessions = [], activeSessionId = '#8842' }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [streamTime, setStreamTime] = useState('T-00:00:00 Live');

  const currentSession = sessions.find((s) => s.sessionId === activeSessionId || s.id === activeSessionId) || sessions[0] || {
    sessionId: '#8842',
    patientName: 'John Doe',
    dob: '05/14/1968 (55M)',
    matchScore: 94,
    spo2: 88,
    hr: 112,
    symptoms: 'Severe chest pain, shortness of breath, diaphoretic.',
    decision: 'EMERGENCY',
    decisionReason: 'Override triggered by SpO2 < 90% and concurrent symptom reports.',
    events: [],
    auditLogs: []
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
      {/* Session Title Bar */}
      <div className="session-header">
        <div className="session-title">
          Active Triage Session: <span className="session-tag">{currentSession.sessionId}</span>
        </div>
        <div className="live-badge">
          <span className="live-dot"></span> LIVE STREAM ACTIVE
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="triage-grid">
        {/* Column 1: Multi-Modal Stream */}
        <div className="card-panel">
          <div className="card-title">Multi-Modal Stream</div>
          <div className="timeline-stream">
            {currentSession.events && currentSession.events.map((evt) => (
              <div key={evt.id} className="stream-item">
                <div className={`stream-node ${evt.source}`}></div>
                <div className="stream-header">
                  <div className="stream-type">
                    {evt.source === 'audio' && <Mic size={14} color="#0284c7" />}
                    {evt.source === 'sensor' && <Activity size={14} color="#10b981" />}
                    {evt.source === 'text' && <MessageSquare size={14} color="#64748b" />}
                    {evt.type}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {evt.tag && <span className="tag-outoforder">{evt.tag}</span>}
                    <span className="stream-time">{evt.time}</span>
                  </div>
                </div>

                {evt.source === 'sensor' ? (
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    HR: <span style={{ color: '#0f172a' }}>{evt.hr}</span> | SpO2: <span style={{ color: evt.spo2 < 90 ? '#dc2626' : '#10b981', fontWeight: 700 }}>{evt.spo2}%</span>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: '#334155', lineHeight: '1.4' }}>
                    {evt.text}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Identity Resolution & Patient State */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Identity Resolution Card */}
          <div className="card-panel">
            <div className="card-title">
              <Fingerprint size={18} color="#0284c7" /> Identity Resolution
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                  {currentSession.patientName}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                  DOB: {currentSession.dob}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0284c7' }}>
                  {currentSession.matchScore}%
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>
                  Match Probability
                </div>
              </div>
            </div>
          </div>

          {/* Current Patient State Card */}
          <div className="card-panel" style={{ flex: 1 }}>
            <div className="card-title">Current Patient State</div>

            <div className="vitals-row">
              <div className={`vital-box ${currentSession.spo2 < 90 ? 'alert' : ''}`}>
                <div className="vital-label">Latest SpO2</div>
                <div className="vital-value">{currentSession.spo2}%</div>
              </div>
              <div className="vital-box">
                <div className="vital-label">Heart Rate</div>
                <div className="vital-value">{currentSession.hr} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>bpm</span></div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.35rem' }}>
                Symptom Summary
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', color: '#1e293b', fontWeight: 500 }}>
                {currentSession.symptoms}
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Decision Banner, Logic & Audit Trail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Large Emergency Banner */}
          {currentSession.decision === 'EMERGENCY' ? (
            <div className="banner-emergency">
              <AlertTriangle size={26} /> ▲ EMERGENCY
            </div>
          ) : currentSession.decision === 'MENTAL HEALTH' ? (
            <div style={{ background: '#faf5ff', border: '2px solid #a855f7', color: '#9333ea', padding: '1rem', borderRadius: '8px', textAlign: 'center', fontSize: '1.3rem', fontWeight: 800 }}>
              💜 MENTAL HEALTH
            </div>
          ) : (
            <div style={{ background: '#f0fdf4', border: '2px solid #22c55e', color: '#16a34a', padding: '1rem', borderRadius: '8px', textAlign: 'center', fontSize: '1.3rem', fontWeight: 800 }}>
              ✅ GENERAL TRIAGE
            </div>
          )}

          {/* Decision Logic Card */}
          <div className="card-panel">
            <div className="card-title">Decision Logic</div>
            <div style={{ borderLeft: '4px solid #ef4444', paddingLeft: '0.75rem', fontSize: '0.825rem', color: '#334155', lineHeight: '1.4' }}>
              {currentSession.decisionReason}
            </div>
          </div>

          {/* Audit Trail Card */}
          <div className="card-panel" style={{ flex: 1 }}>
            <div className="card-title">Audit Trail</div>
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Event ID</th>
                  <th>Source</th>
                  <th>Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentSession.auditLogs && currentSession.auditLogs.map((log, idx) => (
                  <tr key={log.id || idx}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{log.id}</td>
                    <td style={{ color: log.source.includes('Engine') ? '#2563eb' : '#0f172a' }}>{log.source}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#64748b' }}>{log.time}</td>
                    <td>
                      <span className={`pill-action ${log.actionType}`}>
                        {log.action}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="control-bar">
        <div className="playback-controls">
          <button className="btn-ctrl" title="First step"><SkipBack size={14} /></button>
          <button className="btn-ctrl" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button className="btn-ctrl" title="Next step"><SkipForward size={14} /></button>
          <span style={{ marginLeft: '0.5rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#0f172a' }}>
            {streamTime}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#16a34a', fontWeight: 600 }}>
            ● API: 12ms
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#16a34a', fontWeight: 600 }}>
            ● Data Stream: Stable
          </span>
        </div>
      </div>
    </div>
  );
}
