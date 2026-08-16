import React from 'react';
import { Bell, Wifi, Video, Search } from 'lucide-react';

export default function Header({
  activeHeaderTab,
  setActiveHeaderTab,
  searchQuery,
  setSearchQuery,
  onToggleNotifications,
  onOpenNetwork,
  onOpenVideo,
  onOpenProfile
}) {
  const tabs = ['Direct Admissions', 'ED Queue', 'Staffing'];

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="header-title">Clinical Intelligence Gateway</div>
        <div className="header-nav">
          {tabs.map((tab) => (
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
        <Video size={18} color="#64748b" style={{ cursor: 'pointer' }} onClick={onOpenVideo} title="Telehealth Video Call" />
        <img
          src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80"
          alt="Dr. User"
          className="avatar"
          style={{ cursor: 'pointer' }}
          onClick={onOpenProfile}
          title="Dr. Alex Rivera Profile"
        />
      </div>
    </header>
  );
}
