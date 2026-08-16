import React, { useState } from 'react';
import { Activity, User, Key, ShieldCheck, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState('physician');
  const [roleId, setRoleId] = useState('physician');
  const [password, setPassword] = useState('pass123');
  const [error, setError] = useState('');

  // Demo User Accounts Registry
  const demoAccounts = [
    {
      id: 'physician',
      pass: 'pass123',
      name: 'Dr. Alex Rivera, MD',
      role: 'ED Physician (Triage Lead)',
      dept: 'Unit 7-B Emergency Center',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80',
      description: 'Full clinical control: Overrides, Telehealth, Direct Admissions',
      themeColor: '#1e40af'
    },
    {
      id: 'nurse',
      pass: 'pass123',
      name: 'Nurse Sarah Connor, RN',
      role: 'Intake Nurse',
      dept: 'Multimodal Intake & Sensor Ingestion',
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=120&auto=format&fit=crop&q=80',
      description: 'Patient intake: Launch + New Session, record vitals & symptoms',
      themeColor: '#0284c7'
    },
    {
      id: 'psychiatrist',
      pass: 'pass123',
      name: 'Dr. Marcus Vance, MD',
      role: 'Mental Health Specialist',
      dept: 'Psychiatric Crisis Triage Queue',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=120&auto=format&fit=crop&q=80',
      description: 'Specialized queue: Mental health crisis evaluation & notes',
      themeColor: '#9333ea'
    },
    {
      id: 'admin',
      pass: 'pass123',
      name: 'IT Systems Admin',
      role: 'System Administrator',
      dept: 'Clinical Gateway IT Governance',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&auto=format&fit=crop&q=80',
      description: 'IT Governance: System Health, Engine Thresholds, Replays',
      themeColor: '#0f172a'
    }
  ];

  // Handle dropdown selection
  const handleRoleSelectChange = (e) => {
    const roleKey = e.target.value;
    setSelectedRole(roleKey);
    const matchedAcc = demoAccounts.find(a => a.id === roleKey);
    if (matchedAcc) {
      setRoleId(matchedAcc.id);
      setPassword(matchedAcc.pass);
    }
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const matched = demoAccounts.find(
      a => a.id.toLowerCase() === roleId.toLowerCase() && a.pass === password
    );

    if (matched) {
      setError('');
      onLogin(matched);
    } else {
      setError('Invalid Role ID or Password. Please check credentials below.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      overflow: 'hidden',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Left Medical Hero Panel (Matching Screenshot) */}
      <div style={{
        flex: 1.2,
        position: 'relative',
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&auto=format&fit=crop&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3.5rem',
        color: '#ffffff'
      }}>
        {/* Brand Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ background: '#2563eb', padding: '0.4rem 0.6rem', borderRadius: '8px', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.05em' }}>
            Onmysite
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.15)', borderRadius: '4px' }}>
            DOC
          </span>
        </div>

        {/* Hero Headline Text */}
        <div style={{ maxWidth: '560px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#60a5fa', marginBottom: '1rem' }}>
            INSPIRING BETTER HEALTH
          </div>
          <h1 style={{ fontSize: '3.2rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            Upgrade your <span style={{ color: '#60a5fa', background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>healthcare</span> experience
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '2rem', fontWeight: 400 }}>
            Get real-time deterministic triage, multimodal stream reconciliation, and automated clinical risk scoring whenever you need them.
          </p>

          <button
            onClick={() => handleRoleSelectChange({ target: { value: 'physician' } })}
            style={{
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              padding: '0.85rem 1.8rem',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.875rem',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              boxShadow: '0 10px 20px rgba(37, 99, 235, 0.3)',
              textTransform: 'uppercase'
            }}
          >
            Get Started
          </button>
        </div>

        {/* Hero Footer Disclaimer */}
        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
          Deterministic Clinical Triage Gateway • HIPAA Level 5 Compliant Architecture
        </div>
      </div>

      {/* Right Royal Blue Sign-In Panel (Matching Screenshot) */}
      <div style={{
        width: '460px',
        background: 'linear-gradient(180deg, #1e40af 0%, #1d4ed8 100%)',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3.5rem 3rem',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.2)',
        zIndex: 10
      }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '2rem', color: '#ffffff' }}>
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Role Select Dropdown */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#93c5fd', display: 'block', marginBottom: '0.4rem' }}>
                Select Role
              </label>
              <div style={{ position: 'relative' }}>
                <ShieldCheck size={18} style={{ position: 'absolute', left: 14, top: 12, color: '#93c5fd' }} />
                <select
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.85rem 0.75rem 2.6rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                  value={selectedRole}
                  onChange={handleRoleSelectChange}
                >
                  <option value="physician" style={{ background: '#1e40af', color: '#fff' }}>🩺 ED Physician (Triage Lead)</option>
                  <option value="nurse" style={{ background: '#1e40af', color: '#fff' }}>👩‍⚕️ Intake Nurse (Patient Ingestion)</option>
                  <option value="psychiatrist" style={{ background: '#1e40af', color: '#fff' }}>🧠 Mental Health Specialist</option>
                  <option value="admin" style={{ background: '#1e40af', color: '#fff' }}>⚙️ System Administrator (IT Ops)</option>
                </select>
              </div>
            </div>

            {/* Role ID Input */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#93c5fd', display: 'block', marginBottom: '0.4rem' }}>
                User / Role ID
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: 14, top: 12, color: '#93c5fd' }} />
                <input
                  type="text"
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.85rem 0.75rem 2.6rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                  placeholder="e.g. physician, nurse, admin"
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#93c5fd', display: 'block', marginBottom: '0.4rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: 14, top: 12, color: '#93c5fd' }} />
                <input
                  type="password"
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.85rem 0.75rem 2.6rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '-0.25rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#93c5fd', cursor: 'pointer', textDecoration: 'underline' }}>
                Forgot password?
              </span>
            </div>

            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.25)', border: '1px solid rgba(239, 68, 68, 0.5)', padding: '0.65rem', borderRadius: '8px', color: '#ffffff', fontSize: '0.8rem' }}>
                {error}
              </div>
            )}

            {/* White Pill Sign In Button (Matching Screenshot) */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                type="submit"
                style={{
                  background: '#ffffff',
                  color: '#1d4ed8',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                Sign In <ArrowRight size={16} />
              </button>
            </div>
          </form>

          {/* Clinical Role Profiles Quick Selector */}
          <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.65rem' }}>
              Clinical Role Profiles
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {demoAccounts.map((acc) => {
                const isSelected = selectedRole === acc.id;
                return (
                  <div
                    key={acc.id}
                    onClick={() => {
                      setSelectedRole(acc.id);
                      setRoleId(acc.id);
                      setPassword(acc.pass);
                      setError('');
                    }}
                    style={{
                      background: isSelected ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.15)'}`,
                      borderRadius: '8px',
                      padding: '0.5rem 0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, fontSize: '0.75rem' }}>
                      <div style={{ fontWeight: 700, color: '#ffffff' }}>{acc.name}</div>
                      <div style={{ color: '#93c5fd', fontSize: '0.7rem' }}>{acc.role}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div style={{ fontSize: '0.7rem', color: '#93c5fd', textAlign: 'center', marginTop: '1.5rem' }}>
          By logging in you agree to our <u>Terms of Services</u> and <u>Privacy Policy</u>.
        </div>
      </div>
    </div>
  );
}
