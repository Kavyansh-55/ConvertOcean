/**
 * Text written straight into a component's markup, not through t().
 *
 * A component rendered on both English and Portuguese pages must pass every
 * visible word through t(…, lang); a bare word renders in English on both.
 * The Portuguese leak scan needs three or more words to judge a line, so
 * labels like "Words", "Minify", "Limit:" or "Top Keywords" were invisible to
 * it — found 2026-09-29 by verify-pt-parity.mjs.
 *
 * Reads the template part of each .astro file (frontmatter, <script> and
 * <style> removed, {expressions} blanked) and reports text nodes and
 * user-facing attributes (placeholder, aria-label, title, alt) that contain a
 * letter. Brand, product and format names that are the same in Portuguese
 * are allowed below.
 *
 *   node scripts/i18n/bare-template-text.mjs
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

/* Same in both languages — names, formats, units, symbols. */
const SAME_EXTRA = [
  /^\d+ ?(KB|MB)$/,                                   // size presets
  /^(Full )?HD \d+×\d+$/,                             // resolution presets
  /^[A-Z]{2} (VAT|GST|HST|Tax) \d+%$|^US Avg %$/,     // tax presets: country code + tax acronym
  /^I?GST \(\d+%\)$|^VAT \(\d+%\)$/,                  // tax acronyms
  /^vs [\w\s]+$/,                                     // competitor names in the footer
  /^(Convert|ocean)$/,                                // the logo wordmark
  /^[A-Z]+ \(\.[a-z]+\)$|^[A-Z]+ \(\.[a-z]+\) —$/,     // "PDF (.pdf)"
  /^(CO|REC)-\d{4}-\d{3}$|^document\.xlsx$|^[\d.]+ MB$|^PayPal$/, // sample IDs and placeholders
  /^\.json$/,
  /^([^A-Za-z]|&[a-z]+;)+$/,                          // punctuation and entities between expressions
];
const SAME = /^(ConvertOcean|OpenStreetMap|GitHub|Product Hunt|PDF|JPG|JPEG|PNG|WebP|AVIF|HEIC|SVG|CSV|JSON|XML|XLSX?|DOCX?|PPTX?|TXT|OFX|QFX|QBO|EXIF|OCR|DPI|KB|MB|px|pt|Excel|Word|PowerPoint|Twitter\/X \d+|Instagram \d+|LinkedIn \d+|Meta Desc \d+|Excel \(\.xlsx\)|CSV \(\.csv\)|[A-Z]{2,5}(\s*[·/,]\s*[A-Z]{2,5})*|[\d\s.,%×x:/()+\-–—→←#·]+|&[a-z]+;|[✕×✓…•·|—–→←↓↑]+)$/;

function templateOf(src) {
  let t = src.replace(/^---[\s\S]*?\n---/, '');
  t = t.replace(/<script\b[\s\S]*?<\/script>/g, (m) => m.replace(/[^\n]/g, ' '));
  t = t.replace(/<style\b[\s\S]*?<\/style>/g, (m) => m.replace(/[^\n]/g, ' '));
  t = t.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ' '));
  // Blank {…} expressions, nesting-aware, keeping line numbers.
  let out = '', depth = 0;
  for (const c of t) {
    if (c === '{') depth++;
    if (depth > 0) out += c === '\n' ? '\n' : ' ';
    else out += c;
    if (c === '}' && depth > 0) depth--;
  }
  // svg internals (path data, titles) are not prose
  return out.replace(/<svg\b[\s\S]*?<\/svg>/g, (m) => m.replace(/[^\n]/g, ' '));
}

export function findBareText(files) {
  const hits = [];
  for (const file of files) {
    const tpl = templateOf(readFileSync(file, 'utf8'));
    const lineOf = (i) => tpl.slice(0, i).split('\n').length;
    for (const m of tpl.matchAll(/>([^<>]+)</g)) {
      const text = m[1].replace(/\s+/g, ' ').trim();
      if (!/[A-Za-z]/.test(text) || SAME.test(text) || SAME_EXTRA.some((r) => r.test(text))) continue;
      hits.push({ file, line: lineOf(m.index), text });
    }
    // Either quote style: a single-quoted placeholder slipped past the first version.
    for (const m of tpl.matchAll(/\b(placeholder|aria-label|title|alt)=(?:"([^"]*[A-Za-z][^"]*)"|'([^']*[A-Za-z][^']*)')/g)) {
      const text = (m[2] ?? m[3]).trim();
      if (SAME.test(text) || SAME_EXTRA.some((r) => r.test(text)) || /Logo$/.test(text)) continue;
      hits.push({ file, line: lineOf(m.index), text: `${m[1]}="${text}"`, attr: m[1], value: text });
    }
  }
  return hits;
}

/** Components rendered on Portuguese pages. */
export const SHARED_COMPONENTS = [
  ...readdirSync('src/components/tools').filter((f) => f.endsWith('.astro')).map((f) => join('src/components/tools', f)),
  ...['Header.astro', 'Footer.astro', 'CategoryCard.astro'].map((f) => join('src/components', f)),
  'src/layouts/Layout.astro',
  'src/pages/[...tool].astro', 'src/pages/[...category].astro', 'src/pages/[...guide].astro',
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const hits = findBareText(SHARED_COMPONENTS);
  for (const h of hits) console.log(`${h.file}:${h.line}  ${h.text.slice(0, 90)}`);
  console.log(`\n${hits.length} bare strings`);
}
