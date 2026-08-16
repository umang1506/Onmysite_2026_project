import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TriageFeedView from './components/TriageFeedView';
import SessionOverviewView from './components/SessionOverviewView';
import DashboardView from './components/DashboardView';
import PatientRecordsView from './components/PatientRecordsView';
import SystemHealthView from './components/SystemHealthView';
import DirectAdmissionsView from './components/DirectAdmissionsView';
import StaffingView from './components/StaffingView';
import LoginPage from './components/LoginPage';
import ClinicalChatbot from './components/ClinicalChatbot';

import NewSessionModal from './components/NewSessionModal';
import SettingsModal from './components/SettingsModal';
import SupportModal from './components/SupportModal';
import NotificationDrawer from './components/NotificationDrawer';
import NetworkStatusModal from './components/NetworkStatusModal';
import TelehealthVideoModal from './components/TelehealthVideoModal';
import UserProfileModal from './components/UserProfileModal';
import AiReceptionistModal from './components/AiReceptionistModal';
import BedCapacityModal from './components/BedCapacityModal';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [activeNav, setActiveNav] = useState('triage-feed');
  const [activeHeaderTab, setActiveHeaderTab] = useState('ED Queue');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState('#8842');

  // Modals & Drawers state
  const [isNewSessionOpen, setIsNewSessionOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isReceptionistOpen, setIsReceptionistOpen] = useState(false);
  const [isBedsOpen, setIsBedsOpen] = useState(false);

  // Initial Sessions State
  const [sessions, setSessions] = useState([
    {
      sessionId: '#8842',
      id: 'TRG-892A',
      patientName: 'John Doe',
      patientDetails: 'ID: P-44921 • 45M',
      dob: '05/14/1968 (55M)',
      matchScore: 94,
      spo2: 88,
      hr: 112,
      symptoms: 'Severe chest pain, shortness of breath, diaphoretic.',
      decision: 'EMERGENCY',
      decisionCode: 'LEVEL 1',
      badgeClass: 'badge-level1',
      decisionType: 'Emergency',
      decisionReason: 'Override triggered by SpO2 < 90% and concurrent symptom reports.',
      modalities: ['text', 'audio', 'sensor'],
      events: [
        { id: 'EV-001', type: 'Audio', time: '10:42:01.2', source: 'audio', tag: 'Out-of-order', text: '"Patient states chest pain began abruptly 20 minutes ago. Radiating to left arm."' },
        { id: 'EV-002', type: 'Sensor Telemetry', time: '10:42:05.8', source: 'sensor', hr: 112, spo2: 88 },
        { id: 'EV-003', type: 'Text Input', time: '10:42:15.0', source: 'text', text: 'EMS notes diaphoretic presentation.' }
      ],
      auditLogs: [
        { id: 'EV-001', source: 'Audio', time: '10:42:01', action: 'Ingested', actionType: 'ingested' },
        { id: 'SYS-01', source: 'NLP Engine', time: '10:42:02', action: 'Reconciled', actionType: 'reconciled' },
        { id: 'EV-002', source: 'Telemetry', time: '10:42:05', action: 'Ingested', actionType: 'ingested' },
        { id: 'SYS-02', source: 'Rules Engine', time: '10:42:06', action: 'Override', actionType: 'override' }
      ]
    },
    {
      sessionId: '#8841',
      id: 'TRG-891B',
      patientName: 'Sarah Smith',
      patientDetails: 'ID: P-99382 • 28F',
      dob: '08/21/1995 (28F)',
      matchScore: 89,
      spo2: 97,
      hr: 78,
      symptoms: 'Experiencing moderate dizziness upon standing up.',
      decision: 'GENERAL',
      decisionCode: 'LEVEL 4',
      badgeClass: 'badge-level4',
      decisionType: 'General',
      decisionReason: 'Assigned to General Triage: Symptoms and vitals within normal parameters.',
      modalities: ['text', 'sensor'],
      events: [
        { id: 'EV-101', type: 'Audio', time: '12:10:00.0', source: 'audio', text: '"Experiencing moderate dizziness upon standing up."' },
        { id: 'EV-102', type: 'Sensor Telemetry', time: '12:12:00.0', source: 'sensor', hr: 78, spo2: 97 }
      ],
      auditLogs: [
        { id: 'EV-101', source: 'Audio', time: '12:10:00', action: 'Ingested', actionType: 'ingested' },
        { id: 'EV-102', source: 'Telemetry', time: '12:12:00', action: 'Ingested', actionType: 'ingested' }
      ]
    },
    {
      sessionId: '#8840',
      id: 'TRG-890C',
      patientName: 'Aarav Patel',
      patientDetails: 'ID: P-6620 • 33M',
      dob: '11/04/1990 (33M)',
      matchScore: 98,
      spo2: 99,
      hr: 88,
      symptoms: 'Feeling severe panic attack and overwhelming anxiety crisis.',
      decision: 'MENTAL HEALTH',
      decisionCode: 'MH-URGENT',
      badgeClass: 'badge-mhurgent',
      decisionType: 'Mental Health',
      decisionReason: 'Flagged for Mental Health Triage: Psychological distress keyword detected.',
      modalities: ['audio', 'text'],
      events: [
        { id: 'EV-201', type: 'Audio', time: '12:45:00.0', source: 'audio', text: '"Feeling severe panic attack and overwhelming anxiety crisis."' },
        { id: 'EV-202', type: 'Sensor Telemetry', time: '12:46:00.0', source: 'sensor', hr: 88, spo2: 99 }
      ],
      auditLogs: [
        { id: 'EV-201', source: 'Audio', time: '12:45:00', action: 'Ingested', actionType: 'ingested' },
        { id: 'SYS-03', source: 'Rules Engine', time: '12:46:00', action: 'MH-Trigger', actionType: 'reconciled' }
      ]
    },
    {
      sessionId: '#8839',
      id: 'TRG-889A',
      patientName: 'Robert Johnson',
      patientDetails: 'ID: P-11204 • 82M',
      dob: '01/10/1942 (82M)',
      matchScore: 91,
      spo2: 98,
      hr: 72,
      symptoms: 'Routine checkup confirm.',
      decision: 'GENERAL',
      decisionCode: 'DISCHARGED',
      badgeClass: 'badge-discharged',
      decisionType: 'General',
      decisionReason: 'Patient discharged after routine evaluation.',
      modalities: ['text'],
      events: [
        { id: 'EV-301', type: 'Text Input', time: '09:15:00.0', source: 'text', text: 'Routine checkup confirm.' }
      ],
      auditLogs: [
        { id: 'EV-301', source: 'Text', time: '09:15:00', action: 'Ingested', actionType: 'ingested' }
      ]
    }
  ]);

  // Initial Patient Records State
  const [patientRecords, setPatientRecords] = useState([
    { id: 'P-44921', name: 'John Doe', age: '45M', phone: '+1 (555) 019-2834', dob: '05/14/1968', matchScore: '94%', lastVisit: '2026-08-16 10:42', status: 'Emergency Level 1' },
    { id: 'P-99382', name: 'Sarah Smith', age: '28F', phone: '+1 (555) 382-9102', dob: '08/21/1995', matchScore: '89%', lastVisit: '2026-08-16 12:12', status: 'General Level 4' },
    { id: 'P-6620', name: 'Aarav Patel', age: '33M', phone: '+91 98110 22334', dob: '11/04/1990', matchScore: '98%', lastVisit: '2026-08-16 12:46', status: 'Mental Health' },
    { id: 'P-11204', name: 'Robert Johnson', age: '82M', phone: '+1 (555) 881-0021', dob: '01/10/1942', matchScore: '91%', lastVisit: '2026-08-16 09:15', status: 'Discharged' }
  ]);

  const handleLogin = (userAccount) => {
    setCurrentUser(userAccount);
    setIsAuthenticated(true);

    if (userAccount.id === 'admin') {
      setActiveNav('dashboard');
    } else {
      setActiveNav('triage-feed');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleSelectSession = (sessionId) => {
    setSelectedSessionId(sessionId);
    setActiveHeaderTab('ED Queue');
    setActiveNav('triage-feed');
  };

  const handleNewSessionCreated = ({ sessionId, patientId, formData, triageResult, videoUrl }) => {
    const rawDecision = triageResult.decision || 'General';
    let dType = 'General';
    let dCode = 'LEVEL 4';
    let bClass = 'badge-level4';

    if (rawDecision.includes('Emergency')) {
      dType = 'Emergency';
      dCode = 'LEVEL 1';
      bClass = 'badge-level1';
    } else if (rawDecision.includes('Mental')) {
      dType = 'Mental Health';
      dCode = 'MH-URGENT';
      bClass = 'badge-mhurgent';
    }

    const cleanSessionId = sessionId.startsWith('#') ? sessionId : `#${sessionId}`;

    const newSessionObj = {
      sessionId: cleanSessionId,
      id: cleanSessionId.replace('#', ''),
      patientName: formData.patientName || 'New Patient',
      patientDetails: `ID: ${patientId} • 35M`,
      dob: '01/01/1990 (35M)',
      matchScore: 95,
      spo2: Number(formData.spo2),
      hr: Number(formData.hr),
      symptoms: formData.symptoms,
      decision: dType.toUpperCase(),
      decisionCode: dCode,
      badgeClass: bClass,
      decisionType: dType,
      decisionReason: triageResult.explanation || 'Evaluated by Onmysite Triage Engine.',
      videoUrl: videoUrl,
      modalities: ['audio', 'sensor'],
      events: [
        {
          id: `EV-${Date.now()}-1`,
          type: formData.source === 'audio' ? 'Audio/Video' : 'Text Input',
          time: new Date().toLocaleTimeString(),
          source: formData.source || 'audio',
          text: `"${formData.symptoms}"`
        },
        {
          id: `EV-${Date.now()}-2`,
          type: 'Sensor Telemetry',
          time: new Date().toLocaleTimeString(),
          source: 'sensor',
          hr: Number(formData.hr),
          spo2: Number(formData.spo2)
        }
      ],
      auditLogs: triageResult.audit_trail
        ? triageResult.audit_trail.map((a) => ({
            id: a.audit_id ? a.audit_id.substring(0, 6) : 'SYS',
            source: a.action.toUpperCase(),
            time: new Date(a.timestamp).toLocaleTimeString(),
            action: a.action,
            actionType: a.action === 'ignored' ? 'ignored' : a.action === 'ingested' ? 'ingested' : 'override'
          }))
        : [
            { id: 'EV-NEW', source: 'AI Receptionist', time: new Date().toLocaleTimeString(), action: 'Ingested', actionType: 'ingested' },
            { id: 'SYS-EV', source: 'Rules Engine', time: new Date().toLocaleTimeString(), action: 'Evaluated', actionType: 'reconciled' }
          ]
    };

    const newRecordObj = {
      id: patientId,
      name: formData.patientName || 'New Patient',
      age: '35M',
      phone: formData.phone || '+1 (555) 000-0000',
      dob: '01/01/1990',
      matchScore: '95%',
      lastVisit: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: dType === 'Emergency' ? 'Emergency Level 1' : dType === 'Mental Health' ? 'Mental Health' : 'General Level 4'
    };

    setSessions((prev) => [newSessionObj, ...prev]);
    setPatientRecords((prev) => [newRecordObj, ...prev]);

    setSelectedSessionId(cleanSessionId);
    setActiveHeaderTab('ED Queue');
    setActiveNav('triage-feed');
  };

  // Step 1: Render Login Page if Unauthenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Step 2: Render Authenticated Role-Based Portal
  const userRole = currentUser?.id || 'physician';

  return (
    <div className={`app-layout theme-${userRole}`}>
      {/* Left Sidebar */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={(nav) => {
          setActiveNav(nav);
          if (nav === 'triage-feed') setActiveHeaderTab('ED Queue');
        }}
        onNewSession={() => setIsNewSessionOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenReceptionist={() => setIsReceptionistOpen(true)}
        onOpenBeds={() => setIsBedsOpen(true)}
        currentUser={currentUser}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Header
          activeHeaderTab={activeHeaderTab}
          setActiveHeaderTab={(tab) => {
            setActiveHeaderTab(tab);
            if (tab === 'ED Queue' && activeNav !== 'triage-feed' && activeNav !== 'session-overview') {
              setActiveNav('triage-feed');
            }
          }}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onToggleNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
          onOpenNetwork={() => setIsNetworkOpen(true)}
          onOpenVideo={() => setIsVideoOpen(true)}
          onOpenReceptionist={() => setIsReceptionistOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        <main className="content-body">
          {/* Top Header Tab Switcher Override */}
          {activeHeaderTab === 'Direct Admissions' && userRole === 'physician' ? (
            <DirectAdmissionsView />
          ) : activeHeaderTab === 'Staffing' && ['physician', 'admin'].includes(userRole) ? (
            <StaffingView />
          ) : (
            <>
              {activeNav === 'dashboard' && (
                <DashboardView currentUser={currentUser} onNavigate={(nav) => setActiveNav(nav)} />
              )}

              {activeNav === 'triage-feed' && ['physician', 'nurse', 'psychiatrist'].includes(userRole) && (
                <TriageFeedView
                  sessions={sessions}
                  activeSessionId={selectedSessionId}
                  onSelectSession={handleSelectSession}
                  currentUser={currentUser}
                />
              )}

              {activeNav === 'session-overview' && (
                <SessionOverviewView
                  sessions={sessions}
                  onSelectSession={handleSelectSession}
                  searchQuery={searchQuery}
                />
              )}

              {activeNav === 'patient-records' && ['physician', 'nurse', 'psychiatrist'].includes(userRole) && (
                <PatientRecordsView
                  records={patientRecords}
                  searchQuery={searchQuery}
                />
              )}

              {activeNav === 'system-health' && ['physician', 'admin'].includes(userRole) && (
                <SystemHealthView />
              )}
            </>
          )}
        </main>
      </div>

      {/* Floating Clinical AI Chatbot */}
      <ClinicalChatbot onNewSessionCreated={handleNewSessionCreated} />

      {/* Modals, Drawers & Interactive Popups */}
      <NewSessionModal
        isOpen={isNewSessionOpen}
        onClose={() => setIsNewSessionOpen(false)}
        onSessionCreated={handleNewSessionCreated}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <NetworkStatusModal
        isOpen={isNetworkOpen}
        onClose={() => setIsNetworkOpen(false)}
      />

      <TelehealthVideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        onSessionCreated={handleNewSessionCreated}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <AiReceptionistModal
        isOpen={isReceptionistOpen}
        onClose={() => setIsReceptionistOpen(false)}
        onSessionCreated={handleNewSessionCreated}
      />

      <BedCapacityModal
        isOpen={isBedsOpen}
        onClose={() => setIsBedsOpen(false)}
        activeSession={sessions.find((s) => s.sessionId === selectedSessionId)}
      />
    </div>
  );
}
