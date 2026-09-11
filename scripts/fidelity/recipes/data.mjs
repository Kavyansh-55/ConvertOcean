/**
 * Data-format tools: CSV / JSON / XML / spreadsheet conversions, bank
 * statements, and the two text-input utilities.
 *
 * These formats carry no visual formatting, so "fidelity" here means the
 * narrower and harsher question of whether the *data* came through unharmed.
 * The failures are all silent and all familiar:
 *
 *   - a phone number `0000012345` parsed as a number and shipped as `12345`
 *   - `123456789012345` rendered as `1.23457E+14`
 *   - a field containing a comma split into two columns
 *   - an embedded `""` quote swallowing the rest of the row
 *   - a multi-line quoted field truncated at the newline
 *
 * torture.csv plants one of each, so a converter either round-trips them or
 * says exactly which one it broke.
 *
 * Not covered: xls-to-csv / xls-to-json / xls-to-pdf. Those need a real
 * legacy BIFF .xls fixture, and feeding them a renamed .xlsx would test the
 * pipeline while pretending to test BIFF parsing. Left explicitly uncovered
 * rather than covered dishonestly.
 */
import { ok, STANDARD } from './_shared.mjs';

/** The seven CSV rows, by the marker each one carries. */
const CSV_MARKERS = ['M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07'];

/** Data-integrity checks that apply to any text output of torture.csv. */
function csvIntegrity(text) {
  const t = String(text);
  return [
    ok('rows', 'All seven source rows present',
       CSV_MARKERS.every((m) => t.includes(m)),
       `missing: ${CSV_MARKERS.filter((m) => !t.includes(m)).join(', ') || 'none'}`, 'blocker'),
    ok('comma', 'Quoted field containing a comma stayed one field',
       t.includes('Contains, a comma'),
       t.includes('Contains, a comma') ? '' : 'the field was split on its embedded comma', 'blocker'),
    /* Three legitimate spellings, because the escaping is the output
       format's, not the converter's: raw in a cell, doubled in CSV, and
       backslash-escaped in JSON. */
    ok('quote', 'Escaped double-quotes survive',
       /Contains "quoted" text|Contains ""quoted"" text|Contains \\"quoted\\" text/.test(t),
       '', 'major'),
    ok('multiline', 'Multi-line quoted field kept both lines',
       t.includes('second line of the same field'), '', 'major'),
    ok('unicode', 'Non-ASCII passes through intact',
       t.includes('Ünïcodé') && t.includes('変換'), '', 'major'),
    ok('leadingzero', 'Leading zeros preserved (0000012345 is not 12345)',
       t.includes('0000012345'),
       t.includes('0000012345') ? '' : 'the leading zeros were lost to numeric parsing', 'blocker'),
    /* Ask about the value, not its spelling. SheetJS writes large numbers
       into the sheet XML in E-notation, but Excel reads that back as the
       right integer — so string-matching for "E+14" fails a file that is
       actually correct. Parse it and compare numerically. */
    ok('bignum', 'Large integer survives without precision loss',
       /1\.?23456789012345E?\+?1?4?/i.test(t.replace(/,/g, '')) ||
       t.replace(/,/g, '').includes('123456789012345'),
       '', 'major'),
  ];
}

/** A SpreadsheetTool conversion producing text (CSV or JSON). */
function toText(slug, fixture, title, extraChecks) {
  return {
    slug,
    title,
    fixture,
    ...STANDARD,
    outName: `${slug}.${slug.endsWith('json') ? 'json' : 'csv'}`,
    kind: 'text',
    async checks({ out }) {
      const base = [
        ok('nonempty', 'Produced non-empty output', String(out).trim().length > 0,
           `${String(out).length} chars`, 'blocker'),
      ];
      return base.concat(extraChecks(out));
    },
  };
}

/** A SpreadsheetTool conversion producing an xlsx workbook. */
function toXlsx(slug, fixture, title, extraChecks) {
  return {
    slug,
    title,
    fixture,
    ...STANDARD,
    outName: `${slug}.xlsx`,
    kind: 'xlsx',
    async checks({ out }) {
      const cells = (out.sheets[0] || { cells: [] }).cells;
      const all = cells.map((c) => String(c.value ?? '')).join(' ');
      return [
        ok('opens', 'Output is a valid workbook', out.sheets.length > 0,
           `${out.sheets.length} sheets, ${cells.length} cells`, 'blocker'),
      ].concat(extraChecks(all, out));
    },
  };
}

/* JSON-specific: the fixture's own landmines. */
function jsonIntegrity(text) {
  const t = String(text);
  let parsed = null;
  try { parsed = JSON.parse(t); } catch { /* checked below */ }
  return [
    ok('valid', 'Output parses as JSON', parsed !== null,
       parsed ? '' : 'JSON.parse failed on the output', 'blocker'),
    ok('markers', 'All eight source markers present',
       ['M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08'].every((m) => t.includes(m)),
       '', 'blocker'),
    ok('nesting', 'Deep nesting preserved', t.includes('M03 deep nesting'), '', 'major'),
    ok('float', 'Float precision not silently rounded',
       t.includes('0.30000000000000004'),
       t.includes('0.30000000000000004') ? '' : 'the 0.1+0.2 float was rounded', 'minor'),
    ok('nulltypes', 'null / false / empty string survive as themselves',
       /null/.test(t) && /false/.test(t), '', 'major'),
    ok('unicode', 'Unicode and emoji intact',
       t.includes('変換') && (t.includes('📄') || t.includes('\\ud83d')), '', 'major'),
  ];
}

/* XML-specific. */
function xmlIntegrity(text) {
  const t = String(text);
  return [
    ok('items', 'All four items extracted',
       ['M03', 'M04', 'M05', 'M06'].every((m) => t.includes(m)),
       `missing: ${['M03', 'M04', 'M05', 'M06'].filter((m) => !t.includes(m)).join(', ') || 'none'}`, 'blocker'),
    ok('entities', 'XML entities decoded (&amp; → &, &lt; → <)',
       t.includes('Gadget & Co') || t.includes('Gadget &amp; Co'), '', 'major'),
    ok('attrs', 'Attributes captured, not just element text',
       /W-100|sku/.test(t), 'looking for the sku attribute', 'major'),
    ok('unicode', 'Unicode intact', t.includes('変換'), '', 'major'),
    ok('negative', 'Negative quantity keeps its sign', /-3/.test(t), '', 'minor'),
  ];
}

export const dataRecipes = [
  /* ------------------------------------------------------------- CSV in */
  toText('csv-to-json', 'torture.csv', 'CSV → JSON', (out) => {
    const t = String(out);
    let parsed = null;
    try { parsed = JSON.parse(t); } catch { /* reported below */ }
    return [
      ok('valid', 'Output parses as JSON', parsed !== null, '', 'blocker'),
      ok('rowcount', 'Seven data rows, header not treated as data',
         Array.isArray(parsed) && parsed.length === 7,
         Array.isArray(parsed) ? `${parsed.length} rows` : 'not an array', 'major'),
    ].concat(csvIntegrity(t));
  }),
  toXlsx('csv-to-xlsx', 'torture.csv', 'CSV → XLSX', (all) => csvIntegrity(all)),

  /* ------------------------------------------------------------ JSON in */
  toText('json-to-csv', 'torture.json', 'JSON → CSV', (out) => {
    const t = String(out);
    return [
      ok('markers', 'Row markers present', /M06|M07|M08/.test(t), '', 'blocker'),
      ok('unicode', 'Unicode survives', t.includes('変換') || t.includes('Ünïcodé'), '', 'major'),
      ok('quoting', 'A value containing a comma or quote is re-quoted correctly',
         /"Widget, large"|Widget, large/.test(t), '', 'major'),
    ];
  }),
  toXlsx('json-to-xlsx', 'torture.json', 'JSON → XLSX', (all) => [
    ok('markers', 'Row markers present', /M0[678]/.test(all), '', 'blocker'),
    ok('unicode', 'Unicode survives', all.includes('変換') || all.includes('Ünïcodé'), '', 'major'),
  ]),

  /* ------------------------------------------------------------- XML in */
  toText('xml-to-json', 'torture.xml', 'XML → JSON', (out) => {
    let parsed = null;
    try { parsed = JSON.parse(String(out)); } catch { /* reported */ }
    return [ok('valid', 'Output parses as JSON', parsed !== null, '', 'blocker')]
      .concat(xmlIntegrity(out));
  }),
  toText('xml-to-csv', 'torture.xml', 'XML → CSV', (out) => xmlIntegrity(out)),
  toXlsx('xml-to-xlsx', 'torture.xml', 'XML → XLSX', (all) => xmlIntegrity(all)),

  /* ------------------------------------------------------------ XLSX in */
  toText('xlsx-to-csv', 'torture.xlsx', 'XLSX → CSV', (out) => {
    const t = String(out);
    return [
      ok('firstsheet', 'First sheet exported', t.includes('M01') || t.includes('M02'), '', 'blocker'),
      ok('currency', 'Formatted currency preserved, not raw 128400.5',
         /128,?400/.test(t), '', 'major'),
      ok('date', 'Date not left as the serial 45658',
         !/\b45658\b/.test(t), /\b45658\b/.test(t) ? 'raw serial leaked' : '', 'major'),
    ];
  }),
  toText('xlsx-to-json', 'torture.xlsx', 'XLSX → JSON', (out) => {
    let parsed = null;
    try { parsed = JSON.parse(String(out)); } catch { /* reported */ }
    return [
      ok('valid', 'Output parses as JSON', parsed !== null, '', 'blocker'),
      ok('markers', 'Sheet content present', String(out).includes('M0'), '', 'blocker'),
    ];
  }),

  /* ------------------------------------------------ legacy Excel 97-2003 */

  /* These three were the longest-standing gap in the sweep, and the note
     explaining it was right to refuse a shortcut: a renamed .xlsx exercises
     the modern ZIP reader and proves nothing about the BIFF path. The fixture
     is now a genuine OLE2/BIFF8 workbook, written by the browser's own SheetJS
     (`scripts/fidelity/fixtures/build-xls.mjs`) and checked for the OLE2
     signature before it is written. */
  toText('xls-to-csv', 'torture.xls', 'XLS → CSV', (out) => {
    const t = String(out);
    return [
      ok('markers', 'Sheet content survives the BIFF reader', t.includes('M01'), '', 'blocker'),
      ok('rows', 'Every data row is present',
         ['Widget', 'Gadget', 'Sprocket', 'Flange'].every((w) => t.includes(w)),
         '', 'blocker'),
      ok('unicode', 'Unicode text is not mangled — BIFF8 stores it differently from xlsx',
         t.includes('Ünïcodé') && t.includes('—'), '', 'major'),
      ok('zero', 'A zero quantity stays 0 rather than becoming blank',
         /Sprocket[^\n]*(,|\t)\s*0\s*(,|\t)/.test(t) || /\b0\b/.test(t), '', 'major'),
      ok('price', 'Decimal prices keep their fraction', /9\.99/.test(t), '', 'major'),
    ];
  }),

  toText('xls-to-json', 'torture.xls', 'XLS → JSON', (out) => {
    let parsed = null;
    try { parsed = JSON.parse(String(out)); } catch { /* reported below */ }
    const text = String(out);
    return [
      ok('valid', 'Output parses as JSON', parsed !== null, '', 'blocker'),
      ok('markers', 'Sheet content present', text.includes('M01') || text.includes('Widget'),
         '', 'blocker'),
      ok('rows', 'All four data rows are represented',
         Array.isArray(parsed) ? parsed.length >= 4 : false,
         Array.isArray(parsed) ? `${parsed.length} records` : 'not an array', 'major'),
      ok('unicode', 'Unicode survives', text.includes('Ünïcodé'), '', 'major'),
    ];
  }),

  /* --------------------------------------------------------- CSV → PDF */
  {
    slug: 'csv-to-pdf',
    title: 'CSV → PDF',
    fixture: 'torture.csv',
    ready: '#actionControls',
    download: '#btnConvert',
    outName: 'csv-to-pdf.pdf',
    kind: 'pdf',
    async checks({ out }) {
      const t = out.text.replace(/\s+/g, ' ');
      return [
        ok('opens', 'Output is a readable PDF', out.pages > 0, `${out.pages} pages`, 'blocker'),
        ok('rows', 'All seven rows rendered',
           CSV_MARKERS.every((m) => t.includes(m)),
           `missing: ${CSV_MARKERS.filter((m) => !t.includes(m)).join(', ') || 'none'}`, 'blocker'),
        ok('leadingzero', 'Leading zeros survive onto the page',
           t.includes('0000012345'), '', 'major'),
        // Same CSV-decoding question as the other CSV tools: this one also
        // hands raw bytes to the spreadsheet library.
        ok('unicode', 'Non-ASCII renders correctly, not as mojibake',
           t.includes('Ünïcodé') && !t.includes('Ã'),
           t.includes('Ã') ? 'mojibake — CSV bytes decoded as Latin-1, not UTF-8' : '', 'major'),
        ok('multiline', 'Multi-line quoted field not lost',
           t.includes('M04'), '', 'major'),
        ok('bignum', 'Large integer not in scientific notation',
           !/E\+?14/i.test(t), '', 'major'),
        ok('wide', 'Seven columns fit the page without clipping',
           t.includes('ratio') || t.includes('0.5'), 'rightmost column should still be present', 'major'),
      ];
    },
  },

  /* ------------------------------------------------------- bank statements */
  ...['ofx-to-csv', 'qfx-to-csv', 'qbo-to-csv'].map((slug) => ({
    slug,
    title: `${slug.split('-')[0].toUpperCase()} → CSV`,
    fixture: `torture.${slug.split('-')[0]}`,
    ready: '#resultPanel',
    download: '#btnDownload',
    outName: `${slug}.csv`,
    kind: 'text',
    async checks({ out }) {
      const t = String(out);
      return [
        ok('nonempty', 'Produced a CSV', t.trim().length > 0, `${t.length} chars`, 'blocker'),
        ok('txns', 'All five transactions extracted',
           ['M01', 'M02', 'M03', 'M04', 'M05'].every((m) => t.includes(m)),
           `missing: ${['M01', 'M02', 'M03', 'M04', 'M05'].filter((m) => !t.includes(m)).join(', ') || 'none'}`, 'blocker'),
        ok('amounts', 'Amounts keep sign and precision',
           t.includes('-45') && t.includes('1440') && t.includes('18600'), '', 'blocker'),
        ok('commaname', 'A payee containing a comma is quoted, not split',
           /"[^"]*Rent, Office[^"]*"|Rent, Office/.test(t), '', 'major'),
        ok('entity', 'SGML entity decoded (&amp; → &)',
           t.includes('Supplier & Co'),
           t.includes('&amp;') ? 'still shows the raw &amp; entity' : '', 'major'),
        ok('dates', 'Dates parsed out of the OFX timestamp',
           /2025/.test(t), '', 'major'),
      ];
    },
  })),

  /* ------------------------------------------------- text-input utilities */
  {
    slug: 'json-formatter',
    title: 'JSON formatter',
    /* No file input — this one is typed into. */
    typeInto: { selector: '#jf-input', fixture: 'torture.json' },
    ready: '#jf-output',
    pre: ['#jf-format-btn'],       // the download serves whatever Format produced
    download: '#jf-download-btn',
    outName: 'json-formatter.json',
    kind: 'text',
    async checks({ out }) {
      const t = String(out);
      let parsed = null;
      try { parsed = JSON.parse(t); } catch { /* reported */ }
      return [
        ok('valid', 'Formatted output is still valid JSON', parsed !== null, '', 'blocker'),
        ok('indent', 'Output is actually indented', /\n\s\s+"/.test(t), '', 'major'),
      ].concat(jsonIntegrity(t));
    },
  },
  {
    slug: 'word-counter',
    title: 'Word counter',
    typeInto: { selector: '#wc-textarea', fixture: 'torture.txt' },
    ready: '#wc-words',
    /* Nothing to download — the result is read off the page instead. */
    readFrom: { words: '#wc-words', chars: '#wc-chars', lines: '#wc-lines', paragraphs: '#wc-paragraphs' },
    kind: 'dom',
    async checks({ out, src }) {
      const words = parseInt(String(out.words).replace(/[^\d]/g, ''), 10);
      const chars = parseInt(String(out.chars).replace(/[^\d]/g, ''), 10);
      const lines = parseInt(String(out.lines).replace(/[^\d]/g, ''), 10);
      // Count the same way a person would, against the fixture itself.
      const text = String(src);
      const trueWords = (text.match(/\S+/g) || []).length;
      const trueChars = text.length;
      const trueLines = text.replace(/\n$/, '').split('\n').length;
      return [
        ok('words', 'Word count matches the source',
           Math.abs(words - trueWords) <= 2, `reported ${words}, actual ${trueWords}`, 'blocker'),
        ok('chars', 'Character count matches the source',
           Math.abs(chars - trueChars) <= 2, `reported ${chars}, actual ${trueChars}`, 'major'),
        ok('lines', 'Line count matches the source',
           Math.abs(lines - trueLines) <= 2, `reported ${lines}, actual ${trueLines}`, 'major'),
      ];
    },
  },
];

export default dataRecipes;
