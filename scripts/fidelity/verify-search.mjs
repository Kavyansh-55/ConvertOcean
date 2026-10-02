/**
 * The homepage tool search, driven like a reader would.
 *
 * Until 2026-10-02 the search lived in the nav bar, where the links left it
 * 85px at best and 0px at 1121px ("Se /" on every desktop), and the
 * Portuguese homepage had none. It now sits in each locale's hero
 * (ToolSearch.astro). This checks the field is usable at every width, that
 * typing finds the right tool in both languages, and that the keyboard
 * contract holds: arrows, Enter, Escape, "/" — and that "/" does not steal
 * a character typed into some other field.
 *
 *   npm run search                                   (local preview on 4321)
 *   CO_ORIGIN=https://convertocean.com npm run search
 */
import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';
import { browserProfile, NO_TRACKING } from '../testing-paths.mjs';

const ORIGIN = process.env.CO_ORIGIN || 'http://localhost:4321';
const exe = [process.env.CHROME_PATH,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe'].find((p) => p && existsSync(p));
const browser = await puppeteer.launch({ executablePath: exe, headless: 'new', args: [NO_TRACKING, '--no-sandbox'], userDataDir: browserProfile('search') });

let bad = 0;
const say = (ok, msg) => { if (!ok) bad++; console.log(`${ok ? 'OK  ' : 'FAIL'}  ${msg}`); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function open(path, width = 1440) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900 });
  await page.goto(ORIGIN + path, { waitUntil: 'networkidle2' });
  return page;
}
async function typeQuery(page, q) {
  // Clear by value: triple-click selection does not reliably select a
  // type=search field's text, and a stale query then ran into the next one.
  await page.$eval('#searchInput', (e) => { e.value = ''; e.dispatchEvent(new Event('input')); });
  await page.focus('#searchInput');
  await page.type('#searchInput', q, { delay: 10 });
  await sleep(150);
  return page.$$eval('#searchResults .tool-search-item', (els) => els.map((e) => ({
    name: e.querySelector('.tool-search-name').textContent, href: e.getAttribute('href') })));
}

try {
  /* Width: the field must be wide enough to read its placeholder everywhere. */
  for (const path of ['/', '/pt/']) {
    for (const w of [1850, 1440, 1121, 768, 390]) {
      const page = await open(path, w);
      const m = await page.evaluate(() => {
        const f = document.querySelector('.tool-search-field');
        const panel = document.querySelector('#searchResults');
        const inp = document.querySelector('#searchInput');
        // Placeholder fully visible: its text must fit the input's content box.
        const cs = inp && getComputedStyle(inp);
        const ctx = document.createElement('canvas').getContext('2d');
        if (cs) ctx.font = cs.fontSize + ' ' + cs.fontFamily;
        const room = inp ? inp.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) : 0;
        window.__ph = { fits: inp ? ctx.measureText(inp.placeholder).width <= room : false,
                        panelShown: panel ? getComputedStyle(panel).display !== 'none' : true };
        const r = f && f.getBoundingClientRect();
        return { w: r ? Math.round(r.width) : 0, inNav: !!document.querySelector('.nav-bar #searchInput'),
                 overflow: document.documentElement.scrollWidth - innerWidth, ...window.__ph };
      });
      say(m.w >= Math.min(320, w - 48) && !m.inNav && m.overflow <= 0 && m.fits && !m.panelShown,
          `${path} at ${w}px: field ${m.w}px wide in the hero, placeholder fits, no empty panel before typing, no sideways scroll`
          + (m.fits ? '' : ' — PLACEHOLDER CLIPPED') + (m.panelShown ? ' — EMPTY PANEL SHOWN' : ''));
      await page.close();
    }
  }

  /* The nav band: between the desktop links appearing and the bar's room
     running out, nothing may push the page sideways. Was 28-118px over
     from 1121px to ~1240px, worst in Portuguese, before 2026-10-02. */
  for (const path of ['/', '/pt/', '/merge-pdf/', '/pt/juntar-pdf/']) {
    const over = [];
    for (const w of [1121, 1180, 1240, 1259, 1260, 1300, 1440]) {
      const page = await open(path, w);
      const ov = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      if (ov > 0) over.push(`${w}px +${ov}`);
      await page.close();
    }
    say(over.length === 0, `${path} header fits from 1121 to 1440px${over.length ? ' — over at ' + over.join(', ') : ''}`);
  }

  /* Matching, English. */
  {
    const page = await open('/');
    let r = await typeQuery(page, 'pdf word');
    say(r.length > 0 && r[0].name === 'PDF to Word' && r[0].href === '/pdf-to-word/',
        `"pdf word" (both words, any order) puts PDF to Word first → ${r.map((x) => x.name).slice(0, 3).join(', ')}`);
    r = await typeQuery(page, 'compress');
    say(r.length >= 4 && r.slice(0, 4).every((x) => /^Compress/.test(x.name)),
        `"compress" lists the four compressors first → ${r.slice(0, 4).map((x) => x.name).join(', ')}`);
    r = await typeQuery(page, 'zzqx');
    const empty = await page.$eval('#searchEmpty', (e) => !e.hidden && e.textContent.trim());
    const panelHidden = await page.$eval('#searchResults', (e) => e.hidden);
    say(r.length === 0 && panelHidden && /No tool matches/.test(empty || ''), 'no match says so instead of closing silently');

    /* Keyboard: Down twice, Enter → navigates to the second result. */
    r = await typeQuery(page, 'jpg');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    const active = await page.$eval('#searchInput', (e) => e.getAttribute('aria-activedescendant'));
    await Promise.all([page.waitForNavigation({ waitUntil: 'domcontentloaded' }), page.keyboard.press('Enter')]);
    say(active === 'searchResult-1' && page.url().endsWith(r[1].href),
        `arrows move the highlight and Enter opens it (${r[1].name} → ${new URL(page.url()).pathname})`);
    await page.close();
  }

  /* Enter with nothing highlighted opens the top result. */
  {
    const page = await open('/');
    await typeQuery(page, 'merge pdf');
    await Promise.all([page.waitForNavigation({ waitUntil: 'domcontentloaded' }), page.keyboard.press('Enter')]);
    say(new URL(page.url()).pathname === '/merge-pdf/', `Enter opens the top result ("merge pdf" → ${new URL(page.url()).pathname})`);
    await page.close();
  }

  /* "/" focuses the search from the page, Escape closes the panel. */
  {
    const page = await open('/');
    await page.click('h1');
    await page.keyboard.press('/');
    const focused = await page.evaluate(() => document.activeElement && document.activeElement.id);
    const value = await page.$eval('#searchInput', (e) => e.value);
    say(focused === 'searchInput' && value === '', '"/" jumps to the search without typing a slash into it');
    await page.type('#searchInput', 'pdf');
    await sleep(100);
    await page.keyboard.press('Escape');
    const hidden = await page.$eval('#searchResults', (e) => e.hidden);
    say(hidden, 'Escape closes the results');

    /* "/" typed into another field stays in that field. */
    const stolen = await page.evaluate(() => {
      const other = document.createElement('input');
      other.id = 'otherField';
      document.body.appendChild(other);
      return true;
    });
    await page.focus('#otherField');
    await page.keyboard.type('a/b');
    const other = await page.$eval('#otherField', (e) => e.value);
    const stillThere = await page.evaluate(() => document.activeElement && document.activeElement.id);
    say(stolen && other === 'a/b' && stillThere === 'otherField', `"/" typed in another field stays there (got "${other}")`);
    await page.close();
  }

  /* /?q= is what the WebSite schema advertises as the site search. */
  {
    const page = await open('/?q=merge%20pdf');
    await sleep(200);
    const r = await page.$$eval('#searchResults .tool-search-item', (els) => els.map((e) => e.getAttribute('href')));
    const v = await page.$eval('#searchInput', (e) => e.value);
    say(v === 'merge pdf' && r[0] === '/merge-pdf/', `/?q=merge pdf arrives with the query typed and Merge PDF on top (${r[0]})`);
    await page.close();
    const tpl = await open('/?q={search_term_string}');
    const tv = await tpl.$eval('#searchInput', (e) => e.value);
    say(tv === '', 'the literal schema template URL that crawlers request is ignored, not searched');
    await tpl.close();
  }

  /* Portuguese: Portuguese names, /pt/ links, accent-insensitive, English slug words work too. */
  {
    const page = await open('/pt/');
    const ph = await page.$eval('#searchInput', (e) => e.placeholder);
    say(/^Buscar entre \d+ ferramentas/.test(ph), `/pt/ placeholder is Portuguese ("${ph}")`);
    let r = await typeQuery(page, 'pdf para word');
    say(r.length > 0 && r[0].name === 'PDF para Word' && r[0].href.startsWith('/pt/'),
        `"pdf para word" finds PDF para Word on a /pt/ link → ${r[0] && r[0].href}`);
    r = await typeQuery(page, 'equilibrio');
    say(r.length > 0 && r[0].name === 'Ponto de Equilíbrio', `accent-insensitive: "equilibrio" finds ${r[0] && r[0].name}`);
    r = await typeQuery(page, 'compress pdf');
    say(r.length > 0 && r[0].href === '/pt/comprimir-pdf/', `English words still work on /pt/ ("compress pdf" → ${r[0] && r[0].href})`);
    r = await typeQuery(page, 'zzqx');
    const empty = await page.$eval('#searchEmpty', (e) => e.textContent.trim());
    say(/Nenhuma ferramenta/.test(empty), 'the no-match message is Portuguese');
    await page.close();
  }

  /* Both themes: the field and panel are legible on the hero band. */
  for (const theme of ['light', 'dark']) {
    const page = await open('/');
    await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
    await typeQuery(page, 'pdf');
    const c = await page.evaluate(() => {
      const lum = (rgb) => {
        const [r, g, b] = rgb.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number).map((v) => {
          v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
      const field = getComputedStyle(document.querySelector('.tool-search-field')).backgroundColor;
      const input = getComputedStyle(document.querySelector('#searchInput')).color;
      const panel = getComputedStyle(document.querySelector('#searchResults')).backgroundColor;
      const desc = getComputedStyle(document.querySelector('.tool-search-desc')).color;
      return { text: ratio(input, field).toFixed(2), desc: ratio(desc, panel).toFixed(2) };
    });
    say(+c.text >= 4.5 && +c.desc >= 4.5, `${theme}: typed text ${c.text}:1, result descriptions ${c.desc}:1 (≥ 4.5)`);
    await page.close();
  }
} finally {
  await browser.close();
}

console.log(bad ? `\n${bad} search check(s) failed` : '\nall search checks passed');
process.exit(bad ? 1 : 0);
