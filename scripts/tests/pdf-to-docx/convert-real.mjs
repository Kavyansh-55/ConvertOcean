// Convert an arbitrary real PDF with the site's exact module + pdf.js 3.4.120,
// then lint the produced XML for the things Word hard-rejects:
// duplicate attributes, invalid chars, and out-of-order pPr/tblPr children.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import JSZip from 'jszip';

const require = createRequire(import.meta.url);
if (!globalThis.DOMMatrix) globalThis.DOMMatrix = class DOMMatrix { constructor() { this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0; } };
if (!globalThis.Path2D) globalThis.Path2D = class Path2D {};
const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');
const { getDocument } = pdfjs;

const core = await import(new URL('../../../src/scripts/pdf-to-docx.js', import.meta.url).href);
const { collectPageLines, buildDocxParts } = core;

const input = process.argv[2];
if (!input) {
  console.error('usage: node scripts/tests/pdf-to-docx/convert-real.mjs <file.pdf>');
  process.exit(2);
}
const data = new Uint8Array(fs.readFileSync(input));
const standardFontDataUrl =
  pathToFileURL(path.resolve('node_modules/pdfjs-dist/standard_fonts/')).href + '/';

const pdf = await getDocument({ data, standardFontDataUrl }).promise;
console.log('pages:', pdf.numPages);

const pages = [];
for (let i = 1; i <= pdf.numPages; i++) {
  const page = await pdf.getPage(i);
  try { await page.getOperatorList(); } catch (e) { /* ignore */ }
  const textContent = await page.getTextContent();
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

const parts = buildDocxParts(pages);
const doc = parts['word/document.xml'];
fs.writeFileSync(input.replace(/\.pdf$/i, '') + '-document.xml', doc);

// --- lint 1: duplicate attributes inside a single tag
let dupCount = 0;
for (const m of doc.matchAll(/<[^>]+>/g)) {
  const tag = m[0];
  const attrs = [...tag.matchAll(/([\w:]+)="/g)].map((a) => a[1]);
  const seen = new Set();
  for (const a of attrs) {
    if (seen.has(a)) {
      if (dupCount < 5) console.log('DUPLICATE ATTR', a, 'in', tag.slice(0, 160));
      dupCount++;
      break;
    }
    seen.add(a);
  }
}
console.log('tags with duplicate attributes:', dupCount);

// --- lint 2: invalid XML chars
const bad = doc.match(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g);
const loneHi = doc.match(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/g);
const loneLo = doc.match(/(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g);
console.log('invalid control chars:', bad ? bad.length : 0,
  '| unpaired surrogates:', (loneHi ? loneHi.length : 0) + (loneLo ? loneLo.length : 0));

// --- lint 3: child order inside pPr / rPr / tblPr must follow the schema
function checkOrder(re, orderList, label) {
  let bad = 0;
  for (const m of doc.matchAll(re)) {
    const children = [...m[1].matchAll(/<w:(\w+)[ />]/g)].map((c) => c[1]);
    const idx = children.map((c) => orderList.indexOf(c)).filter((i) => i >= 0);
    for (let i = 1; i < idx.length; i++) {
      if (idx[i] < idx[i - 1]) {
        if (bad < 3) console.log('ORDER VIOLATION in', label, '->', children.join(','));
        bad++;
        break;
      }
    }
  }
  console.log(label, 'order violations:', bad);
}
checkOrder(/<w:pPr>([\s\S]*?)<\/w:pPr>/g,
  ['pStyle','keepNext','keepLines','pageBreakBefore','numPr','pBdr','shd','tabs','spacing','ind','jc','outlineLvl','rPr'], 'pPr');
checkOrder(/<w:tblPr>([\s\S]*?)<\/w:tblPr>/g,
  ['tblStyle','tblpPr','tblOverlap','bidiVisual','tblW','jc','tblCellSpacing','tblInd','tblBorders','shd','tblLayout','tblCellMar','tblLook'], 'tblPr');
checkOrder(/<w:rPr>([\s\S]*?)<\/w:rPr>/g,
  ['rStyle','rFonts','b','bCs','i','iCs','caps','smallCaps','strike','color','spacing','sz','szCs','u','vertAlign'], 'rPr');

const zip = new JSZip();
for (const [p, c] of Object.entries(parts)) zip.file(p, c);
const buf = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
const out = input.replace(/\.pdf$/i, '') + '-converted.docx';
fs.writeFileSync(out, buf);
console.log('wrote', out, buf.length, 'bytes');
