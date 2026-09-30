/**
 * Every English string the browser looks up at runtime.
 *
 * Three ways a string reaches window.__t:
 *   - inline scripts call __t('…') and __tf('… {0} …', …);
 *   - modules call tr('…', …) (src/scripts/i18n-runtime.js);
 *   - a few values are translated where they are DISPLAYED, not where they
 *     are made — EXIF tag names, font and library labels, preset names — so
 *     the data stays English for the code that tests it. Those are listed in
 *     DISPLAY_KEYS below, next to where each comes from.
 *
 * The first argument may be written as 'a' + 'b' across lines, or as
 * `cond ? 'x' : 'y'`; both branches are keys. Anything else (a variable) is
 * not a literal and is reported by the caller, not guessed at.
 *
 *   node scripts/i18n/runtime-keys.mjs            → count
 *   node scripts/i18n/runtime-keys.mjs --missing  → keys with no pt entry
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(astro|js)$/.test(e.name)) out.push(p);
  }
  return out;
}

export const SOURCE_FILES = [...walk('src/components'), ...walk('src/pages'), ...walk('src/layouts'), ...walk('src/scripts')];

/** Read the first argument of the call whose "(" is at `open`. */
function firstArg(code, open) {
  let depth = 0, i = open + 1, q = null;
  for (; i < code.length; i++) {
    const c = code[i];
    if (q) { if (c === '\\') { i++; continue; } if (c === q) q = null; continue; }
    if (c === "'" || c === '"' || c === '`') { q = c; continue; }
    if (c === '(' || c === '[' || c === '{') depth++;
    else if (c === ')' || c === ']' || c === '}') { if (depth === 0) break; depth--; }
    else if (c === ',' && depth === 0) break;
  }
  return code.slice(open + 1, i);
}

const LIT = String.raw`(?:'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|\x60(?:[^\x60\\$]|\\.)*\x60)`;
const CONCAT = new RegExp(String.raw`^\s*${LIT}(?:\s*\+\s*${LIT})*\s*$`);

/** A branch made only of string literals joined by +, evaluated; else null. */
function evalConcat(expr) {
  if (!CONCAT.test(expr)) return null;
  // eslint-disable-next-line no-new-func
  return Function('return (' + expr + ');')();
}

/** Split `cond ? a : b` at the top level into [a, b]; otherwise [expr]. */
function branches(expr) {
  let depth = 0, q = null, qm = -1;
  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];
    if (q) { if (c === '\\') { i++; continue; } if (c === q) q = null; continue; }
    if (c === "'" || c === '"' || c === '`') { q = c; continue; }
    if ('([{'.includes(c)) depth++;
    else if (')]}'.includes(c)) depth--;
    else if (c === '?' && depth === 0 && qm < 0) qm = i;
    else if (c === ':' && depth === 0 && qm >= 0) return [expr.slice(qm + 1, i), ...branches(expr.slice(i + 1))];
  }
  return [expr];
}

/**
 * @returns {{keys: Map<string, string[]>, dynamic: string[]}}
 *   keys → where each was found; dynamic → calls whose first argument is not
 *   a literal (allowed: a translated variable such as __t(p.label)).
 */
export function runtimeKeys(files = SOURCE_FILES) {
  const keys = new Map();
  const dynamic = [];
  for (const file of files) {
    const code = readFileSync(file, 'utf8');
    const re = file.endsWith('.js') ? /\btr\(/g : /(?<![\w$.])__tf?\(/g;
    for (const m of code.matchAll(re)) {
      const open = m.index + m[0].length - 1;
      const arg = firstArg(code, open);
      const line = code.slice(0, m.index).split('\n').length;
      let any = false;
      for (const br of branches(arg)) {
        const v = evalConcat(br);
        if (v === null) continue;
        any = true;
        if (!keys.has(v)) keys.set(v, []);
        keys.get(v).push(`${file}:${line}`);
      }
      if (!any) dynamic.push(`${file}:${line}  ${arg.trim().slice(0, 60)}`);
    }
  }
  for (const [k, from] of Object.entries(DISPLAY_KEYS_BY_SOURCE)) {
    for (const key of from) { if (!keys.has(key)) keys.set(key, []); keys.get(key).push(k); }
  }
  return { keys, dynamic };
}

/** Values translated at display time, by where they are defined. */
function literalsIn(file, pattern) {
  const src = readFileSync(file, 'utf8');
  return [...src.matchAll(pattern)].map((m) => m[1]);
}
export const DISPLAY_KEYS_BY_SOURCE = {
  // ExifTool renders __t(tag.name), __t(tag.ifd), __t(tag.value)
  'src/scripts/exif-parse.js (tag names, orientation, chunk and segment names)': [
    ...literalsIn('src/scripts/exif-parse.js', /0x[0-9a-f]{4}: '([^']+)'/g),
    ...literalsIn('src/scripts/exif-parse.js', /^\s+\d: '([^']+)'/gm),
    ...literalsIn('src/scripts/exif-parse.js', /name: '([^']+)'/g).filter((n) => !/^APP\d/.test(n)),
    ...literalsIn('src/scripts/exif-parse.js', /^\s+\w{4}: '([^']+)'/gm),
    'Image', 'Camera', 'Location', 'Text', 'Group', 'Tag', 'Value', 'Unknown',
  ],
  // Tools join __t(label) for fonts that failed or scripts that cannot embed
  'src/scripts/pdf-fonts.js (script and font labels)': [
    ...literalsIn('src/scripts/pdf-fonts.js', /label: '([^']+)'/g), 'an unsupported script', ' and ',
  ],
  // libraryUnavailableMessage(tr(what))
  'src/scripts/ensure-lib.js (library labels)': literalsIn('src/scripts/ensure-lib.js', /label: '([^']+)'/g),
  // CompressOffice renders __t(p.label) / __t(p.note)
  'src/scripts/image-compress.js (presets)': [
    ...literalsIn('src/scripts/image-compress.js', /label: '([^']+)'/g),
    ...literalsIn('src/scripts/image-compress.js', /note: '([^']+)'/g),
  ],
  // __tf('This file could not be read as a {0}.', __t(kindLabel))
  'src/components/tools/CompressOffice.astro (kindLabel)': ['Excel workbook', 'Word document', 'PowerPoint file'],
  // BankFileTool stat labels, rendered with __t(label)
  'src/components/tools/BankFileTool.astro (stats)': ['Transactions', 'Accounts', 'Statement period', 'Money in', 'Money out', 'Net',
    // column names from ofx-parse buildRows, translated where shown and written
    ...literalsIn('src/scripts/ofx-parse.js', /columns: \[([^\]]+)\]/g).flatMap((l) => [...l.matchAll(/'([^']+)'/g)].map((m) => m[1])),
    // the workbook's Summary sheet
    'Account', 'Type', 'Currency', 'Period start', 'Period end', 'Ledger balance', 'Summary'],
  // json-locate: atEnd(expected) → tr('… {0} was expected', tr(expected))
  'src/scripts/json-locate.js (atEnd)': literalsIn('src/scripts/json-locate.js', /atEnd\('([^']+)'\)/g),
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { keys, dynamic } = runtimeKeys();
  if (process.argv.includes('--missing')) {
    const { ptKeys } = await import('./pt-keys.mjs');
    const known = ptKeys();
    const missing = [...keys.keys()].filter((k) => !known.has(k));
    for (const k of missing) console.log(JSON.stringify(k), '  ←', keys.get(k)[0]);
    console.log(`\n${missing.length} of ${keys.size} runtime keys have no Portuguese entry`);
  } else {
    console.log(keys.size, 'runtime keys;', dynamic.length, 'non-literal calls');
    if (process.argv.includes('--dynamic')) dynamic.forEach((d) => console.log('  ' + d));
  }
}
