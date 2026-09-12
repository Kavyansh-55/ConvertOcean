/**
 * Unit tests for the .xlsx package surgery — merging and splitting.
 *
 * The interesting failures here are all silent. A merged workbook whose cells
 * still carry their old style indices opens perfectly and shows the wrong
 * formatting; one missing a content-type declaration opens as "damaged". So
 * these assert the indices themselves, not just that a file came back.
 */
import JSZip from 'jszip';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeWorkbookPackages, extractSheetPackage } from '../../src/scripts/tabular.js';
import * as TESTING_PATHS from '../testing-paths.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURES = TESTING_PATHS.FIXTURES;

let passed = 0;
let failed = 0;
function check(label, condition, detail = '') {
  if (condition) { passed++; console.log(`  PASS  ${label}${detail ? '  — ' + detail : ''}`); }
  else { failed++; console.log(`  FAIL  ${label}${detail ? '  — ' + detail : ''}`); }
}

const load = async (name) => ({
  name,
  zip: await JSZip.loadAsync(readFileSync(join(FIXTURES, name))),
});

/** Every cell in a sheet, with its style index. */
async function cellsOf(zip, path) {
  const xml = await zip.file(path).async('string');
  return [...xml.matchAll(/<c\b([^>]*)>/g)].map((m) => ({
    ref: (m[1].match(/r="([A-Z]+\d+)"/) || [])[1],
    style: Number((m[1].match(/\bs="(\d+)"/) || [])[1] ?? 0),
  }));
}

/** Resolve a cell style index to the fill colour it renders as. */
function fillResolver(stylesXml) {
  const section = (name) => {
    const open = new RegExp('<' + name + '(?=[\\s/>])');
    const m = open.exec(stylesXml);
    if (!m) return '';
    const gt = stylesXml.indexOf('>', m.index);
    const close = stylesXml.indexOf('</' + name + '>', gt);
    return close < 0 ? '' : stylesXml.slice(gt + 1, close);
  };
  const fills = [...section('fills').matchAll(/<fill>([\s\S]*?)<\/fill>/g)]
    .map((m) => (m[1].match(/<fgColor rgb="([0-9A-Fa-f]{6,8})"/) || [])[1] || null);
  const numFmts = new Map([...stylesXml.matchAll(/<numFmt numFmtId="(\d+)" formatCode="([^"]*)"/g)]
    .map((m) => [Number(m[1]), m[2]]));
  const xfs = [...section('cellXfs').matchAll(/<xf\b([^>]*)>/g)].map((m) => ({
    fillId: Number((m[1].match(/fillId="(\d+)"/) || [])[1] ?? 0),
    fontId: Number((m[1].match(/fontId="(\d+)"/) || [])[1] ?? 0),
    numFmtId: Number((m[1].match(/numFmtId="(\d+)"/) || [])[1] ?? 0),
  }));
  const fonts = [...section('fonts').matchAll(/<font>([\s\S]*?)<\/font>/g)]
    .map((m) => (m[1].match(/<name val="([^"]+)"/) || [])[1] || null);
  return {
    fill: (s) => (xfs[s] ? fills[xfs[s].fillId] || null : null),
    font: (s) => (xfs[s] ? fonts[xfs[s].fontId] || null : null),
    format: (s) => (xfs[s] ? numFmts.get(xfs[s].numFmtId) ?? null : null),
    xfCount: xfs.length,
  };
}

console.log('\nmerge-xlsx');

const a = await load('torture.xlsx');
const b = await load('torture-b.xlsx');
const bytes = await mergeWorkbookPackages(JSZip, [a, b]);
check('produces a package', bytes instanceof Uint8Array && bytes.length > 0,
  bytes ? bytes.length + ' bytes' : 'null');

const out = await JSZip.loadAsync(bytes);
const wb = await out.file('xl/workbook.xml').async('string');
const sheetTags = [...wb.matchAll(/<sheet\b[^>]*\/>/g)].map((m) => m[0]);
check('all six sheets are present', sheetTags.length === 6, sheetTags.length + ' sheets');

/* Every sheet must resolve to a part that exists, through the rels. Excel
   treats a dangling r:id as a damaged file, not as a missing sheet. */
const rels = await out.file('xl/_rels/workbook.xml.rels').async('string');
const targets = sheetTags.map((t) => {
  const rid = (t.match(/r:id="([^"]+)"/) || [])[1];
  const rel = (rels.match(new RegExp('<Relationship[^>]*Id="' + rid + '"[^>]*>')) || [])[0] || '';
  return (rel.match(/Target="([^"]+)"/) || [])[1] || '';
});
check('every sheet relationship resolves to a real part',
  targets.every((t) => t && out.file('xl/' + t.replace(/^\//, ''))),
  targets.join(', '));

const ct = await out.file('[Content_Types].xml').async('string');
const declared = targets.every((t) => ct.includes('/xl/' + t.replace(/^\//, '') + '"'));
check('every sheet part is declared in [Content_Types].xml', declared);
check('calcChain is not carried over', !out.file('xl/calcChain.xml'));

const styles = await out.file('xl/styles.xml').async('string');
const resolve = fillResolver(styles);

/* The heart of it. The first workbook's header band is white on navy and its
   money column is dollars; the second workbook's header is white on purple
   and its money column is euros, and those live at the SAME indices in their
   own style tables. If the merge did not rewrite the incoming indices, the
   second workbook's sheets come back navy and dollar-formatted — a file that
   opens cleanly and lies about the numbers. */
const aCells = await cellsOf(out, 'xl/worksheets/sheet1.xml');
const bSheet = targets[3].replace(/^\//, '');
const bCells = await cellsOf(out, 'xl/' + bSheet);

const aHeader = aCells.find((c) => c.ref === 'A2');
const bHeader = bCells.find((c) => c.ref === 'A1');
check('first workbook keeps its navy header',
  resolve.fill(aHeader.style) === 'FF1F4E79', `A2 fill ${resolve.fill(aHeader.style)}`);
check('second workbook keeps its purple header',
  resolve.fill(bHeader.style) === 'FF7E22CE', `A1 fill ${resolve.fill(bHeader.style)}`);

const aMoney = aCells.find((c) => c.ref === 'B3');
const bMoney = bCells.find((c) => c.ref === 'B2');
check('first workbook keeps dollar formatting',
  String(resolve.format(aMoney.style)).includes('$'), `B3 format ${resolve.format(aMoney.style)}`);
check('second workbook keeps euro formatting',
  String(resolve.format(bMoney.style)).includes('€'), `B2 format ${resolve.format(bMoney.style)}`);
check('the two workbooks kept different fonts',
  resolve.font(aHeader.style) === 'Calibri' && resolve.font(bHeader.style) === 'Arial',
  `${resolve.font(aHeader.style)} vs ${resolve.font(bHeader.style)}`);

/* Identical definitions are shared rather than duplicated. The two fixtures
   agree on nothing except the two fills every workbook must have — index 0
   "none" and index 1 "gray125" — and the empty border, so those are exactly
   what must not be duplicated. The cell styles themselves are all distinct
   here (even the two default xf entries differ, one being Calibri 11 and the
   other Arial 10), so 8 + 5 staying 13 is right, not a missed fold. */
const count = (name) => (styles.match(new RegExp("<" + name + "[ >]", "g")) || []).length;
check('the two reserved fills are shared, not duplicated', count('fill') === 5,
  count('fill') + ' fills from 4 + 3');
check('the empty border is shared, not duplicated', count('border') === 2,
  count('border') + ' borders from 2 + 1');
check('every cell style survives the fold', resolve.xfCount === 13,
  resolve.xfCount + ' cellXfs from 8 + 5, none of them identical');


/* ------------------------------------------------ splitting a package */

/* The other half of the same surgery. Removing sheets from a package means
   removing what declares them too, and the check that was supposed to strip
   their content-type Overrides was written as '<Override\b…' inside a quoted
   string — where \b is a backspace character, not a word boundary — so it
   matched nothing and every split part kept Overrides naming worksheets that
   were no longer in the file. The calcChain line directly beneath it is a
   regex literal and worked correctly the whole time. */
const split = await extractSheetPackage(JSZip, (await load('torture.xlsx')).zip, 'Styled');
const sz = await JSZip.loadAsync(split);
const parts = Object.keys(sz.files).filter((f) => !sz.files[f].dir);
const ctXml = await sz.file('[Content_Types].xml').async('string');
const overrides = [...ctXml.matchAll(/PartName="([^"]+)"/g)].map((m) => m[1]);
const stale = overrides.filter((o) => !parts.includes(o.replace(/^\//, '')));
check('a split part declares only parts it actually contains', stale.length === 0,
  stale.length ? 'stale: ' + stale.join(', ') : overrides.join(', '));
check('the sheet that was kept is still declared',
  overrides.includes('/xl/worksheets/sheet1.xml'));

const bSheetXml = await out.file('xl/' + bSheet).async('string');
check('column widths survive the move', /<col\b[^>]*customWidth="1"/.test(bSheetXml));
check('merged ranges survive the move', /<mergeCell\b/.test(bSheetXml));

/* ------------------------------------------------- shared strings remap */

/* Neither fixture uses sharedStrings, and that is the case most likely to
   break in the wild: two workbooks whose string tables both start at 0. */
const sst = (items) => '<?xml version="1.0"?><sst xmlns="http://schemas.openxmlformats.org/'
  + 'spreadsheetml/2006/main" count="' + items.length + '" uniqueCount="' + items.length + '">'
  + items.map((t) => '<si><t>' + t + '</t></si>').join('') + '</sst>';
const sheetWithStrings = (idx) => '<?xml version="1.0"?><worksheet xmlns="http://schemas.'
  + 'openxmlformats.org/spreadsheetml/2006/main"><sheetData><row r="1">'
  + '<c r="A1" t="s"><v>' + idx + '</v></c><c r="B1"/></row></sheetData></worksheet>';
const bookWith = async (strings, idx) => {
  const z = new JSZip();
  z.file('[Content_Types].xml', '<?xml version="1.0"?><Types xmlns="http://schemas.'
    + 'openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType='
    + '"application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" '
    + 'ContentType="application/xml"/></Types>');
  z.file('_rels/.rels', '<?xml version="1.0"?><Relationships xmlns="http://schemas.'
    + 'openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://'
    + 'schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" '
    + 'Target="xl/workbook.xml"/></Relationships>');
  z.file('xl/workbook.xml', '<?xml version="1.0"?><workbook xmlns="http://schemas.'
    + 'openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/'
    + 'officeDocument/2006/relationships"><sheets><sheet name="S" sheetId="1" r:id="rId1"/>'
    + '</sheets></workbook>');
  z.file('xl/_rels/workbook.xml.rels', '<?xml version="1.0"?><Relationships xmlns="http://'
    + 'schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" '
    + 'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" '
    + 'Target="worksheets/sheet1.xml"/></Relationships>');
  z.file('xl/sharedStrings.xml', sst(strings));
  z.file('xl/worksheets/sheet1.xml', sheetWithStrings(idx));
  return { name: 'book', zip: z };
};

const s1 = await bookWith(['alpha', 'beta'], 1);      // A1 reads "beta"
const s2 = await bookWith(['gamma', 'delta'], 0);     // A1 reads "gamma"
const mergedStrings = await mergeWorkbookPackages(JSZip, [s1, s2]);
const zs = await JSZip.loadAsync(mergedStrings);
const table = [...(await zs.file('xl/sharedStrings.xml').async('string'))
  .matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((m) => m[1]);
const secondPath = Object.keys(zs.files).filter((p) => /^xl\/worksheets\/sheet\d+\.xml$/.test(p))
  .sort()[1];
const secondXml = await zs.file(secondPath).async('string');
const secondIdx = Number((secondXml.match(/<c[^>]*t="s"[^>]*>\s*<v[^>]*>(\d+)</) || [])[1]);
check('shared string tables are concatenated', table.length === 4, table.join(','));
check('the second workbook\'s string index is remapped',
  table[secondIdx] === 'gamma', `index ${secondIdx} → ${table[secondIdx]}`);

/* A self-closing <c/> sits right after the string cell in that fixture. A
   remap written with a lazy `<c…>([\s\S]*?)</c>` runs straight past it and
   rewrites the following cell instead; this is what guards that. */
check('the empty cell beside it is untouched', /<c r="B1"\/>/.test(secondXml));

console.log(`\n  ${passed} passed, ${failed} failed\n`);
process.exit(failed ? 1 : 0);
