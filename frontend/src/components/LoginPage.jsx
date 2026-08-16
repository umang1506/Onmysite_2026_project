import React, { useState } from 'react';
import { Activity, ShieldCheck, Lock, User, Key, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LoginPage({ onLogin }) {
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
      badgeClass: 'badge-level1',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80',
      description: 'Full clinical control: Overrides, Telehealth, Direct Admissions'
    },
    {
      id: 'nurse',
      pass: 'pass123',
      name: 'Nurse Sarah Connor, RN',
      role: 'Intake Nurse',
      dept: 'Multimodal Intake & Sensor Ingestion',
      badgeClass: 'badge-level4',
      avatar: 'https://images.unsplash.com/photo-1594824813571-21533df9f43a?w=100&auto=format&fit=crop&q=80',
      description: 'Patient intake: Launch + New Session, record vitals & symptoms'
    },
    {
      id: 'psychiatrist',
      pass: 'pass123',
      name: 'Dr. Marcus Vance, MD',
      role: 'Mental Health Specialist',
      dept: 'Psychiatric Crisis Triage Queue',
      badgeClass: 'badge-mhurgent',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&auto=format&fit=crop&q=80',
      description: 'Specialized queue: Mental health crisis evaluation & notes'
    },
    {
      id: 'admin',
      pass: 'pass123',
      name: 'IT Systems Admin',
      role: 'System Administrator',
      dept: 'Clinical Gateway IT Governance',
      badgeClass: 'badge-discharged',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      description: 'IT Governance: System Health, Engine Thresholds, Replays'
    }
  ];

  const handleQuickLogin = (account) => {
    setRoleId(account.id);
    setPassword(account.pass);
    setError('');
    onLogin(account);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const matched = demoAccounts.find(a => a.id.toLowerCase() === roleId.toLowerCase() && a.pass === password);
    if (matched) {
      setError('');
      onLogin(matched);
    } else {
      setError('Invalid Role ID or Password. Please use one of the demo credentials below.');
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
        maxWidth: '900px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1.1fr 1fr',
        gap: '2rem',
        background: 'rgba(18, 24, 38, 0.75)',
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
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', lineHeight: '1.2' }}>
                Onmysite Clinical Gateway
              </h1>
              <span style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 600 }}>
                Role-Based Authentication Portal
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '0.35rem' }}>
                Role ID / Username
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#64748b' }} />
                <input
                  type="text"
                  className="search-input"
                  style={{ width: '100%', paddingLeft: '2.4rem', background: 'rgba(0,0,0,0.4)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.15)' }}
                  placeholder="e.g. physician, nurse, admin"
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '0.35rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Key size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#64748b' }} />
                <input
                  type="password"
                  className="search-input"
                  style={{ width: '100%', paddingLeft: '2.4rem', background: 'rgba(0,0,0,0.4)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.15)' }}
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

            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', justifyContent: 'center', padding: '0.85rem' }}>
              Sign In to Gateway <ArrowRight size={18} />
            </button>
          </form>
        </div>

        {/* Right Demo Accounts Quick Selector */}
        <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.08)', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ⚡ 1-Click Role Login Accounts
          </div>

          {demoAccounts.map((acc) => (
            <div
              key={acc.id}
              onClick={() => handleQuickLogin(acc)}
              style={{
                background: roleId === acc.id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${roleId === acc.id ? '#6366f1' : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: '12px',
                padding: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <img src={acc.avatar} alt={acc.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ffffff' }}>{acc.name}</span>
                  <span style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 600 }}>{acc.id}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 600 }}>{acc.role}</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.15rem' }}>{acc.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
