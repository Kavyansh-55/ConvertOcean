/* The measurement behind the "What It Reached on a Test Document" figures on
   /compress-pdf/, /id/kompres-pdf/ and /pt/comprimir-pdf/ (2026-10-04).

   Draws three A4 pages at 300 DPI made to resemble phone photos of documents
   (paper grain, uneven light, text, a stamp, a photograph), turns them into a
   PDF with the site's own Image to PDF tool, then runs the site's compressor
   at each preset and at Fit a size 1 MB / 500 KB / 200 KB / 100 KB and prints
   what the page reports. Needs the built site on localhost:4321.

     node scripts/research/measure-compress-targets.mjs <output-dir>

   If the compressor changes, re-run this and update those three pages and
   their check in verify-live.mjs. */
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync, writeFileSync, readdirSync, statSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { browserProfile, NO_TRACKING } from '../testing-paths.mjs';

const OUT = process.argv[2];
const ORIGIN = 'http://localhost:4321';
const EXE = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
mkdirSync(OUT, { recursive: true });
const b = await puppeteer.launch({ executablePath: EXE, headless: 'new', args: [NO_TRACKING, '--no-sandbox', '--disable-dev-shm-usage'], userDataDir: browserProfile('measure'), protocolTimeout: 180000 });

/* 1. Three A4 pages at 300 dpi, drawn like phone scans: off-white paper with
      grain, printed text, a stamp, a signature and (page 3) a photograph. */
const gen = await b.newPage();
await gen.goto(ORIGIN + '/id/');
const jpegs = await gen.evaluate(async () => {
  const W = 2480, H = 3508;
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const paper = (ctx) => {
    ctx.fillStyle = '#f3f1ea'; ctx.fillRect(0, 0, W, H);
    const img = ctx.getImageData(0, 0, W, H); const d = img.data;
    for (let i = 0; i < d.length; i += 4) { const n = (rnd() - 0.5) * 18; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
    // uneven lighting, like a phone held over a desk
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x += 1) {
      const k = 1 - 0.10 * ((x / W) * 0.6 + (y / H) * 0.4);
      const i = (y * W + x) * 4; d[i] *= k; d[i + 1] *= k; d[i + 2] *= k;
    }
    ctx.putImageData(img, 0, 0);
  };
  const lines = (ctx, x, y, n, w, size) => {
    ctx.fillStyle = '#1d1d1d';
    for (let i = 0; i < n; i++) {
      ctx.font = `${size}px Georgia, serif`;
      let s = '';
      while (ctx.measureText(s).width < w - 80) s += ['lorem', 'surat', 'keterangan', 'bahwa', 'yang', 'bertanda', 'tangan', 'di', 'bawah', 'ini', 'menerangkan', 'nomor', 'tanggal', 'alamat'][Math.floor(rnd() * 14)] + ' ';
      ctx.fillText(s.trim(), x, y + i * size * 1.6);
    }
  };
  const stamp = (ctx, x, y) => {
    ctx.strokeStyle = 'rgba(40,60,170,0.75)'; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.arc(x, y, 190, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y, 150, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(40,60,170,0.75)'; ctx.font = 'bold 54px Arial'; ctx.textAlign = 'center';
    ctx.fillText('CONTOH', x, y + 18); ctx.textAlign = 'left';
  };
  const sign = (ctx, x, y) => {
    ctx.strokeStyle = '#13235f'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, y);
    for (let i = 0; i < 14; i++) ctx.quadraticCurveTo(x + i * 32 + 20, y - 70 + rnd() * 140, x + (i + 1) * 32, y + (rnd() - 0.5) * 40);
    ctx.stroke();
  };
  const photo = (ctx, x, y, w, h) => {
    const img = ctx.createImageData(w, h); const d = img.data;
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const p = (j * w + i) * 4;
      const sky = j < h * 0.55;
      const base = sky ? [120 + 60 * (j / h), 165 + 40 * (j / h), 220] : [70 + 40 * Math.sin(i / 37), 120 + 30 * Math.cos(j / 23), 60];
      const n = (rnd() - 0.5) * 40;
      d[p] = base[0] + n; d[p + 1] = base[1] + n; d[p + 2] = base[2] + n; d[p + 3] = 255;
    }
    ctx.putImageData(img, x, y);
  };
  const pages = [];
  for (let k = 0; k < 3; k++) {
    const c = document.createElement('canvas'); c.width = W; c.height = H; const ctx = c.getContext('2d');
    paper(ctx);
    ctx.fillStyle = '#111'; ctx.font = 'bold 84px Georgia, serif';
    ctx.fillText(['SURAT KETERANGAN', 'IJAZAH (CONTOH)', 'LAMPIRAN FOTO'][k], 260, 380);
    ctx.fillRect(260, 430, W - 520, 6);
    if (k === 2) { photo(ctx, 260, 560, W - 520, 1700); lines(ctx, 260, 2420, 10, W - 520, 50); }
    else { lines(ctx, 260, 620, 34, W - 520, 50); stamp(ctx, 760, 3000); sign(ctx, 1500, 3020); }
    pages.push(c.toDataURL('image/jpeg', 0.92));
  }
  return pages;
});
const files = jpegs.map((u, i) => { const f = join(OUT, `scan-${i + 1}.jpg`); writeFileSync(f, Buffer.from(u.split(',')[1], 'base64')); return f; });
console.log('jpegs', files.map((f) => Math.round(statSync(f).size / 1024) + ' KB').join(', '));
await gen.close();

/* 2. Our Image to PDF tool. */
const prior = join(OUT, 'dl', 'images-to-pdf.pdf');
const dl = join(OUT, 'dl'); rmSync(dl, { recursive: true, force: true }); mkdirSync(dl, { recursive: true });
const p1 = await b.newPage();
const cdp1 = await p1.createCDPSession();
await cdp1.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: dl });
await p1.goto(ORIGIN + '/id/gambar-ke-pdf/', { waitUntil: 'networkidle2' });
const inp = await p1.$('input[type=file]');
await inp.uploadFile(...files);
await new Promise((r) => setTimeout(r, 2500));
await p1.click('#btnDownload');
let pdf = null;
for (let i = 0; i < 120 && !pdf; i++) { await new Promise((r) => setTimeout(r, 500)); pdf = readdirSync(dl).find((f) => f.endsWith('.pdf')); }
const pdfPath = join(dl, pdf);
await new Promise((r) => setTimeout(r, 800));
console.log('pdf', pdf, Math.round(statSync(pdfPath).size / 1024), 'KB');
await p1.close();

/* 3. Our compressor: presets, then each target. */
const p = await b.newPage();
p.on('error', (e) => console.log('PAGE CRASH', String(e)));
p.on('pageerror', (e) => console.log('PAGE JS ERROR', String(e).slice(0, 200)));
p.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE', m.text().slice(0, 200)); });
await p.setViewport({ width: 1280, height: 1000 });
await p.goto(ORIGIN + '/id/kompres-pdf/', { waitUntil: 'networkidle2' });
await (await p.$('input[type=file]')).uploadFile(pdfPath);
await p.waitForSelector('#cmpDownload:not([disabled])', { timeout: 180000 });
await p.waitForSelector('#cmpStage[data-ready="1"]', { timeout: 120000 }).catch(() => {});
const read = () => p.evaluate(() => ({
  after: (document.getElementById('cmpAfter') || {}).textContent?.trim(),
  saving: (document.getElementById('cmpSaving') || {}).textContent?.trim(),
  note: (document.getElementById('cmpTargetNote') || {}).textContent?.trim(),
}));
const results = [];
for (const key of ['light', 'balanced', 'strong']) {
  const before = (await read()).after;
  await p.evaluate((k) => [...document.querySelectorAll('#cmpPresetRow button')].find((x) => x.dataset.preset === k).click(), key);
  await p.waitForFunction((a) => (document.getElementById('cmpAfter') || {}).textContent?.trim() !== a, { timeout: 180000 }, before).catch(() => {});
  await p.waitForSelector('#cmpDownload:not([disabled])', { timeout: 180000 });
  await new Promise((r) => setTimeout(r, 1500));
  results.push({ setting: key, ...(await read()) }); console.log('step', JSON.stringify(results.at(-1)));
}
await p.evaluate(() => [...document.querySelectorAll('#cmpPresetRow button')].find((x) => x.dataset.preset === 'target').click());
for (const kb of [1024, 500, 200, 100]) {
  const noteBefore = (await read()).note;
  await p.evaluate((v) => { const el = document.getElementById('cmpTargetKB'); el.value = String(v); el.dispatchEvent(new Event('input', { bubbles: true })); }, kb);
  await p.click('#cmpFit');
  await p.waitForFunction((n) => (document.getElementById('cmpTargetNote') || {}).textContent?.trim() !== n, { timeout: 240000 }, noteBefore).catch(() => {});
  await p.waitForSelector('#cmpDownload:not([disabled])', { timeout: 240000 });
  await new Promise((r) => setTimeout(r, 2000));
  const r = await read();
  results.push({ setting: `target ${kb} KB`, ...r }); console.log('step', JSON.stringify(results.at(-1)));
  // the before/after comparison at this setting
  const stage = await p.$('#cmpStage');
  if (stage) { await stage.scrollIntoView(); await new Promise((x) => setTimeout(x, 1200)); await stage.screenshot({ path: join(OUT, `compare-${kb}.png`) }); }
}
console.log(JSON.stringify(results, null, 1));
writeFileSync(join(OUT, 'results.json'), JSON.stringify({ pdfKB: Math.round(statSync(pdfPath).size / 1024), results }, null, 1));
await b.close();
