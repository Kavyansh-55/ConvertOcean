/**
 * PDF → DOCX conversion core.
 *
 * pdf.js already reports the font, size and exact position of every text
 * fragment; the old converter ignored all of it and shipped plain text in an
 * HTML file renamed .doc. This module keeps that information and rebuilds a
 * real WordprocessingML package: styled runs (bold / italic / size / font),
 * paragraphs with indent and centering, tab stops for columnar lines, and
 * real Word tables where consecutive rows share whitespace "rivers".
 *
 * Everything here is pure data-in / data-out so it can run in Node for tests
 * as well as in the browser. The DOM wiring lives in PdfToWord.astro.
 */

/* ---------------------------------------------------------------- helpers */

function esc(s) {
  return String(s)
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function clamp(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v));
}

function twips(pt) {
  return Math.max(0, Math.round(pt * 20));
}

function maxKey(map) {
  let best = null;
  let bestW = -1;
  for (const [k, w] of map) {
    if (w > bestW) { best = k; bestW = w; }
  }
  return best;
}

/**
 * Subset PDF font names look like "ABCDEF+TimesNewRomanPS-BoldMT". Recover a
 * name Word can use, falling back to the generic family pdf.js reports.
 */
export function cleanFontName(raw, family) {
  let n = String(raw || '').replace(/^[A-Z]{6}\+/, '');
  n = n.split(',')[0].split('-')[0].replace(/(PSMT|PS|MT)$/, '').trim();
  n = n.replace(/([a-z])([A-Z])/g, '$1 $2');
  if (!n || n.length < 3 || !/[a-zA-Z]/.test(n)) {
    if (family === 'serif') return 'Times New Roman';
    if (family === 'monospace') return 'Courier New';
    return 'Calibri';
  }
  return n;
}

/* ------------------------------------------------- lines from pdf.js items */

/**
 * Turn textContent items into visual lines. Fragments sharing a baseline are
 * gathered into a line; inside a line small gaps become spaces and large gaps
 * split the line into segments (columns of a table row, label/value pairs…).
 *
 * @param {object} textContent result of page.getTextContent()
 * @param {(fontId: string) => string} fontNameOf resolves a pdf.js font id to
 *   the real font name (via page.commonObjs); may return ''.
 * @returns {Array} lines with { y, minX, endX, maxSize, segments }
 */
export function collectPageLines(textContent, fontNameOf) {
  const styles = textContent.styles || {};
  const items = textContent.items || [];
  const fontCache = new Map();

  function fontInfo(id) {
    if (fontCache.has(id)) return fontCache.get(id);
    const raw = fontNameOf ? fontNameOf(id) || '' : '';
    const family = (styles[id] && styles[id].fontFamily) || '';
    const info = {
      name: cleanFontName(raw, family),
      bold: /bold|black|heavy|semibold|demibold|extrabold/i.test(raw),
      italic: /italic|oblique/i.test(raw),
    };
    fontCache.set(id, info);
    return info;
  }

  const rawLines = [];
  let cur = null;
  const pushCur = () => {
    if (cur && cur.frags.length) rawLines.push(cur);
    cur = null;
  };

  for (const it of items) {
    if (typeof it.str !== 'string') continue;
    if (!it.str) { if (it.hasEOL) pushCur(); continue; }

    const tr = it.transform || [10, 0, 0, 10, 0, 0];
    const x = tr[4];
    const y = tr[5];
    const size = Math.hypot(tr[2], tr[3]) || it.height || 10;
    const f = fontInfo(it.fontName);

    // New baseline means new line; half the glyph height tolerates
    // sub/superscripts and rounding without splitting a real line.
    if (!cur || Math.abs(cur.y - y) > Math.max(2, size * 0.5)) {
      pushCur();
      cur = { y, frags: [] };
    }
    cur.frags.push({
      x,
      endX: x + (it.width || 0),
      text: it.str,
      size,
      bold: f.bold,
      italic: f.italic,
      font: f.name,
    });
    if (it.hasEOL) pushCur();
  }
  pushCur();

  return rawLines.map(finalizeLine).filter((l) => l.text.length);
}

function finalizeLine(line) {
  line.frags.sort((a, b) => a.x - b.x);
  const segments = [];
  let seg = null;
  let prev = null;

  for (const f of line.frags) {
    // pdf.js represents large horizontal gaps as wide whitespace items.
    // They are separators, not content: skip them and let the distance
    // between real ink fragments decide spaces vs. column breaks.
    if (!f.text.trim()) continue;
    const gap = prev ? f.x - prev.endX : 0;
    const ref = prev ? Math.max(prev.size, f.size) : f.size;
    if (!seg || (prev && gap > Math.max(9, ref * 1.4))) {
      seg = { x: f.x, endX: f.endX, runs: [] };
      segments.push(seg);
      appendRun(seg.runs, runOf(f, false));
    } else {
      // PDFs frequently split mid-word; only add a space for a real gap.
      appendRun(seg.runs, runOf(f, gap > ref * 0.12));
    }
    seg.endX = Math.max(seg.endX, f.endX);
    prev = f;
  }

  for (const s of segments) {
    for (const r of s.runs) r.text = r.text.replace(/\s+/g, ' ');
    s.text = s.runs.map((r) => r.text).join('').trim();
  }
  const kept = segments.filter((s) => s.text);

  let maxSize = 0;
  for (const s of kept) for (const r of s.runs) maxSize = Math.max(maxSize, r.size);

  return {
    y: line.y,
    minX: kept.length ? kept[0].x : 0,
    endX: kept.length ? kept[kept.length - 1].endX : 0,
    maxSize,
    segments: kept,
    text: kept.map((s) => s.text).join('\t'),
  };
}

function runOf(f, spaceBefore) {
  return {
    text: (spaceBefore ? ' ' : '') + f.text,
    bold: f.bold,
    italic: f.italic,
    size: f.size,
    font: f.font,
  };
}

function appendRun(runs, r) {
  const last = runs[runs.length - 1];
  if (
    last &&
    last.bold === r.bold &&
    last.italic === r.italic &&
    last.font === r.font &&
    Math.abs(last.size - r.size) < 0.6
  ) {
    last.text += r.text;
  } else {
    runs.push(r);
  }
}

/* ------------------------------------------------------------ block layout */

// Vertical distance between two lines reading downwards; a negative step
// (text jumping back up the page) always reads as a hard break.
function vgap(a, b) {
  const d = a.y - b.y;
  return d > 0 ? d : Number.MAX_SAFE_INTEGER;
}

function typicalWrapGap(lines) {
  const steps = [];
  for (let i = 1; i < lines.length; i++) {
    const d = lines[i - 1].y - lines[i].y;
    if (d > 0) steps.push(d);
  }
  if (!steps.length) return 18;
  steps.sort((a, b) => a - b);
  // Low percentile on purpose: paragraph gaps sit at the top of this
  // distribution and would drag a median up on short pages.
  return steps[Math.floor(steps.length * 0.3)] * 1.6;
}

function pageBlocks(lines, wrapGap) {
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    if (lines[i].segments.length >= 2) {
      let j = i;
      while (
        j + 1 < lines.length &&
        lines[j + 1].segments.length >= 2 &&
        vgap(lines[j], lines[j + 1]) <= Math.max(wrapGap * 1.8, 30)
      ) {
        j++;
      }
      if (j > i) {
        const table = tryTable(lines.slice(i, j + 1));
        if (table) {
          blocks.push(table);
          i = j + 1;
          continue;
        }
      }
      blocks.push({ type: 'tabline', line: lines[i] });
      i++;
      continue;
    }

    const para = [lines[i]];
    i++;
    while (
      i < lines.length &&
      lines[i].segments.length === 1 &&
      vgap(para[para.length - 1], lines[i]) <= wrapGap &&
      Math.abs(para[para.length - 1].maxSize - lines[i].maxSize) < 1.2
    ) {
      para.push(lines[i]);
      i++;
    }
    blocks.push({ type: 'para', lines: para });
  }
  return blocks;
}

/* ----------------------------------------------------------- table detect */

// Gap intervals of one row across [minX, maxX] — the whitespace it leaves.
function rowGaps(row, minX, maxX) {
  const gaps = [];
  let cursor = minX;
  for (const s of row.segments) {
    if (s.x - cursor > 0) gaps.push([cursor, s.x]);
    cursor = Math.max(cursor, s.endX);
  }
  if (maxX - cursor > 0) gaps.push([cursor, maxX]);
  return gaps;
}

function intersectIntervals(a, b) {
  const out = [];
  for (const [as, ae] of a) {
    for (const [bs, be] of b) {
      const s = Math.max(as, bs);
      const e = Math.min(ae, be);
      if (e - s > 0) out.push([s, e]);
    }
  }
  return out;
}

/**
 * Recognise a run of columnar lines as a table by finding vertical
 * whitespace "rivers" that every row shares. Conservative on purpose: a
 * false table mangles prose worse than tabs mangle a table.
 */
function tryTable(rows) {
  const minX = Math.min(...rows.map((r) => r.minX));
  const maxX = Math.max(...rows.map((r) => r.endX));
  if (maxX - minX < 60) return null;

  let rivers = rowGaps(rows[0], minX, maxX);
  for (let i = 1; i < rows.length && rivers.length; i++) {
    rivers = intersectIntervals(rivers, rowGaps(rows[i], minX, maxX));
  }
  rivers = rivers.filter(([s, e]) => e - s >= 5);
  if (!rivers.length) return null;
  rivers.sort((a, b) => a[0] - b[0]);

  // Regions between rivers become columns.
  const cols = [];
  let start = minX;
  for (const [rs, re] of rivers) {
    if (rs - start >= 8) cols.push({ x: start, endX: rs });
    start = Math.max(start, re);
  }
  if (maxX - start >= 8) cols.push({ x: start, endX: maxX });
  if (cols.length < 2 || cols.length > 12) return null;

  const cellRows = rows.map((row) => {
    const cells = cols.map(() => []);
    for (const s of row.segments) {
      let best = 0;
      let bestOverlap = -1;
      cols.forEach((c, ci) => {
        const overlap = Math.min(c.endX, s.endX) - Math.max(c.x, s.x);
        if (overlap > bestOverlap) { bestOverlap = overlap; best = ci; }
      });
      cells[best].push(s);
    }
    return cells;
  });

  // Sanity: mostly-filled grid of short cells, otherwise it is prose.
  let filled = 0;
  let textLen = 0;
  let cellCount = 0;
  for (const row of cellRows) {
    for (const cell of row) {
      cellCount++;
      if (cell.length) {
        filled++;
        textLen += cell.reduce((n, s) => n + s.text.length, 0);
      }
    }
  }
  if (filled / cellCount < 0.5) return null;
  if (textLen / filled > 80) return null;

  return { type: 'table', cols, cellRows };
}

/* -------------------------------------------------------------- XML emit */

function runXml(r, ctx) {
  const props = [];
  if (r.font && r.font !== ctx.bodyFont) {
    props.push(`<w:rFonts w:ascii="${esc(r.font)}" w:hAnsi="${esc(r.font)}"/>`);
  }
  if (r.bold) props.push('<w:b/>');
  if (r.italic) props.push('<w:i/>');
  const sz = Math.round(r.size * 2);
  if (sz && Math.abs(r.size - ctx.bodySize) > 0.5) {
    props.push(`<w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/>`);
  }
  const rPr = props.length ? `<w:rPr>${props.join('')}</w:rPr>` : '';
  return `<w:r>${rPr}<w:t xml:space="preserve">${esc(r.text)}</w:t></w:r>`;
}

function isCentered(minX, endX, ctx) {
  const mid = (minX + endX) / 2;
  const pageMid = (ctx.contentLeft + ctx.contentRight) / 2;
  const width = ctx.contentRight - ctx.contentLeft;
  return minX - ctx.contentLeft > 24 && Math.abs(mid - pageMid) < width * 0.06;
}

function paraXml(paraLines, ctx) {
  const runs = [];
  paraLines.forEach((ln, idx) => {
    const segRuns = ln.segments[0].runs;
    if (idx > 0 && runs.length) {
      const prevLast = runs[runs.length - 1];
      const nextText = (segRuns[0] && segRuns[0].text) || '';
      // Undo hyphenation at wrapped line ends, but only when the next line
      // continues in lowercase — real hyphens stay.
      if (/[-­]$/.test(prevLast.text) && /^[a-zà-ÿ]/.test(nextText)) {
        prevLast.text = prevLast.text.replace(/[-­]$/, '');
      } else {
        appendRun(runs, { ...prevLast, text: ' ' });
      }
    }
    for (const r of segRuns) appendRun(runs, { ...r });
  });

  const first = paraLines[0];
  const paraMinX = Math.min(...paraLines.map((l) => l.minX));
  const heading = first.maxSize >= ctx.bodySize * 1.2;
  const centered = paraLines.every((l) => isCentered(l.minX, l.endX, ctx));

  const pPr = [];
  if (centered) {
    pPr.push('<w:jc w:val="center"/>');
  } else {
    const left = paraMinX - ctx.contentLeft;
    const firstIndent = first.minX - paraMinX;
    const ind = [];
    if (left > 3) ind.push(`w:left="${twips(left)}"`);
    if (firstIndent > 3) ind.push(`w:firstLine="${twips(firstIndent)}"`);
    if (paraLines.length > 1) {
      const hang = paraLines[1].minX - first.minX;
      if (hang > 3) ind.push(`w:left="${twips(paraLines[1].minX - ctx.contentLeft)}" w:hanging="${twips(hang)}"`);
    }
    if (ind.length) pPr.push(`<w:ind ${[...new Set(ind)].join(' ')}/>`);
  }
  pPr.push(heading ? '<w:spacing w:before="200" w:after="120"/>' : '<w:spacing w:after="120"/>');

  return `<w:p><w:pPr>${pPr.join('')}</w:pPr>${runs.map((r) => runXml(r, ctx)).join('')}</w:p>`;
}

function tablineXml(line, ctx) {
  const pPr = [];
  const stops = line.segments
    .slice(1)
    .map((s) => `<w:tab w:val="left" w:pos="${twips(s.x - ctx.contentLeft)}"/>`)
    .join('');
  if (stops) pPr.push(`<w:tabs>${stops}</w:tabs>`);
  const left = line.minX - ctx.contentLeft;
  if (left > 3) pPr.push(`<w:ind w:left="${twips(left)}"/>`);
  pPr.push('<w:spacing w:after="60"/>');

  let xml = `<w:p><w:pPr>${pPr.join('')}</w:pPr>`;
  line.segments.forEach((seg, si) => {
    if (si > 0) xml += '<w:r><w:tab/></w:r>';
    xml += seg.runs.map((r) => runXml(r, ctx)).join('');
  });
  return xml + '</w:p>';
}

const CELL_MARGIN =
  '<w:tblCellMar>' +
  '<w:top w:w="40" w:type="dxa"/><w:left w:w="80" w:type="dxa"/>' +
  '<w:bottom w:w="40" w:type="dxa"/><w:right w:w="80" w:type="dxa"/>' +
  '</w:tblCellMar>';

function tableBorders() {
  const side = (n) => `<w:${n} w:val="single" w:sz="4" w:space="0" w:color="808080"/>`;
  return (
    '<w:tblBorders>' +
    ['top', 'left', 'bottom', 'right', 'insideH', 'insideV'].map(side).join('') +
    '</w:tblBorders>'
  );
}

function tableXml(table, ctx) {
  const widths = table.cols.map((c) => twips(c.endX - c.x));
  const ind = twips(Math.max(0, table.cols[0].x - ctx.contentLeft));

  let xml =
    '<w:tbl><w:tblPr>' +
    '<w:tblW w:w="0" w:type="auto"/>' +
    (ind ? `<w:tblInd w:w="${ind}" w:type="dxa"/>` : '') +
    tableBorders() +
    CELL_MARGIN +
    '<w:tblLayout w:type="fixed"/>' +
    '</w:tblPr><w:tblGrid>' +
    widths.map((w) => `<w:gridCol w:w="${w}"/>`).join('') +
    '</w:tblGrid>';

  for (const row of table.cellRows) {
    xml += '<w:tr>';
    row.forEach((cell, ci) => {
      xml += `<w:tc><w:tcPr><w:tcW w:w="${widths[ci]}" w:type="dxa"/></w:tcPr>`;
      if (cell.length) {
        const runs = [];
        cell.forEach((seg, si) => {
          if (si > 0) appendRun(runs, { ...seg.runs[0], text: ' ' });
          for (const r of seg.runs) appendRun(runs, { ...r });
        });
        xml += `<w:p>${runs.map((r) => runXml(r, ctx)).join('')}</w:p>`;
      } else {
        xml += '<w:p/>';
      }
      xml += '</w:tc>';
    });
    xml += '</w:tr>';
  }
  return xml + '</w:tbl>';
}

/* ---------------------------------------------------------------- package */

/**
 * @param {Array} pages [{ lines, width, height }] — width/height in PDF
 *   points from page.getViewport({ scale: 1 }).
 * @returns {{ 'word/document.xml': string, ... } | null} docx parts keyed by
 *   zip path, or null when there is no text at all (scanned PDF).
 */
export function buildDocxParts(pages) {
  const allLines = pages.flatMap((p) => p.lines);
  if (!allLines.length) return null;

  const sizeWeight = new Map();
  const fontWeight = new Map();
  for (const ln of allLines) {
    for (const sg of ln.segments) {
      for (const r of sg.runs) {
        const key = Math.round(r.size * 2) / 2;
        sizeWeight.set(key, (sizeWeight.get(key) || 0) + r.text.length);
        fontWeight.set(r.font, (fontWeight.get(r.font) || 0) + r.text.length);
      }
    }
  }
  const xs = allLines.map((l) => l.minX).sort((a, b) => a - b);
  const ends = allLines.map((l) => l.endX).sort((a, b) => a - b);

  const ctx = {
    bodySize: maxKey(sizeWeight) || 11,
    bodyFont: maxKey(fontWeight) || 'Calibri',
    contentLeft: xs[Math.floor(xs.length * 0.1)] || 72,
    contentRight: ends[Math.floor(ends.length * 0.9)] || 540,
  };

  let body = '';
  pages.forEach((page, pi) => {
    const wrapGap = typicalWrapGap(page.lines);
    for (const block of pageBlocks(page.lines, wrapGap)) {
      if (block.type === 'table') {
        // Word merges adjacent tables unless a paragraph separates them.
        if (body.endsWith('</w:tbl>')) body += '<w:p><w:pPr><w:spacing w:after="0"/></w:pPr></w:p>';
        body += tableXml(block, ctx);
      } else if (block.type === 'tabline') {
        body += tablineXml(block.line, ctx);
      } else {
        body += paraXml(block.lines, ctx);
      }
    }
    if (pi < pages.length - 1) {
      body += '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
    }
  });

  const pageW = (pages[0] && pages[0].width) || 612;
  const pageH = (pages[0] && pages[0].height) || 792;
  const sectPr =
    '<w:sectPr>' +
    `<w:pgSz w:w="${twips(pageW)}" w:h="${twips(pageH)}"/>` +
    `<w:pgMar w:top="720" w:bottom="720" w:left="${clamp(twips(ctx.contentLeft), 360, 2160)}" ` +
    `w:right="${clamp(twips(pageW - ctx.contentRight), 360, 2160)}" w:header="708" w:footer="708" w:gutter="0"/>` +
    '</w:sectPr>';

  const documentXml =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" ' +
    'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
    `<w:body>${body}${sectPr}</w:body></w:document>`;

  const sz = Math.round(ctx.bodySize * 2);
  const stylesXml =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
    '<w:docDefaults><w:rPrDefault><w:rPr>' +
    `<w:rFonts w:ascii="${esc(ctx.bodyFont)}" w:hAnsi="${esc(ctx.bodyFont)}" w:cs="${esc(ctx.bodyFont)}"/>` +
    `<w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/>` +
    '</w:rPr></w:rPrDefault>' +
    '<w:pPrDefault><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr></w:pPrDefault>' +
    '</w:docDefaults>' +
    '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>' +
    '</w:styles>';

  return {
    '[Content_Types].xml':
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/>' +
      '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
      '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>' +
      '</Types>',
    '_rels/.rels':
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
      '</Relationships>',
    'word/_rels/document.xml.rels':
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
      '</Relationships>',
    'word/document.xml': documentXml,
    'word/styles.xml': stylesXml,
  };
}

/** Plain-text view of the extracted pages, for the preview pane and the
 *  scanned-PDF (no text layer) check. */
export function pagesPlainText(pages) {
  return pages
    .map((p) => p.lines.map((l) => l.text).join('\n'))
    .join('\n\n')
    .trim();
}
