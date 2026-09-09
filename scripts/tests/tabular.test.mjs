/**
 * Unit tests for the tabular conversion core.
 *
 * These cover the parsing and typing rules directly, so a regression is caught
 * in a second here rather than in a four-minute browser sweep. The browser
 * harness still runs the real tools end to end; this is the fast layer under it.
 *
 *   node scripts/tests/tabular.test.mjs
 */
import assert from 'node:assert/strict';
import {
  parseCsv, sniffDelimiter, coerceValue, isoDateToSerial,
  flatten, recordsToRows, pickRecords, csvCell, rowsToCsv,
  parseNumericCell, typedCellFromText,
} from '../../src/scripts/tabular.js';

let passed = 0;
const tests = [];
const test = (name, fn) => tests.push([name, fn]);

/* ------------------------------------------------------------------- CSV */

test('parses a simple row', () => {
  assert.deepEqual(parseCsv('a,b,c\n1,2,3\n'), [['a', 'b', 'c'], ['1', '2', '3']]);
});

test('a quoted field may contain the delimiter', () => {
  const rows = parseCsv('id,name\n1,"Contains, a comma"\n');
  assert.equal(rows[1][1], 'Contains, a comma');
  assert.equal(rows[1].length, 2, 'must stay two fields');
});

test('doubled quotes decode to one quote', () => {
  const rows = parseCsv('a\n"He said ""hi"""\n');
  assert.equal(rows[1][0], 'He said "hi"');
});

test('a quoted field may contain a newline', () => {
  const rows = parseCsv('a,b\n"line one\nline two",x\n');
  assert.equal(rows.length, 2, 'the embedded newline must not end the row');
  assert.equal(rows[1][0], 'line one\nline two');
  assert.equal(rows[1][1], 'x');
});

test('handles CRLF line endings', () => {
  assert.deepEqual(parseCsv('a,b\r\n1,2\r\n'), [['a', 'b'], ['1', '2']]);
});

test('strips a UTF-8 BOM from the first header', () => {
  const rows = parseCsv('﻿id,name\n1,x\n');
  assert.equal(rows[0][0], 'id', 'BOM must not become part of the column name');
});

test('sniffs semicolon and tab delimiters', () => {
  assert.equal(sniffDelimiter('a;b;c\n1;2;3'), ';');
  assert.equal(sniffDelimiter('a\tb\tc\n1\t2\t3'), '\t');
  assert.equal(sniffDelimiter('a,b,c\n1,2,3'), ',');
});

test('a delimiter inside quotes does not affect sniffing', () => {
  assert.equal(sniffDelimiter('"a;b;c;d;e",x\n1,2'), ',');
});

/* ---------------------------------------------------------------- typing */

test('leading zeros keep the value as text', () => {
  assert.deepEqual(coerceValue('0044123456'), { t: 's', v: '0044123456' });
  assert.deepEqual(coerceValue('0000012345'), { t: 's', v: '0000012345' });
  assert.deepEqual(coerceValue('007'), { t: 's', v: '007' });
});

test('ordinary numbers still become numbers', () => {
  assert.deepEqual(coerceValue('1440'), { t: 'n', v: 1440 });
  assert.deepEqual(coerceValue('-450.00'), { t: 'n', v: -450 });
  assert.deepEqual(coerceValue('0.5'), { t: 'n', v: 0.5 });
  assert.deepEqual(coerceValue('0'), { t: 'n', v: 0 });
});

test('more than 15 significant digits stays text', () => {
  // A double cannot hold this exactly, so converting would silently corrupt it.
  assert.equal(coerceValue('12345678901234567890').t, 's');
  assert.deepEqual(coerceValue('123456789012345'), { t: 'n', v: 123456789012345 });
});

test('thousands separators are left as text (locale-ambiguous)', () => {
  assert.equal(coerceValue('1,440').t, 's');
});

test('an ISO date becomes a UTC-correct serial with no time part', () => {
  const r = coerceValue('2025-01-01');
  assert.equal(r.t, 'd');
  assert.equal(r.v, 45658);
  assert.ok(Number.isInteger(r.v), 'a date-only value must not carry a time fraction');
});

test('the date serial matches Excel for known dates', () => {
  assert.equal(isoDateToSerial(1900, 1, 1), 2);
  assert.equal(isoDateToSerial(2025, 1, 1), 45658);
  assert.equal(isoDateToSerial(2025, 3, 31), 45747);
});

test('an impossible date stays text', () => {
  assert.equal(coerceValue('2025-13-45').t, 's');
});

test('booleans are recognised', () => {
  assert.deepEqual(coerceValue('true'), { t: 'b', v: true });
  assert.deepEqual(coerceValue('FALSE'), { t: 'b', v: false });
});

test('unicode passes through untouched', () => {
  assert.deepEqual(coerceValue('Ünïcodé — 変換'), { t: 's', v: 'Ünïcodé — 変換' });
});

/* ------------------------------------------------------------ flattening */

test('nested objects become dotted columns', () => {
  assert.deepEqual(flatten({ a: { b: 1 }, c: 2 }), { 'a.b': 1, c: 2 });
});

test('arrays become indexed columns', () => {
  assert.deepEqual(flatten({ tags: ['x', 'y'] }), { 'tags.0': 'x', 'tags.1': 'y' });
});

test('XML @attributes folds into its parent path', () => {
  assert.deepEqual(flatten({ item: { '@attributes': { sku: 'W-100' }, name: 'Widget' } }),
    { 'item.sku': 'W-100', 'item.name': 'Widget' });
});

test('recordsToRows unions keys across records', () => {
  const rows = recordsToRows([{ a: 1 }, { b: 2 }]);
  assert.deepEqual(rows[0], ['a', 'b'], 'a key missing from the first record must still get a column');
  assert.deepEqual(rows[1], [1, '']);
  assert.deepEqual(rows[2], ['', 2]);
});

/* ------------------------------------------------------- record discovery */

test('a root array is the record set', () => {
  const { records } = pickRecords([{ a: 1 }, { a: 2 }]);
  assert.equal(records.length, 2);
});

test('an envelope object yields its inner array', () => {
  const { records } = pickRecords({ meta: { n: 2 }, data: [{ a: 1 }, { a: 2 }] });
  assert.equal(records.length, 2);
  assert.equal(records[0].a, 1);
});

test('the largest array of objects wins over a short one', () => {
  const { records } = pickRecords({ tags: ['x'], rows: [{ a: 1 }, { a: 2 }, { a: 3 }] });
  assert.equal(records.length, 3);
});

test('a plain object becomes one flattened record, not a row of blanks', () => {
  const { records } = pickRecords({ marker: 'M01', meta: { title: 'x' } });
  assert.equal(records.length, 1);
  const rows = recordsToRows(records);
  assert.ok(rows[0].includes('meta.title'), 'nested key must appear as a column');
  assert.ok(rows[1].includes('x'), 'nested value must appear in the row');
});

/* ------------------------------------------------------------ CSV output */

test('csvCell quotes only when needed', () => {
  assert.equal(csvCell('plain'), 'plain');
  assert.equal(csvCell('has,comma'), '"has,comma"');
  assert.equal(csvCell('has"quote'), '"has""quote"');
  assert.equal(csvCell('has\nnewline'), '"has\nnewline"');
});

test('rowsToCsv round-trips through parseCsv', () => {
  const original = [
    ['id', 'name', 'note'],
    ['1', 'Contains, a comma', 'plain'],
    ['2', 'He said "hi"', 'line one\nline two'],
    ['3', 'Ünïcodé — 変換', '0044123456'],
  ];
  const text = rowsToCsv(original, { bom: false });
  assert.deepEqual(parseCsv(text), original, 'writing then reading must be lossless');
});

test('rowsToCsv emits a BOM so Excel reads UTF-8', () => {
  assert.ok(rowsToCsv([['Ünïcodé']]).startsWith('﻿'));
});

/* ------------------------------------------- numbers recovered from text */

test('a currency amount becomes a number that keeps its look', () => {
  const r = parseNumericCell('$1,440.00');
  assert.equal(r.value, 1440);
  assert.equal(r.numFmt, '"$"#,##0.00');
});

test('a negative currency amount keeps its sign', () => {
  assert.equal(parseNumericCell('-$450.00').value, -450);
});

test('accounting parentheses mean negative', () => {
  assert.equal(parseNumericCell('(450.00)').value, -450);
  assert.equal(parseNumericCell('($1,250.75)').value, -1250.75);
});

test('a trailing minus means negative', () => {
  assert.equal(parseNumericCell('450.00-').value, -450);
});

test('thousands separators are recovered, not kept as text', () => {
  const r = parseNumericCell('1,240');
  assert.equal(r.value, 1240);
  assert.equal(r.numFmt, '#,##0');
});

test('a plain integer needs no grouping in its format', () => {
  assert.deepEqual(parseNumericCell('12'), { value: 12, numFmt: '0' });
});

test('percentages become their decimal value', () => {
  const r = parseNumericCell('18.4%');
  assert.ok(Math.abs(r.value - 0.184) < 1e-12);
  assert.equal(r.numFmt, '0.0%');
});

test('European grouping is read correctly', () => {
  // 1.234,56 — the last separator is the decimal point.
  assert.equal(parseNumericCell('1.234,56').value, 1234.56);
});

test('a lone comma before three digits is grouping, not a decimal', () => {
  assert.equal(parseNumericCell('1,440').value, 1440);
});

test('a lone comma before two digits is a European decimal', () => {
  assert.equal(parseNumericCell('1,44').value, 1.44);
});

test('repeated separators are always grouping', () => {
  assert.equal(parseNumericCell('1.234.567').value, 1234567);
  assert.equal(parseNumericCell('1,234,567').value, 1234567);
});

test('other currency symbols are recognised', () => {
  assert.equal(parseNumericCell('₹2,058.50').value, 2058.5);
  assert.equal(parseNumericCell('€1.234,56').value, 1234.56);
  assert.equal(parseNumericCell('1,440.00 £').value, 1440);
});

test('an identifier with leading zeros is NOT converted', () => {
  // Turning an account number into arithmetic loses the leading zeros.
  assert.equal(parseNumericCell('0044123456'), null);
  assert.equal(parseNumericCell('007'), null);
});

test('prose is not mistaken for a number', () => {
  assert.equal(parseNumericCell('M05 Widget, large'), null);
  assert.equal(parseNumericCell('Item'), null);
  assert.equal(parseNumericCell(''), null);
  assert.equal(parseNumericCell('12 units'), null);
});

test('precision beyond a double is left as text', () => {
  assert.equal(parseNumericCell('12345678901234567890'), null);
});

/* ----------------------------------------------------------- typed cells */

test('typedCellFromText types the fixture table correctly', () => {
  assert.deepEqual(typedCellFromText('$1,440.00'), { t: 'n', v: 1440, numFmt: '"$"#,##0.00' });
  assert.deepEqual(typedCellFromText('-3'), { t: 'n', v: -3, numFmt: '0' });
  assert.equal(typedCellFromText('M09 Total').t, 's');
});

test('typedCellFromText recognises an ISO date', () => {
  const r = typedCellFromText('2025-01-01');
  assert.equal(r.t, 'd');
  assert.equal(r.v, 45658);
  assert.equal(r.numFmt, 'yyyy-mm-dd');
});

test('a summable column really does sum', () => {
  const column = ['$1,440.00', '$18,600.00', '$2,058.50', '-$450.00'];
  const total = column.reduce((n, c) => n + typedCellFromText(c).v, 0);
  assert.equal(total, 21648.5, 'must match the fixture total on the page');
});

/* --------------------------------------------------------------- runner */

let failed = 0;
for (const [name, fn] of tests) {
  try { fn(); passed++; }
  catch (e) {
    failed++;
    console.log(`FAIL  ${name}\n      ${e.message.split('\n')[0]}`);
  }
}
console.log(`\n${passed}/${tests.length} tabular-core tests passed`);
process.exit(failed ? 1 : 0);
