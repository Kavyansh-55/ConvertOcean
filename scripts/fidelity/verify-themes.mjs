/**
 * Is anything invisible in one theme?
 *
 * "More" vanished from the nav on the three pages it marks as current. It was
 * still there and still clickable — its label was rendered in the active text
 * colour with no pill behind it, and that colour happens to be exactly the
 * dark-mode nav bar's own background. Light mode hid the bug completely, since
 * the same dark navy on a white bar reads fine.
 *
 * A reader found it. Nothing could have caught it, because every check here
 * asked whether an element *existed* and none asked whether it could be *seen*.
 *
 * So this measures contrast for the things a reader navigates by, in both
 * themes, on the page types where states differ. The threshold is WCAG AA for
 * normal text (4.5:1); anything at or below 1.5:1 is reported separately as
 * effectively invisible, because that is the failure that actually happened
 * and it deserves its own sentence.
 *
 *   node scripts/fidelity/verify-themes.mjs
 *   CO_ORIGIN=https://convertocean.com node scripts/fidelity/verify-themes.mjs
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

/* Page types chosen because each puts a different nav item into its active
   state — including the three that made "More" current, which is where the
   bug lived. */
const PAGES = [
  '/',                    // Home active
  '/file-converter/',     // File Converter active
  '/developer-tools/',    // More active  <- the bug
  '/document-tools/',     // More active
  '/business-tools/',     // More active
  '/excel-to-pdf/',       // a tool page
];

const THEMES = ['light', 'dark'];

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
  console.log(`\nthemes: ${ORIGIN}\n`);
  console.log('  can every nav item actually be seen, in both themes?\n');

  for (const path of PAGES) {
    for (const theme of THEMES) {
      const page = await browser.newPage();
      try {
        /* The desktop nav is what carries the active states being measured;
           at the default 800x600 it is collapsed behind the hamburger and
           every .nav-link has zero size, so the first run of this file found
           nothing at all and reported it as a crash rather than as "nothing
           to measure". */
        await page.setViewport({ width: 1440, height: 900 });
        await page.goto(ORIGIN + path, { waitUntil: 'networkidle2', timeout: 45000 });
        await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
        await new Promise((r) => setTimeout(r, 400));

        const findings = await page.evaluate(() => {
          const rgb = (c) => (String(c).match(/\d+(\.\d+)?/g) || [0, 0, 0]).slice(0, 3).map(Number);
          const transparent = (c) => /rgba\(\s*0,\s*0,\s*0,\s*0\s*\)|transparent/.test(String(c));

          /* sRGB relative luminance, per WCAG. */
          const lum = (c) => {
            const [r, g, b] = rgb(c).map((v) => {
              const s = v / 255;
              return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
          };
          const contrast = (fg, bg) => {
            const a = lum(fg) + 0.05;
            const b = lum(bg) + 0.05;
            return Math.max(a, b) / Math.min(a, b);
          };

          /* The colour actually behind an element: walk up until something is
             not transparent. A transparent "background" is the whole reason
             the bug was invisible to a naive check. */
          const behind = (el) => {
            for (let a = el; a && a !== document.documentElement; a = a.parentElement) {
              const bg = getComputedStyle(a).backgroundColor;
              if (!transparent(bg)) return bg;
            }
            return getComputedStyle(document.body).backgroundColor;
          };

          const out = [];
          for (const el of document.querySelectorAll('.nav-link, .nav-more-btn')) {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) continue;
            const cs = getComputedStyle(el);
            if (cs.visibility === 'hidden' || cs.opacity === '0') continue;
            const label = (el.textContent || '').trim().slice(0, 18) || el.id || 'nav item';
            out.push({
              label,
              active: el.classList.contains('active'),
              ratio: +contrast(cs.color, behind(el)).toFixed(2),
            });
          }
          return out;
        });

        const invisible = findings.filter((f) => f.ratio <= 1.5);
        const low = findings.filter((f) => f.ratio > 1.5 && f.ratio < 4.5);

        if (!findings.length) {
          /* Measuring nothing is not the same as measuring nothing wrong. */
          say(false, `${path.padEnd(18)} ${theme.padEnd(5)} no nav items found to measure`);
        } else if (invisible.length) {
          say(false, `${path.padEnd(18)} ${theme.padEnd(5)} INVISIBLE: `
            + invisible.map((f) => `"${f.label}" ${f.ratio}:1`).join(', '));
        } else if (low.length) {
          say(false, `${path.padEnd(18)} ${theme.padEnd(5)} below AA: `
            + low.map((f) => `"${f.label}" ${f.ratio}:1`).join(', '));
        } else {
          const worst = findings.reduce((m, f) => (f.ratio < m.ratio ? f : m), findings[0]);
          say(true, `${path.padEnd(18)} ${theme.padEnd(5)} ${findings.length} nav items readable `
            + `(worst "${worst.label}" ${worst.ratio}:1)`);
        }
      } catch (e) {
        say(false, `${path} ${theme}: ${String(e).slice(0, 60)}`);
      }
      await page.close();
    }
  }
} finally {
  await browser.close();
  if (server) server.kill();
}

console.log(bad ? `\n${bad} theme check(s) failed` : '\nevery nav item is readable in both themes');
process.exit(bad ? 1 : 0);
