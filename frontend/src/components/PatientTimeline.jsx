import React from 'react';
import { Activity, MessageSquare, Mic } from 'lucide-react';

export default function PatientTimeline({ events = [] }) {
  const getSourceIcon = (source) => {
    switch (source) {
      case 'sensor':
        return <Activity size={18} />;
      case 'audio':
        return <Mic size={18} />;
      case 'text':
      default:
        return <MessageSquare size={18} />;
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <Activity size={20} color="#6366f1" /> Event Stream Timeline ({events.length})
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Chronological Order</span>
      </div>

      {events.length === 0 ? (
        <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '2rem' }}>
          No events ingested yet. Select a session or upload a fixture replay.
        </p>
      ) : (
        <div className="timeline-list">
          {events.map((evt, idx) => {
            const dataObj = typeof evt.data === 'object' ? evt.data : { text: String(evt.data) };
            const formattedTime = new Date(evt.timestamp).toLocaleTimeString();

            return (
              <div key={evt.event_id || idx} className="timeline-item">
                <div className={`source-icon source-${evt.source}`}>
                  {getSourceIcon(evt.source)}
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {evt.source.toUpperCase()} Event ({evt.event_id})
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{formattedTime}</span>
                  </div>

                  {evt.source === 'sensor' ? (
                    <div style={{ fontSize: '0.85rem', color: 'var(--sky)' }}>
                      SpO₂: <strong>{dataObj.spo2 ?? dataObj.SpO2 ?? 'N/A'}%</strong> | HR: <strong>{dataObj.heart_rate ?? dataObj.hr ?? 'N/A'} bpm</strong>
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      "{dataObj.symptoms || dataObj.text || JSON.stringify(dataObj)}"
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
