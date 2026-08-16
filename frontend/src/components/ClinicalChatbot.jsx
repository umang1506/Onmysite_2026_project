import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { sendEvent, fetchTriage } from '../api/client';

export default function ClinicalChatbot({ onNewSessionCreated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! I am your Clinical AI Triage Assistant. You can describe patient symptoms, report sensor vitals, or ask about system triage rules.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMsg;
    if (!text.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputMsg('');
    setLoading(true);

    try {
      const lowerText = text.toLowerCase();

      // Check if user is asking a Q&A / explanation question
      if (lowerText.includes('explain') || lowerText.includes('how does') || lowerText.includes('rule') || lowerText.includes('identity')) {
        let reply = '';
        if (lowerText.includes('identity')) {
          reply = 'IDENTITY RESOLUTION: Uses exact patient_id (+1.0), normalized phone (+0.4), Levenshtein name distance (+0.3), and symptom overlap (+0.2) to match patient profiles without non-deterministic ML.';
        } else if (lowerText.includes('spo2') || lowerText.includes('sensor') || lowerText.includes('override')) {
          reply = 'PRIORITY OVERRIDE RULE: Objective vitals (SpO2 < 90% or HR > 150 bpm) automatically override calm patient text reports, escalating status to Emergency immediately.';
        } else {
          reply = 'TRIAGE ENGINE RULES: Evaluates input events in 3 tiers: 1. Sensor Vitals Override (SpO2 < 90%), 2. Emergency/Mental Health Keywords, 3. General Triage default. Session timeouts trigger after 5 minutes of missing sensor data.';
        }

        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'bot',
              text: reply,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
          setLoading(false);
        }, 600);
        return;
      }

      // Live Triage Event Submission to Express Backend API!
      const sessionId = `TRG-${Math.floor(100 + Math.random() * 900)}C`;
      const patientId = `P-${Math.floor(10000 + Math.random() * 90000)}`;

      // Infer vitals from text or set test defaults
      let inferredSpo2 = 98;
      let inferredHr = 76;

      if (lowerText.includes('chest pain') || lowerText.includes('breathless') || lowerText.includes('unconscious') || lowerText.includes('88%') || lowerText.includes('emergency')) {
        inferredSpo2 = 88;
        inferredHr = 112;
      } else if (lowerText.includes('panic') || lowerText.includes('anxiety') || lowerText.includes('suicidal')) {
        inferredSpo2 = 99;
        inferredHr = 88;
      }

      // 1. Send Text Event to Backend API
      await sendEvent({
        event_id: `EV-CHAT-${Date.now()}-A`,
        source: 'text',
        timestamp: new Date().toISOString(),
        session_id: sessionId,
        patient_id: patientId,
        data: {
          patient_name: 'Chat Intake Patient',
          phone: '+1 (555) 992-0192',
          symptoms: text
        }
      });

      // 2. Send Sensor Event to Backend API
      await sendEvent({
        event_id: `EV-CHAT-${Date.now()}-B`,
        source: 'sensor',
        timestamp: new Date().toISOString(),
        session_id: sessionId,
        patient_id: patientId,
        data: {
          heart_rate: inferredHr,
          spo2: inferredSpo2
        }
      });

      // 3. Trigger Triage Evaluation
      const triageResult = await fetchTriage(sessionId);

      const decision = triageResult.decision || 'General';
      const explanation = triageResult.explanation || 'Evaluated by Onmysite Triage Engine.';

      const botReplyText = `Intake Event Ingested! Triage Decision: [${decision.toUpperCase()}]. Explanation: ${explanation}`;

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: 'bot',
          text: botReplyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          triageDecision: decision
        }
      ]);

      // Notify App to add session to live feed and patient records
      if (onNewSessionCreated) {
        onNewSessionCreated({
          sessionId,
          patientId,
          formData: {
            patientName: 'Chat Intake Patient',
            phone: '+1 (555) 992-0192',
            symptoms: text,
            spo2: String(inferredSpo2),
            hr: String(inferredHr),
            source: 'text'
          },
          triageResult
        });
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 3,
          sender: 'bot',
          text: `Engine Error: ${err.message}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Trigger Badge */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            background: 'linear-gradient(135deg, #0284c7 0%, #1e3a8a 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '9999px',
            padding: '0.85rem 1.4rem',
            fontWeight: 700,
            fontSize: '0.9rem',
            boxShadow: '0 10px 25px rgba(2, 132, 199, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            zIndex: 999
          }}
        >
          <Bot size={22} />
          <span>Clinical AI Assistant</span>
          <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '50%', fontWeight: 800 }}>LIVE</span>
        </button>
      )}

      {/* Expandable Chat Drawer Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            width: '380px',
            height: '520px',
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 1000
          }}
        >
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)', color: '#ffffff', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bot size={20} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Clinical AI Assistant</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>Connected to Deterministic Engine</div>
              </div>
            </div>
            <X size={18} style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
          </div>

          {/* Messages Feed */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#f8fafc' }}>
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '0.75rem 0.9rem',
                    borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    background: m.sender === 'user' ? '#0284c7' : '#ffffff',
                    color: m.sender === 'user' ? '#ffffff' : '#0f172a',
                    border: m.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                    fontSize: '0.825rem',
                    lineHeight: '1.4',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                >
                  {m.text}
                </div>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.2rem' }}>{m.time}</span>
              </div>
            ))}
            {loading && (
              <div style={{ color: '#0284c7', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Sparkles size={14} className="spin" /> Evaluating events in engine...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Preset Quick Chips */}
          <div style={{ padding: '0.5rem 0.75rem', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.35rem', overflowX: 'auto' }}>
            <button
              onClick={() => handleSendMessage('Patient states severe chest pain abruptly 20 mins ago')}
              style={{ padding: '0.25rem 0.6rem', borderRadius: '12px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', fontSize: '0.7rem', fontWeight: 600, whitespace: 'nowrap', cursor: 'pointer' }}
            >
              🚨 Test Chest Pain (Emergency)
            </button>
            <button
              onClick={() => handleSendMessage('Patient having severe panic attack and anxiety')}
              style={{ padding: '0.25rem 0.6rem', borderRadius: '12px', background: '#faf5ff', color: '#9333ea', border: '1px solid #d8b4fe', fontSize: '0.7rem', fontWeight: 600, whitespace: 'nowrap', cursor: 'pointer' }}
            >
              💜 Test Panic Attack
            </button>
            <button
              onClick={() => handleSendMessage('Explain how identity matching works')}
              style={{ padding: '0.25rem 0.6rem', borderRadius: '12px', background: '#e0f2fe', color: '#0284c7', border: '1px solid #bae6fd', fontSize: '0.7rem', fontWeight: 600, whitespace: 'nowrap', cursor: 'pointer' }}
            >
              ❓ Explain Identity Matching
            </button>
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            style={{ padding: '0.75rem', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem' }}
          >
            <input
              type="text"
              className="search-input"
              style={{ flex: 1, height: '38px' }}
              placeholder="Describe symptoms or ask a rule question..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
            />
            <button type="submit" className="btn-primary" style={{ padding: '0.5rem 0.85rem', height: '38px' }} disabled={loading}>
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
