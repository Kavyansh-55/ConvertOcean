/**
 * Builds the text and data fixtures: torture.csv / .json / .xml / .txt / .ofx
 *
 * These formats have no "formatting" to lose, so fidelity here means something
 * different and, for a converter, harder: *not corrupting the data*. The
 * classic failures are all silent — a phone number with a leading zero becomes
 * a number and loses the zero, a field containing a comma splits into two
 * columns, an embedded quote swallows the rest of the row, a long digit string
 * turns into scientific notation, a value that looks like a date is helpfully
 * reformatted.
 *
 * Every fixture below is built to trip exactly those, with values whose correct
 * output is unambiguous.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as TESTING_PATHS from '../../testing-paths.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = TESTING_PATHS.FIXTURES;
mkdirSync(OUT, { recursive: true });

const write = (name, content) => {
  writeFileSync(join(OUT, name), content, 'utf8');
  return `${name.padEnd(14)} ${Buffer.byteLength(content)} bytes`;
};

/* ---------------------------------------------------------------- CSV */

/* Each row is a landmine a naive split(',') steps on. */
const csv = [
  'id,name,note,phone,amount,when,ratio',
  '1,M01 Plain row,nothing special,0044123456,1440.00,2025-01-01,0.5',
  '2,"M02 Contains, a comma","still one field",0044123456,94210.75,2025-02-01,0.25',
  '3,"M03 Contains ""quoted"" text","quote handling",0812345678,-450.00,2025-03-01,0.125',
  '4,"M04 Multi-line',
  'second line of the same field",newline inside a quoted field,0912345678,17320.40,2025-04-01,0.0625',
  '5,M05 Ünïcodé — 変換,non-ascii passthrough,0044999888,2058.50,2025-05-01,0.03125',
  '6,M06 Leading zeros,phone must keep its 00 prefix,0000012345,18600.00,2025-06-01,0.015625',
  // The note deliberately avoids spelling out the scientific-notation form:
  // an assertion searching the output for "E+14" would otherwise match this
  // descriptive text and fail a file that is perfectly correct.
  '7,M07 Big number,must stay a plain integer,0044000111,123456789012345,2025-07-01,0.0078125',
  '',
].join('\n');

/* --------------------------------------------------------------- JSON */

const json = JSON.stringify({
  marker: 'M01 root',
  meta: {
    marker: 'M02 nested object',
    generated: '2026-09-09T00:00:00Z',
    depth: { level2: { level3: { marker: 'M03 deep nesting', value: 42 } } },
  },
  types: {
    marker: 'M04 type matrix',
    string: 'text',
    integer: 1440,
    float: 0.1 + 0.2, // 0.30000000000000004 — must not be silently rounded
    bigish: 123456789012345,
    negative: -450,
    zero: 0,
    boolTrue: true,
    boolFalse: false,
    nullValue: null,
    emptyString: '',
    emptyArray: [],
    emptyObject: {},
  },
  unicode: {
    marker: 'M05 unicode',
    accented: 'Ünïcodé',
    devanagari: 'नमस्ते',
    cjk: '変換',
    emoji: '📄',
    escaped: 'quote " backslash \\ tab \t newline \n',
  },
  /* The record array a converter should pick as its rows. One name carries
     non-ASCII text on purpose: unicode elsewhere in the document proves
     nothing once a converter has correctly narrowed to this array. */
  rows: [
    { marker: 'M06 row array', id: 1, name: 'Widget, large', qty: 12, amount: 1440.0 },
    { marker: 'M07 row array', id: 2, name: 'Gadget "small"', qty: 1240, amount: 18600.0 },
    { marker: 'M08 row array', id: 3, name: 'Sprocket Ünïcodé 変換', qty: 98, amount: 2058.5 },
  ],
}, null, 2);

/* ---------------------------------------------------------------- XML */

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<catalogue marker="M01 root attribute">
  <meta>
    <title>M02 Torture XML</title>
    <generated>2026-09-09</generated>
  </meta>
  <items>
    <item id="1" sku="W-100">
      <name>M03 Widget, large</name>
      <qty>12</qty>
      <amount currency="USD">1440.00</amount>
    </item>
    <item id="2" sku="G-200">
      <name>M04 Gadget &amp; Co &lt;special&gt;</name>
      <qty>1240</qty>
      <amount currency="USD">18600.00</amount>
    </item>
    <item id="3" sku="S-300">
      <name>M05 Ünïcodé — 変換</name>
      <qty>98</qty>
      <amount currency="USD">2058.50</amount>
    </item>
    <item id="4" sku="R-400">
      <name>M06 Refund</name>
      <qty>-3</qty>
      <amount currency="USD">-450.00</amount>
    </item>
  </items>
  <notes><![CDATA[M07 CDATA section with <tags> & ampersands that must survive]]></notes>
</catalogue>
`;

/* ---------------------------------------------------------------- TXT */

/* Long enough to split several ways, with structure worth preserving. */
const txtParas = [
  'M01 Torture Text Fixture',
  '',
  'M02 This is the first paragraph. It is deliberately long enough to wrap when it is laid out on an A4 page at a normal body size, so that a txt-to-pdf conversion has to make a real line-breaking decision rather than dropping a short string onto one line.',
  '',
  'M03 Second paragraph, separated by a blank line. A converter that collapses blank lines will merge this with the paragraph above.',
  '',
  '\tM04 This line begins with a tab character.',
  'M05 This line has trailing spaces.   ',
  'M06 Ünïcodé — Devanagari: नमस्ते — CJK: 変換 — emoji: 📄',
  '',
  'M07 A deliberately long unbroken token follows, which must not run off the page:',
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  '',
];
// Pad to 60 numbered lines so the line/size split modes have something to chew.
for (let i = 8; i <= 60; i++) {
  txtParas.push(`M${String(i).padStart(2, '0')} Filler line ${i} — kept so splitting by line count is measurable.`);
}
const txt = txtParas.join('\n') + '\n';

/* ---------------------------------------------------------------- OFX */

/* SGML-style OFX 1.x, which is what banks actually hand out and what the
   parser has to cope with — unclosed tags, no XML declaration. */
const ofx = `OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
ENCODING:USASCII
CHARSET:1252
COMPRESSION:NONE
OLDFILEUID:NONE
NEWFILEUID:NONE

<OFX>
<BANKMSGSRSV1>
<STMTTRNRS>
<TRNUID>1
<STATUS><CODE>0<SEVERITY>INFO</STATUS>
<STMTRS>
<CURDEF>USD
<BANKACCTFROM><BANKID>123456789<ACCTID>000123456789<ACCTTYPE>CHECKING</BANKACCTFROM>
<BANKTRANLIST>
<DTSTART>20250101000000
<DTEND>20250331000000
<STMTTRN><TRNTYPE>DEBIT<DTPOSTED>20250105120000<TRNAMT>-45.00<FITID>M01<NAME>M01 Coffee Shop<MEMO>card purchase</STMTTRN>
<STMTTRN><TRNTYPE>CREDIT<DTPOSTED>20250110120000<TRNAMT>1440.00<FITID>M02<NAME>M02 Client Payment<MEMO>invoice 1001</STMTTRN>
<STMTTRN><TRNTYPE>DEBIT<DTPOSTED>20250115120000<TRNAMT>-1250.75<FITID>M03<NAME>M03 Rent, Office<MEMO>comma in the name</STMTTRN>
<STMTTRN><TRNTYPE>DEBIT<DTPOSTED>20250201120000<TRNAMT>-89.99<FITID>M04<NAME>M04 Supplier &amp; Co<MEMO>ampersand entity</STMTTRN>
<STMTTRN><TRNTYPE>CREDIT<DTPOSTED>20250228120000<TRNAMT>18600.00<FITID>M05<NAME>M05 Big Invoice<MEMO>large amount</STMTTRN>
</BANKTRANLIST>
<LEDGERBAL><BALAMT>18654.26<DTASOF>20250331000000</LEDGERBAL>
</STMTRS>
</STMTTRNRS>
</BANKMSGSRSV1>
</OFX>
`;

/* --------------------------------------------------------------- emit */

console.log(write('torture.csv', csv));
console.log(write('torture.json', json));
console.log(write('torture.xml', xml));
console.log(write('torture.txt', txt));
console.log(write('torture.ofx', ofx));
// The bank tools accept three extensions for what is the same OFX payload.
console.log(write('torture.qfx', ofx));
console.log(write('torture.qbo', ofx));
