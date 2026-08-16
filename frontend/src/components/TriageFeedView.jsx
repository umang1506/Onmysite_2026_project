import React, { useState } from 'react';
import { AlertTriangle, Fingerprint, Activity, Mic, MessageSquare, Play, Pause, SkipBack, SkipForward, Download, Sliders, Video } from 'lucide-react';
import VideoPlaybackModal from './VideoPlaybackModal';

export default function TriageFeedView({ sessions = [], activeSessionId = '#8842', currentUser }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [streamTime, setStreamTime] = useState('T-00:00:00 Live');
  const [liveSpo2, setLiveSpo2] = useState(null);
  const [liveHr, setLiveHr] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

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

  const activeSpo2 = liveSpo2 !== null ? liveSpo2 : currentSession.spo2;
  const activeHr = liveHr !== null ? liveHr : currentSession.hr;
  const activeDecision = activeSpo2 < 90 || activeHr > 150 ? 'EMERGENCY' : currentSession.decision;

  const playEmergencyTone = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {}
  };

  const handleSpo2Change = (val) => {
    setLiveSpo2(val);
    if (val < 90) playEmergencyTone();
  };

  const handleExportAuditReport = () => {
    const reportData = {
      hospital: 'Onmysite Clinical Intelligence Gateway (Unit 7-B Center)',
      exportedAt: new Date().toISOString(),
      session: {
        id: currentSession.sessionId,
        patientName: currentSession.patientName,
        dob: currentSession.dob,
        matchScore: `${currentSession.matchScore}%`
      },
      currentVitals: { spo2: `${activeSpo2}%`, heartRate: `${activeHr} bpm` },
      triageDecision: activeDecision,
      decisionReason: currentSession.decisionReason,
      eventsStream: currentSession.events,
      auditTrail: currentSession.auditLogs
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Audit_Report_${currentSession.sessionId.replace('#', '')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
      {/* Session Title Bar */}
      <div className="session-header">
        <div className="session-title">
          Active Triage Session: <span className="session-tag">{currentSession.sessionId}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            className="btn-ctrl"
            onClick={() => setIsVideoModalOpen(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#1e40af', color: '#ffffff', borderColor: '#1e40af', fontWeight: 600 }}
          >
            <Video size={14} /> 🎥 Watch Recorded Video
          </button>
          <button
            className="btn-ctrl"
            onClick={handleExportAuditReport}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#0284c7', color: '#ffffff', borderColor: '#0284c7', fontWeight: 600 }}
          >
            <Download size={14} /> Export Audit JSON
          </button>
          <div className="live-badge">
            <span className="live-dot"></span> LIVE STREAM ACTIVE
          </div>
        </div>
      </div>

      {/* Interactive IoT Vitals Simulator Bar */}
      <div className="card-panel" style={{ background: '#f8fafc', border: '1px solid #0284c7', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.85rem', color: '#0284c7' }}>
          <Sliders size={16} /> Live IoT Vitals Stream Simulator:
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: activeSpo2 < 90 ? '#dc2626' : '#0f172a' }}>
              SpO₂ ({activeSpo2}%):
            </span>
            <input
              type="range"
              min="75"
              max="100"
              value={activeSpo2}
              onChange={(e) => handleSpo2Change(Number(e.target.value))}
              style={{ cursor: 'pointer', accentColor: activeSpo2 < 90 ? '#dc2626' : '#0284c7' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: activeHr > 150 ? '#dc2626' : '#0f172a' }}>
              Heart Rate ({activeHr} bpm):
            </span>
            <input
              type="range"
              min="50"
              max="180"
              value={activeHr}
              onChange={(e) => setLiveHr(Number(e.target.value))}
              style={{ cursor: 'pointer', accentColor: activeHr > 150 ? '#dc2626' : '#0284c7' }}
            />
          </div>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
          Drag sliders to test real-time emergency vitals override.
        </span>
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
                    HR: <span style={{ color: '#0f172a' }}>{activeHr}</span> | SpO2: <span style={{ color: activeSpo2 < 90 ? '#dc2626' : '#10b981', fontWeight: 700 }}>{activeSpo2}%</span>
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

          <div className="card-panel" style={{ flex: 1 }}>
            <div className="card-title">Current Patient State</div>
            <div className="vitals-row">
              <div className={`vital-box ${activeSpo2 < 90 ? 'alert' : ''}`}>
                <div className="vital-label">Latest SpO2</div>
                <div className="vital-value">{activeSpo2}%</div>
              </div>
              <div className="vital-box">
                <div className="vital-label">Heart Rate</div>
                <div className="vital-value">{activeHr} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>bpm</span></div>
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
          {activeDecision === 'EMERGENCY' ? (
            <div className="banner-emergency">
              <AlertTriangle size={26} /> ▲ EMERGENCY
            </div>
          ) : activeDecision === 'MENTAL HEALTH' ? (
            <div style={{ background: '#faf5ff', border: '2px solid #a855f7', color: '#9333ea', padding: '1rem', borderRadius: '8px', textAlign: 'center', fontSize: '1.3rem', fontWeight: 800 }}>
              💜 MENTAL HEALTH
            </div>
          ) : (
            <div style={{ background: '#f0fdf4', border: '2px solid #22c55e', color: '#16a34a', padding: '1rem', borderRadius: '8px', textAlign: 'center', fontSize: '1.3rem', fontWeight: 800 }}>
              ✅ GENERAL TRIAGE
            </div>
          )}

          <div className="card-panel">
            <div className="card-title">Decision Logic</div>
            <div style={{ borderLeft: '4px solid #ef4444', paddingLeft: '0.75rem', fontSize: '0.825rem', color: '#334155', lineHeight: '1.4' }}>
              {activeSpo2 < 90
                ? `Escalated to Emergency: SpO2 level (${activeSpo2}%) dropped below 90% threshold, overriding patient symptoms.`
                : currentSession.decisionReason}
            </div>
          </div>

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

      {/* Video Playback Modal */}
      <VideoPlaybackModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        session={currentSession}
        currentUser={currentUser}
      />

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
