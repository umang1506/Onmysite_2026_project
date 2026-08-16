/**
 * Data Parsing, Modality Normalization & Triage Chart Generation Engine.
 */

// 1. Strip conversational filler words from mock "audio" or text transcripts
export function normalizeTranscript(text) {
  if (!text || typeof text !== 'string') return '';

  const fillerWords = [
    /\buh\b/gi, /\bum\b/gi, /\blike\b/gi, /\byou know\b/gi,
    /\bbasically\b/gi, /\bso\b/gi, /\bwell\b/gi, /\bi mean\b/gi,
    /\bkind of\b/gi, /\bsort of\b/gi, /\bactually\b/gi
  ];

  let cleaned = text;
  for (const filler of fillerWords) {
    cleaned = cleaned.replace(filler, '');
  }

  // Clean extra spaces
  return cleaned.replace(/\s+/g, ' ').trim();
}

// 2. Keyword-Driven Triage Chart Compiler
export function compileSymptomChart(text, telemetry = {}) {
  if (!text) return [];
  const lower = text.toLowerCase();
  const chartTags = [];

  // Critical Respiratory
  if (lower.includes('breathless') || lower.includes('shortness of breath') || lower.includes("can't breathe") || (telemetry.spo2 && telemetry.spo2 < 90)) {
    chartTags.push({ category: 'critical_respiratory', keyword: 'shortness of breath', severity: 'HIGH' });
  }

  // Cardiac Distress
  if (lower.includes('chest pain') || lower.includes('heart attack') || lower.includes('left arm') || lower.includes('diaphoretic')) {
    chartTags.push({ category: 'cardiac_distress', keyword: 'chest pain / radiating distress', severity: 'CRITICAL' });
  }

  // Mental Health Crisis
  if (lower.includes('panic') || lower.includes('anxiety') || lower.includes('suicidal') || lower.includes('depression') || lower.includes('overwhelmed')) {
    chartTags.push({ category: 'mental_health_crisis', keyword: 'psychological distress', severity: 'URGENT' });
  }

  // General Pain / Baseline
  if (lower.includes('dizziness') || lower.includes('headache') || lower.includes('fever') || lower.includes('mild pain')) {
    chartTags.push({ category: 'general_pain', keyword: 'general pain / dizziness', severity: 'MODERATE' });
  }

  return chartTags;
}

// 3. Automated Clarification Prompt Generator (Conflict Detection)
export function generateClarificationPrompt(text) {
  if (!text) return null;
  const lower = text.toLowerCase();

  const hasMild = lower.includes('mild') || lower.includes('slight') || lower.includes('minor');
  const hasSevereKey = lower.includes('chest pain') || lower.includes('shortness of breath') || lower.includes("can't breathe") || lower.includes('heart attack');

  if (hasMild && hasSevereKey) {
    return 'Automated Clarification Prompt: You mentioned mild symptoms but also reported severe chest pain or shortness of breath. Please confirm if your breathing or chest is currently restricted.';
  }

  return null;
}
