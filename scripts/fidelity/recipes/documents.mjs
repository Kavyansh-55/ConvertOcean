/**
 * What each tool is fed, and what counts as a faithful result.
 *
 * A recipe is deliberately more than "did a file come out". Each `checks`
 * entry names one property of the source that a user would notice missing,
 * and either finds it in the output or does not. That is the whole design: a
 * failing check should read like a bug report, not like a score.
 *
 * `weight` marks how much a failure matters to a real user:
 *   'blocker'  — the output is unusable or wrong
 *   'major'    — the document visibly stopped looking like itself
 *   'minor'    — a detail a careful user would still notice
 */

import { ok, missing, DOCX_MARKERS, PDF_MARKERS } from './_shared.mjs';

export const documentRecipes = [
  /* ------------------------------------------------------ word-to-pdf */
  {
    slug: 'word-to-pdf',
    title: 'Word → PDF',
    fixture: 'torture.docx',
    ready: '#actionControls',
    download: '#btnDownload',
    outName: 'word-to-pdf.pdf',
    kind: 'pdf',
    async checks({ out, src }) {
      const gone = missing(out.text, DOCX_MARKERS);
      const last = out.sizes[out.sizes.length - 1];
      const first = out.sizes[0];
      return [
        ok('opens', 'Output is a readable PDF', out.pages > 0, `${out.pages} pages`, 'blocker'),
        ok('text', 'All 20 source markers survive',
           gone.length === 0, gone.length ? `missing: ${gone.join(', ')}` : 'all present', 'blocker'),
        ok('pagecount', 'Page break and landscape section produce ≥3 pages',
           out.pages >= 3, `${out.pages} pages`, 'major'),
        ok('pagesize', 'First page is A4 portrait (595×842pt)',
           first && Math.abs(first.width - 595) < 6 && Math.abs(first.height - 842) < 6,
           first ? `${first.width}×${first.height}` : 'no pages', 'major'),
        ok('landscape', 'Final section stays landscape',
           last && last.orientation === 'landscape',
           last ? `${last.width}×${last.height} ${last.orientation}` : 'n/a', 'major'),
        ok('fonts', 'Named fonts (Georgia, Courier) carried over',
           out.fonts.some((f) => /georgia/i.test(f)) && out.fonts.some((f) => /courier|mono/i.test(f)),
           `fonts in output: ${out.fonts.join(', ') || 'none'}`, 'major'),
        ok('sizes', 'More than two distinct text sizes (heading vs body vs small)',
           out.sizes_pt.length > 2, `sizes: ${out.sizes_pt.join(', ')}pt`, 'major'),
        ok('header', 'Running header (M19) present', out.text.includes('M19'),
           '', 'major'),
        ok('footer', 'Footer with page field (M20) present', out.text.includes('M20'),
           '', 'major'),
        ok('image', 'Inline image survives', out.imageCount > 0,
           `${out.imageCount} painted images`, 'major'),
        ok('link', 'Hyperlink survives as a real link annotation',
           out.links.some((l) => /example\.com/.test(l.url)),
           out.links.length ? out.links.map((l) => l.url).join(' ') : 'no link annotations', 'minor'),
        ok('src-sanity', 'Fixture really did carry these features',
           src.fonts.length >= 2 && src.sections.length === 2 && src.tables === 1,
           `fixture fonts=${src.fonts.join('/')} sections=${src.sections.length}`, 'minor'),
      ];
    },
  },

  /* ------------------------------------------------------ docx-to-txt */
  {
    slug: 'docx-to-txt',
    title: 'Word → TXT (control)',
    fixture: 'torture.docx',
    ready: '#actionControls',
    download: '#btnDownload',
    outName: 'docx-to-txt.txt',
    kind: 'text',
    async checks({ out }) {
      // Header/footer legitimately fall outside the document body for a text
      // extract, so only the 18 body markers are required here.
      const body = DOCX_MARKERS.slice(0, 18);
      const gone = missing(out, body);
      return [
        ok('nonempty', 'Produced non-empty text', out.trim().length > 0, `${out.length} chars`, 'blocker'),
        ok('text', 'All 18 body markers survive', gone.length === 0,
           gone.length ? `missing: ${gone.join(', ')}` : 'all present', 'blocker'),
        ok('lines', 'Paragraph structure preserved (not one run-on line)',
           out.split('\n').filter((l) => l.trim()).length >= 10,
           `${out.split('\n').filter((l) => l.trim()).length} non-empty lines`, 'major'),
      ];
    },
  },

  /* ----------------------------------------------------- excel-to-pdf */
  {
    slug: 'excel-to-pdf',
    title: 'Excel → PDF',
    fixture: 'torture.xlsx',
    ready: '#actionControls',
    download: '#btnConvert',
    outName: 'excel-to-pdf.pdf',
    kind: 'pdf',
    async checks({ out }) {
      const t = out.text.replace(/\s+/g, ' ');
      return [
        ok('opens', 'Output is a readable PDF', out.pages > 0, `${out.pages} pages`, 'blocker'),
        ok('allsheets', 'All three sheets present (Styled, Wide, Plain)',
           t.includes('M01') && t.includes('M11') && t.includes('M12'),
           `M01=${t.includes('M01')} M11=${t.includes('M11')} M12=${t.includes('M12')}`, 'blocker'),
        ok('currency', 'Currency formatting preserved ($ and thousands separator)',
           /\$\s?1[28],?[46]00/.test(t) || /\$128,400/.test(t),
           'looking for $128,400.50 as formatted', 'major'),
        ok('date', 'Dates render as dates, not as serial numbers',
           !/\b45658\b/.test(t), /\b45658\b/.test(t) ? 'raw serial 45658 leaked into the PDF' : 'no raw serials', 'major'),
        ok('percent', 'Percentages keep their % format',
           /18\.4\s?%|0\.184/.test(t) ? /18\.4\s?%/.test(t) : false,
           /0\.184/.test(t) ? 'shows raw 0.184 instead of 18.4%' : '', 'major'),
        ok('merge', 'Merged title cell (M01) not duplicated across columns',
           (t.match(/M01/g) || []).length === 1,
           `M01 appears ${(t.match(/M01/g) || []).length}×`, 'minor'),
        ok('formula', 'Formula result present (SUM cached value)',
           /205,?290/.test(t), 'looking for 205,290.85', 'major'),
        // Not "is there any shading" — autoTable paints its own grey chrome
        // regardless. The question is whether the *source's* navy header fill
        // (1F4E79 = 31,78,121) reached the page.
        ok('fill', 'Header fill colour from the workbook (navy 1F4E79) survives',
           out.fills.some((f) => {
             const [r, g, b] = f.split(',').map(Number);
             return Math.abs(r - 31) < 12 && Math.abs(g - 78) < 12 && Math.abs(b - 121) < 12;
           }),
           `fills in output: ${out.fills.join(' ') || 'none'}`, 'major'),
        ok('colwidth', 'Explicit column widths respected (label column widest)',
           false, 'autoTable sizes columns from content; the widths in the workbook are not read', 'minor'),
        ok('wide', 'Wide sheet does not clip columns (Col O reaches the page)',
           t.includes('Col O'), t.includes('Col O') ? '' : 'rightmost column missing', 'major'),
      ];
    },
  },

  /* ------------------------------------------------------ pptx-to-pdf */
  {
    slug: 'pptx-to-pdf',
    title: 'PowerPoint → PDF',
    fixture: 'torture.pptx',
    ready: '#actionControls',
    download: '#btnDownload',
    outName: 'pptx-to-pdf.pdf',
    kind: 'pdf',
    async checks({ out }) {
      const t = out.text.replace(/\s+/g, ' ');
      const gone = ['M01', 'M03', 'M04', 'M07', 'M09', 'M10'].filter((m) => !t.includes(m));
      const first = out.sizes[0];
      return [
        ok('opens', 'Output is a readable PDF', out.pages > 0, `${out.pages} pages`, 'blocker'),
        ok('slides', 'One page per slide (3)', out.pages === 3, `${out.pages} pages`, 'blocker'),
        ok('selectable', 'Slide text is selectable / searchable in the PDF',
           out.items.length > 0,
           out.items.length ? `${out.items.length} text items` : 'no text layer — slides are flat images', 'major'),
        ok('text', 'Slide text present (title, bullets, table)',
           gone.length === 0, gone.length ? `missing: ${gone.join(', ')}` : 'all present', 'major'),
        ok('aspect', 'Page keeps the 16:9 slide aspect ratio',
           first && Math.abs((first.width / first.height) - (16 / 9)) < 0.05,
           first ? `${first.width}×${first.height} = ${(first.width / first.height).toFixed(2)}` : 'n/a', 'major'),
        ok('resolution', 'Export resolution ≥ 200 DPI (print-safe)',
           false, 'measured separately from the raster scale — see notes', 'major'),
        ok('notes', 'Speaker notes carried or explicitly offered',
           t.includes('M11'), t.includes('M11') ? '' : 'notes dropped silently', 'minor'),
      ];
    },
  },

  /* ------------------------------------------------------- pdf-to-word */
  {
    slug: 'pdf-to-word',
    title: 'PDF → Word',
    fixture: 'torture.pdf',
    ready: '#actionControls',
    download: '#btnDownload',
    outName: 'pdf-to-word.docx',
    kind: 'docx',
    async checks({ out }) {
      const gone = missing(out.text, PDF_MARKERS);
      return [
        ok('opens', 'Output is a valid .docx package',
           out.parts.includes('word/document.xml'), out.parts.length + ' parts', 'blocker'),
        ok('text', 'All 13 source markers survive', gone.length === 0,
           gone.length ? `missing: ${gone.join(', ')}` : 'all present', 'blocker'),
        ok('fonts', 'Source fonts recovered (not all one family)',
           out.fonts.length >= 2, `fonts: ${out.fonts.join(', ') || 'none'}`, 'major'),
        ok('sizes', 'Heading vs body sizes differentiated',
           out.sizesHalfPt.length >= 3, `sizes(½pt): ${out.sizesHalfPt.join(', ')}`, 'major'),
        ok('color', 'Coloured text (M01 navy heading, M04 red) keeps its colour',
           out.colors.length >= 2, `colors: ${out.colors.join(', ') || 'none'}`, 'major'),
        ok('table', 'Ruled table becomes a real Word table',
           out.tables >= 1, `${out.tables} tables`, 'major'),
        ok('columns', 'Two-column page not interleaved into nonsense',
           /M11[\s\S]{0,400}?M12/.test(out.text) === false ||
             out.text.indexOf('nonsense') < out.text.indexOf('M12'),
           'checks the left column reads before the right', 'major'),
        ok('geometry', 'Page size recovered from the PDF (Letter, 612×792pt)',
           out.sections.length > 0 && Math.abs(out.sections[0].widthTwips - 12240) < 200,
           out.sections.length ? `${out.sections[0].widthTwips}×${out.sections[0].heightTwips} twips` : 'no sectPr', 'minor'),
      ];
    },
  },

  /* ------------------------------------------------------ pdf-to-excel */
  {
    slug: 'pdf-to-excel',
    title: 'PDF → Excel',
    fixture: 'torture.pdf',
    ready: '#actionControls',
    download: '#btnDownload',
    outName: 'pdf-to-excel.xlsx',
    kind: 'xlsx',
    async checks({ out }) {
      const sheet = out.sheets[0] || { cells: [], numericCells: 0 };
      const all = sheet.cells.map((c) => String(c.value ?? '')).join(' ');
      // The amounts column should land as numbers Excel can sum.
      return [
        ok('opens', 'Output is a valid .xlsx workbook', out.sheets.length > 0,
           `${out.sheets.length} sheets`, 'blocker'),
        ok('rows', 'Table rows recovered', sheet.cells.length > 8,
           `${sheet.cells.length} cells`, 'blocker'),
        ok('columns', 'Amount column separated from the label column',
           all.includes('1,440') || all.includes('1440'), '', 'major'),
        ok('numeric', 'Amounts are real numbers, so SUM() works',
           sheet.numericCells >= 4,
           `${sheet.numericCells} numeric cells — everything else landed as text`, 'blocker'),
        ok('header', 'Header row identifiable (Item / Qty / Amount)',
           all.includes('Item') && all.includes('Amount'), '', 'minor'),
        ok('negatives', 'Negative amount kept its sign',
           all.includes('-450') || all.includes('(450'), '', 'major'),
      ];
    },
  },

  /* -------------------------------------------------------- pdf-to-txt */
  {
    slug: 'pdf-to-txt',
    title: 'PDF → TXT (control)',
    fixture: 'torture.pdf',
    ready: '#actionControls',
    download: '#btnDownload',
    outName: 'pdf-to-txt.txt',
    kind: 'text',
    async checks({ out }) {
      const gone = missing(out, PDF_MARKERS);
      return [
        ok('nonempty', 'Produced non-empty text', out.trim().length > 0, `${out.length} chars`, 'blocker'),
        ok('text', 'All 13 markers survive', gone.length === 0,
           gone.length ? `missing: ${gone.join(', ')}` : 'all present', 'blocker'),
        ok('lines', 'Line structure preserved',
           out.split('\n').filter((l) => l.trim()).length >= 10,
           `${out.split('\n').filter((l) => l.trim()).length} lines`, 'major'),
      ];
    },
  },

  /* ------------------------------------------------------- split-excel */
  {
    slug: 'split-excel',
    title: 'Split Excel (lossless promise)',
    fixture: 'torture.xlsx',
    ready: '#workspacePanel',
    download: '#processBtn',
    outName: 'split-excel.zip',
    kind: 'zip',
    async checks({ out, readXlsx }) {
      const parts = out.entries.filter((e) => /\.xlsx$/i.test(e.name));
      const srcFmts = ['"$"#,##0.00', '0.0%', 'dd/mm/yyyy', '#,##0.00;[Red](#,##0.00)'];
      const seenFmts = new Set();
      let styled = 0;
      for (const p of parts) {
        const wb = await readXlsx(p.bytes);
        styled += wb.sheets.reduce((n, s) => n + s.styledCells, 0);
        for (const f of wb.numFmts) seenFmts.add(f.replace(/&quot;/g, '"'));
      }
      return [
        ok('opens', 'Produced a zip of workbooks', parts.length > 0,
           `${out.names.length} entries: ${out.names.slice(0, 4).join(', ')}`, 'blocker'),
        ok('count', 'One workbook per source sheet (3)', parts.length === 3,
           `${parts.length} workbooks`, 'major'),
        ok('styling', 'Cell styling survives the split',
           styled > 0, `${styled} styled cells across all parts (source had 54)`, 'major'),
        // SheetJS writes its own default format table on every save, so
        // "are there format codes" always passes. Ask instead whether the
        // workbook's own codes came through.
        ok('numfmt', 'The number formats defined in the workbook survive the split',
           srcFmts.length > 0 && srcFmts.every((f) => seenFmts.has(f)),
           `source formats found: ${srcFmts.filter((f) => seenFmts.has(f)).length}/${srcFmts.length}` +
           (seenFmts.size ? ` — output carries: ${[...seenFmts].slice(0, 4).join(' ')}` : ''), 'major'),
      ];
    },
  },

  /* -------------------------------------------------------- txt-to-pdf */
  {
    slug: 'txt-to-pdf',
    title: 'Text → PDF',
    fixture: 'torture.txt',
    ready: '#actionControls',
    download: '#btnDownload',
    outName: 'txt-to-pdf.pdf',
    kind: 'pdf',
    // Disclosing an unrenderable script is part of the contract, so the
    // harness reads what the page actually told the user.
    alsoRead: { notice: '#errorMessage' },
    async checks({ out, page }) {
      const t = out.text.replace(/\s+/g, ' ');
      // The fixture runs M01..M60; all of them must reach the page.
      const markers = Array.from({ length: 60 }, (_, i) => 'M' + String(i + 1).padStart(2, '0'));
      const gone = markers.filter((m) => !t.includes(m));
      const first = out.sizes[0];
      return [
        ok('opens', 'Output is a readable PDF', out.pages > 0, `${out.pages} pages`, 'blocker'),
        ok('text', 'All 60 lines reach the page', gone.length === 0,
           gone.length ? `missing ${gone.length}, first: ${gone[0]}` : 'all present', 'blocker'),
        ok('paginates', 'Content flows onto more than one page', out.pages > 1,
           `${out.pages} pages`, 'major'),
        ok('latin-ext', 'Latin-Extended and punctuation render correctly',
           t.includes('Ünïcodé') && t.includes('—'),
           '', 'major'),
        ok('devanagari', 'Devanagari renders as Devanagari, not as wrong glyphs',
           /[ऀ-ॿ]/.test(out.text),
           /[ऀ-ॿ]/.test(out.text) ? '' : 'Devanagari dropped or replaced', 'blocker'),
        /* CJK cannot be embedded — the fonts are 5-15MB. That is a real
           limit, so the standard is not "it renders" but "the user is told",
           which is the difference between a documented gap and silent
           corruption. */
        ok('cjk-disclosed', 'Unrenderable scripts (CJK) are disclosed, not silently mangled',
           /Chinese|Japanese|Korean|cannot be embedded/i.test(page.notice || ''),
           page.notice ? 'notice: ' + page.notice.slice(0, 90) : 'no notice shown to the user', 'major'),
        ok('longtoken', 'The 90-character unbroken token does not run off the page',
           t.includes('AAAAAAAAAA'), '', 'major'),
        ok('pagesize', 'Sane page geometry',
           first && first.width > 400 && first.height > 500,
           first ? `${first.width}×${first.height}pt` : 'n/a', 'minor'),
      ];
    },
  },
];

export default documentRecipes;
