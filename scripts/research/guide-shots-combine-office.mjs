/* The screenshots and measurements in the "combine Word, PowerPoint and PDF"
   guides (/guides/combine-word-powerpoint-and-pdf/ and the Indonesian
   version): real runs of the site's own Word to PDF, PowerPoint to PDF and
   Merge PDF tools, in English and Indonesian. Records sizes, page counts and
   each merged page's size, and saves WebP screenshots of the merge queue.

     node scripts/research/guide-shots-combine-office.mjs <scratch-dir> public/guides/img
*/
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync, copyFileSync, readdirSync, statSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { browserProfile, NO_TRACKING } from '../testing-paths.mjs';

const [SCR, PUB] = process.argv.slice(2);
const ORIGIN = 'http://localhost:4321';
const EXE = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
const b = await puppeteer.launch({ executablePath: EXE, headless: 'new', args: [NO_TRACKING, '--no-sandbox'], userDataDir: browserProfile('shots-office'), protocolTimeout: 180000 });

async function convert(url, input, file, dir) {
  const dl = join(dir, 'dl-' + Math.random().toString(36).slice(2, 7)); mkdirSync(dl, { recursive: true });
  const p = await b.newPage();
  const c = await p.createCDPSession();
  await c.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: dl });
  await p.goto(ORIGIN + url, { waitUntil: 'networkidle2' });
  await (await p.$(input)).uploadFile(file);
  await p.waitForSelector('#btnDownload:not([disabled])', { visible: true, timeout: 120000 });
  await new Promise((x) => setTimeout(x, 1500));
  await p.click('#btnDownload');
  let out = null;
  for (let i = 0; i < 240 && !out; i++) { await new Promise((x) => setTimeout(x, 500)); out = readdirSync(dl).find((f) => f.endsWith('.pdf')); }
  await new Promise((x) => setTimeout(x, 800));
  await p.close();
  return join(dl, out);
}

/* Page sizes straight from the PDF: every /MediaBox, in points. */
/* Page sizes in points, read with pdf.js (object streams hide /MediaBox from a text scan). */
const pdfjs = await import('pdfjs-dist/legacy/build/pdf.js');
async function pageBoxes(pdf) {
  const doc = await pdfjs.getDocument({ data: new Uint8Array(readFileSync(pdf)) }).promise;
  const out = [];
  for (let i = 1; i <= doc.numPages; i++) { const v = (await doc.getPage(i)).getViewport({ scale: 1 }); out.push(`${Math.round(v.width)}x${Math.round(v.height)}`); }
  return out;
}

async function toWebp(png, out) {
  const p = await b.newPage();
  const data = 'data:image/png;base64,' + readFileSync(png).toString('base64');
  const [webp, w, h] = await p.evaluate(async (src) => {
    const img = new Image(); img.src = src; await img.decode();
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    c.getContext('2d').drawImage(img, 0, 0);
    return [c.toDataURL('image/webp', 0.82), img.width, img.height];
  }, data);
  writeFileSync(out, Buffer.from(webp.split(',')[1], 'base64'));
  await p.close();
  return { file: out, kb: Math.round(statSync(out).size / 1024), w, h };
}

const runs = [
  { lang: 'en', word: '/word-to-pdf/', ppt: '/pptx-to-pdf/', merge: '/merge-pdf/', names: ['report.docx', 'slides.pptx', 'signed-form.pdf'], prefix: 'combine-office' },
  { lang: 'id', word: '/id/word-ke-pdf/', ppt: '/id/ppt-ke-pdf/', merge: '/id/gabungkan-pdf/', names: ['laporan.docx', 'presentasi.pptx', 'formulir-ttd.pdf'], prefix: 'gabung-office' },
];
const report = {};
for (const r of runs) {
  const dir = join(SCR, 'office', r.lang); rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
  copyFileSync('testing/fixtures/torture.docx', join(dir, r.names[0]));
  copyFileSync('testing/fixtures/torture.pptx', join(dir, r.names[1]));
  copyFileSync('testing/fixtures/torture.pdf', join(dir, r.names[2]));
  const wordPdf = await convert(r.word, 'input[type=file]', join(dir, r.names[0]), dir);
  const pptPdf = await convert(r.ppt, '#fileInputPptx', join(dir, r.names[1]), dir);

  const dl = join(dir, 'merged'); mkdirSync(dl, { recursive: true });
  const m = await b.newPage();
  await m.setViewport({ width: 600, height: 1000, deviceScaleFactor: 1 });
  const c = await m.createCDPSession();
  await c.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: dl });
  await m.goto(ORIGIN + r.merge, { waitUntil: 'networkidle2' });
  for (const f of [wordPdf, pptPdf, join(dir, r.names[2])]) {
    const before = await m.evaluate(() => document.querySelectorAll('#fileItemsList > *').length);
    await (await m.$('input[type=file]')).uploadFile(f);
    await m.waitForFunction((n) => document.querySelectorAll('#fileItemsList > *').length > n, { timeout: 60000 }, before);
    await new Promise((x) => setTimeout(x, 600));
  }
  await m.evaluate(() => document.querySelectorAll('[data-reveal],[data-reveal-stagger]').forEach((e) => e.classList.add('is-visible')));
  await new Promise((x) => setTimeout(x, 900));
  const order = await m.evaluate(() => [...document.querySelectorAll('#fileItemsList > *')].map((e) => e.textContent.replace(/\s+/g, ' ').trim()));
  const box = await m.evaluate(() => {
    const list = document.getElementById('fileItemsList').getBoundingClientRect();
    return { x: list.left - 8 + window.scrollX, y: list.top - 8 + window.scrollY, w: list.width + 16, h: list.height + 16 };
  });
  await m.screenshot({ path: join(dir, 'queue.png'), clip: { x: box.x, y: box.y, width: box.w, height: box.h }, captureBeyondViewport: true });
  await m.click('#btnMerge');
  let merged = null;
  for (let i = 0; i < 120 && !merged; i++) { await new Promise((x) => setTimeout(x, 500)); merged = readdirSync(dl).find((f) => f.endsWith('.pdf')); }
  await new Promise((x) => setTimeout(x, 800));
  await m.close();
  const mergedPath = join(dl, merged);
  mkdirSync(PUB, { recursive: true });
  report[r.lang] = {
    sources: r.names.map((n) => `${n} ${Math.round(statSync(join(dir, n)).size / 1024)} KB`),
    wordPdf: `${Math.round(statSync(wordPdf).size / 1024)} KB, pages ${(await pageBoxes(wordPdf)).join(' ')}`,
    pptPdf: `${Math.round(statSync(pptPdf).size / 1024)} KB, pages ${(await pageBoxes(pptPdf)).join(' ')}`,
    merged: `${Math.round(statSync(mergedPath).size / 1024)} KB, pages ${(await pageBoxes(mergedPath)).join(' ')}`,
    order,
    shot: await toWebp(join(dir, 'queue.png'), join(PUB, `${r.prefix}-queue.webp`)),
  };
}
console.log(JSON.stringify(report, null, 1));
await b.close();
