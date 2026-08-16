import React, { useState } from 'react';
import { X, Bed, Activity, CheckCircle2, AlertTriangle, ShieldCheck, Plus, RefreshCw } from 'lucide-react';

export default function BedCapacityModal({ isOpen, onClose, activeSession, onAssignBed }) {
  const [beds, setBeds] = useState([
    { id: 'ICU-BED-01', dept: 'ICU Resuscitation', status: 'Occupied', patient: 'P-44921 (John Doe)', type: 'Emergency' },
    { id: 'ICU-BED-02', dept: 'ICU Resuscitation', status: 'Available', patient: null, type: 'Emergency' },
    { id: 'ICU-BED-03', dept: 'ICU Resuscitation', status: 'Occupied', patient: 'P-99212 (Mark Vance)', type: 'Emergency' },
    { id: 'ED-BAY-01', dept: 'ED Trauma Bay', status: 'Available', patient: null, type: 'General' },
    { id: 'ED-BAY-02', dept: 'ED Trauma Bay', status: 'Occupied', patient: 'P-99382 (Sarah Smith)', type: 'General' },
    { id: 'ED-BAY-03', dept: 'ED Trauma Bay', status: 'Available', patient: null, type: 'General' },
    { id: 'PSY-BED-01', dept: 'Psychiatric Crisis Unit', status: 'Occupied', patient: 'P-6620 (Aarav Patel)', type: 'Mental Health' },
    { id: 'PSY-BED-02', dept: 'Psychiatric Crisis Unit', status: 'Available', patient: null, type: 'Mental Health' },
  ]);

  const [assignedSuccess, setAssignedSuccess] = useState(null);

  if (!isOpen) return null;

  const handleReserveBed = (bedId) => {
    const pName = activeSession?.patientName || 'Active Patient';
    setBeds((prev) =>
      prev.map((b) =>
        b.id === bedId ? { ...b, status: 'Occupied', patient: pName } : b
      )
    );
    setAssignedSuccess(`Reserved ${bedId} for ${pName}!`);
    setTimeout(() => setAssignedSuccess(null), 2500);
    if (onAssignBed) onAssignBed(bedId);
  };

  const availableCount = beds.filter((b) => b.status === 'Available').length;
  const occupiedCount = beds.filter((b) => b.status === 'Occupied').length;

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
        width: '740px',
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
              <Bed size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e3a8a' }}>Live Hospital Bed Capacity & Reservation</h3>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Unit 7-B Emergency & ICU Capacity Manager</div>
            </div>
          </div>
          <X size={20} style={{ cursor: 'pointer', color: '#64748b' }} onClick={onClose} />
        </div>

        {/* Capacity Summary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.85rem' }}>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.85rem', borderRadius: '10px', textAlgn: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700 }}>Beds Available</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a', marginTop: '0.2rem' }}>{availableCount} Available</div>
          </div>

          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '0.85rem', borderRadius: '10px', textAlgn: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: '#991b1b', fontWeight: 700 }}>Beds Occupied</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#dc2626', marginTop: '0.2rem' }}>{occupiedCount} Occupied</div>
          </div>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.85rem', borderRadius: '10px', textAlgn: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 700 }}>Total Capacity</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284c7', marginTop: '0.2rem' }}>{beds.length} Total Bays</div>
          </div>
        </div>

        {assignedSuccess && (
          <div style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #86efac', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.825rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} /> {assignedSuccess}
          </div>
        )}

        {/* Beds Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', maxHeight: '300px', overflowY: 'auto' }}>
          {beds.map((b) => (
            <div
              key={b.id}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '0.85rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem' }}>{b.id}</span>
                  <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: b.status === 'Available' ? '#dcfce7' : '#fee2e2', color: b.status === 'Available' ? '#166534' : '#991b1b', fontWeight: 800 }}>
                    {b.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>{b.dept}</div>
                {b.patient && (
                  <div style={{ fontSize: '0.75rem', color: '#1d4ed8', fontWeight: 700, marginTop: '0.15rem' }}>
                    Patient: {b.patient}
                  </div>
                )}
              </div>

              {b.status === 'Available' && (
                <button
                  onClick={() => handleReserveBed(b.id)}
                  style={{
                    background: '#1d4ed8',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.4rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Reserve Bed
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
