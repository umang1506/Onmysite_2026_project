import React from 'react';
import { Bell, Wifi, Video, Search, LogOut, Bot, Sparkles } from 'lucide-react';

export default function Header({
  activeHeaderTab,
  setActiveHeaderTab,
  searchQuery,
  setSearchQuery,
  onToggleNotifications,
  onOpenNetwork,
  onOpenVideo,
  onOpenReceptionist,
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
          <Bell size={18} color="#ffffff" />
          <span style={{ position: 'absolute', top: -2, right: -2, width: 7, height: 7, background: '#ef4444', borderRadius: '50%' }}></span>
        </div>

        <div style={{ cursor: 'pointer' }} onClick={onOpenNetwork} title="BLE IoT Network Telemetry">
          <Wifi size={18} color="#ffffff" />
        </div>

        {canUseVideo && (
          <div style={{ cursor: 'pointer' }} onClick={onOpenVideo} title="Telehealth Video Intake">
            <Video size={18} color="#ffffff" />
          </div>
        )}

        {/* Clinical Role Profile Badge & Sign Out Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.5rem', borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }} onClick={onOpenProfile}>
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80'}
              alt="Avatar"
              style={{ width: 34, height: 34, borderRadius: '50%', border: '2px solid #ffffff', objectFit: 'cover' }}
            />
            <div style={{ lineHeight: '1.2' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ffffff' }}>
                {currentUser?.name || 'Dr. Alex Rivera'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#e0f2fe' }}>
                {currentUser?.role || 'ED Physician'}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            style={{
              background: '#ffffff',
              color: '#dc2626',
              border: 'none',
              borderRadius: '6px',
              padding: '0.4rem 0.6rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700
            }}
            title="Sign Out Portal"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
