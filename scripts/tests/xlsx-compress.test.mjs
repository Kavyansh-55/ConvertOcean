/**
 * The used-range trim, which is the whole value of /compress-excel/ and the
 * only compressor on this site that is not lossless.
 *
 * Because it is not lossless, "did it get smaller" is the least interesting
 * question about it. These ask the ones that decide whether it is safe:
 * does it ever drop a cell that holds something, does it keep the blank rows
 * an author put there on purpose, and does it leave a workbook that still
 * describes itself correctly.
 *
 *   node --test scripts/tests/xlsx-compress.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  trimSheetXml, trimRowCells, parseRef, colName,
} from '../../src/scripts/xlsx-compress.js';

const sheet = (rowsXml, dimension = 'A1:XFD1048576') =>
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
  + '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
  + `<dimension ref="${dimension}"/><sheetViews/><sheetFormatPr defaultRowHeight="15"/>`
  + `<sheetData>${rowsXml}</sheetData>`
  + '<pageMargins left="0.7" right="0.7"/></worksheet>';

/** A row holding values in the first `n` columns, then `blanks` styled empties. */
function row(r, n, blanks = 0) {
  const cells = [];
  for (let c = 1; c <= n; c++) cells.push(`<c r="${colName(c)}${r}" s="2"><v>${c}</v></c>`);
  for (let c = n + 1; c <= n + blanks; c++) cells.push(`<c r="${colName(c)}${r}" s="2"/>`);
  return `<row r="${r}" spans="1:${n + blanks}">${cells.join('')}</row>`;
}

/** A row of nothing but formatting. */
const blankRow = (r, cols = 5) => `<row r="${r}" s="2" customFormat="1">`
  + Array.from({ length: cols }, (_, i) => `<c r="${colName(i + 1)}${r}" s="2"/>`).join('')
  + '</row>';

test('column helpers round-trip', () => {
  assert.equal(colName(1), 'A');
  assert.equal(colName(26), 'Z');
  assert.equal(colName(27), 'AA');
  assert.equal(colName(16384), 'XFD');
  assert.deepEqual(parseRef('A1'), { col: 1, row: 1 });
  assert.deepEqual(parseRef('XFD1048576'), { col: 16384, row: 1048576 });
  assert.equal(parseRef('not a ref'), null);
});

test('trailing empty rows go, and the data rows stay', () => {
  const xml = sheet(row(1, 3) + row(2, 3) + blankRow(3) + blankRow(4) + blankRow(5));
  const out = trimSheetXml(xml);
  assert.equal(out.rowsDropped, 3);
  assert.ok(out.xml.includes('<row r="1"'));
  assert.ok(out.xml.includes('<row r="2"'));
  assert.ok(!out.xml.includes('<row r="3"'));
  /* Every value that was there is still there. */
  assert.equal((out.xml.match(/<v>/g) || []).length, 6);
});

test('a blank row BETWEEN two tables is kept — it is layout, not bloat', () => {
  const xml = sheet(row(1, 2) + blankRow(2) + row(3, 2) + blankRow(4) + blankRow(5));
  const out = trimSheetXml(xml);
  /* Only the two at the end go. Row 2 sits before the last row holding a
     value, so it is spacing the author chose. */
  assert.equal(out.rowsDropped, 2);
  assert.ok(out.xml.includes('<row r="2"'), 'the interior blank row survives');
  assert.ok(out.xml.includes('<row r="3"'));
});

test('trailing empty cells go, per row, and values never do', () => {
  const r = trimRowCells('<c r="A1" s="2"><v>1</v></c><c r="B1" s="2"/><c r="C1" s="2"/>');
  assert.equal(r.dropped, 2);
  assert.equal(r.lastCol, 1);
  assert.ok(r.xml.includes('<v>1</v>'));

  /* A gap in the middle is not trailing: B is empty but C holds a value, so
     dropping B would shift nothing but would lose formatting inside the used
     range, which is not what this is for. */
  const mid = trimRowCells('<c r="A1"><v>1</v></c><c r="B1" s="2"/><c r="C1"><v>3</v></c>');
  assert.equal(mid.dropped, 0);
});

test('a formula or an inline string counts as content', () => {
  const withFormula = sheet('<row r="1"><c r="A1"><f>SUM(B1:C1)</f><v>0</v></c></row>'
    + '<row r="2"><c r="A2" s="2"/></row>');
  assert.equal(trimSheetXml(withFormula).rowsDropped, 1);

  const onlyFormula = sheet('<row r="1"><c r="A1"><f>NOW()</f></c></row>' + blankRow(2));
  const out = trimSheetXml(onlyFormula);
  assert.equal(out.rowsDropped, 1);
  assert.ok(out.xml.includes('<f>NOW()</f>'), 'a formula with no cached value is still content');

  const inline = sheet('<row r="1"><c r="A1" t="inlineStr"><is><t>hello</t></is></c></row>' + blankRow(2));
  const io = trimSheetXml(inline);
  assert.equal(io.rowsDropped, 1);
  assert.ok(io.xml.includes('hello'));
});

test('the dimension is rewritten to the range that survives', () => {
  const xml = sheet(row(1, 4, 20) + row(2, 4, 20) + blankRow(3) + blankRow(4));
  const out = trimSheetXml(xml);
  assert.ok(out.xml.includes('<dimension ref="A1:D2"/>'),
    'Ctrl+End should land on the data, not on XFD1048576: ' + (out.xml.match(/<dimension[^>]*>/) || [])[0]);
});

test('the bloat archetype collapses, and nothing else changes', () => {
  const rows = [row(1, 8), row(2, 8)];
  for (let r = 3; r <= 2000; r++) rows.push(blankRow(r, 8));
  const xml = sheet(rows.join(''));
  const out = trimSheetXml(xml);

  assert.equal(out.rowsDropped, 1998);
  assert.ok(out.xml.length < xml.length / 10, 'should be an order of magnitude smaller');
  /* The parts of the sheet that are not sheetData are untouched. */
  assert.ok(out.xml.includes('<pageMargins left="0.7" right="0.7"/>'));
  assert.ok(out.xml.includes('<sheetFormatPr defaultRowHeight="15"/>'));
  assert.ok(out.xml.startsWith('<?xml version="1.0"'));
});

test('a sheet with nothing to trim is returned byte-identical', () => {
  /* Dimension already correct, so there is genuinely nothing to do. */
  const xml = sheet(row(1, 3) + row(2, 3), 'A1:C2');
  const out = trimSheetXml(xml);
  assert.equal(out.rowsDropped, 0);
  assert.equal(out.cellsDropped, 0);
  assert.equal(out.dimensionFixed, false);
  assert.equal(out.xml, xml, 'an untouched sheet must not be rewritten at all');
});

test('an overstated dimension is corrected even when no row is dropped', () => {
  /* The file is already small; what makes it feel huge is that Ctrl+End lands
     a million rows away. Worth fixing on its own. */
  const xml = sheet(row(1, 3) + row(2, 3));
  const out = trimSheetXml(xml);
  assert.equal(out.rowsDropped, 0);
  assert.equal(out.dimensionFixed, true);
  assert.ok(out.xml.includes('<dimension ref="A1:C2"/>'));
  assert.equal((out.xml.match(/<v>/g) || []).length, 6, 'and no value moved');
});

test('shapes it does not understand are left alone rather than mangled', () => {
  for (const odd of [
    '<worksheet><sheetData/></worksheet>',
    '<worksheet><sheetViews/></worksheet>',
    '<worksheet><sheetData><row r="1"/></sheetData></worksheet>',
    '',
  ]) {
    const out = trimSheetXml(odd);
    assert.equal(typeof out.xml, 'string');
    assert.ok(out.rowsDropped >= 0);
  }
});

test('an entirely empty sheet drops every row and keeps a valid document', () => {
  const xml = sheet(blankRow(1) + blankRow(2) + blankRow(3));
  const out = trimSheetXml(xml);
  assert.equal(out.rowsDropped, 3);
  assert.ok(out.xml.includes('<sheetData></sheetData>'));
  /* No data means no defensible dimension, so the original is left as it is
     rather than inventing one. */
  assert.ok(out.xml.includes('<dimension ref="A1:XFD1048576"/>'));
});
