# Fidelity harness

Measures whether a converted file still looks like the file that went in.

The tools are all client-side, so "did the formatting survive" can only be
answered by running the real page in a real browser with a real file and
reading the bytes the user would have downloaded. That is what this does.

```bash
npm run fidelity                       # rebuild fixtures, run every recipe
node scripts/fidelity/run.mjs word-to-pdf excel-to-pdf
node scripts/fidelity/run.mjs --headful    # watch it happen
```

It starts `astro dev` itself if nothing is listening on :4321, and leaves an
already-running server alone. Exit code is 1 when any **blocker** check fails.

## What it produces

- `out/<tool>.<ext>` — the actual converted file, openable in Word/Excel/a PDF
  reader. When a check fails, open the file: the harness tells you *what* broke,
  the file shows you *how bad it looks*.
- `out/report.json` — every check with pass/fail, weight and detail.

## Layout

| Path | Purpose |
|---|---|
| `fixtures/build-*.mjs` | Build the torture files, as hand-written OOXML / PDF |
| `../testing-paths.mjs` | The one place that knows where artifacts go |
| `testing/fixtures/` | Generated fixtures (gitignored, repo root) |
| `testing/out/` | Converted output + `report.json` (gitignored, repo root) |
| `lib/ooxml.mjs` | Zip packaging + strict XML validation of every part |
| `lib/png.mjs` | Dependency-free PNG encoder for the marker image |
| `lib/inspect.mjs` | Readers for produced PDF / DOCX / XLSX / ZIP output |
| `recipes/` | Per-tool: what to feed it, and what counts as faithful — split by family (documents, data, images, mergesplit) with `index.mjs` also listing what is deliberately **not** covered |
| `lib/exif.mjs` | EXIF writer, so the JPEG fixture carries real metadata |
| `run.mjs` | The browser driver and reporter |

## The fixtures

Each fixture plants numbered markers (`M01`, `M02`, …) on the features that
matter, so a failure names the feature rather than a diff. They are built from
raw markup rather than through a library, so the fixture states exactly what it
means — when a converter drops shading, the test can point at the `w:shd`
element it ignored. Every XML part is parsed in strict mode at build time; a
fixture that would not open in Word is a build error, not a test failure.

- **torture.docx** — Georgia and Courier runs at named sizes, colour, highlight,
  all four alignments, hanging indent, numbered + bulleted lists, a table with
  navy header shading and a merged cell, an inline image, a page break, a
  running header, a footer with a real `PAGE` field, and a landscape final
  section.
- **torture.xlsx** — three sheets: navy header band, borders, merged title,
  currency / date / percent / red-negative number formats, explicit column
  widths, a frozen pane, a `SUM` formula; a 15-column sheet; an unstyled control.
- **torture.pptx** — custom theme (teal/magenta, nothing near Office defaults),
  gradient background, theme-coloured runs, bullets at three sizes, a picture,
  a rotated text box, a real table, and speaker notes.
- **torture.pdf** — coloured heading, four fonts, a ruled table with
  right-aligned currency at known x-positions, and a two-column page whose
  columns share baselines.

## How output is captured

`run.mjs` patches two browser built-ins before any page script runs:
`URL.createObjectURL` (to keep a url → Blob map) and both
`HTMLAnchorElement.prototype.click` and `EventTarget.prototype.dispatchEvent`
(to catch the download and swallow it).

Both interception points are needed. Most tools reach the user through
`window.downloadBlob`, which clicks an anchor — but jsPDF's `save()` builds a
`MouseEvent` and dispatches it instead, which walks straight past a `.click()`
patch. Every canvas-based exporter on the site uses that path, so without the
dispatch hook those tools look like they produce nothing at all.

Patching the built-ins rather than the site's own helpers means the harness
keeps working when a tool changes how it saves.

## Recipe shapes

Most tools drop a file then download. Four variations exist:

- `fixture: ['a.docx', 'b.docx']` — several files at once, for merge tools.
  Use *differently named* copies: some merge tools de-duplicate by filename,
  and uploading the same fixture twice leaves the Merge button disabled.
- `pre: ['#btnSelectAllPages']` — clicks needed between ingest and export
  (select pages, press Format, press Apply). An entry may also be
  `{ select: '#splitMode', value: 'paragraphs' }` to choose a mode.
- `typeInto: { selector, fixture }` — for tools with no file input at all.
- `kind: 'dom'` with `readFrom: {...}` — for tools whose result is rendered on
  the page rather than downloaded.

`optional: true` makes a missing fixture a SKIP rather than a failure.

## Adding a tool

Add a recipe. `ready` is the selector that appears once the file is ingested,
`download` is the button that produces the file, `kind` picks the inspector.

```js
{
  slug: 'merge-word',
  title: 'Merge Word',
  fixture: 'torture.docx',
  ready: '#actionControls',
  download: '#btnDownload',
  outName: 'merge-word.docx',
  kind: 'docx',
  async checks({ out, src }) {
    return [ ok('id', 'human-readable claim', <boolean>, '<detail>', 'major') ];
  },
}
```

Element ids vary between tools — check the component before assuming
`#btnDownload`. Weight a check `blocker` when failing it makes the output
unusable, `major` when the document visibly stopped looking like itself, and
`minor` for a detail a careful user would still notice.

## Writing checks that mean something

Two of the first checks written here passed while the underlying feature was
demonstrably broken, which is worth remembering:

- *"Header band is visually distinct"* passed because autoTable paints its own
  grey chrome on every table. It now looks for the workbook's specific navy
  (`1F4E79`) in the PDF's fill operators.
- *"Number formats survive"* passed because SheetJS writes a default format
  table on every save. It now checks that the source's own four format codes
  came through.

And two more failed while the tool was doing exactly the right thing, which is
the same mistake pointing the other way:

- *"Pixel dimensions unchanged"* failed every JPG conversion. The browser bakes
  EXIF Orientation into the pixels when it draws to canvas, so a 240×160 source
  tagged "rotate 90°" correctly becomes 160×240. It now expects the swap.
- *"EXIF segment is actually gone"* called exif-remover a blocker. The tool
  keeps Orientation on purpose so the photo does not flip, and strips
  everything sensitive. It now asserts on the sensitive tags only.

A check that asks "is there any formatting" will almost always pass; a check
that assumes bytes must be identical will fail correct work. Ask whether *the
source's* formatting arrived, and know what the right answer looks like before
calling a difference a defect.
