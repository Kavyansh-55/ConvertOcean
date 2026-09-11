/**
 * Does a tool actually refuse a file bigger than it promises to accept?
 *
 * Twenty-six drop zones printed "Max NN MB" and six checked. On the other
 * twenty the number was decoration: hand one a file several times that size
 * and it did not refuse, it tried — and because every conversion here runs in
 * the browser tab, trying means holding the whole file plus its decoded form
 * in tab memory. The tab slows, freezes, and the browser kills it. No message,
 * no explanation, and soonest on a phone.
 *
 * The static half of this is in `scripts/tests/file-limits.test.mjs`, which
 * asserts every component that displays a limit also enforces that same
 * number. This half proves the wiring is real: it feeds an actually-oversized
 * file to a running page and checks the tool says no, in words, without
 * hanging.
 *
 *   node scripts/fidelity/verify-limits.mjs
 *   CO_ORIGIN=https://convertocean.com node scripts/fidelity/verify-limits.mjs
 *
 * Fixtures are built on demand and deleted afterwards — 30MB files have no
 * business in the repo.
 */
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

const ORIGIN = process.env.CO_ORIGIN || 'http://localhost:4321';
const LOCAL = ORIGIN.includes('localhost');
const TMP = join(process.cwd(), 'scratch', 'oversized');
const MB = 1024 * 1024;

const EDGE_CANDIDATES = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  process.env.CHROME_PATH,
].filter(Boolean);

function browserPath() {
  for (const p of EDGE_CANDIDATES) if (existsSync(p)) return p;
  throw new Error('No Edge/Chrome found. Set CHROME_PATH to a browser executable.');
}

/** A file over every limit, with a plausible header so type checks pass. */
function buildFixture(name, header) {
  const buf = Buffer.alloc(30 * MB);
  if (header) Buffer.from(header).copy(buf, 0);
  const path = join(TMP, name);
  writeFileSync(path, buf);
  return path;
}

/* page, the input to feed, and a fixture that is over that tool's limit */
const CASES = [
  ['/word-to-pdf/',    'huge.docx', [0x50, 0x4b, 0x03, 0x04]],
  ['/pdf-to-txt/',     'huge.pdf',  '%PDF-1.4\n'],
  ['/split-pdf/',      'huge.pdf',  '%PDF-1.4\n'],
  ['/merge-pdf/',      'huge.pdf',  '%PDF-1.4\n'],
  ['/split-excel/',    'huge.xlsx', [0x50, 0x4b, 0x03, 0x04]],
  ['/merge-excel/',    'huge.xlsx', [0x50, 0x4b, 0x03, 0x04]],
  ['/txt-to-pdf/',     'huge.txt',  null],
  ['/split-txt/',      'huge.txt',  null],
  ['/merge-txt/',      'huge.txt',  null],
  ['/png-to-jpg/',     'huge.png',  [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  ['/split-image/',    'huge.png',  [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  ['/merge-images/',   'huge.png',  [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  ['/image-to-text/',  'huge.png',  [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  ['/csv-to-json/',    'huge.txt',  null],
  ['/pdf-to-word/',    'huge.pdf',  '%PDF-1.4\n'],
  ['/split-word/',     'huge.docx', [0x50, 0x4b, 0x03, 0x04]],
  ['/merge-word/',     'huge.docx', [0x50, 0x4b, 0x03, 0x04]],
  ['/split-pptx/',     'huge.pptx', [0x50, 0x4b, 0x03, 0x04]],
  ['/merge-pptx/',     'huge.pptx', [0x50, 0x4b, 0x03, 0x04]],
  ['/pptx-to-pdf/',    'huge.pptx', [0x50, 0x4b, 0x03, 0x04]],
];

let bad = 0;
const say = (ok, msg) => { if (!ok) bad++; console.log(`${ok ? 'OK  ' : 'FAIL'}  ${msg}`); };

async function ensureServer() {
  if (!LOCAL) return null;
  const server = spawn('npx', ['astro', 'preview', '--port', '4321'],
    { shell: true, stdio: 'ignore' });
  const deadline = Date.now() + 90000;
  while (Date.now() < deadline) {
    try {
      const r = await fetch(ORIGIN + '/', { signal: AbortSignal.timeout(3000) });
      if (r.ok) return server;
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 1000));
  }
  server.kill();
  throw new Error('preview server did not come up within 90s (run `npm run build` first)');
}

mkdirSync(TMP, { recursive: true });
const made = new Map();
for (const [, name, header] of CASES) {
  if (!made.has(name)) made.set(name, buildFixture(name, header));
}

const server = await ensureServer();
const browser = await puppeteer.launch({
  executablePath: browserPath(), headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

try {
  console.log(`\noversized files: ${ORIGIN}\n`);
  console.log('  a 30MB file into each tool — is it refused, in words?\n');

  for (const [path, fixture] of CASES) {
    const page = await browser.newPage();
    try {
      await page.goto(ORIGIN + path, { waitUntil: 'networkidle2', timeout: 45000 });
      await new Promise((r) => setTimeout(r, 600));

      const input = await page.$('input[type=file]');
      if (!input) { say(false, `${path} has no file input`); await page.close(); continue; }
      await input.uploadFile(made.get(fixture));

      /* A refusal should be immediate. Anything still thinking after this has
         started work it promised not to start. */
      await new Promise((r) => setTimeout(r, 3500));

      const state = await page.evaluate(() => {
        const vis = (el) => el && el.offsetParent !== null
          && getComputedStyle(el).visibility !== 'hidden';
        const candidates = [...document.querySelectorAll(
          '[id*="rror" i], [class*="error" i], [role="alert"]')];
        const shown = candidates.find(vis);
        return {
          message: shown ? shown.textContent.trim().slice(0, 160) : null,
          working: !!document.querySelector('[class*="progress" i]:not([hidden])')
                   && !!document.querySelector('[class*="progress" i]')?.offsetParent,
        };
      });

      const refused = !!state.message
        && /too large|limit|larger than|over this tool/i.test(state.message);
      say(refused, `${path.padEnd(18)} ${refused
        ? 'refused: "' + state.message.slice(0, 62) + '…"'
        : 'NOT refused' + (state.message ? ' (said: "' + state.message.slice(0, 60) + '")' : ' (silent)')}`);
    } catch (e) {
      say(false, `${path} ${String(e).slice(0, 70)}`);
    }
    await page.close();
  }
} finally {
  await browser.close();
  if (server) server.kill();
  rmSync(TMP, { recursive: true, force: true });
}

console.log(bad ? `\n${bad} tool(s) did not refuse an oversized file` : '\nevery tool refused an oversized file');
process.exit(bad ? 1 : 0);
