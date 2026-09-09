/**
 * DOCX → pdfmake document definition.
 *
 * Replaces the mammoth pipeline. Mammoth's job is to produce *semantic* HTML —
 * it maps a document's styles onto h1/p/strong and deliberately discards direct
 * formatting. That is the right output for a CMS and the wrong one for a
 * converter: measured against the fixture, the old path lost every paragraph
 * alignment (a centred line, a right-aligned line and a body line all landed at
 * the same x), every text colour, the table shading, both named fonts, the
 * running header, the footer, and the landscape section — while reporting a
 * 24pt navy heading as 20pt Roboto.
 *
 * So this reads the WordprocessingML directly and resolves what Word itself
 * resolves: docDefaults, then the paragraph's style (following basedOn), then
 * direct formatting on the paragraph, then direct formatting on the run.
 *
 * One limit is honest rather than fixable. A .docx names fonts it does not
 * contain, and Georgia and Calibri are licensed faces that cannot be shipped.
 * Fonts are therefore substituted by category — serif, monospace, sans — which
 * is what LibreOffice does with a missing font. The distinction between a serif
 * body and a monospace code line survives, which is what a reader notices; the
 * exact face does not.
 *
 * Pure data-in / data-out apart from the DOM parsing, so the mapping rules can
 * be tested directly.
 */

/* ------------------------------------------------------------- units */

/** Twentieths of a point → points. */
export const twipsToPt = (v) => (Number(v) || 0) / 20;
/** Half-points → points. */
export const halfPtToPt = (v) => (Number(v) || 0) / 2;
/** English Metric Units → points (914400 EMU = 1 inch = 72pt). */
export const emuToPt = (v) => (Number(v) || 0) / 12700;

/* ------------------------------------------------------------- fonts */

const SERIF = /(times|georgia|garamond|cambria|book antiqua|palatino|century|constantia|serif|roman|minion|baskerville)/i;
const MONO = /(courier|consolas|menlo|monaco|mono|lucida console|dejavu sans mono|source code)/i;

/**
 * Which font category a Word font name belongs to.
 * @param {string} name
 * @returns {'serif'|'mono'|'sans'}
 */
export function fontCategory(name) {
  const n = String(name || '');
  if (MONO.test(n)) return 'mono';
  if (SERIF.test(n)) return 'serif';
  return 'sans';
}

/** pdfmake font family registered for each category. */
export const CATEGORY_FONT = { sans: 'Roboto', serif: 'NotoSerif', mono: 'NotoMono' };

/* ----------------------------------------------------------- colours */

/**
 * Normalise a w:val colour to #rrggbb, or null when it means "inherit".
 * Word writes "auto" for an automatic colour, which is not a colour.
 */
export function normaliseColour(val) {
  const v = String(val || '').trim();
  if (!v || /^auto$/i.test(v)) return null;
  if (/^[0-9a-f]{6}$/i.test(v)) return '#' + v.toLowerCase();
  return null;
}

/** Word's named highlight colours, as pdfmake background values. */
const HIGHLIGHT = {
  yellow: '#ffff00', green: '#00ff00', cyan: '#00ffff', magenta: '#ff00ff',
  blue: '#0000ff', red: '#ff0000', darkBlue: '#000080', darkCyan: '#008080',
  darkGreen: '#008000', darkMagenta: '#800080', darkRed: '#800000',
  darkYellow: '#808000', darkGray: '#808080', lightGray: '#c0c0c0', black: '#000000',
};
export const highlightColour = (val) => HIGHLIGHT[String(val || '')] || null;

/* --------------------------------------------------------- DOM helpers */

/** Direct children with the given qualified name. */
function kids(node, name) {
  const out = [];
  for (const c of Array.from(node ? node.childNodes : [])) {
    if (c.nodeType === 1 && c.nodeName === name) out.push(c);
  }
  return out;
}
/** First direct child with the given name. */
function kid(node, name) { return kids(node, name)[0] || null; }
/** w:val of a direct child element. */
function valOf(node, name) {
  const el = kid(node, name);
  return el ? el.getAttribute('w:val') : null;
}
/** An on/off element: present means true unless explicitly "0" or "false". */
function toggle(node, name) {
  const el = kid(node, name);
  if (!el) return false;
  const v = el.getAttribute('w:val');
  return !(v === '0' || v === 'false' || v === 'off');
}

/* ---------------------------------------------------------- styles.xml */

/**
 * Index styles.xml so a style id resolves to its own rPr/pPr and its parent.
 * @returns {{styles: Map, docDefaults: {rPr: Element|null, pPr: Element|null}}}
 */
export function readStyles(stylesDoc) {
  const styles = new Map();
  let docDefaults = { rPr: null, pPr: null };
  if (!stylesDoc || !stylesDoc.documentElement) return { styles, docDefaults };

  const root = stylesDoc.documentElement;
  const dd = kid(root, 'w:docDefaults');
  if (dd) {
    const rd = kid(dd, 'w:rPrDefault');
    const pd = kid(dd, 'w:pPrDefault');
    docDefaults = {
      rPr: rd ? kid(rd, 'w:rPr') : null,
      pPr: pd ? kid(pd, 'w:pPr') : null,
    };
  }

  for (const s of kids(root, 'w:style')) {
    const id = s.getAttribute('w:styleId');
    if (!id) continue;
    styles.set(id, {
      id,
      type: s.getAttribute('w:type'),
      basedOn: valOf(s, 'w:basedOn'),
      rPr: kid(s, 'w:rPr'),
      pPr: kid(s, 'w:pPr'),
      name: valOf(s, 'w:name'),
    });
  }
  return { styles, docDefaults };
}

/** Walk a style's basedOn chain, outermost ancestor first. */
function styleChain(styleId, styles) {
  const chain = [];
  let id = styleId;
  const seen = new Set();
  while (id && styles.has(id) && !seen.has(id)) {
    seen.add(id);
    chain.unshift(styles.get(id));
    id = styles.get(id).basedOn;
  }
  return chain;
}

/* ------------------------------------------------- property resolution */

/** Accumulate run properties from an rPr element onto `acc`. */
function applyRunProps(acc, rPr) {
  if (!rPr) return acc;

  const fonts = kid(rPr, 'w:rFonts');
  if (fonts) {
    const name = fonts.getAttribute('w:ascii') || fonts.getAttribute('w:hAnsi');
    if (name) acc.fontName = name;
  }
  const sz = valOf(rPr, 'w:sz');
  if (sz) acc.fontSize = halfPtToPt(sz);

  if (kid(rPr, 'w:b')) acc.bold = toggle(rPr, 'w:b');
  if (kid(rPr, 'w:i')) acc.italics = toggle(rPr, 'w:i');
  if (kid(rPr, 'w:strike')) acc.strike = toggle(rPr, 'w:strike');

  const u = kid(rPr, 'w:u');
  if (u) {
    const v = u.getAttribute('w:val');
    acc.underline = !!v && v !== 'none';
  }

  const colour = kid(rPr, 'w:color');
  if (colour) {
    const c = normaliseColour(colour.getAttribute('w:val'));
    if (c) acc.color = c;
  }

  const hl = valOf(rPr, 'w:highlight');
  if (hl) acc.background = highlightColour(hl);

  const va = valOf(rPr, 'w:vertAlign');
  if (va === 'superscript') acc.sup = true;
  else if (va === 'subscript') acc.sub = true;

  return acc;
}

/** Accumulate paragraph properties from a pPr element onto `acc`. */
function applyParaProps(acc, pPr) {
  if (!pPr) return acc;

  const jc = valOf(pPr, 'w:jc');
  if (jc) {
    acc.alignment = ({ center: 'center', right: 'right', end: 'right', both: 'justify', left: 'left', start: 'left' })[jc] || 'left';
  }

  const ind = kid(pPr, 'w:ind');
  if (ind) {
    const left = ind.getAttribute('w:left') || ind.getAttribute('w:start');
    const first = ind.getAttribute('w:firstLine');
    const hang = ind.getAttribute('w:hanging');
    if (left != null) acc.indentLeft = twipsToPt(left);
    if (hang != null) acc.hanging = twipsToPt(hang);
    else if (first != null) acc.firstLine = twipsToPt(first);
  }

  const spacing = kid(pPr, 'w:spacing');
  if (spacing) {
    const before = spacing.getAttribute('w:before');
    const after = spacing.getAttribute('w:after');
    const line = spacing.getAttribute('w:line');
    const rule = spacing.getAttribute('w:lineRule');
    if (before != null) acc.spaceBefore = twipsToPt(before);
    if (after != null) acc.spaceAfter = twipsToPt(after);
    // "auto" expresses the line height as 240ths of a single line.
    if (line != null && (!rule || rule === 'auto')) acc.lineHeight = Number(line) / 240;
  }

  const shd = kid(pPr, 'w:shd');
  if (shd) {
    const fill = normaliseColour(shd.getAttribute('w:fill'));
    if (fill) acc.shading = fill;
  }

  return acc;
}

/**
 * The effective properties for a paragraph, resolved the way Word resolves
 * them: document defaults, then the style chain, then direct formatting.
 */
export function resolveParagraph(p, styles, docDefaults) {
  const pPr = kid(p, 'w:pPr');
  const styleId = pPr ? valOf(pPr, 'w:pStyle') : null;

  const para = {};
  const run = {};

  applyParaProps(para, docDefaults.pPr);
  applyRunProps(run, docDefaults.rPr);

  for (const s of styleChain(styleId, styles)) {
    applyParaProps(para, s.pPr);
    applyRunProps(run, s.rPr);
  }

  applyParaProps(para, pPr);
  if (pPr) applyRunProps(run, kid(pPr, 'w:rPr'));

  para.styleId = styleId || null;
  para.numPr = pPr ? kid(pPr, 'w:numPr') : null;
  return { para, runDefaults: run };
}

/** The effective properties for one run, on top of its paragraph's defaults. */
export function resolveRun(r, runDefaults, styles) {
  const acc = Object.assign({}, runDefaults);
  const rPr = kid(r, 'w:rPr');
  const styleId = rPr ? valOf(rPr, 'w:rStyle') : null;
  for (const s of styleChain(styleId, styles)) applyRunProps(acc, s.rPr);
  applyRunProps(acc, rPr);
  return acc;
}

/* ------------------------------------------------------- section setup */

/**
 * Page geometry from a w:sectPr.
 * @returns {{pageSize:{width:number,height:number}, orientation:string,
 *            margins:number[], headerId:string|null, footerId:string|null}}
 */
export function readSection(sectPr) {
  const out = {
    pageSize: { width: 595.28, height: 841.89 },
    orientation: 'portrait',
    margins: [56, 56, 56, 56],
    headerHeight: 36,
    footerHeight: 36,
    headerId: null,
    footerId: null,
  };
  if (!sectPr) return out;

  const sz = kid(sectPr, 'w:pgSz');
  if (sz) {
    const w = twipsToPt(sz.getAttribute('w:w'));
    const h = twipsToPt(sz.getAttribute('w:h'));
    if (w && h) {
      out.pageSize = { width: w, height: h };
      out.orientation = (sz.getAttribute('w:orient') === 'landscape' || w > h) ? 'landscape' : 'portrait';
    }
  }

  const mar = kid(sectPr, 'w:pgMar');
  if (mar) {
    out.margins = [
      twipsToPt(mar.getAttribute('w:left')),
      twipsToPt(mar.getAttribute('w:top')),
      twipsToPt(mar.getAttribute('w:right')),
      twipsToPt(mar.getAttribute('w:bottom')),
    ];
    out.headerHeight = twipsToPt(mar.getAttribute('w:header')) || 36;
    out.footerHeight = twipsToPt(mar.getAttribute('w:footer')) || 36;
  }

  const hdr = kids(sectPr, 'w:headerReference').find((e) => (e.getAttribute('w:type') || 'default') === 'default');
  const ftr = kids(sectPr, 'w:footerReference').find((e) => (e.getAttribute('w:type') || 'default') === 'default');
  if (hdr) out.headerId = hdr.getAttribute('r:id');
  if (ftr) out.footerId = ftr.getAttribute('r:id');

  return out;
}

/**
 * Every section in the body, in order.
 *
 * A w:sectPr inside a paragraph's w:pPr ends a section at that paragraph; the
 * one that is a direct child of w:body describes the final section. Reading
 * only the first is how the landscape tail of a document used to vanish.
 */
export function readSections(body) {
  const sections = [];
  const blocks = Array.from(body.childNodes).filter((n) => n.nodeType === 1);

  blocks.forEach((node, index) => {
    if (node.nodeName !== 'w:p') return;
    const pPr = kid(node, 'w:pPr');
    const sect = pPr ? kid(pPr, 'w:sectPr') : null;
    if (sect) sections.push({ endsAfterIndex: index, setup: readSection(sect) });
  });

  const final = kid(body, 'w:sectPr');
  sections.push({ endsAfterIndex: blocks.length - 1, setup: readSection(final) });
  return sections;
}

/* -------------------------------------------------------- numbering.xml */

/**
 * numId + level → the bullet or number format, resolved through abstractNum.
 */
export function readNumbering(numDoc) {
  const map = new Map();
  if (!numDoc || !numDoc.documentElement) return map;
  const root = numDoc.documentElement;

  const abstract = new Map();
  for (const a of kids(root, 'w:abstractNum')) {
    const id = a.getAttribute('w:abstractNumId');
    const levels = new Map();
    for (const lvl of kids(a, 'w:lvl')) {
      levels.set(lvl.getAttribute('w:ilvl') || '0', {
        numFmt: valOf(lvl, 'w:numFmt') || 'decimal',
        lvlText: valOf(lvl, 'w:lvlText') || '',
        start: Number(valOf(lvl, 'w:start') || 1),
      });
    }
    abstract.set(id, levels);
  }

  for (const n of kids(root, 'w:num')) {
    const numId = n.getAttribute('w:numId');
    const absId = valOf(n, 'w:abstractNumId');
    if (numId && abstract.has(absId)) map.set(numId, abstract.get(absId));
  }
  return map;
}

/** Is this list level a bullet rather than a number? */
export function isBulletLevel(numbering, numId, ilvl) {
  const levels = numbering.get(String(numId));
  const lvl = levels && levels.get(String(ilvl || '0'));
  return !!lvl && lvl.numFmt === 'bullet';
}

/* ------------------------------------------------------ pdfmake mapping */

/** The pdfmake font family for a run, given which substitutes actually loaded. */
export function fontFor(runProps, fontsReady) {
  const category = fontCategory(runProps.fontName);
  const family = CATEGORY_FONT[category];
  // Fall back to the always-present default rather than naming a font pdfmake
  // has no data for, which would throw during layout.
  return (family === 'Roboto' || (fontsReady && fontsReady.has(family))) ? family : 'Roboto';
}

/** One run's resolved properties as a pdfmake text node. */
export function runToNode(text, props, fontsReady) {
  const node = { text };
  if (props.bold) node.bold = true;
  if (props.italics) node.italics = true;
  if (props.color) node.color = props.color;
  if (props.background) node.background = props.background;
  if (props.fontSize) node.fontSize = props.fontSize;

  const decorations = [];
  if (props.underline) decorations.push('underline');
  if (props.strike) decorations.push('lineThrough');
  if (decorations.length) node.decoration = decorations.length === 1 ? decorations[0] : decorations;

  const font = fontFor(props, fontsReady);
  if (font !== 'Roboto') node.font = font;

  /* pdfmake has no superscript, so approximate with a smaller size — the
     alternative is losing the distinction entirely. */
  if (props.sup || props.sub) node.fontSize = Math.max(6, (props.fontSize || 11) * 0.7);

  return node;
}

/** Margin array for a paragraph, from its resolved indents and spacing. */
export function paragraphMargin(para) {
  const left = (para.indentLeft || 0) - (para.hanging || 0);
  return [
    Math.max(0, left),
    para.spaceBefore || 0,
    0,
    para.spaceAfter == null ? 4 : para.spaceAfter,
  ];
}

/* ------------------------------------------------------ body traversal */

/** A run of literal text, including tabs and breaks, from a w:r element. */
function runText(r) {
  let out = '';
  for (const c of Array.from(r.childNodes)) {
    if (c.nodeType !== 1) continue;
    if (c.nodeName === 'w:t') out += c.textContent;
    else if (c.nodeName === 'w:tab') out += '\t';
    else if (c.nodeName === 'w:br' && c.getAttribute('w:type') !== 'page') out += '\n';
    else if (c.nodeName === 'w:noBreakHyphen') out += '-';
  }
  return out;
}

/** Does this run carry an explicit page break? */
function hasPageBreak(r) {
  return kids(r, 'w:br').some((b) => b.getAttribute('w:type') === 'page');
}

/** The r:embed of a picture inside a w:drawing, with its display size. */
function drawingImage(node) {
  const blips = node.getElementsByTagName('a:blip');
  if (!blips.length) return null;
  const rid = blips[0].getAttribute('r:embed');
  if (!rid) return null;

  const extents = node.getElementsByTagName('wp:extent');
  const cx = extents.length ? extents[0].getAttribute('cx') : null;
  const cy = extents.length ? extents[0].getAttribute('cy') : null;
  return { rid, width: cx ? emuToPt(cx) : null, height: cy ? emuToPt(cy) : null };
}

/**
 * Turn a paragraph's children into pdfmake inline nodes.
 * Returns { inlines, pageBreakBefore, image }.
 */
function paragraphInlines(p, ctx, runDefaults) {
  const inlines = [];
  let pageBreakBefore = false;
  let image = null;
  // A PAGE field writes a cached result run after w:separate; skip it so the
  // number is not duplicated next to the live one.
  let skipUntilFieldEnd = false;

  const pushRun = (r, linkUrl) => {
    if (kid(r, 'w:fldChar')) {
      const type = kid(r, 'w:fldChar').getAttribute('w:fldCharType');
      if (type === 'separate') skipUntilFieldEnd = true;
      if (type === 'end') skipUntilFieldEnd = false;
      return;
    }
    const instr = kid(r, 'w:instrText');
    if (instr) {
      if (/\bPAGE\b/.test(instr.textContent)) inlines.push({ __field: 'PAGE' });
      else if (/\bNUMPAGES\b/.test(instr.textContent)) inlines.push({ __field: 'NUMPAGES' });
      return;
    }
    if (skipUntilFieldEnd) return;

    if (hasPageBreak(r) && !inlines.length) pageBreakBefore = true;

    const drawing = kid(r, 'w:drawing');
    if (drawing) {
      const img = drawingImage(drawing);
      if (img && ctx.images.has(img.rid)) {
        image = { dataUri: ctx.images.get(img.rid), width: img.width, height: img.height };
      }
      return;
    }

    const text = runText(r);
    if (!text) return;
    const props = resolveRun(r, runDefaults, ctx.styles);
    const node = runToNode(text, props, ctx.fontsReady);
    if (linkUrl) { node.link = linkUrl; node.color = node.color || '#0b5cad'; }
    inlines.push(node);
  };

  for (const child of Array.from(p.childNodes)) {
    if (child.nodeType !== 1) continue;
    if (child.nodeName === 'w:r') pushRun(child, null);
    else if (child.nodeName === 'w:hyperlink') {
      const url = ctx.links.get(child.getAttribute('r:id')) || null;
      for (const r of kids(child, 'w:r')) pushRun(r, url);
    }
  }

  return { inlines, pageBreakBefore, image };
}

/** One w:p as a pdfmake node (or null when it is empty and carries nothing). */
function paragraphToNode(p, ctx) {
  const { para, runDefaults } = resolveParagraph(p, ctx.styles, ctx.docDefaults);
  const { inlines, pageBreakBefore, image } = paragraphInlines(p, ctx, runDefaults);

  if (image) {
    const node = { image: image.dataUri, margin: paragraphMargin(para) };
    if (image.width) node.width = image.width;
    if (image.height) node.height = image.height;
    if (para.alignment) node.alignment = para.alignment;
    return node;
  }

  const node = {
    text: inlines.length ? inlines : ' ',
    margin: paragraphMargin(para),
  };
  if (para.alignment) node.alignment = para.alignment;
  if (para.lineHeight) node.lineHeight = para.lineHeight;
  if (pageBreakBefore) node.pageBreak = 'before';

  /* A numbered or bulleted paragraph keeps its marker. pdfmake wants a list
     node, but emitting one per paragraph would restart the numbering, so the
     marker is rendered inline and the indent preserved instead. */
  if (para.numPr) {
    const numId = valOf(para.numPr, 'w:numId');
    const ilvl = valOf(para.numPr, 'w:ilvl') || '0';
    const bullet = isBulletLevel(ctx.numbering, numId, ilvl);
    const key = numId + ':' + ilvl;
    if (bullet) {
      node.text = [{ text: '•   ' }].concat(inlines);
    } else {
      ctx.counters[key] = (ctx.counters[key] || 0) + 1;
      node.text = [{ text: ctx.counters[key] + '.   ' }].concat(inlines);
    }
  }

  return node;
}

/* ---------------------------------------------------------------- tables */

/** Cell shading, from w:tcPr/w:shd. */
function cellFill(tc) {
  const tcPr = kid(tc, 'w:tcPr');
  const shd = tcPr ? kid(tcPr, 'w:shd') : null;
  return shd ? normaliseColour(shd.getAttribute('w:fill')) : null;
}

/** One w:tbl as a pdfmake table node. */
function tableToNode(tbl, ctx) {
  const grid = kid(tbl, 'w:tblGrid');
  const widths = grid
    ? kids(grid, 'w:gridCol').map((g) => twipsToPt(g.getAttribute('w:w')))
    : null;

  const body = [];
  const fills = [];

  for (const tr of kids(tbl, 'w:tr')) {
    const row = [];
    const rowFills = [];
    for (const tc of kids(tr, 'w:tc')) {
      const tcPr = kid(tc, 'w:tcPr');
      const span = tcPr ? Number(valOf(tcPr, 'w:gridSpan') || 1) : 1;

      const content = [];
      for (const child of Array.from(tc.childNodes)) {
        if (child.nodeType !== 1) continue;
        if (child.nodeName === 'w:p') {
          const n = paragraphToNode(child, ctx);
          if (n) content.push(n);
        } else if (child.nodeName === 'w:tbl') {
          content.push(tableToNode(child, ctx));
        }
      }

      const cell = content.length === 1 ? content[0] : { stack: content };
      if (span > 1) cell.colSpan = span;
      row.push(cell);
      rowFills.push(cellFill(tc));

      // pdfmake needs an empty placeholder for each column a colSpan covers.
      for (let i = 1; i < span; i++) { row.push({}); rowFills.push(null); }
    }
    body.push(row);
    fills.push(rowFills);
  }

  if (!body.length) return null;

  // Every row must have the same number of columns or pdfmake throws.
  const columns = Math.max(...body.map((r) => r.length));
  for (const row of body) while (row.length < columns) row.push({});

  const node = {
    table: { body, headerRows: 0 },
    layout: {
      fillColor: (rowIndex, _node, columnIndex) =>
        (fills[rowIndex] && fills[rowIndex][columnIndex]) || null,
      hLineWidth: () => 0.7,
      vLineWidth: () => 0.7,
      hLineColor: () => '#999999',
      vLineColor: () => '#999999',
    },
    margin: [0, 4, 0, 8],
  };
  if (widths && widths.length === columns) node.table.widths = widths;
  return node;
}

/* --------------------------------------------------- header and footer */

/**
 * Compile a header/footer part into a function pdfmake can call per page.
 * Field placeholders left by paragraphInlines become the live page number.
 */
function compileRunningPart(doc, ctx, section, isHeader) {
  if (!doc || !doc.documentElement) return null;

  const nodes = [];
  for (const child of Array.from(doc.documentElement.childNodes)) {
    if (child.nodeType !== 1) continue;
    if (child.nodeName === 'w:p') {
      const n = paragraphToNode(child, ctx);
      if (n) nodes.push(n);
    } else if (child.nodeName === 'w:tbl') {
      const t = tableToNode(child, ctx);
      if (t) nodes.push(t);
    }
  }
  if (!nodes.length) return null;

  const substitute = (node, currentPage, pageCount) => {
    if (Array.isArray(node)) return node.map((n) => substitute(n, currentPage, pageCount));
    if (node && typeof node === 'object') {
      if (node.__field === 'PAGE') return { text: String(currentPage) };
      if (node.__field === 'NUMPAGES') return { text: String(pageCount) };
      const copy = Object.assign({}, node);
      if (copy.text) copy.text = substitute(copy.text, currentPage, pageCount);
      if (copy.stack) copy.stack = substitute(copy.stack, currentPage, pageCount);
      return copy;
    }
    return node;
  };

  const sideMargin = section.margins[0];
  return (currentPage, pageCount) => ({
    margin: isHeader
      ? [sideMargin, section.headerHeight, section.margins[2], 0]
      : [sideMargin, 0, section.margins[2], section.footerHeight],
    stack: substitute(nodes, currentPage, pageCount),
  });
}

/* ----------------------------------------------------------- assembly */

/**
 * Build a complete pdfmake document definition from the parts of a .docx.
 *
 * @param {object} parts
 * @param {Document} parts.document   word/document.xml
 * @param {Document} [parts.styles]   word/styles.xml
 * @param {Document} [parts.numbering] word/numbering.xml
 * @param {Map<string,Document>} [parts.running] rId -> header/footer document
 * @param {Map<string,string>} [parts.images]    rId -> data URI
 * @param {Map<string,string>} [parts.links]     rId -> external URL
 * @param {Set<string>} [parts.fontsReady]       pdfmake families actually loaded
 * @returns {object} a pdfmake docDefinition
 */
export function buildDocDefinition(parts) {
  const { styles, docDefaults } = readStyles(parts.styles);
  const ctx = {
    styles,
    docDefaults,
    numbering: readNumbering(parts.numbering),
    images: parts.images || new Map(),
    links: parts.links || new Map(),
    fontsReady: parts.fontsReady || new Set(),
    counters: {},
  };

  const body = kid(parts.document.documentElement, 'w:body');
  const blocks = Array.from(body.childNodes).filter((n) => n.nodeType === 1 && n.nodeName !== 'w:sectPr');
  const sections = readSections(body);
  const first = sections[0].setup;

  /* pdfmake takes one page size and flips it per orientation, so the size is
     always given portrait-side-up and the orientation carries the rotation. */
  const w = first.pageSize.width;
  const h = first.pageSize.height;
  const pageSize = { width: Math.min(w, h), height: Math.max(w, h) };

  const content = [];
  let sectionIndex = 0;

  blocks.forEach((node, index) => {
    if (node.nodeName === 'w:p') {
      const n = paragraphToNode(node, ctx);
      if (n) content.push(n);
    } else if (node.nodeName === 'w:tbl') {
      const t = tableToNode(node, ctx);
      if (t) content.push(t);
    }

    /* Crossing a section boundary starts a new page, and the orientation
       travels with that break — which is how a portrait document with a
       landscape final section keeps both. */
    if (sectionIndex < sections.length - 1 && index >= sections[sectionIndex].endsAfterIndex) {
      sectionIndex++;
      const next = sections[sectionIndex].setup;
      content.push({
        text: '',
        pageBreak: 'before',
        pageOrientation: next.orientation,
        margin: [0, 0, 0, 0],
      });
    }
  });

  const def = {
    content,
    pageSize,
    pageOrientation: first.orientation,
    // pdfmake wants [left, top, right, bottom].
    pageMargins: [
      first.margins[0],
      first.margins[1] + (first.headerId ? first.headerHeight : 0),
      first.margins[2],
      first.margins[3] + (first.footerId ? first.footerHeight : 0),
    ],
    defaultStyle: { fontSize: 11, lineHeight: 1.2, color: '#1a1a1a' },
    info: { title: parts.title || 'Converted document' },
  };

  const running = parts.running || new Map();
  if (first.headerId && running.has(first.headerId)) {
    const fn = compileRunningPart(running.get(first.headerId), ctx, first, true);
    if (fn) def.header = fn;
  }
  if (first.footerId && running.has(first.footerId)) {
    const fn = compileRunningPart(running.get(first.footerId), ctx, first, false);
    if (fn) def.footer = fn;
  }

  return def;
}

/** Which substitute font families a document will actually need. */
export function fontsNeeded(documentDoc, stylesDoc) {
  const needed = new Set();
  const scan = (doc) => {
    if (!doc || !doc.documentElement) return;
    for (const f of Array.from(doc.getElementsByTagName('w:rFonts'))) {
      const name = f.getAttribute('w:ascii') || f.getAttribute('w:hAnsi');
      if (!name) continue;
      const family = CATEGORY_FONT[fontCategory(name)];
      if (family && family !== 'Roboto') needed.add(family);
    }
  };
  scan(documentDoc);
  scan(stylesDoc);
  return [...needed];
}
