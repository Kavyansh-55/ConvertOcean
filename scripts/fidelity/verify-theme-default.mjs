/**
 * Does a first visit follow the reader's system colour scheme?
 *
 * Until 2026-10-02 the site always opened light and saved 'light' on every
 * visit, so a reader in dark mode met a bright page and lime hero inside a dark
 * browser bar — reported on Reddit as "a flash to the eyes when coming from
 * dark mode". The fix follows prefers-color-scheme unless the toggle was
 * pressed. This drives the real page with the scheme emulated, in a fresh
 * storage context per case, including visitors carrying the old auto-saved
 * value. Against the pre-fix production build it fails 4 of 5 (the control).
 *
 *   npm run theme-default                              (local preview on 4321)
 *   CO_ORIGIN=https://convertocean.com npm run theme-default
 */
import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';
import { browserProfile } from '../testing-paths.mjs';
const exe = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe','C:/Program Files/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
const O = process.env.CO_ORIGIN || 'http://localhost:4321';
const b = await puppeteer.launch({ executablePath: exe, headless: 'new', userDataDir: browserProfile('theme-default') });
let bad = 0; const say = (ok, m) => { if (!ok) bad++; console.log((ok ? 'OK   ' : 'FAIL ') + m); };
async function visit(scheme, seed) {
  const ctx = await b.createBrowserContext();   // fresh storage per case
  const p = await ctx.newPage();
  await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: scheme }]);
  await p.goto(O + '/', { waitUntil: 'domcontentloaded' });
  if (seed) { await p.evaluate((s) => { localStorage.clear(); for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); }, seed); await p.reload({ waitUntil: 'networkidle2' }); }
  else await p.evaluate(() => localStorage.clear()), await p.reload({ waitUntil: 'networkidle2' });
  const st = await p.evaluate(() => ({ theme: document.documentElement.dataset.theme, stored: localStorage.getItem('theme'), set: localStorage.getItem('theme-set') }));
  return { ctx, p, st };
}
let r;
r = await visit('dark');  say(r.st.theme === 'dark' && r.st.stored === null, `new visitor, system dark  -> ${r.st.theme} (stored ${r.st.stored})`); await r.ctx.close();
r = await visit('light'); say(r.st.theme === 'light' && r.st.stored === null, `new visitor, system light -> ${r.st.theme} (stored ${r.st.stored})`); await r.ctx.close();
r = await visit('dark', { theme: 'light' }); say(r.st.theme === 'dark', `old auto-saved "light", system dark -> ${r.st.theme}`); await r.ctx.close();
r = await visit('light', { theme: 'dark' }); say(r.st.theme === 'dark', `old saved "dark" (only the toggle wrote it), system light -> ${r.st.theme}`); await r.ctx.close();
r = await visit('dark');
await r.p.click('#themeToggle'); await new Promise(x => setTimeout(x, 300));
await r.p.reload({ waitUntil: 'networkidle2' });
const after = await r.p.evaluate(() => ({ theme: document.documentElement.dataset.theme, stored: localStorage.getItem('theme'), set: localStorage.getItem('theme-set') }));
say(after.theme === 'light' && after.set === '1', `system dark, toggled to light, reloaded -> ${after.theme} (theme-set ${after.set})`);
await r.ctx.close();
await b.close();
console.log(bad ? `${bad} failed` : 'all theme checks passed'); process.exit(bad ? 1 : 0);
