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
    .replace(/[\uFFFE\uFFFF]/g, '')
    // Unpaired surrogates (broken ToUnicode maps) are invalid XML: keep whole
    // pairs, drop lone halves. No lookbehind so older Safari still parses this file.
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDFFF]/g, (m) => (m.length === 2 ? m : ''))
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
          table.y = lines[i].y;
          blocks.push(table);
          i = j + 1;
          continue;
        }
      }
      blocks.push({ type: 'tabline', line: lines[i], y: lines[i].y });
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
    blocks.push({ type: 'para', lines: para, y: para[0].y });
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

  // Children of w:pPr must follow the schema sequence — Word refuses the
  // whole file otherwise: tabs, spacing, ind, jc.
  const pPr = [];
  pPr.push(heading ? '<w:spacing w:before="200" w:after="120"/>' : '<w:spacing w:after="120"/>');
  if (!centered) {
    // w:left is the indent of the paragraph body; the first line then moves
    // right of it (w:firstLine) or left of it (w:hanging) — never both, and
    // exactly one w:left.
    const restMin = paraLines.length > 1
      ? Math.min(...paraLines.slice(1).map((l) => l.minX))
      : first.minX;
    const bodyLeft = Math.max(0, restMin - ctx.contentLeft);
    const firstDelta = first.minX - restMin;
    const attrs = [];
    if (firstDelta > 3) {
      if (bodyLeft > 3) attrs.push(`w:left="${twips(bodyLeft)}"`);
      attrs.push(`w:firstLine="${twips(firstDelta)}"`);
    } else if (firstDelta < -3) {
      const hang = Math.min(-firstDelta, bodyLeft);
      if (bodyLeft > 3) attrs.push(`w:left="${twips(bodyLeft)}"`);
      if (hang > 3) attrs.push(`w:hanging="${twips(hang)}"`);
    } else if (bodyLeft > 3) {
      attrs.push(`w:left="${twips(bodyLeft)}"`);
    }
    if (attrs.length) pPr.push(`<w:ind ${attrs.join(' ')}/>`);
  } else {
    pPr.push('<w:jc w:val="center"/>');
  }

  return `<w:p><w:pPr>${pPr.join('')}</w:pPr>${runs.map((r) => runXml(r, ctx)).join('')}</w:p>`;
}

function tablineXml(line, ctx) {
  const pPr = [];
  const stops = line.segments
    .slice(1)
    .map((s) => `<w:tab w:val="left" w:pos="${twips(s.x - ctx.contentLeft)}"/>`)
    .join('');
  // Schema sequence for w:pPr children: tabs, spacing, ind.
  if (stops) pPr.push(`<w:tabs>${stops}</w:tabs>`);
  pPr.push('<w:spacing w:after="60"/>');
  const left = line.minX - ctx.contentLeft;
  if (left > 3) pPr.push(`<w:ind w:left="${twips(left)}"/>`);

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
    // Schema sequence for w:tblPr children: tblBorders, tblLayout, tblCellMar.
    tableBorders() +
    '<w:tblLayout w:type="fixed"/>' +
    CELL_MARGIN +
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

/* --------------------------------------------------------- vector graphics */

const matApply = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const matMul = (a, b) => [
  a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1],
  a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3],
  a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5],
];
const boxOf = (pts) => {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
};

/**
 * Collect the bounding boxes of vector drawings and raster images on a page,
 * in the same coordinate space as the text (PDF points, origin bottom-left).
 *
 * pdf.js gives each path a minMax bbox, and every op runs under a current
 * transformation matrix we track through save/restore/transform. That is what
 * lets us later find a diagram, cut its stray labels out of the text, and drop
 * a rendered picture of it in the same place.
 *
 * @param {object} opList result of page.getOperatorList()
 * @param {object} OPS pdfjsLib.OPS enum
 * @returns {Array} boxes [{ x0, y0, x1, y1, curve, image }]
 */
export function collectPageGraphics(opList, OPS) {
  if (!opList || !OPS) return [];
  const boxes = [];
  const stack = [];
  let ctm = [1, 0, 0, 1, 0, 0];
  const fn = opList.fnArray;
  const args = opList.argsArray;

  // Paint operators that actually put ink on the page.
  const paintOps = new Set([
    OPS.fill, OPS.eoFill, OPS.stroke, OPS.closeStroke,
    OPS.fillStroke, OPS.eoFillStroke, OPS.closeFillStroke, OPS.closeEOFillStroke,
  ]);

  // A path is only recorded once it is painted. Clip paths (constructPath
  // followed by clip + endPath, no paint) get big bounding boxes but draw
  // nothing — recording them would bridge a diagram into a neighbouring
  // table. So hold the last constructPath as pending and commit on paint.
  let pending = null;

  for (let i = 0; i < fn.length; i++) {
    const op = fn[i];
    if (op === OPS.save) {
      stack.push(ctm.slice());
    } else if (op === OPS.restore) {
      ctm = stack.pop() || [1, 0, 0, 1, 0, 0];
    } else if (op === OPS.transform) {
      ctm = matMul(ctm, args[i]);
    } else if (op === OPS.constructPath) {
      const subOps = args[i][0];
      const mm = args[i][2];
      if (mm && mm.length >= 4 && isFinite(mm[0]) && isFinite(mm[2])) {
        const b = boxOf([
          matApply(ctm, mm[0], mm[1]), matApply(ctm, mm[2], mm[3]),
          matApply(ctm, mm[0], mm[3]), matApply(ctm, mm[2], mm[1]),
        ]);
        let curve = false;
        if (subOps && subOps.length) {
          for (const s of subOps) {
            if (s === OPS.curveTo || s === OPS.curveTo2 || s === OPS.curveTo3) { curve = true; break; }
          }
        }
        pending = { x0: b[0], y0: b[1], x1: b[2], y1: b[3], curve, image: false };
      } else {
        pending = null;
      }
    } else if (paintOps.has(op)) {
      if (pending) { boxes.push(pending); pending = null; }
    } else if (op === OPS.endPath) {
      pending = null; // clip-only path: painted nothing
    } else if (
      op === OPS.paintImageXObject || op === OPS.paintInlineImageXObject ||
      op === OPS.paintImageMaskXObject || op === OPS.paintJpegXObject
    ) {
      // An image is painted into the unit square, positioned by the CTM.
      const b = boxOf([
        matApply(ctm, 0, 0), matApply(ctm, 1, 0),
        matApply(ctm, 0, 1), matApply(ctm, 1, 1),
      ]);
      boxes.push({ x0: b[0], y0: b[1], x1: b[2], y1: b[3], curve: false, image: true });
    }
  }
  return boxes;
}

/**
 * Cluster graphic boxes into figure regions and keep only those that read as
 * a real diagram or picture — not a ruled table, a page rule, or a text
 * underline. Coordinates are PDF points, origin bottom-left.
 *
 * @param {Array} boxes from collectPageGraphics
 * @param {Array} lines from collectPageLines (used to protect real tables)
 * @param {number} pageW
 * @param {number} pageH
 * @returns {Array} regions [{ x0, y0, x1, y1 }] top-to-bottom
 */
export function detectFigureRegions(boxes, lines, pageW, pageH) {
  if (!boxes || !boxes.length) return [];

  // Drop full-width/height hairlines: page borders, header/footer rules.
  // (Clip paths are already excluded upstream by paint-gating.)
  const useful = boxes.filter((b) => {
    const w = b.x1 - b.x0;
    const h = b.y1 - b.y0;
    if (b.image) return true;
    if (w > pageW * 0.85 && h < 3) return false;
    if (h > pageH * 0.85 && w < 3) return false;
    return true;
  });
  if (!useful.length) return [];

  const ls = (lines || []).slice().sort((a, b) => b.y - a.y); // top → bottom

  // A diagram lives in the vertical gap between the surrounding body text.
  // Rather than reconstruct it from fragmented strokes, we bound it by that
  // text: prose lines, headings and figure captions are "dividers"; the
  // diagram's own short labels (S0, 1 / 0, Memory, Input(s)…) are not. The
  // band between two dividers that holds real drawing ink is the figure, and
  // the labels inside it mark its true extent — the "1" and "0" beside an arc
  // pin down where the arc reaches even when the arc stroke itself is lost.
  const sizes = ls.map((l) => l.maxSize).filter((s) => s > 0).sort((a, b) => a - b);
  const bodySize = sizes.length ? sizes[Math.floor(sizes.length / 2)] : 11;
  // A line is a "divider" (prose, heading or caption) that bounds a figure —
  // as opposed to a short diagram label. Long text by width OR character count
  // is a divider: a wrapped sentence can be only moderately wide yet is plainly
  // prose, while diagram labels ("S0", "1 / 0", "Memory") stay short.
  const isDivider = (l) =>
    (l.endX - l.minX) > pageW * 0.4 ||
    l.text.length > 32 ||
    l.maxSize >= bodySize * 1.18 ||
    /^\s*figure\b/i.test(l.text);

  const bounds = [pageH + 20];
  for (const l of ls) if (isDivider(l)) bounds.push(l.y);
  bounds.push(-20);

  const regions = [];
  for (let i = 0; i < bounds.length - 1; i++) {
    const yHi = bounds[i];
    const yLo = bounds[i + 1];
    if (yHi - yLo < 28) continue;

    const ink = useful.filter((b) => {
      const cy = (b.y0 + b.y1) / 2;
      return cy > yLo + 2 && cy < yHi - 2;
    });
    if (!ink.length) continue;

    const gx0 = Math.min(...ink.map((b) => b.x0));
    const gx1 = Math.max(...ink.map((b) => b.x1));
    const gy0 = Math.min(...ink.map((b) => b.y0));
    const gy1 = Math.max(...ink.map((b) => b.y1));
    if (gx1 - gx0 < 40 || gy1 - gy0 < 20) continue;

    const curve = ink.some((b) => b.curve);
    const image = ink.some((b) => b.image);
    if (!(curve || image || ink.length >= 8)) continue;

    // Non-divider labels sitting in this band, near the drawing horizontally.
    const labels = ls.filter((l) => {
      if (isDivider(l)) return false;
      const cx = (l.minX + l.endX) / 2;
      return l.y > yLo - 2 && l.y < yHi + 2 && cx > gx0 - 90 && cx < gx1 + 90;
    });

    // Curves or a raster image are always a figure (state diagrams, logos).
    // A straight-line band is trickier: block diagrams, ruled tables, Karnaugh
    // maps and stray table-border bleed all look similar. Keep it only when it
    // carries a few real labels (a block diagram) and is not a dense grid (a
    // table / K-map), so tables stay editable and border artifacts are ignored.
    if (!curve && !image) {
      if (labels.length < 2) continue;                       // border bleed
      const cols = labels.filter((l) => l.segments.length >= 2);
      if (cols.length >= 2 && tryTable(cols)) continue;      // ruled table
      if (cols.length >= 4) continue;                        // dense grid
      const chars = labels.reduce((n, l) => n + l.text.length, 0);
      if (chars > 220) continue;
    }

    // Extent = the drawing ink together with its labels.
    let x0 = gx0;
    let x1 = gx1;
    let y0 = gy0;
    let y1 = gy1;
    for (const l of labels) {
      x0 = Math.min(x0, l.minX);
      x1 = Math.max(x1, l.endX);
      y0 = Math.min(y0, l.y - 2);
      y1 = Math.max(y1, l.y + (l.maxSize || 10));
    }
    // Stay inside the band the dividers define.
    y0 = Math.max(y0, yLo);
    y1 = Math.min(y1, yHi);
    if (y1 - y0 < 24 || x1 - x0 < 40) continue;
    regions.push({ x0, y0, x1, y1 });
  }

  // Merge only regions that genuinely overlap in y — never bridge two stacked
  // diagrams across the prose sitting between them (that would bury a sentence
  // inside an image). Sorted top-to-bottom, `last` is higher on the page, so a
  // real overlap means the current region's top rises above the previous
  // region's bottom.
  regions.sort((a, b) => b.y1 - a.y1);
  const merged = [];
  for (const r of regions) {
    const last = merged[merged.length - 1];
    if (last && r.y1 > last.y0 + 4 && r.x0 <= last.x1 && r.x1 >= last.x0) {
      last.y0 = Math.min(last.y0, r.y0);
      last.y1 = Math.max(last.y1, r.y1);
      last.x0 = Math.min(last.x0, r.x0);
      last.x1 = Math.max(last.x1, r.x1);
    } else {
      merged.push({ ...r });
    }
  }
  return merged;
}

// Lines with diagram labels removed. A line is dropped only when it sits
// inside a figure region AND is short enough to be a label — wide prose is
// never deleted, so body text can never silently vanish into an image even if
// a region is drawn a little too large.
function linesOutsideRegions(lines, regions, pageW) {
  if (!regions || !regions.length) return lines;
  const proseWidth = (pageW || 612) * 0.4;
  return lines.filter((l) => {
    // Prose (wide or long) is never deleted; only short labels are.
    if (l.endX - l.minX > proseWidth || l.text.length > 32) return true;
    const cx = (l.minX + l.endX) / 2;
    return !regions.some((r) =>
      cx >= r.x0 - 2 && cx <= r.x1 + 2 && l.y >= r.y0 - 2 && l.y <= r.y1 + 2);
  });
}

const EMU_PER_PT = 12700;

function inlineImageXml(cx, cy, id, rid) {
  return (
    '<w:r><w:drawing>' +
    '<wp:inline distT="0" distB="0" distL="0" distR="0" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing">' +
    `<wp:extent cx="${cx}" cy="${cy}"/>` +
    '<wp:effectExtent l="0" t="0" r="0" b="0"/>' +
    `<wp:docPr id="${id}" name="Figure ${id}"/>` +
    '<wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr>' +
    '<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">' +
    '<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">' +
    `<pic:nvPicPr><pic:cNvPr id="${id}" name="Figure ${id}"/><pic:cNvPicPr/></pic:nvPicPr>` +
    `<pic:blipFill><a:blip r:embed="${rid}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>` +
    `<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>` +
    '</pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>'
  );
}

function imageParaXml(region, ctx, id, rid) {
  let wPt = region.x1 - region.x0;
  let hPt = region.y1 - region.y0;
  const avail = ctx.contentRight - ctx.contentLeft;
  if (wPt > avail && wPt > 0) { const s = avail / wPt; wPt *= s; hPt *= s; }
  const cx = Math.max(1, Math.round(wPt * EMU_PER_PT));
  const cy = Math.max(1, Math.round(hPt * EMU_PER_PT));
  return (
    '<w:p><w:pPr><w:spacing w:before="120" w:after="120"/><w:jc w:val="center"/></w:pPr>' +
    inlineImageXml(cx, cy, id, rid) +
    '</w:p>'
  );
}

/**
 * @param {Array} pages [{ lines, width, height, regions }] — width/height in
 *   PDF points from page.getViewport({ scale: 1 }). Each region may carry a
 *   { png: Uint8Array } rendered by the browser; regions without one still
 *   have their stray label text removed.
 * @returns {object | null} docx parts keyed by zip path, or null when there is
 *   neither text nor any figure image (a scanned PDF).
 */
export function buildDocxParts(pages) {
  // Text with diagram labels removed, page by page.
  const pageLines = pages.map((p) => linesOutsideRegions(p.lines, p.regions, p.width));
  const allLines = pageLines.flat();
  const imageRegions = pages.flatMap((p) => (p.regions || []).filter((r) => r && r.png));
  if (!allLines.length && !imageRegions.length) return null;

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
    contentLeft: xs.length ? xs[Math.floor(xs.length * 0.1)] : 72,
    contentRight: ends.length ? ends[Math.floor(ends.length * 0.9)] : 540,
  };

  // Assign relationship + media ids to every rendered figure.
  const media = {};
  let ridSeq = 2;    // rId1 is the styles relationship
  let figSeq = 1;
  const rels = ['<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'];
  imageRegions.forEach((r) => {
    const rid = 'rId' + (ridSeq++);
    const name = 'media/image' + figSeq + '.png';
    media['word/' + name] = r.png;
    rels.push(`<Relationship Id="${rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="${name}"/>`);
    r._rid = rid;
    r._id = figSeq;
    figSeq++;
  });

  let body = '';
  pages.forEach((page, pi) => {
    const lines = pageLines[pi];
    const wrapGap = typicalWrapGap(lines);
    const textBlocks = pageBlocks(lines, wrapGap);
    const imgBlocks = (page.regions || [])
      .filter((r) => r && r.png)
      .map((r) => ({ type: 'image', region: r, y: r.y1 }));

    // Merge text blocks (already top-to-bottom) with image blocks by vertical
    // position: emit any image sitting above the next text block first.
    let bi = 0;
    imgBlocks.sort((a, b) => b.y - a.y);
    const emit = (block) => {
      if (block.type === 'image') {
        body += imageParaXml(block.region, ctx, block.region._id, block.region._rid);
      } else if (block.type === 'table') {
        if (body.endsWith('</w:tbl>')) body += '<w:p><w:pPr><w:spacing w:after="0"/></w:pPr></w:p>';
        body += tableXml(block, ctx);
      } else if (block.type === 'tabline') {
        body += tablineXml(block.line, ctx);
      } else {
        body += paraXml(block.lines, ctx);
      }
    };
    for (const tb of textBlocks) {
      const tbY = tb.y != null ? tb.y : (tb.lines ? tb.lines[0].y : (tb.line ? tb.line.y : 0));
      while (bi < imgBlocks.length && imgBlocks[bi].y >= tbY) emit(imgBlocks[bi++]);
      emit(tb);
    }
    while (bi < imgBlocks.length) emit(imgBlocks[bi++]);

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

  const pngDefault = imageRegions.length
    ? '<Default Extension="png" ContentType="image/png"/>'
    : '';

  return {
    '[Content_Types].xml':
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/>' +
      pngDefault +
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
      rels.join('') +
      '</Relationships>',
    'word/document.xml': documentXml,
    'word/styles.xml': stylesXml,
    ...media,
  };
}

/** Plain-text view of the extracted pages, for the preview pane and the
 *  scanned-PDF (no text layer) check. Diagram labels are dropped so the
 *  preview matches the document. */
export function pagesPlainText(pages) {
  return pages
    .map((p) => linesOutsideRegions(p.lines, p.regions, p.width).map((l) => l.text).join('\n'))
    .join('\n\n')
    .trim();
}
