/**
 * The fidelity harness.
 *
 * Drives the real tool pages in a real browser with a real file, captures the
 * bytes the user would have downloaded, and checks them against what the
 * source actually contained.
 *
 * Output capture works by patching two browser built-ins — URL.createObjectURL
 * and HTMLAnchorElement.prototype.click — rather than the site's own helpers.
 * Every tool here reaches the user the same way in the end (window.downloadBlob,
 * jsPDF's save(), html2pdf, or a hand-rolled anchor all create a blob URL and
 * click a download link), so one hook covers all of them and keeps working when
 * a tool changes how it saves.
 *
 *   node scripts/fidelity/run.mjs            # all recipes
 *   node scripts/fidelity/run.mjs word-to-pdf excel-to-pdf
 *   node scripts/fidelity/run.mjs --headful  # watch it happen
 */
import puppeteer from 'puppeteer-core';
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { recipes, uncovered, partiallyCovered } from './recipes/index.mjs';
import * as inspect from './lib/inspect.mjs';
// The site's own EXIF reader, so metadata assertions agree with the tool.
import * as exifParse from '../../src/scripts/exif-parse.js';
import * as TESTING_PATHS from '../testing-paths.mjs';
import { browserProfile } from '../testing-paths.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const { FIXTURES, OUT } = TESTING_PATHS;
const ORIGIN = process.env.CO_ORIGIN || 'http://localhost:4321';

const EDGE_CANDIDATES = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  process.env.CHROME_PATH,
].filter(Boolean);

const argv = process.argv.slice(2);
const HEADFUL = argv.includes('--headful');
const only = argv.filter((a) => !a.startsWith('--'));

/* ------------------------------------------------------------- plumbing */

function browserPath() {
  for (const p of EDGE_CANDIDATES) if (existsSync(p)) return p;
  throw new Error('No Edge/Chrome found. Set CHROME_PATH to a browser executable.');
}

async function serverUp() {
  try {
    const r = await fetch(ORIGIN + '/', { signal: AbortSignal.timeout(2500) });
    return r.ok;
  } catch { return false; }
}

/** Start `astro dev` if nothing is listening, and return a stop function. */
async function ensureServer() {
  if (await serverUp()) return { started: false, stop: () => {} };

  console.log(`  starting dev server at ${ORIGIN} …`);
  const child = spawn('npm', ['run', 'dev'], {
    cwd: join(HERE, '..', '..'),
    shell: true,
    stdio: 'ignore',
    detached: false,
  });
  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 1000));
    if (await serverUp()) return { started: true, stop: () => child.kill() };
  }
  child.kill();
  throw new Error('dev server did not come up within 90s');
}

/**
 * Installed before any page script runs. Keeps a blob-url → Blob map, then
 * intercepts clicks on download anchors, recording the blob instead of letting
 * the browser save it. Also records console errors and flags the raster
 * fallback, which is supposed to be a last resort and should never fire on a
 * healthy conversion.
 */
function captureShim() {
  window.__co = { captured: [], urls: new Map(), errors: [], fallback: false };

  const origCreate = URL.createObjectURL.bind(URL);
  URL.createObjectURL = function (obj) {
    const url = origCreate(obj);
    try { if (obj instanceof Blob) window.__co.urls.set(url, obj); } catch { /* not a blob */ }
    return url;
  };

  /* Record a download anchor and swallow the activation. Returns true when
     this was a download we handled. */
  function capture(el) {
    if (!(el instanceof HTMLAnchorElement) || !el.hasAttribute('download')) return false;
    const blob = window.__co.urls.get(el.href);
    if (blob) {
      window.__co.captured.push({ name: el.getAttribute('download') || 'download', blob });
    } else {
      window.__co.errors.push('download anchor with an href we did not see: ' + String(el.href).slice(0, 80));
    }
    return true;
  }

  const origClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (capture(this)) return;
    return origClick.apply(this, arguments);
  };

  /* jsPDF's save() does not call .click() — it builds a MouseEvent and
     dispatches it, which walks straight past the prototype patch above. Every
     canvas-based exporter on the site (pptx-to-pdf, image-to-pdf, the
     generators) reaches the user through that path, so the harness has to
     intercept dispatch as well or those tools look like they produce nothing. */
  const origDispatch = EventTarget.prototype.dispatchEvent;
  EventTarget.prototype.dispatchEvent = function (ev) {
    if (ev && ev.type === 'click' && capture(this)) return true;
    return origDispatch.apply(this, arguments);
  };

  // The silent raster fallback is a quality signal in its own right.
  let fallbackFn;
  Object.defineProperty(window, 'exportElementToPdf', {
    configurable: true,
    get() { return fallbackFn; },
    set(fn) {
      fallbackFn = function (...args) {
        window.__co.fallback = true;
        return fn.apply(this, args);
      };
    },
  });
}

/** Pull captured blobs out of the page as base64. */
async function drainCaptures(page) {
  return page.evaluate(async () => {
    const out = [];
    for (const c of window.__co.captured) {
      const u8 = new Uint8Array(await c.blob.arrayBuffer());
      let bin = '';
      const CH = 0x8000;
      for (let i = 0; i < u8.length; i += CH) {
        bin += String.fromCharCode.apply(null, u8.subarray(i, i + CH));
      }
      out.push({ name: c.name, size: u8.length, b64: btoa(bin) });
    }
    return { files: out, errors: window.__co.errors, fallback: window.__co.fallback };
  });
}

/* ------------------------------------------------------------- one tool */

async function runRecipe(browser, recipe) {
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push('console: ' + m.text()); });

  await page.evaluateOnNewDocument(captureShim);
  await page.setViewport({ width: 1440, height: 1000 });

  const started = Date.now();
  const url = `${ORIGIN}/${recipe.slug}/`;
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60_000 });

  if (recipe.typeInto) {
    /* Text-input tools (the JSON formatter, the word counter) have no file
       input at all — the fixture is typed in. Set the value and fire the
       events the tool listens for; typing 4kB character by character would
       take minutes for no extra signal. */
    const content = readFileSync(join(FIXTURES, recipe.typeInto.fixture), 'utf8');
    await page.waitForSelector(recipe.typeInto.selector, { timeout: 30_000 });
    await page.evaluate((sel, text) => {
      const el = document.querySelector(sel);
      el.value = text;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, recipe.typeInto.selector, content);
  } else {
    /* Merge tools need several files at once; uploadFile takes a list. */
    const names = Array.isArray(recipe.fixture) ? recipe.fixture : [recipe.fixture];
    const paths = names.map((n) => join(FIXTURES, n));
    const input = await page.$('input[type=file]');
    if (!input) throw new Error('no file input on ' + url);
    await input.uploadFile(...paths);
  }

  // Wait for the tool to finish ingesting.
  await page.waitForSelector(recipe.ready, { visible: true, timeout: 60_000 });
  const ingestMs = Date.now() - started;

  /* Some tools have nothing to download — the answer is on the page. */
  if (recipe.kind === 'dom') {
    const values = await page.evaluate((map) => {
      /* Read like innerText, not like textContent.
         textContent concatenates a table with no separators at all, so
         `<td>ISO</td><td>400</td>` arrives as "ISO400" — a check for a
         standalone "400" then fails against a page that displays it
         perfectly, because there is no word boundary between "O" and "4".
         innerText would separate them, but it returns "" for anything not
         rendered, and this table is deliberately collapsed behind a "show
         all tags" toggle. So walk the tree and break at block and cell
         boundaries, ignoring visibility: what the markup says, spaced the
         way a reader sees it. */
      const BREAKS = new Set([
        'TR', 'TD', 'TH', 'LI', 'P', 'DIV', 'BR', 'SECTION', 'ARTICLE',
        'HEADER', 'FOOTER', 'TABLE', 'THEAD', 'TBODY', 'DT', 'DD', 'OPTION',
        'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'PRE', 'BLOCKQUOTE',
      ]);
      const textOf = (root) => {
        let s = '';
        const walk = (n) => {
          if (n.nodeType === 3) { s += n.nodeValue; return; }
          if (n.nodeType !== 1) return;
          const breaks = BREAKS.has(n.tagName);
          if (breaks && s && !/\n$/.test(s)) s += '\n';
          for (const c of n.childNodes) walk(c);
          if (breaks && s && !/\n$/.test(s)) s += '\n';
        };
        walk(root);
        return s.replace(/[ \t]+/g, ' ').replace(/ ?\n ?/g, '\n')
                .replace(/\n{2,}/g, '\n').trim();
      };
      const out = {};
      for (const [key, sel] of Object.entries(map)) {
        const el = document.querySelector(sel);
        out[key] = el ? textOf(el) : null;
      }
      return out;
    }, recipe.readFrom);
    await page.close();
    return {
      dom: values, bytes: null, downloadName: null, size: 0,
      ingestMs, exportMs: 0, fallback: false,
      errors: consoleErrors,
    };
  }

  /* Some tools need a step between ingesting and exporting: pages selected,
     a mode chosen, a Format or Apply button pressed. */
  for (const step of recipe.pre || []) {
    if (typeof step === 'string') {
      await page.waitForSelector(step, { visible: true, timeout: 30_000 });
      await page.click(step);
    } else if (step.select) {
      // { select, value } — choose a non-default mode before exporting.
      await page.waitForSelector(step.select, { timeout: 30_000 });
      await page.select(step.select, step.value);
    } else if (step.setValue) {
      // { setValue, value } — type into a number/text field, firing the events
      // the tool listens for.
      await page.waitForSelector(step.setValue, { timeout: 30_000 });
      await page.evaluate((sel, v) => {
        const el = document.querySelector(sel);
        el.value = v;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }, step.setValue, step.value);
    }
  }

  // Trigger the download.
  const dlStart = Date.now();
  await page.click(recipe.download);
  try {
    await page.waitForFunction(() => window.__co.captured.length > 0, { timeout: 60_000 });
  } catch {
    /* A bare "timed out" tells us nothing about why. The tools all render
       their own message into #errorMessage, and a stuck progress label says
       how far it got — both are far more useful than the timeout itself. */
    const state = await page.evaluate(() => {
      const err = document.getElementById('errorMessage');
      const banner = document.getElementById('errorBanner');
      const label = document.getElementById('progressLabel');
      const overlay = document.getElementById('progressOverlay');
      const visible = (el) => el && getComputedStyle(el).display !== 'none';
      return {
        error: visible(banner) && err ? err.textContent.trim() : null,
        progress: visible(overlay) && label ? label.textContent.trim() : null,
      };
    }).catch(() => ({}));
    await page.close();
    if (state.error) throw new Error(`tool reported: "${state.error}"`);
    if (state.progress) throw new Error(`stuck at "${state.progress}" — no file after 60s`);
    throw new Error('clicked download, but no file was produced (no error shown either)');
  }
  const exportMs = Date.now() - dlStart;

  /* Some recipes need to assert on what the page *told the user*, not just on
     the bytes — a tool that cannot render a script should say so rather than
     writing silent corruption, and that promise is only testable by reading
     the message it displayed. */
  let alsoRead = null;
  if (recipe.alsoRead) {
    alsoRead = await page.evaluate((map) => {
      const out = {};
      for (const [key, sel] of Object.entries(map)) {
        const el = document.querySelector(sel);
        const shown = el && getComputedStyle(el).display !== 'none' &&
                      getComputedStyle(el).visibility !== 'hidden';
        out[key] = shown ? el.textContent.trim() : '';
      }
      return out;
    }, recipe.alsoRead).catch(() => null);
  }

  const drained = await drainCaptures(page);
  await page.close();

  if (!drained.files.length) throw new Error('no file captured');

  const file = drained.files[0];
  const bytes = Buffer.from(file.b64, 'base64');
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, recipe.outName), bytes);

  return {
    bytes,
    downloadName: file.name,
    size: file.size,
    extraFiles: drained.files.length - 1,
    alsoRead,
    ingestMs,
    exportMs,
    fallback: drained.fallback,
    errors: [...consoleErrors, ...drained.errors],
  };
}

/** Read the produced file with the right inspector. */
async function readOutput(kind, bytes) {
  if (kind === 'pdf') return inspect.readPdf(bytes);
  if (kind === 'docx') return inspect.readDocx(bytes);
  if (kind === 'xlsx') return inspect.readXlsx(bytes);
  if (kind === 'zip') return inspect.readZip(bytes);
  if (kind === 'image') return inspect.readImage(bytes);
  return inspect.readText(bytes);
}

/** The fixture's size on disk, for recipes that assert a size change. */
function srcBytesOf(recipe) {
  const fixture = recipe.fixture || (recipe.typeInto && recipe.typeInto.fixture);
  if (!fixture) return null;
  const name = Array.isArray(fixture) ? fixture[0] : fixture;
  return readFileSync(join(FIXTURES, name)).length;
}

/** Read the fixture with the matching inspector, for source-vs-output checks. */
async function readSource(fixture) {
  // A merge recipe lists several inputs; they are copies, so the first speaks
  // for the set.
  const name = Array.isArray(fixture) ? fixture[0] : fixture;
  const buf = readFileSync(join(FIXTURES, name));
  if (name.endsWith('.docx')) return inspect.readDocx(buf);
  if (name.endsWith('.xlsx')) return inspect.readXlsx(buf);
  if (name.endsWith('.pdf')) return inspect.readPdf(buf);
  if (name.endsWith('.pptx')) return inspect.readZip(buf);
  if (/\.(png|jpe?g|webp|svg|heic|avif)$/i.test(name)) return inspect.readImage(buf);
  return inspect.readText(buf);
}

/** Every fixture a recipe needs, as a flat list. */
function fixturesOf(recipe) {
  if (recipe.typeInto) return [recipe.typeInto.fixture];
  return Array.isArray(recipe.fixture) ? recipe.fixture : [recipe.fixture];
}

/* ------------------------------------------------------------------ main */

const SYM = { pass: '  PASS', fail: '  FAIL', err: '  ERR ' };

(async () => {
  if (!existsSync(join(FIXTURES, 'torture.docx'))) {
    throw new Error('fixtures not built — run: node scripts/fidelity/fixtures/build-all.mjs');
  }

  const server = await ensureServer();
  const browser = await puppeteer.launch({
    executablePath: browserPath(),
    headless: HEADFUL ? false : 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  /* Ours, so puppeteer never deletes it — see browserProfile(). */
  userDataDir: browserProfile('fidelity'),
});

  const selected = only.length ? recipes.filter((r) => only.includes(r.slug)) : recipes;
  const report = [];

  for (const recipe of selected) {
    /* A recipe whose fixture is absent is skipped, not failed. The heic and
       avif samples come from scratch/, which is gitignored, so on a fresh
       clone they simply are not there — and "skipped, no fixture" is honest
       where a red FAIL would be a lie about the tool. */
    const wanted = fixturesOf(recipe);
    const absent = wanted.filter((f) => !existsSync(join(FIXTURES, f)));
    if (absent.length) {
      if (recipe.optional) {
        console.log(`\n${recipe.title}  (/${recipe.slug}/)\n  SKIP  fixture not available: ${absent.join(', ')}`);
        report.push({ slug: recipe.slug, title: recipe.title, checks: [], skipped: absent.join(', ') });
        continue;
      }
      console.log(`\n${recipe.title}  (/${recipe.slug}/)\n  ERR   missing fixture: ${absent.join(', ')}`);
      report.push({ slug: recipe.slug, title: recipe.title, checks: [], error: 'missing fixture ' + absent.join(', ') });
      continue;
    }

    process.stdout.write(`\n${recipe.title}  (/${recipe.slug}/)\n`);
    const entry = { slug: recipe.slug, title: recipe.title, checks: [], error: null };
    try {
      const run = await runRecipe(browser, recipe);
      const out = recipe.kind === 'dom' ? run.dom : await readOutput(recipe.kind, run.bytes);
      const src = await readSource(recipe.fixture || recipe.typeInto.fixture);
      const checks = await recipe.checks({
        page: run.alsoRead || {},
        out,
        src,
        /* Byte counts, which no parsed view of the output carries. A
           compression recipe's primary assertion is a size comparison. */
        bytes: run.bytes,
        srcBytes: srcBytesOf(recipe),
        // Recipes that unpack a zip need the inspectors for what is inside it.
        readXlsx: inspect.readXlsx,
        readDocx: inspect.readDocx,
        readPdf: inspect.readPdf,
        readZip: inspect.readZip,
        readImage: inspect.readImage,
        readExif: (buf) => exifParse.readImageMetadata(new Uint8Array(buf)),
      });

      entry.checks = checks;
      entry.meta = {
        downloadName: run.downloadName,
        size: run.size,
        ingestMs: run.ingestMs,
        exportMs: run.exportMs,
        fallback: run.fallback,
        errors: run.errors,
      };

      for (const c of checks) {
        console.log(`${c.pass ? SYM.pass : SYM.fail}  ${c.label}${c.detail ? `  — ${c.detail}` : ''}`);
      }
      if (run.fallback) console.log('  WARN  silent raster fallback fired — user gets a screenshot, unwarned');
      if (run.errors.length) console.log(`  WARN  ${run.errors.length} console error(s): ${run.errors[0].slice(0, 120)}`);
      console.log(`  info  ${run.size.toLocaleString()} bytes, ingest ${run.ingestMs}ms, export ${run.exportMs}ms`);
    } catch (e) {
      entry.error = e.message;
      console.log(`${SYM.err}  ${e.message}`);
    }
    report.push(entry);
  }

  await browser.close();
  server.stop();

  /* ------------------------------------------------------------ summary */
  const rows = [];
  let totalPass = 0, totalFail = 0, blockers = 0;
  for (const r of report) {
    const pass = r.checks.filter((c) => c.pass).length;
    const fail = r.checks.filter((c) => !c.pass);
    totalPass += pass;
    totalFail += fail.length;
    blockers += fail.filter((c) => c.weight === 'blocker').length;
    rows.push({
      tool: r.slug,
      pass,
      fail: fail.length,
      blockers: fail.filter((c) => c.weight === 'blocker').length,
      error: r.error,
      skipped: r.skipped,
    });
  }

  console.log('\n' + '='.repeat(72));
  console.log('FIDELITY SUMMARY');
  console.log('='.repeat(72));
  // Worst first: errors, then most blockers, then most failures.
  const rank = (r) => (r.error ? -1000 : 0) - r.blockers * 100 - r.fail;
  for (const row of [...rows].sort((a, b) => rank(a) - rank(b))) {
    const score = row.error ? 'ERROR' : row.skipped ? 'SKIP' : `${row.pass}/${row.pass + row.fail}`;
    console.log(
      `  ${row.tool.padEnd(18)} ${score.padStart(7)}` +
      (row.blockers ? `   ${row.blockers} blocker(s)` : '') +
      (row.error ? `   ${row.error}` : '') +
      (row.skipped ? `   no fixture: ${row.skipped}` : '')
    );
  }
  console.log(`\n  ${totalPass} passed, ${totalFail} failed, ${blockers} blocking`);

  /* A sweep that reports only what it looked at reads as a clean bill of
     health it has not earned. Say what has no recipe at all. */
  if (!only.length) {
    /* …and the list saying so is hand-written, so it can fall behind the site
       without anything looking wrong: a new tool with no recipe is simply
       absent from both the results and the "not covered" list, and the report
       reads as complete while quietly knowing less than it did. That happened
       the moment /compress-powerpoint/ and /compress-word/ were added. So
       every tool must now be accounted for somewhere, and an unaccounted one
       fails the run rather than disappearing from it. */
    /* Read as text rather than imported. `tools.ts` uses extensionless
       specifiers that Node cannot resolve, so `await import()` throws — and
       the first version of this guard caught that and carried on, which made
       it a check that could never fail. It was only caught by running the
       import on its own and watching it fail. */
    const toolsSrc = readFileSync(join(TESTING_PATHS.ROOT, 'src', 'data', 'tools.ts'), 'utf8');
    const slugs = [...toolsSrc.matchAll(/^\s*slug:\s*'([^']+)'/gm)].map((m) => m[1]);
    if (slugs.length < 40) {
      totalFail++;
      console.log(`\n  COVERAGE GUARD BROKEN — read only ${slugs.length} slugs out of tools.ts,`
        + ' so it is not really checking anything');
    } else {
      const known = new Set([
        ...recipes.map((r) => r.slug),
        ...uncovered.map((u) => u.slug),
        ...partiallyCovered.map((p) => p.slug),
      ]);
      const orphans = slugs.filter((s) => !known.has(s));
      if (orphans.length) {
        totalFail += orphans.length;
        console.log(`\n  UNACCOUNTED FOR (${orphans.length}) — add a recipe, or say why there is none`
          + ` in recipes/index.mjs:\n    ${orphans.join('\n    ')}`);
      }
    }

    console.log(`\n  NOT COVERED BY ANY RECIPE (${uncovered.length} tool${uncovered.length === 1 ? '' : 's'}):`);
    for (const u of uncovered) console.log(`    ${u.slug.padEnd(26)} ${u.why}`);

    /* A recipe that covers half a tool is not the same claim as a recipe
       that covers it, and a green row does not distinguish them. Say which
       rows are partial and where the rest of the coverage lives. */
    if (partiallyCovered.length) {
      console.log(`
  PARTIALLY COVERED (${partiallyCovered.length} tool${partiallyCovered.length === 1 ? '' : 's'}) — the recipe passes, but not on everything:`);
      for (const pc of partiallyCovered) {
        console.log(`    ${pc.slug.padEnd(26)} covers ${pc.covers}`);
        console.log(`    ${''.padEnd(26)} NOT here: ${pc.missing}`);
        console.log(`    ${''.padEnd(26)} asserted by: ${pc.where}`);
      }
    }
  }
  console.log('');

  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, 'report.json'), JSON.stringify({ when: new Date().toISOString(), report }, null, 2));
  console.log(`  report: testing/out/report.json`);
  console.log(`  files:  testing/out/\n`);

  process.exit(blockers > 0 ? 1 : 0);
})().catch((e) => {
  console.error('\nharness failed:', e.message);
  process.exit(2);
});
