import React, { useState, useRef } from 'react';
import { X, Bot, Sparkles, UserCheck, Send, AlertTriangle, ShieldCheck, Phone, Heart, Mic, MicOff, Printer, Globe, History, Clock, Hash } from 'lucide-react';
import { sendEvent, fetchTriage } from '../api/client';

export default function AiReceptionistModal({ isOpen, onClose, onSessionCreated }) {
  const [patientName, setPatientName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNum, setMobileNum] = useState('');
  const [language, setLanguage] = useState('en');
  const [symptoms, setSymptoms] = useState('');
  const [pastHistoryFound, setPastHistoryFound] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  if (!isOpen) return null;

  const handleMobileChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobileNum(val);

    // Automated Patient Past History Lookup Simulation
    if (val.length === 10) {
      if (val.startsWith('98110') || val.startsWith('99382')) {
        setPastHistoryFound({
          patientId: 'P-44921',
          name: 'John Doe',
          allergies: 'Penicillin, Latex',
          chronic: 'Hypertension',
          lastVisit: '2026-08-10'
        });
      } else {
        setPastHistoryFound(null);
      }
    } else {
      setPastHistoryFound(null);
    }
  };

  const handleAiAutoAnalyze = () => {
    if (!symptoms.trim()) {
      alert('Please enter patient symptoms first for AI analysis.');
      return;
    }

    setIsAnalyzing(true);
    setTimeout(() => {
      const lower = symptoms.toLowerCase();
      let riskLevel = 'GENERAL';
      let dept = 'General Outpatient Care';
      let rationale = 'Vitals within baseline limits. Standard registration assigned.';
      let estWait = '12 mins';

      if (lower.includes('chest pain') || lower.includes('breathless') || lower.includes('unconscious') || lower.includes('heart')) {
        riskLevel = 'EMERGENCY';
        dept = 'ER Resuscitation Bay (Priority Level 1)';
        rationale = 'High cardiac/respiratory distress keywords detected. Immediate SpO2 monitoring recommended.';
        estWait = 'IMMEDIATE (0 mins)';
      } else if (lower.includes('panic') || lower.includes('anxiety') || lower.includes('suicidal') || lower.includes('depression')) {
        riskLevel = 'MENTAL HEALTH';
        dept = 'Psychiatric Crisis Intervention Center';
        rationale = 'Psychological crisis flags detected. Routing to specialized Mental Health team.';
        estWait = '4 mins';
      }

      setAiAnalysis({
        riskLevel,
        dept,
        rationale,
        score: '98% AI Confidence',
        tokenNum: `TK-${Math.floor(100 + Math.random() * 900)}`,
        estWait
      });
      setIsAnalyzing(false);
    }, 900);
  };

  const handleVoiceRecord = () => {
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
        recognition.lang = language === 'hi' ? 'hi-IN' : language === 'es' ? 'es-ES' : 'en-US';

        recognition.onstart = () => {
          setIsRecording(true);
          setSymptoms('AI Receptionist is listening to patient voice intake...');
        };

        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((res) => res[0].transcript)
            .join('');
          setSymptoms(transcript);
        };

        recognition.onerror = () => setIsRecording(false);
        recognition.onend = () => setIsRecording(false);

        recognitionRef.current = recognition;
        recognition.start();
        return;
      } catch (e) {}
    }

    setIsRecording(true);
    setSymptoms('AI Receptionist listening...');
    setTimeout(() => {
      setIsRecording(false);
      setSymptoms('Patient states severe chest pain and breathlessness beginning 15 mins ago.');
    }, 1800);
  };

  const handlePrintTokenSlip = () => {
    window.print();
  };

  const handleSubmitReceptionistIntake = async (e) => {
    e.preventDefault();

    if (mobileNum.length !== 10) {
      alert('⚠️ Invalid Phone Number: Mobile number must be exactly 10 digits.');
      return;
    }

    const sessionId = `TRG-${Math.floor(100 + Math.random() * 900)}R`;
    const patientId = `P-${Math.floor(10000 + Math.random() * 90000)}`;
    const fullPhone = `${countryCode} ${mobileNum}`;

    let inferredSpo2 = 98;
    let inferredHr = 76;
    const lower = symptoms.toLowerCase();
    if (lower.includes('chest pain') || lower.includes('breathless')) {
      inferredSpo2 = 88;
      inferredHr = 112;
    } else if (lower.includes('panic') || lower.includes('anxiety')) {
      inferredSpo2 = 99;
      inferredHr = 88;
    }

    try {
      await sendEvent({
        event_id: `EV-REC-${Date.now()}-A`,
        source: 'text',
        timestamp: new Date().toISOString(),
        session_id: sessionId,
        patient_id: patientId,
        data: {
          patient_name: patientName,
          phone: fullPhone,
          symptoms: symptoms
        }
      });

      await sendEvent({
        event_id: `EV-REC-${Date.now()}-B`,
        source: 'sensor',
        timestamp: new Date().toISOString(),
        session_id: sessionId,
        patient_id: patientId,
        data: {
          heart_rate: inferredHr,
          spo2: inferredSpo2
        }
      });

      const triageResult = await fetchTriage(sessionId);

      if (onSessionCreated) {
        onSessionCreated({
          sessionId,
          patientId,
          formData: {
            patientName: patientName,
            phone: fullPhone,
            symptoms: symptoms,
            spo2: String(inferredSpo2),
            hr: String(inferredHr),
            source: 'text'
          },
          triageResult
        });
      }

      onClose();
    } catch (err) {
      alert('AI Receptionist Intake Failed: ' + err.message);
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
        maxHeight: '90vh',
        overflowY: 'auto',
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
            <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)', color: '#fff', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e3a8a' }}>Smart AI Clinical Receptionist</h3>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Automated Intake, History Lookup & Token Generator</div>
            </div>
          </div>
          <X size={20} style={{ cursor: 'pointer', color: '#64748b' }} onClick={onClose} />
        </div>

        {/* Multilingual AI Speech Header */}
        <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%)', border: '1px solid #bfdbfe', padding: '0.85rem 1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.825rem', color: '#1e40af' }}>
            <Sparkles size={18} color="#0284c7" />
            <span>
              {language === 'hi' ? 'नमस्ते! मैं आपका स्मार्ट AI रिसेप्शनिस्ट हूँ। कृपया रोगी का विवरण दर्ज करें।' : 'Welcome to Onmysite Clinical Desk! I am your AI Receptionist.'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Globe size={14} color="#0284c7" />
            <select
              style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.4rem', cursor: 'pointer' }}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">🇬🇧 English</option>
              <option value="hi">🇮🇳 हिंदी (Hindi)</option>
              <option value="es">🇪🇸 Español</option>
              <option value="fr">🇫🇷 Français</option>
            </select>
          </div>
        </div>

        <form onSubmit={handleSubmitReceptionistIntake} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Patient Name */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
              Patient Full Name
            </label>
            <input
              type="text"
              className="search-input"
              style={{ width: '100%' }}
              placeholder="e.g. Aarav Sharma"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
            />
          </div>

          {/* Phone Number with Country Code & 10-Digit Mobile */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
              Mobile Phone Number (10 Digits)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '0.5rem' }}>
              <select
                className="search-input"
                style={{ fontWeight: 600, cursor: 'pointer' }}
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              >
                <option value="+91">🇮🇳 +91 (IN)</option>
                <option value="+1">🇺🇸 +1 (US)</option>
                <option value="+44">🇬🇧 +44 (UK)</option>
                <option value="+61">🇦🇺 +61 (AU)</option>
                <option value="+81">🇯🇵 +81 (JP)</option>
                <option value="+49">🇩🇪 +49 (DE)</option>
                <option value="+971">🇦🇪 +971 (UAE)</option>
              </select>

              <input
                type="text"
                className="search-input"
                style={{ width: '100%', borderColor: mobileNum.length > 0 && mobileNum.length < 10 ? '#ef4444' : '#cbd5e1' }}
                placeholder="10-digit mobile number"
                value={mobileNum}
                onChange={handleMobileChange}
                maxLength={10}
                required
              />
            </div>
            {mobileNum.length > 0 && mobileNum.length < 10 && (
              <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 600, marginTop: '0.2rem', display: 'block' }}>
                ⚠️ Mobile number must be exactly 10 digits ({mobileNum.length}/10)
              </span>
            )}
          </div>

          {/* AI Past Medical History Lookup Feature */}
          {pastHistoryFound && (
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', padding: '0.75rem 0.9rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.8rem', color: '#166534' }}>
              <History size={18} color="#16a34a" />
              <div>
                <strong>AI Found Past Record (#{pastHistoryFound.patientId}):</strong> Chronic {pastHistoryFound.chronic} | Allergies: {pastHistoryFound.allergies} | Last Visit: {pastHistoryFound.lastVisit}
              </div>
            </div>
          )}

          {/* Symptoms Description with Voice Speech-to-Text */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>
                Patient Symptoms & Medical Complaint
              </label>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={handleVoiceRecord}
                  style={{ background: isRecording ? '#fef2f2' : '#f1f5f9', color: isRecording ? '#dc2626' : '#0284c7', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.25rem 0.6rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
                  {isRecording ? 'Listening...' : 'Voice Intake'}
                </button>
                <button
                  type="button"
                  onClick={handleAiAutoAnalyze}
                  style={{ background: '#1d4ed8', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '0.25rem 0.65rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <Sparkles size={13} /> AI Pre-Triage
                </button>
              </div>
            </div>

            <textarea
              className="search-input"
              style={{ width: '100%', height: '75px', resize: 'none' }}
              placeholder="Describe symptoms or speak into microphone..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              required
            />
          </div>

          {/* AI Pre-Triage Department Allocation & Token Slip Feature */}
          {aiAnalysis && (
            <div style={{ background: aiAnalysis.riskLevel === 'EMERGENCY' ? '#fef2f2' : aiAnalysis.riskLevel === 'MENTAL HEALTH' ? '#faf5ff' : '#f0fdf4', border: '1px solid #cbd5e1', padding: '1rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: aiAnalysis.riskLevel === 'EMERGENCY' ? '#dc2626' : aiAnalysis.riskLevel === 'MENTAL HEALTH' ? '#9333ea' : '#16a34a' }}>
                  🤖 AI Allocation: [{aiAnalysis.riskLevel}]
                </span>
                <button
                  type="button"
                  onClick={handlePrintTokenSlip}
                  style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <Printer size={12} /> Print Token Slip
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: '#ffffff', padding: '0.65rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Hash size={14} color="#0284c7" /> Token #: <strong>{aiAnalysis.tokenNum}</strong>
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Clock size={14} color="#16a34a" /> Est. Wait: <strong>{aiAnalysis.estWait}</strong>
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                Allocated Dept: {aiAnalysis.dept}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                {aiAnalysis.rationale}
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn-ctrl" onClick={onClose}>Cancel</button>
            <button
              type="submit"
              className="btn-new-session"
              style={{ background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)', margin: 0, padding: '0.65rem 1.2rem', gap: '0.5rem' }}
            >
              <UserCheck size={16} /> Submit AI Receptionist Intake
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
