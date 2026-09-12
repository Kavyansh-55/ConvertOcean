/**
 * Builds `torture.docx` — the Word fixture the fidelity harness converts.
 *
 * Every feature in here is one a real business document uses and one that a
 * naive docx→HTML→PDF pipeline throws away. The point is not to be exotic; it
 * is to be *ordinary in a way that is measurable*. Each item carries a visible
 * marker token (e.g. "M07") so an assertion can look for it in the output text
 * and a human can find it on the rendered page.
 *
 * Written as raw WordprocessingML rather than through a library so the fixture
 * says exactly what it means — when a converter drops shading, the test can
 * point at the w:shd element it ignored.
 */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { markerPng } from '../lib/png.mjs';
import { writePackage } from '../lib/ooxml.mjs';
import * as TESTING_PATHS from '../../testing-paths.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

const NS = [
  'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"',
  'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"',
  'xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"',
  'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"',
  'xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"',
].join(' ');

/** A run with explicit direct formatting — the part mammoth discards. */
function run(text, rPr) {
  const pr = rPr ? '<w:rPr>' + rPr + '</w:rPr>' : '';
  return '<w:r>' + pr + '<w:t xml:space="preserve">' + text + '</w:t></w:r>';
}
function para(runs, pPr) {
  const pr = pPr ? '<w:pPr>' + pPr + '</w:pPr>' : '';
  return '<w:p>' + pr + runs + '</w:p>';
}

/* Fonts are named explicitly. A converter that hardcodes one family will fail
   the font assertion no matter how good its layout is. */
const GEORGIA = '<w:rFonts w:ascii="Georgia" w:hAnsi="Georgia"/>';
const COURIER = '<w:rFonts w:ascii="Courier New" w:hAnsi="Courier New"/>';

const A4_PORTRAIT =
  '<w:pgSz w:w="11906" w:h="16838"/>' +
  '<w:pgMar w:top="1440" w:right="1080" w:bottom="1440" w:left="1080" w:header="720" w:footer="720"/>' +
  '<w:headerReference w:type="default" r:id="rIdHdr"/>' +
  '<w:footerReference w:type="default" r:id="rIdFtr"/>';

const A4_LANDSCAPE =
  '<w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/>' +
  '<w:pgMar w:top="1080" w:right="1080" w:bottom="1080" w:left="1080" w:header="720" w:footer="720"/>';

/* ------------------------------------------------------------------ body */

const tableXml =
  '<w:tbl>' +
    '<w:tblPr>' +
      '<w:tblW w:w="9360" w:type="dxa"/>' +
      '<w:tblBorders>' +
        '<w:top w:val="single" w:sz="8" w:color="333333"/>' +
        '<w:left w:val="single" w:sz="8" w:color="333333"/>' +
        '<w:bottom w:val="single" w:sz="8" w:color="333333"/>' +
        '<w:right w:val="single" w:sz="8" w:color="333333"/>' +
        '<w:insideH w:val="single" w:sz="4" w:color="999999"/>' +
        '<w:insideV w:val="single" w:sz="4" w:color="999999"/>' +
      '</w:tblBorders>' +
    '</w:tblPr>' +
    '<w:tblGrid><w:gridCol w:w="4680"/><w:gridCol w:w="2340"/><w:gridCol w:w="2340"/></w:tblGrid>' +
    '<w:tr>' +
      '<w:tc><w:tcPr><w:tcW w:w="4680" w:type="dxa"/><w:shd w:val="clear" w:fill="1F4E79"/></w:tcPr>' +
        para(run('M14 Item', '<w:b/><w:color w:val="FFFFFF"/>')) + '</w:tc>' +
      '<w:tc><w:tcPr><w:tcW w:w="2340" w:type="dxa"/><w:shd w:val="clear" w:fill="1F4E79"/></w:tcPr>' +
        para(run('Qty', '<w:b/><w:color w:val="FFFFFF"/>'), '<w:jc w:val="right"/>') + '</w:tc>' +
      '<w:tc><w:tcPr><w:tcW w:w="2340" w:type="dxa"/><w:shd w:val="clear" w:fill="1F4E79"/></w:tcPr>' +
        para(run('Amount', '<w:b/><w:color w:val="FFFFFF"/>'), '<w:jc w:val="right"/>') + '</w:tc>' +
    '</w:tr>' +
    '<w:tr>' +
      '<w:tc><w:tcPr><w:tcW w:w="4680" w:type="dxa"/></w:tcPr>' + para(run('Widget, large')) + '</w:tc>' +
      '<w:tc><w:tcPr><w:tcW w:w="2340" w:type="dxa"/></w:tcPr>' + para(run('12'), '<w:jc w:val="right"/>') + '</w:tc>' +
      '<w:tc><w:tcPr><w:tcW w:w="2340" w:type="dxa"/></w:tcPr>' + para(run('$1,440.00'), '<w:jc w:val="right"/>') + '</w:tc>' +
    '</w:tr>' +
    '<w:tr>' +
      '<w:tc><w:tcPr><w:tcW w:w="7020" w:type="dxa"/><w:gridSpan w:val="2"/><w:shd w:val="clear" w:fill="EFEFEF"/></w:tcPr>' +
        para(run('M15 merged cell spanning two columns', '<w:b/>')) + '</w:tc>' +
      '<w:tc><w:tcPr><w:tcW w:w="2340" w:type="dxa"/><w:shd w:val="clear" w:fill="EFEFEF"/></w:tcPr>' +
        para(run('$1,440.00', '<w:b/>'), '<w:jc w:val="right"/>') + '</w:tc>' +
    '</w:tr>' +
  '</w:tbl>';

/* 240x160 px at 96dpi -> 2286000 x 1524000 EMU */
const imageXml =
  '<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0">' +
    '<wp:extent cx="2286000" cy="1524000"/>' +
    '<wp:docPr id="1" name="M16 marker image"/>' +
    '<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">' +
      '<pic:pic>' +
        '<pic:nvPicPr><pic:cNvPr id="1" name="marker.png"/><pic:cNvPicPr/></pic:nvPicPr>' +
        '<pic:blipFill><a:blip r:embed="rIdImg"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>' +
        '<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="2286000" cy="1524000"/></a:xfrm>' +
          '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>' +
      '</pic:pic>' +
    '</a:graphicData></a:graphic>' +
  '</wp:inline></w:drawing></w:r>';

const numbered = ['first', 'second', 'third'].map((t) =>
  para(run('M09 numbered item ' + t),
    '<w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="2"/></w:numPr>')).join('');

const bulleted = ['alpha', 'beta'].map((t) =>
  para(run('M10 bullet ' + t),
    '<w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>')).join('');

const justifiedFiller =
  'Filler text to force the justification to actually show as flush edges on both margins. '.repeat(3);

const body = [
  // M01 heading level 1, styled + coloured + oversized
  para(run('M01 Torture Document', '<w:color w:val="1F4E79"/><w:sz w:val="48"/><w:b/>'),
       '<w:pStyle w:val="Heading1"/>'),

  // M02 body text in a named serif face at a non-default size
  para(run('M02 Body text set in Georgia at 13pt. A converter that reports this as 11pt Roboto has discarded the run properties.',
       GEORGIA + '<w:sz w:val="26"/>')),

  // M03 the full run-formatting matrix, all in one paragraph
  para(
    run('M03 ') +
    run('bold ', '<w:b/>') +
    run('italic ', '<w:i/>') +
    run('underline ', '<w:u w:val="single"/>') +
    run('strike ', '<w:strike/>') +
    run('super', '<w:vertAlign w:val="superscript"/>') +
    run(' sub', '<w:vertAlign w:val="subscript"/>')
  ),

  // M04 colour and highlight — dropped by semantic-HTML pipelines
  para(
    run('M04 red text ', '<w:color w:val="FF0000"/>') +
    run('and yellow highlight', '<w:highlight w:val="yellow"/>')
  ),

  // M05-M07 paragraph alignment
  para(run('M05 centered paragraph'), '<w:jc w:val="center"/>'),
  para(run('M06 right aligned paragraph'), '<w:jc w:val="right"/>'),
  para(run('M07 justified paragraph. ' + justifiedFiller), '<w:jc w:val="both"/>'),

  // M08 hanging indent + explicit line spacing
  para(run('M08 hanging indent with 1.5 line spacing, left indent 720 twips and a hanging first line of 360.'),
       '<w:ind w:left="720" w:hanging="360"/><w:spacing w:line="360" w:lineRule="auto"/>'),

  // M09 numbered list, M10 bulleted list
  numbered,
  bulleted,

  // M11 monospace run
  para(run('M11 const x = monospace();', COURIER)),

  // M12 external hyperlink (w:hyperlink is an inline, so it lives inside w:p)
  para('<w:hyperlink r:id="rIdLink"><w:r><w:rPr><w:color w:val="0563C1"/><w:u w:val="single"/></w:rPr>' +
    '<w:t>M12 hyperlink to example.com</w:t></w:r></w:hyperlink>'),

  // M13 non-Latin + accented text: exercises font fallback
  para(run('M13 &#220;n&#239;cod&#233; &#8212; Devanagari: &#2344;&#2350;&#2360;&#2381;&#2340;&#2375; &#8212; CJK: &#22793;&#25563;')),

  // M14/M15 table: header shading, explicit borders, fixed widths, merged cell
  tableXml,
  para(''), // a table must not sit directly against the following sectPr

  // M16 inline image, with a visible caption. The marker has to live in real
  // text: putting it only in the image's docPr name made both word-to-pdf and
  // docx-to-txt "fail" a text check for a string that is never rendered.
  para(imageXml),
  para(run('M16 Figure 1 — marker image above', '<w:i/><w:sz w:val="18"/>'), '<w:jc w:val="center"/>'),

  // M17 explicit page break
  para('<w:r><w:br w:type="page"/></w:r>'),
  para(run('M17 This line must begin page two.', '<w:b/>')),

  // close the portrait section so the tail can be landscape
  para('', '<w:sectPr>' + A4_PORTRAIT + '</w:sectPr>'),

  // M18 landscape section
  para(run('M18 This final section is landscape A4.', '<w:sz w:val="28"/><w:b/>')),
].join('');

const documentXml =
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
  '<w:document ' + NS + '><w:body>' + body +
  '<w:sectPr>' + A4_LANDSCAPE + '</w:sectPr></w:body></w:document>';

/* ---------------------------------------------------------------- parts */

const contentTypes = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
'<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
'<Default Extension="xml" ContentType="application/xml"/>' +
'<Default Extension="png" ContentType="image/png"/>' +
'<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
'<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>' +
'<Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>' +
'<Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>' +
'<Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>' +
'</Types>';

const rootRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
'</Relationships>';

const docRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
'<Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
'<Relationship Id="rIdNum" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>' +
'<Relationship Id="rIdHdr" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>' +
'<Relationship Id="rIdFtr" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>' +
'<Relationship Id="rIdImg" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image1.png"/>' +
'<Relationship Id="rIdLink" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="https://example.com/torture" TargetMode="External"/>' +
'</Relationships>';

const stylesXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
'<w:styles ' + NS + '>' +
'<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="22"/></w:rPr></w:rPrDefault></w:docDefaults>' +
'<w:style w:type="paragraph" w:styleId="Normal" w:default="1"><w:name w:val="Normal"/></w:style>' +
'<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/>' +
  '<w:pPr><w:outlineLvl w:val="0"/><w:spacing w:before="240" w:after="120"/></w:pPr>' +
  '<w:rPr><w:rFonts w:ascii="Calibri Light" w:hAnsi="Calibri Light"/><w:b/><w:sz w:val="48"/><w:color w:val="1F4E79"/></w:rPr></w:style>' +
'<w:style w:type="paragraph" w:styleId="ListParagraph"><w:name w:val="List Paragraph"/><w:basedOn w:val="Normal"/>' +
  '<w:pPr><w:ind w:left="720"/></w:pPr></w:style>' +
'</w:styles>';

const numberingXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
'<w:numbering ' + NS + '>' +
'<w:abstractNum w:abstractNumId="0"><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/>' +
  '<w:lvlText w:val="&#8226;"/><w:lvlJc w:val="left"/>' +
  '<w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr>' +
  '<w:rPr><w:rFonts w:ascii="Symbol" w:hAnsi="Symbol"/></w:rPr></w:lvl></w:abstractNum>' +
'<w:abstractNum w:abstractNumId="1"><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="decimal"/>' +
  '<w:lvlText w:val="%1."/><w:lvlJc w:val="left"/>' +
  '<w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum>' +
'<w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>' +
'<w:num w:numId="2"><w:abstractNumId w:val="1"/></w:num>' +
'</w:numbering>';

const headerXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
'<w:hdr ' + NS + '>' +
para(run('M19 Running header &#8212; ConvertOcean fidelity fixture', '<w:sz w:val="18"/><w:color w:val="666666"/>'),
     '<w:jc w:val="right"/>') +
'</w:hdr>';

/* The footer carries a real PAGE field, not literal text: a converter that
   flattens fields will show "1" on every page, which the assertion catches. */
const footerXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
'<w:ftr ' + NS + '><w:p><w:pPr><w:jc w:val="center"/></w:pPr>' +
'<w:r><w:rPr><w:sz w:val="18"/></w:rPr><w:t xml:space="preserve">M20 Page </w:t></w:r>' +
'<w:r><w:fldChar w:fldCharType="begin"/></w:r>' +
'<w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r>' +
'<w:r><w:fldChar w:fldCharType="separate"/></w:r>' +
'<w:r><w:t>1</w:t></w:r>' +
'<w:r><w:fldChar w:fldCharType="end"/></w:r>' +
'</w:p></w:ftr>';

/* ----------------------------------------------------------------- emit */

const out = TESTING_PATHS.fixture('torture.docx');
const bytes = await writePackage({
  '[Content_Types].xml': contentTypes,
  '_rels/.rels': rootRels,
  'word/document.xml': documentXml,
  'word/styles.xml': stylesXml,
  'word/numbering.xml': numberingXml,
  'word/header1.xml': headerXml,
  'word/footer1.xml': footerXml,
  'word/_rels/document.xml.rels': docRels,
  'word/media/image1.png': markerPng(),
}, out);

console.log('torture.docx  ' + bytes + ' bytes  ' + documentXml.length + ' chars of WordprocessingML');
