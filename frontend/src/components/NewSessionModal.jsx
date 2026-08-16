import React, { useState, useRef } from 'react';
import { X, Play, Mic, MicOff, Sparkles } from 'lucide-react';
import { sendEvent, fetchTriage } from '../api/client';

export default function NewSessionModal({ isOpen, onClose, onSessionCreated }) {
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [spo2, setSpo2] = useState('88');
  const [hr, setHr] = useState('112');
  const [source, setSource] = useState('audio');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  if (!isOpen) return null;

  const handleVoiceRecord = () => {
    // 1. Check for Browser SpeechRecognition API support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      if (isRecording) {
        if (recognitionRef.current) recognitionRef.current.stop();
        setIsRecording(false);
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsRecording(true);
          setSymptoms('Listening to voice audio intake...');
        };

        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((res) => res[0].transcript)
            .join('');
          setSymptoms(transcript);
          setSource('audio');
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
        return;
      } catch (e) {
        // Fallback to simulated audio if browser blocks speech recognition
      }
    }

    // 2. Simulated Speech-to-Text Fallback
    setIsRecording(true);
    setSymptoms('Listening to voice audio intake...');
    setTimeout(() => {
      setIsRecording(false);
      setSymptoms('Patient audio transcript: "Patient states chest pain began abruptly 20 minutes ago. Radiating to left arm with cold sweat."');
      setSource('audio');
    }, 1800);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const sessionId = `TRG-${Math.floor(100 + Math.random() * 900)}X`;
    const patientId = `P-${Math.floor(10000 + Math.random() * 90000)}`;

    const formData = {
      patientName: patientName || 'John Doe',
      phone: phone || '+1-555-0192',
      symptoms: symptoms || 'Patient states chest pain began abruptly 20 minutes ago.',
      spo2,
      hr,
      source
    };

    try {
      // 1. Send Text/Audio Event
      await sendEvent({
        event_id: `EV-${Date.now()}-A`,
        source: source,
        timestamp: new Date().toISOString(),
        session_id: sessionId,
        patient_id: patientId,
        data: {
          patient_name: formData.patientName,
          phone: formData.phone,
          symptoms: formData.symptoms
        }
      });

      // 2. Send Sensor Telemetry Event
      await sendEvent({
        event_id: `EV-${Date.now()}-B`,
        source: 'sensor',
        timestamp: new Date().toISOString(),
        session_id: sessionId,
        patient_id: patientId,
        data: {
          heart_rate: Number(hr),
          spo2: Number(spo2)
        }
      });

      // 3. Trigger Triage Evaluation
      const triageResult = await fetchTriage(sessionId);

      onSessionCreated({
        sessionId,
        patientId,
        formData,
        triageResult
      });

      onClose();
    } catch (err) {
      alert('Failed to launch triage session: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        width: '500px',
        padding: '1.5rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>+ Launch New Triage Session</h3>
          <X size={18} style={{ cursor: 'pointer', color: '#64748b' }} onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>Patient Name</label>
            <input
              type="text"
              className="search-input"
              style={{ width: '100%' }}
              placeholder="e.g. John Doe"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>Phone Number</label>
              <input
                type="text"
                className="search-input"
                style={{ width: '100%' }}
                placeholder="+1-555-0192"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>Input Modality</label>
              <select
                className="search-input"
                style={{ width: '100%' }}
                value={source}
                onChange={(e) => setSource(e.target.value)}
              >
                <option value="audio">Audio Transcription</option>
                <option value="text">Text Report</option>
              </select>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Symptom Description</label>
              <button
                type="button"
                className="btn-ctrl"
                onClick={handleVoiceRecord}
                style={{ background: isRecording ? '#fef2f2' : '#e0f2fe', color: isRecording ? '#dc2626' : '#0284c7', border: '1px solid #bae6fd', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}
              >
                {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
                {isRecording ? 'Stop Listening...' : 'Record Voice Audio'}
              </button>
            </div>
            <textarea
              className="search-input"
              style={{ width: '100%', height: '75px', resize: 'none' }}
              placeholder="Patient states chest pain began abruptly 20 minutes ago..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626', display: 'block', marginBottom: '0.2rem' }}>SpO₂ Level (%)</label>
              <input
                type="number"
                className="search-input"
                style={{ width: '100%', borderColor: Number(spo2) < 90 ? '#fca5a5' : '#cbd5e1' }}
                value={spo2}
                onChange={(e) => setSpo2(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', display: 'block', marginBottom: '0.2rem' }}>Heart Rate (bpm)</label>
              <input
                type="number"
                className="search-input"
                style={{ width: '100%' }}
                value={hr}
                onChange={(e) => setHr(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn-ctrl" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-new-session" style={{ margin: 0 }} disabled={loading}>
              <Play size={14} /> {loading ? 'Launching...' : 'Run Triage Engine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
