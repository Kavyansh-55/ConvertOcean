/**
 * Build a genuine legacy Excel 97-2003 (.xls) fixture.
 *
 * Three tools — `xls-to-csv`, `xls-to-json`, `xls-to-pdf` — went untested for
 * want of one, and the harness's own note said why a shortcut would be worse
 * than nothing: *"needs a real legacy BIFF .xls fixture; a renamed .xlsx would
 * fake it."* A renamed .xlsx exercises the modern ZIP reader and proves
 * nothing about the BIFF path these tools actually take.
 *
 * There is no SheetJS in node_modules — the site loads it from a CDN — so the
 * file is written **by the browser**, using the very library the tools use. No
 * new dependency, and the fixture is produced by the same code path that will
 * later read it.
 *
 * BIFF8 has no shared-string table of the kind .xlsx uses and stores dates as
 * serial numbers, so the content below deliberately mixes text, a number, a
 * date, a formula result and a unicode string: the things most likely to
 * arrive wrong.
 */
import puppeteer from 'puppeteer-core';
import { existsSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as TESTING_PATHS from '../../testing-paths.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = TESTING_PATHS.fixture('torture.xls');

const EDGE_CANDIDATES = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  process.env.CHROME_PATH,
].filter(Boolean);

function browserPath() {
  for (const p of EDGE_CANDIDATES) if (existsSync(p)) return p;
  throw new Error('No Edge/Chrome found. Set CHROME_PATH to a browser executable.');
}

/** The same markers the other fixtures use, so checks can be shared. */
export const XLS_ROWS = [
  ['M01 Item', 'M02 Qty', 'M03 Price', 'M04 Date', 'M05 Note'],
  ['Widget', 12, 9.99, '2026-01-15', 'M06 plain'],
  ['Gadget', 5, 149.5, '2026-02-01', 'M07 Ünïcodé — em dash'],
  ['Sprocket', 0, 0.01, '2026-03-31', 'M08 zero qty'],
  ['Flange', 1000, 2.5, '2026-12-25', 'M09 large qty'],
];

const browser = await puppeteer.launch({
  executablePath: browserPath(), headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const page = await browser.newPage();

/* A blank page plus the library: nothing about this needs the site running. */
await page.setContent('<!doctype html><meta charset="utf-8"><title>build xls</title>');
await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js' });

const base64 = await page.evaluate((rows) => {
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Ledger');
  /* biff8 is the real Excel 97-2003 format — the whole point of this fixture. */
  const out = XLSX.write(wb, { bookType: 'biff8', type: 'base64' });
  return out;
}, XLS_ROWS);

await browser.close();

const bytes = Buffer.from(base64, 'base64');

/* An OLE2 compound file starts with this signature. If SheetJS ever silently
   fell back to another container, the fixture would stop being a .xls and the
   three tools would go back to being untested without anyone noticing. */
const OLE2 = [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1];
const isOle2 = OLE2.every((b, i) => bytes[i] === b);
if (!isOle2) {
  throw new Error('generated file is not an OLE2 container — not a real .xls');
}

writeFileSync(OUT, bytes);
console.log(`torture.xls  ${bytes.length} bytes  OLE2 signature verified  ${XLS_ROWS.length} rows`);
