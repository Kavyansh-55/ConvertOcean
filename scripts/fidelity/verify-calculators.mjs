/**
 * The four calculators, which no recipe has ever covered.
 *
 * The fidelity harness asks whether a converted file matches its source. A
 * calculator has no source file, so it sat outside the sweep entirely — four
 * tools, never driven, on a site whose business-tools traffic is the
 * high-RPM target.
 *
 * Every expected value here is worked out from the **definition** of the
 * quantity, not copied from the component. A test that mirrors the code it
 * tests will happily agree with a wrong formula: margin and markup are the
 * classic pair to get backwards — margin is profit over *revenue*, markup is
 * profit over *cost* — and a test built by copying the implementation would
 * confirm either one.
 *
 *   node scripts/fidelity/verify-calculators.mjs
 *   CO_ORIGIN=https://convertocean.com node scripts/fidelity/verify-calculators.mjs
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

let bad = 0;
const say = (ok, msg) => { if (!ok) bad++; console.log(`${ok ? 'OK  ' : 'FAIL'}  ${msg}`); };

/** Pull the first number out of "1,234.56%" or "$1,234.56". */
const num = (text) => {
  const m = String(text).replace(/,/g, '').match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : NaN;
};
const close = (a, b, tol = 0.011) => Number.isFinite(a) && Math.abs(a - b) <= tol;

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

/** Set inputs by id, fire the events the component listens for, read outputs. */
async function drive(page, inputs, outputIds, clickId) {
  await page.evaluate((values) => {
    for (const [id, value] of Object.entries(values)) {
      const el = document.getElementById(id);
      if (!el) continue;
      el.value = String(value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, inputs);
  if (clickId) await page.evaluate((id) => document.getElementById(id)?.click(), clickId);
  await new Promise((r) => setTimeout(r, 350));
  return page.evaluate((ids) => {
    const out = {};
    for (const id of ids) out[id] = document.getElementById(id)?.textContent ?? null;
    return out;
  }, outputIds);
}

const server = await ensureServer();
const browser = await puppeteer.launch({
  executablePath: browserPath(), headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

try {
  console.log(`\ncalculators: ${ORIGIN}\n`);

  /* ------------------------------------------------------- percentages */
  {
    const page = await browser.newPage();
    await page.goto(ORIGIN + '/percentage-calculator/', { waitUntil: 'networkidle2', timeout: 45000 });

    for (const [x, y] of [[15, 200], [7.5, 64], [0, 99], [120, 50]]) {
      const r = await drive(page, { pct1X: x, pct1Y: y }, ['pct1Res']);
      say(close(num(r.pct1Res), (y * x) / 100),
          `${x}% of ${y} = ${(y * x) / 100} (got ${r.pct1Res})`);
    }

    for (const [x, y] of [[30, 200], [1, 3], [5, 5]]) {
      const r = await drive(page, { pct2X: x, pct2Y: y }, ['pct2Res']);
      say(close(num(r.pct2Res), (x / y) * 100, 0.0002),
          `${x} is ${((x / y) * 100).toFixed(4)}% of ${y} (got ${r.pct2Res})`);
    }

    /* Percentage change is signed, and the tool shows the direction as a word,
       so the number itself is the absolute value. */
    for (const [from, to] of [[200, 250], [250, 200], [-50, 50]]) {
      const r = await drive(page, { pct3X: from, pct3Y: to }, ['pct3Res']);
      const expected = Math.abs(((to - from) / Math.abs(from)) * 100);
      const dir = to - from >= 0 ? 'increase' : 'decrease';
      say(close(num(r.pct3Res), expected, 0.0002) && String(r.pct3Res).includes(dir),
          `${from} → ${to} is ${expected.toFixed(2)}% ${dir} (got ${r.pct3Res})`);
    }

    /* Division by zero must not print Infinity or NaN at a reader. */
    const zero = await drive(page, { pct2X: 5, pct2Y: 0 }, ['pct2Res']);
    say(!/NaN|Infinity/i.test(String(zero.pct2Res)),
        `5 as a percentage of 0 shows no NaN/Infinity (got ${zero.pct2Res})`);

    await page.close();
  }

  /* ----------------------------------------------------- profit margin */
  {
    const page = await browser.newPage();
    await page.goto(ORIGIN + '/profit-margin-calculator/', { waitUntil: 'networkidle2', timeout: 45000 });

    for (const [cost, revenue] of [[60, 100], [1200, 1500], [10, 11]]) {
      const r = await drive(page, { pmCost1: cost, pmRevenue1: revenue },
        ['pmResMargin', 'pmResMarkup', 'pmResProfit'], 'pmCalcBtn');
      const profit = revenue - cost;
      /* Margin is on revenue; markup is on cost. Getting these the same way
         round is the classic error this test exists to catch. */
      say(close(num(r.pmResMargin), (profit / revenue) * 100),
          `cost ${cost} rev ${revenue}: margin ${((profit / revenue) * 100).toFixed(2)}% (got ${r.pmResMargin})`);
      say(close(num(r.pmResMarkup), (profit / cost) * 100),
          `cost ${cost} rev ${revenue}: markup ${((profit / cost) * 100).toFixed(2)}% (got ${r.pmResMarkup})`);
      say(close(num(r.pmResProfit), profit),
          `cost ${cost} rev ${revenue}: profit ${profit} (got ${r.pmResProfit})`);
    }

    /* Margin and markup must not be equal for a normal case — they are
       different quantities, and a component that printed one twice would pass
       every single-value check above. */
    const r = await drive(page, { pmCost1: 60, pmRevenue1: 100 },
      ['pmResMargin', 'pmResMarkup'], 'pmCalcBtn');
    say(num(r.pmResMargin) !== num(r.pmResMarkup),
        `margin (${r.pmResMargin}) and markup (${r.pmResMarkup}) are different quantities`);

    await page.close();
  }

  /* -------------------------------------------------------- break-even */
  {
    const page = await browser.newPage();
    await page.goto(ORIGIN + '/break-even-calculator/', { waitUntil: 'networkidle2', timeout: 45000 });

    for (const [fixed, variable, price] of [[5000, 6, 16], [1200, 2.5, 10], [900, 0, 3]]) {
      const r = await drive(page, { beFixed1: fixed, beVar1: variable, bePrice1: price },
        ['beResMain', 'beResCM', 'beResRatio'], 'beCalcBtn');
      const cm = price - variable;
      say(close(num(r.beResMain), fixed / cm, 0.51),
          `fixed ${fixed}, cm ${cm}: break-even ${(fixed / cm).toFixed(2)} units (got ${r.beResMain})`);
      say(close(num(r.beResCM), cm),
          `contribution margin ${cm} (got ${r.beResCM})`);
      say(close(num(r.beResRatio), (cm / price) * 100),
          `cm ratio ${((cm / price) * 100).toFixed(2)}% (got ${r.beResRatio})`);
    }

    /* A price at or below variable cost never breaks even. Printing a number
       there — Infinity, or a negative unit count — would be worse than saying
       so plainly. */
    const impossible = await drive(page, { beFixed1: 5000, beVar1: 20, bePrice1: 10 },
      ['beResMain'], 'beCalcBtn');
    const text = await page.evaluate(() => document.body.innerText);
    say(!/Infinity|NaN/i.test(String(impossible.beResMain))
        && /not reachable|greater than/i.test(text),
        `price below variable cost is explained, not printed as a number (got ${impossible.beResMain})`);

    await page.close();
  }

  /* --------------------------------------------------------- sales tax */
  {
    const page = await browser.newPage();
    await page.goto(ORIGIN + '/sales-tax-calculator/', { waitUntil: 'networkidle2', timeout: 45000 });

    for (const [price, rate] of [[100, 7.53], [49.99, 20], [1000, 0]]) {
      const r = await drive(page, { taxPrice1: price, taxRate1: rate },
        ['taxResTax', 'taxResGrand'], 'taxCalcBtn');
      const tax = price * (rate / 100);
      say(close(num(r.taxResTax), tax),
          `${price} at ${rate}%: tax ${tax.toFixed(2)} (got ${r.taxResTax})`);
      say(close(num(r.taxResGrand), price + tax),
          `${price} at ${rate}%: total ${(price + tax).toFixed(2)} (got ${r.taxResGrand})`);
    }

    /* Reverse mode: given a tax-inclusive total, the base is total / (1+rate),
       NOT total minus rate% of the total — which is the mistake that makes a
       reverse calculator quietly wrong. */
    await page.evaluate(() => document.getElementById('taxTabRemove')?.click());
    await new Promise((r) => setTimeout(r, 300));
    for (const [total, rate] of [[120, 20], [107.53, 7.53]]) {
      const r = await drive(page, { taxTotal2: total, taxRate2: rate },
        ['taxResTax', 'taxResGrand', 'taxResBase'], 'taxCalcBtn');
      const base = total / (1 + rate / 100);
      const tax = total - base;
      const reported = num(r.taxResBase ?? r.taxResGrand);
      say(close(reported, base, 0.02) || close(num(r.taxResTax), tax, 0.02),
          `${total} incl ${rate}%: base ${base.toFixed(2)}, tax ${tax.toFixed(2)} `
          + `(base ${r.taxResBase}, tax ${r.taxResTax})`);
      /* The wrong method gives total × rate/100 — for 120 at 20% that is 20.00
         rather than 20.00... so use a case where they differ clearly. */
      if (total === 120 && rate === 20) {
        say(!close(num(r.taxResTax), total * (rate / 100), 0.005),
            `reverse tax is not simply ${(total * (rate / 100)).toFixed(2)} (got ${r.taxResTax})`);
      }
    }

    await page.close();
  }
} finally {
  await browser.close();
  if (server) server.kill();
}

console.log(bad ? `\n${bad} calculator check(s) failed` : '\nevery calculator check passed');
process.exit(bad ? 1 : 0);
