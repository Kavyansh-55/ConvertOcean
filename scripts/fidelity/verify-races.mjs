/**
 * Is the tool safe from a reader who is faster than it is?
 *
 * Three quick taps on an action button used to run the whole conversion three
 * times and hand back three files — measured on eight of the twelve tools
 * tested. A double-tap is how a phone user presses anything they are not sure
 * registered, so this was never an exotic case: it meant duplicate files in
 * Downloads and two or three copies of the same job competing for the tab's
 * memory, which on a phone is how a tab dies.
 *
 * Counting real downloads is unreliable for `blob:` URLs, so this hooks the
 * site's own `window.downloadBlob` and counts calls. One tap, one file.
 *
 *   node scripts/fidelity/verify-races.mjs
 *   CO_ORIGIN=https://convertocean.com node scripts/fidelity/verify-races.mjs
 */
import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

const ORIGIN = process.env.CO_ORIGIN || 'http://localhost:4321';
const LOCAL = ORIGIN.includes('localhost');
const FIX = join(process.cwd(), 'scripts', 'fidelity', 'fixtures', 'files');

const EDGE_CANDIDATES = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  process.env.CHROME_PATH,
].filter(Boolean);

function browserPath() {
  for (const p of EDGE_CANDIDATES) if (existsSync(p)) return p;
  throw new Error('No Edge/Chrome found. Set CHROME_PATH to a browser executable.');
}

/**
 * Tools whose action routes through `window.downloadBlob`, which is what this
 * can observe. The merge tools and a couple of others hand their result over
 * by another route and would report zero either way, so including them would
 * be a check that cannot fail — worse than no check.
 */
const CASES = [
  ['/excel-to-pdf/', 'torture.xlsx', '#btnConvert',  null],
  ['/word-to-pdf/',  'torture.docx', '#btnDownload', null],
  ['/pdf-to-txt/',   'torture.pdf',  '#btnDownload', null],
  ['/pdf-to-word/',  'torture.pdf',  '#btnDownload', null],
  ['/csv-to-json/',  'torture.csv',  '#btnDownload', null],
  ['/png-to-jpg/',   'torture.png',  '#btnDownload', null],
  ['/split-pdf/',    'torture.pdf',  '#btnExtract',  '#btnSelectAllPages'],
  ['/split-word/',   'torture.docx', '#btnSplit',    null],
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

const server = await ensureServer();
const browser = await puppeteer.launch({
  executablePath: browserPath(), headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

try {
  console.log(`\nraces: ${ORIGIN}\n`);
  console.log('  three rapid taps on the action button -> one file?\n');

  for (const [path, fixture, button, pre] of CASES) {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 80)));

    try {
      await page.goto(ORIGIN + path, { waitUntil: 'networkidle2', timeout: 45000 });
      await page.evaluate(() => {
        window.__downloads = 0;
        const real = window.downloadBlob;
        window.downloadBlob = function (...args) {
          window.__downloads++;
          return real && real.apply(this, args);
        };
      });
      await new Promise((r) => setTimeout(r, 500));

      const input = await page.$('input[type=file]');
      if (!input) { say(false, `${path} has no file input`); await page.close(); continue; }
      await input.uploadFile(join(FIX, fixture));
      await new Promise((r) => setTimeout(r, 2600));
      if (pre) { await page.click(pre).catch(() => {}); await new Promise((r) => setTimeout(r, 500)); }
      if (path === '/split-word/') {
        await page.select('#splitMode', 'paragraphs').catch(() => {});
        await new Promise((r) => setTimeout(r, 300));
      }

      await page.evaluate((s) => {
        const b = document.querySelector(s);
        b.click(); b.click(); b.click();
      }, button);
      await new Promise((r) => setTimeout(r, 9000));

      const n = await page.evaluate(() => window.__downloads);
      /* Zero is a failure too, not a pass: it means the guard swallowed the
         first tap as well, which is exactly the regression that broke four
         tools when the overlay check was too blunt. */
      say(n === 1, `${path.padEnd(17)} ${n} file(s) from 3 taps`
        + (errors.length ? '  THREW: ' + errors[0] : ''));
    } catch (e) {
      say(false, `${path} ${String(e).slice(0, 60)}`);
    }
    await page.close();
  }
} finally {
  await browser.close();
  if (server) server.kill();
}

console.log(bad ? `\n${bad} tool(s) mishandled rapid taps` : '\nevery tool produced exactly one file');
process.exit(bad ? 1 : 0);
