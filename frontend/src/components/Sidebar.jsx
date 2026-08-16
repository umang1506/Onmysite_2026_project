import React from 'react';
import { LayoutDashboard, Radio, FolderHeart, Activity, Layers, Settings, HelpCircle, Plus } from 'lucide-react';

export default function Sidebar({ activeNav, setActiveNav, onNewSession, onOpenSettings, onOpenSupport }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'triage-feed', label: 'Triage Feed', icon: Radio },
    { id: 'patient-records', label: 'Patient Records', icon: FolderHeart },
    { id: 'system-health', label: 'System Health', icon: Activity },
    { id: 'session-overview', label: 'Session Overview', icon: Layers },
  ];

  return (
    <aside className="sidebar">
      <div>
        <div className="app-brand">
          <div className="brand-icon">🏥</div>
          <div>
            <div className="brand-name">Triage Command</div>
            <div className="brand-sub">Unit 7-B Center</div>
          </div>
        </div>

        <button className="btn-new-session" onClick={onNewSession}>
          <Plus size={18} /> + New Triage Session
        </button>

        <nav className="nav-section">
          {navItems.map((item) => {
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

      <div className="nav-section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
        <div className="nav-item" onClick={onOpenSettings}>
          <Settings size={18} />
          <span>Settings</span>
        </div>
        <div className="nav-item" onClick={onOpenSupport}>
          <HelpCircle size={18} />
          <span>Support</span>
        </div>
      </div>
    </aside>
  );
}
