/**
 * Does the office compressor shrink a deck without breaking it?
 *
 * `npm run fidelity` asks "did the content survive a conversion", and its
 * recipes compare a downloaded file against an expected shape. Compression
 * needs a harder pair of questions answered together — did it get smaller,
 * and did anything get *worse than it had to* — and several of the answers
 * are not visible in the downloaded file at all. Whether an untouched image
 * came back byte-identical, whether a transparent PNG kept its alpha, and
 * whether a flat graphic was correctly refused are all invisible to "the file
 * opens and is smaller".
 *
 * So this drives the real page with the real fixture, then unzips what came
 * back and inspects it part by part.
 *
 *   node scripts/fidelity/verify-compress-office.mjs
 *   CO_ORIGIN=https://convertocean.com node scripts/fidelity/verify-compress-office.mjs
 */
import puppeteer from 'puppeteer-core';
import JSZip from 'jszip';
import { existsSync, readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import * as TESTING_PATHS from '../testing-paths.mjs';
import { assertWellFormed } from './lib/ooxml.mjs';

const ORIGIN = process.env.CO_ORIGIN || 'http://localhost:4321';
const LOCAL = ORIGIN.includes('localhost');
const FIXTURE = TESTING_PATHS.fixture('torture-compress.pptx');

const EDGE = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  process.env.CHROME_PATH,
].filter(Boolean);

function browserPath() {
  for (const p of EDGE) if (existsSync(p)) return p;
  throw new Error('No Edge/Chrome found. Set CHROME_PATH.');
}

let bad = 0;
const say = (ok, msg) => { if (!ok) bad++; console.log(`${ok ? 'OK  ' : 'FAIL'}  ${msg}`); };

async function ensureServer() {
  if (!LOCAL) return null;
  const server = spawn('npx', ['astro', 'preview', '--port', '4321'], { shell: true, stdio: 'ignore' });
  const deadline = Date.now() + 90000;
  while (Date.now() < deadline) {
    try { if ((await fetch(ORIGIN + '/', { signal: AbortSignal.timeout(3000) })).ok) return server; }
    catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 1000));
  }
  server.kill();
  throw new Error('preview server did not start (run `npm run build` first)');
}

const server = await ensureServer();
const browser = await puppeteer.launch({
  executablePath: browserPath(), headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

try {
  console.log(`\ncompress-office: ${ORIGIN}\n`);

  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(ORIGIN + '/compress-powerpoint/', { waitUntil: 'networkidle2', timeout: 45000 });

  await page.waitForFunction(() => typeof window.coCompressOoxml === 'function'
                                && typeof window.JSZip === 'function', { timeout: 20000 });
  say(true, 'the page publishes the engine and the archive reader');

  const input = await page.$('#fileInput');
  await input.uploadFile(FIXTURE);

  await page.waitForFunction(() => {
    const b = document.getElementById('cofDownload');
    return b && !b.disabled;
  }, { timeout: 60000 });

  /* --- what the page told the reader ------------------------------------ */
  const shown = await page.evaluate(() => ({
    before: document.getElementById('cofBefore').textContent.trim(),
    after: document.getElementById('cofAfter').textContent.trim(),
    saving: document.getElementById('cofSaving').textContent.trim(),
    live: document.getElementById('cofLive').textContent.trim(),
    rows: [...document.querySelectorAll('#cofImgRows tr')].map((tr) => ({
      name: tr.children[0].textContent.trim(),
      stored: tr.children[1].textContent.trim(),
      shownAt: tr.children[2].textContent.trim(),
      result: tr.children[3].textContent.trim(),
      why: tr.children[4].textContent.trim(),
    })),
  }));

  say(shown.rows.length === 5,
      `every image is listed in "what changed" (${shown.rows.length} of 5)`);
  say(shown.live.length > 0, 'the outcome is announced through a live region');

  const row = (n) => shown.rows.find((r) => r.name.startsWith(n));
  const shrunk = (n) => (row(n) || {}).result !== 'kept' && (row(n) || {}).result !== undefined;

  say(shrunk('photo-big'), `the 400 DPI photo was shrunk (${(row('photo-big') || {}).result})`);
  say(shrunk('photo-mid'), `the 300 DPI photo was shrunk (${(row('photo-mid') || {}).result})`);
  say(!shrunk('graphic'), `the flat graphic was kept — ${(row('graphic') || {}).why}`);
  say(!shrunk('right-sized'), `the 96 DPI image was kept — ${(row('right-sized') || {}).why}`);
  say(!shrunk('transparent'), `the transparent PNG was kept — ${(row('transparent') || {}).why}`);
  say(/transparen/i.test((row('transparent') || {}).why || ''),
      'and the reason given names transparency, not a generic skip');

  /* --- the file that actually came back ---------------------------------- */
  /* Downloads are awkward to intercept headlessly, so the bytes are taken
     from the engine directly — the same bytes the download button writes. */
  const outB64 = await page.evaluate(async () => {
    const f = document.getElementById('fileInput').files[0];
    const bytes = new Uint8Array(await f.arrayBuffer());
    const out = await window.coCompressOoxml(bytes, { dpi: 150, quality: 0.72 }, window.JSZip, {});
    let s = '';
    const b = out.bytes;
    for (let i = 0; i < b.length; i += 0x8000) {
      s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000));
    }
    return { b64: btoa(s), report: out.report };
  });

  const outBytes = Buffer.from(outB64.b64, 'base64');
  const original = readFileSync(FIXTURE);
  say(outBytes.length < original.length,
      `the file got smaller: ${(original.length / 1024).toFixed(1)} KB -> ${(outBytes.length / 1024).toFixed(1)} KB `
      + `(${Math.round((1 - outBytes.length / original.length) * 100)}% off)`);

  const inZip = await JSZip.loadAsync(original);
  const outZip = await JSZip.loadAsync(outBytes);

  /* Every non-image part must survive byte-identical: a compressor that
     rebuilds the package and drops what it did not understand is the failure
     slide 4 exists to catch. */
  const inParts = Object.keys(inZip.files).filter((p) => !inZip.files[p].dir);
  const outParts = Object.keys(outZip.files).filter((p) => !outZip.files[p].dir);
  const missing = [];
  for (const p of inParts) {
    if (/\/media\//.test(p)) continue;
    if (!outParts.includes(p)) missing.push(p);
  }
  say(missing.length === 0,
      missing.length ? `parts were dropped: ${missing.join(', ')}` : `all ${inParts.length - 5} non-image parts survive`);

  for (const p of ['ppt/slides/slide4.xml', 'ppt/presentation.xml', 'ppt/slides/slide1.xml']) {
    const a = await inZip.file(p).async('string');
    const b = outZip.file(p) ? await outZip.file(p).async('string') : null;
    say(b !== null && a === b, `${p} is unchanged`);
  }

  /* Markers: the text a reader would see must all still be there. */
  const slide4 = outZip.file('ppt/slides/slide4.xml') ? await outZip.file('ppt/slides/slide4.xml').async('string') : '';
  say(slide4.includes('M09') && slide4.includes('M10'), 'the text-only slide keeps its markers');

  /* The two images that must be untouched must be byte-identical, not merely
     present — "still there" would pass on a re-encoded copy. */
  for (const name of ['right-sized.png', 'transparent.png']) {
    const a = await inZip.file('ppt/media/' + name).async('uint8array');
    const f = outZip.file('ppt/media/' + name);
    const b = f ? await f.async('uint8array') : null;
    say(b !== null && Buffer.compare(Buffer.from(a), Buffer.from(b)) === 0,
        `${name} came back byte-identical`);
  }

  const graphic = outZip.file('ppt/media/graphic.png');
  say(graphic !== null, 'the flat graphic is still a .png, not a larger .jpeg');

  /* A renamed part is useless if nothing points at it any more. */
  const rels1 = await outZip.file('ppt/slides/_rels/slide1.xml.rels').async('string');
  const target = (rels1.match(/Target="([^"]+)"/) || [])[1] || '';
  const resolved = 'ppt/' + target.replace(/^\.\.\//, '');
  say(outZip.file(resolved) !== null,
      `slide 1's relationship points at a part that exists (${target})`);

  const types = await outZip.file('[Content_Types].xml').async('string');
  say(/Extension="jpeg"/i.test(types),
      'the package declares a content type for the re-encoded parts');

  /* The engine edits [Content_Types].xml and every .rels by string surgery,
     which is the cheapest way to break a package in a way nothing above would
     notice: the file still unzips, the parts are all present, and PowerPoint
     refuses to open it. So every XML part in the output is parsed. */
  let malformed = [];
  for (const p of outParts) {
    if (!/\.(xml|rels)$/i.test(p)) continue;
    const xml = await outZip.file(p).async('string');
    try { assertWellFormed(xml, p); } catch (e) { malformed.push(`${p}: ${String(e).slice(0, 70)}`); }
  }
  say(malformed.length === 0,
      malformed.length ? `malformed XML after compression: ${malformed.join(' | ')}`
                       : `all ${outParts.filter((p) => /\.(xml|rels)$/i.test(p)).length} XML parts are still well-formed`);

  /* Every part needs a declared content type, by Default extension or by
     Override. A part with neither is the exact reason Office says a file is
     corrupt and needs repairing. */
  const defaults = new Set([...types.matchAll(/Default Extension="([^"]+)"/gi)].map((m) => m[1].toLowerCase()));
  const overrides = new Set([...types.matchAll(/Override PartName="([^"]+)"/gi)].map((m) => m[1].replace(/^\//, '')));
  const undeclared = outParts.filter((p) => {
    if (p === '[Content_Types].xml') return false;
    if (overrides.has(p)) return false;
    const ext = (p.split('.').pop() || '').toLowerCase();
    return !defaults.has(ext);
  });
  say(undeclared.length === 0,
      undeclared.length ? `parts with no declared content type: ${undeclared.join(', ')}`
                        : 'every part in the package has a declared content type');

  say(errors.length === 0, errors.length ? `page errors: ${errors[0]}` : 'no page errors');

  /* --- switching preset re-runs, and Strong really is stronger ----------- */

  /* The preset buttons are the only interactive control on the page, and they
     re-run the whole engine on the file already chosen. Nothing above exercises
     that path: every check so far used the default. A preset that silently did
     nothing would look perfectly fine on screen. */
  const balancedAfter = await page.evaluate(() =>
    document.getElementById('cofAfter').textContent.trim());

  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('#cofPresetRow .cof-preset')];
    const strong = btns.find((b) => /strong/i.test(b.textContent));
    if (strong) strong.click();
  });
  await page.waitForFunction((prev) => {
    const b = document.getElementById('cofDownload');
    return b && !b.disabled && document.getElementById('cofAfter').textContent.trim() !== prev;
  }, { timeout: 60000 }, balancedAfter).catch(() => {});

  const strongState = await page.evaluate(() => ({
    after: document.getElementById('cofAfter').textContent.trim(),
    pressed: [...document.querySelectorAll('#cofPresetRow .cof-preset')]
      .filter((b) => b.getAttribute('aria-pressed') === 'true').length,
    pressedIsStrong: /strong/i.test(
      ([...document.querySelectorAll('#cofPresetRow .cof-preset')]
        .find((b) => b.getAttribute('aria-pressed') === 'true') || {}).textContent || ''),
  }));

  const kb = (s) => parseFloat(String(s).replace(/[^\d.]/g, ''));
  say(strongState.after !== balancedAfter,
      `switching preset re-runs the compressor (${balancedAfter} -> ${strongState.after})`);
  say(kb(strongState.after) < kb(balancedAfter),
      `Strong really is smaller than Recommended (${strongState.after} < ${balancedAfter})`);
  say(strongState.pressed === 1 && strongState.pressedIsStrong,
      'exactly one preset reports itself pressed, and it is the one clicked');

  /* --- a second, structurally richer deck -------------------------------- */

  /* The compression fixture is built to exercise decisions, so it is
     deliberately simple: four slides, one layout, no theme. A real .pptx
     carries slide masters, layouts, a theme, notes slides and presentation
     properties, and a compressor that quietly drops any of those produces a
     file PowerPoint offers to repair. `torture.pptx` has all of that and
     nothing worth compressing, so it tests the opposite thing from everything
     above: leave a file alone correctly. */
  const plainPath = TESTING_PATHS.fixture('torture.pptx');
  const plainIn = readFileSync(plainPath);
  await page.evaluate(() => { document.getElementById('cofClear').click(); });
  const plainOutB64 = await page.evaluate(async (b64) => {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const out = await window.coCompressOoxml(bytes, { dpi: 150, quality: 0.72 }, window.JSZip, {});
    let s = '';
    for (let i = 0; i < out.bytes.length; i += 0x8000) {
      s += String.fromCharCode.apply(null, out.bytes.subarray(i, i + 0x8000));
    }
    return { b64: btoa(s), report: out.report };
  }, plainIn.toString('base64'));

  const plainOut = Buffer.from(plainOutB64.b64, 'base64');
  const plainInZip = await JSZip.loadAsync(plainIn);
  const plainOutZip = await JSZip.loadAsync(plainOut);
  const plainInParts = Object.keys(plainInZip.files).filter((p) => !plainInZip.files[p].dir);
  const plainOutParts = Object.keys(plainOutZip.files).filter((p) => !plainOutZip.files[p].dir);
  const lost = plainInParts.filter((p) => !plainOutParts.includes(p) && !/\/media\//.test(p));

  say(lost.length === 0,
      lost.length ? `a structurally complete deck lost parts: ${lost.join(', ')}`
                  : `a deck with masters, layouts, a theme and notes keeps all ${plainInParts.length} parts`);

  /* Its one image is already displayed at 96 DPI, so the honest outcome is
     that nothing changes at all — including the file not growing. */
  say(plainOutB64.report.imagesShrunk === 0,
      `nothing was re-encoded in a deck that had nothing to gain (${plainOutB64.report.imagesShrunk} shrunk)`);

  let plainMalformed = [];
  for (const p of plainOutParts) {
    if (!/\.(xml|rels)$/i.test(p)) continue;
    const xml = await plainOutZip.file(p).async('string');
    try { assertWellFormed(xml, p); } catch (e) { plainMalformed.push(p); }
  }
  say(plainMalformed.length === 0,
      plainMalformed.length ? `malformed after a no-op pass: ${plainMalformed.join(', ')}`
                            : 'every part is still well-formed after a no-op pass');

  /* --- the Word page loads the same engine ------------------------------- */
  const wordPage = await browser.newPage();
  const wordErrors = [];
  wordPage.on('pageerror', (e) => wordErrors.push(String(e)));
  await wordPage.goto(ORIGIN + '/compress-word/', { waitUntil: 'networkidle2', timeout: 45000 });
  const wordOk = await wordPage.evaluate(() => ({
    engine: typeof window.coCompressOoxml === 'function',
    accept: (document.getElementById('fileInput') || {}).accept,
    h1: document.querySelectorAll('h1').length,
  }));
  say(wordOk.engine, '/compress-word/ publishes the engine too');
  say(wordOk.accept === '.docx', `/compress-word/ accepts .docx (got ${wordOk.accept})`);
  say(wordOk.h1 === 1, `/compress-word/ has exactly one h1 (${wordOk.h1})`);
  say(wordErrors.length === 0, wordErrors.length ? `word page errors: ${wordErrors[0]}` : 'no page errors on /compress-word/');

  /* --- the DOCX path, driven for real ------------------------------------ */

  /* "The engine is format-neutral" is a claim, and Word differs in two ways
     either of which would silently leave every image unmeasured: it measures
     with <wp:extent> inside <w:drawing> rather than <a:ext> inside <p:pic>,
     and writes relationship targets as "media/x.png" rather than
     "../media/x.png". An unmeasured image is skipped, so the failure would be
     a compressor that runs, succeeds, and changes nothing. */
  const docxPath = TESTING_PATHS.fixture('torture-compress.docx');
  await wordPage.$('#fileInput').then((el) => el.uploadFile(docxPath));
  await wordPage.waitForFunction(() => {
    const b = document.getElementById('cofDownload');
    return b && !b.disabled;
  }, { timeout: 60000 });

  const docxRows = await wordPage.evaluate(() =>
    [...document.querySelectorAll('#cofImgRows tr')].map((tr) => ({
      name: tr.children[0].textContent.trim(),
      result: tr.children[3].textContent.trim(),
      why: tr.children[4].textContent.trim(),
    })));
  const drow = (n) => docxRows.find((r) => r.name.startsWith(n)) || {};

  say(docxRows.length === 5, `the DOCX lists all five images (${docxRows.length})`);
  say(drow('photo-big').result && drow('photo-big').result !== 'kept',
      `DOCX: the 400 DPI photo was shrunk (${drow('photo-big').result}) — so <wp:extent> is being read`);
  say(drow('graphic').result === 'kept', 'DOCX: the flat graphic was kept');
  say(drow('right-sized').result === 'kept', 'DOCX: the 96 DPI image was kept');
  say(/transparen/i.test(drow('transparent').why || ''),
      'DOCX: the transparent PNG was kept for the right reason');

  const docxOutB64 = await wordPage.evaluate(async () => {
    const f = document.getElementById('fileInput').files[0];
    const b = new Uint8Array(await f.arrayBuffer());
    const out = await window.coCompressOoxml(b, { dpi: 150, quality: 0.72 }, window.JSZip, {});
    let s = '';
    for (let i = 0; i < out.bytes.length; i += 0x8000) {
      s += String.fromCharCode.apply(null, out.bytes.subarray(i, i + 0x8000));
    }
    return { b64: btoa(s), report: out.report };
  });
  const docxOut = Buffer.from(docxOutB64.b64, 'base64');
  const docxIn = readFileSync(docxPath);
  say(docxOut.length < docxIn.length,
      `the DOCX got smaller: ${(docxIn.length / 1024).toFixed(1)} KB -> ${(docxOut.length / 1024).toFixed(1)} KB `
      + `(${Math.round((1 - docxOut.length / docxIn.length) * 100)}% off)`);

  /* ------------------------------------------------------------------
     A file with nothing to shrink.

     Every assertion above runs on a document built to have recoverable
     bytes, so all of them measure the same half of the job: does it find
     them. This measures the other half — what it does when there are none.
     A 60-page report with no pictures is all repetitive XML, and the only
     step that still touches it is the re-zip on the way out.

     That step is not automatically safe. Re-deflating repetitive XML at
     level 9 produced a file **46% larger** than level 6 on a sheet of 40,000
     near-identical rows. It does not reach this engine, because JSZip copies
     the compressed stream of every entry it was not asked to change — but
     "does not reach it today" is a thing to assert, not to assume.
     ------------------------------------------------------------------ */
  const textHeavyPath = TESTING_PATHS.fixture('torture-textheavy.docx');
  const textHeavyIn = readFileSync(textHeavyPath);
  await wordPage.evaluate(() => { document.getElementById('fileInput').value = ''; });
  await (await wordPage.$('#fileInput')).uploadFile(textHeavyPath);
  await new Promise((r) => setTimeout(r, 1200));

  const plain = await wordPage.evaluate(async () => {
    const f = document.getElementById('fileInput').files[0];
    const b = new Uint8Array(await f.arrayBuffer());
    const out = await window.coCompressOoxml(b, { dpi: 150, quality: 0.72 }, window.JSZip, {});
    return { size: out.bytes.length, report: out.report };
  });

  say(plain.size <= textHeavyIn.length,
      `a document with no images never comes back bigger: `
      + `${(textHeavyIn.length / 1024).toFixed(1)} KB -> ${(plain.size / 1024).toFixed(1)} KB`);
  say(plain.report.imagesFound === 0,
      `nothing was found to shrink, which is the case under test `
      + `(${plain.report.imagesFound} images)`);
  say(plain.report.bytesSavedOnImages === 0,
      'and it does not claim a saving it did not make');

  const dOutZip = await JSZip.loadAsync(docxOut);
  const body = await dOutZip.file('word/document.xml').async('string');
  say(body.includes('D01') && body.includes('D09'),
      'the DOCX body survives with its first and last markers');
  for (const n of ['right-sized.png', 'transparent.png']) {
    const a = await (await JSZip.loadAsync(docxIn)).file('word/media/' + n).async('uint8array');
    const f = dOutZip.file('word/media/' + n);
    const b = f ? await f.async('uint8array') : null;
    say(b && Buffer.compare(Buffer.from(a), Buffer.from(b)) === 0,
        `DOCX: ${n} came back byte-identical`);
  }

  /* --- target-size mode, the thing 145 real queries ask for -------------- */

  /* Bytes are passed in rather than read from the file input: the
     structurally-rich-deck check above clicks "Start over", which clears it. */
  const targets = await page.evaluate(async (b64) => {
    const bin = atob(b64);
    const src = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) src[i] = bin.charCodeAt(i);
    const reachable = await window.coCompressOoxml(
      src.slice(), { targetBytes: 120 * 1024 }, window.JSZip, {});
    const impossible = await window.coCompressOoxml(
      src.slice(), { targetBytes: 8 * 1024 }, window.JSZip, {});
    return {
      reachable: { size: reachable.bytes.length, met: reachable.report.targetMet },
      impossible: { size: impossible.bytes.length, met: impossible.report.targetMet },
    };
  }, readFileSync(FIXTURE).toString('base64'));

  say(targets.reachable.met === true && targets.reachable.size <= 120 * 1024,
      `a reachable target is met (${(targets.reachable.size / 1024).toFixed(1)} KB under 120 KB)`);
  say(targets.impossible.met === false,
      'an unreachable target reports met:false rather than pretending');
  say(targets.impossible.size > 8 * 1024,
      `and returns the smallest it could reach (${(targets.impossible.size / 1024).toFixed(1)} KB) `
      + 'rather than an unreadable file that meets the number');
  /* The gentlest setting that fits, not the smallest possible: a result far
     under the limit gave away quality it did not need to. */
  say(targets.reachable.size > targets.impossible.size,
      'the reachable target used a gentler setting than the impossible one');

  /* --- responsive: the workspace only exists after a file is chosen ------- */
  for (const w of [320, 360, 390, 768, 1024]) {
    await page.setViewport({ width: w, height: 900 });
    await new Promise((r) => setTimeout(r, 250));
    const m = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    say(m.scroll <= m.client + 1, `${w}px: no horizontal page scroll (${m.scroll} vs ${m.client})`);
  }

  await page.close();
  await wordPage.close();
} finally {
  await browser.close();
  if (server) server.kill();
}

console.log(bad ? `\n${bad} check(s) failed` : '\nall office-compressor checks passed');
process.exit(bad ? 1 : 0);
