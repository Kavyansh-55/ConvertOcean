/**
 * Does a build-config change alter what a reader actually sees?
 *
 * Written for the `compressHTML: 'jsx'` flip. JSX whitespace rules strip the
 * space *around inline elements*, and that is the one kind of whitespace a
 * reader can see: `<a>Merge PDF</a> <a>Split PDF</a>` losing its space renders
 * as "Merge PDFSplit PDF". Whitespace between block elements is invisible
 * either way, so a byte diff of the HTML reports hundreds of changes and tells
 * you nothing about which ones matter.
 *
 * So this does not diff HTML. It renders both builds in a real browser and
 * compares `innerText` — the text as laid out, where block boundaries become
 * newlines from CSS rather than from source whitespace. A difference here is,
 * by construction, a difference a reader could see.
 *
 * It also compares the SEO surfaces that live in <head> and are not visible
 * text at all: title, meta description, canonical, and every JSON-LD block
 * parsed and deep-compared, because a minifier that touched a string inside
 * structured data would be invisible to a text check and visible to Google.
 *
 *   npm run build                       # candidate build, into dist/
 *   node scripts/fidelity/verify-text-equivalence.mjs <baseline-dir> [candidate-dir]
 *
 * Produce the baseline by building with the old setting and copying dist/
 * somewhere before flipping it.
 */
import puppeteer from 'puppeteer-core';
import { browserProfile } from '../testing-paths.mjs';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const BASE_DIR = process.argv[2];
const CAND_DIR = process.argv[3] || 'dist';

if (!BASE_DIR || !fs.existsSync(BASE_DIR)) {
  console.error('usage: node scripts/fidelity/verify-text-equivalence.mjs <baseline-dir> [candidate-dir]');
  process.exit(2);
}

const EDGE_CANDIDATES = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  process.env.CHROME_PATH,
].filter(Boolean);

function browserPath() {
  for (const p of EDGE_CANDIDATES) if (existsSyncSafe(p)) return p;
  throw new Error('No Edge/Chrome found. Set CHROME_PATH to a browser executable.');
}
const existsSyncSafe = (p) => { try { return fs.existsSync(p); } catch { return false; } };

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};

function serve(root) {
  const server = http.createServer((req, res) => {
    let rel = decodeURIComponent(req.url.split('?')[0]);
    let file = path.join(root, rel);
    if (rel.endsWith('/')) file = path.join(file, 'index.html');
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      const withHtml = file.replace(/\/$/, '') + '.html';
      if (fs.existsSync(withHtml)) file = withHtml;
      else { res.writeHead(404); res.end('not found'); return; }
    }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, () => resolve({ server, port: server.address().port })));
}

/* Every built page, as the URL a reader would visit. */
function pages(root) {
  const out = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.html')) {
        const rel = path.relative(root, p).split(path.sep).join('/');
        out.push(rel === 'index.html' ? '/' : '/' + rel.replace(/index\.html$/, ''));
      }
    }
  })(root);
  return out.sort();
}

/* What a reader sees, plus the head fields a crawler reads. */
const SNAPSHOT = () => {
  const jsonld = [...document.querySelectorAll('script[type="application/ld+json"]')]
    .map((s) => { try { return JSON.parse(s.textContent); } catch { return { PARSE_ERROR: s.textContent.slice(0, 200) }; } });
  return {
    text: document.body.innerText,
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content || '',
    canonical: document.querySelector('link[rel="canonical"]')?.href || '',
    jsonld: JSON.stringify(jsonld),
  };
};

/* Every place the candidate lost whitespace the baseline had — not just the
   first. Reporting one diff per page turns a page with four lost spaces into
   four build-and-recheck cycles, which is how the first run of this went.

   The expected change is a pure deletion of whitespace, so two pointers are
   enough: where the characters differ and the baseline's is whitespace, the
   candidate dropped it — record it and advance the baseline alone. A space is
   only *visible* if it sat between two non-space characters, so that is the
   one reported. Anything else is a change this flip is not supposed to be
   able to make, so it is reported separately and loudly. */
function diffs(a, b) {
  const lost = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (/\s/.test(a[i])) {
      const joins = i > 0 && !/\s/.test(a[i - 1]) && !/\s/.test(b[j]);
      if (joins) lost.push(`words run together: ${JSON.stringify(b.slice(Math.max(0, j - 30), j + 30))}`);
      i++;
      continue;
    }
    return { lost, hard: `  UNEXPECTED CHANGE\n    baseline:  ${JSON.stringify(a.slice(Math.max(0, i - 45), i + 45))}\n    candidate: ${JSON.stringify(b.slice(Math.max(0, j - 45), j + 45))}` };
  }
  return { lost, hard: null };
}

const [base, cand] = await Promise.all([serve(BASE_DIR), serve(CAND_DIR)]);
const browser = await puppeteer.launch({
  executablePath: browserPath(), headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
  /* Ours, so puppeteer never deletes it — see browserProfile(). */
  userDataDir: browserProfile('text-equivalence'),
});

let bad = 0, checked = 0;
const missing = [];

try {
  const list = pages(BASE_DIR);
  console.log(`\ntext equivalence: ${list.length} pages, baseline "${BASE_DIR}" vs candidate "${CAND_DIR}"\n`);

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  for (const url of list) {
    const shots = {};
    let skip = false;
    for (const [name, srv] of [['baseline', base], ['candidate', cand]]) {
      const res = await page.goto(`http://127.0.0.1:${srv.port}${url}`, { waitUntil: 'networkidle2', timeout: 45000 });
      if (!res || res.status() !== 200) {
        if (name === 'candidate') missing.push(url);
        skip = true;
        break;
      }
      shots[name] = await page.evaluate(SNAPSHOT);
    }
    if (skip) continue;

    checked++;
    const fields = ['text', 'title', 'description', 'canonical', 'jsonld'];
    const changed = fields.filter((f) => shots.baseline[f] !== shots.candidate[f]);
    if (changed.length === 0) {
      console.log(`OK    ${url}`);
    } else {
      bad++;
      console.log(`FAIL  ${url} — differs in: ${changed.join(', ')}`);
      for (const f of changed) {
        const { lost, hard } = diffs(shots.baseline[f], shots.candidate[f]);
        for (const l of lost) console.log(`    ${f}: ${l}`);
        if (hard) console.log(`    ${f}:
${hard}`);
        if (!lost.length && !hard) console.log(`    ${f}: differs, but not in any space a reader would see`);
      }
    }
  }
} finally {
  await browser.close();
  base.server.close();
  cand.server.close();
}

if (missing.length) {
  bad += missing.length;
  console.log(`\nFAIL  ${missing.length} page(s) in the baseline are missing from the candidate: ${missing.join(', ')}`);
}

console.log(`\n${checked} pages compared, ${bad} differing.`);
console.log(bad === 0
  ? 'Nothing a reader or a crawler sees changed.\n'
  : 'Rendered text or head metadata changed — read the diffs above before shipping.\n');
process.exit(bad === 0 ? 0 : 1);
