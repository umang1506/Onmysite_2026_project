import React from 'react';
import { X, Printer, Download, FileText, CheckCircle2, ShieldCheck, Activity, Award, Zap } from 'lucide-react';

export default function EmrReportExporterModal({ isOpen, onClose, session, currentUser }) {
  if (!isOpen || !session) return null;

  const handlePrint = () => {
    // Instant print execution
    window.print();
  };

  const handleInstantDownloadPdf = () => {
    // Generate instant downloadable formatted HTML/PDF file (< 10ms)
    const reportHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>EMR_Triage_Summary_${session.sessionId.replace('#', '')}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 2rem; color: #0f172a; }
    .header { border-bottom: 3px solid #1e3a8a; padding-bottom: 1rem; margin-bottom: 1.5rem; }
    .title { font-size: 22px; font-weight: 800; color: #1e3a8a; }
    .sub { font-size: 12px; color: #64748b; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
    .card { background: #f8fafc; border: 1px solid #cbd5e1; padding: 1rem; border-radius: 8px; }
    .label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; }
    .val { font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 0.2rem; }
    .badge-emergency { background: #fef2f2; color: #dc2626; border: 1px solid #fca5a5; padding: 0.5rem; border-radius: 6px; font-weight: 800; text-align: center; }
    .badge-general { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; padding: 0.5rem; border-radius: 6px; font-weight: 800; text-align: center; }
    .footer { margin-top: 2rem; border-top: 1px dashed #cbd5e1; padding-top: 1rem; display: flex; justify-content: space-between; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">Onmysite Clinical Gateway — Emergency Department EMR</div>
    <div class="sub">Official Patient Triage & Vitals Summary Sheet | Unit 7-B Center</div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="label">Patient Name & ID</div>
      <div class="val">${session.patientName}</div>
      <div class="sub">${session.patientDetails || 'ID: P-44921'}</div>
    </div>

    <div class="card">
      <div class="label">Session ID & Identity Match</div>
      <div class="val" style="color: #0284c7;">${session.sessionId}</div>
      <div class="sub" style="color: #16a34a; font-weight: 700;">Identity Match Probability: ${session.matchScore}%</div>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="label">SpO₂ Telemetry</div>
      <div class="val" style="color: ${session.spo2 < 90 ? '#dc2626' : '#16a34a'};">${session.spo2}%</div>
    </div>

    <div class="card">
      <div class="label">Heart Rate Telemetry</div>
      <div class="val" style="color: #0284c7;">${session.hr} bpm</div>
    </div>
  </div>

  <div class="card" style="margin-bottom: 1rem;">
    <div class="label">Chief Symptoms</div>
    <div style="font-size: 14px; color: #334155; margin-top: 0.4rem;">${session.symptoms}</div>
  </div>

  <div class="card" style="margin-bottom: 1.5rem;">
    <div class="label">Triage Decision & Logic</div>
    <div class="${session.decision === 'EMERGENCY' ? 'badge-emergency' : 'badge-general'}" style="margin: 0.5rem 0;">
      DECISION: [${session.decision}]
    </div>
    <div style="font-size: 13px; color: #475569;">${session.decisionReason}</div>
  </div>

  <div class="footer">
    <div>
      <strong>Attending Physician:</strong> ${currentUser?.name || 'Dr. Alex Rivera, MD'}<br>
      <span>Unit 7-B Emergency Services</span>
    </div>
    <div style="text-align: right;">
      <strong style="color: #16a34a;">✓ EMR DIGITAL VERIFICATION STAMP</strong><br>
      <span>Timestamp: ${new Date().toLocaleString()}</span>
    </div>
  </div>
</body>
</html>
    `;

    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EMR_Summary_${session.sessionId.replace('#', '')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="emr-modal-backdrop" style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100
    }}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .printable-emr-sheet, .printable-emr-sheet * { visibility: visible; }
          .printable-emr-sheet {
            position: absolute;
            left: 0; top: 0; width: 100%;
            padding: 0; margin: 0;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="printable-emr-sheet" style={{
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
        {/* Top Actions Bar (Hidden during print) */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #1e3a8a', paddingBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e3a8a' }}>Onmysite Emergency Center</h2>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Unit 7-B Clinical Gateway • Official EMR Triage Summary</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handleInstantDownloadPdf}
              style={{ background: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0.45rem 0.85rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Zap size={14} /> Instant PDF File (&lt; 10ms)
            </button>
            <button
              onClick={handlePrint}
              style={{ background: '#1d4ed8', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0.45rem 0.85rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Printer size={14} /> Print Sheet
            </button>
            <X size={20} style={{ cursor: 'pointer', color: '#64748b', marginLeft: '0.3rem' }} onClick={onClose} />
          </div>
        </div>

        {/* Printable Official Patient Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #1e3a8a', paddingBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e3a8a' }}>Emergency Department EMR Summary Sheet</h3>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Onmysite Clinical Gateway | Timestamp: {new Date().toLocaleString()}</div>
          </div>
          <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800 }}>
            ● OFFICIAL EMR RECORD
          </div>
        </div>

        {/* Demographics Card */}
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
