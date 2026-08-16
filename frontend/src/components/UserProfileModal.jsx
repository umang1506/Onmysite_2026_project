import React from 'react';
import { X, UserCheck, Shield, LogOut, Award } from 'lucide-react';

export default function UserProfileModal({ isOpen, onClose }) {
  if (!isOpen) return null;

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
            <UserCheck size={18} color="#0284c7" /> User Profile & Credentials
          </h3>
          <X size={18} style={{ cursor: 'pointer', color: '#64748b' }} onClick={onClose} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <img
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80"
              alt="Dr. Alex Rivera"
              style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Dr. Alex Rivera, MD</div>
              <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 600 }}>Senior Triage Lead • Unit 7-B Center</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>License ID: #MD-99201-US</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem' }}>
              <span>Role Privilege:</span>
              <strong>System Administrator & Triage Evaluator</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem' }}>
              <span>Department:</span>
              <strong>Emergency Department Intake</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem' }}>
              <span>Security Clearance:</span>
              <strong style={{ color: '#16a34a' }}>Level 5 (HIPAA Compliant)</strong>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button className="btn-ctrl" style={{ color: '#dc2626' }} onClick={() => { alert('Logged out'); onClose(); }}>
              <LogOut size={14} /> Log Out
            </button>
            <button className="btn-new-session" style={{ margin: 0 }} onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
