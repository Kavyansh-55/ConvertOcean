// End-to-end: test.pdf -> pdf.js -> collectPageLines -> buildDocxParts -> out.docx
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import JSZip from 'jszip';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
// Text extraction only — stub the rendering-related global pdf.js probes for.
if (!globalThis.DOMMatrix) globalThis.DOMMatrix = class DOMMatrix { constructor() { this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0; } };
if (!globalThis.Path2D) globalThis.Path2D = class Path2D {};
const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');
const { getDocument } = pdfjs;

await import(new URL('build-test-pdf.mjs', import.meta.url).href); // writes test.pdf
const core = await import(new URL('../../../src/scripts/pdf-to-docx.js', import.meta.url).href);
const { collectPageLines, buildDocxParts, pagesPlainText } = core;

const here = (f) => new URL(f, import.meta.url);
const data = new Uint8Array(fs.readFileSync(here('test.pdf')));
const standardFontDataUrl =
  pathToFileURL(path.resolve('node_modules/pdfjs-dist/standard_fonts/')).href + '/';

const pdf = await getDocument({ data, standardFontDataUrl }).promise;
console.log('pages:', pdf.numPages);

const pages = [];
for (let i = 1; i <= pdf.numPages; i++) {
  const page = await pdf.getPage(i);
  try { await page.getOperatorList(); } catch (e) { console.log('opList failed:', e.message); }
  const textContent = await page.getTextContent();
  if (i === 1 && process.env.DUMP_ITEMS) {
    for (const it of textContent.items) {
      console.log(JSON.stringify({ str: it.str, x: it.transform && it.transform[4], y: it.transform && it.transform[5], w: it.width, font: it.fontName, eol: it.hasEOL }));
    }
  }
  const fontNameOf = (id) => {
    try { const f = page.commonObjs.get(id); return (f && f.name) || ''; }
    catch (e) { return ''; }
  };
  const viewport = page.getViewport({ scale: 1 });
  pages.push({
    lines: collectPageLines(textContent, fontNameOf),
    width: viewport.width,
    height: viewport.height,
  });
}

console.log('--- plain text ---');
console.log(pagesPlainText(pages));
console.log('--- line summary (page 1) ---');
for (const l of pages[0].lines) {
  console.log(
    `y=${l.y} segs=${l.segments.length} maxSize=${l.maxSize.toFixed(1)} ` +
    l.segments.map(s => `[${s.x.toFixed(0)}:"${s.text}" ${s.runs[0].bold ? 'B' : ''}${s.runs[0].font}]`).join(' ')
  );
}

const parts = buildDocxParts(pages);
const doc = parts['word/document.xml'];

const checks = {
  'real table emitted': doc.includes('<w:tbl>'),
  '3 grid columns': (doc.match(/<w:gridCol /g) || []).length === 3,
  'bold runs present': doc.includes('<w:b/>'),
  'title size 36 half-pts': doc.includes('w:val="36"'),
  'page break between pages': doc.includes('<w:br w:type="page"/>'),
  'table cell Widget Beta': /<w:tbl>[\s\S]*Widget Beta[\s\S]*<\/w:tbl>/.test(doc),
  'paragraphs not merged': doc.indexOf('additional words.') < doc.indexOf('A second paragraph'),
  'wrapped lines joined': doc.includes('wraps onto a second line'),
  'no lost text': doc.includes('Appendix content follows'),
};
let ok = true;
for (const [name, pass] of Object.entries(checks)) {
  console.log((pass ? 'PASS' : 'FAIL') + '  ' + name);
  if (!pass) ok = false;
}

const zip = new JSZip();
for (const [p, c] of Object.entries(parts)) zip.file(p, c);
const buf = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
fs.writeFileSync(here('out.docx'), buf);
console.log('wrote out.docx', buf.length, 'bytes');

console.log('--- document.xml (first 2600 chars) ---');
console.log(doc.slice(0, 2600));
process.exit(ok ? 0 : 1);
