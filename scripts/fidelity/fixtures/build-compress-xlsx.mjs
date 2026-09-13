/**
 * Builds `torture-compress.xlsx` — the fixture for /compress-excel/.
 *
 * Same philosophy as the other compressor fixtures: a tool can score well on
 * "did it get smaller" by doing something destructive, so most of this file is
 * built out of things the compressor must leave **alone**, with a few it must
 * genuinely shrink.
 *
 * This one carries an extra burden the others do not. The Excel compressor is
 * the only one here that is not lossless, so the fixture has to pin exactly
 * where the line is drawn — what counts as "empty" and what does not.
 *
 *   Sheet1 "Data"    200 rows x 8 columns of real values, then **20,000 rows
 *                    of styled-but-empty cells**, and 30 styled-empty columns
 *                    to the right of every real row. This is the bloat, and it
 *                    is the overwhelming majority of the file.
 *
 *   Sheet2 "Calc"    formulas with cached values, plus a calcChain.xml. The
 *                    formulas must survive verbatim; the calcChain must go.
 *
 *   Sheet3 "Layout"  the trap. Two small tables with a **blank styled row
 *                    between them**, a blank styled row *before* the first
 *                    table, and a cell holding only a space. None of that may
 *                    be dropped: it is inside the used range, it is layout the
 *                    author chose, and a compressor that "tidies" it is
 *                    editing the document rather than compressing it.
 *
 *   Images           one 1200x900 photo displayed in a 2-inch box (must
 *                    shrink) and one 240x160 drawn at its natural size (must
 *                    come back byte-identical), anchored through
 *                    xl/drawings/drawing1.xml so the shared engine measures
 *                    them through `<xdr:pic>`.
 *
 * Markers: M01..M12 in sheet values, so "did any content vanish" is a
 * question with an exact answer.
 */
import { statSync } from 'node:fs';
import { writePackage } from '../lib/ooxml.mjs';
import * as TESTING_PATHS from '../../testing-paths.mjs';
import { scanLikeShade } from '../lib/test-images.mjs';
import { makePng } from '../lib/png.mjs';

const kb = (n) => (n / 1024).toFixed(1) + ' KB';
const EMU_PER_INCH = 914400;

const colName = (n) => {
  let s = '';
  while (n > 0) { const r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = Math.floor((n - 1) / 26); }
  return s;
};

/* ------------------------------------------------------------------ sheets */

const REAL_ROWS = 200;
const REAL_COLS = 8;
const BLOAT_ROWS = 20000;
const BLOAT_COLS = 30;

function dataSheet() {
  const rows = [];
  for (let r = 1; r <= REAL_ROWS; r++) {
    const cells = [];
    for (let c = 1; c <= REAL_COLS; c++) {
      /* Markers land in the first twelve rows of column A. */
      if (c === 1 && r <= 12) {
        cells.push(`<c r="A${r}" t="inlineStr" s="1"><is><t>M${String(r).padStart(2, '0')}</t></is></c>`);
      } else {
        cells.push(`<c r="${colName(c)}${r}" s="2"><v>${(r * 31 + c * 17) % 9973}</v></c>`);
      }
    }
    /* Styled empties to the right of the data: the column half of the bloat. */
    for (let c = REAL_COLS + 1; c <= REAL_COLS + BLOAT_COLS; c++) {
      cells.push(`<c r="${colName(c)}${r}" s="2"/>`);
    }
    rows.push(`<row r="${r}" spans="1:${REAL_COLS + BLOAT_COLS}">${cells.join('')}</row>`);
  }
  /* Rows of pure formatting. The reason the file is 20x bigger than its data. */
  for (let r = REAL_ROWS + 1; r <= REAL_ROWS + BLOAT_ROWS; r++) {
    const cells = [];
    for (let c = 1; c <= REAL_COLS; c++) cells.push(`<c r="${colName(c)}${r}" s="2"/>`);
    rows.push(`<row r="${r}" s="2" customFormat="1">${cells.join('')}</row>`);
  }
  return sheetXml(rows.join(''), 'A1:XFD1048576', '<drawing r:id="rIdDraw"/>');
}

function calcSheet() {
  const rows = [];
  for (let r = 1; r <= 500; r++) {
    rows.push(`<row r="${r}"><c r="A${r}"><v>${r}</v></c>`
      + `<c r="B${r}"><f>A${r}*2</f><v>${r * 2}</v></c>`
      + `<c r="C${r}"><f>SUM(A${r}:B${r})</f><v>${r * 3}</v></c></row>`);
  }
  return sheetXml(rows.join(''), 'A1:C500');
}

/* The trap sheet: everything here must survive. */
function layoutSheet() {
  const blank = (r) => `<row r="${r}" s="2" customFormat="1">`
    + `<c r="A${r}" s="2"/><c r="B${r}" s="2"/></row>`;
  const rows = [
    blank(1),
    `<row r="2"><c r="A2" t="inlineStr" s="1"><is><t>M13-TOP</t></is></c><c r="B2"><v>1</v></c></row>`,
    blank(3),
    `<row r="4"><c r="A4" t="inlineStr" s="1"><is><t>M14-BOTTOM</t></is></c><c r="B4"><v>2</v></c></row>`,
    /* A cell holding a single space is content: somebody typed it, and Excel
       treats it as a non-empty cell. */
    `<row r="5"><c r="A5" t="inlineStr"><is><t xml:space="preserve"> </t></is></c></row>`,
    blank(6),
  ];
  return sheetXml(rows.join(''), 'A1:B6');
}

const sheetXml = (rowsXml, dim, extra = '') =>
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
  + '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"'
  + ' xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
  + `<dimension ref="${dim}"/>`
  + '<sheetViews><sheetView workbookViewId="0"/></sheetViews>'
  + '<sheetFormatPr defaultRowHeight="15"/>'
  + `<sheetData>${rowsXml}</sheetData>`
  + '<pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>'
  + extra
  + '</worksheet>';

/* ------------------------------------------------------------------ images */

const photo = makePng(1200, 900, scanLikeShade(1200, 900));      // 600 DPI in a 2in box: must shrink
const rightSized = makePng(240, 160, scanLikeShade(240, 160));   // 96 DPI at 2.5in: must be untouched

/** One `<xdr:twoCellAnchor>` holding a picture at an explicit size. */
function anchor(id, relId, name, wIn, hIn, col, row) {
  return '<xdr:twoCellAnchor editAs="oneCell">'
    + `<xdr:from><xdr:col>${col}</xdr:col><xdr:colOff>0</xdr:colOff>`
    + `<xdr:row>${row}</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:from>`
    + `<xdr:to><xdr:col>${col + 4}</xdr:col><xdr:colOff>0</xdr:colOff>`
    + `<xdr:row>${row + 8}</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:to>`
    + '<xdr:pic>'
    + `<xdr:nvPicPr><xdr:cNvPr id="${id}" name="${name}"/><xdr:cNvPicPr/></xdr:nvPicPr>`
    + `<xdr:blipFill><a:blip xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" r:embed="${relId}"/>`
    + '<a:stretch xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:fillRect/></a:stretch></xdr:blipFill>'
    + '<xdr:spPr><a:xfrm xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">'
    + '<a:off x="0" y="0"/>'
    + `<a:ext cx="${Math.round(wIn * EMU_PER_INCH)}" cy="${Math.round(hIn * EMU_PER_INCH)}"/>`
    + '</a:xfrm></xdr:spPr>'
    + '<xdr:clientData/></xdr:pic></xdr:twoCellAnchor>';
}

const drawingXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
  + '<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing"'
  + ' xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
  + anchor(2, 'rIdPhoto', 'photo-big', 2.0, 1.5, 10, 2)
  + anchor(3, 'rIdSmall', 'right-sized', 2.5, 1.667, 10, 14)
  + '</xdr:wsDr>';

const rels = (entries) => '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
  + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
  + entries + '</Relationships>';

/* ------------------------------------------------------------------- parts */

const parts = {
  '[Content_Types].xml': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
    + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
    + '<Default Extension="xml" ContentType="application/xml"/>'
    + '<Default Extension="png" ContentType="image/png"/>'
    + '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
    + '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
    + '<Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
    + '<Override PartName="/xl/worksheets/sheet3.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
    + '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
    + '<Override PartName="/xl/calcChain.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.calcChain+xml"/>'
    + '<Override PartName="/xl/drawings/drawing1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>'
    + '</Types>',

  '_rels/.rels': rels('<Relationship Id="rId1" '
    + 'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" '
    + 'Target="xl/workbook.xml"/>'),

  'xl/workbook.xml': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    + '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"'
    + ' xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>'
    + '<sheet name="Data" sheetId="1" r:id="rId1"/>'
    + '<sheet name="Calc" sheetId="2" r:id="rId2"/>'
    + '<sheet name="Layout" sheetId="3" r:id="rId3"/>'
    + '</sheets></workbook>',

  'xl/_rels/workbook.xml.rels': rels(
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>'
    + '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>'
    + '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet3.xml"/>'
    + '<Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
    + '<Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/calcChain" Target="calcChain.xml"/>'),

  'xl/styles.xml': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    + '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
    + '<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font>'
    + '<font><b/><sz val="11"/><name val="Calibri"/></font></fonts>'
    + '<fills count="3"><fill><patternFill patternType="none"/></fill>'
    + '<fill><patternFill patternType="gray125"/></fill>'
    + '<fill><patternFill patternType="solid"><fgColor rgb="FFFFF2CC"/></patternFill></fill></fills>'
    + '<borders count="2"><border/><border><left style="thin"/><right style="thin"/>'
    + '<top style="thin"/><bottom style="thin"/></border></borders>'
    + '<cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>'
    + '<xf numFmtId="0" fontId="1" fillId="2" borderId="1" applyFill="1" applyBorder="1"/>'
    + '<xf numFmtId="0" fontId="0" fillId="2" borderId="1" applyFill="1" applyBorder="1"/></cellXfs>'
    + '</styleSheet>',

  'xl/worksheets/sheet1.xml': dataSheet(),
  'xl/worksheets/sheet2.xml': calcSheet(),
  'xl/worksheets/sheet3.xml': layoutSheet(),

  'xl/worksheets/_rels/sheet1.xml.rels': rels('<Relationship Id="rIdDraw" '
    + 'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" '
    + 'Target="../drawings/drawing1.xml"/>'),

  'xl/drawings/drawing1.xml': drawingXml,
  'xl/drawings/_rels/drawing1.xml.rels': rels(
    '<Relationship Id="rIdPhoto" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/photo-big.png"/>'
    + '<Relationship Id="rIdSmall" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/right-sized.png"/>'),

  'xl/media/photo-big.png': photo,
  'xl/media/right-sized.png': rightSized,

  'xl/calcChain.xml': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    + '<calcChain xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
    + Array.from({ length: 1000 }, (_, i) => `<c r="B${i + 1}" i="2"/><c r="C${i + 1}" i="2"/>`).join('')
    + '</calcChain>',
};

const out = TESTING_PATHS.fixture('torture-compress.xlsx');
await writePackage(parts, out);
console.log('torture-compress.xlsx ' + kb(statSync(out).size));
console.log(`  ${REAL_ROWS} real rows + ${BLOAT_ROWS} styled-empty rows + ${BLOAT_COLS} styled-empty columns`);
console.log('  sheet3 is the trap: interior blank rows and a cell holding one space, all of which must survive');
console.log('  two images anchored through <xdr:pic>: one to shrink, one to leave byte-identical');
