/**
 * Shrink an Excel workbook in the browser without changing what it says.
 *
 * The other three compressors on this site all do the same job in different
 * containers: find images stored at more resolution than they are displayed at
 * and redraw them. That is the right answer for a PDF, a deck and a Word
 * document, and it is the wrong answer for a spreadsheet. Most bloated
 * workbooks contain no pictures at all.
 *
 * `scripts/research/xlsx-bloat.mjs` measured where the bytes actually are, and
 * the answer is not close:
 *
 *   500 rows of data + 40,000 rows of styled-but-empty cells   684 KB
 *   the same workbook with those rows dropped                   20 KB
 *
 * That is the "my spreadsheet is 15 MB and has 100 rows" file, and it is
 * created by selecting whole columns and applying a fill or a border. Excel
 * stores a `<c>` element for every one of those cells, forever. So this engine
 * leads with structure and treats images as the secondary pass they are here.
 *
 * WHAT IT DOES, IN ORDER
 *
 *  1. **Trailing empty rows.** Every row after the last one holding a value, a
 *     formula or an inline string is dropped. Interior blank rows are kept:
 *     a blank row between two tables is layout the author chose, and the bloat
 *     pattern is always at the end.
 *
 *  2. **Trailing empty cells**, per kept row, past the last cell in that row
 *     that holds anything. Same reasoning applied to columns, which is the
 *     other half of "I selected A:XFD and clicked the border button".
 *
 *  3. **`calcChain.xml`**, which is a cache of the order Excel last evaluated
 *     formulas in. Excel rebuilds it on open when it is missing. Worth ~10% of
 *     a formula-heavy workbook and entirely safe.
 *
 *  4. **Images**, via the shared OOXML engine, for the workbooks that do have
 *     them. That engine measures `<a:ext>` inside an `<xdr:pic>` the same way
 *     it reads a slide or a Word drawing.
 *
 * THE ONE THING THIS IS NOT
 *
 * Every other compressor here is lossless: the document is byte-for-byte the
 * same document, just stored better. **This one is not, and the page says so
 * in those words.** A styled empty cell is formatting somebody applied to
 * space they have not filled in yet — a template with a bordered grid waiting
 * for next quarter's numbers is exactly that. Removing it does not change any
 * value, any formula, any chart or anything visible in the used range, but it
 * does mean that typing into a cell beyond the data no longer inherits the
 * fill it used to. That is a real trade and it belongs to the reader, so the
 * trim is a switch rather than a silent default, and the report says how many
 * rows went.
 *
 * On not re-zipping: parts this engine does not change are left on the JSZip
 * object untouched, so JSZip copies their existing compressed stream instead
 * of re-deflating them. That is not a micro-optimisation — re-deflating
 * repetitive sheet XML at level 9 measured **46% larger** than the level 6 it
 * arrived at. Rebuild the package entry by entry and you lose that protection.
 */
import { compressOoxml } from './ooxml-compress.js';

const SHEET_RE = /^xl\/worksheets\/sheet[^/]+\.xml$/i;

/** Does this `<row>`'s content hold anything at all? */
const ROW_HAS_CONTENT = (inner) => /<v>|<is>|<f[\s/>]/.test(inner);

/** A1 -> { col: 1, row: 1 }. Returns null for anything unexpected. */
export function parseRef(ref) {
  const m = /^([A-Z]+)(\d+)$/.exec(ref || '');
  if (!m) return null;
  let col = 0;
  for (const ch of m[1]) col = col * 26 + (ch.charCodeAt(0) - 64);
  return { col, row: Number(m[2]) };
}

/** 1 -> A, 27 -> AA. */
export function colName(n) {
  let s = '';
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

/**
 * Drop trailing empty cells from one row's inner XML.
 *
 * Cells are emitted in column order, so the last cell holding content is the
 * boundary. Everything after it in that row is formatting applied to nothing.
 */
export function trimRowCells(inner) {
  const cells = inner.match(/<c\b[^>]*(?:\/>|>[\s\S]*?<\/c>)/g);
  if (!cells) return { xml: inner, dropped: 0, lastCol: 0 };

  let last = -1;
  for (let i = 0; i < cells.length; i++) {
    if (/<v>|<is>|<f[\s/>]/.test(cells[i])) last = i;
  }
  if (last === cells.length - 1) {
    const ref = parseRef((cells[last].match(/r="([A-Z]+\d+)"/) || [])[1]);
    return { xml: inner, dropped: 0, lastCol: ref ? ref.col : 0 };
  }

  const kept = cells.slice(0, last + 1);
  const dropped = cells.length - kept.length;
  const ref = last >= 0 ? parseRef((cells[last].match(/r="([A-Z]+\d+)"/) || [])[1]) : null;
  return { xml: kept.join(''), dropped, lastCol: ref ? ref.col : 0 };
}

/**
 * Trim one worksheet. Returns the new XML and what it cost the file.
 *
 * Regex rather than a DOM parse, for the reason the OOXML engine gives: the
 * input is untrusted, the shapes wanted are narrow, and a parse-and-
 * reserialise round trip would rewrite parts we have no business touching. A
 * sheet that does not match the expected shape is returned unchanged, which is
 * the safe failure.
 */
export function trimSheetXml(xml) {
  const open = xml.indexOf('<sheetData');
  if (open === -1) return { xml, rowsDropped: 0, cellsDropped: 0 };

  /* An empty `<sheetData/>` has nothing to do. */
  const selfClosing = /^<sheetData\s*\/>/.test(xml.slice(open));
  if (selfClosing) return { xml, rowsDropped: 0, cellsDropped: 0 };

  const bodyStart = xml.indexOf('>', open) + 1;
  const bodyEnd = xml.indexOf('</sheetData>', bodyStart);
  if (bodyEnd === -1) return { xml, rowsDropped: 0, cellsDropped: 0 };

  const body = xml.slice(bodyStart, bodyEnd);
  const rows = body.match(/<row\b[^>]*(?:\/>|>[\s\S]*?<\/row>)/g);
  if (!rows) return { xml, rowsDropped: 0, cellsDropped: 0 };

  /* The last row that holds anything. Everything after it goes. */
  let lastReal = -1;
  for (let i = 0; i < rows.length; i++) {
    if (ROW_HAS_CONTENT(rows[i])) lastReal = i;
  }

  const keptRows = lastReal === -1 ? [] : rows.slice(0, lastReal + 1);
  const rowsDropped = rows.length - keptRows.length;

  let cellsDropped = 0;
  let maxCol = 0;
  let maxRow = 0;

  const rebuilt = keptRows.map((row) => {
    const rowNum = Number((row.match(/<row[^>]*\br="(\d+)"/) || [])[1] || 0);
    if (rowNum > maxRow) maxRow = rowNum;

    const m = /^(<row\b[^>]*>)([\s\S]*)(<\/row>)$/.exec(row);
    if (!m) return row;                       // self-closing or unexpected
    const trimmed = trimRowCells(m[2]);
    cellsDropped += trimmed.dropped;
    if (trimmed.lastCol > maxCol) maxCol = trimmed.lastCol;
    return m[1] + trimmed.xml + m[3];
  });

  let out = xml.slice(0, bodyStart) + rebuilt.join('') + xml.slice(bodyEnd);

  /* `<dimension>` is the range Excel uses for the scroll bars and for the cell
     Ctrl+End lands on. A workbook claiming A1:XFD1048576 still *feels*
     enormous however few bytes it now takes, so this is worth correcting on
     its own — even on a sheet where no row was dropped, which is why it is
     reported separately rather than folded into the row count. */
  let dimensionFixed = false;
  if (maxRow > 0 && maxCol > 0) {
    const want = `<dimension ref="A1:${colName(maxCol)}${maxRow}"/>`;
    const next = out.replace(/<dimension\s+ref="[^"]*"\s*\/>/, want);
    if (next !== out) {
      dimensionFixed = true;
      out = next;
    }
  }

  return { xml: out, rowsDropped, cellsDropped, dimensionFixed };
}

/** Remove a part, its content-type override and any relationship to it. */
async function removePart(zip, path) {
  if (!zip.file(path)) return false;
  zip.remove(path);

  const ct = zip.file('[Content_Types].xml');
  if (ct) {
    const xml = await ct.async('string');
    const stripped = xml.replace(
      new RegExp('<Override[^>]*PartName="/' + path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"[^>]*/>', 'g'), '');
    if (stripped !== xml) zip.file('[Content_Types].xml', stripped);
  }

  const relsPath = 'xl/_rels/workbook.xml.rels';
  const rels = zip.file(relsPath);
  if (rels) {
    const xml = await rels.async('string');
    const leaf = path.split('/').pop();
    const stripped = xml.replace(
      new RegExp('<Relationship[^>]*Target="(?:\\./)?' + leaf.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"[^>]*/>', 'g'), '');
    if (stripped !== xml) zip.file(relsPath, stripped);
  }
  return true;
}

/**
 * The structural pass. Mutates the loaded package in place and returns the
 * regenerated bytes plus what it did.
 *
 * Only the sheets that actually changed are written back, so every other part
 * keeps its existing compressed stream.
 */
export async function trimWorkbook(bytes, JSZipLib, opts = {}, on = {}) {
  const progress = on.progress || (() => {});
  const yieldNow = on.yield || (() => Promise.resolve());

  const zip = await JSZipLib.loadAsync(bytes);
  const sheets = Object.keys(zip.files).filter((p) => SHEET_RE.test(p) && !zip.files[p].dir);

  let rowsDropped = 0;
  let cellsDropped = 0;
  let dimensionsFixed = 0;
  let sheetsTouched = 0;

  if (opts.trimUsedRange !== false) {
    for (let i = 0; i < sheets.length; i++) {
      progress(10 + Math.round((i / Math.max(1, sheets.length)) * 25),
        `Checking sheet ${i + 1} of ${sheets.length}…`);
      await yieldNow();

      const path = sheets[i];
      const xml = await zip.file(path).async('string');
      const res = trimSheetXml(xml);
      /* Written back when anything changed at all, including a dimension that
         was only overstated — computing that fix and then dropping it would
         be worse than not computing it. Sheets that did not change are left on
         the zip object untouched, so their compressed stream is copied rather
         than re-deflated. */
      if (res.rowsDropped || res.cellsDropped || res.dimensionFixed) {
        zip.file(path, res.xml);
        rowsDropped += res.rowsDropped;
        cellsDropped += res.cellsDropped;
        if (res.dimensionFixed) dimensionsFixed++;
        sheetsTouched++;
      }
    }
  }

  let calcChainDropped = false;
  if (opts.dropCalcChain !== false) {
    calcChainDropped = await removePart(zip, 'xl/calcChain.xml');
  }

  progress(40, 'Rewriting the workbook…');
  const out = await zip.generateAsync({
    type: 'uint8array',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  return {
    bytes: out,
    structure: {
      sheets: sheets.length,
      sheetsTouched,
      rowsDropped,
      cellsDropped,
      dimensionsFixed,
      calcChainDropped,
      bytesBefore: bytes.length,
      bytesAfter: out.length,
    },
  };
}

/**
 * Compress a workbook: structure first, then images.
 *
 * Returns the same shape the other compressors return, with a `structure`
 * block added, so the page can report the two kinds of saving separately —
 * they are different promises and a reader deserves to see which one paid.
 */
export async function compressXlsx(bytes, options, JSZipLib, hooks) {
  const opts = Object.assign(
    { dpi: 150, quality: 0.72, targetBytes: null, trimUsedRange: true, dropCalcChain: true },
    options || {});
  const on = Object.assign({ progress: () => {}, yield: () => Promise.resolve() }, hooks || {});

  on.progress(5, 'Reading the workbook…');
  const trimmed = await trimWorkbook(bytes, JSZipLib, opts, on);

  /* The image pass runs on the trimmed bytes, so a target size is measured
     against what the reader will actually get rather than against an
     intermediate nobody sees. */
  const imaged = await compressOoxml(trimmed.bytes, opts, JSZipLib, {
    progress: (pct, label) => on.progress(45 + Math.round(pct * 0.5), label),
    yield: on.yield,
  });

  /* `compressOoxml` returns the original when it cannot improve on it, so
     `imaged.bytes` is never worse than `trimmed.bytes`. */
  const finalBytes = imaged.bytes.length <= trimmed.bytes.length ? imaged.bytes : trimmed.bytes;

  /* Same guard the other two carry: never hand back something bigger than
     what came in. */
  if (finalBytes.length >= bytes.length) {
    return {
      bytes,
      report: {
        originalBytes: bytes.length,
        newBytes: bytes.length,
        imagesFound: imaged.report.imagesFound,
        imagesShrunk: 0,
        bytesSavedOnImages: 0,
        bytesSavedOnStructure: 0,
        targetBytes: opts.targetBytes || null,
        targetMet: opts.targetBytes ? bytes.length <= opts.targetBytes : null,
        images: imaged.report.images,
        structure: trimmed.structure,
        noGain: true,
      },
    };
  }

  on.progress(100, 'Done');
  return {
    bytes: finalBytes,
    report: {
      originalBytes: bytes.length,
      newBytes: finalBytes.length,
      imagesFound: imaged.report.imagesFound,
      imagesShrunk: imaged.report.imagesShrunk,
      bytesSavedOnImages: imaged.report.bytesSavedOnImages,
      bytesSavedOnStructure: Math.max(0, bytes.length - trimmed.bytes.length),
      targetBytes: opts.targetBytes || null,
      targetMet: opts.targetBytes ? finalBytes.length <= opts.targetBytes : null,
      images: imaged.report.images,
      structure: trimmed.structure,
    },
  };
}
