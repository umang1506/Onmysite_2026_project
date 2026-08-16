import React from 'react';
import { Bell, Wifi, Video, Search, LogOut } from 'lucide-react';

export default function Header({
  activeHeaderTab,
  setActiveHeaderTab,
  searchQuery,
  setSearchQuery,
  onToggleNotifications,
  onOpenNetwork,
  onOpenVideo,
  onOpenProfile,
  currentUser,
  onLogout
}) {
  const allTabs = [
    { id: 'Direct Admissions', roles: ['physician'] },
    { id: 'ED Queue', roles: ['physician', 'nurse', 'psychiatrist', 'admin'] },
    { id: 'Staffing', roles: ['physician', 'admin'] }
  ];

  const userRole = currentUser?.id || 'physician';
  const allowedTabs = allTabs.filter(t => t.roles.includes(userRole)).map(t => t.id);

  const canUseVideo = ['physician', 'nurse'].includes(userRole);

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="header-title">Clinical Intelligence Gateway</div>
        <div className="header-nav">
          {allowedTabs.map((tab) => (
            <div
              key={tab}
              className={`header-tab ${activeHeaderTab === tab ? 'active' : ''}`}
              onClick={() => setActiveHeaderTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>

      <div className="header-right">
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: '#94a3b8' }} />
          <input
            type="text"
            className="search-input"
            style={{ paddingLeft: '2rem' }}
            placeholder="Search Patient ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={onToggleNotifications} title="Notifications">
          <Bell size={18} color="#64748b" />
          <span style={{ position: 'absolute', top: -2, right: -2, width: 7, height: 7, background: '#ef4444', borderRadius: '50%' }}></span>
        </div>
        <Wifi size={18} color="#0284c7" style={{ cursor: 'pointer' }} onClick={onOpenNetwork} title="Gateway Status" />
        
        {canUseVideo && (
          <Video size={18} color="#64748b" style={{ cursor: 'pointer' }} onClick={onOpenVideo} title="Telehealth Video Call" />
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', borderLeft: '1px solid #e2e8f0', paddingLeft: '0.75rem' }} onClick={onOpenProfile}>
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="avatar"
            title={`${currentUser?.name} (${currentUser?.role})`}
          />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>{currentUser?.name}</span>
            <span style={{ fontSize: '0.68rem', color: '#0284c7', fontWeight: 600 }}>{currentUser?.role?.split(' ')[0]}</span>
          </div>
        </div>

        <button
          className="btn-ctrl"
          style={{ padding: '0.35rem 0.5rem', color: '#dc2626', borderColor: '#fca5a5', background: '#fef2f2' }}
          onClick={onLogout}
          title="Sign Out & Return to Login"
        >
          <LogOut size={14} />
        </button>
      </div>
    </header>
  );
}
