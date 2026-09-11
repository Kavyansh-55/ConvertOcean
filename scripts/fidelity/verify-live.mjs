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

console.log(bad ? `\n${bad} check(s) failed` : '\nall live checks passed');
process.exit(bad ? 1 : 0);
