import React, { useState } from 'react';
import { MessageSquare, Mic, Activity, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

export default function SessionOverviewView({ sessions = [], onSelectSession, searchQuery }) {
  const [filterCategory, setFilterCategory] = useState('All');

  const filteredSessions = sessions.filter((sess) => {
    // Filter by Category
    if (filterCategory === 'Emergency' && sess.decisionType !== 'Emergency') return false;
    if (filterCategory === 'General' && sess.decisionType !== 'General') return false;
    if (filterCategory === 'Mental Health' && sess.decisionType !== 'Mental Health') return false;

    // Filter by Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        sess.id.toLowerCase().includes(q) ||
        sess.patientName.toLowerCase().includes(q) ||
        sess.patientDetails.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header & Filter Pills */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>Session History</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
            Review past triage records and audit logs.
          </p>
        </div>

        <div className="filter-pills">
          {['All', 'Emergency', 'General', 'Mental Health'].map((cat) => (
            <button
              key={cat}
              className={`filter-pill ${filterCategory === cat ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Session History Table */}
      <table className="session-table">
        <thead>
          <tr>
            <th>SESSION ID</th>
            <th>PATIENT INFO</th>
            <th>MODALITIES</th>
            <th>DECISION</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {filteredSessions.map((sess) => (
            <tr key={sess.id} style={{ cursor: 'pointer' }} onClick={() => onSelectSession(sess.sessionId)}>
              <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#0284c7' }}>
                {sess.id}
              </td>
              <td>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{sess.patientName}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{sess.patientDetails}</div>
              </td>
              <td>
                <div style={{ display: 'flex', gap: '0.4rem', color: '#64748b' }}>
                  {sess.modalities && sess.modalities.includes('text') && <MessageSquare size={16} title="Text" />}
                  {sess.modalities && sess.modalities.includes('audio') && <Mic size={16} title="Audio" />}
                  {sess.modalities && sess.modalities.includes('sensor') && <Activity size={16} title="Sensor" />}
                </div>
              </td>
              <td>
                <span className={sess.badgeClass}>{sess.decisionCode}</span>
              </td>
              <td>
                <button
                  className="btn-ctrl"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSession(sess.sessionId);
                  }}
                >
                  <Eye size={12} /> View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Table Pagination Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.85rem' }}>
        <div>
          Showing <strong>1-{filteredSessions.length}</strong> of <strong>{sessions.length}</strong> sessions
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-ctrl"><ChevronLeft size={16} /></button>
          <button className="btn-ctrl"><ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  );
}
