# 🏥 Onmysite — Clinical Intelligence & Deterministic Triage Gateway

A production-grade, deterministic clinical triage engine and real-time Emergency Department portal designed to process multimodal incoming patient events (voice speech transcriptions, patient text reports, IoT sensor telemetry), resolve patient identity and out-of-order temporal conflicts, enforce decision holding gates, maintain immutable audit trails, and support 100% repeatable event replays.

---

## 🌟 Key Platform Features

### 1. Deterministic Core Engine & Reconciliation
- **Multimodal Event Ingestion**: Processes `sensor` (heart rate, SpO₂), `text`, and `audio` inputs with schema validation and strict idempotency protection.
- **Deterministic Identity Resolution**: Scores identity using normalized phone numbers (+0.4), Levenshtein string distance on names (+0.3), symptom pattern overlap (+0.2), and exact `patient_id` matches (+1.0) without non-deterministic ML models.
- **Temporal Reconciliation**: Sorts events strictly by ISO 8601 timestamps (`new Date(ts).getTime()`). Out-of-order events update state according to real-world occurrence time rather than arrival sequence.
- **Priority Emergency Overrides**: Emergency sensor vitals (SpO₂ < 90%, HR > 150 or < 40 bpm) override conflicting non-emergency patient text reports with dynamic value interpolation.
- **Incomplete Data Holding Gates**: Automatically pauses triage evaluation if text symptoms are submitted but vital telemetry (SpO₂ / HR) has not arrived yet.
- **Intake State Machine Journey**: Tracks patient progression across 5 distinct states (`GREETING` ➔ `SYMPTOM_COLLECTION` ➔ `AWAITING_VITALS` ➔ `TRIAGE_READY` ➔ `TRIAGE_COMPLETED`).
- **Modality Normalization & Keyword Triage Charting**: Strips conversational filler words (`"uh"`, `"um"`, `"like"`, `"you know"`, `"basically"`) from transcripts and compiles structured tags (`critical_respiratory`, `cardiac_distress`, `mental_health_crisis`, `general_pain`).
- **Replay Simulator**: Isolated execution engine guarantees identical decision output across repeated runs of fixture data.

### 2. Smart AI Clinical Receptionist Desk
- **Phone Restriction & Country Code Selector**: Enforces strict **10-digit mobile number validation** paired with country code selection (`+91 India`, `+1 USA`, `+44 UK`, `+61 AU`, `+971 UAE`).
- **Multilingual Voice Intake**: Supports live Speech-to-Text recording in **English, Hindi (हिंदी), Spanish (Español), and French (Français)** via native Web Speech API.
- **Automated Patient History Lookup**: Queries past hospital records automatically to display chronic conditions (e.g. *Hypertension*) and allergies (*Penicillin, Latex*).
- **Insurance Pre-Authorization Scanner**: Instant eligibility verification for *Ayushman Bharat (PMJAY Cashless)*, *Star Health*, *HDFC ERGO*, and *Medicare*.
- **Smart Specialist Assignment**: Automatically assigns lead duty specialists (*Dr. Alex Rivera - Cardiology Lead*, *Dr. Priya Nair - Psychiatrist*, *Dr. Elena Rostova - General Medicine*).
- **Instant Token Generator & Slip Printing**: Generates token numbers (e.g. `TK-842`) and printable intake token slips.

### 3. Telehealth Video Intake & HIPAA Security (RBAC)
- **30 FPS Canvas Stream Video Recorder**: Records telehealth calls combining live video stream and user microphone audio track into WebM video blobs.
- **Role-Based Access Control (RBAC)**: ED Physicians & Intake Nurses can view and play back recorded videos; IT Admins are restricted under HIPAA security rules.

### 4. Hospital Capacity & Medication Safety Tools
- **Live Hospital Bed Capacity Tracker**: Monitors real-time availability for ICU Resuscitation Bays, ED Trauma Bays, and Psychiatric Crisis Units with **1-Click Bed Reservation**.
- **Emergency Medication Checker**: Real-time Drug-Drug interaction safety analyzer for *Aspirin, Warfarin, Heparin, Nitroglycerin, Morphine* with hemorrhage and hypotension alert warnings.
- **1-Click Printable EMR Sheet Exporter (< 10ms)**: Generates official printable Emergency Department EMR Summary Sheets with digital physician signature blocks and instant PDF file download.

---

## 📁 Repository Structure

```
Onmysite/
├── backend/
│   ├── src/
│   │   ├── index.js                  # Express server entry point
│   │   ├── routes/
│   │   │   ├── events.js             # POST /events endpoint
│   │   │   ├── triage.js             # POST /triage endpoint
│   │   │   ├── replay.js             # POST /replay endpoint
│   │   │   └── chat.js               # POST /chat Gemini & Assistant endpoint
│   │   ├── engine/
│   │   │   ├── triageEngine.js       # Main orchestrator & state machine
│   │   │   ├── identityResolver.js   # Scoring-based identity matcher
      │   │   ├── temporalReconciler.js # Timestamp-based sorter & state merger
      │   │   ├── conflictResolver.js   # Priority conflict resolver
      │   │   ├── triageRules.js        # Rules, holding gates & decision checks
      │   │   └── dataParser.js         # Normalizer, keyword charter & clarification prompts
│   │   ├── store/
│   │   │   └── sessionStore.js       # In-memory session state store
│   │   └── utils/
│   │       ├── auditTrail.js         # Immutable audit logging utilities
│   │       └── stringUtils.js        # Levenshtein distance & normalization
│   ├── tests/                        # Automated Jest test suite
│   └── package.json
├── frontend/                         # React + Vite Glassmorphism Dashboard
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── AiReceptionistModal.jsx       # Smart AI Receptionist Desk
│   │   │   ├── BedCapacityModal.jsx          # Live Hospital Bed Capacity Desk
│   │   │   ├── MedicationCheckerModal.jsx    # Emergency Drug Interaction Checker
│   │   │   ├── EmrReportExporterModal.jsx   # 1-Click Printable EMR Sheet
│   │   │   ├── TelehealthVideoModal.jsx      # 30fps Video Call & Audio Recorder
│   │   │   ├── VideoPlaybackModal.jsx        # Role-restricted Video Player
│   │   │   └── ClinicalChatbot.jsx           # AI Clinical Assistant Chatbot
│   │   └── api/client.js
│   └── package.json
├── fixtures/                         # 7 Authentic clinical edge-case JSON files
├── audit-outputs/                    # Expected outputs paired with fixtures
├── push.bat / push.ps1               # 1-command Git auto-commit helpers
├── package.json                      # Monorepo root scripts
└── README.md
```

---

## ⚙️ Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

---

## 🚀 Getting Started

### 1. Installation

Install dependencies for both backend and frontend:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
cd ..
```

---

### 2. Running Locally

#### Run Backend Server (Port 3000)
```bash
npm run dev:backend
```
*Backend will start on `http://localhost:3000`.*

#### Run Frontend React Dashboard (Port 5173)
```bash
npm run dev:frontend
```
*Open `http://localhost:5173` in your browser.*

---

## 🧪 Running Automated Tests

Run the full Jest test suite covering identity resolution, conflict resolution, idempotency, emergency overrides, hanging session timeouts, holding gates, and replay determinism:

```bash
npm test
```

---

## 🎬 Running Terminal Replay

Execute fixture replays in the terminal with visual `console.table()` outputs and 100% determinism assertion checks:

```bash
# Replay default fixture (01_emergency_sensor_override.json)
npm run replay

# Replay any specific fixture:
node backend/src/scripts/replayRunner.js fixtures/02_identity_partial_match.json
node backend/src/scripts/replayRunner.js fixtures/03_duplicate_events.json
node backend/src/scripts/replayRunner.js fixtures/04_late_out_of_order.json
node backend/src/scripts/replayRunner.js fixtures/05_mental_health_text.json
node backend/src/scripts/replayRunner.js fixtures/06_conflicting_patient_ids.json
node backend/src/scripts/replayRunner.js fixtures/07_hanging_session_timeout.json
```

---

## 📡 API Documentation & `curl` Examples

### 1. Ingest Event (`POST /events`)

```bash
curl -X POST http://localhost:3000/events \
  -H "Content-Type: application/json" \
  -d '{
    "event_id": "evt_demo_101",
    "source": "text",
    "timestamp": "2026-08-16T12:00:00.000Z",
    "session_id": "sess_demo_1",
    "patient_id": "P-9001",
    "data": {
      "patient_name": "Aarav Sharma",
      "phone": "+91 9811022334",
      "symptoms": "Experiencing mild chest tightness"
    }
  }'
```

---

### 2. Ingest Sensor Telemetry Event (`POST /events`)

```bash
curl -X POST http://localhost:3000/events \
  -H "Content-Type: application/json" \
  -d '{
    "event_id": "evt_demo_102",
    "source": "sensor",
    "timestamp": "2026-08-16T12:02:00.000Z",
    "session_id": "sess_demo_1",
    "patient_id": "P-9001",
    "data": {
      "heart_rate": 165,
      "spo2": 86
    }
  }'
```

---

### 3. Evaluate Triage Gate (`POST /triage`)

```bash
curl -X POST http://localhost:3000/triage \
  -H "Content-Type: application/json" \
  -d '{ "session_id": "sess_demo_1" }'
```

---

### 4. Replay Event Sequence (`POST /replay`)

```bash
curl -X POST http://localhost:3000/replay \
  -H "Content-Type: application/json" \
  -d '{
    "events": [
      { "event_id": "r1", "source": "text", "timestamp": "2026-08-16T12:00:00Z", "session_id": "s_rep", "data": "Chest tightness" },
      { "event_id": "r2", "source": "sensor", "timestamp": "2026-08-16T12:01:00Z", "session_id": "s_rep", "data": { "spo2": 88, "heart_rate": 155 } }
    ]
  }'
```

---

## 📜 License

MIT License. Developed for Onmysite 2026.
