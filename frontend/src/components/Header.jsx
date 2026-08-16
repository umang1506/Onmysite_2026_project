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
          <Search size={14} style={{ position: 'absolute', left: 12, top: 10, color: '#64748b' }} />
          <input
            type="text"
            className="search-input"
            style={{ paddingLeft: '2.2rem', background: '#ffffff', color: '#0f172a', borderColor: 'rgba(255,255,255,0.4)', borderRadius: '8px' }}
            placeholder="Search Patient ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={onToggleNotifications} title="Notifications">
          <Bell size={18} color="#93c5fd" />
          <span style={{ position: 'absolute', top: -2, right: -2, width: 7, height: 7, background: '#ef4444', borderRadius: '50%' }}></span>
        </div>

        <Wifi size={18} color="#93c5fd" style={{ cursor: 'pointer' }} onClick={onOpenNetwork} title="Gateway Status" />
        
        {canUseVideo && (
          <Video size={18} color="#93c5fd" style={{ cursor: 'pointer' }} onClick={onOpenVideo} title="Telehealth Video Call" />
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', borderLeft: '1px solid rgba(255,255,255,0.25)', paddingLeft: '0.75rem' }} onClick={onOpenProfile}>
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="avatar"
            title={`${currentUser?.name} (${currentUser?.role})`}
            style={{ border: '1px solid rgba(255,255,255,0.5)' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>{currentUser?.name}</span>
            <span style={{ fontSize: '0.68rem', color: '#93c5fd', fontWeight: 600 }}>{currentUser?.role?.split(' ')[0]}</span>
          </div>
        </div>

        <button
          className="btn-ctrl"
          style={{ padding: '0.35rem 0.6rem', color: '#dc2626', borderColor: '#fca5a5', background: '#ffffff', borderRadius: '6px' }}
          onClick={onLogout}
          title="Sign Out & Return to Login"
        >
          <LogOut size={15} />
        </button>
      </div>
    </header>
  );
}
