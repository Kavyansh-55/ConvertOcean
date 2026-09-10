/**
 * diagnoseSpreadsheet — the message a reader gets when a workbook won't open.
 *
 * The rule these tests enforce: **never speak up about a file that works.**
 * The helper runs on the failure path, but several shapes it can recognise
 * (HTML tables and CSV under an .xlsx name) parse perfectly well, so a
 * confident diagnosis of a readable file would replace a working conversion
 * with an error. Returning null is the correct answer more often than not.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { diagnoseSpreadsheet } from '../../src/scripts/tabular.js';

const FIX = join(process.cwd(), 'scripts', 'fidelity', 'fixtures', 'files');
const bytes = (p) => new Uint8Array(readFileSync(p));
const fixture = (n) => bytes(join(FIX, n));

let passed = 0, failed = 0;
function check(label, cond, detail = '') {
  if (cond) { passed++; console.log('  ok   ' + label); }
  else { failed++; console.log('  FAIL ' + label + (detail ? '  — ' + detail : '')); }
}
const says = (r, ...words) => !!r && words.every((w) => r.toLowerCase().includes(w.toLowerCase()));

console.log('\nspreadsheet diagnosis\n');

/* --- silence on anything readable ------------------------------------- */
check('a real .xlsx gets no complaint',
      diagnoseSpreadsheet(fixture('torture.xlsx'), 'torture.xlsx') === null);
check('a second, differently-styled .xlsx gets no complaint',
      diagnoseSpreadsheet(fixture('torture-b.xlsx'), 'torture-b.xlsx') === null);
check('an HTML table named .xlsx stays silent (SheetJS reads it)',
      diagnoseSpreadsheet(new TextEncoder().encode(
        '<html><body><table><tr><td>a</td><td>b</td></tr></table></body></html>'), 'r.xlsx') === null);
check('a small CSV named .xlsx stays silent',
      diagnoseSpreadsheet(new TextEncoder().encode('Date,Amount\n2026-01-01,250\n'), 'r.xlsx') === null);
check('a plain CSV is not called truncated',
      diagnoseSpreadsheet(new TextEncoder().encode('a,b\n1,2\n'), 'r.csv') === null);

/* --- the cases that need different actions ---------------------------- */
const ole = (extra) => {
  const b = new Uint8Array(2048);
  [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1].forEach((v, i) => { b[i] = v; });
  if (extra) for (let i = 0; i < extra.length; i++) { b[512 + i * 2] = extra.charCodeAt(i); }
  return b;
};
check('password-protected workbook is named as such',
      says(diagnoseSpreadsheet(ole('EncryptedPackage'), 'q.xlsx'), 'password'));
check('…and tells the reader how to clear it',
      says(diagnoseSpreadsheet(ole('EncryptedPackage'), 'q.xlsx'), 'excel', 'without a password'));
check('a legacy OLE2 workbook is identified as 97-2003',
      says(diagnoseSpreadsheet(ole(null), 'q.xlsx'), '97-2003', 'save as'));
check('…and notes the misleading name when it claims to be .xlsx',
      says(diagnoseSpreadsheet(ole(null), 'q.xlsx'), 'despite the .xlsx name'));
check('…but does not say that when the name is honest',
      !says(diagnoseSpreadsheet(ole(null), 'q.xls'), 'despite'));

check('a .docx under an .xlsx name is identified',
      says(diagnoseSpreadsheet(fixture('torture.docx'), 'q.xlsx'), 'word document'));
check('a .pptx under an .xlsx name is identified',
      says(diagnoseSpreadsheet(fixture('torture.pptx'), 'q.xlsx'), 'powerpoint'));
check('a PDF under an .xlsx name is identified',
      says(diagnoseSpreadsheet(fixture('torture.pdf'), 'q.xlsx'), 'pdf', 'pdf to excel'));

const ods = new Uint8Array(4096);
ods[0] = 0x50; ods[1] = 0x4B; ods[2] = 0x03; ods[3] = 0x04;
'application/vnd.oasis.opendocument.spreadsheet'.split('').forEach((c, i) => { ods[40 + i] = c.charCodeAt(0); });
check('an OpenDocument spreadsheet is identified',
      says(diagnoseSpreadsheet(ods, 'q.xlsx'), 'opendocument'));

const zip = new Uint8Array(4096);
zip[0] = 0x50; zip[1] = 0x4B; zip[2] = 0x03; zip[3] = 0x04;
check('a ZIP with no workbook inside says so',
      says(diagnoseSpreadsheet(zip, 'q.xlsx'), 'zip archive'));

/* --- size edges -------------------------------------------------------- */
check('an empty file mentions the sync-folder cause',
      says(diagnoseSpreadsheet(new Uint8Array(0), 'q.xlsx'), 'empty', 'online-only'));
check('a tiny binary file is called truncated',
      says(diagnoseSpreadsheet(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]), 'q.xlsx'), 'truncated'));
check('missing bytes do not throw', diagnoseSpreadsheet(null, 'q.xlsx') !== undefined);

console.log(`\n  ${passed} passed, ${failed} failed\n`);
process.exit(failed ? 1 : 0);
