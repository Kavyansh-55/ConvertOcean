/**
 * Builds `torture-compress.pdf` — the fixture for /compress-pdf/.
 *
 * Every other fixture on this site asks "did the content survive the
 * conversion". Compression asks a harder pair of questions at once:
 *
 *   1. did the file actually get smaller, and
 *   2. did anything get *worse than it had to*.
 *
 * A compressor can score well on (1) by rasterising every page to a JPEG,
 * which is what several popular tools effectively do. That destroys selectable
 * text, links, form fields and any image that was already the right size. So
 * this fixture is built mostly out of things a compressor must leave alone,
 * with a few things it must genuinely shrink. A tool that scores 100% here has
 * found the bytes without touching anything else.
 *
 * Page 1 — one 1800x1200 photographic JPEG drawn at 530x353pt. That is ~245
 *          effective DPI, so at a 150 DPI target it must be downsampled. This
 *          is the case that carries almost all the real-world saving: a phone
 *          photo or a scanner default dropped into a document.
 * Page 2 — three FlateDecode images that must be treated three different ways:
 *          a 1200x900 photographic one at 216 DPI (must shrink); a 1200x900
 *          flat-colour graphic also at 216 DPI, which deflates to a few KB and
 *          would get *bigger* as a downsampled JPEG (must not grow); and a
 *          100x75 image drawn at its natural 72 DPI (must not be touched at
 *          all). "Downsample everything above the target" fails two of these.
 * Page 3 — a FlateDecode RGB image with an /SMask alpha channel, over a solid
 *          magenta bar. Flatten the transparency and the bar disappears, which
 *          is the loudest possible signal for a subtle bug.
 * Page 4 — no images at all: four fonts, a link annotation and an AcroForm
 *          text field. This page exists purely so that a rasterising
 *          compressor fails loudly instead of passing.
 *
 * Markers M01-M12 are planted so a failure names the feature, not a diff.
 */
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';
import puppeteer from 'puppeteer-core';
import * as TESTING_PATHS from '../../testing-paths.mjs';
import { rgbBuffer, scanLikeShade, flatGraphicShade } from '../lib/test-images.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = TESTING_PATHS.FIXTURES;

const EDGE_CANDIDATES = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  process.env.CHROME_PATH,
].filter(Boolean);

function browserPath() {
  for (const p of EDGE_CANDIDATES) if (existsSync(p)) return p;
  throw new Error('No Edge/Chrome found. Set CHROME_PATH.');
}

/* ------------------------------------------------------------- utilities */

const NAVY = [31 / 255, 78 / 255, 121 / 255];

function pstr(s) {
  return s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function text(x, y, font, size, str, rgb) {
  const colour = rgb ? `${rgb[0]} ${rgb[1]} ${rgb[2]} rg\n` : '0 0 0 rg\n';
  return `BT\n${colour}/${font} ${size} Tf\n${x} ${y} Td\n(${pstr(str)}) Tj\nET\n`;
}

/** Place an image XObject at (x,y) drawn w x h points. */
function drawImage(name, x, y, w, h) {
  return `q\n${w} 0 0 ${h} ${x} ${y} cm\n/${name} Do\nQ\n`;
}

function rect(x, y, w, h, rgb) {
  return `${rgb[0]} ${rgb[1]} ${rgb[2]} rg\n${x} ${y} ${w} ${h} re\nf\n`;
}

/* --------------------------------------------- raw raster generators */

/**
 * A page of "scanned document": near-white ground, dark ruled lines and text
 * blocks, a faint grey wash and a little sensor noise.
 *
 * Deliberately not random noise. Pure noise does not compress, so a fixture
 * made of it would fail a size assertion for a reason that has nothing to do
 * with the compressor. Deliberately not a flat colour either, or the JPEG
 * would already be tiny and there would be nothing to find. This is what the
 * tool will actually meet.
 */
function scanLikeRgb(w, h) {
  return rgbBuffer(w, h, scanLikeShade(w, h));
}

/** Four solid quadrants with a white cross — instantly readable when wrong. */
function quadrantRgb(w, h) {
  return rgbBuffer(w, h, flatGraphicShade(w, h));
}

/** A centred filled disc as an 8-bit alpha channel: opaque inside, clear out. */
function discAlpha(w, h) {
  const px = Buffer.alloc(w * h);
  const cx = w / 2, cy = h / 2, rr = Math.min(w, h) * 0.42;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const d = Math.hypot(x - cx, y - cy);
      px[y * w + x] = d <= rr ? 255 : 0;
    }
  }
  return px;
}

/** 1-bit stencil rows — an /ImageMask, which must survive untouched. */
function stencilBits(w, h) {
  const rowBytes = Math.ceil(w / 8);
  const px = Buffer.alloc(rowBytes * h, 0xff);
  for (let y = 0; y < h; y++) {
    if (Math.floor(y / 4) % 2 === 0) continue;
    for (let x = 0; x < w; x++) {
      if (Math.floor(x / 4) % 2 === 0) continue;
      px[y * rowBytes + (x >> 3)] &= ~(0x80 >> (x & 7));
    }
  }
  return px;
}

/* --------------------------------------------------- JPEG, via the browser */

/* Same reasoning as build-images.mjs: let the browser encode the JPEG so the
   fixture is written by the same encoder family the tool will re-encode with.
   A mismatch between two JPEG writers would show up as a fidelity failure that
   belongs to neither the fixture nor the tool. */
const JPEG_W = 1800, JPEG_H = 1200;

const browser = await puppeteer.launch({
  executablePath: browserPath(),
  headless: 'new',
  args: ['--no-sandbox'],
});
const page = await browser.newPage();

const rawScan = scanLikeRgb(JPEG_W, JPEG_H);
const rgbaB64 = (() => {
  // Widen RGB to RGBA for putImageData.
  const rgba = Buffer.alloc(JPEG_W * JPEG_H * 4);
  for (let i = 0, j = 0; i < rawScan.length; i += 3, j += 4) {
    rgba[j] = rawScan[i]; rgba[j + 1] = rawScan[i + 1]; rgba[j + 2] = rawScan[i + 2]; rgba[j + 3] = 255;
  }
  return rgba.toString('base64');
})();

const encoded = await page.evaluate(async (w, h, b64) => {
  const bin = atob(b64);
  const u8 = new Uint8ClampedArray(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  ctx.putImageData(new ImageData(u8, w, h), 0, 0);

  // Marker drawn by the browser so it is real JPEG content, not a Node artifact.
  ctx.fillStyle = '#1f4e79';
  ctx.font = 'bold 96px sans-serif';
  ctx.fillText('M01', 60, 140);

  const blob = await new Promise((res) => c.toBlob(res, 'image/jpeg', 0.95));
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  }
  return { b64: btoa(s), type: blob.type, size: bytes.length };
}, JPEG_W, JPEG_H, rgbaB64);

await browser.close();

if (!encoded.type.includes('jpeg')) throw new Error('browser refused to encode the scan JPEG');
const scanJpeg = Buffer.from(encoded.b64, 'base64');
if (scanJpeg.length < 60_000) {
  throw new Error(`scan JPEG is only ${scanJpeg.length} bytes — too compressible to test a compressor`);
}

/* ------------------------------------------------------- object assembly */

const objects = [];   // Buffers, so binary streams stay binary
function obj(body) {
  objects.push(Buffer.isBuffer(body) ? body : Buffer.from(body, 'latin1'));
  return objects.length;
}

function textStream(content) {
  const bytes = Buffer.byteLength(content, 'latin1');
  return `<< /Length ${bytes} >>\nstream\n${content}endstream`;
}

/** An image XObject whose stream body is raw bytes. */
function imageObj(dict, data) {
  return Buffer.concat([
    Buffer.from(`<< ${dict} /Length ${data.length} >>\nstream\n`, 'latin1'),
    data,
    Buffer.from('\nendstream', 'latin1'),
  ]);
}

/* Fonts */
const fHelv = obj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
const fBold = obj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
const fTimes = obj('<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman /Encoding /WinAnsiEncoding >>');
const fCour = obj('<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>');

/* Images */
const imScan = obj(imageObj(
  `/Type /XObject /Subtype /Image /Width ${JPEG_W} /Height ${JPEG_H} ` +
  `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode`,
  scanJpeg,
));

/* Photographic Flate: noisy, so it deflates badly and genuinely benefits from
   being downsampled and re-encoded. This is a PNG-origin scan, a very common
   thing to find inside a bloated PDF. */
const FLAT_W = 1200, FLAT_H = 900;
const flatBig = deflateSync(scanLikeRgb(FLAT_W, FLAT_H), { level: 9 });
const imFlatBig = obj(imageObj(
  `/Type /XObject /Subtype /Image /Width ${FLAT_W} /Height ${FLAT_H} ` +
  `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode`,
  flatBig,
));

/* Flat-colour Flate at the same oversized DPI. Deflate already has this at a
   few KB; any lossy re-encode is both larger and visibly worse. A compressor
   that only checks DPI will "optimise" this into a regression. */
const imFlatGraphic = obj(imageObj(
  `/Type /XObject /Subtype /Image /Width ${FLAT_W} /Height ${FLAT_H} ` +
  `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode`,
  deflateSync(quadrantRgb(FLAT_W, FLAT_H), { level: 9 }),
));
const flatGraphicLen = objects[imFlatGraphic - 1].length;

const SMALL_W = 100, SMALL_H = 75;
const flatSmall = deflateSync(quadrantRgb(SMALL_W, SMALL_H), { level: 9 });
const imFlatSmall = obj(imageObj(
  `/Type /XObject /Subtype /Image /Width ${SMALL_W} /Height ${SMALL_H} ` +
  `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode`,
  flatSmall,
));

/* Transparent image: colour plane plus an 8-bit soft mask. */
const ALPHA_W = 600, ALPHA_H = 600;
const maskData = deflateSync(discAlpha(ALPHA_W, ALPHA_H), { level: 9 });
const imMask = obj(imageObj(
  `/Type /XObject /Subtype /Image /Width ${ALPHA_W} /Height ${ALPHA_H} ` +
  `/ColorSpace /DeviceGray /BitsPerComponent 8 /Filter /FlateDecode`,
  maskData,
));
const alphaColour = deflateSync(quadrantRgb(ALPHA_W, ALPHA_H), { level: 9 });
const imAlpha = obj(imageObj(
  `/Type /XObject /Subtype /Image /Width ${ALPHA_W} /Height ${ALPHA_H} ` +
  `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /SMask ${imMask} 0 R`,
  alphaColour,
));

/* 1-bit stencil. Already as small as it can be; re-encoding is pure loss. */
const STEN_W = 320, STEN_H = 320;
const stencil = deflateSync(stencilBits(STEN_W, STEN_H), { level: 9 });
const imStencil = obj(imageObj(
  `/Type /XObject /Subtype /Image /Width ${STEN_W} /Height ${STEN_H} ` +
  `/ImageMask true /BitsPerComponent 1 /Decode [0 1] /Filter /FlateDecode`,
  stencil,
));

/* ------------------------------------------------------------ page content */

/* Page 1: the scan, at 530x353pt => 1800 / (530/72) ~= 245 DPI. */
let p1 = text(41, 760, 'F2', 16, 'M02 Scanned invoice, 245 DPI', NAVY);
p1 += drawImage('ImScan', 41, 380, 530, 353);
p1 += text(41, 350, 'F1', 10, 'M03 This caption is real text and must stay selectable.');
p1 += text(41, 40, 'F1', 9, 'M04 Page 1 of 4', [0.4, 0.4, 0.4]);

/* Page 2: 1200x900 drawn at 400x300pt => 216 DPI, twice over — once
   photographic (shrink it) and once flat (leave it alone). Plus a 100x75 at
   its natural 72 DPI and a 1-bit stencil. */
let p2 = text(41, 760, 'F2', 16, 'M05 Four images, three answers', NAVY);
p2 += drawImage('ImFlatBig', 41, 420, 400, 300);
p2 += text(41, 405, 'F1', 10, 'M06 216 DPI photo - must be downsampled');
p2 += drawImage('ImFlatGraphic', 41, 90, 400, 300);
p2 += text(41, 72, 'F1', 10, 'M07 216 DPI flat graphic - must not get bigger');
p2 += drawImage('ImFlatSmall', 470, 620, 100, 75);
p2 += text(470, 605, 'F1', 8, 'M08 72 DPI');
p2 += drawImage('ImStencil', 470, 460, 100, 100);
p2 += text(470, 445, 'F1', 8, 'M09 1-bit mask');
p2 += text(41, 40, 'F1', 9, 'M10 Page 2 of 4', [0.4, 0.4, 0.4]);

/* Page 3: transparency over a magenta bar. If alpha is flattened, the bar
   vanishes behind an opaque square and the pixel probe says so. */
let p3 = text(72, 740, 'F2', 16, 'M11 Transparency', NAVY);
p3 += rect(72, 300, 400, 400, [0.85, 0.1, 0.6]);
p3 += drawImage('ImAlpha', 72, 300, 400, 400);
p3 += text(72, 40, 'F1', 9, 'M12 Page 3 of 4', [0.4, 0.4, 0.4]);

/* Page 4: no images. Everything here is what a rasteriser destroys. */
let p4 = text(72, 740, 'F2', 16, 'M13 Structure, no images', NAVY);
p4 += text(72, 700, 'F1', 12, 'Helvetica body text at twelve point.');
p4 += text(72, 676, 'F3', 12, 'Times Roman body text at twelve point.');
p4 += text(72, 652, 'F4', 12, 'Courier monospaced at twelve point.');
p4 += text(72, 628, 'F2', 12, 'Helvetica Bold at twelve point.');
p4 += text(72, 580, 'F1', 12, 'Link: convertocean.com', [0, 0, 0.8]);
p4 += text(72, 40, 'F1', 9, 'Page 4 of 4', [0.4, 0.4, 0.4]);

const res1 = `<< /Font << /F1 ${fHelv} 0 R /F2 ${fBold} 0 R >> /XObject << /ImScan ${imScan} 0 R >> >>`;
const res2 = `<< /Font << /F1 ${fHelv} 0 R /F2 ${fBold} 0 R >> ` +
  `/XObject << /ImFlatBig ${imFlatBig} 0 R /ImFlatGraphic ${imFlatGraphic} 0 R ` +
  `/ImFlatSmall ${imFlatSmall} 0 R /ImStencil ${imStencil} 0 R >> >>`;
const res3 = `<< /Font << /F1 ${fHelv} 0 R /F2 ${fBold} 0 R >> /XObject << /ImAlpha ${imAlpha} 0 R >> >>`;
const res4 = `<< /Font << /F1 ${fHelv} 0 R /F2 ${fBold} 0 R /F3 ${fTimes} 0 R /F4 ${fCour} 0 R >> >>`;

const c1 = obj(textStream(p1));
const c2 = obj(textStream(p2));
const c3 = obj(textStream(p3));
const c4 = obj(textStream(p4));

/* A link annotation and a form field, both on page 4. */
const linkAnnot = obj(
  '<< /Type /Annot /Subtype /Link /Rect [72 576 220 592] /Border [0 0 0] ' +
  '/A << /Type /Action /S /URI /URI (https://convertocean.com/compress-pdf/) >> >>'
);

/* Page numbers have to be known before the field can name its parent, and the
   field has to be known before the page can list its annots. Reserve both. */
const pagesNum = objects.length + 6;   // 4 page objects + the field + this node
const fieldNum = objects.length + 5;   // straight after the four pages

const page1 = obj(`<< /Type /Page /Parent ${pagesNum} 0 R /MediaBox [0 0 612 792] /Resources ${res1} /Contents ${c1} 0 R >>`);
const page2 = obj(`<< /Type /Page /Parent ${pagesNum} 0 R /MediaBox [0 0 612 792] /Resources ${res2} /Contents ${c2} 0 R >>`);
const page3 = obj(`<< /Type /Page /Parent ${pagesNum} 0 R /MediaBox [0 0 612 792] /Resources ${res3} /Contents ${c3} 0 R >>`);
const page4 = obj(
  `<< /Type /Page /Parent ${pagesNum} 0 R /MediaBox [0 0 612 792] /Resources ${res4} ` +
  `/Contents ${c4} 0 R /Annots [${linkAnnot} 0 R ${fieldNum} 0 R] >>`
);

const field = obj(
  `<< /Type /Annot /Subtype /Widget /FT /Tx /T (reference) /V (M14-FORM-VALUE) ` +
  `/Rect [72 500 300 524] /F 4 /DA (/Helv 11 Tf 0 g) /P ${page4} 0 R >>`
);
const pages = obj(`<< /Type /Pages /Kids [${page1} 0 R ${page2} 0 R ${page3} 0 R ${page4} 0 R] /Count 4 >>`);

if (pages !== pagesNum) throw new Error(`page-tree number drifted: expected ${pagesNum}, got ${pages}`);
if (field !== fieldNum) throw new Error(`form-field number drifted: expected ${fieldNum}, got ${field}`);

const acroForm = obj(`<< /Fields [${field} 0 R] /DA (/Helv 0 Tf 0 g) /DR << /Font << /Helv ${fHelv} 0 R >> >> >>`);
const catalog = obj(`<< /Type /Catalog /Pages ${pages} 0 R /AcroForm ${acroForm} 0 R >>`);

/* ------------------------------------------------------------ serialise */

const parts = [Buffer.from('%PDF-1.5\n%\xE2\xE3\xCF\xD3\n', 'latin1')];
let at = parts[0].length;
const offsets = [0];

objects.forEach((body, i) => {
  offsets.push(at);
  const head = Buffer.from(`${i + 1} 0 obj\n`, 'latin1');
  const tail = Buffer.from('\nendobj\n', 'latin1');
  parts.push(head, body, tail);
  at += head.length + body.length + tail.length;
});

const xrefAt = at;
let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
for (let i = 1; i <= objects.length; i++) {
  xref += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
}
xref += `trailer\n<< /Size ${objects.length + 1} /Root ${catalog} 0 R >>\nstartxref\n${xrefAt}\n%%EOF\n`;
parts.push(Buffer.from(xref, 'latin1'));

const buf = Buffer.concat(parts);
mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'torture-compress.pdf'), buf);

/* The fixture is only a compression test if there is something to compress.
   Assert that before anyone trusts a passing run. */
const imageBytes = scanJpeg.length + flatBig.length + alphaColour.length + maskData.length;
if (imageBytes / buf.length < 0.75) {
  throw new Error(`images are only ${Math.round(imageBytes / buf.length * 100)}% of the fixture — the size assertions would be measuring noise`);
}

console.log(
  `torture-compress.pdf   ${buf.length} bytes  4 pages, ${objects.length} objects\n` +
  `  ImScan      ${JPEG_W}x${JPEG_H} DCTDecode   ${scanJpeg.length} bytes  @245 DPI  (must shrink)\n` +
  `  ImFlatBig   ${FLAT_W}x${FLAT_H} FlateDecode  ${flatBig.length} bytes  @216 DPI  (must shrink)\n` +
  `  ImAlpha     ${ALPHA_W}x${ALPHA_H} Flate+SMask  ${alphaColour.length}+${maskData.length} bytes  (alpha must survive)\n` +
  `  ImFlatSmall ${SMALL_W}x${SMALL_H} FlateDecode   ${flatSmall.length} bytes  @72 DPI   (must be untouched)\n` +
  `  ImStencil   ${STEN_W}x${STEN_H} ImageMask    ${stencil.length} bytes  1-bit     (must be untouched)\n` +
  `  plus 4 fonts, a link annotation and an AcroForm text field on page 4`
);
