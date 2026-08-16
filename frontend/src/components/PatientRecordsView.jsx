import React from 'react';

export default function PatientRecordsView({ records = [], searchQuery }) {
  const filtered = records.filter(r => 
    !searchQuery || 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>Patient Records Directory</h2>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
          Resolved identity profiles and historical medical triage logs.
        </p>
      </div>

      <table className="session-table">
        <thead>
          <tr>
            <th>PATIENT ID</th>
            <th>NAME & DEMOGRAPHICS</th>
            <th>PHONE CONTACT</th>
            <th>MATCH PROBABILITY</th>
            <th>LAST TRIAGE VISIT</th>
            <th>TRIAGE STATUS</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(r => (
            <tr key={r.id}>
              <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#0284c7' }}>{r.id}</td>
              <td>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{r.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>DOB: {r.dob} ({r.age})</div>
              </td>
              <td>{r.phone}</td>
              <td>
                <span style={{ color: '#0284c7', fontWeight: 700 }}>{r.matchScore}</span>
              </td>
              <td style={{ fontFamily: 'var(--font-mono)', color: '#64748b' }}>{r.lastVisit}</td>
              <td>
                <span className={r.status.includes('Emergency') ? 'badge-level1' : r.status.includes('Mental') ? 'badge-mhurgent' : 'badge-level4'}>
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
