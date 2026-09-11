/**
 * The half of /compress-pdf/ that a downloaded file cannot show you.
 *
 * `npm run fidelity` drives the real page, downloads the result and proves the
 * document survived: four pages, twelve markers, four fonts, a live link, a
 * filled form field, nothing dropped, 75% smaller. All true, and all of it
 * still consistent with a compressor that got its numbers by doing the wrong
 * thing to individual images.
 *
 * The rules that make this tool correct rather than merely effective are
 * per-stream, and invisible from outside:
 *
 *   - a flat-colour graphic must be left alone, because Deflate already beats
 *     any JPEG of it and "optimising" it makes the file bigger *and* worse;
 *   - an image already drawn at its natural size must come out byte-identical;
 *   - a 1-bit stencil mask must never be touched;
 *   - soft-mask transparency must not be flattened;
 *   - the presets must actually be ordered;
 *   - and when a requested size is not reachable, the tool must say so rather
 *     than return an unreadable file that meets the number.
 *
 * Every one of those can fail while all ten recipe checks stay green, so they
 * are asserted here, against the module exactly as the page publishes it.
 *
 *   npm run compress
 *   CO_ORIGIN=https://convertocean.com npm run compress
 */
import puppeteer from 'puppeteer-core';
import { existsSync, readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURES = join(HERE, 'fixtures', 'files');
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

let bad = 0;
const say = (okFlag, msg) => { if (!okFlag) bad++; console.log(`${okFlag ? 'OK  ' : 'FAIL'}  ${msg}`); };

async function ensureServer() {
  if (!LOCAL) return null;
  const probe = await fetch(ORIGIN).then(() => true).catch(() => false);
  if (probe) { console.log(`using the server already on ${ORIGIN}`); return null; }
  console.log(`starting dev server at ${ORIGIN} …`);
  const server = spawn('npx', ['astro', 'dev', '--port', '4321'], { shell: true, stdio: 'ignore' });
  for (let i = 0; i < 60; i++) {
    if (await fetch(ORIGIN).then(() => true).catch(() => false)) return server;
    await new Promise((r) => setTimeout(r, 500));
  }
  server.kill();
  throw new Error('dev server never came up');
}

const server = await ensureServer();
const browser = await puppeteer.launch({
  executablePath: browserPath(), headless: 'new', args: ['--no-sandbox'],
});

try {
  const page = await browser.newPage();
  page.on('pageerror', (e) => say(false, `page error: ${e.message}`));
  await page.goto(`${ORIGIN}/compress-pdf/`, { waitUntil: 'networkidle2', timeout: 60_000 });

  /* The engine is published on `window` by [tool].astro. Waiting for it also
     confirms the page's own library bootstrap actually ran. */
  await page.waitForFunction(
    'typeof window.coCompressPdf === "function" && window.PDFLib && window.pdfjsLib',
    { timeout: 30_000 },
  );

  const fixture = readFileSync(join(FIXTURES, 'torture-compress.pdf'));
  const textOnly = readFileSync(join(FIXTURES, 'torture.pdf'));
  await page.evaluate((a, b) => {
    const dec = (s) => { const x = atob(s); const u = new Uint8Array(x.length); for (let i = 0; i < x.length; i++) u[i] = x.charCodeAt(i); return u; };
    window.__fix = dec(a);
    window.__textOnly = dec(b);
    window.__run = (opts) => window.coCompressPdf(window.__fix.slice(), opts, window.PDFLib, {
      progress: () => {}, yield: () => new Promise((r) => setTimeout(r, 0)),
    });
  }, fixture.toString('base64'), textOnly.toString('base64'));

  /* ---------------------------------------------- per-image decisions ---- */

  const decisions = await page.evaluate(async () => {
    const out = await window.__run({ dpi: 150, quality: 0.72 });
    return { images: out.report.images, size: out.bytes.length };
  });

  const find = (pred) => decisions.images.find(pred);
  const flat = find((i) => i.width === 1200 && i.bytes < 20000);
  const photo = find((i) => i.width === 1200 && i.bytes > 20000);
  const already = find((i) => i.width === 100);
  const stencil = find((i) => i.width === 320);
  const scan = find((i) => i.width === 1800);

  say(scan && scan.action === 'shrunk',
    `the 245 DPI scan is downsampled (${scan ? scan.action + ' ' + scan.bytes + '->' + scan.newBytes : 'not found'})`);

  say(photo && photo.action === 'shrunk',
    `a photographic lossless image is downsampled (${photo ? photo.action : 'not found'})`);

  say(flat && flat.action === 'kept',
    `a flat-colour graphic at the same DPI is left alone (${flat ? flat.action + ': ' + flat.reason : 'not found'})`);

  say(already && already.action === 'kept',
    `an image already at its natural size is left alone (${already ? already.action : 'not found'})`);

  say(stencil && stencil.action === 'skipped',
    `the 1-bit stencil mask is skipped (${stencil ? stencil.action : 'not found'})`);

  /* Every image must be accounted for. A compressor that quietly omits one
     from its own report is the same failure as omitting it from the file. */
  say(decisions.images.length === 7,
    `all 7 image streams appear in the report (got ${decisions.images.length})`);
  say(decisions.images.every((i) => i.action === 'shrunk' || i.reason),
    'every untouched image carries a stated reason');

  /* ------------------------------------------- byte-identity of the kept -- */

  const identity = await page.evaluate(async () => {
    const { PDFDocument, PDFName, PDFRawStream } = window.PDFLib;
    const out = await window.__run({ dpi: 150, quality: 0.72 });
    const read = async (bytes) => {
      const d = await PDFDocument.load(bytes, { ignoreEncryption: true, updateMetadata: false });
      const acc = { stencil: -1, small: -1, flat: -1, count: 0 };
      for (const [, o] of d.context.enumerateIndirectObjects()) {
        if (!(o instanceof PDFRawStream)) continue;
        const dict = o.dict;
        if (String(dict.get(PDFName.of('Subtype'))) !== '/Image') continue;
        acc.count++;
        if (String(dict.get(PDFName.of('ImageMask'))) === 'true') { acc.stencil = o.contents.length; continue; }
        const w = dict.get(PDFName.of('Width'));
        const wn = w && w.asNumber ? w.asNumber() : 0;
        if (wn === 100) acc.small = o.contents.length;
        if (wn === 1200 && o.contents.length < 20000) acc.flat = o.contents.length;
      }
      return acc;
    };
    return { before: await read(window.__fix.slice()), after: await read(out.bytes) };
  });

  say(identity.after.stencil === identity.before.stencil && identity.before.stencil > 0,
    `stencil stream is byte-identical (${identity.after.stencil} vs ${identity.before.stencil})`);
  say(identity.after.small === identity.before.small && identity.before.small > 0,
    `already-right-size stream is byte-identical (${identity.after.small} vs ${identity.before.small})`);
  say(identity.after.flat === identity.before.flat && identity.before.flat > 0,
    `flat graphic stream is byte-identical (${identity.after.flat} vs ${identity.before.flat})`);
  say(identity.after.count === identity.before.count,
    `image stream count unchanged (${identity.after.count} vs ${identity.before.count})`);

  /* ------------------------------------------------------- transparency --- */

  /* Page 3 draws a soft-masked image over a magenta bar. If the alpha were
     flattened the bar would be hidden behind an opaque square, so a single
     pixel answers the question. The fixture is probed first: a check that
     cannot fail is not a check, and if the original does not show magenta
     here then the probe point is wrong rather than the tool. */
  const alpha = await page.evaluate(async () => {
    const out = await window.__run({ dpi: 150, quality: 0.72 });
    const pixelAt = async (bytes, pageNo, fx, fy) => {
      const doc = await window.pdfjsLib.getDocument({ data: bytes.slice() }).promise;
      const pg = await doc.getPage(pageNo);
      const vp = pg.getViewport({ scale: 1 });
      const c = document.createElement('canvas');
      c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height);
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, c.width, c.height);
      await pg.render({ canvasContext: ctx, viewport: vp }).promise;
      const d = ctx.getImageData(Math.round(c.width * fx), Math.round(c.height * fy), 1, 1).data;
      return [d[0], d[1], d[2]];
    };
    return {
      before: await pixelAt(window.__fix, 3, 0.145, 0.145),
      after: await pixelAt(out.bytes, 3, 0.145, 0.145),
    };
  });
  const magenta = (p) => p[0] > 150 && p[1] < 100 && p[2] > 100;
  say(magenta(alpha.before), `fixture shows magenta through the soft mask (${alpha.before}) — probe point is valid`);
  say(magenta(alpha.after), `compressed file still shows it: transparency not flattened (${alpha.after})`);

  /* ----------------------------------------------------------- presets ---- */

  const presets = await page.evaluate(async () => {
    const p = window.coPdfPresets;
    const sizes = {};
    for (const k of ['light', 'balanced', 'strong']) {
      const out = await window.coCompressPdf(window.__fix.slice(),
        { dpi: p[k].dpi, quality: p[k].quality }, window.PDFLib,
        { progress: () => {}, yield: () => new Promise((r) => setTimeout(r, 0)) });
      sizes[k] = out.bytes.length;
    }
    return sizes;
  });
  say(presets.light > presets.balanced && presets.balanced > presets.strong,
    `presets are ordered light > balanced > strong (${presets.light} > ${presets.balanced} > ${presets.strong})`);

  /* ------------------------------------------------------- target sizes --- */

  const target = await page.evaluate(async () => {
    const reachable = await window.__run({ targetBytes: 150 * 1024 });
    const impossible = await window.__run({ targetBytes: 8 * 1024 });
    return {
      reachable: { size: reachable.bytes.length, met: reachable.report.targetMet, passes: reachable.report.passes },
      impossible: { size: impossible.bytes.length, met: impossible.report.targetMet },
    };
  });
  say(target.reachable.met && target.reachable.size <= 150 * 1024,
    `a reachable 150 KB target is met (${target.reachable.size} bytes, ${target.reachable.passes} passes)`);
  /* The honest-failure case. Meeting an 8 KB target on this document is not
     possible at readable quality, and claiming success would be the worse
     outcome — so the requirement is that it says met=false. */
  say(target.impossible.met === false,
    `an unreachable 8 KB target reports honestly rather than claiming success ` +
    `(met=${target.impossible.met}, smallest reached ${target.impossible.size} bytes)`);

  /* ---------------------------------------------------- degenerate input -- */

  const textCase = await page.evaluate(async () => {
    const out = await window.coCompressPdf(window.__textOnly.slice(), { dpi: 150, quality: 0.72 },
      window.PDFLib, { progress: () => {}, yield: () => Promise.resolve() });
    return { noImages: !!out.report.noImages, images: out.report.images.length, size: out.bytes.length };
  });
  say(textCase.noImages && textCase.images === 0,
    `a text-only PDF is reported as having no images rather than a compression win (noImages=${textCase.noImages})`);

  /* Compressing an already-compressed file must not grow it. This is the
     rule that stops a second pass being worse than the first. */
  const twice = await page.evaluate(async () => {
    const once = await window.__run({ dpi: 150, quality: 0.72 });
    const again = await window.coCompressPdf(once.bytes.slice(), { dpi: 150, quality: 0.72 },
      window.PDFLib, { progress: () => {}, yield: () => Promise.resolve() });
    return { first: once.bytes.length, second: again.bytes.length, noGain: !!again.report.noGain };
  });
  say(twice.second <= twice.first,
    `re-compressing its own output never grows the file (${twice.first} -> ${twice.second}` +
    `${twice.noGain ? ', reported as no further gain' : ''})`);

  /* ------------------------------------------------- responsive workspace */

  /* `npm run mobile` sweeps the band but only ever sees the landing state of a
     tool page. Everything built for this tool — the size hero, the preset
     grid, the before/after stage, the per-image table — only exists after a
     file has been compressed, so it would never be measured there. 1024 is
     included because the preset grid's auto-fit columns change count around
     there, and a breakpoint band is where layout bugs actually live. */
  const widths = [320, 360, 390, 768, 1024];
  for (const width of widths) {
    const shot = await browser.newPage();
    try {
      await shot.setViewport({ width, height: 900, deviceScaleFactor: 1 });
      await shot.goto(`${ORIGIN}/compress-pdf/`, { waitUntil: 'networkidle2', timeout: 60_000 });
      await shot.waitForFunction('typeof window.coCompressPdf === "function" && window.PDFLib', { timeout: 30_000 });

      /* Drive the real input rather than calling the engine, so the workspace
         is laid out by the page exactly as a reader would see it. */
      const input = await shot.$('#fileInput');
      await input.uploadFile(join(FIXTURES, 'torture-compress.pdf'));
      await shot.waitForSelector('#cmpDownload:not([disabled])', { timeout: 60_000 });
      /* Wait for both halves to be painted, not merely for the section to
         appear — the compressed side is parsed and drawn second. */
      await shot.waitForSelector('#cmpStage[data-ready="1"]', { timeout: 30_000 });

      const m = await shot.evaluate(() => {
        const de = document.documentElement;
        const over = [];
        for (const el of document.querySelectorAll('#cmpWorkspace, #cmpWorkspace *')) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) continue;
          /* A table wider than the screen is fine *inside its own scroller* —
             that is the documented pattern — so skip everything within one.
             An earlier version of this check skipped only the TABLE element
             and then reported its own THEAD and TH as overflow, which is a
             fault in the measurement rather than in the page. The scroller
             itself is still measured, and asserted separately below. */
          if (el.closest('.cmp-table-scroll')) continue;
          if (r.right > de.clientWidth + 1 || r.left < -1) {
            over.push((el.id || el.className || el.tagName) + ' @ ' + Math.round(r.left) + '..' + Math.round(r.right));
          }
        }
        /* Compare the two canvases with each other. Measuring the stage's
           border-box against a canvas's content width reports a permanent
           2px difference that is the 1px border, not a misalignment. */
        const before = document.getElementById('cmpCanvasBefore');
        const after = document.getElementById('cmpCanvasAfter');
        const scroller = document.querySelector('.cmp-table-scroll');
        return {
          docScroll: de.scrollWidth,
          client: de.clientWidth,
          over: over.slice(0, 3),
          beforeW: before ? before.getBoundingClientRect().width : 0,
          afterW: after ? after.getBoundingClientRect().width : 0,
          beforeH: before ? before.getBoundingClientRect().height : 0,
          afterH: after ? after.getBoundingClientRect().height : 0,
          scrollerFits: scroller ? scroller.getBoundingClientRect().right <= de.clientWidth + 1 : true,
          scrollerScrolls: scroller ? scroller.scrollWidth > scroller.clientWidth : false,
        };
      });

      say(m.docScroll <= m.client + 1,
        `${width}px: no horizontal page scroll (scrollWidth ${m.docScroll} vs ${m.client})`);
      say(m.over.length === 0,
        `${width}px: nothing in the workspace spills past the viewport` +
        (m.over.length ? ` — ${m.over.join('; ')}` : ''));
      /* Both halves of the comparison must render at the same size, or the
         wipe compares two differently-scaled pages and the reader ends up
         judging a scaling artefact instead of the compression. */
      say(Math.abs(m.beforeW - m.afterW) <= 1 && Math.abs(m.beforeH - m.afterH) <= 1,
        `${width}px: comparison layers match (${Math.round(m.beforeW)}x${Math.round(m.beforeH)} ` +
        `vs ${Math.round(m.afterW)}x${Math.round(m.afterH)})`);

      /* The table may be wider than the screen, but its scroller may not. */
      say(m.scrollerFits, `${width}px: the image table's scroller stays inside the viewport`);
    } finally {
      await shot.close();
    }
  }

} finally {
  await browser.close();
  if (server) server.kill();
}

console.log(bad ? `\n${bad} check(s) failed` : '\nall checks passed');
process.exit(bad ? 1 : 0);
