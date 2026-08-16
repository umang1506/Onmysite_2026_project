# 🏥 Onmysite — Deterministic Clinical Triage & Event Reconciliation System

A production-grade, deterministic clinical triage engine designed to process multimodal incoming patient events (audio transcriptions, patient text messages, IoT sensor telemetry), resolve patient identity and out-of-order temporal conflicts, enforce decision gates, maintain immutable audit trails, and support 100% repeatable event replays.

---

## 🌟 Key Features

1. **Multimodal Event Ingestion**: Ingests `sensor` (heart rate, SpO₂), `text`, and `audio` inputs with schema validation and idempotency protection.
2. **Deterministic Identity Resolution**: Scores patient identity using normalized phone numbers (+0.4), Levenshtein string distance on names (+0.3), symptom pattern overlap (+0.2), and exact `patient_id` matches (+1.0) without non-deterministic ML.
3. **Temporal Conflict Reconciliation**: Sorts events strictly by ISO 8601 timestamps (`new Date(ts).getTime()`). Out-of-order events update state according to real-world occurrence time rather than arrival sequence.
4. **Priority Conflict Engine**: Emergency sensor vitals (SpO₂ < 90%, HR > 150 or < 40 bpm) override conflicting non-emergency patient text reports with dynamic value interpolation.
5. **"Hanging Session" Timeout Edge Case**: Flag sessions sitting past 5 minutes without required sensor telemetry as `"Pending - Incomplete Data (Timeout)"`.
6. **Decision Gate & Dynamic Audit Trail**: Requires multimodal evidence before issuing triage decisions. Records structured audit logs for every state transition.
7. **Replay Simulator**: Isolated execution engine guarantees identical decision output across repeated runs of fixture data.

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
│   │   │   └── replay.js             # POST /replay endpoint
│   │   ├── engine/
│   │   │   ├── triageEngine.js       # Main orchestrator
│   │   │   ├── identityResolver.js   # Scoring-based identity matcher
│   │   │   ├── temporalReconciler.js # Timestamp-based sorter & state merger
│   │   │   ├── conflictResolver.js   # Priority conflict resolver
│   │   │   └── triageRules.js        # Deterministic rules & gate checks
│   │   ├── store/
│   │   │   └── sessionStore.js       # In-memory session manager
│   │   └── utils/
│   │       ├── auditTrail.js         # Audit logging utilities
│   │       └── stringUtils.js        # Levenshtein distance & normalization
│   ├── tests/                        # Automated Jest test suite (6 categories)
│   └── package.json
├── frontend/                         # React + Vite Glassmorphism Dashboard
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
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

Run the full Jest test suite covering identity resolution, conflict resolution, idempotency, emergency overrides, hanging session timeouts, and replay determinism:

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
      "patient_name": "Rohan Sharma",
      "symptoms": "Experiencing mild headache"
    }
  }'
```

---

### 2. Ingest Sensor Event (`POST /events`)

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

### 4. Replay Events (`POST /replay`)

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

## 🌐 Live Deployment Readiness (Vercel)

The React frontend is configured for instant deployment to Vercel:

1. Push your code to your GitHub repo `https://github.com/umang1506/Onmysite_2026_project.git`.
2. Connect your repo in [Vercel Dashboard](https://vercel.com).
3. Set Root Directory to `frontend`.
4. Set Build Command to `npm run build` and Output Directory to `dist`.

---

## 📜 License

MIT License. Developed for Onmysite 2026.
