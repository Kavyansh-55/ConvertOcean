/**
 * The last four tools the fidelity sweep has never driven.
 *
 * Three of them fall outside it for real reasons rather than neglect, and the
 * reasons differ — so this covers each in the way it actually needs:
 *
 *  - **invoice-generator / receipt-generator** have no input file. They are
 *    forms, so they are tested by filling the form and reading what comes out
 *    of the PDF: the numbers a reader would be embarrassed to send a client.
 *  - **image-to-text** is OCR, which is slow and never exact. Asserting an
 *    exact transcription would produce a test that fails on a good day, so it
 *    asks for most of the words instead.
 *  - **ppt-to-pdf** refuses legacy .ppt on purpose. That refusal is behaviour
 *    worth pinning: silently doing nothing, or accepting and producing
 *    rubbish, are both regressions from "says it cannot".
 *
 *   node scripts/fidelity/verify-generators.mjs
 *   CO_ORIGIN=https://convertocean.com node scripts/fidelity/verify-generators.mjs
 */
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync, writeFileSync, rmSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import * as TESTING_PATHS from '../testing-paths.mjs';

const ORIGIN = process.env.CO_ORIGIN || 'http://localhost:4321';
const LOCAL = ORIGIN.includes('localhost');
const FIX = TESTING_PATHS.FIXTURES;
const DL = join(process.cwd(), 'scratch', 'gen-dl');

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

/** Fill inputs by id and let the component react. */
async function fill(page, values) {
  await page.evaluate((vals) => {
    for (const [id, value] of Object.entries(vals)) {
      const el = document.getElementById(id);
      if (!el) continue;
      el.value = String(value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, values);
  await new Promise((r) => setTimeout(r, 400));
}

mkdirSync(DL, { recursive: true });
const server = await ensureServer();
const browser = await puppeteer.launch({
  executablePath: browserPath(), headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

try {
  console.log(`\ngenerators and the rest: ${ORIGIN}\n`);

  /* ------------------------------------------------- invoice generator */
  {
    const page = await browser.newPage();
    await page.goto(ORIGIN + '/invoice-generator/', { waitUntil: 'networkidle2', timeout: 45000 });
    await new Promise((r) => setTimeout(r, 800));

    await fill(page, {
      inputInvNo: 'CO-TEST-9001',
      inputVendorName: 'Marker Vendor M01',
      inputClientName: 'Marker Client M02',
      inputClientAddress: 'M03 Client Street',
      inputTaxSelect: 'custom',
    });
    await fill(page, { inputCustomTaxLabel: 'VAT', inputCustomTaxRate: '20' });

    /* Set the first line item to numbers whose total is unambiguous:
       4 x 250 = 1000, plus 20% VAT = 1200. A generator that applies tax to
       the wrong base, or sums before rather than after quantity, lands
       somewhere else entirely. */
    const itemsSet = await page.evaluate(() => {
      const rows = document.querySelectorAll('#itemEditRows tr');
      if (!rows.length) return false;
      const inputs = rows[0].querySelectorAll('input');
      if (inputs.length < 3) return false;
      const set = (el, v) => {
        el.value = v;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      };
      set(inputs[0], 'M04 Consulting');
      set(inputs[1], '4');
      set(inputs[2], '250');
      /* Remove any other rows so the arithmetic has one source. */
      for (let i = rows.length - 1; i >= 1; i--) {
        const del = rows[i].querySelector('.item-delete-btn');
        if (del) del.click();
      }
      return true;
    });
    say(itemsSet, 'invoice line items could be filled');
    await new Promise((r) => setTimeout(r, 700));

    const preview = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));
    say(preview.includes('CO-TEST-9001'), 'invoice number reaches the document');
    say(preview.includes('Marker Vendor M01') && preview.includes('Marker Client M02'),
        'vendor and client names reach the document');
    /* 4 x 250 = 1,000 subtotal; 20% VAT = 200; total 1,200. */
    const has = (n) => new RegExp(n.replace('.', '\\.')).test(preview);
    say(has('1,?000'), 'subtotal of 4 x 250 shows as 1,000');
    say(has('200'), 'VAT at 20% of 1,000 shows as 200');
    say(has('1,?200'), 'total shows as 1,200');
    await page.close();
  }

  /* ------------------------------------------------- receipt generator */
  {
    const page = await browser.newPage();
    await page.goto(ORIGIN + '/receipt-generator/', { waitUntil: 'networkidle2', timeout: 45000 });
    await new Promise((r) => setTimeout(r, 800));

    await fill(page, {
      rcptClientName: 'Marker Payer M05',
      rcptClientAddress: 'M06 Payer Road',
    });
    const filled = await page.evaluate(() => {
      const rows = document.querySelectorAll('#rcptItemEditRows tr');
      if (!rows.length) return false;
      const inputs = rows[0].querySelectorAll('input');
      if (inputs.length < 3) return false;
      const set = (el, v) => {
        el.value = v;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      };
      set(inputs[0], 'M07 Service');
      set(inputs[1], '2');
      set(inputs[2], '125');
      for (let i = rows.length - 1; i >= 1; i--) {
        const del = rows[i].querySelector('.item-delete-btn');
        if (del) del.click();
      }
      return true;
    });
    say(filled, 'receipt line items could be filled');
    await new Promise((r) => setTimeout(r, 700));

    const text = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));
    say(text.includes('Marker Payer M05'), 'payer name reaches the receipt');
    say(/250/.test(text), 'receipt totals 2 x 125 as 250');
    await page.close();
  }

  /* -------------------------------------------------------- image OCR */
  {
    const page = await browser.newPage();
    await page.goto(ORIGIN + '/image-to-text/', { waitUntil: 'networkidle2', timeout: 45000 });
    await new Promise((r) => setTimeout(r, 600));

    /* A clean, high-contrast rendering of known words. OCR on a torture
       fixture would be measuring the fixture, not the tool. */
    const words = ['INVOICE', 'TOTAL', 'AMOUNT', 'PAID'];
    const png = await page.evaluate((ws) => {
      const c = document.createElement('canvas');
      c.width = 900; c.height = 320;
      const g = c.getContext('2d');
      g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
      g.fillStyle = '#000'; g.font = 'bold 64px Arial';
      ws.forEach((w, i) => g.fillText(w, 40, 80 + i * 70));
      return c.toDataURL('image/png');
    }, words);
    const buf = Buffer.from(png.split(',')[1], 'base64');
    const imgPath = join(DL, 'ocr-sample.png');
    writeFileSync(imgPath, buf);

    const input = await page.$('input[type=file]');
    await input.uploadFile(imgPath);

    /* OCR is slow; wait for output rather than a fixed delay. */
    let text = '';
    const deadline = Date.now() + 120000;
    while (Date.now() < deadline) {
      text = await page.evaluate(() => document.getElementById('txtOutput')?.value
        || document.getElementById('txtOutput')?.textContent || '');
      if (text && text.trim().length > 3) break;
      await new Promise((r) => setTimeout(r, 2000));
    }

    const upper = text.toUpperCase();
    const found = words.filter((w) => upper.includes(w));
    /* Three of four, not four of four: OCR is probabilistic and a test that
       demands perfection fails on a good day and teaches everyone to ignore
       it. */
    say(found.length >= 3,
        `OCR read ${found.length}/${words.length} known words (${found.join(', ') || 'none'})`);
    await page.close();
  }

  /* ------------------------------------------------- legacy .ppt refusal */
  {
    const page = await browser.newPage();
    await page.goto(ORIGIN + '/ppt-to-pdf/', { waitUntil: 'networkidle2', timeout: 45000 });
    await new Promise((r) => setTimeout(r, 600));

    /* A real legacy PowerPoint is an OLE2 container, like the .xls fixture.
       The tool cannot read those and says so — that sentence is the feature
       being tested. */
    const ole = Buffer.alloc(4096);
    Buffer.from([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]).copy(ole, 0);
    const pptPath = join(DL, 'legacy.ppt');
    writeFileSync(pptPath, ole);

    const input = await page.$('input[type=file]');
    await input.uploadFile(pptPath);
    await new Promise((r) => setTimeout(r, 3000));

    const state = await page.evaluate(() => {
      const vis = (el) => el && el.offsetParent !== null;
      const err = [...document.querySelectorAll('[id*="rror" i], [class*="error" i], [role=alert]')].find(vis);
      return { message: err ? err.textContent.trim().slice(0, 110) : null };
    });
    say(!!state.message,
        state.message
          ? `legacy .ppt is refused in words: "${state.message.slice(0, 70)}…"`
          : 'legacy .ppt was NOT refused — silent, which is the regression this guards');
    if (state.message) {
      say(/\.pptx|re-?sav|newer|powerpoint/i.test(state.message),
          'the refusal tells the reader what to do about it');
    }
    await page.close();
  }
} finally {
  await browser.close();
  if (server) server.kill();
  rmSync(DL, { recursive: true, force: true });
}

console.log(bad ? `\n${bad} check(s) failed` : '\nevery generator and OCR check passed');
process.exit(bad ? 1 : 0);
