/* Drives /receipt-generator/: each template changes the preview, the accent
   colour reaches the header, a logo appears, and the PDF still downloads.
   Saves a screenshot per template.  node scripts/research/test-invoice-templates.mjs <out>  */
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { browserProfile, NO_TRACKING } from '../testing-paths.mjs';

const OUT = process.argv[2];
const PATH = (process.env.RCPT_PATH || '/receipt-generator/').replace(/^.*\/Git(?=\/)/, '');
const EXE = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
const b = await puppeteer.launch({ executablePath: EXE, headless: 'new', args: [NO_TRACKING, '--no-sandbox'], userDataDir: browserProfile('rcpt-tpl'), protocolTimeout: 120000 });
let bad = 0;
const say = (ok, m) => { if (!ok) bad++; console.log(`${ok ? 'OK  ' : 'FAIL'}  ${m}`); };
const p = await b.newPage();
const errs = [];
p.on('pageerror', (e) => errs.push(String(e)));
await p.setViewport({ width: 1400, height: 1100 });
const dl = join(OUT, 'rcpt-dl'); rmSync(dl, { recursive: true, force: true }); mkdirSync(dl, { recursive: true });
const c = await p.createCDPSession();
await c.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: dl });
await p.goto('http://localhost:4321' + PATH, { waitUntil: 'networkidle2' });
await p.evaluate(() => document.querySelectorAll('[data-reveal],[data-reveal-stagger]').forEach((e) => e.classList.add('is-visible')));
const look = () => p.evaluate(() => {
  const h = document.querySelector('.receipt-pdf-header');
  const th = document.querySelector('.receipt-pdf-table th');
  return { cls: document.getElementById('receiptPdfContainer').className, headerBg: getComputedStyle(h).backgroundColor, headerLine: getComputedStyle(h).borderBottomColor, thBg: getComputedStyle(th).backgroundColor, logo: !document.getElementById('rcptPdfLogo').hidden };
});
const shot = async (name) => { const el = await p.$('#receiptPdfContainer'); await el.screenshot({ path: join(OUT, `rcpt-${name}.png`) }); };

const classic = await look();
say(/rgb\(23, 23, 23\)/.test(classic.headerLine) && classic.headerBg === 'rgba(0, 0, 0, 0)', `Classic: charcoal rule, no band (${classic.headerLine})`);
await shot('classic');
await p.select('#rcptAccent', '#1d4ed8');
await p.select('#rcptTemplate', 'modern');
const modern = await look();
say(/tpl-modern/.test(modern.cls) && modern.headerBg === 'rgb(29, 78, 216)' && modern.thBg === 'rgb(29, 78, 216)', `Modern + Blue: blue header band and table head (${modern.headerBg})`);
await (await p.$('#rcptLogo')).uploadFile(resolve('testing/fixtures/torture.png'));
await p.waitForFunction(() => !document.getElementById('rcptPdfLogo').hidden, { timeout: 10000 }).catch(() => {});
const withLogo = await look();
say(withLogo.logo, 'logo appears in the header');
await shot('modern');
await p.select('#rcptTemplate', 'minimal');
const minimal = await look();
say(/tpl-minimal/.test(minimal.cls) && minimal.headerBg === 'rgba(0, 0, 0, 0)' && await p.$eval('#rcptAccent', (e) => e.disabled), `Minimal: no colour band, accent locked (${minimal.headerLine})`);
await shot('minimal');
await p.select('#rcptTemplate', 'modern');
await p.click('#rcptBtnDownload');
let pdf = null;
for (let i = 0; i < 90 && !pdf; i++) { await new Promise((r) => setTimeout(r, 500)); pdf = readdirSync(dl).find((f) => f.endsWith('.pdf')); }
const head = pdf ? readFileSync(join(dl, pdf)).subarray(0, 5).toString() : '';
say(head === '%PDF-', `the PDF still downloads with a template and logo (${pdf || 'none'}, ${pdf ? Math.round(readFileSync(join(dl, pdf)).length / 1024) + ' KB' : ''})`);
say(!errs.length, `no page errors (${errs.join(' | ') || 'none'})`);
await b.close();
console.log(bad ? `\n${bad} failed` : '\nall passed');
process.exit(bad ? 1 : 0);
