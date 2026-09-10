/**
 * Readers for the files the tools produce.
 *
 * An assertion is only as good as what it can see, so these go past "did a
 * file come out" and expose the things fidelity actually depends on: the page
 * geometry a PDF was laid out at, the fonts and sizes each text run carries,
 * whether a docx still has colour and shading elements, whether an xlsx still
 * has a styles part with real formats in it.
 *
 * pdf.js is the same library the site itself converts with, which is
 * deliberate — if pdf.js cannot see it, neither can the tool, and the harness
 * should not claim otherwise.
 */
import JSZip from 'jszip';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

let pdfjsPromise = null;
async function pdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import('pdfjs-dist/legacy/build/pdf.js')
      .catch(() => import('pdfjs-dist/build/pdf.js'))
      .then((m) => m.default || m);
  }
  return pdfjsPromise;
}

/* -------------------------------------------------------------------- PDF */

/**
 * @param {Buffer|Uint8Array} buf
 * @returns {Promise<{pages:number, sizes:Array, text:string, pageText:string[],
 *   items:Array, fonts:string[], imageCount:number}>}
 */
export async function readPdf(buf) {
  const lib = await pdfjs();
  const standardFontDataUrl = require.resolve('pdfjs-dist/package.json')
    .replace(/package\.json$/, 'standard_fonts/');

  const doc = await lib.getDocument({
    data: new Uint8Array(buf),
    standardFontDataUrl,
    useSystemFonts: false,
    verbosity: 0,
  }).promise;

  const sizes = [];
  const pageText = [];
  const items = [];
  const fonts = new Set();
  const links = [];
  const fills = new Set();
  let imageCount = 0;

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const vp = page.getViewport({ scale: 1 });
    sizes.push({
      page: i,
      width: Math.round(vp.width),
      height: Math.round(vp.height),
      orientation: vp.width > vp.height ? 'landscape' : 'portrait',
    });

    // Build the operator list first: it forces pdf.js to resolve fonts into
    // commonObjs, so the loop below reports real family names instead of the
    // internal "g_d0_f1R" placeholders.
    let opList = null;
    try { opList = await page.getOperatorList(); } catch { /* keep going */ }

    const tc = await page.getTextContent();
    const parts = [];
    for (const it of tc.items) {
      if (typeof it.str !== 'string') continue;
      parts.push(it.str);
      const tr = it.transform || [10, 0, 0, 10, 0, 0];
      // The real font name lives in commonObjs; pdf.js only gives an id here.
      let fontName = it.fontName || '';
      try {
        const f = page.commonObjs.get(it.fontName);
        if (f && f.name) fontName = f.name;
      } catch { /* font not resolved — keep the id */ }
      if (fontName) fonts.add(String(fontName).replace(/^[A-Z]{6}\+/, ''));
      items.push({
        page: i,
        str: it.str,
        x: Math.round(tr[4] * 10) / 10,
        y: Math.round(tr[5] * 10) / 10,
        size: Math.round(Math.hypot(tr[2], tr[3]) * 10) / 10,
        font: fontName,
      });
    }
    pageText.push(parts.join(' '));

    /* Link annotations are how a hyperlink survives into a PDF. Text that
       merely *looks* like a link is not a link, and this is what tells them
       apart. */
    try {
      for (const a of await page.getAnnotations()) {
        if (a.subtype === 'Link' && (a.url || a.unsafeUrl)) {
          links.push({ page: i, url: a.url || a.unsafeUrl });
        }
      }
    } catch { /* no annotation layer */ }

    /* Fill colours actually used on the page. This is how we tell "the table
       has a shaded header because the source did" from "autoTable drew its own
       default chrome" — we look for the source's specific colour, not for the
       presence of decoration. */
    if (opList) {
      const setFill = lib.OPS.setFillRGBColor;
      for (let k = 0; k < opList.fnArray.length; k++) {
        if (opList.fnArray[k] === setFill) {
          const a = opList.argsArray[k] || [];
          if (a.length >= 3) {
            fills.add([a[0], a[1], a[2]].map((v) => Math.round(v)).join(','));
          }
        }
      }
    }

    // Count painted images from the operator list built above.
    if (opList) {
      const PAINT = new Set([
        lib.OPS.paintImageXObject,
        lib.OPS.paintInlineImageXObject,
        lib.OPS.paintImageMaskXObject,
        lib.OPS.paintJpegXObject,
      ].filter((v) => v !== undefined));
      for (const fn of opList.fnArray) if (PAINT.has(fn)) imageCount++;
    }
  }

  return {
    pages: doc.numPages,
    sizes,
    pageText,
    text: pageText.join('\n'),
    items,
    fonts: [...fonts].sort(),
    links,
    fills: [...fills],
    imageCount,
    /** Distinct text sizes, rounded — a converter that flattens everything to
     *  one body size produces a single entry here. */
    sizes_pt: [...new Set(items.map((i) => Math.round(i.size)))].filter(Boolean).sort((a, b) => a - b),
    /** Pixel size of each embedded JPEG, for measuring export resolution. */
    embeddedJpegs: findEmbeddedJpegs(buf),
  };
}

/**
 * Pixel dimensions of every JPEG embedded in a PDF.
 *
 * A DCTDecode image is stored as the raw JPEG bytes, so its SOF header can be
 * read straight out of the file. This is what makes export resolution
 * measurable: a slide image of N pixels across a 297mm page is N/11.69 DPI, so
 * "is the export print-safe" becomes an arithmetic question rather than a
 * judgement. Going through pdf.js for it would need the optional `canvas`
 * module, which is not installed.
 */
function findEmbeddedJpegs(buf) {
  const b = Buffer.from(buf);
  const found = [];
  for (let i = 0; i < b.length - 3; i++) {
    // SOI followed by a marker byte is the start of a JPEG stream.
    if (b[i] !== 0xff || b[i + 1] !== 0xd8 || b[i + 2] !== 0xff) continue;
    let p = i + 2;
    while (p < b.length - 8) {
      if (b[p] !== 0xff) break;
      const marker = b.readUInt16BE(p);
      if (marker === 0xffda) break;                       // start of scan
      const segLen = b.readUInt16BE(p + 2);
      if (segLen < 2) break;
      if (marker >= 0xffc0 && marker <= 0xffcf &&
          marker !== 0xffc4 && marker !== 0xffc8 && marker !== 0xffcc) {
        found.push({ width: b.readUInt16BE(p + 7), height: b.readUInt16BE(p + 5) });
        break;
      }
      p += 2 + segLen;
    }
    i = p;   // skip past the header we just walked
  }
  return found;
}

/* ------------------------------------------------------------------- DOCX */

/** Strip tags to recover the visible text of a WordprocessingML part. */
function wordText(xml) {
  return xml
    .replace(/<w:tab\b[^>]*\/>/g, '\t')
    .replace(/<\/w:p>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/[ \t]+\n/g, '\n');
}

/**
 * @returns {Promise<{parts:string[], documentXml:string, text:string,
 *   fonts:string[], colors:string[], sizesHalfPt:number[], images:number,
 *   tables:number, hasNumbering:boolean, hasHeader:boolean, sectPr:object|null}>}
 */
export async function readDocx(buf) {
  const zip = await JSZip.loadAsync(buf);
  const parts = Object.keys(zip.files).filter((f) => !zip.files[f].dir);
  const documentXml = zip.file('word/document.xml')
    ? await zip.file('word/document.xml').async('string')
    : '';

  const grab = (re) => [...documentXml.matchAll(re)].map((m) => m[1]);

  /* A document can hold several sections with different geometry — the
     fixture ends portrait-then-landscape precisely to catch converters that
     read only the first one. Collect them all, in document order. */
  const sections = [...documentXml.matchAll(/<w:pgSz\b([^>]*)\/>/g)].map((m) => {
    const a = m[1];
    const w = +((a.match(/w:w="(\d+)"/) || [])[1] || 0);
    const h = +((a.match(/w:h="(\d+)"/) || [])[1] || 0);
    return {
      widthTwips: w,
      heightTwips: h,
      orientation: /w:orient="landscape"/.test(a) || w > h ? 'landscape' : 'portrait',
    };
  });

  return {
    parts,
    documentXml,
    text: wordText(documentXml),
    fonts: [...new Set(grab(/w:ascii="([^"]+)"/g))].sort(),
    colors: [...new Set(grab(/<w:color w:val="([^"]+)"/g))].sort(),
    sizesHalfPt: [...new Set(grab(/<w:sz w:val="(\d+)"/g).map(Number))].sort((a, b) => a - b),
    highlights: [...new Set(grab(/<w:highlight w:val="([^"]+)"/g))],
    shading: [...new Set(grab(/<w:shd\b[^>]*w:fill="([^"]+)"/g))],
    alignments: [...new Set(grab(/<w:jc w:val="([^"]+)"/g))].sort(),
    images: (documentXml.match(/<(w:drawing|w:pict)\b/g) || []).length,
    tables: (documentXml.match(/<w:tbl>/g) || []).length,
    hyperlinks: (documentXml.match(/<w:hyperlink\b/g) || []).length,
    hasNumbering: parts.includes('word/numbering.xml') && /<w:numPr>/.test(documentXml),
    hasHeader: parts.some((p) => /word\/header\d*\.xml/.test(p)),
    hasFooter: parts.some((p) => /word\/footer\d*\.xml/.test(p)),
    sections,
    sectPr: sections[0] || null,
  };
}

/* ------------------------------------------------------------------- XLSX */

/**
 * Decode XML character entities in cell text.
 *
 * A literal `"` is stored in the sheet XML as `&quot;` — that is the file
 * being correct, not corrupted. Reading it raw made a properly-written cell
 * report as `Contains &quot;quoted&qu…` and very nearly got logged as a tool
 * defect. `&amp;` is unescaped last so `&amp;lt;` does not double-decode.
 */
function unescapeXml(v) {
  if (v == null) return v;
  return String(v)
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&amp;/g, '&');
}

/**
 * @returns {Promise<{parts:string[], sheets:Array, styleCount:number,
 *   numFmts:string[], fills:number, merges:number, hasCols:boolean, hasPanes:boolean}>}
 */
export async function readXlsx(buf) {
  const zip = await JSZip.loadAsync(buf);
  const parts = Object.keys(zip.files).filter((f) => !zip.files[f].dir);

  const wbXml = zip.file('xl/workbook.xml') ? await zip.file('xl/workbook.xml').async('string') : '';
  const names = [...wbXml.matchAll(/<sheet\b[^>]*name="([^"]+)"/g)].map((m) => m[1]);

  // Shared strings, if the writer used them.
  let shared = [];
  if (zip.file('xl/sharedStrings.xml')) {
    const ss = await zip.file('xl/sharedStrings.xml').async('string');
    shared = [...ss.matchAll(/<si>([\s\S]*?)<\/si>/g)]
      .map((m) => (m[1].match(/<t[^>]*>([\s\S]*?)<\/t>/g) || [])
        .map((t) => t.replace(/<[^>]+>/g, '')).join(''));
  }

  /* Resolve what a cell style index actually paints, so a merge can be asked
     whether each source workbook kept its OWN colours. A count of styled
     cells cannot answer that: cells carrying stale indices from another
     workbook are still "styled", just wrong. */
  const stylesXml = zip.file('xl/styles.xml') ? await zip.file('xl/styles.xml').async('string') : '';
  const sectionOf = (name) => {
    const open = new RegExp('<' + name + '(?=[\\s/>])');
    const m = open.exec(stylesXml);
    if (!m) return '';
    const gt = stylesXml.indexOf('>', m.index);
    const close = stylesXml.indexOf('</' + name + '>', gt);
    return close < 0 ? '' : stylesXml.slice(gt + 1, close);
  };
  const fillColours = [...sectionOf('fills').matchAll(/<fill>([\s\S]*?)<\/fill>/g)]
    .map((m) => (m[1].match(/<fgColor rgb="([0-9A-Fa-f]{6,8})"/) || [])[1] || null);
  const xfFill = [...sectionOf('cellXfs').matchAll(/<xf\b([^>]*)>/g)]
    .map((m) => Number((m[1].match(/fillId="(\d+)"/) || [])[1] ?? 0));

  const sheets = [];
  const sheetPaths = parts.filter((p) => /^xl\/worksheets\/sheet\d+\.xml$/.test(p))
    .sort((a, b) => (+a.match(/(\d+)/)[1]) - (+b.match(/(\d+)/)[1]));

  for (let i = 0; i < sheetPaths.length; i++) {
    const xml = await zip.file(sheetPaths[i]).async('string');
    const cells = [];
    for (const m of xml.matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>|<c\b([^>]*)\/>/g)) {
      const attrs = m[1] || m[3] || '';
      const inner = m[2] || '';
      const ref = (attrs.match(/r="([A-Z]+\d+)"/) || [])[1];
      const type = (attrs.match(/t="(\w+)"/) || [])[1] || 'n';
      const style = (attrs.match(/s="(\d+)"/) || [])[1];
      let value = null;
      if (type === 'inlineStr') value = (inner.match(/<t[^>]*>([\s\S]*?)<\/t>/) || [])[1] ?? '';
      // `<v>` can carry attributes — a value containing a newline is written
      // as `<v xml:space="preserve">`. Matching a bare `<v>` reported those
      // cells as empty, which looked exactly like the converter had dropped
      // the multi-line field when the file was in fact correct.
      else if (type === 's') value = shared[+((inner.match(/<v[^>]*>(\d+)<\/v>/) || [])[1] ?? -1)] ?? '';
      else if (type === 'str') value = (inner.match(/<v[^>]*>([\s\S]*?)<\/v>/) || [])[1] ?? '';
      else value = (inner.match(/<v[^>]*>([\s\S]*?)<\/v>/) || [])[1] ?? null;
      const formula = (inner.match(/<f[^>]*>([\s\S]*?)<\/f>/) || [])[1] || null;
      if (ref) cells.push({ ref, type, style: style ? +style : 0, value: unescapeXml(value), formula });
    }
    sheets.push({
      name: names[i] || sheetPaths[i],
      cells,
      merges: (xml.match(/<mergeCell\b/g) || []).length,
      hasCols: /<col\b/.test(xml),
      hasPanes: /<pane\b/.test(xml),
      // A cell is "styled" only if it points at a non-default cellXfs entry.
      styledCells: cells.filter((c) => c.style > 0).length,
      // The distinct fill colours this sheet's cells actually render as.
      fills: [...new Set(cells.map((c) => fillColours[xfFill[c.style]]).filter(Boolean))],
      numericCells: cells.filter((c) => c.type === 'n' && c.value !== null).length,
    });
  }

  return {
    parts,
    sheets,
    styleCount: (stylesXml.match(/<xf\b/g) || []).length,
    numFmts: [...stylesXml.matchAll(/formatCode="([^"]+)"/g)].map((m) => m[1]),
    fills: (stylesXml.match(/<patternFill\b/g) || []).length,
    fonts: [...new Set([...stylesXml.matchAll(/<name val="([^"]+)"/g)].map((m) => m[1]))],
    borders: (stylesXml.match(/<border>/g) || []).length,
  };
}

/* -------------------------------------------------------------------- ZIP */

/** For tools that emit a .zip of parts (split-*). */
export async function readZip(buf) {
  const zip = await JSZip.loadAsync(buf);
  const names = Object.keys(zip.files).filter((f) => !zip.files[f].dir);
  const entries = [];
  for (const n of names) {
    entries.push({ name: n, bytes: await zip.file(n).async('nodebuffer') });
  }
  return { names, entries };
}

/** Plain text output (txt / csv / json). */
export function readText(buf) {
  return Buffer.from(buf).toString('utf8');
}

/* ------------------------------------------------------------------ IMAGE */

/**
 * Identify a raster image and read its dimensions without decoding it.
 *
 * Deliberately parses the container headers rather than trusting the file
 * extension: a tool that renames a PNG to .jpg and calls it a conversion is a
 * real failure mode, and only the magic bytes catch it.
 *
 * @returns {{format:string, width:number, height:number, hasAlpha:boolean,
 *   hasExif:boolean, bytes:number}}
 */
export function readImage(input) {
  const b = Buffer.from(input);
  const out = { format: 'unknown', width: 0, height: 0, hasAlpha: false, hasExif: false, bytes: b.length, raw: b };

  // PNG: 8-byte signature, then IHDR at offset 8.
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) {
    out.format = 'png';
    out.width = b.readUInt32BE(16);
    out.height = b.readUInt32BE(20);
    const colourType = b[25];
    out.hasAlpha = colourType === 4 || colourType === 6;
    // A palette image can still carry alpha through a tRNS chunk.
    if (!out.hasAlpha) out.hasAlpha = b.includes(Buffer.from('tRNS', 'latin1'));
    return out;
  }

  // JPEG: walk the marker segments to the frame header.
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    out.format = 'jpeg';
    let p = 2;
    while (p < b.length - 8) {
      if (b[p] !== 0xff) break;
      const marker = b.readUInt16BE(p);
      if (marker === 0xffda) break;                       // start of scan
      const segLen = b.readUInt16BE(p + 2);
      if (marker === 0xffe1 && b.subarray(p + 4, p + 8).toString('latin1') === 'Exif') {
        out.hasExif = true;
      }
      // SOF0..SOF15, excluding the DHT/JPG/DAC markers interleaved in that range.
      if (marker >= 0xffc0 && marker <= 0xffcf &&
          marker !== 0xffc4 && marker !== 0xffc8 && marker !== 0xffcc) {
        out.height = b.readUInt16BE(p + 5);
        out.width = b.readUInt16BE(p + 7);
      }
      p += 2 + segLen;
    }
    return out; // JPEG has no alpha channel, ever
  }

  // WebP: RIFF container; VP8X carries a flags byte, VP8L a bit in its header.
  if (b.length > 30 && b.subarray(0, 4).toString('latin1') === 'RIFF' &&
      b.subarray(8, 12).toString('latin1') === 'WEBP') {
    out.format = 'webp';
    const chunkType = b.subarray(12, 16).toString('latin1');
    if (chunkType === 'VP8X') {
      out.hasAlpha = !!(b[20] & 0x10);
      out.width = 1 + (b.readUIntLE(24, 3));
      out.height = 1 + (b.readUIntLE(27, 3));
    } else if (chunkType === 'VP8 ') {
      out.width = b.readUInt16LE(26) & 0x3fff;
      out.height = b.readUInt16LE(28) & 0x3fff;
    } else if (chunkType === 'VP8L') {
      const bits = b.readUInt32LE(21);
      out.width = (bits & 0x3fff) + 1;
      out.height = ((bits >> 14) & 0x3fff) + 1;
      out.hasAlpha = !!((bits >> 28) & 1);
    }
    return out;
  }

  // GIF, in case a tool ever emits one.
  if (b.length > 10 && b.subarray(0, 3).toString('latin1') === 'GIF') {
    out.format = 'gif';
    out.width = b.readUInt16LE(6);
    out.height = b.readUInt16LE(8);
    out.hasAlpha = true;
    return out;
  }

  /* HEIC and AVIF are both ISOBMFF. Rather than walk the box tree down to
     meta > iprp > ipco, scan for the `ispe` (image spatial extents) boxes and
     take the largest — a file carries one per item, and the thumbnail's is
     smaller than the primary image's. Without this the harness reported these
     as 0x0 and compared every conversion against a hardcoded size instead of
     the source's own. */
  if (b.length > 16 && b.subarray(4, 8).toString('latin1') === 'ftyp') {
    const brand = b.subarray(8, 12).toString('latin1');
    out.format = /avif|avis/i.test(brand) ? 'avif'
      : /heic|heix|hevc|mif1|msf1/i.test(brand) ? 'heic' : 'isobmff';

    let best = 0;
    for (let i = 0; i < b.length - 20; i++) {
      if (b[i] === 0x69 && b[i + 1] === 0x73 && b[i + 2] === 0x70 && b[i + 3] === 0x65) {
        const w = b.readUInt32BE(i + 8);   // after 4 bytes of version+flags
        const h = b.readUInt32BE(i + 12);
        if (w > 0 && h > 0 && w < 65536 && h < 65536 && w * h > best) {
          best = w * h;
          out.width = w;
          out.height = h;
        }
      }
    }
    // AVIF and HEIC both support alpha; whether this file uses it needs a
    // full decode, so it is left unasserted rather than guessed.
    return out;
  }

  // SVG is text, not a container.
  const head = b.subarray(0, 400).toString('utf8');
  if (/<svg[\s>]/i.test(head)) {
    out.format = 'svg';
    const vb = head.match(/viewBox="[\d.\-]+ [\d.\-]+ ([\d.]+) ([\d.]+)"/);
    if (vb) { out.width = Math.round(+vb[1]); out.height = Math.round(+vb[2]); }
    out.hasAlpha = true;
    return out;
  }

  return out;
}
