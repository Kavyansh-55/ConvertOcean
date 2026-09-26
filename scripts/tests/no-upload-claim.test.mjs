/**
 * "Never tell users they upload anything" is a non-negotiable in CLAUDE.md,
 * and it shipped twice anyway:
 *
 *   - /guides/excel-to-pdf/ told readers to "define the print area in Excel
 *     before uploading" — which also promised a capability the converter does
 *     not have, since it reads each sheet's used range and never looks at a
 *     print area;
 *   - /excel-converter/ said "reorder them to the front of the workbook in
 *     Excel before uploading".
 *
 * Both are the same slip: describing OUR flow in the words of a hosted
 * converter. The site's whole claim is that nothing leaves the machine, so
 * this is a promise problem, not a style one.
 *
 * Describing what competitors do, and our own "we never upload" claims, are
 * the stated exceptions — so they are allowlisted here by their exact text
 * rather than by a pattern, which would let a new violation through.
 */
import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOTS = ['src/data', 'src/pages', 'src/components'];

// Phrases that only make sense if the reader's file goes somewhere.
const BANNED = [
  'before uploading',
  'after uploading',
  'once uploaded',
  'when you upload it',
  'upload it here',
  'upload your file to convert',
  // /terms/ said "By uploading a file, you acknowledge…" and slipped past the
  // list above for months — on the page where wording is most binding.
  'by uploading',
  'when uploading',
  'while uploading',
  'upload a file to',
  'your uploaded file',
  'the uploaded file',
  // Portuguese: the /pt/ locale can make the same slip in its own words.
  'ao fazer upload',
  'faça upload',
  'faça o upload',
  'fazer o upload do',
  'arquivo enviado',
  'arquivos enviados',
];

/* Lines that legitimately use the word: what competitors do, what other
   platforms do, or our own denial. Matched as substrings of the line. */
const ALLOWED = [
  'Traditional online file converters force you to upload',   // privacy-first
  'Most popular online PDF mergers require you to upload',     // merge guide
  'Most HEIC converters upload your photo',                    // heic copy
  'platforms strip metadata when you upload',                  // exif copy
  'platforms re-compress what you upload',                     // exif faq
  'which makes "upload your file to convert it" a bad deal',   // excel-converter, quoting the model it rejects
  'When logged into Adobe, your uploaded files are saved',     // vs/adobe
  'correction: the English page says "By uploading a file',    // pt/termos, a comment quoting the fixed slip
];

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|astro)$/.test(e)) out.push(p);
  }
  return out;
}

test('no page tells the reader they upload their file to us', () => {
  const hits = [];
  for (const root of ROOTS) {
    for (const file of walk(root)) {
      readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
        const low = line.toLowerCase();
        if (!BANNED.some(b => low.includes(b))) return;
        if (ALLOWED.some(a => line.includes(a))) return;
        hits.push(`${file}:${i + 1}  ${line.trim().slice(0, 130)}`);
      });
    }
  }
  assert.deepStrictEqual(hits, [],
    'Conversion runs in the browser, so nothing is uploaded. Rewrite as ' +
    '"before converting" / "when you choose the file". If the line really is ' +
    'describing a competitor, add its exact text to ALLOWED.\n' + hits.join('\n'));
});
