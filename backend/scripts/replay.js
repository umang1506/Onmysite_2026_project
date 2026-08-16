import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { resetStore } from '../src/store/sessionStore.js';
import { ingestEvent, getTriageDecision } from '../src/engine/triageEngine.js';
import { sortEventsByTimestamp } from '../src/engine/temporalReconciler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(__dirname, '../../fixtures');

function hash(obj) {
  return crypto.createHash('sha256').update(JSON.stringify(obj)).digest('hex').slice(0, 12);
}

function colorAction(action) {
  if (action === 'ingested') return chalk.green(action);
  if (action === 'ignored') return chalk.red(action);
  return chalk.yellow(action);
}

function replayFile(filePath) {
  const name = path.basename(filePath);
  console.log(chalk.cyan(`\n╔${'═'.repeat(50)}╗`));
  console.log(chalk.cyan(`║  REPLAY: ${name.padEnd(38)}║`));
  console.log(chalk.cyan(`╚${'═'.repeat(50)}╝\n`));

  const events = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const sorted = sortEventsByTimestamp(events);

  resetStore();
  const rows = [];
  for (const ev of sorted) {
    const before = rows.length;
    ingestEvent(ev);
    const session = getTriageDecision(ev.session_id);
    const last = session.audit_trail[session.audit_trail.length - 1];
    if (last) {
      rows.push({
        event_id: last.event_id?.slice(0, 8),
        source: last.source,
        timestamp: last.timestamp?.slice(11, 19),
        action: last.action,
        detail: (last.detail || '').slice(0, 40)
      });
    }
    if (rows.length === before) rows.push({ event_id: ev.event_id?.slice(0, 8), source: ev.source, action: 'ingested' });
  }

  console.log(chalk.bold('📥 AUDIT TRAIL'));
  console.table(rows.map((r) => ({ ...r, action: r.action })));

  const result = getTriageDecision(sorted[0].session_id);
  console.log(chalk.bold('\n🎯 FINAL DECISION'));
  console.table({
    decision: result.decision,
    explanation: result.explanation.slice(0, 80) + (result.explanation.length > 80 ? '...' : ''),
    session_id: result.session_id,
    patient_id: result.patient_id
  });

  resetStore();
  for (const ev of sorted) ingestEvent(ev);
  const result2 = getTriageDecision(sorted[0].session_id);
  const h1 = hash(result);
  const h2 = hash(result2);
  const match = h1 === h2;
  console.log(chalk.bold('\n✅ IDEMPOTENCY CHECK'));
  console.log(`   Run 1 hash: ${h1}`);
  console.log(`   Run 2 hash: ${h2}`);
  console.log(match ? chalk.green('   ✓ IDENTICAL') : chalk.red('   ✗ MISMATCH'));
  return match;
}

const args = process.argv.slice(2);
if (args.includes('--all')) {
  const files = fs.readdirSync(fixturesDir).filter((f) => f.endsWith('.json')).sort();
  let pass = 0;
  for (const f of files) {
    if (replayFile(path.join(fixturesDir, f))) pass++;
  }
  console.log(chalk.bold(`\n${pass}/${files.length} fixtures passed idempotency check`));
} else {
  const file = args[0] || path.join(fixturesDir, '01_emergency_sensor_override.json');
  replayFile(path.resolve(file));
}
