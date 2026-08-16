import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { processEvent, evaluateFinalTriage } from '../engine/triageEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runReplay() {
  const targetFixture = process.argv[2] || 'fixtures/01_emergency_sensor_override.json';
  const fixturePath = path.resolve(process.cwd(), targetFixture);

  console.log('\n============================================================');
  console.log(`🎬 ONMYSITE REPLAY RUNNER - REPLAYING FIXTURE`);
  console.log(`📁 Fixture File: ${fixturePath}`);
  console.log('============================================================\n');

  if (!fs.existsSync(fixturePath)) {
    console.error(`❌ Error: Fixture file not found at ${fixturePath}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(fixturePath, 'utf8');
  const events = JSON.parse(fileContent);

  console.log(`📥 Loaded ${events.length} input events from fixture.\n`);

  // Helper to run a full pass in an isolated state
  function executePass(passName) {
    const state = {
      session_id: `replay_pass_${passName}`,
      patient_id: null,
      identity: { name: null, phone: null, matchScore: 0.0, resolved: false },
      latest_symptom: null,
      latest_telemetry: { heart_rate: null, spo2: null, timestamp: null },
      triageDecision: null,
      events: [],
      processedEventIds: new Set(),
      auditTrail: [],
      lastActivityTimestamp: null
    };

    const stepTable = [];

    for (const event of events) {
      const res = processEvent(event, state);
      stepTable.push({
        EventID: event.event_id || 'AUTO_GEN',
        Source: event.source,
        Timestamp: event.timestamp,
        Status: res.status === 'ignored' ? '⚠️ IGNORED (Duplicate)' : '✅ INGESTED',
        DecisionState: state.triageDecision?.decision || 'Pending'
      });
    }

    const finalEval = evaluateFinalTriage(state);
    return { finalEval, stepTable, auditTrail: state.auditTrail };
  }

  console.log(`▶️ RUNNING PASS 1 (Initial Replay Execution)...`);
  const pass1 = executePass('1');
  console.table(pass1.stepTable);

  console.log(`\n📋 PASS 1 AUDIT TRAIL LOGS:`);
  pass1.auditTrail.forEach((log, idx) => {
    const actionTag = log.action === 'ignored' ? ' [IGNORED]' : ' [INGESTED]';
    console.log(`  ${idx + 1}. ${actionTag} ${log.reason}`);
  });

  console.log(`\n🎯 PASS 1 FINAL TRIAGE DECISION:`);
  console.log(`   • Decision: ${pass1.finalEval.decision}`);
  console.log(`   • Explanation: ${pass1.finalEval.explanation}`);
  console.log(`   • Patient ID: ${pass1.finalEval.patient_id}`);

  console.log(`\n------------------------------------------------------------`);
  console.log(`▶️ RUNNING PASS 2 (Verifying Deterministic Output)...`);
  const pass2 = executePass('2');

  const isIdenticalDecision = pass1.finalEval.decision === pass2.finalEval.decision;
  const isIdenticalExplanation = pass1.finalEval.explanation === pass2.finalEval.explanation;
  const isDeterministic = isIdenticalDecision && isIdenticalExplanation;

  console.log('\n============================================================');
  console.log('📊 DETERMINISM & REPEATABILITY VERIFICATION RESULT:');
  console.log(`   • Pass 1 Decision: "${pass1.finalEval.decision}"`);
  console.log(`   • Pass 2 Decision: "${pass2.finalEval.decision}"`);
  console.log(`   • Identical Output Asserted: ${isDeterministic ? '✅ PASSED (100% Deterministic)' : '❌ FAILED'}`);
  console.log('============================================================\n');
}

runReplay().catch(err => {
  console.error('Replay failed:', err);
  process.exit(1);
});
