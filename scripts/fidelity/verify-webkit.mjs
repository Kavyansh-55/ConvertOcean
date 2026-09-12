/**
 * Do the tools actually work in Safari's engine?
 *
 * Every other suite here drives Chromium, because that is all puppeteer-core
 * can drive. That left one whole browser engine untested on a site whose
 * entire product runs in the browser — and iPhone traffic is exactly the
 * high-RPM Western audience the roadmap is chasing.
 *
 * **What this is and is not.** Playwright's WebKit is the open-source engine
 * Safari is built on, running on a desktop. It catches real engine-level
 * differences that Chromium hides: CSS support, file-input behaviour, API
 * gaps, JS differences. It does **not** reproduce an iPhone — not iOS's
 * aggressive tab-memory limits, not its download handling, not real device
 * performance. Passing here means "not broken in WebKit", never "tested on
 * iOS". Say it that way.
 *
 *   node scripts/fidelity/verify-webkit.mjs
 *   CO_ORIGIN=https://convertocean.com node scripts/fidelity/verify-webkit.mjs
 */
import { webkit } from 'playwright';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import * as TESTING_PATHS from '../testing-paths.mjs';

const ORIGIN = process.env.CO_ORIGIN || 'http://localhost:4321';
const LOCAL = ORIGIN.includes('localhost');
const FIX = TESTING_PATHS.FIXTURES;

let bad = 0;
const say = (ok, msg) => { if (!ok) bad++; console.log(`${ok ? 'OK  ' : 'FAIL'}  ${msg}`); };

/* A conversion per family, so an engine gap in any of the big libraries shows
   up: SheetJS, the DOCX reader, pdf.js, jsPDF, canvas image work, JSZip. */
const CONVERSIONS = [
  ['/excel-to-pdf/', 'torture.xlsx', '#btnConvert',  'SheetJS + jsPDF'],
  ['/word-to-pdf/',  'torture.docx', '#btnDownload', 'DOCX reader + pdfmake'],
  ['/pdf-to-txt/',   'torture.pdf',  '#btnDownload', 'pdf.js'],
  ['/pdf-to-word/',  'torture.pdf',  '#btnDownload', 'pdf.js + JSZip'],
  ['/csv-to-json/',  'torture.csv',  '#btnDownload', 'own tabular core'],
  ['/png-to-jpg/',   'torture.png',  '#btnDownload', 'canvas'],
  ['/split-word/',   'torture.docx', '#btnSplit',    'JSZip package surgery'],
  ['/txt-to-pdf/',   'torture.txt',  '#btnDownload', 'jsPDF + Noto'],
];

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
const browser = await webkit.launch();

try {
  const version = browser.version();
  console.log(`\nwebkit ${version}: ${ORIGIN}\n`);
  console.log('  Safari\'s engine — does each tool actually convert?\n');

  for (const [path, fixture, button, why] of CONVERSIONS) {
    const context = await browser.newContext({ acceptDownloads: true });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 90)));

    try {
      await page.goto(ORIGIN + path, { waitUntil: 'networkidle', timeout: 60000 });

      /* Wait for a real download event rather than hooking `downloadBlob`.
         The first version of this file counted calls to that helper and
         reported `txt-to-pdf` as broken in WebKit — it was not, it simply
         handed its file over through jsPDF's own `save()` instead. Watching
         what the browser actually does cannot be fooled that way, and it is
         the engine-level truth this suite exists to measure. */
      const downloadPromise = page.waitForEvent('download', { timeout: 20000 })
        .catch(() => null);

      await page.setInputFiles('input[type=file]', join(FIX, fixture));
      await page.waitForTimeout(3000);

      if (path === '/split-word/') {
        await page.selectOption('#splitMode', 'paragraphs').catch(() => {});
        await page.waitForTimeout(400);
      }

      await page.click(button, { timeout: 15000 }).catch(() => {});

      const download = await downloadPromise;
      let bytes = 0;
      if (download) {
        const stream = await download.createReadStream().catch(() => null);
        if (stream) {
          for await (const chunk of stream) bytes += chunk.length;
        }
      }
      const produced = !!download && bytes > 0;
      say(produced,
        `${path.padEnd(17)} ${produced ? `${bytes} bytes as "${download.suggestedFilename()}"` : 'NO FILE'}`
        + `  (${why})`
        + (errors.length ? `  THREW: ${errors[0]}` : ''));
    } catch (e) {
      say(false, `${path.padEnd(17)} ${String(e).slice(0, 70)}  (${why})`);
    }
    await context.close();
  }

  /* --- the things WebKit is most likely to differ on --------------------- */
  console.log('\n  engine-level behaviour\n');
  {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(ORIGIN + '/excel-to-pdf/', { waitUntil: 'networkidle', timeout: 60000 });

    const support = await page.evaluate(() => ({
      /* Each of these is used by a tool somewhere, and each has been missing
         or late in Safari at some point. */
      downloadAttr: 'download' in document.createElement('a'),
      createObjectURL: typeof URL.createObjectURL === 'function',
      fileReader: typeof FileReader === 'function',
      blobArrayBuffer: typeof Blob.prototype.arrayBuffer === 'function',
      structuredClone: typeof structuredClone === 'function',
      canvasToBlob: typeof HTMLCanvasElement.prototype.toBlob === 'function',
      offscreenCanvas: typeof OffscreenCanvas !== 'undefined',
      webp: document.createElement('canvas').toDataURL('image/webp').startsWith('data:image/webp'),
      avifDecode: typeof createImageBitmap === 'function',
      clipboard: !!(navigator.clipboard && navigator.clipboard.writeText),
    }));

    /* These the tools genuinely depend on. */
    for (const key of ['downloadAttr', 'createObjectURL', 'fileReader',
                       'blobArrayBuffer', 'canvasToBlob']) {
      say(support[key], `WebKit supports ${key}`);
    }
    /* WebP encoding is the one with a real history of absence in Safari; the
       image tools offer it as an output format. */
    say(support.webp, `WebKit can encode WebP from canvas`
      + (support.webp ? '' : ' — /png-to-webp/ and /jpg-to-webp/ would produce PNG instead'));

    console.log(`  info  OffscreenCanvas ${support.offscreenCanvas}, structuredClone `
      + `${support.structuredClone}, clipboard ${support.clipboard}`);
    await context.close();
  }

  /* --- the library recovery has to work here too ------------------------- */
  {
    const context = await browser.newContext();
    const page = await context.newPage();
    let firstHost = null;
    await page.route('**/xlsx.full.min.js', (route) => {
      const host = new URL(route.request().url()).host;
      if (firstHost === null) firstHost = host;
      if (host === firstHost) return route.abort();
      return route.continue();
    });
    await page.goto(ORIGIN + '/excel-to-pdf/', { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForFunction(() => typeof window.XLSX !== 'undefined', { timeout: 20000 })
      .catch(() => {});
    const recovered = await page.evaluate(() => typeof window.XLSX !== 'undefined');
    say(recovered, `CDN recovery works in WebKit too (blocked ${firstHost || 'primary'})`);
    await context.close();
  }
} finally {
  await browser.close();
  if (server) server.kill();
}

console.log(bad
  ? `\n${bad} WebKit check(s) failed`
  : '\neverything works in WebKit — which is not the same as tested on iOS');
process.exit(bad ? 1 : 0);
