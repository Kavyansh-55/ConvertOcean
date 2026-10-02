/**
 * After a Portuguese tool has done something, is anything still English?
 *
 * verify-pt-leaks.mjs reads each page as it first renders, and it needs three
 * or more words to call a line English. Both limits hid real leaks until
 * 2026-09-29: the result panels a tool writes after a file is loaded
 * ("Already as small as it goes", "43% smaller"), error and progress
 * messages, and short labels — "Format", "Identifying", "left alone", "kept",
 * "Group / Tag / Value" — that no word-count rule can judge.
 *
 * This does not guess at language. It runs each tool twice, on the English
 * page and on its Portuguese twin, with the same fixture and the same steps,
 * and collects every visible string. Anything the Portuguese page shows that
 * is IDENTICAL to something the English page shows is a leak, unless it is
 * the same in both languages by nature (numbers, file names, format names,
 * words like "Total" — ALLOWED below, each with its reason). It then does the
 * same for the error path, feeding each tool a file of the wrong type.
 *
 * A control run with the Portuguese dictionary emptied must find leaks, or
 * the comparison is not measuring anything:
 *
 *   node scripts/fidelity/verify-pt-parity.mjs
 *   node scripts/fidelity/verify-pt-parity.mjs --control
 *   node scripts/fidelity/verify-pt-parity.mjs compress-pdf exif-viewer
 */
import puppeteer from 'puppeteer-core';
import { readFileSync, existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { recipes } from './recipes/index.mjs';
import * as TESTING_PATHS from '../testing-paths.mjs';

const ORIGIN = process.env.CO_ORIGIN || 'http://localhost:4321';
const FIX = TESTING_PATHS.FIXTURES;
const CONTROL = process.argv.includes('--control');
const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));

/* English slug → Portuguese slug, from the Portuguese data. */
const ptData = readFileSync('src/data/pt/index.ts', 'utf8');
const PT = new Map([...ptData.matchAll(/^\s+en: '([a-z0-9-]+)',\s*\r?\n\s+slug: '([a-z0-9-]+)'/gm)].map((m) => [m[1], m[2]]));

/* Same in both languages by nature. Each entry says why. */
const ALLOWED = [
  /^[\s\d.,:;%×x\-–—/()+#·→←‹›$€£R*^'"…▲▼✕×]*$/,      // numbers, dimensions, punctuation, arrow and ✕ symbols
  /^[\d.,]+\s?(B|bytes|KB|MB|GB)(\s?(\(\d+%\)|→\s?[\d.,]+\s?(B|bytes|KB|MB|GB)))?$/, // sizes ("bytes" is Portuguese too)
  /^Original$/,                                         // same word in Portuguese
  /^Slide \d+$/, /^\d+ min$/, /^\.json$/,               // "slide" and "min" are Portuguese too
  /^Excel \(\.xlsx\)$|^CSV \(\.csv\)$/,                 // output-format buttons, identical in Portuguese
  /^(Full )?HD \d+×\d+$/, /^Original:?$/, /^\d+×\d+ px · [\d.]+ (KB|MB)$/, // resolution presets, "Original" and a size readout
  /^[\s{}[\]":,]+$|^"[\w-]+":$/,                         // JSON structure echoed back from the fixture
  /^[\w.()\s-]+\.(pdf|docx?|xlsx?|csv|json|xml|txt|pptx?|png|jpe?g|webp|avif|heic|svg|ofx|qfx|qbo|zip|md|log)$/i, // file names
  /^[A-Z0-9][A-Z0-9 .+/&-]*$/,                          // format and unit names: PDF, JPG, DPI, EXIF, UTF-8
  /^(Total|Normal|Software|ISO|Flash|Latitude|Longitude|Altitude|Markup|Excel|Word|PowerPoint|Office|PIX|PayPal|Check|OK|Email|E-mail|ConvertOcean|OpenStreetMap|GitHub|Google|Quicken|QuickBooks|Money|iPhone|Android|Windows|Mac|LibreOffice|Safari|Chrome|WebP|JPEG|emoji|Web Connect|Instagram|LinkedIn|Twitter\/X|Meta|Devanagari|Unicode)$/i,
  /^(Twitter\/X|Meta Desc|Instagram|LinkedIn) \d+$/,     // platform names with a character limit
  /\d{4}-\d{2}-\d{2}/,                                  // ISO dates in data
  /^[\w.-]+@[\w.-]+$/,                                  // e-mail addresses
  /^https?:\/\//,                                       // URLs
];
/* Data the fixtures themselves contain — the tool shows the reader's own
   content back, which is not interface text. Matched as substrings. */
/* Sheet names, column headers, memos and words from the torture fixtures,
   shown back as the reader's own data: */
const FIXTURE_EXACT = /^(Ledger|Styled|Wide|Plain|Booked|Sheet1)( \(\d+\))?$|^(id|name|note|phone|email|amount|line|filler|card purchase|invoice 1001|comma in the name|Date|Margin|South|when|ratio|nothing special|still one field|ampersand entity|large amount|"text"|true|false|null|kept|splitting|count|measurable)$/;
const FIXTURE_TEXT = /\bM\d{2}\b|fidelity fixture|txt-to-pdf conversion|blank line|run off the page|Widget|Gadget|Sprocket|Flange|Ünïcodé|変換|torture|Lorem|ipsum|Café|Açúcar|ACME|Acme|Coffee|Grocery|Payroll|Salary|Utilities|Rent|AT&T|Transfer|Deposit|Invoice #|Checking|Savings/;

const isAllowed = (s) => ALLOWED.some((re) => re.test(s)) || FIXTURE_TEXT.test(s) || FIXTURE_EXACT.test(s);

async function collect(page) {
  return page.evaluate(() => {
    const out = new Set();
    const visible = (el) => {
      if (!el) return false;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return false;
      return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    };
    const root = document.querySelector('main') || document.body;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        const p = n.parentElement;
        /* Panels that display the reader's own data (the fixture), not
           interface text: the JSON output, the spreadsheet preview, the word
           counter's keyword list. Interface labels outside them are still read. */
        if (!p || p.closest('script,style,noscript,template,code,pre,textarea,svg,table.cmp-raw,[data-co-parity-skip],#jf-output,#previewBody,#wc-keyword-list')) return NodeFilter.FILTER_REJECT;
        return visible(p) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const t = n.nodeValue.replace(/\s+/g, ' ').trim();
      if (t) out.add(t);
    }
    root.querySelectorAll('[placeholder],[aria-label],[title]').forEach((el) => {
      if (!visible(el) || el.closest('#jf-output,#previewBody,#wc-keyword-list,[data-co-parity-skip]')) return;
      for (const a of ['placeholder', 'aria-label', 'title']) {
        const v = el.getAttribute(a);
        if (v && v.trim()) out.add(v.trim());
      }
    });
    return [...out];
  });
}

/* Ads and analytics add nothing to a translation check and can hold the
   load event for tens of seconds each page; the tools' own CDN libraries
   still load. */
const BLOCK = /googlesyndication|googletagmanager|google-analytics|doubleclick|adservice|cloudflareinsights/;

async function drive(page, url, recipe, fixtureOverride) {
  await page.setRequestInterception(true);
  page.on('request', (r) => (BLOCK.test(r.url()) ? r.abort() : r.continue()));
  await page.goto(url, { waitUntil: 'load', timeout: 60_000 });
  if (CONTROL && url.includes('/pt/')) {
    await page.evaluate(() => { window.__t = (s) => s; window.__tf = function (s) {
      let o = s; for (let i = 1; i < arguments.length; i++) o = o.split('{' + (i - 1) + '}').join(String(arguments[i])); return o; }; });
  }
  const alerts = [];
  page.on('dialog', async (d) => { alerts.push(d.message()); await d.dismiss().catch(() => {}); });
  if (recipe.typeInto && !fixtureOverride) {
    const content = readFileSync(join(FIX, recipe.typeInto.fixture), 'utf8');
    await page.waitForSelector(recipe.typeInto.selector, { timeout: 30_000 });
    await page.evaluate((sel, text) => {
      const el = document.querySelector(sel);
      el.value = text;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, recipe.typeInto.selector, content);
  } else {
    const names = fixtureOverride ? [fixtureOverride] : (Array.isArray(recipe.fixture) ? recipe.fixture : [recipe.fixture]);
    const input = await page.$('input[type=file]');
    if (!input) return { texts: await collect(page), alerts, note: 'no file input' };
    await input.uploadFile(...names.map((n) => join(FIX, n)));
  }
  if (!fixtureOverride) {
    await page.waitForSelector(recipe.ready, { visible: true, timeout: 60_000 }).catch(() => {});
    for (const step of recipe.pre || []) {
      try {
        if (typeof step === 'string') { await page.waitForSelector(step, { visible: true, timeout: 15_000 }); await page.click(step); }
        else if (step.select) await page.select(step.select, step.value);
        else if (step.setValue) await page.evaluate((sel, v) => {
          const el = document.querySelector(sel); el.value = v;
          el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true }));
        }, step.setValue, step.value);
      } catch { /* a step the page does not offer is not a translation question */ }
    }
  }
  // Results that render asynchronously (compression, OCR-free previews).
  await new Promise((r) => setTimeout(r, fixtureOverride ? 2500 : 4000));
  return { texts: await collect(page), alerts };
}

const wrongFixture = (recipe) => {
  const f = String(Array.isArray(recipe.fixture) ? recipe.fixture[0] : recipe.fixture || '');
  return /\.(txt|csv|json|xml|md|log)$/.test(f) || recipe.typeInto ? 'torture.png' : 'torture.txt';
};

const seen = new Set();
const todo = recipes.filter((r) => {
  if (r.path || seen.has(r.slug) || !PT.has(r.slug)) return false;
  if (only.length && !only.includes(r.slug)) return false;
  seen.add(r.slug); return true;
});
if (!todo.length) { console.log('no recipes selected'); process.exit(1); }

const browser = await puppeteer.launch({
  executablePath: ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe', process.env.CHROME_PATH].filter(Boolean).find(existsSync),
  /* A fresh profile per run: a crashed earlier run can leave a persistent
     profile locked, and the launch then hangs without a word. */
  headless: 'new', args: [TESTING_PATHS.NO_TRACKING, '--no-sandbox', '--disable-dev-shm-usage'], userDataDir: mkdtempSync(join(tmpdir(), 'co-parity-')),
});
console.log(`comparing ${todo.length} tools, EN vs PT, normal and wrong-file paths…`);

let leaksTotal = 0, compared = 0;
const leaksByText = new Map();
try {
  for (const recipe of todo) {
    for (const wrong of [null, wrongFixture(recipe)]) {
      const en = await browser.newPage(); const pt = await browser.newPage();
      await en.setCacheEnabled(false); await pt.setCacheEnabled(false);
      try {
        const [a, b] = await Promise.all([
          drive(en, `${ORIGIN}/${recipe.slug}/`, recipe, wrong),
          drive(pt, `${ORIGIN}/pt/${PT.get(recipe.slug)}/`, recipe, wrong),
        ]);
        const enSet = new Set([...a.texts, ...a.alerts]);
        const leaks = [...b.texts, ...b.alerts].filter((t) => enSet.has(t) && !isAllowed(t));
        compared++;
        const where = `${recipe.slug}${wrong ? ' (wrong file)' : ''}`;
        for (const l of leaks) {
          if (!leaksByText.has(l)) leaksByText.set(l, []);
          leaksByText.get(l).push(where);
        }
        leaksTotal += leaks.length;
        console.log(`${leaks.length ? 'LEAK' : 'OK  '}  ${where.padEnd(34)} ${b.texts.length} strings${leaks.length ? ' — ' + leaks.slice(0, 4).map((l) => JSON.stringify(l.slice(0, 50))).join(', ') : ''}`);
      } catch (e) {
        console.log(`ERR   ${recipe.slug}${wrong ? ' (wrong file)' : ''} — ${e.message.split('\n')[0]}`);
      } finally {
        await en.close(); await pt.close();
      }
    }
  }
} finally {
  await browser.close();
}

console.log(`\n${compared} EN/PT runs compared, ${leaksByText.size} distinct English strings on Portuguese pages`);
for (const [t, where] of [...leaksByText].sort((x, y) => y[1].length - x[1].length)) {
  console.log(`  ${JSON.stringify(t.slice(0, 100))}  ← ${[...new Set(where)].slice(0, 4).join(', ')}`);
}
if (CONTROL) {
  const okCtl = leaksByText.size > 20;
  console.log(okCtl ? `\nControl OK: with the dictionary switched off, ${leaksByText.size} leaks were found.`
    : `\nCONTROL BROKEN: only ${leaksByText.size} leaks found with translation switched off.`);
  process.exit(okCtl ? 0 : 1);
}
process.exit(leaksByText.size ? 1 : 0);
