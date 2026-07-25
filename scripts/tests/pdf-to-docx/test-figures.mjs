// Figure pipeline check: detect figure regions on a real PDF and exercise the
// docx image packaging. Node can't rasterize (no browser canvas), so a small
// valid PNG stands in for each region — enough to verify region detection,
// text-label removal, inline-image XML, media parts, relationships and the
// Word-rejection lint. Pass a PDF that contains diagrams:
//
//   node scripts/tests/pdf-to-docx/test-figures.mjs path\to\diagrams.pdf
import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import JSZip from 'jszip';

const require = createRequire(import.meta.url);
if (!globalThis.DOMMatrix) globalThis.DOMMatrix = class DOMMatrix { constructor() { this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0; } };
if (!globalThis.Path2D) globalThis.Path2D = class Path2D {};
const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');
const { getDocument, OPS } = pdfjs;

const core = await import(new URL('../../../src/scripts/pdf-to-docx.js', import.meta.url).href);
const { collectPageLines, collectPageGraphics, detectFigureRegions, buildDocxParts } = core;

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) { c ^= buf[i]; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xEDB88320 & -(c & 1)); }
  return ~c >>> 0;
}
function chunk(type, data) {
  const t = Buffer.from(type, 'latin1');
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}
function makePng(w, h) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  const row = Buffer.concat([Buffer.from([0]), Buffer.concat(Array.from({ length: w }, () => Buffer.from([80, 120, 200])))]);
  const raw = Buffer.concat(Array.from({ length: h }, () => row));
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
const samplePng = new Uint8Array(makePng(8, 8));

const input = process.argv[2];
if (!input) { console.error('usage: node scripts/tests/pdf-to-docx/test-figures.mjs <diagrams.pdf>'); process.exit(2); }
const data = new Uint8Array(fs.readFileSync(input));
const standardFontDataUrl = pathToFileURL(path.resolve('node_modules/pdfjs-dist/standard_fonts/')).href + '/';
const pdf = await getDocument({ data, standardFontDataUrl }).promise;

const pages = [];
let totalRegions = 0;
for (let i = 1; i <= pdf.numPages; i++) {
  const page = await pdf.getPage(i);
  let opList = null; try { opList = await page.getOperatorList(); } catch (e) { /* ignore */ }
  const tc = await page.getTextContent();
  const fontNameOf = (id) => { try { const f = page.commonObjs.get(id); return (f && f.name) || ''; } catch (e) { return ''; } };
  const vp = page.getViewport({ scale: 1 });
  const lines = collectPageLines(tc, fontNameOf);
  const regions = detectFigureRegions(collectPageGraphics(opList, OPS), lines, vp.width, vp.height);
  for (const r of regions) r.png = samplePng;
  totalRegions += regions.length;
  pages.push({ lines, regions, width: vp.width, height: vp.height, pageNumber: i });
}

const parts = buildDocxParts(pages);
const doc = parts['word/document.xml'];

let dup = 0;
for (const m of doc.matchAll(/<[^>]+>/g)) {
  const attrs = [...m[0].matchAll(/([\w:]+)="/g)].map((a) => a[1]);
  const seen = new Set();
  for (const a of attrs) { if (seen.has(a)) { dup++; break; } seen.add(a); }
}
const mediaCount = Object.keys(parts).filter((p) => p.startsWith('word/media/')).length;
const drawings = (doc.match(/<w:drawing>/g) || []).length;
const imgRels = (parts['word/_rels/document.xml.rels'].match(/relationships\/image/g) || []).length;
const pngType = parts['[Content_Types].xml'].includes('Extension="png"');

const checks = {
  'found figure regions': totalRegions > 0,
  'a drawing per region': drawings === totalRegions,
  'a media file per region': mediaCount === totalRegions,
  'an image relationship per region': imgRels === totalRegions,
  'png content-type declared': pngType || totalRegions === 0,
  'no duplicate attributes': dup === 0,
};
let ok = true;
for (const [name, pass] of Object.entries(checks)) { console.log((pass ? 'PASS' : 'FAIL') + '  ' + name); if (!pass) ok = false; }
console.log(`regions=${totalRegions} drawings=${drawings} media=${mediaCount} tables=${(doc.match(/<w:tbl>/g) || []).length}`);

const zip = new JSZip();
for (const [p, c] of Object.entries(parts)) zip.file(p, c);
const buf = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
fs.writeFileSync(input.replace(/\.pdf$/i, '') + '-figures.docx', buf);
process.exit(ok ? 0 : 1);
