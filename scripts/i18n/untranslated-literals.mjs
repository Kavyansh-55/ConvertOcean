/**
 * List English sentences inside tool scripts that bypass translation.
 *
 * The Portuguese leak scan (verify-pt-leaks.mjs) reads a page as it first
 * renders. Everything a script writes afterwards — results, reports, errors,
 * progress — only reached Portuguese if it went through __t/__tf, and most of
 * it did not: /pt/comprimir-pdf/ said "Already as small as it goes" and
 * "43% smaller" in English, found 2026-09-29. This finds those strings by
 * reading the source, so they are caught without driving every code path.
 *
 * A literal is reported when it looks like prose (three or more words, one of
 * them a common English word) and is not an argument of __t/__tf/tr/t, not in
 * a comment, and not a console message.
 *
 * Used by scripts/tests/runtime-strings.test.mjs; run directly to see the list:
 *   node scripts/i18n/untranslated-literals.mjs
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const EN = new Set(('the and your you to of for with this that is are it in on from or be can ' +
  'will not no only all its their was were has have been could would should there than ' +
  'into by as at an which what when so but if any each every page pages file files image ' +
  'images document smaller saved already try please failed could').split(' '));

/** Strip comments while keeping string literals intact (and line numbers). */
function stripComments(src) {
  let out = '', i = 0, q = null;
  while (i < src.length) {
    const c = src[i], n = src[i + 1];
    if (q) {
      out += c;
      if (c === '\\') { out += n || ''; i += 2; continue; }
      if (c === q) q = null;
      i++; continue;
    }
    if (c === "'" || c === '"' || c === '`') { q = c; out += c; i++; continue; }
    if (c === '/' && n === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
    if (c === '/' && n === '*') {
      i += 2;
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) { if (src[i] === '\n') out += '\n'; i++; }
      i += 2; continue;
    }
    // A regex literal can hold quote characters; skip simple ones after ( , = : [ ! & | ?
    if (c === '/' && /[(,=:[!&|?;{}]$|\breturn$|^$/.test(out.replace(/\s+$/, '').slice(-6))) {
      // Replace the regex body with spaces so its quotes are not read as strings.
      out += ' '; i++;
      let inClass = false;
      while (i < src.length && src[i] !== '\n') {
        const d = src[i];
        if (d === '\\') { out += '  '; i += 2; continue; }
        if (d === '[') inClass = true;
        else if (d === ']') inClass = false;
        else if (d === '/' && !inClass) { out += ' '; i++; break; }
        out += ' '; i++;
      }
      continue;
    }
    out += c; i++;
  }
  return out;
}

/**
 * Is the string at `at` inside the argument list of __t/__tf/tr/t? Walks back
 * to the innermost unclosed "(" — so a template on the line after `__tf(`, or
 * one branch of a ternary inside it, counts as wrapped. Strings are skipped
 * while walking so parentheses inside them do not count.
 */
function insideTranslator(code, at) {
  let depth = 0;
  for (let i = at - 1; i >= 0; i--) {
    const c = code[i];
    if (c === "'" || c === '"' || c === '`') {
      // skip back over the string literal that ends here
      let j = i - 1;
      while (j >= 0 && !(code[j] === c && code[j - 1] !== '\\')) j--;
      i = j; continue;
    }
    if (c === ')') depth++;
    else if (c === '(') {
      if (depth === 0) {
        const name = code.slice(Math.max(0, i - 8), i).match(/([\w$.]+)\s*$/);
        if (name && /(^|\.)(__tf?|tr|t)$/.test(name[1])) return true;
        // keep looking outward: __tf(cond ? 'a' : 'b') has no inner call,
        // but __tf(x.map(...)) nests one.
      } else depth--;
    } else if (c === ';' && depth === 0) return false;
    else if (c === '{' && depth === 0) return false;
  }
  return false;
}

/** The script bodies of an .astro file (what runs in the browser). */
function scripts(src) {
  return [...src.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map((m) => ({
    body: m[1], line: src.slice(0, m.index).split('\n').length,
  }));
}

export function findUntranslated(files) {
  const hits = [];
  for (const file of files) {
    const src = readFileSync(file, 'utf8');
    const blocks = file.endsWith('.astro') ? scripts(src) : [{ body: src, line: 1 }];
    for (const { body, line } of blocks) {
      const code = stripComments(body);
      for (const m of code.matchAll(/(['"`])((?:(?!\1)[^\\]|\\.)*)\1/g)) {
        const lit = m[2];
        const at = m.index;
        const lineNo = line + code.slice(0, at).split('\n').length - 1;
        const L = code.slice(code.lastIndexOf('\n', at) + 1, code.indexOf('\n', at) === -1 ? undefined : code.indexOf('\n', at));
        if (/console\.(log|warn|error|info)|new Error\(/.test(L)) continue;
        const text = lit.replace(/<[^>]+>/g, ' ').replace(/\$\{[^}]*\}/g, ' ');
        // Prose has spaces between words; class names, MIME types and file
        // names do not.
        if (!/[a-z]{2,}\s+[a-z]{2,}/i.test(text)) continue;
        const words = text.toLowerCase().match(/[a-z']+/g) || [];
        if (words.length < 3) continue;
        if (!words.some((w) => EN.has(w))) continue;
        if (insideTranslator(code, at)) continue;
        // CSS declarations are not prose.
        if (/^[\s\w-]+:\s*[^;]+;/.test(lit)) continue;
        hits.push({ file, line: lineNo, text: lit.slice(0, 110) });
      }
    }
  }
  return hits;
}

export const TOOL_FILES = [
  ...readdirSync('src/components/tools').filter((f) => f.endsWith('.astro')).map((f) => join('src/components/tools', f)),
];

/** Everything else that runs in the browser: pages, layouts, shared
    components and the modules the tools import. */
function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(astro|js)$/.test(e.name)) out.push(p);
  }
  return out;
}
export const ALL_FILES = [...walk('src/components'), ...walk('src/pages'), ...walk('src/layouts'), ...walk('src/scripts')];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const hits = findUntranslated(process.argv.includes('--all') ? ALL_FILES : TOOL_FILES);
  const byFile = {};
  for (const h of hits) (byFile[h.file] ||= []).push(h);
  for (const [f, hs] of Object.entries(byFile).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`\n${f} (${hs.length})`);
    for (const h of hs) console.log(`  ${h.line}: ${h.text}`);
  }
  console.log(`\n${hits.length} untranslated literals in ${Object.keys(byFile).length} files`);
}
