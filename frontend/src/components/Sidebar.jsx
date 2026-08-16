import React from 'react';
import { LayoutDashboard, Radio, FolderHeart, Activity, Layers, Settings, HelpCircle, Plus, Bot, Activity as MedicalCross } from 'lucide-react';

export default function Sidebar({ activeNav, setActiveNav, onNewSession, onOpenSettings, onOpenSupport, onOpenReceptionist, currentUser }) {
  const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['physician', 'admin'] },
    { id: 'triage-feed', label: 'Triage Feed', icon: Radio, roles: ['physician', 'nurse', 'psychiatrist'] },
    { id: 'patient-records', label: 'Patient Records', icon: FolderHeart, roles: ['physician', 'nurse', 'psychiatrist'] },
    { id: 'system-health', label: 'System Health', icon: Activity, roles: ['physician', 'admin'] },
    { id: 'session-overview', label: 'Session Overview', icon: Layers, roles: ['physician', 'nurse', 'psychiatrist', 'admin'] },
  ];

  const userRole = currentUser?.id || 'physician';
  const allowedNavItems = allNavItems.filter((item) => item.roles.includes(userRole));

  const canCreateSession = ['physician', 'nurse'].includes(userRole);
  const canAccessSettings = ['physician', 'admin'].includes(userRole);

  return (
    <aside className="sidebar">
      <div>
        <div className="app-brand">
          <div className="brand-icon" style={{ background: '#e0f2fe', color: '#1d4ed8', width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MedicalCross size={20} />
          </div>
          <div>
            <div className="brand-name" style={{ fontWeight: 800, color: '#1e3a8a', fontSize: '1.05rem' }}>Triage Command</div>
            <div className="brand-sub" style={{ fontSize: '0.7rem', color: '#64748b' }}>{currentUser?.dept || 'Unit 7-B Center'}</div>
          </div>
        </div>

        {canCreateSession ? (
          <button className="btn-new-session" onClick={onNewSession} style={{ background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)', color: '#ffffff', fontWeight: 700, borderRadius: '8px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', border: 'none', width: '100%', marginBottom: '1.25rem', boxShadow: '0 4px 12px rgba(29, 78, 216, 0.3)' }}>
            <Plus size={18} /> New Triage Session
          </button>
        ) : (
          <div style={{ padding: '0.5rem 0.75rem', background: '#f1f5f9', borderRadius: '8px', fontSize: '0.75rem', color: '#64748b', marginBottom: '1.25rem', textAlign: 'center' }}>
            🔒 Role: {currentUser?.role}
          </div>
        )}

        <nav className="nav-section">
          {allowedNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <div
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveNav(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Sidebar Section: Settings, Support & AI Receptionist */}
      <div className="nav-section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
        {canAccessSettings && (
          <div className="nav-item" onClick={onOpenSettings}>
            <Settings size={18} />
            <span>Settings</span>
          </div>
        )}
        <div className="nav-item" onClick={onOpenSupport}>
          <HelpCircle size={18} />
          <span>Support</span>
        </div>
        <div
          className="nav-item"
          onClick={onOpenReceptionist}
          style={{ background: '#e0f2fe', color: '#0284c7', fontWeight: 700, borderRadius: '8px' }}
        >
          <Bot size={18} color="#0284c7" />
          <span>AI Receptionist</span>
        </div>
      </div>
    </aside>
  );
}
