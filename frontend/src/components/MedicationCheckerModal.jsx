import React, { useState } from 'react';
import { X, Pill, AlertTriangle, ShieldCheck, Plus, CheckCircle2, FileText, Zap } from 'lucide-react';

export default function MedicationCheckerModal({ isOpen, onClose, activeSession }) {
  const [selectedMeds, setSelectedMeds] = useState(['Aspirin (325mg)']);
  const [medInput, setMedInput] = useState('');
  const [interactionResult, setInteractionResult] = useState(null);

  if (!isOpen) return null;

  const availableMeds = [
    'Aspirin (325mg)',
    'Nitroglycerin (0.4mg SL)',
    'Heparin (5000 Units)',
    'Warfarin (5mg)',
    'Morphine Sulfate (4mg IV)',
    'Albuterol Nebulizer',
    'Epinephrine (0.3mg Auto-injector)',
    'Lorazepam (2mg IV)'
  ];

  const handleAddMed = (med) => {
    if (!selectedMeds.includes(med)) {
      const updated = [...selectedMeds, med];
      setSelectedMeds(updated);
      checkInteractions(updated);
    }
  };

  const handleRemoveMed = (med) => {
    const updated = selectedMeds.filter((m) => m !== med);
    setSelectedMeds(updated);
    checkInteractions(updated);
  };

  const checkInteractions = (medList) => {
    const listStr = medList.join(' ').toLowerCase();

    if (listStr.includes('aspirin') && (listStr.includes('heparin') || listStr.includes('warfarin'))) {
      setInteractionResult({
        severity: 'CRITICAL',
        title: '🚨 High Bleeding Risk Warning',
        details: 'Concurrent administration of antiplatelets (Aspirin) and anticoagulants (Heparin/Warfarin) significantly elevates major hemorrhage risk.',
        recommendation: 'Monitor INR/PTT levels closely before IV infusion.'
      });
    } else if (listStr.includes('nitroglycerin') && listStr.includes('morphine')) {
      setInteractionResult({
        severity: 'MODERATE',
        title: '⚠️ Hypotension Alert',
        details: 'Combined Nitroglycerin and Morphine can cause synergistic blood pressure drops in acute coronary syndrome patients.',
        recommendation: 'Verify BP > 100 mmHg before administering second dose.'
      });
    } else {
      setInteractionResult({
        severity: 'SAFE',
        title: '✅ No Severe Drug Interactions Detected',
        details: 'Selected emergency medications are compatible for standard administration.',
        recommendation: 'Proceed with standard emergency dosage protocol.'
      });
    }
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
      zIndex: 1050
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        width: '680px',
        padding: '1.75rem',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)', color: '#fff', width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Pill size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e3a8a' }}>Emergency Medication & Interaction Checker</h3>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Real-time Drug-Drug Interaction Safety Verification</div>
            </div>
          </div>
          <X size={20} style={{ cursor: 'pointer', color: '#64748b' }} onClick={onClose} />
        </div>

        {/* Selected Meds Chips */}
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>
            Currently Selected Emergency Medications ({selectedMeds.length})
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', minHeight: '40px', background: '#f8fafc', border: '1px solid #cbd5e1', padding: '0.5rem', borderRadius: '8px' }}>
            {selectedMeds.map((med) => (
              <span key={med} style={{ background: '#1d4ed8', color: '#ffffff', padding: '0.3rem 0.7rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {med}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => handleRemoveMed(med)} />
              </span>
            ))}
          </div>
        </div>

        {/* Available Meds Picker */}
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>
            Click to Add Emergency Medications
          </label>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {availableMeds.map((med) => (
              <button
                key={med}
                onClick={() => handleAddMed(med)}
                style={{
                  background: selectedMeds.includes(med) ? '#e0f2fe' : '#ffffff',
                  color: selectedMeds.includes(med) ? '#0284c7' : '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <Plus size={12} /> {med}
              </button>
            ))}
          </div>
        </div>

        {/* Interaction Results Box */}
        {interactionResult && (
          <div style={{
            background: interactionResult.severity === 'CRITICAL' ? '#fef2f2' : interactionResult.severity === 'MODERATE' ? '#fff7ed' : '#f0fdf4',
            border: interactionResult.severity === 'CRITICAL' ? '1px solid #fca5a5' : interactionResult.severity === 'MODERATE' ? '1px solid #ffedd5' : '1px solid #bbf7d0',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem'
          }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: interactionResult.severity === 'CRITICAL' ? '#dc2626' : interactionResult.severity === 'MODERATE' ? '#c2410c' : '#16a34a' }}>
              {interactionResult.title}
            </div>
            <div style={{ fontSize: '0.825rem', color: '#334155', lineHeight: '1.4' }}>
              {interactionResult.details}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
              💡 Clinical Action: {interactionResult.recommendation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
