#!/usr/bin/env node
'use strict';

// cron-doctor CLI — diagnose cron expressions from the command line.
// Zero dependencies. Part of the takeaseat devops-skills collection.
//
// Usage:
//   node cli.js describe "0 9 * * 1-5"
//   node cli.js validate "0 0 30 2 *"
//   node cli.js next "*/5 * * * *" 5
//   node cli.js presets

const { describe, validate, nextRuns, formatNextRuns, estimateFrequency, PRESETS } = require('./cron-engine.js');

const [, , cmd, ...args] = process.argv;

function usage() {
  console.log(`cron-doctor — diagnose cron expressions

Usage:
  cron-doctor describe  "<expr>"        Plain-English description
  cron-doctor validate  "<expr>"        Deep validation (catches death-traps)
  cron-doctor next      "<expr>" [N]    Next N fire times (default 5)
  cron-doctor presets                    Show common cron presets
  cron-doctor all       "<expr>"        Full report (describe + validate + next 5)

Examples:
  cron-doctor validate "0 0 30 2 *"
  cron-doctor describe "*/5 * * * *"
  cron-doctor all "0 0 1,15 * 1"
  cron-doctor next "0 9 * * 1-5" 10`);
}

function msgOf(item) {
  return typeof item === 'string' ? item : (item?.message || JSON.stringify(item));
}

function showDescribe(expr) {
  try {
    const result = describe(expr);
    if (result.error) { console.error(`Error: ${result.text}`); process.exit(1); }
    console.log(result.text);
  } catch (e) {
    console.error(`Error: ${e.message}`);
    process.exit(1);
  }
}

function showValidate(expr) {
  try {
    const result = validate(expr);
    console.log(`Expression:   ${expr}`);
    if (!result.valid) { console.log(`Syntax error: ${result.error}`); process.exit(1); }
    console.log(`Valid syntax: yes`);
    if (result.warnings && result.warnings.length) {
      console.log(`\n⚠️  Warnings (${result.warnings.length}):`);
      for (const w of result.warnings) console.log(`   • [${w.level || 'warn'}] ${msgOf(w)}`);
    }
    if (result.observations && result.observations.length) {
      console.log(`\n📋 Observations:`);
      for (const o of result.observations) console.log(`   • [${o.level || 'info'}] ${msgOf(o)}`);
    }
    if (result.suggestions && result.suggestions.length) {
      console.log(`\n💡 Suggestions:`);
      for (const s of result.suggestions) console.log(`   • ${msgOf(s)}`);
    }
    if (result.parsed) {
      const freq = estimateFrequency(result.parsed);
      if (freq) console.log(`\nEstimated fires/year: ${freq.runsPerYear} (${freq.description})`);
    }
    if (!result.warnings?.length && !result.observations?.length) {
      console.log('\n✅ No issues found. Schedule looks healthy.');
    }
  } catch (e) {
    console.error(`Error: ${e.message}`);
    process.exit(1);
  }
}

function showNext(expr, n) {
  n = parseInt(n, 10) || 5;
  try {
    const from = new Date();
    const runs = nextRuns(expr, from, n);
    const formatted = formatNextRuns(runs, from);
    console.log(`Next ${runs.length} runs for "${expr}" (from ${from.toISOString()}):`);
    for (const r of formatted) {
      console.log(`  ${r.formatted}  (${r.relative})`);
    }
  } catch (e) {
    console.error(`Error: ${e.message}`);
    process.exit(1);
  }
}

function showPresets() {
  console.log('Common cron presets:\n');
  for (const p of PRESETS) {
    console.log(`  ${p.cron.padEnd(16)} ${p.label}`);
  }
}

function showAll(expr) {
  console.log('═'.repeat(60));
  showDescribe(expr);
  console.log('\n' + '─'.repeat(60));
  showValidate(expr);
  console.log('\n' + '─'.repeat(60));
  showNext(expr, 5);
  console.log('\n' + '═'.repeat(60));
}

switch (cmd) {
  case 'describe': showDescribe(args[0]); break;
  case 'validate': showValidate(args[0]); break;
  case 'next': showNext(args[0], args[1]); break;
  case 'presets': showPresets(); break;
  case 'all': showAll(args[0]); break;
  default: usage(); process.exit(cmd ? 1 : 0);
}
