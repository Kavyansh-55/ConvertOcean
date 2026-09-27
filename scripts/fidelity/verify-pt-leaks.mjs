/**
 * Does any Portuguese page still show English?
 *
 * The 2026-09-27 audit found 24 distinct English lines across the live /pt/
 * pages — a footer sentence on all 87 (its English was extended, which
 * silently orphaned the translation key), three sentences hard-coded in the
 * tool template on 69, and tool placeholders, aria-labels and generator
 * sample data. ui-strings.test.mjs only sees strings that go through t(); it
 * is blind to text that never did. This reads what the reader actually gets:
 * each page's visible text plus placeholders, aria-labels and titles, and
 * flags lines whose words are mostly English.
 *
 * It reads the page as loaded. Labels a script sets after interaction are
 * covered by the __t runtime keys and ui-strings.test.mjs instead.
 *
 *   npm run pt-leaks
 *   CO_ORIGIN=https://convertocean.com npm run pt-leaks
 */
import puppeteer from 'puppeteer-core';
import { browserProfile } from '../testing-paths.mjs';

const O = process.env.CO_ORIGIN || 'http://localhost:4321';
const EN = new Set(('the and your you to of for with this that is are it in on from or be can will file files ' +
  'into by as at an not no only all any its their our we how what when which while choose select convert ' +
  'download drag drop click browse here output upload preview settings quality size page pages').split(' '));
const PT = new Set(('o a os as e de do da dos das para com um uma seu sua que não no na em por ao é são ' +
  'arquivo arquivos página escolha baixe converta').split(' '));

const sm = await (await fetch(O + '/sitemap.xml')).text();
const urls = [...sm.matchAll(/<loc>([^<]*\/pt\/[^<]*)<\/loc>/g)]
  .map(m => m[1].replace('https://convertocean.com', O));
if (urls.length < 80) { console.log(`only ${urls.length} /pt/ URLs in the sitemap — not a real run`); process.exit(1); }

const b = await puppeteer.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  headless: 'new', args: ['--no-sandbox'], userDataDir: browserProfile('pt-leaks'),
});
const hits = new Map(); // line -> [pages]
try {
  for (const u of urls) {
    const p = await b.newPage();
    await p.setCacheEnabled(false);
    await p.goto(u, { waitUntil: 'networkidle2', timeout: 60000 });
    const text = await p.evaluate(() => {
      const t = [document.body.innerText];
      // placeholders, aria-labels and titles are interface text too
      document.querySelectorAll('[placeholder],[aria-label],[title]').forEach(e =>
        ['placeholder', 'aria-label', 'title'].forEach(a => e.getAttribute(a) && t.push(e.getAttribute(a))));
      return t.join('\n');
    });
    await p.close();
    for (const raw of text.split('\n')) {
      const line = raw.trim();
      const words = line.toLowerCase().match(/[a-zà-ú']+/g) || [];
      if (words.length < 3) continue;
      const en = words.filter(w => EN.has(w)).length;
      const pt = words.filter(w => PT.has(w)).length;
      if (en >= 2 && en > pt * 2) {
        const key = line.slice(0, 140);
        if (!hits.has(key)) hits.set(key, []);
        hits.get(key).push(u.replace(O, ''));
      }
    }
  }
} finally {
  await b.close();
}

const sorted = [...hits.entries()].sort((a, b) => b[1].length - a[1].length);
console.log(`${urls.length} PT pages scanned; ${sorted.length} distinct English-looking lines`);
for (const [line, pages] of sorted) {
  console.log(`[${pages.length}] ${line}`);
  console.log(`      e.g. ${pages.slice(0, 3).join(' ')}`);
}
process.exit(sorted.length ? 1 : 0);
