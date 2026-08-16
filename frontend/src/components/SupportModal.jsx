import React from 'react';
import { X, HelpCircle, PhoneCall, BookOpen, ExternalLink, LifeBuoy } from 'lucide-react';

export default function SupportModal({ isOpen, onClose }) {
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
        width: '500px',
        padding: '1.5rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LifeBuoy size={18} color="#0284c7" /> Clinical Support & Assistance
          </h3>
          <X size={18} style={{ cursor: 'pointer', color: '#64748b' }} onClick={onClose} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '1rem', borderRadius: '8px', color: '#dc2626' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <PhoneCall size={16} /> Urgent Clinical Emergency Hotline
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '0.25rem' }}>
              +1 (800) 555-TRIAGE / Ext 711
            </div>
            <div style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>Direct line to Senior ED Medical Director (24/7).</div>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookOpen size={16} color="#0284c7" /> Documentation & Engine Specs
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
              Review deterministic triage rules, Levenshtein distance formulas, and temporal reconciliation algorithms in the system manual.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button className="btn-new-session" style={{ margin: 0 }} onClick={onClose}>
              Close Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
