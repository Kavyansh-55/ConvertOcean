/**
 * Indonesian researched keywords must reach their page unaltered.
 *
 * The same rule as pt-keywords-verbatim.test.mjs: src/data/id/keywords.ts holds
 * the exact queries Kavya supplied from Ahrefs (country: Indonesia), and a
 * later "tidy-up" that turns `cara mengubah pdf ke word` into "Cara mengubah
 * PDF ke Word?" silently stops matching the query the page was built for.
 *
 * What is enforced, for every researched page:
 *   - the page exists, and no Indonesian tool page exists without research;
 *   - the primary term appears on the page;
 *   - every phrase and question reported at >100 or more appears verbatim
 *     (sub-100 spelling variants are recorded but not required — stacking all
 *     of them would be keyword stuffing);
 *   - no excluded term (competitor brands, software how-tos) appears anywhere.
 *
 * Node 24 strips the TypeScript types on import, so the data files are read as
 * modules rather than scraped as text — no CRLF block-splitting to go vacuous
 * (the failure pt-keywords-verbatim had), and a floor below guards anyway.
 *
 * Run: node --test scripts/tests/id-keywords-verbatim.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert';
import { pageKeywords, excluded } from '../../src/data/id/keywords.ts';
import { idTools } from '../../src/data/id/index.ts';

const textOf = (t) => [t.title, t.description, t.headline, t.subtitle, t.quickAnswer, t.content,
  ...t.faqs.flatMap(f => [f.question, f.answer])]
  .join(' \n ').replace(/<[^>]+>/g, ' ').toLowerCase();

test('the check is not vacuous', () => {
  assert.ok(pageKeywords.length >= 30, `only ${pageKeywords.length} researched pages read`);
  assert.ok(idTools.length >= 30, `only ${idTools.length} Indonesian tool pages read`);
});

test('every researched page exists, and every page was researched', () => {
  const pages = new Set(idTools.map(t => t.slug));
  const researched = new Set(pageKeywords.map(k => k.slug));
  assert.deepStrictEqual(pageKeywords.filter(k => !pages.has(k.slug)).map(k => k.slug), []);
  assert.deepStrictEqual(idTools.filter(t => !researched.has(t.slug)).map(t => t.slug), []);
});

test('researched terms of 100+ searches appear verbatim on their page', () => {
  const missing = [];
  for (const k of pageKeywords) {
    const page = idTools.find(t => t.slug === k.slug);
    if (!page) continue;
    const body = textOf(page);
    if (!body.includes(k.primary)) missing.push(`${k.slug}: primary "${k.primary}"`);
    for (const q of [...k.phrase, ...k.questions]) {
      if (q.volume !== '<100' && !body.includes(q.term)) missing.push(`${k.slug}: "${q.term}" (${q.volume})`);
    }
  }
  assert.deepStrictEqual(missing, []);
});

test('excluded terms (competitor brands, software how-tos) appear nowhere', () => {
  const all = idTools.map(textOf).join('\n');
  assert.deepStrictEqual(excluded.filter(e => all.includes(e.term)).map(e => e.term), []);
});
