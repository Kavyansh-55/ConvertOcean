/**
 * The "never tell users they upload anything" rule, in Portuguese.
 *
 * `no-upload-claim.test.mjs` guards the English copy by banning English
 * phrasings, so it cannot see a Portuguese breach at all — and Portuguese is
 * where this is most likely to slip, for a reason specific to the language:
 * `enviar` and `carregar` are the ordinary verbs for "send" and "load", and
 * both are ALSO the standard Brazilian words for "upload". A translator, human
 * or machine, rendering "drop your file in" will reach for "envie seu arquivo"
 * without ever intending to make a claim about servers.
 *
 * That phrase promises the exact opposite of what the site does. It is the one
 * claim the whole project rests on, so it gets its own guard in each language
 * rather than a shared one.
 *
 * As in the English test, describing what other services do — and our own
 * denials — are the exceptions, allowlisted by exact text so that a new
 * violation cannot hide behind a pattern.
 *
 * Run: node --test scripts/tests/pt-no-upload-claim.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src/data/pt';

/* Phrasings that tell the reader their file goes somewhere. `enviar` and
   `carregar` are listed with the object that makes them an upload claim —
   "envie" alone is a normal verb and banning it outright would be unusable. */
const BANNED = [
  'envie seu arquivo',
  'envie o arquivo',
  'enviar seu arquivo',
  'enviar o arquivo para',
  'carregue seu arquivo',
  'carregue o arquivo',
  'carregar seu arquivo',
  'faça o upload',
  'fazer upload',
  'após o upload',
  'depois de enviar o arquivo',
  'seus arquivos são enviados',
];

/* Lines that legitimately use the words: what other services do, what an
   official system requires of the reader, or our own denial. */
const ALLOWED = [
  'não é copiado para nenhum servidor',
  'não são copiadas para',
  'sem que o arquivo saia',
  'sem que nada saia',
  'sem que as imagens saiam',
  'sem enviar nada para servidores',
];

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.ts$/.test(entry)) out.push(p);
  }
  return out;
}

test('no Portuguese page tells the reader they upload their file to us', () => {
  const hits = [];
  for (const file of walk(ROOT)) {
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      const lower = line.toLowerCase();
      if (ALLOWED.some(a => lower.includes(a.toLowerCase()))) return;
      for (const phrase of BANNED) {
        if (lower.includes(phrase)) hits.push(`${file}:${i + 1}  ${phrase}  —  ${line.trim().slice(0, 120)}`);
      }
    });
  }
  assert.deepStrictEqual(
    hits, [],
    `Portuguese copy claiming the reader uploads something:\n${hits.join('\n')}`
  );
});

test('the Portuguese locale states the no-upload promise somewhere', () => {
  // The inverse failure: copy that is merely silent about privacy. The promise
  // is the site's entire differentiator against iLovePDF and Smallpdf in this
  // market, and a translation that drops it gives a Brazilian reader no reason
  // to pick this over an incumbent they already know.
  const text = walk(ROOT).map(f => readFileSync(f, 'utf8')).join('\n').toLowerCase();
  const madeClaim = ALLOWED.some(a => text.includes(a.toLowerCase()));
  assert.ok(madeClaim, 'no Portuguese page states that files stay on the device');
});
