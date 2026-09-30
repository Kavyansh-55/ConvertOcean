/**
 * One-off codemod (2026-09-29): wrap bare template text in {t('…', lang)}.
 * Prints the keys it created so their Portuguese can be written. Kept for
 * the record and for the next component that grows bare labels.
 *
 *   node scripts/i18n/wrap-bare-text.mjs            → dry run, lists keys
 *   node scripts/i18n/wrap-bare-text.mjs --write
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { findBareText, SHARED_COMPONENTS } from './bare-template-text.mjs';

const ENT = { '&ndash;': '–', '&mdash;': '—', '&euro;': '€', '&pound;': '£', '&yen;': '¥', '&#8377;': '₹', '&amp;': '&', '&nbsp;': ' ', '&rarr;': '→' };
const decode = (s) => s.replace(/&[#\w]+;/g, (e) => ENT[e] ?? e);
const q = (s) => "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const hits = findBareText(SHARED_COMPONENTS).filter((h) => h.file.includes('components'));
const byFile = new Map();
for (const h of hits) { if (!byFile.has(h.file)) byFile.set(h.file, []); byFile.get(h.file).push(h); }

const keys = new Set();
const problems = [];
for (const [file, list] of byFile) {
  let src = readFileSync(file, 'utf8');
  if (!/import \{[^}]*\bt\b[^}]*\} from ['"][./]+i18n\/ui['"]/.test(src)) problems.push(`${file}: no t import`);
  if (!/\blang\b/.test(src.split('---')[1] || '')) problems.push(`${file}: no lang prop`);
  for (const h of list) {
    if (h.attr) {
      const key = decode(h.value);
      const re = new RegExp(`\\b${h.attr}="${esc(h.value)}"`, 'g');
      if (!re.test(src)) { problems.push(`${file}:${h.line} attr not found: ${h.value}`); continue; }
      src = src.replace(re, `${h.attr}={t(${q(key)}, lang)}`);
      keys.add(key);
    } else {
      const key = decode(h.text);
      // The source text may span lines; match its words with flexible whitespace.
      const words = h.text.split(' ').map(esc).join('\\s+');
      const re = new RegExp(`>(\\s*)${words}(\\s*)<`, 'g');
      if (!re.test(src)) { problems.push(`${file}:${h.line} text not found: ${h.text}`); continue; }
      src = src.replace(re, (m, a, b) => `>${a}{t(${q(key)}, lang)}${b}<`);
      keys.add(key);
    }
  }
  if (process.argv.includes('--write')) writeFileSync(file, src);
}
console.log(JSON.stringify([...keys], null, 0).replace(/","/g, '",\n"'));
console.error(`\n${keys.size} keys; problems:\n` + problems.join('\n'));
