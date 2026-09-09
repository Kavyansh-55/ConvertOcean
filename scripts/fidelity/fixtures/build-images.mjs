/**
 * Builds the image fixtures: torture.png (RGBA), torture.jpg (with EXIF),
 * torture.webp and torture.svg.
 *
 * PNG and SVG are written directly. JPEG and WebP are encoded by the browser,
 * because that is also what encodes them in production — every image tool on
 * the site goes through canvas.toBlob. Using the same encoder means a failure
 * is the tool's, not a mismatch between two different JPEG writers.
 *
 * The browser step runs once and caches to disk; delete files/ to redo it.
 */
import puppeteer from 'puppeteer-core';
import { writeFileSync, mkdirSync, existsSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { markerPngAlpha } from '../lib/png.mjs';
import { withExif, hasExif } from '../lib/exif.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'files');
mkdirSync(OUT, { recursive: true });

const EDGE_CANDIDATES = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  process.env.CHROME_PATH,
].filter(Boolean);

/* ---------------------------------------------------------------- PNG */

/* 240x160, four quadrants, a transparent hole and an alpha ramp. */
const png = markerPngAlpha(240, 160);
writeFileSync(join(OUT, 'torture.png'), png);
console.log(`torture.png    ${png.length} bytes  RGBA with transparent quadrant`);

/* ---------------------------------------------------------------- SVG */

/* Vector features a rasteriser has to actually implement: a gradient, a
   stroke, text in a named family, a transform, and an explicit viewBox whose
   aspect ratio must be respected. */
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 160" width="240" height="160">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f766e"/>
      <stop offset="100%" stop-color="#be185d"/>
    </linearGradient>
  </defs>
  <rect width="240" height="160" fill="url(#g)"/>
  <circle cx="60" cy="60" r="34" fill="#fbbf24" stroke="#ffffff" stroke-width="4"/>
  <rect x="130" y="30" width="70" height="60" fill="#ffffff" opacity="0.85" transform="rotate(12 165 60)"/>
  <text x="120" y="135" font-family="Georgia, serif" font-size="20" fill="#ffffff" text-anchor="middle">M01 SVG</text>
</svg>
`;
writeFileSync(join(OUT, 'torture.svg'), svg, 'utf8');
console.log(`torture.svg    ${Buffer.byteLength(svg)} bytes  gradient, stroke, transform, text`);

/* -------------------------------------------------- JPEG + WebP (browser) */

function browserPath() {
  for (const p of EDGE_CANDIDATES) if (existsSync(p)) return p;
  throw new Error('No Edge/Chrome found. Set CHROME_PATH.');
}

const browser = await puppeteer.launch({
  executablePath: browserPath(),
  headless: 'new',
  args: ['--no-sandbox'],
});
const page = await browser.newPage();

/* Draw the same marker pattern, but opaque — JPEG has no alpha, and we want
   the JPEG fixture to differ from the PNG only in encoding, not in content. */
const encoded = await page.evaluate(async () => {
  const w = 240, h = 160;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  const quad = [['#dc2626', 0, 0], ['#16a34a', w / 2, 0], ['#2563eb', 0, h / 2], ['#eab308', w / 2, h / 2]];
  for (const [col, x, y] of quad) { ctx.fillStyle = col; ctx.fillRect(x, y, w / 2, h / 2); }
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(w / 2 - 6, 0, 12, h);
  ctx.fillRect(0, h / 2 - 6, w, 12);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('M01', 12, 30);

  const toB64 = (mime, q) => new Promise((res) => {
    c.toBlob(async (b) => {
      const u8 = new Uint8Array(await b.arrayBuffer());
      let s = '';
      for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
      res({ b64: btoa(s), type: b.type, size: u8.length });
    }, mime, q);
  });

  return {
    jpeg: await toB64('image/jpeg', 0.92),
    webp: await toB64('image/webp', 0.92),
  };
});

await browser.close();

if (!encoded.jpeg.type.includes('jpeg')) throw new Error('browser refused to encode JPEG');
if (!encoded.webp.type.includes('webp')) throw new Error('browser refused to encode WebP');

const plainJpeg = Buffer.from(encoded.jpeg.b64, 'base64');
const withMeta = withExif(plainJpeg);
if (!hasExif(withMeta)) throw new Error('EXIF segment did not survive its own writer');

writeFileSync(join(OUT, 'torture.jpg'), withMeta);
writeFileSync(join(OUT, 'torture.webp'), Buffer.from(encoded.webp.b64, 'base64'));

console.log(`torture.jpg    ${withMeta.length} bytes  (${plainJpeg.length} raw + EXIF: orientation, GPS, camera)`);
console.log(`torture.webp   ${encoded.webp.size} bytes`);

/* ------------------------------------------- HEIC / AVIF (copied samples)

   These two cannot be generated: the browser decodes them but will not encode
   them, and hand-writing an HEIF container is far more work than the coverage
   is worth. Real camera samples already live in scratch/, so copy them in when
   they are there and let the recipes mark themselves optional when they are
   not — a skipped test that says so beats a fake fixture. */
const SCRATCH = join(HERE, '..', '..', '..', 'scratch');
for (const [from, to] of [['test-sample.heic', 'sample.heic'], ['test-sample.avif', 'sample.avif']]) {
  const src = join(SCRATCH, from);
  if (existsSync(src)) {
    copyFileSync(src, join(OUT, to));
    console.log(`${to.padEnd(14)} copied from scratch/${from}`);
  } else {
    console.log(`${to.padEnd(14)} MISSING (scratch/${from}) — heic/avif recipes will skip`);
  }
}
