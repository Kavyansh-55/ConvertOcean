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

/* `torture-compress.pdf` plants M02-M13; M01 sits on an image, not in text. */
const HEAVY_MARKERS = Array.from({ length: 12 }, (_, i) => 'M' + String(i + 2).padStart(2, '0'));

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
    /* The default mode: one PDF containing the selection. The other three
       modes each get their own recipe below, because the thing that can break
       is different in each — the promise here is fidelity, and there it is
       that the pieces add back up to the document. */
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

  /* The three modes added for the queries that ask for them: "split pdf into
     pages" / "separate files", "split pdf into 2 parts", "split pdf by size".
     Each one produces a zip, so the shared question is the one a single PDF
     never has to answer: do the pieces still add up to the document? */
  {
    slug: 'split-pdf',
    title: 'Split PDF — a separate file per page',
    fixture: 'torture.pdf',
    ready: '#splitWorkspace',
    pre: ['#btnSelectAllPages', 'input[name="splitMode"][value="each"]'],
    download: '#btnExtract',
    outName: 'split-pdf-each.zip',
    kind: 'zip',
    async checks({ out, readPdf }) {
      const parts = out.entries.filter((e) => /\.pdf$/i.test(e.name));
      const read = [];
      for (const part of parts) read.push(await readPdf(part.bytes));
      const totalPages = read.reduce((n, r) => n + r.pages, 0);
      const allText = read.map((r) => r.text).join(' ');
      const gone = missing(allText, PDF_MARKERS);
      return [
        ok('opens', 'Produced a zip of PDFs', parts.length > 0,
           `${out.names.length} entries: ${out.names.join(', ')}`, 'blocker'),
        ok('count', 'One file per selected page (2)', parts.length === 2,
           `${parts.length} files`, 'blocker'),
        ok('single', 'Each file holds exactly one page',
           read.every((r) => r.pages === 1), read.map((r) => r.pages).join(', '), 'blocker'),
        ok('nocontentloss', 'Every page of the source is somewhere in the zip',
           totalPages === 2 && gone.length === 0,
           `${totalPages} pages, missing markers: ${gone.join(', ') || 'none'}`, 'blocker'),
        ok('named', 'Files are named by page number, zero-padded to sort',
           parts.every((e) => /_page_\d+\.pdf$/.test(e.name)), parts.map((e) => e.name).join(', '), 'minor'),
        ok('geometry', 'Page size survives the split',
           read.every((r) => r.sizes.every((z) => Math.abs(z.width - 612) < 4 && Math.abs(z.height - 792) < 4)),
           read.flatMap((r) => r.sizes.map((z) => `${z.width}×${z.height}`)).join(' '), 'major'),
      ];
    },
  },
  {
    slug: 'split-pdf',
    title: 'Split PDF — into N equal parts',
    fixture: 'torture.pdf',
    ready: '#splitWorkspace',
    /* No page selection at all: this mode must work on the whole document
       without one, which is exactly what a reader who typed "split pdf into 2
       parts" expects. A recipe that clicked Select all first would not be
       testing that. */
    pre: ['input[name="splitMode"][value="parts"]', { setValue: '#partCount', value: '2' }],
    download: '#btnExtract',
    outName: 'split-pdf-parts.zip',
    kind: 'zip',
    async checks({ out, readPdf }) {
      const parts = out.entries.filter((e) => /\.pdf$/i.test(e.name));
      const read = [];
      for (const part of parts) read.push(await readPdf(part.bytes));
      const totalPages = read.reduce((n, r) => n + r.pages, 0);
      const gone = missing(read.map((r) => r.text).join(' '), PDF_MARKERS);
      return [
        ok('count', 'Two parts requested, two produced', parts.length === 2,
           `${parts.length} parts: ${out.names.join(', ')}`, 'blocker'),
        ok('nopageselection', 'Works with nothing selected in the page picker',
           totalPages === 2, `${totalPages} pages across the parts`, 'blocker'),
        ok('nocontentloss', 'The parts add back up to the whole document',
           gone.length === 0, `missing markers: ${gone.join(', ') || 'none'}`, 'blocker'),
        ok('even', 'A 2-page document splits 1 and 1',
           read.every((r) => r.pages === 1), read.map((r) => r.pages).join(' + '), 'major'),
      ];
    },
  },
  {
    slug: 'split-pdf',
    title: 'Split PDF — parts under a size',
    /* Not the 4 KB text fixture the other split recipes use. The first version
       of this recipe ran on it with a 0.05 MB budget, which is fourteen times
       the whole document — so it produced one part, asserted that no part was
       over the limit, and passed without ever splitting anything. The tenth
       time this cycle that a check was green for the wrong reason.

       `torture-compress.pdf` is 646 KB across four pages of unequal weight,
       which is what makes a byte budget mean something. */
    fixture: 'torture-compress.pdf',
    ready: '#splitWorkspace',
    pre: ['input[name="splitMode"][value="size"]', { setValue: '#partSize', value: '0.3' }],
    download: '#btnExtract',
    outName: 'split-pdf-size.zip',
    kind: 'zip',
    /* Page 2 of this fixture is 545 KB on its own, so a 0.3 MB budget cannot
       be met for it by any amount of splitting. What the tool must not do is
       hand that part over as though it had succeeded. */
    alsoRead: { notice: '#errorMessage' },
    async checks({ out, readPdf, srcBytes, page }) {
      const parts = out.entries.filter((e) => /\.pdf$/i.test(e.name));
      const read = [];
      for (const part of parts) read.push(await readPdf(part.bytes));
      const budget = Math.round(0.3 * 1024 * 1024);
      const totalPages = read.reduce((n, r) => n + r.pages, 0);
      const gone = HEAVY_MARKERS.filter((m) => !read.map((r) => r.text).join(' ').replace(/\s+/g, ' ').includes(m));
      /* The honest invariant: a part may exceed the budget only when it holds
         a single page, because splitting cannot make one page smaller. */
      const overAndSplittable = parts.filter((e, i) => e.bytes.length > budget && read[i].pages > 1);
      const sizes = parts.map((e) => (e.bytes.length / 1024).toFixed(0) + 'KB').join(', ');
      return [
        ok('opens', 'Produced a zip of PDFs', parts.length > 0,
           `${parts.length} parts, sizes ${sizes}`, 'blocker'),
        ok('didsplit', 'A 646 KB file with a 0.3 MB budget really is split',
           parts.length >= 2, `${parts.length} part(s) from ${(srcBytes / 1024).toFixed(0)}KB`, 'blocker'),
        ok('nocontentloss', 'No page is lost to the size search',
           totalPages === 4 && gone.length === 0,
           `${totalPages} pages, missing markers: ${gone.join(', ') || 'none'}`, 'blocker'),
        ok('budget', 'No multi-page part is over the limit',
           overAndSplittable.length === 0,
           overAndSplittable.length ? `over: ${overAndSplittable.map((e) => e.name).join(', ')}` : 'none over', 'blocker'),
        ok('order', 'Parts are in document order, zero-padded to sort',
           parts.every((e, i) => e.name.includes('_part_' + String(i + 1))),
           parts.map((e) => e.name).join(', '), 'minor'),
        ok('saysso', 'The page that cannot fit is named, not quietly shipped',
           /larger than 0\.3 MB on its own/.test(page.notice || ''),
           page.notice ? `said: "${page.notice}"` : 'said nothing', 'blocker'),
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
    async checks({ out, src, readDocx }) {
      const docs = out.entries.filter((e) => /\.docx$/i.test(e.name));
      const parsed = [];
      for (const d of docs) {
        try { parsed.push(await readDocx(d.bytes)); } catch { parsed.push(null); }
      }
      const good = parsed.filter(Boolean);
      const allText = good.map((p) => p.text).join(' ');
      const body = DOCX_MARKERS.slice(0, 18);

      /* Splitting distributes a document; it does not copy every run into
         every part. The old check asked one part to carry two fonts, which
         this fixture makes impossible — Georgia is on element 2 and Courier
         New on element 14, and a 10-paragraph chunk cannot hold both. A part
         that legitimately received only unformatted trailing paragraphs then
         read as a failure. What a reader actually expects is three things,
         and all three are measurable: nothing the source had is lost across
         the set, nothing is invented that the source never had, and each
         piece keeps the formatting of the text it was given. */
      const union = (key) => [...new Set(good.flatMap((p) => p[key]))];
      const fonts = union('fonts');
      const colors = union('colors');
      const lost = [
        ...src.fonts.filter((f) => !fonts.includes(f)),
        ...src.colors.filter((c) => !colors.includes(c)),
      ];
      const invented = [
        ...fonts.filter((f) => !src.fonts.includes(f)),
        ...colors.filter((c) => !src.colors.includes(c)),
      ];
      /* M02 is the Georgia paragraph, M11 the Courier New one. Whichever
         part each landed in must be the part that carries its font. */
      const travels = [['M02', 'Georgia'], ['M11', 'Courier New']]
        .map(([marker, font]) => {
          const host = good.find((p) => p.text.includes(marker));
          return { marker, font, ok: !!host && host.fonts.includes(font) };
        });

      return [
        ok('zip', 'Produced .docx parts', docs.length > 0,
           `${out.names.length} entries: ${out.names.slice(0, 4).join(', ')}`, 'blocker'),
        ok('valid', 'Every part is a valid package', good.length === docs.length,
           `${good.length}/${docs.length} parsed`, 'blocker'),
        ok('nocontentloss', 'No paragraph lost across the parts',
           missing(allText, body).length === 0,
           `missing: ${missing(allText, body).join(', ') || 'none'}`, 'blocker'),
        ok('formatting', 'Every font and colour in the source survives somewhere',
           lost.length === 0,
           lost.length ? `lost: ${lost.join(', ')}`
                       : `${fonts.length} fonts, ${colors.length} colours, all accounted for`,
           'major'),
        ok('nofabrication', 'No part invents formatting the source never had',
           invented.length === 0,
           invented.length ? `invented: ${invented.join(', ')}` : 'none', 'major'),
        ok('formattravels', 'Each marker keeps its own font in the part it lands in',
           travels.every((t) => t.ok),
           travels.map((t) => `${t.marker}→${t.font}:${t.ok ? 'kept' : 'LOST'}`).join(' '),
           'major'),
        ok('stylepartskept', 'Each part still carries styles.xml and numbering.xml',
           good.every((p) => p.parts.includes('word/styles.xml'))
           && good.every((p) => p.parts.includes('word/numbering.xml')),
           good.map((p) => (p.parts.includes('word/styles.xml') ? 's' : '-')
                         + (p.parts.includes('word/numbering.xml') ? 'n' : '-')).join(' '),
           'major'),
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
      // Any part under notesSlides/, not just the original "notesSlideN.xml"
      // naming — a copied part is renamed to avoid colliding with the base
      // deck's, and matching only the original shape missed it.
      const notes = out.names.filter((n) => /^ppt\/notesSlides\/[^/]+\.xml$/.test(n));

      const text = out.entries
        .filter((e) => /^ppt\/slides\/slide\d+\.xml$/.test(e.name))
        .map((e) => e.bytes.toString('utf8')).join(' ');

      /* The second deck is deliberately not a copy of the first. Two identical
         decks cannot reveal the interesting failure: a merger that appends
         slide XML but never copies the parts those slides reference will leave
         deck two's pictures and layouts silently resolving to deck one's. */
      const distinctImages = new Set(
        out.entries.filter((e) => /^ppt\/media\//.test(e.name))
          .map((e) => e.bytes.length + ':' + e.bytes.toString('base64').slice(0, 32))
      );

      return [
        ok('opens', 'Output is a valid pptx package',
           out.names.includes('ppt/presentation.xml'), `${out.names.length} parts`, 'blocker'),
        ok('slides', 'Two 3-slide decks make 6 slides', slides.length === 6,
           `${slides.length} slides`, 'blocker'),
        ok('both-decks', 'Content from both decks is present',
           /M01 Torture Deck/.test(text) && /B01 Second Deck/.test(text),
           '', 'blocker'),
        ok('media-count', 'A media part exists for each deck', media.length >= 2,
           `${media.length} media parts (expected 2)`, 'major'),
        ok('media-distinct', 'The second deck keeps its own picture, not the first deck’s',
           distinctImages.size >= 2,
           `${distinctImages.size} distinct image(s) among ${media.length} media part(s)`, 'major'),
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
    /* The tool defaults to 1000 lines per part and the fixture has 66, so the
       default correctly produces a single file — the earlier "only 1 part"
       failure was the recipe asking for a split it had not requested. */
    pre: [{ setValue: '#splitLines', value: '20' }],
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
      /* The two inputs are deliberately different workbooks, not two copies:
         the first is white-on-navy with dollar amounts in Calibri, the second
         white-on-purple with euros in Arial, and those live at the SAME style
         indices in their own files. Counting styled cells alone cannot tell a
         correct merge from one that kept the indices and silently repainted
         the second workbook in the first one's colours, so the colours
         themselves are what gets asserted. */
      const fills = new Set(out.sheets.flatMap((s) => s.fills));
      const formats = out.numFmts.join(' ');
      return [
        ok('opens', 'Output is a valid workbook', out.sheets.length > 0,
           `${out.sheets.length} sheets: ${out.sheets.map((s) => s.name).join(', ')}`, 'blocker'),
        ok('sheets', 'Two 3-sheet workbooks make 6 sheets', out.sheets.length === 6,
           `${out.sheets.length} sheets`, 'blocker'),
        ok('styling', 'Cell styling survives the merge', styled > 0,
           `${styled} styled cells (each source had 54)`, 'major'),
        ok('bothpalettes', 'Each workbook keeps its own header colour',
           fills.has('FF1F4E79') && fills.has('FF7E22CE'),
           `fills: ${[...fills].join(', ') || 'none'}`, 'major'),
        ok('bothformats', 'Both number-format sets survive the id collision',
           /\$/.test(formats) && /€/.test(formats),
           `formats: ${formats || 'none'}`, 'major'),
        ok('fonts', 'Both workbooks keep their own typeface',
           out.fonts.includes('Calibri') && out.fonts.includes('Arial'),
           `fonts: ${out.fonts.join(', ') || 'none'}`, 'major'),
        ok('merges', 'Merged title cell survives',
           out.sheets.some((s) => s.merges > 0),
           `merges per sheet: ${out.sheets.map((s) => s.merges).join(',')}`, 'major'),
        ok('widths', 'Column widths survive for both workbooks',
           out.sheets.filter((s) => s.hasCols).length >= 2,
           `${out.sheets.filter((s) => s.hasCols).length} sheets with explicit widths`, 'major'),
      ];
    },
  },
];

export default mergeSplitRecipes;
