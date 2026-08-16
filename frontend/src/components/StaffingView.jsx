import React from 'react';
import { Users, Shield, Clock } from 'lucide-react';

export default function StaffingView() {
  const staff = [
    { name: 'Dr. Alex Rivera, MD', role: 'Senior Triage Lead', status: 'On Duty (Active Feed)', dept: 'Unit 7-B Center', shift: '07:00 - 19:00' },
    { name: 'Dr. Priya Mehta, MD', role: 'Emergency Physician', status: 'On Duty', dept: 'ED Trauma Room 1', shift: '07:00 - 19:00' },
    { name: 'Nurse Sarah Connor, RN', role: 'Triage Intake Nurse', status: 'On Duty', dept: 'Multimodal Ingestion', shift: '07:00 - 19:00' },
    { name: 'Dr. Marcus Vance, MD', role: 'Psychiatric Specialist', status: 'On Call (Mental Health)', dept: 'Mental Health Queue', shift: '24/7 On-Call' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>Emergency Department Staffing Roster</h2>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
          On-call medical directors, triage leads, and specialized intake nurses.
        </p>
      </div>

      <table className="session-table">
        <thead>
          <tr>
            <th>STAFF NAME</th>
            <th>ROLE & TITLE</th>
            <th>ASSIGNED DEPARTMENT</th>
            <th>SHIFT HOURS</th>
            <th>DUTY STATUS</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((s, idx) => (
            <tr key={idx}>
              <td style={{ fontWeight: 700, color: '#0f172a' }}>{s.name}</td>
              <td style={{ color: '#0284c7', fontWeight: 600 }}>{s.role}</td>
              <td>{s.dept}</td>
              <td style={{ fontFamily: 'var(--font-mono)', color: '#64748b' }}>{s.shift}</td>
              <td>
                <span className="badge-level4" style={{ background: '#f0fdf4', color: '#16a34a', borderColor: '#86efac' }}>
                  ● {s.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
