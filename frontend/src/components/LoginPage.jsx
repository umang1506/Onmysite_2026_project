import React, { useState } from 'react';
import { Activity, User, Key, ShieldCheck, ArrowRight, ChevronDown } from 'lucide-react';

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
      description: 'Full clinical control: Overrides, Telehealth, Direct Admissions'
    },
    {
      id: 'nurse',
      pass: 'pass123',
      name: 'Nurse Sarah Connor, RN',
      role: 'Intake Nurse',
      dept: 'Multimodal Intake & Sensor Ingestion',
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=120&auto=format&fit=crop&q=80',
      description: 'Patient intake: Launch + New Session, record vitals & symptoms'
    },
    {
      id: 'psychiatrist',
      pass: 'pass123',
      name: 'Dr. Marcus Vance, MD',
      role: 'Mental Health Specialist',
      dept: 'Psychiatric Crisis Triage Queue',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=120&auto=format&fit=crop&q=80',
      description: 'Specialized queue: Mental health crisis evaluation & notes'
    },
    {
      id: 'admin',
      pass: 'pass123',
      name: 'IT Systems Admin',
      role: 'System Administrator',
      dept: 'Clinical Gateway IT Governance',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&auto=format&fit=crop&q=80',
      description: 'IT Governance: System Health, Engine Thresholds, Replays'
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
      setError('Invalid Role ID or Password for the selected role. Please check credentials and try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #0b0f19 0%, #1e1b4b 50%, #0f172a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '850px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1.1fr 1fr',
        gap: '2rem',
        background: 'rgba(18, 24, 38, 0.8)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '2.5rem',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
      }}>
        {/* Left Form Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: 42, height: 42, background: '#0284c7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <Activity size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', lineHeight: '1.2' }}>
                Clinical Intelligence Gateway
              </h1>
              <span style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 600 }}>
                Role-Based Authentication Login
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* 1. Role Selection Dropdown */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#a5b4fc', display: 'block', marginBottom: '0.35rem' }}>
                Select User Role
              </label>
              <div style={{ position: 'relative' }}>
                <ShieldCheck size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#0284c7' }} />
                <select
                  className="search-input"
                  style={{
                    width: '100%',
                    paddingLeft: '2.4rem',
                    background: 'rgba(15, 23, 42, 0.9)',
                    color: '#ffffff',
                    borderColor: '#0284c7',
                    fontWeight: 600,
                    appearance: 'none',
                    height: '42px'
                  }}
                  value={selectedRole}
                  onChange={handleRoleSelectChange}
                >
                  <option value="physician">🩺 ED Physician (Triage Lead)</option>
                  <option value="nurse">👩‍⚕️ Intake Nurse (Patient Ingestion)</option>
                  <option value="psychiatrist">🧠 Mental Health Specialist</option>
                  <option value="admin">⚙️ System Administrator (IT Ops)</option>
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: 12, top: 13, color: '#94a3b8', pointerEvents: 'none' }} />
              </div>
            </div>

            {/* 2. User / Role ID Input */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '0.35rem' }}>
                User / Role ID
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#64748b' }} />
                <input
                  type="text"
                  className="search-input"
                  style={{ width: '100%', paddingLeft: '2.4rem', background: 'rgba(0,0,0,0.4)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.15)', height: '42px' }}
                  placeholder="Enter User ID"
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* 3. Password Input */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '0.35rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Key size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#64748b' }} />
                <input
                  type="password"
                  className="search-input"
                  style={{ width: '100%', paddingLeft: '2.4rem', background: 'rgba(0,0,0,0.4)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.15)', height: '42px' }}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.65rem', borderRadius: '8px', color: '#fca5a5', fontSize: '0.8rem' }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', justifyContent: 'center', padding: '0.85rem', height: '44px' }}>
              Sign In to Gateway <ArrowRight size={18} />
            </button>
          </form>
        </div>

        {/* Right Reference Table for Demo Accounts */}
        <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.08)', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            📋 Clinical Role Profiles
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
            Select a role profile below to auto-fill credentials:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {demoAccounts.map((acc) => (
              <div
                key={acc.id}
                onClick={() => {
                  setSelectedRole(acc.id);
                  setRoleId(acc.id);
                  setPassword(acc.pass);
                  setError('');
                }}
                style={{
                  background: selectedRole === acc.id ? 'rgba(2, 132, 199, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${selectedRole === acc.id ? '#0284c7' : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: '10px',
                  padding: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <img
                  src={acc.avatar}
                  alt={acc.name}
                  style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(255,255,255,0.2)' }}
                />
                <div style={{ flex: 1, fontSize: '0.75rem' }}>
                  <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.85rem' }}>{acc.name}</div>
                  <div style={{ color: '#0284c7', fontWeight: 600 }}>{acc.role}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginTop: '0.15rem' }}>{acc.dept}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
