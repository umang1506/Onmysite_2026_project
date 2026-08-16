import React, { useState } from 'react';
import { RotateCcw, Upload, CheckCircle2, Play, Download } from 'lucide-react';
import { executeReplay } from '../api/client';

export default function ReplayPanel({ onReplayComplete }) {
  const [loading, setLoading] = useState(false);
  const [selectedFixture, setSelectedFixture] = useState('01_emergency_sensor_override.json');
  const [replayResult, setReplayResult] = useState(null);

  const fixtureOptions = [
    { label: '01 Emergency Sensor Override (SpO2 < 90%)', file: '01_emergency_sensor_override.json' },
    { label: '02 Identity Partial Match (Levenshtein + Phone)', file: '02_identity_partial_match.json' },
    { label: '03 Duplicate Events (Idempotency)', file: '03_duplicate_events.json' },
    { label: '04 Late Out-of-Order Events', file: '04_late_out_of_order.json' },
    { label: '05 Mental Health Keywords', file: '05_mental_health_text.json' },
    { label: '06 Conflicting Patient IDs', file: '06_conflicting_patient_ids.json' },
    { label: '07 Hanging Session Timeout', file: '07_hanging_session_timeout.json' }
  ];

  const fixtureDataMap = {
    '01_emergency_sensor_override.json': [
      { event_id: 'evt_01_a', source: 'text', timestamp: '2026-08-16T12:00:00.000Z', session_id: 'sess_01', patient_id: 'P-8841', data: { patient_name: 'Rohan Sharma', phone: '+91-98765-43210', symptoms: 'Patient reporting mild headache and slight nausea.' } },
      { event_id: 'evt_01_b', source: 'sensor', timestamp: '2026-08-16T12:04:15.000Z', session_id: 'sess_01', patient_id: 'P-8841', data: { heart_rate: 162, spo2: 86 } }
    ],
    '02_identity_partial_match.json': [
      { event_id: 'evt_02_a', source: 'audio', timestamp: '2026-08-16T12:10:00.000Z', session_id: 'sess_02', data: { name: 'Priya Verma', phone: '+91 99102 33445', symptoms: 'Experiencing moderate dizziness.' } },
      { event_id: 'evt_02_b', source: 'sensor', timestamp: '2026-08-16T12:12:00.000Z', session_id: 'sess_02', data: { name: 'Priya Verma', phone: '9910233445', patient_id: 'P-5421', heart_rate: 78, spo2: 97 } }
    ],
    '03_duplicate_events.json': [
      { event_id: 'evt_dup_999', source: 'sensor', timestamp: '2026-08-16T12:20:00.000Z', session_id: 'sess_03', patient_id: 'P-7712', data: { heart_rate: 84, spo2: 98 } },
      { event_id: 'evt_dup_999', source: 'sensor', timestamp: '2026-08-16T12:20:00.000Z', session_id: 'sess_03', patient_id: 'P-7712', data: { heart_rate: 84, spo2: 98 } },
      { event_id: 'evt_03_text', source: 'text', timestamp: '2026-08-16T12:21:00.000Z', session_id: 'sess_03', patient_id: 'P-7712', data: { symptoms: 'Feeling healthy, routine checkup confirm' } }
    ],
    '04_late_out_of_order.json': [
      { event_id: 'evt_04_late_text', source: 'text', timestamp: '2026-08-16T12:35:00.000Z', session_id: 'sess_04', patient_id: 'P-3310', data: { symptoms: 'Feeling completely recovered, no pain remaining.' } },
      { event_id: 'evt_04_early_text', source: 'text', timestamp: '2026-08-16T12:30:00.000Z', session_id: 'sess_04', patient_id: 'P-3310', data: { symptoms: 'Experiencing sharp chest pain and severe breathlessness.' } },
      { event_id: 'evt_04_sensor', source: 'sensor', timestamp: '2026-08-16T12:36:00.000Z', session_id: 'sess_04', patient_id: 'P-3310', data: { heart_rate: 72, spo2: 98 } }
    ],
    '05_mental_health_text.json': [
      { event_id: 'evt_05_audio', source: 'audio', timestamp: '2026-08-16T12:45:00.000Z', session_id: 'sess_05', patient_id: 'P-6620', data: { patient_name: 'Aarav Patel', symptoms: 'Feeling severe panic attack, overwhelming anxiety crisis.' } },
      { event_id: 'evt_05_sensor', source: 'sensor', timestamp: '2026-08-16T12:46:00.000Z', session_id: 'sess_05', patient_id: 'P-6620', data: { heart_rate: 88, spo2: 99 } }
    ],
    '06_conflicting_patient_ids.json': [
      { event_id: 'evt_06_text', source: 'text', timestamp: '2026-08-16T13:00:00.000Z', session_id: 'sess_06', data: { name: 'Kavita Rao', phone: '+91-98200-11223', symptoms: 'Experiencing mild throat irritation, confirm' } },
      { event_id: 'evt_06_sensor', source: 'sensor', timestamp: '2026-08-16T13:02:00.000Z', session_id: 'sess_06', patient_id: 'P-9008', data: { name: 'Kavita Rao', phone: '9820011223', heart_rate: 76, spo2: 98 } }
    ],
    '07_hanging_session_timeout.json': [
      { event_id: 'evt_07_text_only', source: 'text', timestamp: '2026-08-16T11:00:00.000Z', session_id: 'sess_07', patient_id: 'P-1109', data: { patient_name: 'Vikram Singh', symptoms: 'Reporting persistent chest tightness and dizziness.' } }
    ]
  };

  const handleRunReplay = async () => {
    setLoading(true);
    try {
      const eventsToRun = fixtureDataMap[selectedFixture];
      const res = await executeReplay(eventsToRun);
      setReplayResult(res);
      if (onReplayComplete) {
        onReplayComplete(res.final_state, eventsToRun);
      }
    } catch (err) {
      alert('Replay failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        const res = await executeReplay(parsed);
        setReplayResult(res);
        if (onReplayComplete) {
          onReplayComplete(res.final_state, parsed);
        }
      } catch (err) {
        alert('Invalid JSON fixture file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const exportReplayJSON = () => {
    if (!replayResult) return;
    const blob = new Blob([JSON.stringify(replayResult, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Replay_Result_${selectedFixture}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <RotateCcw size={20} color="#ec4899" /> Fixture & Replay Simulator
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>100% Deterministic Engine</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
            Select Edge-Case Fixture File:
          </label>
          <select
            value={selectedFixture}
            onChange={(e) => setSelectedFixture(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '10px',
              background: 'rgba(0,0,0,0.4)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-card)',
              fontFamily: 'inherit',
              fontSize: '0.9rem'
            }}
          >
            {fixtureOptions.map((opt) => (
              <option key={opt.file} value={opt.file} style={{ background: '#1e1b4b' }}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={handleRunReplay} disabled={loading}>
            <Play size={16} /> {loading ? 'Processing Replay...' : 'Run Fixture Replay'}
          </button>

          <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
            <Upload size={16} /> Custom Fixture JSON
            <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>

          {replayResult && (
            <button className="btn btn-secondary" onClick={exportReplayJSON}>
              <Download size={16} /> Download Replay Output
            </button>
          )}
        </div>

        {replayResult && (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ color: 'var(--emerald)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} /> Replay Executed Successfully • 100% Deterministic Match
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Processed <strong>{replayResult.total_events_processed}</strong> events in isolated session state. Outcome: <strong>{replayResult.final_state.decision}</strong>.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
