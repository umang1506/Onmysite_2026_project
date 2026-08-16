import React, { useState } from 'react';
import { X, Video, Mic, MicOff, PhoneOff, VideoOff, ShieldAlert } from 'lucide-react';

export default function TelehealthVideoModal({ isOpen, onClose }) {
  const [micMuted, setMicMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#0f172a',
        borderRadius: '16px',
        width: '640px',
        padding: '1.5rem',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#ffffff'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 10, height: 10, background: '#ef4444', borderRadius: '50%' }}></span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Telehealth Video Intake: John Doe (#8842)</h3>
          </div>
          <X size={20} style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={onClose} />
        </div>

        {/* Video Frame */}
        <div style={{
          width: '100%',
          height: '320px',
          background: '#1e293b',
          borderRadius: '12px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          {!videoOff ? (
            <img
              src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&auto=format&fit=crop&q=80"
              alt="Patient Feed"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ color: '#64748b', textAlign: 'center' }}>
              <VideoOff size={48} />
              <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>Camera Stream Muted</div>
            </div>
          )}

          <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(239, 68, 68, 0.85)', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
            ▲ Emergency SpO2 88%
          </div>

          <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(15, 23, 42, 0.75)', padding: '0.3rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem' }}>
            John Doe (Patient)
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.25rem' }}>
          <button
            className="btn-ctrl"
            style={{ borderRadius: '50%', width: 44, height: 44, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: micMuted ? '#ef4444' : '#334155', color: '#ffffff', border: 'none' }}
            onClick={() => setMicMuted(!micMuted)}
          >
            {micMuted ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <button
            className="btn-ctrl"
            style={{ borderRadius: '50%', width: 44, height: 44, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: videoOff ? '#ef4444' : '#334155', color: '#ffffff', border: 'none' }}
            onClick={() => setVideoOff(!videoOff)}
          >
            {videoOff ? <VideoOff size={18} /> : <Video size={18} />}
          </button>
          <button
            className="btn-ctrl"
            style={{ borderRadius: '50%', width: 44, height: 44, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#dc2626', color: '#ffffff', border: 'none' }}
            onClick={onClose}
          >
            <PhoneOff size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
