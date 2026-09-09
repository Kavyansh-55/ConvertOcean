/**
 * Merge and split tools.
 *
 * These carry a different promise from the converters. Nobody expects
 * word-to-pdf to be lossless — it re-authors the document in another format.
 * But a user who *splits* a document expects the pieces to be the document,
 * and a user who *merges* two files expects both to arrive intact. So the
 * standard here is higher, and the interesting failure is a tool that quietly
 * round-trips through a lossy library on the way.
 *
 * split-excel already demonstrates the trap and lives in documents.mjs; these
 * are the rest of the family.
 */
import { ok, DOCX_MARKERS, PDF_MARKERS, missing } from './_shared.mjs';

export const mergeSplitRecipes = [
  /* ------------------------------------------------------------ PDF */
  {
    slug: 'merge-pdf',
    title: 'Merge PDF',
    fixture: ['torture.pdf', 'torture-b.pdf'],
    ready: '#fileItemsList',
    download: '#btnMerge',
    outName: 'merge-pdf.pdf',
    kind: 'pdf',
    async checks({ out }) {
      const gone = missing(out.text, PDF_MARKERS);
      return [
        ok('opens', 'Output is a readable PDF', out.pages > 0, `${out.pages} pages`, 'blocker'),
        ok('pages', 'Two 2-page files make 4 pages', out.pages === 4, `${out.pages} pages`, 'blocker'),
        ok('text', 'All markers survive from both copies', gone.length === 0,
           gone.length ? `missing: ${gone.join(', ')}` : 'all present', 'blocker'),
        ok('fonts', 'Embedded fonts carried across',
           out.fonts.length >= 3, `fonts: ${out.fonts.join(', ')}`, 'major'),
        ok('geometry', 'Page size unchanged (612×792pt Letter)',
           out.sizes.every((s) => Math.abs(s.width - 612) < 4 && Math.abs(s.height - 792) < 4),
           out.sizes.map((s) => `${s.width}×${s.height}`).join(' '), 'major'),
      ];
    },
  },
  {
    slug: 'split-pdf',
    title: 'Split PDF',
    fixture: 'torture.pdf',
    ready: '#splitWorkspace',
    pre: ['#btnSelectAllPages'],   // Extract acts on the selection, which starts empty
    download: '#btnExtract',
    outName: 'split-pdf.pdf',
    /* Selecting every page and extracting produces one PDF containing that
       selection, not a zip of one-page files. That is a reasonable design —
       so the test is that the extraction is faithful, not that it is a zip. */
    kind: 'pdf',
    async checks({ out }) {
      return [
        ok('opens', 'Extracted file is a readable PDF', out.pages > 0,
           `${out.pages} pages`, 'blocker'),
        ok('allpages', 'Selecting all pages extracts all pages', out.pages === 2,
           `${out.pages} pages (source had 2)`, 'blocker'),
        ok('nocontentloss', 'No page content lost',
           missing(out.text, PDF_MARKERS).length === 0,
           `missing: ${missing(out.text, PDF_MARKERS).join(', ') || 'none'}`, 'blocker'),
        ok('geometry', 'Extraction keeps the original page size',
           out.sizes.every((s) => Math.abs(s.width - 612) < 4 && Math.abs(s.height - 792) < 4),
           out.sizes.map((s) => `${s.width}×${s.height}`).join(' '), 'major'),
        ok('fonts', 'Embedded fonts carried into the extract',
           out.fonts.length >= 3, `fonts: ${out.fonts.join(', ')}`, 'major'),
      ];
    },
  },

  /* ----------------------------------------------------------- Word */
  {
    slug: 'merge-word',
    title: 'Merge Word',
    fixture: ['torture.docx', 'torture-b.docx'],
    ready: '#fileItemsList',
    download: '#btnMerge',
    outName: 'merge-word.docx',
    kind: 'docx',
    async checks({ out, src }) {
      const body = DOCX_MARKERS.slice(0, 18);
      const gone = missing(out.text, body);
      const count = (m) => (out.text.match(new RegExp(m, 'g')) || []).length;
      return [
        ok('opens', 'Output is a valid .docx', out.parts.includes('word/document.xml'),
           `${out.parts.length} parts`, 'blocker'),
        ok('text', 'All body markers survive', gone.length === 0,
           gone.length ? `missing: ${gone.join(', ')}` : 'all present', 'blocker'),
        ok('twice', 'Both copies present, not one silently dropped',
           count('M01') === 2, `M01 appears ${count('M01')}× (expected 2)`, 'blocker'),
        ok('tables', 'Both tables carried over', out.tables === 2,
           `${out.tables} tables (expected 2)`, 'major'),
        ok('images', 'Both images carried over', out.images === 2,
           `${out.images} drawings (expected 2)`, 'major'),
        ok('formatting', 'Direct formatting survives the merge',
           out.fonts.length >= 2 && out.colors.length >= 2,
           `fonts: ${out.fonts.join('/') || 'none'} colors: ${out.colors.join('/') || 'none'}`, 'major'),
        ok('numbering', 'List numbering definitions preserved',
           out.hasNumbering, out.hasNumbering ? '' : 'numbering.xml or numPr lost', 'major'),
        ok('src-sanity', 'Source really had one of each',
           src.tables === 1 && src.images === 1, `src tables=${src.tables} images=${src.images}`, 'minor'),
      ];
    },
  },
  {
    slug: 'split-word',
    title: 'Split Word',
    fixture: 'torture.docx',
    ready: '#splitWorkspace',
    /* The default mode splits on Heading 1, and the fixture has exactly one —
       so the tool correctly refuses. Paragraph mode is the shape that actually
       exercises the splitting code. */
    pre: [{ select: '#splitMode', value: 'paragraphs' }],
    download: '#btnSplit',
    outName: 'split-word.zip',
    kind: 'zip',
    async checks({ out, readDocx }) {
      const docs = out.entries.filter((e) => /\.docx$/i.test(e.name));
      const parsed = [];
      for (const d of docs) {
        try { parsed.push(await readDocx(d.bytes)); } catch { parsed.push(null); }
      }
      const good = parsed.filter(Boolean);
      const allText = good.map((p) => p.text).join(' ');
      const body = DOCX_MARKERS.slice(0, 18);
      return [
        ok('zip', 'Produced .docx parts', docs.length > 0,
           `${out.names.length} entries: ${out.names.slice(0, 4).join(', ')}`, 'blocker'),
        ok('valid', 'Every part is a valid package', good.length === docs.length,
           `${good.length}/${docs.length} parsed`, 'blocker'),
        ok('nocontentloss', 'No paragraph lost across the parts',
           missing(allText, body).length === 0,
           `missing: ${missing(allText, body).join(', ') || 'none'}`, 'blocker'),
        ok('formatting', 'Parts keep the original run formatting',
           good.some((p) => p.fonts.length >= 2 && p.colors.length >= 1),
           good.map((p) => `fonts:${p.fonts.length}/colors:${p.colors.length}`).join(' '), 'major'),
        ok('tablekept', 'The table lands in a part intact, not flattened',
           good.some((p) => p.tables >= 1),
           `tables per part: ${good.map((p) => p.tables).join(',')}`, 'major'),
      ];
    },
  },

  /* ----------------------------------------------------- PowerPoint */
  {
    slug: 'merge-pptx',
    title: 'Merge PowerPoint',
    fixture: ['torture.pptx', 'torture-b.pptx'],
    ready: '#fileItemsList',
    download: '#btnMerge',
    outName: 'merge-pptx.pptx',
    kind: 'zip',
    async checks({ out }) {
      const slides = out.names.filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n));
      const media = out.names.filter((n) => /^ppt\/media\//.test(n));
      const notes = out.names.filter((n) => /notesSlide\d+\.xml$/.test(n));
      return [
        ok('opens', 'Output is a valid pptx package',
           out.names.includes('ppt/presentation.xml'), `${out.names.length} parts`, 'blocker'),
        ok('slides', 'Two 3-slide decks make 6 slides', slides.length === 6,
           `${slides.length} slides`, 'blocker'),
        ok('media', 'Pictures from both decks carried over', media.length >= 2,
           `${media.length} media parts (expected 2)`, 'major'),
        ok('theme', 'Theme part preserved',
           out.names.some((n) => /ppt\/theme\/theme\d+\.xml/.test(n)), '', 'major'),
        ok('notes', 'Speaker notes carried over', notes.length >= 2,
           `${notes.length} notes parts (expected 2)`, 'minor'),
      ];
    },
  },
  {
    slug: 'split-pptx',
    title: 'Split PowerPoint',
    fixture: 'torture.pptx',
    ready: '#splitWorkspace',
    download: '#btnSplit',
    outName: 'split-pptx.zip',
    kind: 'zip',
    async checks({ out, readZip }) {
      const decks = out.entries.filter((e) => /\.pptx$/i.test(e.name));
      let totalSlides = 0;
      let withTheme = 0;
      for (const d of decks) {
        const inner = await readZip(d.bytes);
        totalSlides += inner.names.filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n)).length;
        if (inner.names.some((n) => /ppt\/theme\/theme\d+\.xml/.test(n))) withTheme++;
      }
      return [
        ok('zip', 'Produced .pptx parts', decks.length > 0,
           `${out.names.length} entries: ${out.names.slice(0, 4).join(', ')}`, 'blocker'),
        ok('count', 'Three slides split into three decks', decks.length === 3,
           `${decks.length} decks`, 'major'),
        ok('slides', 'One slide per deck, none lost', totalSlides === 3,
           `${totalSlides} slides across all parts`, 'blocker'),
        ok('theme', 'Every part keeps its theme (slides still look right)',
           withTheme === decks.length, `${withTheme}/${decks.length} parts have a theme`, 'major'),
      ];
    },
  },

  /* ------------------------------------------------------------ TXT */
  {
    slug: 'merge-txt',
    title: 'Merge text',
    fixture: ['torture.txt', 'torture-b.txt'],
    ready: '#filesList',
    download: '#btnMerge',
    outName: 'merge-txt.txt',
    kind: 'text',
    async checks({ out, src }) {
      const t = String(out);
      const srcText = String(src);
      const count = (t.match(/M01 Torture Text Fixture/g) || []).length;
      return [
        ok('nonempty', 'Produced merged text', t.trim().length > 0, `${t.length} chars`, 'blocker'),
        ok('both', 'Both copies present', count === 2, `header appears ${count}× (expected 2)`, 'blocker'),
        ok('length', 'Roughly the sum of both inputs',
           t.length >= srcText.length * 1.9, `${t.length} vs 2× ${srcText.length}`, 'major'),
        ok('unicode', 'Unicode survives', t.includes('変換') && t.includes('नमस्ते'), '', 'major'),
        ok('tabs', 'Tab-indented line preserved', t.includes('\tM04'), '', 'minor'),
      ];
    },
  },
  {
    slug: 'split-txt',
    title: 'Split text',
    fixture: 'torture.txt',
    ready: '#fileInfoCard',
    download: '#btnSplit',
    outName: 'split-txt.zip',
    kind: 'zip',
    async checks({ out }) {
      const parts = out.entries.filter((e) => /\.txt$/i.test(e.name));
      const joined = parts.map((p) => p.bytes.toString('utf8')).join('\n');
      // Every numbered filler line M08..M60 must appear somewhere.
      const fillers = Array.from({ length: 53 }, (_, i) => 'M' + String(i + 8).padStart(2, '0'));
      const gone = fillers.filter((m) => !joined.includes(m));
      return [
        ok('zip', 'Produced text parts', parts.length > 0,
           `${out.names.length} entries: ${out.names.slice(0, 4).join(', ')}`, 'blocker'),
        ok('multiple', 'Actually split into more than one part', parts.length > 1,
           `${parts.length} parts`, 'major'),
        ok('nocontentloss', 'No line lost across the parts', gone.length === 0,
           gone.length ? `missing ${gone.length} lines, first: ${gone[0]}` : 'all 53 filler lines present', 'blocker'),
        ok('unicode', 'Unicode survives the split', joined.includes('変換'), '', 'major'),
      ];
    },
  },

  /* ---------------------------------------------------------- Excel */
  {
    slug: 'merge-excel',
    title: 'Merge Excel',
    fixture: ['torture.xlsx', 'torture-b.xlsx'],
    ready: '#fileItemsList',
    download: '#btnMerge',
    outName: 'merge-excel.xlsx',
    kind: 'xlsx',
    async checks({ out }) {
      const styled = out.sheets.reduce((n, s) => n + s.styledCells, 0);
      return [
        ok('opens', 'Output is a valid workbook', out.sheets.length > 0,
           `${out.sheets.length} sheets: ${out.sheets.map((s) => s.name).join(', ')}`, 'blocker'),
        ok('sheets', 'Two 3-sheet workbooks make 6 sheets', out.sheets.length === 6,
           `${out.sheets.length} sheets`, 'blocker'),
        ok('styling', 'Cell styling survives the merge', styled > 0,
           `${styled} styled cells (each source had 54)`, 'major'),
        ok('merges', 'Merged title cell survives',
           out.sheets.some((s) => s.merges > 0),
           `merges per sheet: ${out.sheets.map((s) => s.merges).join(',')}`, 'major'),
      ];
    },
  },
];

export default mergeSplitRecipes;
