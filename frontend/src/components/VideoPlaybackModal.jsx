import React, { useState, useEffect } from 'react';
import { X, Play, Pause, ShieldAlert, Lock, Download, CheckCircle2, Volume2, VolumeX, Activity } from 'lucide-react';

export default function VideoPlaybackModal({ isOpen, onClose, session, currentUser }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);

  useEffect(() => {
    let timer = null;

    if (isOpen && isPlaying) {
      timer = setInterval(() => {
        setPlaybackTime((prev) => (prev >= 45 ? 0 : prev + 1));
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen, isPlaying]);

  if (!isOpen || !session) return null;

  const userRole = currentUser?.id || 'physician';
  const canWatchVideo = ['physician', 'nurse'].includes(userRole);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const hasRecordedBlob = Boolean(session.videoUrl);

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100
    }}>
      <div style={{
        background: '#0f172a',
        borderRadius: '20px',
        width: '740px',
        padding: '1.75rem',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ width: 10, height: 10, background: '#0284c7', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>🎥 Recorded Telehealth Video & Audio Playback: {session.sessionId || '#8842'}</h3>
          </div>
          <X size={20} style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={onClose} />
        </div>

        {/* Role Access Check */}
        {canWatchVideo ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Real Recorded Video & Audio Frame (User's Microphone Audio Plays natively!) */}
            <div style={{
              width: '100%',
              height: '360px',
              background: '#090d16',
              borderRadius: '14px',
              overflow: 'hidden',
              position: 'relative',
              border: '1px solid rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {hasRecordedBlob ? (
                /* Native Video + User's Spoken Audio File Playback! */
                <video
                  src={session.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                /* Pure Clinical Telemetry Screen fallback */
                <div style={{ width: '100%', height: '100%', position: 'relative', background: '#090d16', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  
                  {/* Grid Lines */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                  }} />

                  <div style={{
                    width: 90,
                    height: 90,
                    borderRadius: '50%',
                    background: 'rgba(2, 132, 199, 0.15)',
                    border: '2px solid #0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 30px rgba(2, 132, 199, 0.4)',
                    zIndex: 2
                  }}>
                    <Activity size={44} color="#38bdf8" />
                  </div>

                  <div style={{ marginTop: '1.25rem', fontWeight: 800, fontSize: '1.05rem', color: '#ffffff', zIndex: 2 }}>
                    RECORDED TELEHEALTH CALL ARCHIVE
                  </div>

                  {/* Overlaid Waveform */}
                  <div style={{
                    position: 'absolute',
                    bottom: 50,
                    left: 20,
                    right: 20,
                    height: 40,
                    background: 'rgba(15, 23, 42, 0.85)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 1rem',
                    zIndex: 2
                  }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ width: 8, height: 8, background: '#16a34a', borderRadius: '50%' }}></span> ECG Telemetry: {session.hr || 112} bpm
                    </span>

                    <svg width="220" height="24" viewBox="0 0 220 24" style={{ overflow: 'visible' }}>
                      <path
                        d="M0,12 L30,12 L40,2 L50,22 L60,12 L90,12 L100,2 L110,22 L120,12 L150,12 L160,2 L170,22 L180,12 L220,12"
                        fill="none"
                        stroke="#16a34a"
                        strokeWidth="2"
                      />
                    </svg>

                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: Number(session.spo2) < 90 ? '#ef4444' : '#0284c7' }}>
                      SpO₂: {session.spo2 || 88}%
                    </span>
                  </div>

                  {/* Badges */}
                  <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(2, 132, 199, 0.9)', padding: '0.35rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800 }}>
                    ● RECORDED TELEHEALTH FEED
                  </div>

                  <div style={{ position: 'absolute', top: 14, left: 14, background: 'rgba(15, 23, 42, 0.8)', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                    Patient: {session.patientName || 'John Doe'}
                  </div>
                </div>
              )}
            </div>

            {/* Video Meta Info */}
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>Patient: {session.patientName || 'John Doe'}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                  Recorded Intake by: <strong>{currentUser?.name || 'Dr. Alex Rivera'}</strong> ({currentUser?.role || 'ED Physician'})
                </div>
              </div>

              {hasRecordedBlob ? (
                <a
                  href={session.videoUrl}
                  download={`Recorded_Telehealth_Session_${session.sessionId || '8842'}.webm`}
                  style={{
                    background: '#0284c7',
                    color: '#ffffff',
                    padding: '0.55rem 1.1rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Download size={15} /> Download Recorded Video
                </a>
              ) : (
                <button
                  onClick={() => alert(`Downloading Telehealth Video File for Session ${session.sessionId || '#8842'}...`)}
                  style={{
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.55rem 1.1rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Download size={15} /> Download Video File
                </button>
              )}
            </div>
          </div>
        ) : (
          <div style={{ padding: '2.5rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '14px', color: '#fca5a5', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <Lock size={48} color="#ef4444" />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>Access Restricted (HIPAA Security Rule)</h4>
            <p style={{ fontSize: '0.85rem', maxWidth: '450px', color: '#cbd5e1' }}>
              Your current role (<strong>{currentUser?.role}</strong>) does not have authorization to view private clinical video recordings. Only assigned <strong>ED Physicians</strong> and <strong>Intake Nurses</strong> can playback patient video streams.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
