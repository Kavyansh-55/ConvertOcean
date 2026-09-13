/**
 * Post-deploy verification: does the live site actually serve the fixed code?
 *
 * Two traps are baked into the shape of these checks, both hit for real:
 *
 *  - The first check looks for `decoration: null` followed by a comma or brace,
 *    i.e. an actual object property. An earlier version searched for the bare
 *    string and matched the source comment explaining why the property was
 *    removed. A check that greps for a token will happily match the note
 *    saying the token is gone.
 *
 *  - Astro splits an imported module into its own chunk, so the entry bundle
 *    for a page contains an import, not the logic. Follow the import. And match
 *    on runtime strings — URLs, format codes, constants — because comments are
 *    stripped and identifiers are minified, so grepping for a function name
 *    finds nothing even when the code is right there.
 *
 *   node scripts/fidelity/_live.mjs
 */
const ORIGIN = 'https://convertocean.com';
const bust = () => '?v=' + Date.now() + Math.random().toString(36).slice(2);

async function get(path) {
  const r = await fetch(ORIGIN + path + bust(), { signal: AbortSignal.timeout(25000) });
  return { status: r.status, body: await r.text() };
}

let bad = 0;
const say = (ok, msg) => { if (!ok) bad++; console.log(`${ok ? 'OK  ' : 'FAIL'}  ${msg}`); };

/* ------------------------------------------------- inline-script fixes */

const wp = await get('/word-to-pdf/');
say(!/decoration:\s*null\s*[,}]/.test(wp.body),
    'word-to-pdf: the pdfmake hang property is gone from the code');
/* The watchdog used to sit in an inline script and is now inside the bundled
   module, so it is asserted with the other bundle contents below rather than
   in the page HTML. */

const wd = await get('/word-to-pdf/');
say(!/mammoth/.test(wd.body), 'word-to-pdf: the mammoth pipeline is gone');
say(/WordTool.astro_astro_type_script/.test(wd.body), 'word-to-pdf: serves its bundled DOCX reader');
say(/jszip/i.test(wd.body), 'word-to-pdf: loads JSZip to read the package');

const mw = await get('/merge-word/');
say(/childNodes\)[\s\S]{0,120}w:sectPr/.test(mw.body),
    'merge-word: sectPr is looked up as a direct child');

/* PptxTool and MergePptx keep inline scripts, so their code sits in the page
   HTML rather than in an /_astro bundle — checked here, not below. */
const pp = await get('/pptx-to-pdf/');
say(/EXPORT_W\s*=\s*2600/.test(pp.body), 'pptx-to-pdf: exports at print resolution');
say(/renderingMode: 'invisible'/.test(pp.body), 'pptx-to-pdf: writes an invisible text layer');
say(/notesSlide/.test(pp.body), 'pptx-to-pdf: reads speaker notes');

const mp = await get('/merge-pptx/');
say(/addOverride|copiedPartIndex/.test(mp.body),
    'merge-pptx: copies the parts its slides reference');

/* ------------------------------------------------- bundled modules load */

for (const [path, token] of [
  ['/csv-to-xlsx/', 'SpreadsheetTool.astro_astro_type_script'],
  ['/xml-to-csv/', 'SpreadsheetTool.astro_astro_type_script'],
  ['/json-to-csv/', 'SpreadsheetTool.astro_astro_type_script'],
  ['/txt-to-pdf/', 'TxtToPdf.astro_astro_type_script'],
  ['/csv-to-pdf/', 'ExcelToPdf.astro_astro_type_script'],
  ['/pdf-to-excel/', 'PdfToExcel.astro_astro_type_script'],
]) {
  const r = await get(path);
  say(r.status === 200 && r.body.includes(token), `${path} serves its bundled module (${r.status})`);
}

/* ------------------------------------------ bundles carry the new logic */

const bundles = [
  ['/txt-to-pdf/', /TxtToPdf[^"']+\.js/, /noto-fonts|NotoSans/, 'Noto font loader'],
  ['/csv-to-xlsx/', /SpreadsheetTool[^"']+\.js/, /1899|yyyy-mm-dd/, 'tabular core'],
  ['/pdf-to-excel/', /PdfToExcel[^"']+\.js/, /yyyy-mm-dd|#,##0/, 'numeric typing'],
  ['/word-to-pdf/', /WordTool[^"']+\.js/, /NotoSerif|pgSz|sectPr/, 'DOCX reader'],
  ['/word-to-pdf/', /WordTool[^"']+\.js/, /setTimeout/, 'async layout watchdog'],
  ['/excel-to-pdf/', /ExcelToPdf[^"']+\.js/, /styles\.xml|fillId/, 'xlsx styles reader'],
  ['/split-excel/', /SplitExcel[^"']+\.js/, /calcChain|workbook\.xml\.rels/, 'package-surgery splitter'],
  /* Batch 4. Without these two the file verified batch 3 and quietly said
     nothing about what shipped after it. */
  ['/merge-excel/', /MergeExcel[^"']+\.js/, /cellXfs/, 'style-table merger'],
  ['/pdf-to-word/', /PdfToWord[^"']+\.js/, /setFillRGBColor/, 'text-colour tracking'],
];

for (const [page, findJs, needle, label] of bundles) {
  const html = (await get(page)).body;
  const m = html.match(findJs);
  if (!m) { say(false, `${page} bundle reference not found`); continue; }

  let js = (await get('/_astro/' + m[0].split('/').pop())).body;
  if (!needle.test(js)) {
    /* Follow every import, not the first one. pdf-to-excel pulls in both the
       PDF line reconstruction and the tabular core, and checking only the
       first chunk reported a miss for code that was present in the second. */
    for (const dep of js.matchAll(/from"\.\/([^"]+\.js)"/g)) {
      js += (await get('/_astro/' + dep[1])).body;
      if (needle.test(js)) break;
    }
  }
  say(needle.test(js), `${page} bundle contains the ${label}`);
}

/* ------------------------------------------------------- batch 5: compress */

/* Without these, this file would verify batch 4 and say nothing at all about
   what actually shipped this time. */
const cp = await get('/compress-pdf/');
say(cp.status === 200, `/compress-pdf/ is served (${cp.status})`);
say((cp.body.match(/<h1/g) || []).length === 1, '/compress-pdf/ has exactly one h1');
say(/rel="canonical"[^>]*convertocean\.com\/compress-pdf\//.test(cp.body),
    '/compress-pdf/ self-canonicalises');
say(/FAQPage/.test(cp.body), '/compress-pdf/ carries FAQPage schema');
say(/pdf-lib/.test(cp.body) && /pdf\.min\.js/.test(cp.body),
    '/compress-pdf/ loads both pdf-lib and pdf.js');
say(/cmpDownload/.test(cp.body), '/compress-pdf/ renders the compressor workspace');

/* The engine is an imported module, so it lives in its own chunk. Match on
   runtime strings: identifiers are minified and comments are stripped. */
{
  const refs = [...cp.body.matchAll(/\/_astro\/([^"']+\.js)/g)].map((m) => m[1]);
  let js = '';
  for (const r of refs.slice(0, 12)) js += (await get('/_astro/' + r)).body;
  for (const dep of js.matchAll(/from"\.\/([^"]+\.js)"/g)) js += (await get('/_astro/' + dep[1])).body;
  say(/DCTDecode/.test(js), '/compress-pdf/ bundle contains the image-stream decoder');
  say(/already at the target resolution/.test(js),
      '/compress-pdf/ bundle contains the leave-it-alone rule');
  say(/ImageMask/.test(js), '/compress-pdf/ bundle contains the stencil-mask skip');
}

/* --------------------------------------- the scoped-CSS fix actually shipped */

/* The entire point of that fix is that these selectors are no longer scoped to
   an attribute the runtime element never carries. Asserting the absence of the
   attribute form is the only way to see it from outside the browser. */
for (const [page, cls] of [
  ['/split-pdf/', 'page-thumb-card'],
  ['/exif-viewer/', 'xf-stat'],
  ['/split-excel/', 'sheet-card'],
  ['/ofx-to-csv/', 'bft-stat'],
]) {
  const html = (await get(page)).body;
  let css = html;
  for (const m of html.matchAll(/\/_astro\/([^"']+\.css)/g)) {
    css += (await get('/_astro/' + m[1])).body;
  }
  /* Plain string matching, not a generated regex: an escaping slip made the
     first live run throw "Range out of order in character class", because
     `[data-astro-cid` parsed as a character class. Nothing here needed a
     regex in the first place. */
  const scoped = css.includes('.' + cls + '[data-astro-cid');
  const present = css.includes('.' + cls);
  say(present && !scoped,
      `${page} serves .${cls} unscoped, so it reaches the runtime element`);
}

/* ------------------------------------- the client-library security batch */

/* None of this is visible in a passing suite run: the suites prove the repo
   is right, and these prove the deploy is. The vendored fallback in
   particular is a file that only ever loads when a CDN is down, so nothing a
   reader does would reveal that it 404s. */

/* pdf.js CVE-2024-4367 — every getDocument() must disable eval. Matched on
   the runtime property, which survives minification because it is a string
   key in an options object; the surrounding identifiers do not. */
for (const [page, where] of [
  ['/pdf-to-txt/', 'inline'],
  ['/split-pdf/', 'inline'],
  ['/compress-pdf/', 'inline'],
  ['/pdf-to-word/', 'bundle'],
  ['/pdf-to-excel/', 'bundle'],
]) {
  const html = (await get(page)).body;
  let js = html;
  if (where === 'bundle') {
    for (const m of html.matchAll(/\/_astro\/([^"']+\.js)/g)) {
      js += (await get('/_astro/' + m[1])).body;
    }
  }
  const calls = (js.match(/getDocument\(/g) || []).length;
  const guarded = /isEvalSupported\s*:\s*!1|isEvalSupported\s*:\s*false/.test(js);
  say(calls > 0 && guarded,
      `${page} disables pdf.js eval (${calls} getDocument call(s) in the ${where})`);
}

/* The patched SheetJS build, and no npm-hosted one anywhere. npm's xlsx is
   frozen at a vulnerable 0.18.5, and jsdelivr/cdnjs still answer 200 for it,
   so the wrong URL fails silently rather than loudly. */
for (const page of ['/excel-to-pdf/', '/merge-excel/', '/split-excel/', '/ofx-to-csv/']) {
  const html = (await get(page)).body;
  let all = html;
  for (const m of html.matchAll(/\/_astro\/([^"']+\.js)/g)) {
    all += (await get('/_astro/' + m[1])).body;
  }
  say(!all.includes('xlsx@0.18.5') && !all.includes('/xlsx/0.18.5/'),
      `${page} references no npm-hosted xlsx 0.18.5`);
}

{
  const r = await fetch(ORIGIN + '/vendor/xlsx.full.min.js' + bust(),
                        { signal: AbortSignal.timeout(25000) });
  const body = await r.arrayBuffer();
  say(r.status === 200 && body.byteLength === 951904,
      `the self-hosted xlsx fallback serves 200 at 951,904 bytes `
      + `(got ${r.status}, ${body.byteLength})`);
  /* A byte count alone would pass on an HTML error page of a freak length,
     and a CRLF-mangled copy would still parse and still define XLSX. */
  const head = new TextDecoder().decode(body.slice(0, 200));
  say(head.includes('SheetJS') && new TextDecoder().decode(body).includes('0.20.3'),
      'the served fallback is the SheetJS 0.20.3 build');
}

/* ------------------------------------------- the office compressors */

for (const [path, accept, kind] of [
  ['/compress-powerpoint/', '.pptx', 'PowerPoint'],
  ['/compress-word/', '.docx', 'Word'],
]) {
  const r = await get(path);
  say(r.status === 200, `${path} is served (${r.status})`);
  const html = r.body;
  /* Gated on the 200: the 404 page also has exactly one h1, so an ungated
     check reports OK for a page that is not there — a passing line that means
     the opposite of what it says. */
  say(r.status === 200 && (html.match(/<h1/g) || []).length === 1,
      `${path} has exactly one h1`);
  say(html.includes(`rel="canonical" href="https://convertocean.com${path}"`),
      `${path} self-canonicalises`);
  say(html.includes('FAQPage'), `${path} carries FAQPage schema`);
  say(html.includes(`accept="${accept}"`), `${path} accepts ${accept}`);
  say(html.includes('jszip.min.js'), `${path} loads the archive reader`);

  /* The engine is bundled, not inline, so it is asserted through the bundle
     the page actually pulls — matching on runtime strings, since identifiers
     are minified away. */
  let bundles = '';
  for (const m of html.matchAll(/\/_astro\/([^"']+\.js)/g)) {
    bundles += (await get('/_astro/' + m[1])).body;
  }
  /* A string literal, not a fragment of a regex. The first version of this
     check looked for `media/` and failed against a correct deploy, because
     the matcher is a regex and ships as `media\/[^/]+\.(png|jpe?g` with the
     slash escaped. This file's own header says to match runtime strings for
     exactly this reason, and the check ignored it. */
  say(bundles.includes('the image header could not be read'),
      `${path} bundle contains the OOXML image engine`);
  say(/transparent areas/.test(bundles),
      `${path} bundle carries the transparency guard — the one the fixture proved was needed`);
  say(bundles.includes('[Content_Types].xml'),
      `${path} bundle declares content types for renamed parts`);

  /* Target-size mode exists because 145 of the 1,155 queries harvested for
     these tools name a specific size — "compress ppt below 10mb", "compress
     docx to 1mb". The page copy now promises it, so the control and the
     engine behind it both have to actually be served. */
  say(html.includes('id="cofFit"'), `${path} serves the fit-to-a-size control`);
  say(html.includes('Or fit a size'), `${path} offers the target-size mode in words`);
  /* Deliberately a phrase the PDF engine does not also use: the first version
     of this check looked for 'Fitting to your target', which ships in the same
     bundle from pdf-compress.js, so it passed before the office target mode
     existed at all. */
  say(bundles.includes('Fitting your document to that size'),
      `${path} bundle contains the target-size search`);
}

/* ------------------------------------------------------ split-pdf modes */

/* "split pdf into pages" / "separate files", "split pdf into 2 parts" and
   "split pdf by size" are the dominant capability modifiers on the term, and
   the tool could do none of them: it only ever produced one PDF of the pages
   you picked. Each string below is checked to be one the previous deploy did
   not already serve — the failure mode this file has hit twice. */
{
  const { body: html } = await get('/split-pdf/');
  say(html.includes('name="splitMode"'), '/split-pdf/ serves the output-mode selector');
  say(html.includes('A separate PDF for every page'), '/split-pdf/ offers a file per page, in words');
  say(html.includes('equal parts'), '/split-pdf/ offers the equal-parts mode, in words');
  say(html.includes('id="partSize"'), '/split-pdf/ serves the size-limit field');
  say(html.includes('aria-label="Maximum size of each part, in MB"'),
      '/split-pdf/ names the size field for a screen reader');

  /* The engine, not just the controls. A page can render four radio buttons
     and still be wired to the old single-output code path. `jszip` only ever
     loads on this page because a mode now returns more than one file, and the
     oversize sentence exists nowhere else on the site. */
  say(/jszip/i.test(html), '/split-pdf/ loads JSZip, which only the multi-file modes need');
  say(html.includes('is larger than '), '/split-pdf/ carries the honest oversize message');

  /* Copy and schema, which are the AEO surface. */
  say(html.includes('Into Separate Files, Parts or Pages'), '/split-pdf/ serves the rewritten title');
  say(html.includes('Can I split a PDF into 2 equal parts'), '/split-pdf/ answers the equal-parts question');
  say(html.includes('Can I split a PDF by file size'), '/split-pdf/ answers the by-size question');
}

/* -------------------------------------------- compressHTML: 'jsx' spaces */

/* The whitespace flip removed the space around inline elements. Four places
   depended on a line break for a space between two words, and shipped with the
   words run together. These assert the repaired text, so they fail on a build
   that regresses it — including on the build that was live before this one. */
{
  const { body: privacy } = await get('/privacy/');
  say(privacy.includes('public at <a'), '/privacy/ keeps the space before the repo link');
  say(privacy.includes("Google's own <a"), '/privacy/ keeps the space before the opt-out link');
  say(privacy.includes('described in <a'), '/privacy/ keeps the space before the Google policy link');

  /* This one passes against the previous deploy too, and that is the point
     rather than an oversight: `compressHTML: true` collapsed the newline to a
     single space, and the repair puts the same single space back. It cannot
     prove the new build shipped — the twelve above do that — but it is the
     check that fails if the space is ever lost again. Labelled so nobody reads
     a green line here as evidence of this deploy. */
  const { body: vs } = await get('/vs/sejda/');
  say(/HOME<\/a> <span/.test(vs), '/vs/ breadcrumbs keep the space around the separator (an invariant, not new)');

  const { body: exif } = await get('/exif-remover/');
  say(exif.includes('rotation flag <span'), '/exif-remover/ keeps the space before its hint');
}

/* ------------------------------------------- the mobile-reveal CSS fixes */

/* Every one of these was found only after `npm run mobile` started opening a
   tool's workspace with a real file instead of measuring an empty drop zone.
   They live in CSS rather than in page text, so the stylesheet is what has to
   be fetched — and its filename is content-hashed, so it is discovered from
   the page rather than hard-coded. */
async function stylesheetsFor(path) {
  const { body } = await get(path);
  const hrefs = [...body.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((h) => h.startsWith('/'));
  const sheets = await Promise.all(hrefs.map((h) => get(h)));
  return { html: body, css: sheets.map((s) => s.body).join('\n') };
}

{
  const { css } = await stylesheetsFor('/merge-pdf/');

  say(/\.icon-btn\{[^}]*min-width:44px/.test(css),
      'the remove-file button is a 44px tap target, not an 11px one');
  say(/\.icon-btn\{[^}]*touch-action:manipulation/.test(css),
      'and it does not wait for a double-tap');
  say(css.includes('.button-group{flex-wrap:wrap}'),
      'button groups wrap instead of pushing the page sideways');
  say(/\.preview-table th\{[^}]*font-size:12px/.test(css),
      'preview table headers are at the 12px floor');
  say(/\.preview-table th\{[^}]*letter-spacing:normal/.test(css),
      'and no longer carry the page\'s negative tracking into uppercase');

  /* The accessible name on the control itself. "✕" alone is announced as
     "times", or as nothing at all.

     Two traps, both hit writing this. The PowerPoint merger is /merge-pptx/,
     not /merge-powerpoint/ — a check pointed at a URL that 404s fails and
     looks exactly like a missing feature. And three of these four write the
     button from an inline script while MergeExcel's is bundled into its own
     chunk, which is the trap this file's header warns about: follow the
     import. */
  for (const slug of ['merge-pdf', 'merge-word', 'merge-excel', 'merge-pptx']) {
    const { status, body } = await get('/' + slug + '/');
    let found = status === 200 && body.includes('aria-label="Remove ');
    if (!found && status === 200) {
      for (const src of [...body.matchAll(/src="(\/_astro\/Merge[^"]+\.js)"/g)].map((m) => m[1])) {
        const chunk = await get(src);
        if (chunk.body.includes('aria-label="Remove ')) { found = true; break; }
      }
    }
    say(found, `/${slug}/ names its remove-file button for a screen reader`
        + (status === 200 ? '' : ` (page returned ${status})`));
  }
}

{
  /* /image-to-text/ scrolled the whole page sideways at 320 and 360. The fix
     is a grid track that is allowed to shrink. */
  const { css } = await stylesheetsFor('/image-to-text/');
  /* Scoped to this component's own rule. The first version of this check
     looked for `minmax(0,1fr)` anywhere in the stylesheet and passed against
     the deploy that still had the bug — six other components were already
     using it. Eleventh time this cycle a check was green for the wrong
     reason, and the second time it was this exact mistake. */
  say(/\.workspace-grid\[[^\]]+\]\{[^}]*grid-template-columns:minmax\(0,1fr\) minmax\(0,1fr\)/.test(css),
      '/image-to-text/ grid tracks can shrink below their content');
}

/* ------------------------------------------------------- /compress-excel/ */

/* The fourth compressor, and the only one whose saving does not come from
   images. Each string below was checked to be one the previous deploy did not
   serve — the trap this file has now hit three times. */
{
  const { status, body: html } = await get('/compress-excel/');
  say(status === 200, `/compress-excel/ is served (${status})`);
  say(html.includes('accept=".xlsx"'), '/compress-excel/ takes .xlsx');
  say(html.includes('id="cofTrim"'), '/compress-excel/ serves the trim switch');

  /* The disclosure is the reason this tool can be shipped at all: it is the
     one compressor here that does not hand the file back byte-for-byte. If
     this sentence ever stops being served, the page is making a promise the
     engine does not keep. */
  say(html.includes('no longer inherit the fill'),
      '/compress-excel/ states the trade on the page, not in a footnote');
  say(html.includes('turn this off'), 'and tells the reader how to decline it');

  /* Copy written from the real question form: "why is my excel file so large"
     is 73 of the 483 queries harvested for this page. */
  say(html.includes('Why a Spreadsheet With 200 Rows Can Be 15 Megabytes'),
      '/compress-excel/ answers the question people actually type');
  say(html.includes('Is compressing an Excel file lossless'),
      '/compress-excel/ answers the lossless question in its FAQ');
  say(html.includes('pivot cache') || html.includes('Pivot caches'),
      '/compress-excel/ names what it cannot fix as well as what it can');

  /* The engine, not just the page. `coCompressXlsx` is published from the
     tool layout's module, and a string only this engine puts in the bundle
     proves the used-range logic shipped rather than a page wired to the old
     image-only engine. */
  const bundles = (await Promise.all(
    [...html.matchAll(/src="(\/_astro\/[^"]+\.js)"/g)].map((m) => get(m[1]))
  )).map((r) => r.body).join('\n');
  say(/coCompressXlsx/.test(bundles), '/compress-excel/ publishes the workbook engine');
  /* These two live in the component's `is:inline` script, which Astro writes
     into the page rather than into a chunk — so they are asserted against the
     HTML. Looking for them in the bundles failed against a correct deploy,
     which is the same mistake this file's header warns about, made in the
     opposite direction: follow the import, but only when there is one. */
  say(html.includes('past the end of your data'),
      'and the page carries the used-range report, so the trim really shipped');
  say(html.includes('calculation cache'),
      'and the calculation-cache removal with it');

  /* The link surface, hand-maintained and wrong once before. */
  const home = (await get('/')).body;
  say(home.includes('/compress-excel/'), 'the footer links to /compress-excel/ from the homepage');
  const xml = (await get('/sitemap.xml')).body;
  say(xml.includes('/compress-excel/'), '/compress-excel/ is in the XML sitemap');
  const cat = (await get('/excel-converter/')).body;
  say(cat.includes('/compress-excel/'), 'and its category page lists it');
}

/* ------------------------------- /compress-pdf/ controls, reported by a reader */

/* All three of these were live for as long as the tool has existed. The tool's
   own script is `is:inline`, so it ships in the page rather than in a chunk —
   asserted against the HTML, which is the mistake made in the other direction
   one batch ago. */
{
  const { body: html } = await get('/compress-pdf/');

  /* The dead button. Selecting the "Fit a size" preset and pressing "Fit to
     this size" both called run('target'), and the early return meant for the
     first swallowed the second, so the button never reached the engine on any
     press. The explicit second argument is the fix. */
  say(html.includes("run('target', true)"),
      '/compress-pdf/ "Fit to this size" actually asks for a compression');

  /* Three identical preset sizes with no reason given. */
  say(html.includes('make no difference to this file'),
      '/compress-pdf/ explains when the settings cannot change a file');

  /* The comparison, which was 1,347px of a 6,255px page and open by default. */
  say(html.includes('compare the pages before and after'),
      '/compress-pdf/ collapses the before/after comparison behind a summary');
  say(/<details[^>]*class="cmp-compare"/.test(html),
      'and it really is a <details>, not a panel that is always open');

  /* Two callers can now start a render, and pdf.js refuses two draws on one
     canvas, so they are serialised — and the catch that hides the panel
     records the error instead of swallowing it. */
  say(html.includes('renderChain'), '/compress-pdf/ serialises its preview renders');
  say(html.includes('__cmpRenderError'),
      'and a preview that fails to render says so instead of vanishing quietly');
}

/* The link surface, which is hand-maintained and was already wrong once:
   /compress-pdf/ shipped without ever being added to the footer. */
{
  const home = (await get('/')).body;
  for (const slug of ['compress-pdf', 'compress-powerpoint', 'compress-word']) {
    say(home.includes(`/${slug}/`), `the footer links to /${slug}/ from the homepage`);
  }
  const xml = (await get('/sitemap.xml')).body;
  say(xml.includes('/compress-powerpoint/') && xml.includes('/compress-word/'),
      'both compressors are in the XML sitemap');
}

console.log(bad ? `\n${bad} check(s) failed` : '\nall live checks passed');
process.exit(bad ? 1 : 0);
