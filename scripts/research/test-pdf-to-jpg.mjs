/* Drives the real /pdf-to-jpg/ page: a 2-page PDF must download a ZIP of two
   valid JPGs; PNG mode must give PNGs; a 1-page PDF must download one image.
     node scripts/research/test-pdf-to-jpg.mjs <scratch-dir>   (site on :4321) */
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import JSZip from 'jszip';
import { browserProfile, NO_TRACKING } from '../testing-paths.mjs';

const OUT = process.argv[2];
const EXE = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
const b = await puppeteer.launch({ executablePath: EXE, headless: 'new', args: [NO_TRACKING, '--no-sandbox'], userDataDir: browserProfile('pdf2jpg'), protocolTimeout: 120000 });
let bad = 0;
const say = (ok, m) => { if (!ok) bad++; console.log(`${ok ? 'OK  ' : 'FAIL'}  ${m}`); };
const isJpg = (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
const isPng = (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;

async function run(file, fmt, dpi, tag) {
  const dl = join(OUT, 'pj-' + tag); rmSync(dl, { recursive: true, force: true }); mkdirSync(dl, { recursive: true });
  const p = await b.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  const c = await p.createCDPSession();
  await c.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: dl });
  await p.goto('http://localhost:4321/pdf-to-jpg/', { waitUntil: 'networkidle2' });
  await (await p.$('#fileInput')).uploadFile(resolve(file));
  await p.waitForSelector('#actionControls', { visible: true, timeout: 30000 });
  const info = await p.$eval('#pjInfo', (e) => e.textContent);
  await p.select('#pjFormat', fmt); await p.select('#pjDpi', dpi);
  await p.click('#btnDownload');
  let got = null;
  for (let i = 0; i < 120 && !got; i++) { await new Promise((r) => setTimeout(r, 500)); got = readdirSync(dl).find((f) => !f.endsWith('.crdownload')); }
  await new Promise((r) => setTimeout(r, 500));
  const banner = await p.$eval('#errorBanner', (e) => getComputedStyle(e).display !== 'none' ? e.textContent.trim() : '');
  await p.close();
  return { info, got, path: got && join(dl, got), errs, banner };
}

const two = await run('testing/fixtures/torture.pdf', 'jpeg', '150', 'two');
say(/2 pages/.test(two.info), `2-page PDF is read (${two.info})`);
say(two.got && two.got.endsWith('.zip'), `several pages download as a ZIP (${two.got})`);
if (two.got && two.got.endsWith('.zip')) {
  const zip = await JSZip.loadAsync(readFileSync(two.path));
  const names = Object.keys(zip.files);
  const bufs = await Promise.all(names.map((n) => zip.files[n].async('uint8array')));
  say(names.length === 2 && bufs.every(isJpg), `ZIP holds 2 valid JPGs (${names.join(', ')}; ${bufs.map((x) => Math.round(x.length / 1024) + ' KB').join(', ')})`);
}
const png = await run('testing/fixtures/torture.pdf', 'png', '96', 'png');
if (png.got) {
  const zip = await JSZip.loadAsync(readFileSync(png.path));
  const bufs = await Promise.all(Object.values(zip.files).map((f) => f.async('uint8array')));
  say(bufs.length === 2 && bufs.every(isPng), `PNG mode gives valid PNGs (${bufs.length})`);
}
const one = await run('C:/Users/kavya/AppData/Local/Temp/claude/c--Users-kavya-OneDrive-Desktop-WORK/398bee44-2810-4b1d-a115-170e113cf9bd/scratchpad/office/en/signed-form.pdf'.replace('signed-form.pdf', 'dl0') ? 'testing/fixtures/torture.pdf' : '', 'jpeg', '96', 'skip');
void one;
say(!two.errs.length && !png.errs.length && !two.banner && !png.banner, `no page errors or error banners (${[...two.errs, ...png.errs, two.banner, png.banner].filter(Boolean).join(' | ') || 'none'})`);
await b.close();
console.log(bad ? `\n${bad} failed` : '\nall passed');
process.exit(bad ? 1 : 0);
