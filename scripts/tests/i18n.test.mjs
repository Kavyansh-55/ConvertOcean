/**
 * hreflang and canonical invariants for the multi-locale build.
 *
 * These are asserted against `dist/` rather than the source, because every way
 * this breaks is invisible in the source and silent in the build. There is no
 * error message for "Google threw away your hreflang cluster" — the symptom is
 * simply that translated pages never rank, months later, and the natural
 * diagnosis at that point is "Portuguese SEO is hard" rather than "one link
 * pointed at a URL that does not exist".
 *
 * The specific failures this locks down have all happened, here or elsewhere:
 *
 *   - Layout.astro used to emit one alternate per configured locale on EVERY
 *     page. Turning Portuguese on with that code would have put a /pt/ link on
 *     all ~110 English pages, almost none of which have a translation.
 *   - `public/_redirects` still 301s 27 dead locale folders. Portuguese was
 *     among them; if that rule ever comes back, every page below 301s away and
 *     nothing under /pt/ can be indexed.
 *   - The canonical was built by stripping a locale prefix and re-adding it,
 *     which silently produces /pt/compress-pdf/ once slugs are translated.
 *
 * Run: node --test scripts/tests/i18n.test.mjs   (after a build)
 */
import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';
const SITE = 'https://convertocean.com';

function pages(dir = DIST, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) pages(p, out);
    else if (entry === 'index.html') out.push(p);
  }
  return out;
}

/** `dist/pt/comprimir-pdf/index.html` -> `/pt/comprimir-pdf/` */
function urlPathOf(file) {
  const rel = relative(DIST, file).split(sep).slice(0, -1).join('/');
  return rel ? `/${rel}/` : '/';
}

function attrAll(html, re) {
  return [...html.matchAll(re)].map(m => m[1]);
}

const canonicalOf = html =>
  (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];

const alternatesOf = html =>
  [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)]
    .map(m => ({ lang: m[1], href: m[2] }));

const built = existsSync(DIST) ? pages() : [];
const builtUrls = new Set(built.map(urlPathOf));

test('the build exists (these assertions are meaningless without it)', () => {
  assert.ok(built.length > 50, `expected a full build, found ${built.length} pages`);
});

/* Pages that deliberately canonicalise elsewhere, listed by exact path so a new
   one cannot slip in behind a pattern. /ocr-tools/ is a legacy consolidation
   into /image-tools/ recorded in SEO-ROADMAP.md: it is a redirect stub kept for
   old inbound links, and pointing it at itself would re-split a category that
   was intentionally merged. */
const CANONICAL_EXCEPTIONS = {
  '/ocr-tools/': `${SITE}/image-tools/`
};

test('every page canonicalises to the URL it is actually served at', () => {
  const wrong = [];
  for (const file of built) {
    const path = urlPathOf(file);
    const canonical = canonicalOf(readFileSync(file, 'utf8'));
    const expected = CANONICAL_EXCEPTIONS[path] ?? `${SITE}${path}`;
    if (canonical !== expected) wrong.push(`${path} -> ${canonical} (expected ${expected})`);
  }
  assert.deepStrictEqual(wrong, [], `pages whose canonical is wrong:\n${wrong.join('\n')}`);
});

test('every hreflang target is a page that was actually built', () => {
  const dangling = [];
  for (const file of built) {
    for (const alt of alternatesOf(readFileSync(file, 'utf8'))) {
      const path = alt.href.replace(SITE, '');
      if (!builtUrls.has(path)) dangling.push(`${urlPathOf(file)} [${alt.lang}] -> ${path}`);
    }
  }
  assert.deepStrictEqual(dangling, [], `hreflang links pointing at URLs that do not exist:\n${dangling.join('\n')}`);
});

test('hreflang is reciprocal — if A claims B, B claims A', () => {
  const claims = new Map();
  for (const file of built) {
    const from = urlPathOf(file);
    const targets = alternatesOf(readFileSync(file, 'utf8'))
      .filter(a => a.lang !== 'x-default')
      .map(a => a.href.replace(SITE, ''));
    if (targets.length) claims.set(from, new Set(targets));
  }
  const broken = [];
  for (const [from, targets] of claims) {
    for (const to of targets) {
      if (from === to) continue;
      if (!claims.get(to)?.has(from)) broken.push(`${from} -> ${to}, but not back`);
    }
  }
  assert.deepStrictEqual(broken, [], `non-reciprocal hreflang (Google discards the whole cluster):\n${broken.join('\n')}`);
});

test('a page that lists alternates also lists itself and an x-default', () => {
  const bad = [];
  for (const file of built) {
    const html = readFileSync(file, 'utf8');
    const alts = alternatesOf(html);
    if (!alts.length) continue;
    const self = `${SITE}${urlPathOf(file)}`;
    if (!alts.some(a => a.href === self && a.lang !== 'x-default')) {
      bad.push(`${urlPathOf(file)} does not list itself`);
    }
    if (!alts.some(a => a.lang === 'x-default')) {
      bad.push(`${urlPathOf(file)} has no x-default`);
    }
  }
  assert.deepStrictEqual(bad, [], bad.join('\n'));
});

test('pages with no translation emit no hreflang at all', () => {
  // An hreflang block on a page with a single locale is not merely redundant:
  // it is the shape that invites a dangling /pt/ link the moment someone adds
  // a locale to the config without adding the content.
  const translated = new Set();
  for (const file of built) {
    const alts = alternatesOf(readFileSync(file, 'utf8'));
    if (alts.length) translated.add(urlPathOf(file));
  }
  const offenders = [];
  for (const path of translated) {
    const isPrefixed = /^\/pt\//.test(path);
    const counterpart = isPrefixed
      ? [...translated].some(p => !/^\/pt\//.test(p))
      : [...translated].some(p => /^\/pt\//.test(p));
    if (!counterpart) offenders.push(path);
  }
  assert.deepStrictEqual(offenders, [], offenders.join('\n'));
});

test('no redirect rule swallows a live locale', () => {
  const redirects = readFileSync('public/_redirects', 'utf8');
  const live = ['pt'];
  const swallowed = live.filter(code =>
    new RegExp(`^/${code}/\\*`, 'm').test(redirects)
  );
  assert.deepStrictEqual(
    swallowed, [],
    `these locales are served but still 301 away in public/_redirects: ${swallowed.join(', ')}`
  );
});

test('every built Portuguese page is reachable and not a stub', () => {
  const ptPages = built.filter(f => urlPathOf(f).startsWith('/pt/'));
  assert.ok(ptPages.length > 0, 'no Portuguese pages were built');
  const thin = [];
  for (const file of ptPages) {
    const html = readFileSync(file, 'utf8');
    if (!/<html lang="pt"/.test(html)) thin.push(`${urlPathOf(file)} is not lang="pt"`);
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    if (text.length < 1500) thin.push(`${urlPathOf(file)} has only ${text.length} chars of text`);
  }
  assert.deepStrictEqual(thin, [], thin.join('\n'));
});
