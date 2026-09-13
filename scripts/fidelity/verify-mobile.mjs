/**
 * Is the site usable on a phone?
 *
 * Mobile was never tested on any tool until 2026-09-11. The first audit found
 * ten form fields under 16px — which makes iOS Safari zoom the page on focus
 * and never zoom back, stranding the reader on a magnified, sideways-scrolling
 * form — plus four families of control too small to hit with a thumb. None of
 * it is visible on a desktop browser, which is why it survived.
 *
 * Tested across the band rather than at one width: 390 and 1440 alone hide the
 * bugs that live at 320 (smallest real phone), 360 (the most common Android)
 * and right at the 768 boundary.
 *
 *   node scripts/fidelity/verify-mobile.mjs
 *   CO_ORIGIN=https://convertocean.com node scripts/fidelity/verify-mobile.mjs
 *
 * Two false positives are excluded deliberately, having been checked by hand:
 *
 *  - **Inline links inside a sentence.** They are 18px tall because that is
 *    what a line of text is, and WCAG 2.5.5 exempts them. An earlier version
 *    of this file counted 85 of them and buried the four real findings.
 *  - **The invoice and receipt document previews.** Their 10px type is a mock
 *    of a printed page and those sizes carry into the exported PDF. Enlarging
 *    them for the screen would change the document.
 *
 * One blind spot, now partly closed. Most tools show a drop zone and nothing
 * else until a file arrives, so loading the page measures the *empty* state and
 * never the controls the reader actually works with. `/split-pdf/` passed four
 * widths for months while its whole workspace sat behind `display: none`.
 * `REVEAL` names the pages worth opening first and the fixture that opens them;
 * every other tool in the family has the same gap and the same remedy.
 */
import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'testing', 'fixtures');

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

const WIDTHS = [320, 360, 390, 768];

/* Pages whose real UI only exists once a file has been added, and the fixture
   that brings it out. Adding one costs four page loads and a file each. */
const REVEAL = {
  '/split-pdf/': { file: 'torture.pdf', wait: '#splitWorkspace' },
};
const PAGES = [
  '/', '/excel-to-pdf/', '/pdf-to-word/', '/merge-pdf/', '/word-to-pdf/',
  '/invoice-generator/', '/sales-tax-calculator/', '/json-formatter/',
  '/split-pdf/', '/compress-pdf/', '/image-to-text/', '/file-converter/',
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
  console.log(`\nmobile: ${ORIGIN}\n`);

  for (const path of PAGES) {
    const problems = [];

    for (const width of WIDTHS) {
      const page = await browser.newPage();
      /* 768 counts as touch: that is an iPad in portrait, not a small desktop
         window, and the floors have to hold at the boundary rather than one
         pixel below it. */
      await page.setViewport({ width, height: 844, deviceScaleFactor: 1,
        isMobile: width <= 768, hasTouch: width <= 768 });
      try {
        await page.goto(ORIGIN + path, { waitUntil: 'networkidle2', timeout: 45000 });
        await new Promise((r) => setTimeout(r, 700));

        const reveal = REVEAL[path];
        if (reveal) {
          const fixture = join(FIXTURES, reveal.file);
          if (!existsSync(fixture)) {
            throw new Error(`fixture missing: ${reveal.file} (run npm run fidelity:fixtures)`);
          }
          const input = await page.$('input[type=file]');
          if (!input) throw new Error('no file input to reveal the workspace with');
          await input.uploadFile(fixture);
          await page.waitForSelector(reveal.wait, { visible: true, timeout: 45000 });
          /* Thumbnails render asynchronously and change the layout as they
             land; measuring before they settle measures a page nobody sees. */
          await new Promise((r) => setTimeout(r, 1500));
        }

        const found = await page.evaluate((vw) => {
          const out = { overflow: null, zoomers: [], smallTaps: [], tinyText: [], flush: [] };

          if (document.documentElement.scrollWidth > vw + 1) {
            out.overflow = document.documentElement.scrollWidth;
          }

          const name = (el) => {
            const cls = (typeof el.className === 'string' && el.className.trim())
              ? '.' + el.className.trim().split(/\s+/)[0] : '';
            return el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + cls;
          };

          /* iOS zooms a focused field whose text is under 16px. */
          for (const el of document.querySelectorAll(
            'input:not([type=file]):not([type=checkbox]):not([type=radio]), select, textarea')) {
            const size = parseFloat(getComputedStyle(el).fontSize);
            if (size && size < 16) out.zoomers.push(name(el) + '@' + size + 'px');
          }

          /* Standalone controls only. An <a> counts when it is laid out as a
             block — a card, a nav item, a button — not when it sits in a
             sentence. */
          const controls = [...document.querySelectorAll(
            'button, [role=button], select, input[type=file], a')];
          for (const el of controls) {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) continue;
            const cs = getComputedStyle(el);
            if (cs.visibility === 'hidden') continue;
            /* Prose links are exempt (WCAG 2.5.5 says so): they are the
               height of a line of text because that is what they are. Two
               shapes count as prose — `display: inline`, and any anchor
               inside a <p>, which catches the hero's "Open source, MIT
               licensed" link that uses inline-flex only to align its icon.
               Checked before allowing it: no button, [role=button] or
               a.button anywhere on the site sits inside a <p>, so this
               cannot quietly excuse a real control. */
            if (el.tagName === 'A' && (cs.display === 'inline' || el.closest('p'))) continue;
            if (r.height < 44 || r.width < 24) {
              out.smallTaps.push(name(el) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
            }
          }

          /* Document previews are excluded — their type belongs to the PDF. */
          const inPreview = (el) => !!el.closest('.a4-wrapper, .invoice-preview, .receipt-preview');
          for (const el of document.querySelectorAll('p, li, label, span, div, td, th')) {
            if (el.children.length) continue;
            if ((el.textContent || '').trim().length < 12) continue;
            if (inPreview(el)) continue;
            /* Text nobody can see is not a readability problem. The nav
               dropdown descriptions are 11px and sit in a collapsed menu on a
               phone — zero-sized, and flagging them buried the real findings. */
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) continue;
            const cs = getComputedStyle(el);
            const size = parseFloat(cs.fontSize);
            if (!size) continue;
            /* An uppercase, letter-spaced eyebrow label ("QUICK ANSWER",
               "RAW JSON INPUT") is a different thing from body copy and reads
               fine a notch smaller — caps have no descenders and the tracking
               opens them up. Holding those to the 12px body figure would have
               meant inflating every label on the site to satisfy a rule that
               was never about them. They still get a floor, one step down. */
            const isEyebrow = cs.textTransform === 'uppercase'
                           && parseFloat(cs.letterSpacing) > 0;
            const floor = isEyebrow ? 11 : 12;
            if (size < floor) out.tinyText.push(name(el) + '@' + size + 'px');

            /* Text hard against the edge of the screen.
               The footer shipped like this for months: `.footer-content` was
               the one 1200px container on the site with no horizontal
               padding, so above 1200px the auto margins hid it and on a phone
               every link and the logo sat at x=0, looking clipped. Nothing
               overflowed, the text was big enough and the targets were large
               enough, so every other check here passed it — a reader spotted
               it by eye. A full-bleed *background* is fine; text is not. */
            if (r.left < 8 || r.right > vw - 8) {
              /* Unless it lives in a horizontal scroller, where reaching the
                 edge is the point — the homepage comparison table is wider
                 than a phone on purpose and sits in `.table-wrapper` with
                 `overflow-x: auto`, which is the correct way to handle a wide
                 table. Checked before allowing it: the document itself never
                 scrolls sideways on any page, so this cannot excuse real
                 overflow. */
              let inScroller = false;
              for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
                const ox = getComputedStyle(a).overflowX;
                if (ox === 'auto' || ox === 'scroll') { inScroller = true; break; }
              }
              if (!inScroller) out.flush.push(name(el) + ' at x=' + Math.round(r.left));
            }
          }
          return out;
        }, width);

        if (found.overflow) problems.push(`${width}: scrolls sideways (${found.overflow}px)`);
        if (found.zoomers.length) problems.push(`${width}: ${found.zoomers.length} iOS-zoom field(s) — ${found.zoomers[0]}`);
        if (found.smallTaps.length) problems.push(`${width}: ${found.smallTaps.length} small control(s) — ${found.smallTaps[0]}`);
        if (found.tinyText.length) problems.push(`${width}: ${found.tinyText.length} sub-12px text — ${found.tinyText[0]}`);
        if (found.flush.length) problems.push(`${width}: ${found.flush.length} text flush to the edge — ${found.flush[0]}`);
      } catch (e) {
        problems.push(`${width}: ${String(e).slice(0, 60)}`);
      }
      await page.close();
    }

    const state = REVEAL[path] ? ' (with a file loaded)' : '';
    say(problems.length === 0,
        `${path.padEnd(24)} ${problems.length ? problems[0] : 'clean at 320/360/390/768' + state}`);
    for (const p of problems.slice(1)) console.log(`        ${p}`);
  }
} finally {
  await browser.close();
  if (server) server.kill();
}

console.log(bad ? `\n${bad} page(s) with mobile problems` : '\nall mobile checks passed');
process.exit(bad ? 1 : 0);
