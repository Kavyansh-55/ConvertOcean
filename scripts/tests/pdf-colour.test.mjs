/**
 * Unit tests for carrying PDF text colour into Word.
 *
 * pdf.js splits the page into two views that have to be reconciled:
 * getTextContent knows what the text says, and only the operator list knows
 * what colour it is painted. These tests run the real pdf.js against the real
 * fixture, because the interesting failure is in the seam between those two
 * views rather than in either half.
 *
 * The note that closed this out for a while said pdf.js could not build an
 * operator list in Node without the optional `canvas` module. It can — canvas
 * is needed to *render* a page, not to list its operators.
 */
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectTextColours, colourMatcher, collectPageLines } from '../../src/scripts/pdf-to-docx.js';

const require = createRequire(import.meta.url);
const pdfjs = require('pdfjs-dist');
const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURE = join(HERE, '..', 'fidelity', 'fixtures', 'files', 'torture.pdf');

let passed = 0;
let failed = 0;
function check(label, condition, detail = '') {
  if (condition) { passed++; console.log(`  PASS  ${label}${detail ? '  — ' + detail : ''}`); }
  else { failed++; console.log(`  FAIL  ${label}${detail ? '  — ' + detail : ''}`); }
}

console.log('\npdf-colour');

/* ------------------------------------------------------ the real document */

const data = new Uint8Array(readFileSync(FIXTURE));
const doc = await pdfjs.getDocument({ data }).promise;
const page = await doc.getPage(1);
const opList = await page.getOperatorList();
const textContent = await page.getTextContent();

const stream = collectTextColours(opList, pdfjs.OPS);
check('a colour stream comes back', !!stream && stream.chars.length > 0,
  stream ? `${stream.chars.length} glyphs` : 'null');
check('one colour per glyph', stream.chars.length === stream.colours.length,
  `${stream.chars.length} chars, ${stream.colours.length} colours`);

const fontNameOf = (id) => { try { return (page.commonObjs.get(id) || {}).name || ''; } catch { return ''; } };
const lines = collectPageLines(textContent, fontNameOf, stream);
const runs = lines.flatMap((l) => l.segments.flatMap((s) => s.runs));
const colourOf = (marker) => {
  const run = runs.find((r) => r.text.includes(marker));
  return run ? run.colour : 'no such run';
};

/* The fixture paints M01 navy (1F4E79) and M04 red (DB2626); everything else
   on the page is black. Those exact values are what must arrive. */
check('the navy heading keeps its colour', colourOf('M01') === '1F4E79', `M01 → ${colourOf('M01')}`);
check('the red text keeps its colour', colourOf('M04') === 'DB2626', `M04 → ${colourOf('M04')}`);
check('black body text is reported black', colourOf('M02') === '000000', `M02 → ${colourOf('M02')}`);

/* Colour must not leak past the run it belongs to. The old failure mode of a
   naive implementation is that everything after a coloured word inherits it. */
const afterRed = runs.filter((r) => r.colour === 'DB2626');
check('the red does not bleed into the rest of the page', afterRed.length <= 2,
  `${afterRed.length} runs coloured DB2626`);

/* ------------------------------------------------- the operator semantics */

const OPS = pdfjs.OPS;
const fake = (fnArray, argsArray) => ({ fnArray, argsArray });
const glyphs = (text) => [[...text].map((c) => ({ unicode: c }))];

/* q/Q save and restore the fill colour along with the rest of the graphics
   state. A tracker that ignores them keeps painting in a colour the page
   stopped using several operators ago. */
const saved = collectTextColours(fake(
  [OPS.setFillRGBColor, OPS.save, OPS.setFillRGBColor, OPS.showText, OPS.restore, OPS.showText],
  [[219, 38, 38], null, [0, 128, 0], glyphs('in'), null, glyphs('out')],
), OPS);
check('q/Q restores the fill colour',
  saved.colours[0] === '008000' && saved.colours[saved.chars.indexOf('o')] === 'DB2626',
  `${saved.chars} → ${saved.colours.join(',')}`);

const gray = collectTextColours(fake([OPS.setFillGray, OPS.showText], [[0.5], glyphs('g')]), OPS);
check('grayscale becomes a hex triple', gray.colours[0] === '808080', gray.colours[0]);

const cmyk = collectTextColours(fake([OPS.setFillCMYKColor, OPS.showText], [[0, 1, 1, 0], glyphs('c')]), OPS);
check('CMYK converts to RGB', cmyk.colours[0] === 'FF0000', cmyk.colours[0]);

/* A kerning adjustment inside a TJ array is a bare number, not a glyph. */
const kerned = collectTextColours(fake(
  [OPS.setFillRGBColor, OPS.showSpacedText],
  [[219, 38, 38], [[{ unicode: 'a' }, -120, { unicode: 'b' }]]],
), OPS);
check('kerning numbers are not mistaken for glyphs', kerned.chars === 'ab', kerned.chars);

/* ------------------------------------------------------------- matching */

const match = colourMatcher({ chars: 'onetwothree', colours: [
  ...Array(3).fill('AAAAAA'), ...Array(3).fill('BBBBBB'), ...Array(5).fill('CCCCCC'),
] });
check('items are matched in painting order',
  match('one') === 'AAAAAA' && match('two') === 'BBBBBB' && match('three') === 'CCCCCC');
check('an item that is not in the stream returns no colour',
  colourMatcher({ chars: 'abc', colours: ['AAAAAA', 'AAAAAA', 'AAAAAA'] })('zzz') === null);
check('whitespace-only items return no colour',
  colourMatcher({ chars: 'abc', colours: ['AAAAAA', 'AAAAAA', 'AAAAAA'] })('   ') === null);
check('no stream means no colour, not a crash', colourMatcher(null)('anything') === null);

console.log(`\n  ${passed} passed, ${failed} failed\n`);
process.exit(failed ? 1 : 0);
