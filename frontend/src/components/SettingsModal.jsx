import React, { useState } from 'react';
import { X, Save, Sliders, CheckCircle } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }) {
  const [spo2Threshold, setSpo2Threshold] = useState('90');
  const [hrMaxThreshold, setHrMaxThreshold] = useState('150');
  const [timeoutMinutes, setTimeoutMinutes] = useState('5');
  const [enableSound, setEnableSound] = useState(true);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
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
        width: '500px',
        padding: '1.5rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={18} color="#0284c7" /> Engine & System Settings
          </h3>
          <X size={18} style={{ cursor: 'pointer', color: '#64748b' }} onClick={onClose} />
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>
              SpO₂ Critical Threshold (%)
            </label>
            <input
              type="number"
              className="search-input"
              style={{ width: '100%' }}
              value={spo2Threshold}
              onChange={(e) => setSpo2Threshold(e.target.value)}
            />
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Readings below this value automatically trigger Emergency Override.</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>
                HR Max Threshold (bpm)
              </label>
              <input
                type="number"
                className="search-input"
                style={{ width: '100%' }}
                value={hrMaxThreshold}
                onChange={(e) => setHrMaxThreshold(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>
                Session Timeout (mins)
              </label>
              <input
                type="number"
                className="search-input"
                style={{ width: '100%' }}
                value={timeoutMinutes}
                onChange={(e) => setTimeoutMinutes(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <input
              type="checkbox"
              id="soundAlerts"
              checked={enableSound}
              onChange={(e) => setEnableSound(e.target.checked)}
            />
            <label htmlFor="soundAlerts" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
              Enable Emergency Sound & Audio Alerts
            </label>
          </div>

          {saved && (
            <div style={{ color: '#16a34a', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle size={16} /> Configuration saved successfully!
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn-ctrl" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-new-session" style={{ margin: 0 }}>
              <Save size={14} /> Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
