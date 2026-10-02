/**
 * Do the multi-file tools keep the order the reader chose?
 *
 * Every merge tool reads its files with FileReader and pushed each one onto
 * the list inside the onload callback — so the list was built in the order the
 * reads FINISHED, not the order the files were chosen. MergePdf even awaited a
 * full pdf-lib parse before pushing. Choose a large PDF then a small one and
 * the small one came out first in the merged file. Found 2026-09-27 while
 * correcting Portuguese copy that promised a drag-to-reorder control none of
 * these tools has; the order the files arrive in is the only order there is,
 * which made the race the whole story rather than an edge case.
 *
 * For a concurso applicant assembling RG, CPF and diploma in the sequence the
 * edital demands, "the small file jumped ahead" is a rejected application.
 *
 * Each case selects a LARGE file then a SMALL one in a single selection — the
 * shape that loses the race — and asserts the list shows them in that order.
 * The names sort the opposite way alphabetically (zz-first, aa-second), so a
 * pass cannot come from something quietly sorting by name.
 *
 *   node scripts/fidelity/verify-order.mjs
 *   CO_ORIGIN=https://convertocean.com node scripts/fidelity/verify-order.mjs
 */
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync, copyFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { deflateSync, crc32 } from 'node:zlib';
import { randomBytes } from 'node:crypto';
import * as TESTING_PATHS from '../testing-paths.mjs';
import { browserProfile } from '../testing-paths.mjs';

const ORIGIN = process.env.CO_ORIGIN || 'http://localhost:4321';
const FIX = TESTING_PATHS.FIXTURES;
const WORK = join(FIX, '..', 'out', 'order');
mkdirSync(WORK, { recursive: true });

const EDGE_CANDIDATES = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  process.env.CHROME_PATH,
].filter(Boolean);
const browserPath = () => {
  for (const p of EDGE_CANDIDATES) if (existsSync(p)) return p;
  throw new Error('No Edge/Chrome found. Set CHROME_PATH to a browser executable.');
};

/* A PNG of random noise, stored uncompressed, so it is genuinely large and
   genuinely slow to read. The fixtures directory has no big image. */
function noisePng(w, h) {
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td) >>> 0);
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 2; // 8-bit RGB
  const row = 1 + w * 3;
  const raw = randomBytes(row * h);
  for (let y = 0; y < h; y++) raw[y * row] = 0; // filter byte: none
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 0 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const bigPng = join(WORK, 'noise-big.png');
if (!existsSync(bigPng)) writeFileSync(bigPng, noisePng(1500, 1500));        // ~6.8 MB
const bigTxt = join(WORK, 'text-big.txt');
if (!existsSync(bigTxt)) writeFileSync(bigTxt, 'linha de teste 0123456789\n'.repeat(160000)); // ~4.2 MB

/* [page, large file (chosen first), small file (chosen second), extension] */
const CASES = [
  ['/merge-pdf/',    join(FIX, 'torture-compress.pdf'),  join(FIX, 'torture.pdf'),  'pdf'],
  ['/merge-word/',   join(FIX, 'torture-compress.docx'), join(FIX, 'torture.docx'), 'docx'],
  ['/merge-pptx/',   join(FIX, 'torture-compress.pptx'), join(FIX, 'torture.pptx'), 'pptx'],
  ['/merge-excel/',  join(FIX, 'torture-compress.xlsx'), join(FIX, 'torture.xlsx'), 'xlsx'],
  ['/merge-txt/',    bigTxt,                             join(FIX, 'torture.txt'),  'txt'],
  ['/image-to-pdf/', bigPng,                             join(FIX, 'torture.png'),  'png'],
  ['/merge-images/', bigPng,                             join(FIX, 'torture.png'),  'png'],
];

let bad = 0;
const say = (ok, msg) => { if (!ok) bad++; console.log(`${ok ? 'OK  ' : 'FAIL'}  ${msg}`); };

const browser = await puppeteer.launch({
  executablePath: browserPath(), headless: 'new',
  args: [TESTING_PATHS.NO_TRACKING, '--no-sandbox', '--disable-dev-shm-usage'],
  userDataDir: browserProfile('order'),
});

try {
  for (const [path, big, small, ext] of CASES) {
    const first = join(WORK, `zz-first-big.${ext}`);
    const second = join(WORK, `aa-second-small.${ext}`);
    copyFileSync(big, first);
    copyFileSync(small, second);

    const page = await browser.newPage();
    /* The profile persists between runs, and without this it served the
       PREVIOUS build's page from cache — the first run after the fix still
       failed, against code that was no longer there. */
    await page.setCacheEnabled(false);
    try {
      await page.goto(ORIGIN + path, { waitUntil: 'networkidle2', timeout: 60000 });
      const input = await page.$('input[type=file][multiple]');
      if (!input) { say(false, `${path} has no multi-file input`); continue; }
      await input.uploadFile(first, second);

      const listed = await page.waitForFunction(() => {
        const t = document.body.innerText;
        return t.includes('zz-first-big') && t.includes('aa-second-small');
      }, { timeout: 60000 }).then(() => true, () => false);
      if (!listed) { say(false, `${path} never listed both files`); continue; }

      const [a, b] = await page.evaluate(() => {
        const t = document.body.innerText;
        return [t.indexOf('zz-first-big'), t.indexOf('aa-second-small')];
      });
      say(a < b, `${path} keeps the chosen order: large file first, small file second`);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}

console.log(bad ? `\n${bad} check(s) failed` : '\nevery multi-file tool keeps the chosen order');
process.exit(bad ? 1 : 0);
