/**
 * The interface dictionary has to stay in step with the templates that use it.
 *
 * src/i18n/ui.ts uses the ENGLISH STRING AS THE KEY, which buys a graceful
 * failure — a missing translation renders readable English instead of a raw
 * identifier — but costs a silent one: edit the English copy in a template and
 * its translation stops matching, with nothing to show for it. The Portuguese
 * page simply reverts to English in that one spot.
 *
 * So this asserts the two directions that matter:
 *
 *   1. every `t('…')` call in a template has an entry in the dictionary;
 *   2. every tool name in the dictionary matches the name that same tool is
 *      given in src/data/pt/index.ts. The footer hard-codes its tool list
 *      rather than reading the data, so those two can drift into disagreeing
 *      about what a page is called — the nav saying one thing and the page
 *      itself another.
 *
 * Run: node --test scripts/tests/ui-strings.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const UI = readFileSync('src/i18n/ui.ts', 'utf8');
/* Runtime strings (errors, progress, results) live in their own file since
   2026-09-29, and each tool page ships the ones its component uses — see
   runtime-strings.test.mjs, which checks that per page. */
const UI_RUNTIME = readFileSync('src/i18n/ui-runtime-pt.ts', 'utf8');
const SCOPES = readFileSync('src/i18n/ui-runtime-scopes.ts', 'utf8');

/** Keys of the pt dictionaries, unescaped. */
const known = new Set(
  [...(UI + '\n' + UI_RUNTIME).matchAll(/^\s+'((?:[^'\\]|\\.)*)':\s*'/gm)].map(m =>
    m[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\')
  )
);
/** Keys a tool page ships through its runtime scope. */
const scoped = new Set([...SCOPES.matchAll(/^\s+("(?:[^"\\]|\\.)*"),$/gm)].map(m => JSON.parse(m[1])));

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith('.astro')) out.push(p);
  }
  return out;
}

const templates = [...walk('src/components'), ...walk('src/pages'), ...walk('src/layouts')];

test('the dictionary is populated', () => {
  assert.ok(known.size > 100, `expected a real dictionary, found ${known.size} entries`);
});

test('every t() call in a template has a dictionary entry', () => {
  const missing = [];
  for (const file of templates) {
    const src = readFileSync(file, 'utf8');
    for (const m of src.matchAll(/\bt\(\s*'((?:[^'\\]|\\.)*)'\s*,\s*lang\s*\)/g)) {
      const key = m[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\');
      if (!known.has(key)) missing.push(`${file}: ${key}`);
    }
  }
  assert.deepStrictEqual(
    missing, [],
    `templates asking for strings the dictionary has never heard of:\n${missing.join('\n')}`
  );
});

/** Every string an inline script asks for at runtime. */
function runtimeCalls() {
  const found = new Set();
  for (const file of templates) {
    const src = readFileSync(file, 'utf8');
    for (const m of src.matchAll(/__t\(\s*(['"])((?:(?!\1)[^\\]|\\.)*)\1\s*\)/g)) {
      found.add(m[2].replace(/\\'/g, "'").replace(/\\\\/g, '\\'));
    }
  }
  return found;
}

test('every __t() call in an inline script has a dictionary entry', () => {
  const missing = [...runtimeCalls()].filter(k => !known.has(k));
  assert.deepStrictEqual(missing, [], `runtime strings with no dictionary entry:\n${missing.join('\n')}`);
});

test('every runtime string is in RUNTIME_KEYS, so it is actually shipped', () => {
  // dictionaryFor() sends only RUNTIME_KEYS to the browser, to keep the payload
  // small. A script calling __t('X') where X is absent from that list gets its
  // English fallback — the label would quietly revert mid-session.
  const block = UI.split('const RUNTIME_KEYS = [')[1]?.split('];')[0] ?? '';
  const shipped = new Set(
    [...block.matchAll(/'((?:[^'\\]|\\.)*)'/g)].map(m => m[1].replace(/\\'/g, "'"))
  );
  const unshipped = [...runtimeCalls()].filter(k => !shipped.has(k) && !scoped.has(k));
  assert.deepStrictEqual(
    unshipped, [],
    `called at runtime but not shipped to the browser (add to RUNTIME_KEYS):\n${unshipped.join('\n')}`
  );
});

test('footer tool names agree with the names those pages actually use', () => {
  // The footer's list is hard-coded, so it can drift from src/data/pt/index.ts
  // and have the navigation call a page something the page does not call itself.
  const ptData = readFileSync('src/data/pt/index.ts', 'utf8');
  const pageNames = new Set(
    [...ptData.matchAll(/^\s*name:\s*'((?:[^'\\]|\\.)*)',\s*$/gm)].map(m =>
      m[1].replace(/\\'/g, "'")
    )
  );

  // Bounded to the footer's tool-name block only: the section markers are
  // `// ---- Name ----`, so stop at the next one rather than running on into
  // the converter UI strings, which are labels and not page names.
  const after = UI.split('// ---- Footer: tool names')[1] || '';
  const section = after.split(/\n\s*\/\/ ---- /)[0];
  const footerNames = [...section.matchAll(/:\s*'((?:[^'\\]|\\.)*)',/g)].map(m =>
    m[1].replace(/\\'/g, "'")
  );

  /* Category headings, not tools — they name a group of pages, so no single
     page carries them as its own name. */
  const HEADINGS = new Set(['PDF, dividir e juntar', 'Imagem e OCR']);

  const orphans = footerNames.filter(n => !HEADINGS.has(n) && !pageNames.has(n));
  assert.deepStrictEqual(
    orphans, [],
    `footer calls these tools by a name no Portuguese page uses:\n${orphans.join('\n')}`
  );
});
