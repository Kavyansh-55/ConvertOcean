/**
 * How much of a text-heavy PDF is font data, and is any of it reclaimable?
 *
 * Written to answer a question a reader raised by testing /compress-pdf/ with
 * a 21-page course handout: the tool re-encodes images, the handout is text
 * and fonts, so it recovered 4%. The obvious next engine is font subsetting —
 * strip glyphs the document never uses. Before building that, the question is
 * whether the bytes are actually there to reclaim.
 *
 * Two things have to be true for subsetting to be worth anything:
 *
 *   1. Fonts have to be a large share of the file.
 *   2. Those fonts must NOT already be subsetted by whatever produced the PDF.
 *
 * A PDF font that has been subsetted carries a six-letter tag on its name —
 * `ABCDEE+Calibri`, `BZZZZZ+Roboto-Medium` — and contains only the glyphs the
 * document uses. Re-subsetting one reclaims nothing. Word, LaTeX, pdfmake,
 * Google Docs and most other producers subset on export.
 *
 *   node scripts/research/pdf-font-weight.mjs <file.pdf> [more.pdf ...]
 *
 * Reports, per file: total size, bytes in font streams, the share that is,
 * and for each font whether it is embedded, subsetted, or one of the 14
 * standard fonts that are never embedded at all.
 *
 * WHAT IT FOUND (2026-09-14)
 *
 *  - **A subsetting engine would not have helped the reported handout.** Most
 *    producers — Word, LaTeX, pdfmake, Google Docs — subset on export, and a
 *    subsetted font contains only the glyphs its document uses. Point this at
 *    a file and it says which case that file is in, which beats guessing.
 *    `word-to-pdf.pdf` is the local proof: five embedded fonts, all five
 *    already subsetted, nothing to reclaim.
 *
 *  - **Where it would pay is our own Unicode output.** `/txt-to-pdf/` and
 *    `/csv-to-pdf/` embed Noto whole: 103 KB of a 127 KB file, 81%, for a
 *    document using a few dozen glyphs. That is a real saving and it lands
 *    hardest on readers writing Devanagari, who are a large share of this
 *    site's traffic and the least likely to be on a fast connection.
 *
 *  - **But only for those documents.** A plain ASCII file embeds nothing at
 *    all and produces a 3.4 KB PDF — measured, not assumed. The lazy-loading
 *    design in `pdf-fonts.js` already does its job, so this is not "our PDFs
 *    are bloated", it is "our Unicode PDFs carry glyphs nobody asked for".
 *
 * That makes subsetting a worthwhile engine with a narrower audience than it
 * first appeared, and a real piece of work: parsing glyf/loca/cmap/hmtx,
 * following composite-glyph dependencies, and rebuilding the tables. Worth its
 * own batch, not a corner of one.
 */
import { readFileSync, statSync } from 'node:fs';

const kb = (n) => (n / 1024).toFixed(1) + ' KB';

/**
 * Length of every font program stream in the file.
 *
 * Done by following the reference, not by pattern-matching near the word
 * "font". The first version of this scanned for `/Length1` and read whatever
 * `/Length` sat within 400 characters, which on a real file picked up the
 * length of a neighbouring object entirely — it reported 78 KB of "font
 * program" for a `/Type /Font /BaseFont /Times-Italic` dictionary that is not
 * a stream at all, and 0 KB for a document with five embedded fonts.
 *
 * So: find each `/FontFileN R` reference, resolve the object number it points
 * at, and read that object's own `/Length`. A font program is exactly what a
 * font descriptor says it is.
 */
export function fontStreamBytes(src) {
  const refs = [...src.matchAll(/\/FontFile\d?\s+(\d+)\s+(\d+)\s+R/g)].map((m) => Number(m[1]));
  let total = 0;
  const unresolved = [];

  for (const num of new Set(refs)) {
    const objRe = new RegExp('(?:^|[^0-9])' + num + '\\s+0\\s+obj([\\s\\S]{0,800}?)stream');
    const m = objRe.exec(src);
    if (!m) { unresolved.push(num); continue; }
    const len = /\/Length\s+(\d+)/.exec(m[1]);
    if (len) total += Number(len[1]);
    else unresolved.push(num);
  }
  return { total, count: new Set(refs).size, unresolved };
}

/** Every /BaseFont in the file, with whether it is subsetted or standard. */
const STANDARD_14 = new Set([
  'Times-Roman', 'Times-Bold', 'Times-Italic', 'Times-BoldItalic',
  'Helvetica', 'Helvetica-Bold', 'Helvetica-Oblique', 'Helvetica-BoldOblique',
  'Courier', 'Courier-Bold', 'Courier-Oblique', 'Courier-BoldOblique',
  'Symbol', 'ZapfDingbats',
]);

function fonts(src) {
  const out = new Map();
  for (const m of src.matchAll(/\/BaseFont\s*\/([A-Za-z0-9+,.\-]+)/g)) {
    const name = m[1];
    if (out.has(name)) continue;
    const subsetTag = /^([A-Z]{6})\+/.test(name);
    const bare = name.replace(/^[A-Z]{6}\+/, '');
    out.set(name, {
      name,
      subsetted: subsetTag,
      standard: STANDARD_14.has(bare),
    });
  }
  return [...out.values()];
}

const files = process.argv.slice(2);
if (!files.length) {
  console.error('usage: node scripts/research/pdf-font-weight.mjs <file.pdf> [...]');
  process.exit(2);
}

console.log('\nWHERE THE BYTES ARE IN A TEXT PDF\n');

let anyReclaimable = false;

for (const file of files) {
  let buf;
  try { buf = readFileSync(file); } catch { console.log(`  ${file}: unreadable`); continue; }
  const src = buf.toString('latin1');
  const size = statSync(file).size;
  const { total, count, unresolved } = fontStreamBytes(src);
  const list = fonts(src);

  const embedded = list.filter((f) => !f.standard);
  const subsetted = embedded.filter((f) => f.subsetted);
  const full = embedded.filter((f) => !f.subsetted);

  console.log(`=== ${file}`);
  console.log(`    ${kb(size)} total, ${kb(total)} in ${count} font program(s) `
    + `(${size ? Math.round((total / size) * 100) : 0}% of the file)`
    + (unresolved.length
      ? `  [${unresolved.length} could not be resolved and is NOT counted]`
      : ''));

  if (!embedded.length) {
    console.log('    no embedded fonts at all — every font is one of the standard 14,');
    console.log('    which a PDF references by name and never carries. Nothing to subset.');
  } else {
    console.log(`    ${embedded.length} embedded font(s): `
      + `${subsetted.length} already subsetted, ${full.length} full`);
    for (const f of embedded) {
      console.log(`      ${f.subsetted ? 'subset ' : 'FULL   '} ${f.name}`);
    }
    if (full.length) anyReclaimable = true;
  }
  console.log('');
}

console.log(anyReclaimable
  ? 'At least one font is embedded in full — that is where a subsetting engine would pay.\n'
  : 'Every embedded font here is already subsetted to the glyphs its document uses.\n'
    + 'Re-subsetting them reclaims nothing: the producer did it on export.\n');
