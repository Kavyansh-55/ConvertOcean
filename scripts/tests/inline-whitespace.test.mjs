/**
 * Does any template rely on a line break to put a space between words?
 *
 * `compressHTML: 'jsx'` strips whitespace around inline elements by JSX rules,
 * which means a newline is no longer a space. This template:
 *
 *     The source code is public at
 *     <a href="...">github.com/Kavyansh-55/ConvertOcean</a>.
 *
 * shipped as "public atgithub.com/..." — two words run together on an indexed
 * page. Four such spots existed when the setting was flipped; all four were on
 * pages a reader reads rather than a tool they use, which is exactly where a
 * typo is least likely to be noticed by the people building the tools.
 *
 * The rendered comparison that found them needed two builds to diff against
 * each other, so it cannot guard the next edit. This can: it is a static read
 * of the templates, and the fix it asks for is the JSX idiom `{' '}` at the
 * end of the line.
 *
 *   node --test scripts/tests/inline-whitespace.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOTS = ['src/pages', 'src/components', 'src/layouts'];

/** Elements that sit inside a line of text, where a missing space shows. */
const OPENS_INLINE = /^<(?:a|span|strong|em|b|i|code|abbr|small|sup|sub|time|kbd|mark|u|q|cite|label)[\s>]/;
const CLOSES_INLINE = /<\/(?:a|span|strong|em|b|i|code|abbr|small|sup|sub|time|kbd|mark|u|q|cite|label)>[.,;:!?)"'\u2019\u201d]*$/;

function astroFiles(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) astroFiles(p, out);
    else if (e.name.endsWith('.astro')) out.push(p);
  }
  return out;
}

/**
 * Lines where a line break is carrying a space between text and an inline
 * element. Two shapes, mirror images of each other:
 *
 *   word\n<a>...        text, then an inline element on the next line
 *   </a>\nword          an inline element, then text on the next line
 *
 * A line already ending in `{' '}` has been fixed. A line ending in an opening
 * or closing *block* tag is not text, so nothing is lost there — that is the
 * overwhelming majority of line breaks in these files and none of it is
 * flagged.
 */
export function findings(src, file) {
  const out = [];
  const lines = src.split('\n');
  /* Style and script bodies are not markup; a line break inside them is not a
     space and never was. */
  let inRaw = false;
  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i];
    if (/<(style|script)[\s>]/.test(line)) inRaw = true;
    if (/<\/(style|script)>/.test(line)) { inRaw = false; continue; }
    if (inRaw) continue;

    const here = line.replace(/\s+$/, '');
    const next = lines[i + 1].replace(/^\s+/, '');
    if (!here || !next) continue;
    if (here.endsWith("{' '}") || here.endsWith('{" "}')) continue;
    if (here.trimStart().startsWith('<!--') || here.endsWith('-->')) continue;

    const textThenInline =
      /[\w,;:)\]"'\u2019\u201d.!?-]$/.test(here) && OPENS_INLINE.test(next);

    const inlineThenText =
      CLOSES_INLINE.test(here) && /^[\w"'\u201c\u2018(]/.test(next);

    if (textThenInline || inlineThenText) {
      out.push(`${relative('.', file).split(sep).join('/')}:${i + 1}  ${here.trim().slice(-60)}  ⏎  ${next.slice(0, 50)}`);
    }
  }
  return out;
}

test('no template depends on a line break for a space between words', () => {
  const all = [];
  for (const root of ROOTS) for (const file of astroFiles(root)) {
    all.push(...findings(readFileSync(file, 'utf8'), file));
  }

  assert.deepEqual(
    all, [],
    'Under `compressHTML: \'jsx\'` a line break between text and an inline ' +
    'element is not a space, so these render as two words run together. End ' +
    `the first line with {' '}:\n  ${all.join('\n  ')}\n`,
  );
});

/* The check has to fail on the thing that actually shipped, or it is decoration. */
test('it catches the shape that shipped, and leaves block markup alone', () => {
  const broke = [
    '<p>',
    '  The source code is public at',
    '  <a href="https://example.com">example.com</a>.',
    '</p>',
  ].join('\n');
  assert.equal(findings(broke, 'x.astro').length, 1, 'should flag text followed by a link');

  const fixed = broke.replace('public at', "public at{' '}");
  assert.deepEqual(findings(fixed, 'x.astro'), [], "{' '} should clear it");

  const blocks = [
    '<div class="card">',
    '  <h2>Merge PDF</h2>',
    '  <p>Combine files.</p>',
    '</div>',
  ].join('\n');
  assert.deepEqual(findings(blocks, 'x.astro'), [], 'block markup must not be flagged');
});
