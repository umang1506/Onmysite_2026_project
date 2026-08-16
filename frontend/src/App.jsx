import React, { useState } from 'react';
import { Activity, Shield, RefreshCw } from 'lucide-react';
import PatientTimeline from './components/PatientTimeline';
import TriageDecision from './components/TriageDecision';
import PatientStatePanel from './components/PatientStatePanel';
import ReplayPanel from './components/ReplayPanel';

export default function App() {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [triageData, setTriageData] = useState(null);
  const [sessionState, setSessionState] = useState(null);

  const handleReplayComplete = (finalState, eventsRun) => {
    setCurrentEvents(eventsRun || []);
    setTriageData(finalState);
    setSessionState({
      patient_id: finalState.patient_id,
      identity: finalState.patient_state?.identity || {},
      latest_symptom: finalState.patient_state?.latest_symptom || null,
      latest_telemetry: finalState.patient_state?.latest_telemetry || {}
    });
  };

  const handleReset = () => {
    setCurrentEvents([]);
    setTriageData(null);
    setSessionState(null);
  };

  return (
    <div className="app-container">
      <header>
        <div className="brand-title">
          <Activity size={28} color="#818cf8" /> Onmysite Clinical Triage & Reconciliation System
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={handleReset}>
            <RefreshCw size={16} /> Clear View
          </button>
          <span style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '9999px', color: '#a5b4fc', fontWeight: 600 }}>
            v1.0 Deterministic Engine
          </span>
        </div>
      </header>

      <ReplayPanel onReplayComplete={handleReplayComplete} />

      <div className="dashboard-grid">
        <PatientTimeline events={currentEvents} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <PatientStatePanel sessionState={sessionState} />
          <TriageDecision triageData={triageData} />
        </div>
      </div>
    </div>
  );
}
