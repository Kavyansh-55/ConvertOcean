/**
 * Unit tests for the PDF font selection logic.
 *
 * The network-dependent parts (fetching a TTF) are exercised by the browser
 * harness; what is worth testing fast is the decision-making: which text needs
 * a download at all, how a mixed-script line is split into runs, and what gets
 * reported as unrenderable rather than silently mangled.
 *
 *   node scripts/tests/pdf-fonts.test.mjs
 */
import assert from 'node:assert/strict';
import {
  analyseText, splitRuns, fontKeyFor, isWinAnsi,
} from '../../src/scripts/pdf-fonts.js';

const tests = [];
const test = (name, fn) => tests.push([name, fn]);

/* --------------------------------------------------------- what is needed */

test('plain ASCII needs no font download', () => {
  const r = analyseText('Invoice 1001 total $1,440.00');
  assert.equal(r.ascii, true);
  assert.deepEqual(r.needed, []);
  assert.deepEqual(r.unsupported, []);
});

test('WinAnsi accents alone still need no download', () => {
  // é and ü are inside the standard fonts' repertoire.
  const r = analyseText('café über');
  assert.equal(r.ascii, true);
  assert.deepEqual(r.needed, []);
});

test('an em dash forces the Latin font', () => {
  // U+2014 is outside WinAnsi, and mis-encoding it is what produced the
  // interleaved-NUL corruption in the original bug.
  const r = analyseText('Ünïcodé — dash');
  assert.equal(r.ascii, false);
  assert.deepEqual(r.needed, ['latin']);
});

test('Devanagari asks for the Devanagari font', () => {
  const r = analyseText('नमस्ते');
  assert.ok(r.needed.includes('devanagari'));
});

test('a mixed Latin/Devanagari line needs both fonts', () => {
  // Measured, not assumed: NotoSansDevanagari has no Latin glyphs, so one
  // font cannot set this line.
  const r = analyseText('Invoice नमस्ते — total');
  assert.ok(r.needed.includes('devanagari'), 'needs Devanagari');
  assert.ok(r.needed.includes('latin'), 'needs Latin for the em dash');
});

test('Cyrillic is served by the Latin font', () => {
  assert.deepEqual(analyseText('Привет').needed, ['latin']);
});

test('CJK is reported as unsupported, not silently accepted', () => {
  const r = analyseText('変換');
  assert.ok(r.unsupported.some((u) => /Chinese/.test(u)));
  assert.ok(!r.needed.includes('latin'), 'must not pretend a Latin font covers it');
});

test('other unembeddable scripts are named individually', () => {
  assert.ok(analyseText('مرحبا').unsupported.some((u) => /Arabic/.test(u)));
  assert.ok(analyseText('สวัสดี').unsupported.some((u) => /Thai/.test(u)));
  assert.ok(analyseText('வணக்கம்').unsupported.some((u) => /Tamil/.test(u)));
});

/* ------------------------------------------------------------------ runs */

test('a pure ASCII string is one run needing no font', () => {
  assert.deepEqual(splitRuns('hello world'), [{ text: 'hello world', font: null }]);
});

test('a pure Devanagari string is one Devanagari run', () => {
  const runs = splitRuns('नमस्ते');
  assert.equal(runs.length, 1);
  assert.equal(runs[0].font, 'devanagari');
});

test('a mixed line splits into runs by script', () => {
  const runs = splitRuns('Invoice नमस्ते');
  assert.ok(runs.length >= 2, 'must not be drawn as one run');
  assert.ok(runs.some((r) => r.font === 'devanagari'));
  // Every character survives the split — nothing is dropped on the way.
  assert.equal(runs.map((r) => r.text).join(''), 'Invoice नमस्ते');
});

test('splitting is lossless for a three-script string', () => {
  const s = 'A — नमस्ते — 変換 end';
  assert.equal(splitRuns(s).map((r) => r.text).join(''), s);
});

test('unsupported characters are marked, not merged into a real font', () => {
  const runs = splitRuns('変換');
  assert.equal(runs.length, 1);
  assert.equal(runs[0].font, 'unsupported');
});

test('ASCII between two Devanagari words does not fragment the run', () => {
  // Fewer font switches, and a space must not split a phrase.
  const runs = splitRuns('नमस्ते जी');
  assert.equal(runs.length, 1, 'the space should stay inside the Devanagari run');
});

/* ------------------------------------------------------------ boundaries */

test('isWinAnsi excludes the C1 control block', () => {
  assert.equal(isWinAnsi(0x41), true);
  assert.equal(isWinAnsi(0xe9), true);    // é
  assert.equal(isWinAnsi(0x85), false);   // C1
  assert.equal(isWinAnsi(0x2014), false); // em dash
});

test('fontKeyFor routes each script to the right font', () => {
  assert.equal(fontKeyFor(0x0041), 'latin');
  assert.equal(fontKeyFor(0x0915), 'devanagari');
  assert.equal(fontKeyFor(0x0410), 'latin');     // Cyrillic А
  assert.equal(fontKeyFor(0x4e00), null);        // CJK
});

/* --------------------------------------------------------------- runner */

let failed = 0, passed = 0;
for (const [name, fn] of tests) {
  try { fn(); passed++; }
  catch (e) { failed++; console.log(`FAIL  ${name}\n      ${e.message.split('\n')[0]}`); }
}
console.log(`\n${passed}/${tests.length} pdf-font tests passed`);
process.exit(failed ? 1 : 0);
