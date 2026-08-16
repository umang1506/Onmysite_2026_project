import React, { useState, useRef, useEffect } from 'react';
import { X, Video, Mic, MicOff, PhoneOff, VideoOff, Activity, Send, CheckCircle2 } from 'lucide-react';
import { sendEvent, fetchTriage } from '../api/client';

export default function TelehealthVideoModal({ isOpen, onClose, onSessionCreated }) {
  const [micMuted, setMicMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [clinicalNotes, setClinicalNotes] = useState('Patient states chest pain radiating to left arm observed via telehealth video call.');
  const [spo2, setSpo2] = useState('88');
  const [hr, setHr] = useState('112');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const micStreamRef = useRef(null);

  useEffect(() => {
    let animationFrameId = null;
    recordedChunksRef.current = [];

    if (isOpen) {
      // 1. Capture user's microphone & webcam audio/video
      navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
        .then((s) => {
          micStreamRef.current = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play().catch(() => {});
          }
          setCameraActive(true);
          setupStreamRecorder(s);
        })
        .catch(() => {
          navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
            .then((s) => {
              micStreamRef.current = s;
              if (videoRef.current) {
                videoRef.current.srcObject = s;
                videoRef.current.play().catch(() => {});
              }
              setCameraActive(true);
              setupStreamRecorder(s);
            })
            .catch(() => {
              setCameraActive(false);
              setupStreamRecorder(null);
            });
        });

      function setupStreamRecorder(userStream) {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let angle = 0;

        const drawFrame = () => {
          if (!canvas) return;

          // Pure Dark Clinical Grid Background
          ctx.fillStyle = '#090d16';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Grid Lines
          ctx.strokeStyle = 'rgba(255,255,255,0.04)';
          ctx.lineWidth = 1;
          for (let x = 0; x < canvas.width; x += 40) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
          }
          for (let y = 0; y < canvas.height; y += 40) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
          }

          if (!videoOff && videoRef.current && videoRef.current.readyState === 4) {
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          } else {
            ctx.fillStyle = '#1e293b';
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2 - 20, 45, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#64748b';
            ctx.font = 'bold 16px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('LIVE TELEHEALTH CLINICAL STREAM', canvas.width / 2, canvas.height / 2 + 45);
          }

          // Live ECG Waveform
          angle += 0.05;
          ctx.strokeStyle = Number(spo2) < 90 ? '#ef4444' : '#16a34a';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          for (let x = 0; x < canvas.width; x += 8) {
            const y = canvas.height - 45 + Math.sin(x * 0.05 + angle) * (x % 48 === 0 ? 18 : 3);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          // Overlay Telehealth Status Text
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 14px Inter, sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(`● TELEHEALTH INTAKE | SpO2: ${spo2}% | HR: ${hr} bpm`, 15, 30);

          animationFrameId = requestAnimationFrame(drawFrame);
        };

        drawFrame();

        try {
          const combinedStream = canvas.captureStream(30);

          // Add user's real microphone audio track so whatever the user speaks is recorded!
          if (userStream && userStream.getAudioTracks().length > 0) {
            const audioTrack = userStream.getAudioTracks()[0];
            combinedStream.addTrack(audioTrack);
          }

          let mimeType = 'video/webm';
          if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) mimeType = 'video/webm;codecs=vp9,opus';
          else if (MediaRecorder.isTypeSupported('video/webm')) mimeType = 'video/webm';

          const recorder = new MediaRecorder(combinedStream, { mimeType });
          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
              recordedChunksRef.current.push(e.data);
            }
          };
          recorder.start(200);
          mediaRecorderRef.current = recorder;
        } catch (e) {}
      }
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try { mediaRecorderRef.current.stop(); } catch (e) {}
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen, videoOff, spo2, hr]);

  if (!isOpen) return null;

  const handleSubmitTelehealthIntake = async (e) => {
    e.preventDefault();
    setLoading(true);

    const sessionId = `TRG-${Math.floor(100 + Math.random() * 900)}V`;
    const patientId = `P-${Math.floor(10000 + Math.random() * 90000)}`;

    let videoUrl = null;

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    await new Promise((resolve) => setTimeout(resolve, 350));

    if (recordedChunksRef.current.length > 0) {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      if (blob.size > 500) {
        videoUrl = URL.createObjectURL(blob);
      }
    }

    try {
      // 1. Send Audio/Video Text Event
      await sendEvent({
        event_id: `EV-VID-${Date.now()}-A`,
        source: 'audio',
        timestamp: new Date().toISOString(),
        session_id: sessionId,
        patient_id: patientId,
        data: {
          patient_name: 'John Doe (Telehealth Video)',
          phone: '+1 (555) 019-2834',
          symptoms: clinicalNotes
        }
      });

      // 2. Send Sensor Vitals Event
      await sendEvent({
        event_id: `EV-VID-${Date.now()}-B`,
        source: 'sensor',
        timestamp: new Date().toISOString(),
        session_id: sessionId,
        patient_id: patientId,
        data: {
          heart_rate: Number(hr),
          spo2: Number(spo2)
        }
      });

      // 3. Evaluate Triage Engine
      const triageResult = await fetchTriage(sessionId);

      if (onSessionCreated) {
        onSessionCreated({
          sessionId,
          patientId,
          formData: {
            patientName: 'John Doe (Telehealth Video)',
            phone: '+1 (555) 019-2834',
            symptoms: clinicalNotes,
            spo2,
            hr,
            source: 'audio'
          },
          triageResult,
          videoUrl: videoUrl
        });
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1200);
    } catch (err) {
      alert('Telehealth Video Intake Failed: ' + err.message);
    } finally {
      setLoading(false);
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
      zIndex: 1000
    }}>
      <canvas ref={canvasRef} width="640" height="360" style={{ display: 'none' }} />

      <div style={{
        background: '#0f172a',
        borderRadius: '20px',
        width: '780px',
        padding: '1.75rem',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ width: 10, height: 10, background: '#ef4444', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>● RECORDING LIVE Telehealth Video Call: John Doe (#8842)</h3>
          </div>
          <X size={20} style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={onClose} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.25rem' }}>
          {/* Left Column: Live Video Canvas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{
              width: '100%',
              height: '280px',
              background: '#090d16',
              borderRadius: '14px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              {!videoOff && cameraActive ? (
                <video
                  ref={videoRef}
                  muted={micMuted}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ color: '#64748b', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <VideoOff size={44} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>Live Telehealth Clinical Stream</div>
                </div>
              )}

              <div style={{ position: 'absolute', top: 12, right: 12, background: Number(spo2) < 90 ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800 }}>
                {Number(spo2) < 90 ? `▲ Emergency SpO2 ${spo2}%` : `✓ Stable SpO2 ${spo2}%`}
              </div>

              <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(15, 23, 42, 0.85)', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                John Doe (Patient Telehealth Feed - Recording Active)
              </div>
            </div>

            {/* In-Call Media Control Bar */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button
                type="button"
                className="btn-ctrl"
                style={{ borderRadius: '50%', width: 44, height: 44, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: micMuted ? '#ef4444' : '#334155', color: '#ffffff', border: 'none' }}
                onClick={() => setMicMuted(!micMuted)}
                title="Mute Audio"
              >
                {micMuted ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <button
                type="button"
                className="btn-ctrl"
                style={{ borderRadius: '50%', width: 44, height: 44, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: videoOff ? '#ef4444' : '#334155', color: '#ffffff', border: 'none' }}
                onClick={() => setVideoOff(!videoOff)}
                title="Toggle Camera"
              >
                {videoOff ? <VideoOff size={18} /> : <Video size={18} />}
              </button>
              <button
                type="button"
                className="btn-ctrl"
                style={{ borderRadius: '50%', width: 44, height: 44, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#dc2626', color: '#ffffff', border: 'none' }}
                onClick={onClose}
                title="End Call"
              >
                <PhoneOff size={18} />
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Clinical Telehealth Intake Form */}
          <form onSubmit={handleSubmitTelehealthIntake} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              📝 Live Video Clinical Intake
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>
                Telehealth Symptom Notes
              </label>
              <textarea
                style={{
                  width: '100%',
                  height: '110px',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  padding: '0.6rem',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  resize: 'none'
                }}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <div>
                <label style={{ fontSize: '0.7rem', color: '#fca5a5', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>SpO₂ Level (%)</label>
                <input
                  type="number"
                  style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '0.4rem', color: '#ffffff', fontSize: '0.85rem' }}
                  value={spo2}
                  onChange={(e) => setSpo2(e.target.value)}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>Heart Rate (bpm)</label>
                <input
                  type="number"
                  style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '0.4rem', color: '#ffffff', fontSize: '0.85rem' }}
                  value={hr}
                  onChange={(e) => setHr(e.target.value)}
                />
              </div>
            </div>

            {submitted && (
              <div style={{ color: '#86efac', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle2 size={16} /> Video Recording & Intake Saved!
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              style={{ marginTop: '0.5rem', padding: '0.65rem', justifyContent: 'center', fontSize: '0.85rem' }}
              disabled={loading}
            >
              <Send size={14} /> {loading ? 'Saving Video...' : 'Submit & Save Video Intake'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
