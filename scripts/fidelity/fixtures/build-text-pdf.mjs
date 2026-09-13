/**
 * Builds `text-with-logo.pdf` — the file from the bug report.
 *
 * Every other compressor fixture here is built to have bytes worth
 * recovering. This one is built to have almost none: 21 pages of prose, two
 * standard fonts, and a single small logo drawn at its natural size. It is the
 * course handout a reader brought to /compress-pdf/, and the shape that made
 * the tool look broken — three presets returning the same number, because
 * there is genuinely nothing for them to trade.
 *
 * The logo matters. With no image at all the page says "this PDF has no images
 * in it", which explains everything; with one small image that explanation
 * does not fire, and that is precisely the gap the reader fell into.
 */
import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const objs = [];
const add = (body) => { objs.push(body); return objs.length; };

const PAGES = 21;
const pstr = (s) => '(' + s.replace(/[()\\]/g, (c) => '\\' + c) + ')';

const fontR = add('<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>');
const fontB = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');

/* One small logo, exactly like the handout in the bug report: enough that the
   file is not "image-free", nowhere near enough to be worth re-encoding. */
import { deflateSync as dz } from 'node:zlib';
const LW = 120, LH = 40;
const px = Buffer.alloc(LW * LH * 3);
for (let y = 0; y < LH; y++) {
  for (let x = 0; x < LW; x++) {
    const i = (y * LW + x) * 3;
    const on = x < 50 && y > 6 && y < 34;
    px[i] = on ? 200 : 250; px[i + 1] = on ? 30 : 250; px[i + 2] = on ? 30 : 250;
  }
}
const logoStream = dz(px);
const logoId = add('<< /Type /XObject /Subtype /Image /Width ' + LW + ' /Height ' + LH
  + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /Length '
  + logoStream.length + ' >>' + String.fromCharCode(10) + 'stream' + String.fromCharCode(10)
  + logoStream.toString('latin1') + String.fromCharCode(10) + 'endstream');

const contentIds = [];
for (let p = 1; p <= PAGES; p++) {
  const lines = [];
  if (p === 1) lines.push('q 120 0 0 40 72 740 cm /Im1 Do Q');
  lines.push('BT /F2 18 Tf 72 720 Td ' + pstr('Finite State Machines - section ' + p) + ' Tj ET');
  for (let i = 0; i < 44; i++) {
    const y = 690 - i * 15;
    lines.push('BT /F1 10.5 Tf 72 ' + y + ' Td ' + pstr(
      'A deterministic finite automaton is a five-tuple consisting of a finite set of states, '
      + 'an input alphabet, a transition function, a start state and a set of accepting states. '
      + 'Paragraph ' + (p * 100 + i) + '.') + ' Tj ET');
  }
  const stream = deflateSync(Buffer.from(lines.join('\n'), 'latin1'));
  contentIds.push(add('<< /Length ' + stream.length + ' /Filter /FlateDecode >>\nstream\n'
    + stream.toString('latin1') + '\nendstream'));
}

const pageIds = [];
for (let p = 0; p < PAGES; p++) {
  pageIds.push(add('<< /Type /Page /Parent PARENT 0 R /MediaBox [0 0 612 792] '
    + '/Resources << /Font << /F1 ' + fontR + ' 0 R /F2 ' + fontB + ' 0 R >> '
    + '/XObject << /Im1 ' + logoId + ' 0 R >> >> '
    + '/Contents ' + contentIds[p] + ' 0 R >>'));
}
const pagesId = add('<< /Type /Pages /Count ' + PAGES + ' /Kids ['
  + pageIds.map((i) => i + ' 0 R').join(' ') + '] >>');
const catalogId = add('<< /Type /Catalog /Pages ' + pagesId + ' 0 R >>');

for (const i of pageIds) objs[i - 1] = objs[i - 1].replace('PARENT', String(pagesId));

let out = '%PDF-1.4\n';
const offsets = [0];
for (let i = 0; i < objs.length; i++) {
  offsets.push(out.length);
  out += (i + 1) + ' 0 obj\n' + objs[i] + '\nendobj\n';
}
const xref = out.length;
out += 'xref\n0 ' + (objs.length + 1) + '\n0000000000 65535 f \n';
for (let i = 1; i <= objs.length; i++) out += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
out += 'trailer\n<< /Size ' + (objs.length + 1) + ' /Root ' + catalogId
  + ' 0 R >>\nstartxref\n' + xref + '\n%%EOF';

const buf = Buffer.from(out, 'latin1');
writeFileSync('testing/fixtures/text-with-logo.pdf', buf);
console.log('text-with-logo.pdf', (buf.length / 1024).toFixed(1), 'KB,', PAGES, 'pages of text plus one small logo');
