'use strict';

// Quick smoke tests for cron-doctor CLI — verifies the skill's scripts actually work.
// Run: node scripts/test.js

const { execFileSync } = require('child_process');
const path = require('path');

const CLI = path.join(__dirname, 'cli.js');
let passed = 0, failed = 0;

function run(args) {
  try {
    return execFileSync('node', [CLI, ...args], { encoding: 'utf8', timeout: 5000 });
  } catch (e) {
    return e.stdout || e.message;
  }
}

function test(name, args, expects) {
  const out = run(args);
  const ok = typeof expects === 'string' ? out.includes(expects) : expects(out);
  if (ok) { passed++; }
  else { failed++; console.log(`FAIL: ${name}\n  expected: ${expects}\n  got: ${out.slice(0, 200)}`); }
}

// describe
test('describe weekday schedule', ['describe', '0 9 * * 1-5'], '09:00');
test('describe every-5-min', ['describe', '*/5 * * * *'], '5');

// validate — impossible schedule
test('validate catches impossible Feb 30', ['validate', '0 0 30 2 *'], 'impossible');

// validate — OR semantics trap
test('validate catches OR-semantics', ['validate', '0 0 1,15 * 1'], 'OR semantics');

// next runs
test('next runs computes dates', ['next', '*/5 * * * *', '3'], 'Next 3 runs');

// presets
test('presets shows common schedules', ['presets'], 'Every 5 min');

// syntax error
test('validate rejects bad syntax', ['validate', 'not-a-cron'], 'Syntax error');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
