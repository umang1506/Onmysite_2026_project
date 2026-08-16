import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, Bell, Trash2 } from 'lucide-react';

export default function NotificationDrawer({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'emergency', title: 'Emergency Sensor Override', time: '10:42 AM', desc: 'Session #8842: SpO2 level (88%) dropped below 90% threshold for patient John Doe.', unread: true },
    { id: 2, type: 'mental', title: 'Mental Health Triage Flag', time: '12:45 PM', desc: 'Session #8840: Anxiety crisis keyword matched for patient Aarav Patel.', unread: true },
    { id: 3, type: 'info', title: 'Gateway Stream Reconciled', time: '01:15 PM', desc: 'Out-of-order text events reconciled for session #8841.', unread: false }
  ]);

  if (!isOpen) return null;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const clearNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div style={{
      position: 'fixed',
      top: '60px',
      right: '1.5rem',
      width: '380px',
      background: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
      border: '1px solid #e2e8f0',
      zIndex: 1000,
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Bell size={16} color="#0284c7" /> Live Clinical Alerts ({notifications.filter(n => n.unread).length})
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }} onClick={markAllRead}>
            Mark All Read
          </button>
          <X size={16} style={{ cursor: 'pointer', color: '#64748b' }} onClick={onClose} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '350px', overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ color: '#94a3b8', fontSize: '0.8rem', textAlign: 'center', padding: '1rem' }}>
            No unread notifications.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              style={{
                background: n.type === 'emergency' ? '#fef2f2' : n.type === 'mental' ? '#faf5ff' : '#f8fafc',
                border: `1px solid ${n.type === 'emergency' ? '#fca5a5' : n.type === 'mental' ? '#d8b4fe' : '#e2e8f0'}`,
                padding: '0.75rem',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                gap: '0.5rem'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: n.type === 'emergency' ? '#dc2626' : n.type === 'mental' ? '#9333ea' : '#0284c7' }}>
                    {n.title}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{n.time}</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#334155', lineHeight: '1.3' }}>{n.desc}</p>
              </div>
              <Trash2 size={14} style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={() => clearNotification(n.id)} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
