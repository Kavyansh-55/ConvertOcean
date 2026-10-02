/**
 * Do the PDF tools keep working when the connection drops after page load?
 *
 * Four FAQ answers and two page intros promised "keeps working offline once
 * the page has loaded". For every tool built on pdf.js it was false: pdf.js
 * fetches its worker script from the CDN on the first PDF, not with the
 * page. Measured 2026-09-29 — load /split-pdf/, go offline, drop a PDF, and
 * it failed with "Failed to parse PDF structure." /compress-pdf/ said "If it
 * is password-protected, remove the password first", blaming the file.
 *
 * src/scripts/pdf-worker.js now fetches the worker while the page loads. This
 * suite is the proof: a fresh profile each time (an HTTP cache warmed by an
 * earlier run would pass vacuously), the page loaded online until the network
 * is idle, then the network cut, then a real PDF dropped in.
 *
 * A control run with the preload disabled must FAIL, or this suite is not
 * measuring what it claims to:
 *
 *   node scripts/fidelity/verify-offline.mjs
 *   node scripts/fidelity/verify-offline.mjs --control   (expects failures)
 *   CO_ORIGIN=https://convertocean.com node scripts/fidelity/verify-offline.mjs
 */
import puppeteer from 'puppeteer-core';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import * as TESTING_PATHS from '../testing-paths.mjs';

const ORIGIN = process.env.CO_ORIGIN || 'http://localhost:4321';
const CONTROL = process.argv.includes('--control');
const PDF = join(TESTING_PATHS.FIXTURES, 'torture.pdf');

const EDGE_CANDIDATES = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  process.env.CHROME_PATH,
].filter(Boolean);
const browserPath = () => {
  for (const p of EDGE_CANDIDATES) if (existsSync(p)) return p;
  throw new Error('No Edge/Chrome found. Set CHROME_PATH to a browser executable.');
};

/* [page, selector that means the PDF was read] — English and Portuguese, since
   both locales render the same components. */
const CASES = [
  ['/split-pdf/',            '#splitWorkspace canvas'],
  ['/compress-pdf/',         '#cmpDownload:not([disabled])'],
  ['/pdf-to-txt/',           '#actionControls'],
  ['/pdf-to-word/',          '#actionControls'],
  ['/pdf-to-excel/',         '#actionControls'],
  ['/pt/dividir-pdf/',       '#splitWorkspace canvas'],
  ['/pt/comprimir-pdf/',     '#cmpDownload:not([disabled])'],
];

if (!existsSync(PDF)) throw new Error(`Missing ${PDF} — run npm run fidelity:fixtures first.`);

let bad = 0;
const say = (ok, msg) => { if (!ok) bad++; console.log(`${ok ? 'OK  ' : 'FAIL'}  ${msg}`); };

for (const [path, doneSel] of CASES) {
  const profile = mkdtempSync(join(tmpdir(), 'co-offline-'));
  const browser = await puppeteer.launch({
    executablePath: browserPath(), headless: 'new',
    args: [TESTING_PATHS.NO_TRACKING, '--no-sandbox', '--disable-dev-shm-usage'],
    userDataDir: profile,
  });
  try {
    const page = await browser.newPage();
    if (CONTROL) {
      // Refuse the preload's fetch, leaving pdf.js to fetch on first use.
      await page.setRequestInterception(true);
      page.on('request', (r) => {
        if (/pdf\.worker/.test(r.url()) && r.resourceType() === 'fetch') r.abort();
        else r.continue();
      });
    }
    /* 'load', not 'networkidle0': the ad and analytics scripts keep the
       network busy long enough to time out. What matters is that the page's
       own libraries are in and the worker preload has had its chance. */
    await page.goto(ORIGIN + path, { waitUntil: 'load', timeout: 60_000 });
    const preloaded = await page.waitForFunction(() =>
      String(window.pdfjsLib && window.pdfjsLib.GlobalWorkerOptions.workerSrc).startsWith('blob:'),
      { timeout: CONTROL ? 5_000 : 30_000 }).then(() => true, () => false);

    await page.setOfflineMode(true);
    await (await page.$('input[type="file"]')).uploadFile(PDF);

    let read = true;
    try { await page.waitForSelector(doneSel, { visible: true, timeout: CONTROL ? 15_000 : 30_000 }); }
    catch { read = false; }
    const error = await page.evaluate(() => {
      const b = document.getElementById('errorBanner');
      return b && b.offsetParent ? b.textContent.trim().slice(0, 100) : '';
    });
    say(read && !error, `${path} opens a PDF offline after load` +
      (preloaded ? '' : ' [worker NOT preloaded]') + (error ? ` — "${error}"` : read ? '' : ' — never finished'));
  } finally {
    await browser.close();
    try { rmSync(profile, { recursive: true, force: true }); } catch { /* Windows EBUSY; temp dir */ }
  }
}

if (CONTROL) {
  console.log(bad === CASES.length
    ? `\nControl OK: all ${CASES.length} failed without the preload, so the suite measures it.`
    : `\nCONTROL BROKEN: only ${bad}/${CASES.length} failed without the preload.`);
  process.exit(bad === CASES.length ? 0 : 1);
}
console.log(bad ? `\n${bad} failed` : `\nAll ${CASES.length} PDF tools open a PDF offline after load.`);
process.exit(bad ? 1 : 0);
