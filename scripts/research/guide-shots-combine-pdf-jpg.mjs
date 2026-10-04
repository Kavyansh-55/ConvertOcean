/* The screenshots and file sizes in the "combine PDF and JPG" guides
   (/guides/combine-pdf-and-jpg/, /id/panduan/gabungkan-pdf-dan-jpg/), from
   real runs of the site's own tools: a one-page letter made with TXT to PDF,
   two page images made by measure-compress-targets.mjs, Image to PDF, then
   Merge PDF. Writes WebP screenshots into the given public directory.

     node scripts/research/guide-shots-combine-pdf-jpg.mjs <scratch-dir> public/guides/img
*/
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync, copyFileSync, readdirSync, statSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { browserProfile, NO_TRACKING } from '../testing-paths.mjs';

const [SCR, PUB] = process.argv.slice(2);
const ORIGIN = 'http://localhost:4321';
const EXE = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
const MEAS = join(SCR, 'measure');
const b = await puppeteer.launch({ executablePath: EXE, headless: 'new', args: [NO_TRACKING, '--no-sandbox'], userDataDir: browserProfile('shots2'), protocolTimeout: 180000 });

async function toWebp(png, out) {
  const p = await b.newPage();
  const data = 'data:image/png;base64,' + (await import('node:fs')).readFileSync(png).toString('base64');
  const webp = await p.evaluate(async (src) => {
    const img = new Image(); img.src = src; await img.decode();
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    c.getContext('2d').drawImage(img, 0, 0);
    return c.toDataURL('image/webp', 0.82);
  }, data);
  writeFileSync(out, Buffer.from(webp.split(',')[1], 'base64'));
  await p.close();
  const dims = await (async () => { const q = await b.newPage(); await q.goto('about:blank'); const d = await q.evaluate(async (s) => { const i = new Image(); i.src = s; await i.decode(); return [i.width, i.height]; }, webp); await q.close(); return d; })();
  return { file: out, kb: Math.round(statSync(out).size / 1024), w: dims[0], h: dims[1] };
}

const runs = [
  { lang: 'en', txt: '/txt-to-pdf/', letter: `Dear Hiring Team,

Please find attached my certificate and a supporting photo for the application.

Kind regards,
A. Sample`, img: '/image-to-pdf/', merge: '/merge-pdf/', pdfName: 'cover-letter.pdf', photos: ['certificate.jpg', 'photo-attachment.jpg'], prefix: 'combine-pdf-jpg' },
  { lang: 'id', txt: '/id/txt-ke-pdf/', letter: `Yth. Bagian Personalia,

Bersama surat ini saya lampirkan ijazah dan foto pendukung untuk lamaran.

Hormat saya,
A. Contoh`, img: '/id/gambar-ke-pdf/', merge: '/id/gabungkan-pdf/', pdfName: 'surat-lamaran.pdf', photos: ['ijazah.jpg', 'lampiran-foto.jpg'], prefix: 'gabung-pdf-foto' },
];
const report = {};
for (const r of runs) {
  const dir = join(SCR, 'shots2', r.lang); rmSync(dir, { recursive: true, force: true }); mkdirSync(join(dir, 'dl'), { recursive: true });
  copyFileSync(join(MEAS, 'scan-2.jpg'), join(dir, r.photos[0]));
  copyFileSync(join(MEAS, 'scan-3.jpg'), join(dir, r.photos[1]));
  // The document: a one-page letter, made with our own TXT to PDF tool.
  {
    const txt = join(dir, r.pdfName.replace(/\.pdf$/, '.txt'));
    writeFileSync(txt, r.letter);
    const dl0 = join(dir, 'dl0'); mkdirSync(dl0, { recursive: true });
    const t = await b.newPage();
    const c0 = await t.createCDPSession();
    await c0.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: dl0 });
    await t.goto(ORIGIN + r.txt, { waitUntil: 'networkidle2' });
    await (await t.$('input[type=file]')).uploadFile(txt);
    await t.waitForSelector('#actionControls', { visible: true });
    await new Promise((x) => setTimeout(x, 800));
    await t.click('#btnDownload');
    let out = null;
    for (let i = 0; i < 60 && !out; i++) { await new Promise((x) => setTimeout(x, 500)); out = readdirSync(dl0).find((f) => f.endsWith('.pdf')); }
    await new Promise((x) => setTimeout(x, 600));
    copyFileSync(join(dl0, out), join(dir, r.pdfName));
    await t.close();
  }

  // Step 1: photos -> PDF
  const p = await b.newPage();
  await p.setViewport({ width: 600, height: 1000, deviceScaleFactor: 1 });
  const cdp = await p.createCDPSession();
  await cdp.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: join(dir, 'dl') });
  await p.goto(ORIGIN + r.img, { waitUntil: 'networkidle2' });
  await (await p.$('input[type=file]')).uploadFile(...r.photos.map((f) => join(dir, f)));
  await p.waitForSelector('#actionControls', { visible: true });
  await new Promise((x) => setTimeout(x, 1500));
  await p.evaluate(() => document.querySelectorAll('[data-reveal],[data-reveal-stagger]').forEach((e) => e.classList.add('is-visible')));
  await new Promise((x) => setTimeout(x, 800));
  const box1 = await p.evaluate(() => {
    const a = document.getElementById('imageList').getBoundingClientRect();
    const c = document.getElementById('actionControls').getBoundingClientRect();
    return { x: Math.min(a.left, c.left) - 12 + window.scrollX, y: a.top - 12 + window.scrollY, w: Math.max(a.width, c.width) + 24, h: c.bottom - a.top + 24 };
  });
  await p.screenshot({ path: join(dir, 'step1.png'), clip: { x: box1.x, y: box1.y, width: box1.w, height: box1.h }, captureBeyondViewport: true });
  await p.click('#btnDownload');
  let made = null;
  for (let i = 0; i < 120 && !made; i++) { await new Promise((x) => setTimeout(x, 500)); made = readdirSync(join(dir, 'dl')).find((f) => f.endsWith('.pdf')); }
  await new Promise((x) => setTimeout(x, 800));
  const photosPdf = join(dir, 'dl', made);
  await p.close();

  // Step 2: merge the document PDF and the photos PDF
  const dl2 = join(dir, 'dl2'); mkdirSync(dl2, { recursive: true });
  const m = await b.newPage();
  await m.setViewport({ width: 1100, height: 1000, deviceScaleFactor: 1 });
  const cdp2 = await m.createCDPSession();
  await cdp2.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: dl2 });
  await m.goto(ORIGIN + r.merge, { waitUntil: 'networkidle2' });
  await (await m.$('input[type=file]')).uploadFile(join(dir, r.pdfName));
  await new Promise((x) => setTimeout(x, 1200));
  await (await m.$('input[type=file]')).uploadFile(photosPdf);
  await m.waitForFunction(() => document.querySelectorAll('#fileItemsList > *').length >= 2, { timeout: 30000 });
  await new Promise((x) => setTimeout(x, 1200));
  await m.evaluate(() => document.querySelectorAll('[data-reveal],[data-reveal-stagger]').forEach((e) => e.classList.add('is-visible')));
  await new Promise((x) => setTimeout(x, 800));
  const order = await m.evaluate(() => [...document.querySelectorAll('#fileItemsList > *')].map((e) => e.textContent.replace(/\s+/g, ' ').trim().slice(0, 60)));
  const box2 = await m.evaluate(() => {
    const a = document.getElementById('fileItemsList').closest('.panel-card').getBoundingClientRect();
    const c = document.getElementById('btnMerge').closest('.panel-card').getBoundingClientRect();
    return { x: a.left - 12 + window.scrollX, y: a.top - 12 + window.scrollY, w: a.width + 24, h: c.bottom - a.top + 24 };
  });
  await m.screenshot({ path: join(dir, 'step2.png'), clip: { x: box2.x, y: box2.y, width: box2.w, height: box2.h }, captureBeyondViewport: true });
  await m.click('#btnMerge');
  let merged = null;
  for (let i = 0; i < 120 && !merged; i++) { await new Promise((x) => setTimeout(x, 500)); merged = readdirSync(dl2).find((f) => f.endsWith('.pdf')); }
  await new Promise((x) => setTimeout(x, 800));
  await m.close();

  mkdirSync(PUB, { recursive: true });
  report[r.lang] = {
    photos: r.photos.map((f) => Math.round(statSync(join(dir, f)).size / 1024) + ' KB'),
    doc: Math.round(statSync(join(dir, r.pdfName)).size / 1024) + ' KB',
    photosPdf: made + ' ' + Math.round(statSync(photosPdf).size / 1024) + ' KB',
    merged: merged + ' ' + Math.round(statSync(join(dl2, merged)).size / 1024) + ' KB',
    order,
    step1: await toWebp(join(dir, 'step1.png'), join(PUB, `${r.prefix}-1.webp`)),
    step2: await toWebp(join(dir, 'step2.png'), join(PUB, `${r.prefix}-2.webp`)),
  };
}
console.log(JSON.stringify(report, null, 1));
await b.close();
