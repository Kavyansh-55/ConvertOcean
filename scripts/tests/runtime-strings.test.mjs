/**
 * Every string a script puts on screen must exist in Portuguese — and reach
 * the browser.
 *
 * Found 2026-09-29: a Portuguese page rendered in Portuguese and then spoke
 * English the moment anything happened. Compress PDF reported "Already as
 * small as it goes" and "43% smaller"; every tool's errors and progress
 * labels, the calculators' formulas, the EXIF tag names and the JSON
 * formatter's diagnoses were English. verify-pt-leaks.mjs reads the page as
 * first rendered, so none of it was ever in front of that check. About 560
 * strings.
 *
 * Four assertions, each closing one way it happened:
 *
 *   1. every runtime key (__t / __tf / tr, plus values translated where they
 *      are displayed) has a Portuguese entry;
 *   2. every one of them is SHIPPED — dictionaryFor() sends only RUNTIME_KEYS
 *      and the keys of ui-runtime-pt.ts, and a translation that exists but is
 *      not shipped is just as English in the browser;
 *   3. no tool calls showError/showProgress with bare English;
 *   4. no prose literal in browser code bypasses translation
 *      (scripts/i18n/untranslated-literals.mjs), except the listed cases.
 *
 * Run: node --test scripts/tests/runtime-strings.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { runtimeKeys } from '../i18n/runtime-keys.mjs';
import { findUntranslated, ALL_FILES } from '../i18n/untranslated-literals.mjs';
import { buildScopes, renderScopes, SCOPES_FILE } from '../i18n/build-scopes.mjs';
import { findBareText, SHARED_COMPONENTS } from '../i18n/bare-template-text.mjs';

const unq = (s) => s.replace(/\\'/g, "'").replace(/\\\\/g, '\\');
const UI = readFileSync('src/i18n/ui.ts', 'utf8');
const RT = readFileSync('src/i18n/ui-runtime-pt.ts', 'utf8');

const KEY = /^\s+'((?:[^'\\]|\\.)*)':\s*['"`]/gm;
const ptMain = new Set([...UI.matchAll(KEY)].map((m) => unq(m[1])));
const ptRun = new Set([...RT.matchAll(KEY)].map((m) => unq(m[1])));
const listStart = UI.indexOf('const RUNTIME_KEYS');
const listEnd = UI.indexOf('];', listStart);
const runtimeList = new Set(
  [...UI.slice(listStart, listEnd).matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((m) => unq(m[1])));

const { keys } = runtimeKeys();

test('the extractor finds a real set of runtime strings', () => {
  // A regex that silently matched nothing would pass everything below.
  assert.ok(keys.size > 500, `only ${keys.size} runtime keys found`);
  assert.ok(ptRun.size > 500, `only ${ptRun.size} entries parsed from ui-runtime-pt.ts`);
});

test('every runtime string has a Portuguese entry', () => {
  const missing = [...keys.keys()].filter((k) => !ptMain.has(k) && !ptRun.has(k));
  assert.deepStrictEqual(missing, [],
    'No Portuguese for these — add them to src/i18n/ui-runtime-pt.ts:\n' +
    missing.map((k) => `  ${JSON.stringify(k)}  (${keys.get(k)[0]})`).join('\n'));
});

test('the per-tool scope file is current', () => {
  const committed = readFileSync(SCOPES_FILE, 'utf8').replace(/\r\n/g, '\n');
  assert.strictEqual(committed, renderScopes(buildScopes()),
    `${SCOPES_FILE} is stale — run: node scripts/i18n/build-scopes.mjs`);
});

test('every runtime string is shipped to the page that shows it', () => {
  /* dictionaryFor(lang, scope) sends RUNTIME_KEYS to every page, and a tool
     page's scope (its component + modules + shared). A string used anywhere
     else — a page, the layout, a shared component — must be in RUNTIME_KEYS,
     or it has a translation the browser never receives. */
  const scopes = buildScopes();
  const scoped = new Set(Object.values(scopes).flat());
  const unshipped = [];
  for (const [k, where] of keys) {
    if (runtimeList.has(k)) continue;
    const outsideTools = where.some((w) => {
      const f = w.replace(/\\/g, '/');
      return !f.startsWith('src/components/tools/') && !f.startsWith('src/scripts/') && !f.startsWith('src/scripts');
    });
    if (outsideTools || !scoped.has(k)) unshipped.push(`${JSON.stringify(k)}  (${where[0]})`);
  }
  assert.deepStrictEqual(unshipped, [],
    'Translated but never sent to the browser — add to RUNTIME_KEYS (used outside a tool) ' +
    'or rerun build-scopes.mjs:\n' + unshipped.join('\n'));
});

test('Portuguese entries keep every {n} slot the English has', () => {
  // Dropping a slot on purpose is allowed only where the noun would need
  // gender agreement; list it here with the reason.
  const MAY_DROP = new Set([
    'This {0} opened correctly but has nothing in it to convert. If you expected content, check you picked the right file — an empty one is often a partly-finished download or a template saved before anything was added.',
  ]);
  const bad = [];
  for (const m of RT.matchAll(/^\s+'((?:[^'\\]|\\.)*)':\s*'((?:[^'\\]|\\.)*)',$/gm)) {
    const en = unq(m[1]), pt = unq(m[2]);
    const slots = (s) => (s.match(/\{\d\}/g) || []).sort().join();
    const tags = (s) => (s.match(/<\/?[a-z]+/g) || []).sort().join();
    if (slots(en) !== slots(pt) && !MAY_DROP.has(en)) bad.push(`slots  ${en.slice(0, 60)}`);
    if (tags(en) !== tags(pt)) bad.push(`tags   ${en.slice(0, 60)}`);
  }
  assert.deepStrictEqual(bad, [], bad.join('\n'));
});

test('no tool passes bare English to showError or showProgress', () => {
  const dir = 'src/components/tools';
  const bad = [];
  for (const f of readdirSync(dir)) {
    const src = readFileSync(join(dir, f), 'utf8');
    for (const m of src.matchAll(/\b(showError|showProgress|showErr|showProg)\(\s*(?:[^,()'"`]+,\s*)?(['"`])/g)) {
      bad.push(`${f}:${src.slice(0, m.index).split('\n').length}  ${src.slice(m.index, m.index + 70)}`);
    }
  }
  assert.deepStrictEqual(bad, [], 'Wrap the message in __t(…) or __tf(…):\n' + bad.join('\n'));
});

test('no component writes interface text into its markup without t()', () => {
  /* "Words", "Minify", "Limit:", "Top Keywords" rendered in English on the
     Portuguese pages — bare text in the template, too short for pt-leaks to
     judge. Same-in-both names (formats, brands, sizes) are allowed in
     scripts/i18n/bare-template-text.mjs. */
  const hits = findBareText(SHARED_COMPONENTS);
  assert.deepStrictEqual(hits.map((h) => `${h.file}:${h.line}  ${h.text}`), [],
    'Wrap these in {t(\'…\', lang)} and add the Portuguese to src/i18n/ui.ts.');
});

test('no runtime-built HTML carries an English label, title or alt', () => {
  /* aria-label="Remove ${file.name}", title="Move Up": attribute text inside
     a script's HTML string, which neither the literal scan (it needs three
     words) nor pt-leaks (it reads first render) could see. */
  const dir = 'src/components/tools';
  const bad = [];
  for (const f of readdirSync(dir)) {
    const src = readFileSync(join(dir, f), 'utf8');
    for (const block of src.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
      for (const m of block[1].matchAll(/\b(aria-label|title|alt|placeholder)="([A-Za-z][^"$]*)/g)) {
        bad.push(`${f}  ${m[1]}="${m[2].slice(0, 50)}`);
      }
    }
  }
  assert.deepStrictEqual(bad, [], 'Translate with ${__t(…)} / ${__tf(…)}:\n' + bad.join('\n'));
});

/* Prose literals that are allowed to stay English, each with the reason. */
const ALLOWED = [
  // Never rendered: a dead component no page imports.
  [/HeroDropzone\.astro$/, /./],
  // Error objects for the console and tests; users see libraryUnavailableMessage().
  [/ensure-lib\.js$/, /could not be loaded|no browser environment|no source URLs known/],
  // Data translated where it is displayed (see DISPLAY_KEYS_BY_SOURCE).
  [/exif-parse\.js$/, /./],
  [/image-compress\.js$/, /Safe for printing|Best size for screen|Smallest file/],
  [/pdf-fonts\.js$/, /Chinese, Japanese|an unsupported script/],
  [/json-locate\.js$/, /the closing quote of this string/],
  // Word XML, not prose.
  [/pdf-to-docx\.js$/, /xmlns:w=/],
];

test('no prose in browser code bypasses translation', () => {
  const hits = findUntranslated(ALL_FILES).filter((h) =>
    !ALLOWED.some(([file, text]) => file.test(h.file.replace(/\\/g, '/')) && text.test(h.text)));
  assert.deepStrictEqual(hits.map((h) => `${h.file}:${h.line}  ${h.text}`), [],
    'English sentences a script can put on screen without going through __t/__tf/tr.');
});
