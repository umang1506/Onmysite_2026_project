import React from 'react';
import { Bed, UserCheck, ShieldAlert } from 'lucide-react';

export default function DirectAdmissionsView() {
  const admissions = [
    { id: 'ADM-101', patient: 'Doe, John', unit: 'ICU Bed 4B', status: 'Admitted (Level 1 Emergency)', time: '10:45 AM', doctor: 'Dr. Rivera' },
    { id: 'ADM-102', patient: 'Kaur, Harpreet', unit: 'Cardiac Ward 2A', status: 'Transfer Pending', time: '11:15 AM', doctor: 'Dr. Mehta' },
    { id: 'ADM-103', patient: 'Chen, Wei', unit: 'Observation Unit 1', status: 'Stable Monitoring', time: '12:00 PM', doctor: 'Dr. Taylor' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>Direct Hospital Admissions Queue</h2>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
          Patients transferred directly from Emergency Triage feeds to hospital beds.
        </p>
      </div>

      <table className="session-table">
        <thead>
          <tr>
            <th>ADMISSION ID</th>
            <th>PATIENT NAME</th>
            <th>ASSIGNED UNIT / BED</th>
            <th>ADMISSION STATUS</th>
            <th>ADMISSION TIME</th>
            <th>ATTENDING PHYSICIAN</th>
          </tr>
        </thead>
        <tbody>
          {admissions.map(a => (
            <tr key={a.id}>
              <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#0284c7' }}>{a.id}</td>
              <td style={{ fontWeight: 700, color: '#0f172a' }}>{a.patient}</td>
              <td>
                <span style={{ fontWeight: 600, color: '#1e3a8a' }}>{a.unit}</span>
              </td>
              <td>
                <span className={a.status.includes('Admitted') ? 'badge-level1' : 'badge-level4'}>
                  {a.status}
                </span>
              </td>
              <td style={{ fontFamily: 'var(--font-mono)', color: '#64748b' }}>{a.time}</td>
              <td style={{ fontWeight: 600 }}>{a.doctor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
