# pdf-to-docx conversion tests

Verifies `src/scripts/pdf-to-docx.js` (the PDF to Word converter core) outside
the browser, using the same pdf.js version the site loads from the CDN.

One-time setup (deps are intentionally not in package.json):

```
npm i --no-save pdfjs-dist@3.4.120 jszip
```

Run:

```
node scripts/tests/pdf-to-docx/test-convert.mjs
node scripts/tests/pdf-to-docx/convert-real.mjs path\to\any.pdf
node scripts/tests/pdf-to-docx/test-figures.mjs path\to\diagrams.pdf
```

- `test-convert.mjs` builds a synthetic PDF (bold title, wrapped paragraphs,
  3-column table, two pages) and asserts the docx output: real `<w:tbl>`,
  bold runs, heading size, page break, paragraph merging. Exits non-zero on
  failure.
- `convert-real.mjs` converts any real PDF and lints the XML for everything
  Microsoft Word hard-rejects: duplicate attributes, invalid characters,
  unpaired surrogates, and out-of-order `pPr`/`rPr`/`tblPr` children
  (OOXML requires a fixed child sequence). Writes `<name>-converted.docx`
  next to the input — open it in Word as the final check.
- `test-figures.mjs` runs the figure pipeline on a PDF that contains diagrams:
  detects the figure regions, drops their stray label text, and packages an
  inline image per region (a small stand-in PNG, since Node has no browser
  canvas to rasterize with). Asserts one drawing + media part + relationship
  per region and re-runs the duplicate-attribute lint. In the browser the real
  page pixels are rendered into those images by `PdfToWord.astro`.

History: the first release of the converter produced `<w:ind>` with two
`w:left` attributes (malformed XML) and mis-ordered `pPr`/`tblPr` children;
Word refused those files outright. These scripts exist so that class of bug
cannot ship again.
