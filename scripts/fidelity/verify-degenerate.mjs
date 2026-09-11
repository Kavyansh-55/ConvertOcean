/**
 * Files that open correctly but hold nothing.
 *
 * The failure here is not a crash — it is *silent nonsense*, which is why
 * nothing ever caught it. An empty .docx converted to a 1,088-byte PDF holding
 * one blank page. An empty .csv became two bytes: `[]`. `split-excel` and
 * `split-txt` did nothing at all and said nothing about it, so the reader
 * pressed the button and watched the page sit there.
 *
 * A blank page is worse than an error: the reader only finds out after opening
 * the file, and it reads as the tool's opinion of their document rather than as
 * an empty input. Thirteen tool paths behaved that way.
 *
 *   node scripts/fidelity/verify-degenerate.mjs
 *   CO_ORIGIN=https://convertocean.com node scripts/fidelity/verify-degenerate.mjs
 *
 * Fixtures are built here rather than committed: they are only interesting as
 * the absence of content, and generating them keeps that explicit.
 */
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import JSZip from 'jszip';

const ORIGIN = process.env.CO_ORIGIN || 'http://localhost:4321';
const LOCAL = ORIGIN.includes('localhost');
const DIR = join(process.cwd(), 'scratch', 'degenerate');

const EDGE_CANDIDATES = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  process.env.CHROME_PATH,
].filter(Boolean);

function browserPath() {
  for (const p of EDGE_CANDIDATES) if (existsSync(p)) return p;
  throw new Error('No Edge/Chrome found. Set CHROME_PATH to a browser executable.');
}

/* ---------------------------------------------------------------- fixtures */

const XMLNS_CT = 'http://schemas.openxmlformats.org/package/2006/content-types';
const XMLNS_REL = 'http://schemas.openxmlformats.org/package/2006/relationships';
const XMLNS_DOCREL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';

/** A structurally valid .xlsx whose only sheet has no rows at all. */
async function emptyXlsx() {
  const zip = new JSZip();
  zip.file('[Content_Types].xml',
    '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="' + XMLNS_CT + '">'
    + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
    + '<Default Extension="xml" ContentType="application/xml"/>'
    + '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
    + '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
    + '</Types>');
  zip.folder('_rels').file('.rels',
    '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="' + XMLNS_REL + '">'
    + '<Relationship Id="rId1" Type="' + XMLNS_DOCREL + '/officeDocument" Target="xl/workbook.xml"/></Relationships>');
  zip.folder('xl').file('workbook.xml',
    '<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
    + 'xmlns:r="' + XMLNS_DOCREL + '"><sheets><sheet name="Sheet1" sheetId="1" r:id="rId1"/></sheets></workbook>');
  zip.folder('xl').folder('_rels').file('workbook.xml.rels',
    '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="' + XMLNS_REL + '">'
    + '<Relationship Id="rId1" Type="' + XMLNS_DOCREL + '/worksheet" Target="worksheets/sheet1.xml"/></Relationships>');
  zip.folder('xl').folder('worksheets').file('sheet1.xml',
    '<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData/></worksheet>');
  writeFileSync(join(DIR, 'empty.xlsx'), await zip.generateAsync({ type: 'nodebuffer' }));
}

/** A valid .docx whose body contains nothing. */
async function emptyDocx() {
  const zip = new JSZip();
  zip.file('[Content_Types].xml',
    '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="' + XMLNS_CT + '">'
    + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
    + '<Default Extension="xml" ContentType="application/xml"/>'
    + '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
    + '</Types>');
  zip.folder('_rels').file('.rels',
    '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="' + XMLNS_REL + '">'
    + '<Relationship Id="rId1" Type="' + XMLNS_DOCREL + '/officeDocument" Target="word/document.xml"/></Relationships>');
  zip.folder('word').file('document.xml',
    '<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body/></w:document>');
  writeFileSync(join(DIR, 'empty.docx'), await zip.generateAsync({ type: 'nodebuffer' }));
}

/* page, fixture — every one of these used to be accepted */
const CASES = [
  ['/excel-to-pdf/',  'empty.xlsx'],
  ['/csv-to-pdf/',    'empty.csv'],
  ['/csv-to-json/',   'empty.csv'],
  ['/csv-to-xlsx/',   'empty.csv'],
  ['/xlsx-to-csv/',   'empty.xlsx'],
  ['/xlsx-to-json/',  'empty.xlsx'],
  ['/json-to-csv/',   'emptyarray.json'],
  ['/word-to-pdf/',   'empty.docx'],
  ['/docx-to-txt/',   'empty.docx'],
  ['/split-word/',    'empty.docx'],
  ['/merge-word/',    'empty.docx'],
  ['/split-excel/',   'empty.xlsx'],
  ['/merge-excel/',   'empty.xlsx'],
  ['/txt-to-pdf/',    'empty.txt'],
  ['/split-txt/',     'empty.txt'],
  ['/merge-txt/',     'empty.txt'],
];

async function ensureServer() {
  if (!LOCAL) return null;
  const server = spawn('npx', ['astro', 'preview', '--port', '4321'],
    { shell: true, stdio: 'ignore' });
  const deadline = Date.now() + 90000;
  while (Date.now() < deadline) {
    try {
      const r = await fetch(ORIGIN + '/', { signal: AbortSignal.timeout(3000) });
      if (r.ok) return server;
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 1000));
  }
  server.kill();
  throw new Error('preview server did not come up within 90s (run `npm run build` first)');
}

mkdirSync(DIR, { recursive: true });
await emptyXlsx();
await emptyDocx();
writeFileSync(join(DIR, 'empty.csv'), '');
writeFileSync(join(DIR, 'empty.txt'), '');
writeFileSync(join(DIR, 'emptyarray.json'), '[]');

const server = await ensureServer();
const browser = await puppeteer.launch({
  executablePath: browserPath(), headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

let bad = 0;

try {
  console.log('\ndegenerate input: ' + ORIGIN + '\n');
  console.log('  a file that opens but holds nothing — refused, or silent nonsense?\n');

  for (const [path, fixture] of CASES) {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 70)));
    try {
      await page.goto(ORIGIN + path, { waitUntil: 'networkidle2', timeout: 45000 });
      await new Promise((r) => setTimeout(r, 500));
      const input = await page.$('input[type=file]');
      if (!input) { bad++; console.log('FAIL  ' + path + ' has no file input'); await page.close(); continue; }
      await input.uploadFile(join(DIR, fixture));
      await new Promise((r) => setTimeout(r, 3000));

      const state = await page.evaluate(() => {
        const vis = (el) => el && el.offsetParent !== null;
        const err = [...document.querySelectorAll('[id*="rror" i], [class*="error" i], [role=alert]')].find(vis);
        return { error: err ? err.textContent.trim().slice(0, 80) : null };
      });

      const refused = !!state.error;
      if (!refused) bad++;
      console.log((refused ? 'OK  ' : 'FAIL') + '  ' + path.padEnd(17) + fixture.padEnd(16)
        + (refused ? 'refused' : 'ACCEPTED — would hand back an empty file')
        + (errors.length ? '  THREW: ' + errors[0] : ''));
    } catch (e) {
      bad++;
      console.log('FAIL  ' + path + ' ' + fixture + ' ' + String(e).slice(0, 50));
    }
    await page.close();
  }
} finally {
  await browser.close();
  if (server) server.kill();
  rmSync(DIR, { recursive: true, force: true });
}

console.log(bad ? '\n' + bad + ' tool(s) accepted an empty file' : '\nevery tool refused an empty file');
process.exit(bad ? 1 : 0);
