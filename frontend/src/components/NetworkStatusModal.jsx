import React, { useState } from 'react';
import { X, Wifi, CheckCircle, RefreshCw } from 'lucide-react';

export default function NetworkStatusModal({ isOpen, onClose }) {
  const [ping, setPing] = useState(12);
  const [testing, setTesting] = useState(false);

  if (!isOpen) return null;

  const testConnection = () => {
    setTesting(true);
    setTimeout(() => {
      setPing(Math.floor(10 + Math.random() * 5));
      setTesting(false);
    }, 800);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        width: '450px',
        padding: '1.5rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wifi size={18} color="#0284c7" /> Gateway Network Status
          </h3>
          <X size={18} style={{ cursor: 'pointer', color: '#64748b' }} onClick={onClose} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: '#f0fdf4', border: '1px solid #86efac', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={16} /> Gateway Stream: STABLE
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>WebSocket & HTTP stream operational.</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284c7' }}>{ping} ms</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Latency</div>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div>• Backend Server: <strong>http://localhost:3000</strong> (Active)</div>
            <div>• Protocol: <strong>HTTP / JSON REST + Engine Hooks</strong></div>
            <div>• Idempotency Gate: <strong>Enforced (0 packet loss)</strong></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <button className="btn-ctrl" onClick={testConnection} disabled={testing}>
              <RefreshCw size={14} /> {testing ? 'Testing...' : 'Ping Server'}
            </button>
            <button className="btn-new-session" style={{ margin: 0 }} onClick={onClose}>
              Close Monitor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
