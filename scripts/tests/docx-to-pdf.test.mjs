/**
 * Unit tests for the DOCX → pdfmake mapping rules.
 *
 * The DOM-walking half is covered end to end by the browser harness; what is
 * worth testing fast is the arithmetic and the decisions — unit conversions,
 * font categorisation, colour normalisation, and the run/paragraph property
 * mapping, which is where a wrong answer is silent rather than loud.
 *
 *   node scripts/tests/docx-to-pdf.test.mjs
 */
import assert from 'node:assert/strict';
import {
  twipsToPt, halfPtToPt, emuToPt,
  fontCategory, fontFor, CATEGORY_FONT,
  normaliseColour, highlightColour,
  runToNode, paragraphMargin,
} from '../../src/scripts/docx-to-pdf.js';

const tests = [];
const test = (name, fn) => tests.push([name, fn]);

/* ----------------------------------------------------------------- units */

test('twips convert to points', () => {
  assert.equal(twipsToPt(1440), 72);      // 1 inch
  assert.equal(twipsToPt(720), 36);
  assert.equal(twipsToPt(0), 0);
  assert.equal(twipsToPt(null), 0);
});

test('half-points convert to points', () => {
  assert.equal(halfPtToPt(26), 13);       // the fixture's Georgia 13pt
  assert.equal(halfPtToPt(48), 24);       // the heading
});

test('EMU convert to points', () => {
  assert.equal(emuToPt(914400), 72);      // 1 inch
  assert.equal(emuToPt(2286000), 180);    // the fixture image, 2.5in
});

test('A4 page dimensions round-trip', () => {
  // 11906 x 16838 twips is A4 portrait.
  assert.ok(Math.abs(twipsToPt(11906) - 595.3) < 0.5);
  assert.ok(Math.abs(twipsToPt(16838) - 841.9) < 0.5);
});

/* ----------------------------------------------------------------- fonts */

test('font names are categorised by family, not matched exactly', () => {
  assert.equal(fontCategory('Georgia'), 'serif');
  assert.equal(fontCategory('Times New Roman'), 'serif');
  assert.equal(fontCategory('Cambria'), 'serif');
  assert.equal(fontCategory('Courier New'), 'mono');
  assert.equal(fontCategory('Consolas'), 'mono');
  assert.equal(fontCategory('Calibri'), 'sans');
  assert.equal(fontCategory('Arial'), 'sans');
  assert.equal(fontCategory(''), 'sans');
  assert.equal(fontCategory(undefined), 'sans');
});

test('a serif name does not get mistaken for mono', () => {
  // "Courier" contains no serif keyword and must not fall through to serif.
  assert.equal(fontCategory('Courier'), 'mono');
  assert.equal(fontCategory('DejaVu Sans Mono'), 'mono');
});

test('fontFor falls back to Roboto when a substitute did not load', () => {
  // Naming a family pdfmake has no data for throws during layout, so an
  // unavailable substitute must degrade rather than be requested.
  assert.equal(fontFor({ fontName: 'Georgia' }, new Set()), 'Roboto');
  assert.equal(fontFor({ fontName: 'Georgia' }, new Set(['NotoSerif'])), 'NotoSerif');
  assert.equal(fontFor({ fontName: 'Calibri' }, new Set()), 'Roboto');
});

test('every category maps to a registered family name', () => {
  for (const c of ['sans', 'serif', 'mono']) assert.ok(CATEGORY_FONT[c]);
});

/* --------------------------------------------------------------- colours */

test('a hex colour normalises to CSS form', () => {
  assert.equal(normaliseColour('FF0000'), '#ff0000');
  assert.equal(normaliseColour('1F4E79'), '#1f4e79');
});

test('"auto" is not a colour', () => {
  // Word writes auto for an inherited colour; treating it as a value would
  // paint black over whatever the style intended.
  assert.equal(normaliseColour('auto'), null);
  assert.equal(normaliseColour(''), null);
  assert.equal(normaliseColour(null), null);
  assert.equal(normaliseColour('nonsense'), null);
});

test('named highlights map to a background colour', () => {
  assert.equal(highlightColour('yellow'), '#ffff00');
  assert.equal(highlightColour('darkRed'), '#800000');
  assert.equal(highlightColour('none'), null);
});

/* ------------------------------------------------------------ run nodes */

test('a plain run carries no needless properties', () => {
  assert.deepEqual(runToNode('hello', {}, new Set()), { text: 'hello' });
});

test('bold, italic and colour survive onto the node', () => {
  const n = runToNode('x', { bold: true, italics: true, color: '#ff0000', fontSize: 13 }, new Set());
  assert.equal(n.bold, true);
  assert.equal(n.italics, true);
  assert.equal(n.color, '#ff0000');
  assert.equal(n.fontSize, 13);
});

test('underline and strikethrough combine into one decoration list', () => {
  const one = runToNode('x', { underline: true }, new Set());
  assert.equal(one.decoration, 'underline');
  const both = runToNode('x', { underline: true, strike: true }, new Set());
  assert.deepEqual(both.decoration, ['underline', 'lineThrough']);
});

test('a highlight becomes a background', () => {
  assert.equal(runToNode('x', { background: '#ffff00' }, new Set()).background, '#ffff00');
});

test('a serif run names its font only when that font loaded', () => {
  assert.equal(runToNode('x', { fontName: 'Georgia' }, new Set()).font, undefined);
  assert.equal(runToNode('x', { fontName: 'Georgia' }, new Set(['NotoSerif'])).font, 'NotoSerif');
});

test('superscript is approximated by a smaller size', () => {
  const n = runToNode('2', { sup: true, fontSize: 11 }, new Set());
  assert.ok(n.fontSize < 11 && n.fontSize >= 6);
});

/* ------------------------------------------------------------- margins */

test('a hanging indent pulls the first line back', () => {
  // left 720tw (36pt) with a 360tw (18pt) hang starts the block at 18pt.
  const m = paragraphMargin({ indentLeft: 36, hanging: 18 });
  assert.equal(m[0], 18);
});

test('an indent without a hang is used as-is', () => {
  assert.equal(paragraphMargin({ indentLeft: 36 })[0], 36);
});

test('a negative computed indent is clamped to zero', () => {
  assert.equal(paragraphMargin({ indentLeft: 0, hanging: 36 })[0], 0);
});

test('paragraph spacing lands in the margin box', () => {
  const m = paragraphMargin({ spaceBefore: 12, spaceAfter: 6 });
  assert.equal(m[1], 12);
  assert.equal(m[3], 6);
});

/* --------------------------------------------------------------- runner */

let failed = 0, passed = 0;
for (const [name, fn] of tests) {
  try { fn(); passed++; }
  catch (e) { failed++; console.log(`FAIL  ${name}\n      ${e.message.split('\n')[0]}`); }
}
console.log(`\n${passed}/${tests.length} docx-to-pdf tests passed`);
process.exit(failed ? 1 : 0);
