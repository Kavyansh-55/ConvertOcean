/**
 * What actually makes an .xlsx big, and what could a browser recover?
 *
 * This exists to answer a build-or-don't decision that had been deferred three
 * times with the same sentence: "spreadsheet bloat is not images, so the office
 * compressor would honestly report nothing to do." That sentence is correct and
 * was being used to mean "so there is nothing to build", which does not follow.
 * So: measure the archetypes people actually hit, and measure each lever
 * against them, rather than reasoning from the file format.
 *
 *   node scripts/research/xlsx-bloat.mjs
 *
 * WHAT IT FOUND (2026-09-13, numbers reproducible by running it)
 *
 *  1. **Used-range bloat dominates, and is worth ~97%.** A sheet with 500 rows
 *     of data and 40,000 rows of styled-but-empty cells — the file you get
 *     when someone selects whole columns and applies a border — is 684 KB.
 *     Dropping rows that contain no value at all takes it to 20 KB. This is the
 *     "my spreadsheet is 15 MB and has 100 rows" complaint, and it is not
 *     images.
 *
 *  2. **calcChain.xml is worth ~10% on formula-heavy files** and Excel rebuilds
 *     it from scratch when it is missing, so dropping it is safe.
 *
 *  3. **Images are worth what they are worth** — the existing engine already
 *     knows how to do this and the same judgement applies. But a spreadsheet
 *     with no pictures gets nothing from it, which is the original observation.
 *
 *  4. **"Re-zip at maximum compression" is NOT a free lever.** On the 40,000-row
 *     sheet, re-deflating every part at level 9 produced a file **46% LARGER**
 *     than the level 6 it arrived at. Deflate level is not monotonic in output
 *     size and depends on the shape of the data.
 *
 *     The corollary that matters for the shipped code: JSZip reuses the
 *     already-compressed stream of any entry it was not asked to change, so
 *     `ooxml-compress.js` never re-deflates document XML and cannot hit this.
 *     Verified by loading a package, touching nothing, regenerating at level 9
 *     and getting back a byte-identical file. Any future code that rebuilds a
 *     package entry by entry loses that protection and has to measure.
 *
 * WHAT THAT MEANS FOR /compress-excel/
 *
 * It is worth building, and it is a different engine from the office
 * compressor — the lever is used-range trimming, not image re-encoding. It is
 * also the first compressor here that is not strictly lossless: removing a
 * styled empty cell removes formatting a reader might have intended for cells
 * they have not filled in yet. That has to be said on the page in those words,
 * and probably offered as a choice, the way the target-size mode is.
 */
import JSZip from 'jszip';

const kb = (n) => (n / 1024).toFixed(1) + ' KB';
const COL = (i) => {
  let s = '', n = i;
  while (n >= 0) { s = String.fromCharCode(65 + (n % 26)) + s; n = Math.floor(n / 26) - 1; }
  return s;
};

/* ---------------------------------------------------------------- builders */

const CT = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Default Extension="png" ContentType="image/png"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
<Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
</Types>`;

const RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

const WORKBOOK = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="Data" sheetId="1" r:id="rId1"/></sheets></workbook>`;

const WB_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>
</Relationships>`;

const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>
<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFFF2CC"/></patternFill></fill></fills>
<borders count="2"><border/><border><left style="thin"/><right style="thin"/><top style="thin"/><bottom style="thin"/></border></borders>
<cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="2" borderId="1" applyFill="1" applyBorder="1"/></cellXfs>
</styleSheet>`;

function sheetXml(realRows, styledRows, cols = 8) {
  const parts = [`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>`];
  let str = 0;
  for (let r = 1; r <= realRows; r++) {
    const cells = [];
    for (let c = 0; c < cols; c++) {
      const ref = COL(c) + r;
      cells.push(c === 0
        ? `<c r="${ref}" t="s" s="1"><v>${str++ % 40}</v></c>`
        : `<c r="${ref}" s="2"><v>${(r * 7 + c * 13) % 9999}</v></c>`);
    }
    parts.push(`<row r="${r}">${cells.join('')}</row>`);
  }
  /* Cells that hold a style index and nothing else. */
  for (let r = realRows + 1; r <= realRows + styledRows; r++) {
    const cells = [];
    for (let c = 0; c < cols; c++) cells.push(`<c r="${COL(c) + r}" s="2"/>`);
    parts.push(`<row r="${r}" s="2" customFormat="1">${cells.join('')}</row>`);
  }
  return parts.join('') + '</sheetData></worksheet>';
}

const sharedStrings = (n = 40) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${n}" uniqueCount="${n}">`
  + Array.from({ length: n }, (_, i) => `<si><t>Region ${i} quarterly rollup</t></si>`).join('')
  + '</sst>';

const calcChain = (n) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<calcChain xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">`
  + Array.from({ length: n }, (_, i) => `<c r="B${i + 1}" i="1"/>`).join('')
  + '</calcChain>';

/** An incompressible blob, standing in for an embedded photo. */
function fakeImage(bytes) {
  const b = Buffer.alloc(bytes);
  for (let i = 0; i < bytes; i++) b[i] = (i * 2654435761) >>> 24;
  b[0] = 0x89; b[1] = 0x50; b[2] = 0x4e; b[3] = 0x47;
  return b;
}

async function build({ realRows, styledRows, chain = 0, imageBytes = 0, level = 6 }) {
  const zip = new JSZip();
  zip.file('[Content_Types].xml', CT);
  zip.file('_rels/.rels', RELS);
  zip.file('xl/workbook.xml', WORKBOOK);
  zip.file('xl/_rels/workbook.xml.rels', WB_RELS);
  zip.file('xl/styles.xml', STYLES);
  zip.file('xl/sharedStrings.xml', sharedStrings());
  zip.file('xl/worksheets/sheet1.xml', sheetXml(realRows, styledRows));
  if (chain) zip.file('xl/calcChain.xml', calcChain(chain));
  if (imageBytes) zip.file('xl/media/image1.png', fakeImage(imageBytes));
  return zip.generateAsync({
    type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level },
  });
}

/* ------------------------------------------------------------------ levers */

async function rebuild(buf, transform, level = 9) {
  const z = await JSZip.loadAsync(buf);
  const out = new JSZip();
  for (const name of Object.keys(z.files)) {
    if (z.files[name].dir) continue;
    const entry = await transform(name, await z.file(name).async('nodebuffer'));
    if (entry) out.file(name, entry);
  }
  return out.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level } });
}

const reZip = (buf) => rebuild(buf, (n, b) => b);
const dropCalcChain = (buf) => rebuild(buf, (n, b) => (n === 'xl/calcChain.xml' ? null : b));

/** Drop every row whose cells hold no value, formula or inline string. */
const trimUsedRange = (buf) => rebuild(buf, (name, bytes) => {
  if (!/^xl\/worksheets\/sheet\d+\.xml$/.test(name)) return bytes;
  const xml = bytes.toString('utf8')
    .replace(/<row\b[^>]*>([\s\S]*?)<\/row>/g, (row, inner) => (/<v>|<is>|<f[ >]/.test(inner) ? row : ''))
    .replace(/<row\b[^>]*\/>/g, '');
  return Buffer.from(xml, 'utf8');
});

/* ------------------------------------------------------- the JSZip question */

async function streamReuseCheck() {
  const z = new JSZip();
  z.file('xl/worksheets/sheet1.xml', sheetXml(0, 40000, 2));
  z.file('xl/media/image1.png', fakeImage(1000));
  const built = await z.generateAsync({
    type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 6 },
  });

  const loaded = await JSZip.loadAsync(built);
  const untouched = await loaded.generateAsync({
    type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 9 },
  });

  const swapped = await JSZip.loadAsync(built);
  swapped.remove('xl/media/image1.png');
  swapped.file('xl/media/image1.jpeg', Buffer.alloc(400, 3));
  const afterSwap = await swapped.generateAsync({
    type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 9 },
  });

  const rebuilt = await reZip(built);

  console.log('=== Does a re-zip re-deflate parts nobody touched?\n');
  console.log('    built at level 6:                        ' + kb(built.length));
  console.log('    loaded, nothing touched, saved at 9:     ' + kb(untouched.length)
    + (untouched.length === built.length ? '   <- identical: streams are copied' : '   <- re-deflated'));
  console.log('    loaded, one image swapped, saved at 9:   ' + kb(afterSwap.length)
    + '   <- only the swapped part is recompressed');
  console.log('    every entry rebuilt from raw bytes at 9: ' + kb(rebuilt.length)
    + (rebuilt.length > built.length
      ? '   <- LARGER than it started'
      : '   <- smaller, but this is the path that can inflate'));
  console.log('');
}

/* -------------------------------------------------------------------- runs */

const CASES = [
  ['Ordinary: 500 rows, nothing silly', { realRows: 500, styledRows: 0 }],
  ['Used-range bloat: 500 real rows, 40,000 styled-empty', { realRows: 500, styledRows: 40000 }],
  ['Used-range bloat plus a 2 MB photo', { realRows: 500, styledRows: 40000, imageBytes: 2 * 1024 * 1024 }],
  ['Formula-heavy: 20,000 rows with a calcChain', { realRows: 20000, styledRows: 0, chain: 20000 }],
];

console.log('\nWHAT MAKES AN .XLSX BIG — measured, not assumed\n');
await streamReuseCheck();

for (const [name, opts] of CASES) {
  const buf = await build(opts);
  const [rz, dc, tr] = await Promise.all([reZip(buf), dropCalcChain(buf), trimUsedRange(buf)]);
  const both = await trimUsedRange(await dropCalcChain(buf));
  const pct = (b) => {
    const p = (1 - b.length / buf.length) * 100;
    return (p >= 0 ? '' : '+') + (-p >= 0 && p < 0 ? (-p).toFixed(1) + '% BIGGER' : p.toFixed(1) + '% off');
  };
  console.log('=== ' + name);
  console.log('    on disk: ' + kb(buf.length));
  console.log('    re-zip every part at level 9:      ' + kb(rz.length).padStart(10) + '   ' + pct(rz));
  console.log('    drop calcChain (Excel rebuilds):   ' + kb(dc.length).padStart(10) + '   ' + pct(dc));
  console.log('    trim used range (styled empties):  ' + kb(tr.length).padStart(10) + '   ' + pct(tr));
  console.log('    trim + drop calcChain:             ' + kb(both.length).padStart(10) + '   ' + pct(both));
  console.log('');
}
