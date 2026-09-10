/**
 * Builds `torture.xlsx` — the spreadsheet fixture.
 *
 * Deliberately loaded with the things SheetJS's community build cannot see:
 * fills, fonts, borders, number formats, merges, column widths and frozen
 * panes all live in xl/styles.xml and the sheet XML, and a `sheet_to_json`
 * round-trip discards every one of them. excel-to-pdf, merge-excel and
 * split-excel all sit on that round-trip today, so this fixture is what turns
 * "the styling disappeared" from an anecdote into a failing assertion.
 *
 * Sheet layout:
 *   Styled — the formatting torture test, plus a formula and a frozen header
 *   Wide   — 15 columns, to force a landscape/scaling decision
 *   Plain  — unstyled control, so we can tell "lost styling" from "broke"
 */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writePackage, xmlEscape } from '../lib/ooxml.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const NS_MAIN = 'xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"';
const NS_REL = 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
const DECL = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';

/* ------------------------------------------------------------ cell utils */

/** Inline-string cell — avoids a sharedStrings part without losing fidelity. */
function s(ref, text, style) {
  const st = style ? ` s="${style}"` : '';
  return `<c r="${ref}" t="inlineStr"${st}><is><t xml:space="preserve">${xmlEscape(text)}</t></is></c>`;
}
/** Numeric cell. Excel dates are numbers with a date format applied. */
function n(ref, value, style) {
  const st = style ? ` s="${style}"` : '';
  return `<c r="${ref}"${st}><v>${value}</v></c>`;
}
/** Formula cell, with a cached result so readers that ignore formulas still see a value. */
function f(ref, formula, cached, style) {
  const st = style ? ` s="${style}"` : '';
  return `<c r="${ref}"${st}><f>${xmlEscape(formula)}</f><v>${cached}</v></c>`;
}
function row(idx, cells) {
  return `<row r="${idx}">${cells.join('')}</row>`;
}

/* Style indices, matching the cellXfs order defined in stylesXml below. */
const ST = {
  DEFAULT: 0,
  HEADER: 1,   // bold white on navy, centred, bordered
  CURRENCY: 2, // $#,##0.00 + border
  DATE: 3,     // dd/mm/yyyy + border
  PERCENT: 4,  // 0.0% + border
  REDNEG: 5,   // negatives in red parentheses + border
  TITLE: 6,    // 14pt navy bold on light grey
  BORDERED: 7, // plain, bordered
};

/* -------------------------------------------------------------- sheet 1 */

/* Excel serial dates: 1 = 1900-01-01 under the 1900 system. 45658 = 2025-01-01. */
const rowsStyled = [
  // M01 merged title across A1:D1
  row(1, [s('A1', 'M01 Q1 Revenue by Region', ST.TITLE), s('B1', '', ST.TITLE), s('C1', '', ST.TITLE), s('D1', '', ST.TITLE)]),
  // M02 header band — bold white on navy
  row(2, [s('A2', 'M02 Region', ST.HEADER), s('B2', 'Booked', ST.HEADER), s('C2', 'Date', ST.HEADER), s('D2', 'Margin', ST.HEADER)]),
  // M03 currency, M04 date, M05 percent
  row(3, [s('A3', 'M03 North', ST.BORDERED), n('B3', 128400.5, ST.CURRENCY), n('C3', 45658, ST.DATE), n('D3', 0.184, ST.PERCENT)]),
  row(4, [s('A4', 'South', ST.BORDERED), n('B4', 94210.75, ST.CURRENCY), n('C4', 45689, ST.DATE), n('D4', 0.221, ST.PERCENT)]),
  // M06 negative rendered red by the number format, not by a font colour
  row(5, [s('A5', 'M06 West (loss)', ST.BORDERED), n('B5', -17320.4, ST.REDNEG), n('C5', 45717, ST.DATE), n('D5', -0.051, ST.PERCENT)]),
  // M07 a real formula — must survive as a value at minimum
  row(6, [s('A6', 'M07 Total', ST.HEADER), f('B6', 'SUM(B3:B5)', 205290.85, ST.CURRENCY), s('C6', '', ST.HEADER), s('D6', '', ST.HEADER)]),
];

const sheetStyled = DECL +
  `<worksheet ${NS_MAIN} ${NS_REL}>` +
  // M08 explicit column widths — lost by every unstyled round-trip
  '<cols>' +
    '<col min="1" max="1" width="28" customWidth="1"/>' +
    '<col min="2" max="2" width="16" customWidth="1"/>' +
    '<col min="3" max="3" width="14" customWidth="1"/>' +
    '<col min="4" max="4" width="12" customWidth="1"/>' +
  '</cols>' +
  // M09 frozen header rows
  '<sheetViews><sheetView workbookViewId="0">' +
    '<pane ySplit="2" topLeftCell="A3" activePane="bottomLeft" state="frozen"/>' +
  '</sheetView></sheetViews>' +
  `<sheetData>${rowsStyled.join('')}</sheetData>` +
  // M10 merged range
  '<mergeCells count="1"><mergeCell ref="A1:D1"/></mergeCells>' +
  '</worksheet>';

/* -------------------------------------------------------------- sheet 2 */

const wideHeader = [];
const wideData = [];
for (let c = 0; c < 15; c++) {
  const col = String.fromCharCode(65 + c); // A..O
  wideHeader.push(s(`${col}1`, `M11 Col ${col}`, ST.HEADER));
  wideData.push(n(`${col}2`, (c + 1) * 1000, ST.CURRENCY));
}
const sheetWide = DECL + `<worksheet ${NS_MAIN} ${NS_REL}><sheetData>` +
  row(1, wideHeader) + row(2, wideData) +
  '</sheetData></worksheet>';

/* -------------------------------------------------------------- sheet 3 */

const sheetPlain = DECL + `<worksheet ${NS_MAIN} ${NS_REL}><sheetData>` +
  row(1, [s('A1', 'M12 plain control sheet'), s('B1', 'no styling here')]) +
  row(2, [s('A2', 'value'), n('B2', 42)]) +
  '</sheetData></worksheet>';

/* --------------------------------------------------------------- styles */

const stylesXml = DECL + `<styleSheet ${NS_MAIN}>` +
  '<numFmts count="4">' +
    '<numFmt numFmtId="164" formatCode="&quot;$&quot;#,##0.00"/>' +
    '<numFmt numFmtId="165" formatCode="0.0%"/>' +
    '<numFmt numFmtId="166" formatCode="dd/mm/yyyy"/>' +
    '<numFmt numFmtId="167" formatCode="#,##0.00;[Red](#,##0.00)"/>' +
  '</numFmts>' +
  '<fonts count="3">' +
    '<font><sz val="11"/><name val="Calibri"/></font>' +
    '<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>' +
    '<font><b/><sz val="14"/><color rgb="FF1F4E79"/><name val="Calibri"/></font>' +
  '</fonts>' +
  '<fills count="4">' +
    '<fill><patternFill patternType="none"/></fill>' +
    '<fill><patternFill patternType="gray125"/></fill>' +
    '<fill><patternFill patternType="solid"><fgColor rgb="FF1F4E79"/><bgColor indexed="64"/></patternFill></fill>' +
    '<fill><patternFill patternType="solid"><fgColor rgb="FFEFEFEF"/><bgColor indexed="64"/></patternFill></fill>' +
  '</fills>' +
  '<borders count="2">' +
    '<border><left/><right/><top/><bottom/><diagonal/></border>' +
    '<border>' +
      '<left style="thin"><color rgb="FF999999"/></left>' +
      '<right style="thin"><color rgb="FF999999"/></right>' +
      '<top style="thin"><color rgb="FF999999"/></top>' +
      '<bottom style="thin"><color rgb="FF999999"/></bottom>' +
      '<diagonal/>' +
    '</border>' +
  '</borders>' +
  '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
  '<cellXfs count="8">' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
    '<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center"/></xf>' +
    '<xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>' +
    '<xf numFmtId="166" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>' +
    '<xf numFmtId="165" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>' +
    '<xf numFmtId="167" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="2" fillId="3" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="center"/></xf>' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1"/>' +
  '</cellXfs>' +
  '</styleSheet>';

/* ------------------------------------------------------------- workbook */

const workbookXml = DECL + `<workbook ${NS_MAIN} ${NS_REL}><sheets>` +
  '<sheet name="Styled" sheetId="1" r:id="rId1"/>' +
  '<sheet name="Wide" sheetId="2" r:id="rId2"/>' +
  '<sheet name="Plain" sheetId="3" r:id="rId3"/>' +
  '</sheets></workbook>';

const workbookRels = DECL +
  '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
  '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>' +
  '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>' +
  '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet3.xml"/>' +
  '<Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
  '</Relationships>';

const rootRels = DECL +
  '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
  '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
  '</Relationships>';

const contentTypes = DECL +
  '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
  '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
  '<Default Extension="xml" ContentType="application/xml"/>' +
  '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
  '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
  '<Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
  '<Override PartName="/xl/worksheets/sheet3.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
  '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
  '</Types>';

/* ----------------------------------------------------------------- emit */

const out = join(HERE, 'files', 'torture.xlsx');
const bytes = await writePackage({
  '[Content_Types].xml': contentTypes,
  '_rels/.rels': rootRels,
  'xl/workbook.xml': workbookXml,
  'xl/_rels/workbook.xml.rels': workbookRels,
  'xl/styles.xml': stylesXml,
  'xl/worksheets/sheet1.xml': sheetStyled,
  'xl/worksheets/sheet2.xml': sheetWide,
  'xl/worksheets/sheet3.xml': sheetPlain,
}, out);

console.log('torture.xlsx  ' + bytes + ' bytes  3 sheets, 8 cell styles, 4 number formats');
/* ------------------------------------------------- the second workbook */

/* torture-b.xlsx is NOT a copy of torture.xlsx, for the same reason
   torture-b.pptx is not a copy of the first deck: merging two identical
   workbooks cannot reveal the bug that matters here. Every cell carries an
   `s=` index into its own workbook's cellXfs, and those tables are private to
   the file. Append the second workbook's sheets without rewriting their
   indices and each cell silently adopts whatever style happens to sit at that
   position in the first workbook's table — the file still opens, and the
   numbers are simply wrong.
   So this workbook's style table is a different *shape*, not just different
   values: 5 cell styles against the first one's 8, 3 fills against 4, 2 fonts
   against 3, 1 border against 2, and number formats that reuse the same ids
   164-166 for different format codes. Index 1 means white-on-navy in the
   first workbook and white-on-purple here; index 2 is dollars there and euros
   here. A merger that forgets to remap produces navy headers and dollar
   amounts in the second workbook's sheets, which the harness can see. */

const STB = { DEFAULT: 0, HEADER: 1, EURO: 2, PERCENT: 3, DATE: 4 };

const rowsLedger = [
  row(1, [s('A1', 'B01 Supplier', STB.HEADER), s('B1', 'Net', STB.HEADER),
          s('C1', 'VAT', STB.HEADER), s('D1', 'Settled', STB.HEADER)]),
  row(2, [s('A2', 'B02 Nordwind GmbH', STB.DEFAULT), n('B2', 8420.4, STB.EURO),
          n('C2', 0.19, STB.PERCENT), n('D2', 45703, STB.DATE)]),
  row(3, [s('A3', 'B03 Périgord SARL', STB.DEFAULT), n('B3', 15990.05, STB.EURO),
          n('C3', 0.2, STB.PERCENT), n('D3', 45731, STB.DATE)]),
  row(4, [s('A4', 'B04 Total', STB.HEADER), f('B4', 'SUM(B2:B3)', 24410.45, STB.EURO),
          s('C4', '', STB.HEADER), s('D4', '', STB.HEADER)]),
];

const sheetLedger = DECL + `<worksheet ${NS_MAIN} ${NS_REL}>` +
  '<cols><col min="1" max="1" width="24" customWidth="1"/>' +
        '<col min="2" max="2" width="15" customWidth="1"/></cols>' +
  `<sheetData>${rowsLedger.join('')}</sheetData>` +
  '<mergeCells count="1"><mergeCell ref="C4:D4"/></mergeCells>' +
  '</worksheet>';

const wideHeaderB = [];
const wideDataB = [];
for (let c = 0; c < 15; c++) {
  const col = String.fromCharCode(65 + c);
  wideHeaderB.push(s(`${col}1`, `B05 Col ${col}`, STB.HEADER));
  wideDataB.push(n(`${col}2`, (c + 1) * 250, STB.EURO));
}
const sheetWideB = DECL + `<worksheet ${NS_MAIN} ${NS_REL}><sheetData>` +
  row(1, wideHeaderB) + row(2, wideDataB) + '</sheetData></worksheet>';

const sheetNotesB = DECL + `<worksheet ${NS_MAIN} ${NS_REL}><sheetData>` +
  row(1, [s('A1', 'B06 second workbook control sheet'), s('B1', 'no styling here')]) +
  row(2, [s('A2', 'value'), n('B2', 7)]) +
  '</sheetData></worksheet>';

const stylesXmlB = DECL + `<styleSheet ${NS_MAIN}>` +
  '<numFmts count="3">' +
    '<numFmt numFmtId="164" formatCode="&quot;€&quot;#,##0.00"/>' +
    '<numFmt numFmtId="165" formatCode="0.00%"/>' +
    '<numFmt numFmtId="166" formatCode="yyyy\-mm\-dd"/>' +
  '</numFmts>' +
  '<fonts count="2">' +
    '<font><sz val="10"/><name val="Arial"/></font>' +
    '<font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Arial"/></font>' +
  '</fonts>' +
  '<fills count="3">' +
    '<fill><patternFill patternType="none"/></fill>' +
    '<fill><patternFill patternType="gray125"/></fill>' +
    '<fill><patternFill patternType="solid"><fgColor rgb="FF7E22CE"/><bgColor indexed="64"/></patternFill></fill>' +
  '</fills>' +
  '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
  '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
  '<cellXfs count="5">' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
    '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="center"/></xf>' +
    '<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>' +
    '<xf numFmtId="165" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>' +
    '<xf numFmtId="166" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>' +
  '</cellXfs>' +
  '</styleSheet>';

const workbookXmlB = DECL + `<workbook ${NS_MAIN} ${NS_REL}><sheets>` +
  '<sheet name="Ledger" sheetId="1" r:id="rId1"/>' +
  '<sheet name="WideB" sheetId="2" r:id="rId2"/>' +
  '<sheet name="Notes" sheetId="3" r:id="rId3"/>' +
  '</sheets></workbook>';

const outB = join(HERE, 'files', 'torture-b.xlsx');
const bytesB = await writePackage({
  '[Content_Types].xml': contentTypes,
  '_rels/.rels': rootRels,
  'xl/workbook.xml': workbookXmlB,
  'xl/_rels/workbook.xml.rels': workbookRels,
  'xl/styles.xml': stylesXmlB,
  'xl/worksheets/sheet1.xml': sheetLedger,
  'xl/worksheets/sheet2.xml': sheetWideB,
  'xl/worksheets/sheet3.xml': sheetNotesB,
}, outB);

console.log('torture-b.xlsx ' + bytesB + ' bytes  distinct palette, 5 cell styles, euro formats');
