import React from 'react';
import { X, Printer, Download, FileText, CheckCircle2, ShieldCheck, Activity, Award } from 'lucide-react';

export default function EmrReportExporterModal({ isOpen, onClose, session, currentUser }) {
  if (!isOpen || !session) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        width: '740px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2rem',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        border: '1px solid #e2e8f0',
        color: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        {/* Top Actions & Close */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #1e3a8a', paddingBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e3a8a' }}>Onmysite Emergency Center</h2>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Unit 7-B Clinical Gateway • Official EMR Triage Summary</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              onClick={handlePrint}
              style={{ background: '#1d4ed8', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0.45rem 0.9rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Printer size={15} /> Print Official Sheet
            </button>
            <X size={20} style={{ cursor: 'pointer', color: '#64748b' }} onClick={onClose} />
          </div>
        </div>

        {/* Official Patient Demographics Card */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>PATIENT FULL NAME</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{session.patientName}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>{session.patientDetails || 'ID: P-44921'}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>SESSION ID & MATCH</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0284c7' }}>{session.sessionId}</div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, marginTop: '0.2rem' }}>Identity Match: {session.matchScore}%</div>
          </div>
        </div>

        {/* Vitals Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ background: session.spo2 < 90 ? '#fef2f2' : '#f0fdf4', border: '1px solid #cbd5e1', padding: '0.85rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>SPO₂ TELEMETRY</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: session.spo2 < 90 ? '#dc2626' : '#16a34a' }}>{session.spo2}%</div>
          </div>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.85rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>HEART RATE TELEMETRY</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0284c7' }}>{session.hr} bpm</div>
          </div>
        </div>

        {/* Symptoms & Decision Rationale */}
        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '1rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e3a8a' }}>CHIEF SYMPTOM REPORT</div>
          <div style={{ fontSize: '0.85rem', color: '#334155' }}>{session.symptoms}</div>

          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e3a8a', marginTop: '0.4rem' }}>TRIAGE DECISION & RATIONALE</div>
          <div style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 700 }}>Decision: [{session.decision}]</div>
          <div style={{ fontSize: '0.8rem', color: '#475569' }}>{session.decisionReason}</div>
        </div>

        {/* Attending Physician Signature Block */}
        <div style={{ marginTop: '1rem', borderTop: '1px dashed #cbd5e1', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Attending Physician</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{currentUser?.name || 'Dr. Alex Rivera, MD'}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Digital Verification Signature</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: '#16a34a' }}>✓ VERIFIED EMR #8842-A</div>
          </div>
        </div>
      </div>
    </div>
  );
}
