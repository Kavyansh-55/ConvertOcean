/**
 * Builds `torture.pdf` — the fixture for pdf-to-word and pdf-to-excel.
 *
 * Assembled byte by byte rather than via a library, because the two converters
 * under test both work from pdf.js text positions: they infer lines from
 * baselines and columns from whitespace gutters. That means the *geometry* is
 * the test, and a generated PDF is the only way to know the geometry exactly.
 * Here we know that the amount column starts at x=468 and every figure in it is
 * right-aligned to x=540, so "did the converter find the column" has a real
 * answer rather than an impression.
 *
 * Page 1: coloured heading, mixed fonts, a ruled table with right-aligned
 *         numbers and currency.
 * Page 2: two-column body text — the layout that turns into interleaved
 *         nonsense when a converter reads straight across the page.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as TESTING_PATHS from '../../testing-paths.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

/* ------------------------------------------------------- content stream */

/** Escape a PDF literal string. */
function pstr(s) {
  return s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

/* Stated as exact 8-bit fractions so the colour that comes back out of a
   converter is the colour named here. Writing 0.12 0.31 0.47 instead scales
   to 1F4F78 — close to navy, but a value nobody chose, which makes every
   assertion downstream look like a magic number. */
const NAVY = [31 / 255, 78 / 255, 121 / 255];   // 1F4E79
const RED = [219 / 255, 38 / 255, 38 / 255];    // DB2626

/** Text-showing operator at an absolute position. */
function text(x, y, font, size, str, rgb) {
  const colour = rgb ? `${rgb[0]} ${rgb[1]} ${rgb[2]} rg\n` : '0 0 0 rg\n';
  return `BT\n${colour}/${font} ${size} Tf\n${x} ${y} Td\n(${pstr(str)}) Tj\nET\n`;
}

/** Approximate width of a Helvetica string, good enough to right-align. */
function widthOf(str, size) {
  // Helvetica averages ~0.5em; digits and uppercase run a little wider.
  let units = 0;
  for (const ch of str) {
    if (/[.,:;'|il]/.test(ch)) units += 0.28;
    else if (/[A-Z0-9$]/.test(ch)) units += 0.60;
    else if (/[mwMW]/.test(ch)) units += 0.85;
    else units += 0.52;
  }
  return units * size;
}

/** Right-align `str` so its right edge sits at `rightX`. */
function textRight(rightX, y, font, size, str, rgb) {
  return text(rightX - widthOf(str, size), y, font, size, str, rgb);
}

function line(x1, y1, x2, y2, w = 0.8) {
  return `${w} w\n0.4 0.4 0.4 RG\n${x1} ${y1} m\n${x2} ${y2} l\nS\n`;
}

/* --------------------------------------------------------------- page 1 */

/* Table geometry, fixed and known so assertions can check column recovery. */
const COL_LABEL = 72;
const COL_QTY_R = 400;
const COL_AMT_R = 540;
const TABLE_TOP = 560;
const ROW_H = 26;

const tableRows = [
  ['M05 Widget, large', '12', '$1,440.00'],
  ['M06 Gadget, small', '1,240', '$18,600.00'],
  ['M07 Sprocket', '98', '$2,058.50'],
  ['M08 Refund', '-3', '-$450.00'],
];

let p1 = '';
// M01 coloured heading, 24pt Helvetica-Bold
p1 += text(72, 720, 'F2', 24, 'M01 Torture PDF', NAVY);
// M02 body in Times at 12pt
p1 += text(72, 690, 'F3', 12, 'M02 Body paragraph set in Times-Roman at 12 point.');
// M03 monospace
p1 += text(72, 668, 'F4', 11, 'M03 const x = monospace();');
// M04 a run in red
p1 += text(72, 646, 'F1', 12, 'M04 This sentence is red.', RED);

// table header + rule
p1 += text(COL_LABEL, TABLE_TOP, 'F2', 12, 'Item');
p1 += textRight(COL_QTY_R, TABLE_TOP, 'F2', 12, 'Qty');
p1 += textRight(COL_AMT_R, TABLE_TOP, 'F2', 12, 'Amount');
p1 += line(72, TABLE_TOP - 8, 540, TABLE_TOP - 8, 1.2);

tableRows.forEach((r, i) => {
  const y = TABLE_TOP - ROW_H * (i + 1);
  p1 += text(COL_LABEL, y, 'F1', 11, r[0]);
  p1 += textRight(COL_QTY_R, y, 'F1', 11, r[1]);
  p1 += textRight(COL_AMT_R, y, 'F1', 11, r[2]);
  p1 += line(72, y - 8, 540, y - 8, 0.4);
});

// total row
const totalY = TABLE_TOP - ROW_H * (tableRows.length + 1);
p1 += text(COL_LABEL, totalY, 'F2', 11, 'M09 Total');
p1 += textRight(COL_AMT_R, totalY, 'F2', 11, '$21,648.50');
p1 += line(72, totalY - 8, 540, totalY - 8, 1.2);

// M10 footer line
p1 += text(72, 60, 'F1', 9, 'M10 Page 1 of 2 - ConvertOcean fidelity fixture', [0.4, 0.4, 0.4]);

/* --------------------------------------------------------------- page 2 */

/* Two columns, 234pt wide each with a 36pt gutter. A converter that reads by
   baseline across the full page will interleave the two columns' lines. */
const LEFT_X = 72;
const RIGHT_X = 342;

const leftLines = [
  'M11 This is the left column. Each',
  'line here belongs with the line',
  'below it, not with the line to its',
  'right. A converter that walks the',
  'page by baseline will interleave',
  'the two columns and produce text',
  'that reads as nonsense.',
];
const rightLines = [
  'M12 This is the right column. It',
  'sits at the same baselines as the',
  'left column, which is exactly the',
  'condition that breaks naive text',
  'extraction. Recovering these as',
  'two separate blocks is the test.',
  '',
];

let p2 = text(72, 720, 'F2', 18, 'M11 Two column layout', NAVY);
leftLines.forEach((t, i) => { if (t) p2 += text(LEFT_X, 680 - i * 18, 'F1', 11, t); });
rightLines.forEach((t, i) => { if (t) p2 += text(RIGHT_X, 680 - i * 18, 'F1', 11, t); });
p2 += text(72, 60, 'F1', 9, 'M13 Page 2 of 2 - ConvertOcean fidelity fixture', [0.4, 0.4, 0.4]);

/* ------------------------------------------------------- object assembly */

const objects = [];
function obj(body) {
  objects.push(body);
  return objects.length; // 1-based object number
}

function stream(content) {
  const bytes = Buffer.byteLength(content, 'latin1');
  return `<< /Length ${bytes} >>\nstream\n${content}endstream`;
}

// Fonts first so their numbers are stable in the resource dict.
const fHelv = obj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
const fBold = obj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
const fTimes = obj('<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman /Encoding /WinAnsiEncoding >>');
const fCour = obj('<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>');

const resources = `<< /Font << /F1 ${fHelv} 0 R /F2 ${fBold} 0 R /F3 ${fTimes} 0 R /F4 ${fCour} 0 R >> >>`;

const c1 = obj(stream(p1));
const c2 = obj(stream(p2));

// Reserve numbers for pages and the pages node.
const pagesNum = objects.length + 3; // after the two page objects
const page1 = obj(`<< /Type /Page /Parent ${pagesNum} 0 R /MediaBox [0 0 612 792] /Resources ${resources} /Contents ${c1} 0 R >>`);
const page2 = obj(`<< /Type /Page /Parent ${pagesNum} 0 R /MediaBox [0 0 612 792] /Resources ${resources} /Contents ${c2} 0 R >>`);
const pages = obj(`<< /Type /Pages /Kids [${page1} 0 R ${page2} 0 R] /Count 2 >>`);
const catalog = obj(`<< /Type /Catalog /Pages ${pages} 0 R >>`);

if (pages !== pagesNum) throw new Error(`page-tree object number drifted: expected ${pagesNum}, got ${pages}`);

/* ------------------------------------------------------------ serialise */

let pdf = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
const offsets = [0];
objects.forEach((body, i) => {
  offsets.push(Buffer.byteLength(pdf, 'latin1'));
  pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
});

const xrefAt = Buffer.byteLength(pdf, 'latin1');
pdf += `xref\n0 ${objects.length + 1}\n`;
pdf += '0000000000 65535 f \n';
for (let i = 1; i <= objects.length; i++) {
  pdf += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
}
pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalog} 0 R >>\nstartxref\n${xrefAt}\n%%EOF\n`;

const outDir = TESTING_PATHS.FIXTURES;
mkdirSync(outDir, { recursive: true });
const buf = Buffer.from(pdf, 'latin1');
writeFileSync(join(outDir, 'torture.pdf'), buf);
console.log(`torture.pdf   ${buf.length} bytes  2 pages, ${objects.length} objects, 4 fonts`);
