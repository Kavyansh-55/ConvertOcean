/**
 * Check candidate keywords/questions against what the site ALREADY ships.
 *
 * Reads dist/ rather than the src data files on purpose: FAQs arrive from
 * tools.ts, seo-content.ts, business-content.ts and guides.ts, and tools.ts
 * merges seoContentMap over rawTools — so the only honest answer to "does this
 * already exist?" is what actually rendered.
 *
 * Usage:  node scripts/research/keyword-dupes.mjs candidates.txt
 *         node scripts/research/keyword-dupes.mjs "how to open pdf in word"
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, sep } from 'node:path';

const norm = s => s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith('.html')) out.push(p);
  }
  return out;
}

if (!existsSync('dist')) {
  console.error('dist/ not found — run `npm run build` first.');
  process.exit(1);
}

// question -> pages that already ask it; and the visible text of every page
const questions = new Map();
const pageText = new Map();

for (const file of walk('dist')) {
  const html = readFileSync(file, 'utf8');
  const url = '/' + file.split(sep).join('/').replace(/^dist[/]/, '').replace(/index[.]html$/, '');

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const j = JSON.parse(m[1]);
      if (j['@type'] === 'FAQPage') {
        for (const q of j.mainEntity || []) {
          const k = norm(q.name);
          if (!questions.has(k)) questions.set(k, { text: q.name, pages: [] });
          questions.get(k).pages.push(url);
        }
      }
    } catch { /* not all ld+json blocks are FAQPage */ }
  }
  pageText.set(url, norm(html.replace(/<[^>]*>/g, ' ')));
}

const arg = process.argv[2];
if (!arg) { console.error('pass a candidates file or a single phrase'); process.exit(1); }
const candidates = existsSync(arg)
  ? readFileSync(arg, 'utf8').split('\n').map(s => s.trim()).filter(s => s && !s.startsWith('#'))
  : [arg];

console.log(`Indexed ${questions.size} distinct FAQ questions across ${pageText.size} pages.\n`);

for (const c of candidates) {
  const k = norm(c);
  const exact = questions.get(k);
  // a phrase already sitting in a page's body text is a softer kind of duplicate
  const inBody = [...pageText.entries()].filter(([, t]) => t.includes(k)).map(([u]) => u);

  if (exact) {
    console.log(`DUPLICATE  "${c}"`);
    console.log(`           already a FAQ on: ${exact.pages.join(', ')}\n`);
  } else if (inBody.length) {
    console.log(`IN BODY    "${c}"`);
    console.log(`           phrase already appears in copy on: ${inBody.slice(0, 5).join(', ')}${inBody.length > 5 ? ` (+${inBody.length - 5})` : ''}\n`);
  } else {
    console.log(`NEW        "${c}"\n`);
  }
}
