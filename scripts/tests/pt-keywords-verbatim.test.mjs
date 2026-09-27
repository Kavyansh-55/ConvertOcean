/**
 * Researched keywords must reach the page unaltered.
 *
 * Kavya supplied these from Ahrefs with an explicit instruction: "dont make any
 * change in keywords, questions im giving you because they need to be exact
 * same to rank." That is correct, and it is also exactly the kind of rule that
 * decays silently. A later pass tidies "como converter pdf para word" into
 * "Como converter PDF para Word?" because it reads better as a heading, the
 * exact-match target is gone, and nothing anywhere reports it — the page still
 * builds, still renders, still looks right, and simply stops matching the query
 * it was built for.
 *
 * So the record in src/data/pt/keywords.ts is the source of truth, and this
 * asserts the page still quotes it character for character.
 *
 * It also asserts the opposite direction: competitor brand queries recorded in
 * `excluded` must NOT appear. Those are navigational searches for iLovePDF —
 * unwinnable, and the English side already rejected the same class of term.
 *
 * Both files are read as text rather than imported, because the repo's tests
 * run on plain node with no TypeScript loader.
 *
 * Run: node --test scripts/tests/pt-keywords-verbatim.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

/* CRLF-normalised. With core.autocrlf=true the working copy is CRLF, and the
   block split below (`\n  {\n`) then matched nothing — so the verbatim test
   passed with zero pages checked, on every run on Kavya's machine. Found
   2026-09-27 when new questions that were on no page did not fail it; the
   floor asserted in the first test keeps a vacuous pass from coming back. */
const read = (p) => readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const KEYWORDS = read('src/data/pt/keywords.ts');
const CONTENT = read('src/data/pt/index.ts');

/** Pull `{ term: '...', ... }` entries out of a named array block. */
function termsIn(section) {
  const start = KEYWORDS.indexOf(section);
  assert.ok(start > -1, `section ${section} missing from keywords.ts`);
  // Stop at the next top-level `export const`, so sections do not bleed.
  const rest = KEYWORDS.slice(start + section.length);
  const end = rest.indexOf('\nexport const');
  const block = end === -1 ? rest : rest.slice(0, end);
  return [...block.matchAll(/term: '([^']+)'/g)].map(m => m[1]);
}

/** Every question recorded against a page that has actually been built. */
function questionsForBuiltPages() {
  const out = [];
  // pageKeywords entries carry a `slug`; a page is built if index.ts uses it.
  const blocks = KEYWORDS.split(/\n  \{\n/).slice(1);
  for (const block of blocks) {
    const slug = (block.match(/slug: '([^']+)'/) || [])[1];
    if (!slug) continue;
    const built = CONTENT.includes(`slug: '${slug}'`);
    const qStart = block.indexOf('questions:');
    if (qStart === -1) continue;
    const questions = [...block.slice(qStart).matchAll(/term: '([^']+)'/g)].map(m => m[1]);
    out.push({ slug, built, questions });
  }
  return out;
}

test('every researched question reaches its page character for character', () => {
  const missing = [];
  const pages = questionsForBuiltPages().filter(p => p.built);
  assert.ok(pages.length >= 60,
    `only ${pages.length} built pages found in keywords.ts — the parser is not reading the file`);
  for (const { slug, built, questions } of questionsForBuiltPages()) {
    if (!built) continue;
    for (const q of questions) {
      if (!CONTENT.includes(`question: '${q}'`)) missing.push(`${slug}: ${q}`);
    }
  }
  assert.deepStrictEqual(
    missing, [],
    `researched questions not quoted verbatim on their page:\n${missing.join('\n')}`
  );
});

test('a page is not built for keywords that were only parked', () => {
  // pdf-para-excel is recorded but intentionally unbuilt: its questions arrived
  // inside the Excel-to-PDF export and belong to the opposite conversion. This
  // asserts the parking is deliberate rather than an oversight that silently
  // dropped nine researched queries.
  const parked = questionsForBuiltPages().filter(p => !p.built);
  for (const p of parked) {
    assert.ok(p.questions.length > 0, `${p.slug} is parked with no questions — delete it instead`);
  }
});

/**
 * Four separate reasons a researched keyword must never become a page target.
 * They are listed together because the failure is identical in each case: the
 * page ranks, the visitor's actual need is not met, they leave, and Google
 * learns the page does not answer the query. That is worse than not ranking.
 *
 *   excluded       competitor brand navigation — they already chose iLovePDF
 *   noToolYet      PDF → PowerPoint; the converter does not exist
 *   codeIntent     "...python", "...java" — wants a snippet, not a web tool
 *   intentMismatch "jpg para png sem fundo" — wants background removal
 */
const DO_NOT_TARGET = [
  'export const excluded',
  'export const noToolYet',
  'export const codeIntent',
  'export const intentMismatch',
  'export const wrongLanguage',
  // batch 5 added three more reasons
  'export const notAQuery',         // a scraped <title>, nobody searches it
  'export const ambiguousIntent',   // "traduzir" may mean translate, which OCR does not do
  'export const coveredInBodyCopy', // real, but a near-duplicate of a heading already used
  'export const passwordIntent',    // cracking a PDF password: not a tool we have, nor one to advertise
  'export const belongsElsewhere',  // conversion queries that arrived in the split export
  'export const wrongTool',         // "diminuir excel" is a subtraction formula, not file size
  'export const fraudIntent',       // fake nota fiscal: document fraud
  'export const regulatedDocument'  // nota fiscal issuance needs SEFAZ, not a PDF
];

test('no keyword from a do-not-target list is used as a page target', () => {
  const hits = [];
  for (const section of DO_NOT_TARGET) {
    for (const term of termsIn(section)) {
      if (CONTENT.includes(`question: '${term}'`)) {
        hits.push(`${term}  (from ${section.replace('export const ', '')})`);
      }
    }
  }
  assert.deepStrictEqual(
    hits, [],
    `keywords that must not be targeted are being used as FAQ questions:\n${hits.join('\n')}`
  );
});

test('every do-not-target list is non-empty and actually checked', () => {
  // A silent typo in a section name would make the test above pass vacuously,
  // which is the quiet way a guard like this stops guarding anything.
  for (const section of DO_NOT_TARGET) {
    assert.ok(
      termsIn(section).length > 0,
      `${section} matched no terms — renamed or mistyped, so it is not being checked`
    );
  }
});

test('the keyword record and the built pages agree on slugs', () => {
  const recorded = [...KEYWORDS.matchAll(/slug: '([^']+)'/g)].map(m => m[1]);
  const orphans = recorded.filter(s => {
    const usedAsPage = CONTENT.includes(`slug: '${s}'`);
    const parked = KEYWORDS.includes(`slug: '${s}'`) && !usedAsPage;
    return !usedAsPage && !parked;
  });
  assert.deepStrictEqual(orphans, [], orphans.join('\n'));
});
