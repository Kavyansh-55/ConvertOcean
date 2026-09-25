/**
 * Every internal link must point at a page that was actually built.
 *
 * This exists because of a bug that reached 75 pages without a single warning
 * from anything. Header and Footer built their locale links by prefixing:
 * `/compress-pdf/` became `/pt/compress-pdf/`. Portuguese slugs are translated,
 * so the page is really at `/pt/comprimir-pdf/` and the prefixed URL 404s.
 *
 * The result was 76 distinct dead links — every tool in the footer, every
 * category in the nav, the sitemap link, and the logo — repeated on all 75
 * Portuguese pages. The build succeeded. The pages rendered. The hreflang tests
 * passed, because hreflang was derived from the content graph while navigation
 * was not. Nothing anywhere said a word.
 *
 * It is exactly the shape of failure the rest of this project keeps running
 * into: something that is invisible in the source, silent in the build, and
 * only observable by looking at the finished artefact. So this looks at the
 * finished artefact.
 *
 * Run: node --test scripts/tests/i18n-links.test.mjs   (after a build)
 */
import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const allFiles = existsSync(DIST) ? walk(DIST) : [];
const htmlFiles = allFiles.filter(f => f.endsWith('index.html'));

/** `dist/pt/comprimir-pdf/index.html` -> `/pt/comprimir-pdf/` */
const urlOf = f => {
  const rel = relative(DIST, f).split(sep).slice(0, -1).join('/');
  return rel ? `/${rel}/` : '/';
};

/** Every URL the build actually serves: pages plus static assets. */
const builtPages = new Set(htmlFiles.map(urlOf));
const builtAssets = new Set(
  allFiles.map(f => '/' + relative(DIST, f).split(sep).join('/'))
);

/* Paths handled by Cloudflare redirects rather than by a built file. Listed
   explicitly so a genuinely dead link can never hide behind a pattern. */
const REDIRECTS = new Set(['/ocr-tools/']);

function internalLinks(html) {
  return [...html.matchAll(/href="(\/[^"]*)"/g)]
    .map(m => m[1])
    .filter(h => !h.startsWith('//'))
    .map(h => h.split('#')[0].split('?')[0])
    .filter(Boolean);
}

test('the build exists', () => {
  assert.ok(htmlFiles.length > 50, `expected a full build, found ${htmlFiles.length} pages`);
});

test('every internal link resolves to a page or asset that was built', () => {
  const broken = new Map();
  for (const file of htmlFiles) {
    const from = urlOf(file);
    for (const href of internalLinks(readFileSync(file, 'utf8'))) {
      const asPage = href.endsWith('/') ? href : `${href}/`;
      if (builtPages.has(asPage) || builtAssets.has(href) || REDIRECTS.has(asPage)) continue;
      if (!broken.has(href)) broken.set(href, new Set());
      broken.get(href).add(from);
    }
  }
  const report = [...broken.entries()]
    .sort((a, b) => b[1].size - a[1].size)
    .map(([href, pages]) => `${href}  —  linked from ${pages.size} page(s), e.g. ${[...pages][0]}`);
  assert.deepStrictEqual(report, [], `internal links pointing at pages that do not exist:\n${report.join('\n')}`);
});

test('no Portuguese page links to a /pt/ URL that does not exist', () => {
  // The narrower assertion, kept separate so its failure names the real cause:
  // a locale link built by prefixing rather than resolved through the graph.
  const broken = [];
  for (const file of htmlFiles.filter(f => urlOf(f).startsWith('/pt/'))) {
    for (const href of internalLinks(readFileSync(file, 'utf8'))) {
      if (!href.startsWith('/pt/')) continue;
      const asPage = href.endsWith('/') ? href : `${href}/`;
      if (!builtPages.has(asPage)) broken.push(`${urlOf(file)} -> ${href}`);
    }
  }
  assert.deepStrictEqual(
    [...new Set(broken.map(b => b.split(' -> ')[1]))], [],
    `dead /pt/ links — a prefixed guess instead of a resolved path:\n${[...new Set(broken)].slice(0, 20).join('\n')}`
  );
});
