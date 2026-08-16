import React from 'react';
import { X, Play, ShieldAlert, Lock, Download, CheckCircle2 } from 'lucide-react';

export default function VideoPlaybackModal({ isOpen, onClose, session, currentUser }) {
  if (!isOpen || !session) return null;

  const userRole = currentUser?.id || 'physician';
  const canWatchVideo = ['physician', 'nurse'].includes(userRole);

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
        width: '680px',
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
            <span style={{ width: 10, height: 10, background: '#0284c7', borderRadius: '50%' }}></span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Recorded Telehealth Video Archives: {session.sessionId || '#8842'}</h3>
          </div>
          <X size={20} style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={onClose} />
        </div>

        {/* Role Access Check */}
        {canWatchVideo ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Video Player Box */}
            <div style={{
              width: '100%',
              height: '340px',
              background: '#1e293b',
              borderRadius: '14px',
              overflow: 'hidden',
              position: 'relative',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              {session.videoUrl ? (
                <video
                  src={session.videoUrl}
                  controls
                  autoPlay
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&auto=format&fit=crop&q=80"
                  alt="Patient Video Recording"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}

              <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(2, 132, 199, 0.85)', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                🎥 Recorded Video Clip
              </div>
            </div>

            {/* Video Details */}
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>Patient: {session.patientName}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                  Recorded by: <strong>{currentUser?.name}</strong> ({currentUser?.role})
                </div>
              </div>

              {session.videoUrl && (
                <a
                  href={session.videoUrl}
                  download={`Telehealth_Recording_${session.sessionId}.webm`}
                  style={{
                    background: '#0284c7',
                    color: '#ffffff',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Download size={14} /> Download Video
                </a>
              )}
            </div>
          </div>
        ) : (
          <div style={{ padding: '2.5rem', textAlgn: 'center', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '14px', color: '#fca5a5', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <Lock size={48} color="#ef4444" />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>Access Restricted (HIPAA Security Rule)</h4>
            <p style={{ fontSize: '0.85rem', maxWidth: '450px', textAlign: 'center', color: '#cbd5e1' }}>
              Your current role (<strong>{currentUser?.role}</strong>) does not have authorization to view private clinical video recordings. Only assigned <strong>ED Physicians</strong> and <strong>Intake Nurses</strong> can playback patient video streams.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
