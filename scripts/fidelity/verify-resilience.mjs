/**
 * Does a tool page still work when its CDN does not?
 *
 * The fidelity harness answers "is the output faithful to the input", and it
 * answers that on a fast local server where every CDN responds. That is a real
 * question but a narrow one, and a whole class of failure lives outside it: a
 * library that never arrives. A reader reported `.xlsx` being refused while
 * `.csv` converted, which looked like a bad file and was in fact `XLSX` being
 * `undefined` — the CSV path needs no library, so only half the tool broke.
 * Nothing in 290 passing checks could have seen that.
 *
 * So this asks the other question. For each tool: block the host its library
 * normally comes from, load the page, and see whether the page repairs itself
 * from the fallback CDN. Then confirm that a healthy page is left completely
 * alone, because a repair that fires when nothing is wrong is its own bug.
 *
 *   node scripts/fidelity/verify-resilience.mjs             (against a local preview)
 *   CO_ORIGIN=https://convertocean.com node scripts/fidelity/verify-resilience.mjs
 */
import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';

const ORIGIN = process.env.CO_ORIGIN || 'http://localhost:4321';
const LOCAL = ORIGIN.includes('localhost');

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
 * One row per library actually in use, on a page that uses it.
 *
 * Every library in LIB_SOURCES should appear here; the last check in this file
 * enforces that, so adding a library to a tool without covering it fails the
 * run rather than passing quietly.
 */
const CASES = [
  ['/merge-pdf/',      'PDFLib',         'pdf-lib.min.js'],
  ['/split-pdf/',      'PDFLib',         'pdf-lib.min.js'],
  ['/word-to-pdf/',    'pdfMake',        'pdfmake.min.js'],
  ['/word-to-pdf/',    'pdfMakeFonts',   'vfs_fonts.js'],
  ['/pdf-to-txt/',     'pdfjsLib',       'pdf.min.js'],
  ['/pdf-to-word/',    'pdfjsLib',       'pdf.min.js'],
  ['/image-to-pdf/',   'jspdf',          'jspdf.umd.min.js'],
  ['/excel-to-pdf/',   'jspdfAutoTable', 'jspdf.plugin.autotable.min.js'],
  ['/excel-to-pdf/',   'XLSX',           'xlsx.full.min.js'],
  ['/merge-excel/',    'XLSX',           'xlsx.full.min.js'],
  ['/merge-word/',     'JSZip',          'jszip.min.js'],
  ['/image-to-text/',  'Tesseract',      'tesseract.min.js'],
  ['/invoice-generator/', 'html2pdf',    'html2pdf.bundle.min.js'],
];

/** Pages that must be completely undisturbed when everything loads normally. */
const HEALTHY = ['/excel-to-pdf/', '/merge-pdf/', '/word-to-pdf/', '/pdf-to-txt/', '/merge-word/'];

let bad = 0;
const say = (ok, msg) => { if (!ok) bad++; console.log(`${ok ? 'OK  ' : 'FAIL'}  ${msg}`); };

async function ensureServer() {
  if (!LOCAL) return null;
  const server = spawn('npx', ['astro', 'preview', '--port', '4321'], {
    shell: true, stdio: 'ignore', detached: false,
  });
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
  console.log(`\nresilience: ${ORIGIN}\n`);
  console.log('  library missing -> does the page repair itself?\n');

  for (const [path, globalName, blockFile] of CASES) {
    const page = await browser.newPage();
    await page.setCacheEnabled(false);
    await page.setRequestInterception(true);

    /* Block only the host the component names, leaving the fallback reachable
       — the point is to prove the fallback works, not that the page survives
       having no network at all. */
    let firstHost = null;
    page.on('request', (r) => {
      const u = r.url();
      if (u.endsWith(blockFile)) {
        const host = u.split('/')[2];
        if (firstHost === null) firstHost = host;
        if (host === firstHost) { r.abort('failed'); return; }
      }
      r.continue();
    });

    try {
      await page.goto(ORIGIN + path, { waitUntil: 'networkidle2', timeout: 45000 });
      await page.waitForFunction(
        (g) => {
          if (g === 'jspdfAutoTable') {
            return !!(window.jspdf && window.jspdf.jsPDF
                   && window.jspdf.jsPDF.API && window.jspdf.jsPDF.API.autoTable);
          }
          if (g === 'pdfMakeFonts') return !!(window.pdfMake && window.pdfMake.vfs);
          return typeof window[g] !== 'undefined';
        },
        { timeout: 20000 }, globalName,
      ).catch(() => {});

      const present = await page.evaluate((g) => {
        if (g === 'jspdfAutoTable') {
          return !!(window.jspdf && window.jspdf.jsPDF
                 && window.jspdf.jsPDF.API && window.jspdf.jsPDF.API.autoTable);
        }
        if (g === 'pdfMakeFonts') return !!(window.pdfMake && window.pdfMake.vfs);
        return typeof window[g] !== 'undefined';
      }, globalName);

      say(present, `${path} recovers ${globalName} with ${firstHost || 'its CDN'} blocked`);
    } catch (e) {
      say(false, `${path} ${globalName}: ${String(e).slice(0, 90)}`);
    }
    await page.close();
  }

  console.log('\n  nothing wrong -> is the page left alone?\n');
  for (const path of HEALTHY) {
    const page = await browser.newPage();
    try {
      await page.goto(ORIGIN + path, { waitUntil: 'networkidle2', timeout: 45000 });
      await new Promise((r) => setTimeout(r, 1200));
      /* Only controls the bootstrap itself disabled count. A merge tool's
         "Merge & Download" starts disabled until files are queued, and an
         earlier version of this check called that a failure. */
      const state = await page.evaluate(() => ({
        notice: !!document.querySelector('[data-lib-recovery]'),
        held: document.querySelectorAll('[data-lib-held]').length,
      }));
      say(!state.notice && state.held === 0,
          `${path} shows no recovery notice and holds no control`
          + (state.held ? ` (held ${state.held})` : ''));
    } catch (e) {
      say(false, `${path}: ${String(e).slice(0, 90)}`);
    }
    await page.close();
  }

  /* A library added to a component but not listed above would never be tested
     here, and the gap would be silent — which is the shape of the bug that
     started all this. */
  const { LIB_SOURCES } = await import('../../src/scripts/ensure-lib.js');
  const covered = new Set(CASES.map((c) => c[1]));
  const uncovered = Object.keys(LIB_SOURCES).filter((k) => !covered.has(k));
  say(uncovered.length === 0,
      uncovered.length ? `every library is covered — missing: ${uncovered.join(', ')}`
                       : `every library in LIB_SOURCES is covered (${covered.size})`);
} finally {
  await browser.close();
  if (server) server.kill();
}

console.log(bad ? `\n${bad} check(s) failed` : '\nall resilience checks passed');
process.exit(bad ? 1 : 0);
