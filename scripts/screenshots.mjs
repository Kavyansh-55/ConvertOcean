/**
 * Re-cut the README screenshots from the real site.
 *
 * The four in `docs/screenshots/` were taken on 2026-07-28. The UI was rebuilt
 * on the poster colour-block system on 2026-09-06 (v1.1.0). So for nine weeks
 * the repo — the thing a Show HN reader opens first, and the thing every
 * awesome-list submission points at — advertised a design that no longer
 * existed anywhere on the site.
 *
 * The link-preview card had exactly this problem in July and was fixed by
 * generating it rather than hand-painting it (`scripts/og/build-og.mjs`).
 * Same answer here: a screenshot nobody can regenerate in one command is a
 * screenshot that goes stale the next time the design moves.
 *
 *   node scripts/screenshots.mjs                    # from production
 *   node scripts/screenshots.mjs --local            # from a local preview
 *
 * Captured at 1280x800 with deviceScaleFactor 2, so the files are 2560px wide
 * and stay sharp on the high-DPI displays most people read GitHub on.
 */
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { browserProfile } from './testing-paths.mjs';

const LOCAL = process.argv.includes('--local');
const ORIGIN = LOCAL ? 'http://localhost:4321' : 'https://convertocean.com';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'docs', 'screenshots');

const EDGE_CANDIDATES = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  process.env.CHROME_PATH,
].filter(Boolean);

function browserPath() {
  for (const p of EDGE_CANDIDATES) if (existsSync(p)) return p;
  throw new Error('No Edge/Chrome found. Set CHROME_PATH to a browser executable.');
}

/* The four the README actually references. Keep the names: changing them means
   editing the README too, and a broken image there is worse than a stale one. */
const SHOTS = [
  { file: 'home-light.png', path: '/', theme: 'light' },
  { file: 'home-dark.png', path: '/', theme: 'dark' },
  { file: 'tool-pdf-to-word.png', path: '/pdf-to-word/', theme: 'light' },
  { file: 'sales-tax-by-state.png', path: '/guides/us-sales-tax-by-state/', theme: 'light' },
];

async function ensureServer() {
  if (!LOCAL) return null;
  const server = spawn('npx', ['astro', 'preview', '--port', '4321'], { shell: true, stdio: 'ignore' });
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

mkdirSync(OUT, { recursive: true });
const server = await ensureServer();
const browser = await puppeteer.launch({
  executablePath: browserPath(), headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
  userDataDir: browserProfile('screenshots'),
});

let bad = 0;

try {
  console.log(`\nscreenshots from ${ORIGIN}\n`);

  for (const shot of SHOTS) {
    const page = await browser.newPage();
    try {
      await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
      const res = await page.goto(ORIGIN + shot.path, { waitUntil: 'networkidle2', timeout: 60000 });
      if (!res || res.status() !== 200) {
        throw new Error(`${shot.path} returned ${res ? res.status() : 'nothing'}`);
      }

      /* Set the theme the same way the site does, then let the transition
         finish — catching it mid-fade produces a muddy screenshot. */
      await page.evaluate((t) => {
        document.documentElement.setAttribute('data-theme', t);
        try { localStorage.setItem('theme', t); } catch { /* private mode */ }
      }, shot.theme);
      await new Promise((r) => setTimeout(r, 900));

      /* Fonts must be in before the pixels are. A screenshot taken during the
         swap shows the fallback stack, which is exactly the "it looks nothing
         like the site" problem this script exists to stop. */
      await page.evaluate(() => document.fonts && document.fonts.ready);
      await new Promise((r) => setTimeout(r, 400));

      await page.screenshot({ path: join(OUT, shot.file) });
      console.log(`  OK    ${shot.file.padEnd(26)} ${shot.path} (${shot.theme})`);
    } catch (err) {
      bad++;
      console.log(`  FAIL  ${shot.file.padEnd(26)} ${String(err).slice(0, 80)}`);
    }
    await page.close();
  }
} finally {
  await browser.close();
  if (server) server.kill();
}

console.log(bad
  ? `\n${bad} screenshot(s) failed\n`
  : `\nAll four written to docs/screenshots/. Commit them and the README is current again.\n`);
process.exit(bad ? 1 : 0);
