/**
 * Builds `torture.pptx` — the presentation fixture.
 *
 * PptxTool.astro renders slides itself rather than leaning on a library, so
 * this fixture targets that renderer's seams specifically: theme colour
 * resolution (a run that says "accent1", not a hex), a gradient background,
 * a picture, a real table, a rotated shape, an explicit non-theme font, and
 * speaker notes. It also carries text at a known size in a known position so
 * the export-resolution assertion has something crisp to measure.
 *
 * 16:9 deck: 12192000 x 6858000 EMU (13.333in x 7.5in).
 */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { markerPng } from '../lib/png.mjs';
import { writePackage } from '../lib/ooxml.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const DECL = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const P = 'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"';
const A = 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"';
const R = 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
const NS = `${P} ${A} ${R}`;

const EMU_W = 12192000;
const EMU_H = 6858000;

/** A shape's position/size block. */
function xfrm(x, y, cx, cy, rot) {
  const r = rot ? ` rot="${rot}"` : '';
  return `<a:xfrm${r}><a:off x="${x}" y="${y}"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm>`;
}

/**
 * A text-box shape. `runs` is an array of { text, sizePt, bold, color, font },
 * where `color` may be a theme token ("accent1") or a hex ("FF0000").
 */
function textBox(id, name, geom, runs, align = 'l') {
  const body = runs.map((r) => {
    const fill = r.color
      ? (/^[0-9A-Fa-f]{6}$/.test(r.color)
          ? `<a:solidFill><a:srgbClr val="${r.color}"/></a:solidFill>`
          : `<a:solidFill><a:schemeClr val="${r.color}"/></a:solidFill>`)
      : '';
    const font = r.font ? `<a:latin typeface="${r.font}"/>` : '';
    const props = `<a:rPr lang="en-US" sz="${Math.round((r.sizePt || 18) * 100)}"` +
      (r.bold ? ' b="1"' : '') + '>' + fill + font + '</a:rPr>';
    return `<a:r>${props}<a:t>${r.text}</a:t></a:r>`;
  }).join('');
  return `<p:sp>` +
    `<p:nvSpPr><p:cNvPr id="${id}" name="${name}"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr>` +
    `<p:spPr>${geom}<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>` +
    `<p:txBody><a:bodyPr wrap="square"/><a:lstStyle/>` +
    `<a:p><a:pPr algn="${align}"/>${body}</a:p></p:txBody>` +
  `</p:sp>`;
}

/* ---------------------------------------------------------------- slides */

/* M01 title slide — accent1 theme fill, so a renderer that ignores the theme
   map produces the wrong colour rather than merely the wrong shade. */
const slide1 = DECL + `<p:sld ${NS}><p:cSld>` +
  '<p:bg><p:bgPr><a:gradFill><a:gsLst>' +
    '<a:gs pos="0"><a:schemeClr val="accent1"/></a:gs>' +
    '<a:gs pos="100000"><a:schemeClr val="accent2"/></a:gs>' +
  '</a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill><a:effectLst/></p:bgPr></p:bg>' +
  '<p:spTree>' +
    '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>' +
    '<p:grpSpPr/>' +
    textBox(2, 'Title', xfrm(838200, 2130425, 10515600, 1470025),
      [{ text: 'M01 Torture Deck', sizePt: 44, bold: true, color: 'FFFFFF' }], 'ctr') +
    textBox(3, 'Subtitle', xfrm(838200, 3600450, 10515600, 800100),
      [{ text: 'M02 Subtitle in an explicitly named font', sizePt: 20, color: 'FFFFFF', font: 'Georgia' }], 'ctr') +
  '</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>';

/* M03-M06 content slide — bullets, picture, rotated box, theme-coloured run. */
const slide2 = DECL + `<p:sld ${NS}><p:cSld><p:spTree>` +
  '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>' +
  '<p:grpSpPr/>' +
  textBox(2, 'Heading', xfrm(628650, 457200, 10934700, 800100),
    [{ text: 'M03 Content, picture and rotation', sizePt: 32, bold: true, color: 'accent1' }]) +
  // three bullet lines in one body
  '<p:sp><p:nvSpPr><p:cNvPr id="3" name="Bullets"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr>' +
    `<p:spPr>${xfrm(628650, 1600200, 5486400, 2971800)}<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>` +
    '<p:txBody><a:bodyPr wrap="square"/><a:lstStyle/>' +
      '<a:p><a:pPr marL="285750" indent="-285750"><a:buChar char="&#8226;"/></a:pPr>' +
        '<a:r><a:rPr lang="en-US" sz="2000"/><a:t>M04 First bullet at 20pt</a:t></a:r></a:p>' +
      '<a:p><a:pPr marL="285750" indent="-285750"><a:buChar char="&#8226;"/></a:pPr>' +
        '<a:r><a:rPr lang="en-US" sz="2000" b="1"><a:solidFill><a:srgbClr val="C00000"/></a:solidFill></a:rPr>' +
        '<a:t>M05 Second bullet, bold dark red</a:t></a:r></a:p>' +
      '<a:p><a:pPr marL="285750" indent="-285750"><a:buChar char="&#8226;"/></a:pPr>' +
        '<a:r><a:rPr lang="en-US" sz="1400"/><a:t>M06 Third bullet, smaller at 14pt</a:t></a:r></a:p>' +
    '</p:txBody></p:sp>' +
  // M07 picture
  '<p:pic><p:nvPicPr><p:cNvPr id="4" name="M07 marker"/><p:cNvPicPr/><p:nvPr/></p:nvPicPr>' +
    '<p:blipFill><a:blip r:embed="rIdImg"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>' +
    `<p:spPr>${xfrm(6600825, 1600200, 2286000, 1524000)}<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>` +
  '</p:pic>' +
  // M08 rotated text box (15 degrees = 900000 in 60000ths of a degree)
  textBox(5, 'Rotated', xfrm(6600825, 3600450, 3200400, 685800, 900000),
    [{ text: 'M08 rotated 15 degrees', sizePt: 18, bold: true, color: 'accent2' }]) +
  '</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>';

/* M09 table slide — a graphicFrame, which is a different code path again. */
function tc(text, bold, fillHex) {
  const fill = fillHex ? `<a:solidFill><a:srgbClr val="${fillHex}"/></a:solidFill>` : '';
  const rPr = `<a:rPr lang="en-US" sz="1600"${bold ? ' b="1"' : ''}>` +
    (fillHex ? '<a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill>' : '') + '</a:rPr>';
  return '<a:tc><a:txBody><a:bodyPr/><a:lstStyle/><a:p>' +
    `<a:r>${rPr}<a:t>${text}</a:t></a:r>` +
    `</a:p></a:txBody><a:tcPr>${fill}</a:tcPr></a:tc>`;
}

const slide3 = DECL + `<p:sld ${NS}><p:cSld><p:spTree>` +
  '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>' +
  '<p:grpSpPr/>' +
  textBox(2, 'Heading', xfrm(628650, 457200, 10934700, 800100),
    [{ text: 'M09 Table slide', sizePt: 32, bold: true, color: 'accent1' }]) +
  '<p:graphicFrame><p:nvGraphicFramePr><p:cNvPr id="3" name="Table"/><p:cNvGraphicFramePr/><p:nvPr/></p:nvGraphicFramePr>' +
    `<p:xfrm><a:off x="628650" y="1600200"/><a:ext cx="8229600" cy="2286000"/></p:xfrm>` +
    '<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/table">' +
      '<a:tbl><a:tblPr firstRow="1" bandRow="1"/>' +
      '<a:tblGrid><a:gridCol w="4114800"/><a:gridCol w="2057400"/><a:gridCol w="2057400"/></a:tblGrid>' +
      '<a:tr h="457200">' + tc('M10 Product', true, '1F4E79') + tc('Units', true, '1F4E79') + tc('Revenue', true, '1F4E79') + '</a:tr>' +
      '<a:tr h="457200">' + tc('Widget') + tc('1,240') + tc('$18,600') + '</a:tr>' +
      '<a:tr h="457200">' + tc('Gadget') + tc('980') + tc('$14,700') + '</a:tr>' +
      '</a:tbl>' +
    '</a:graphicData></a:graphic>' +
  '</p:graphicFrame>' +
  '</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>';

/* M11 speaker notes — lost by every raster export. */
const notesSlide1 = DECL + `<p:notes ${NS}><p:cSld><p:spTree>` +
  '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/>' +
  '<p:sp><p:nvSpPr><p:cNvPr id="2" name="Notes Placeholder"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr>' +
    '<p:nvPr><p:ph type="body" idx="1"/></p:nvPr></p:nvSpPr><p:spPr/>' +
    '<p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="en-US"/>' +
    '<a:t>M11 Speaker notes for slide one.</a:t></a:r></a:p></p:txBody></p:sp>' +
  '</p:spTree></p:cSld></p:notes>';

/* ------------------------------------------------------- master + layout */

const slideLayout1 = DECL + `<p:sldLayout ${NS} type="blank" preserve="1"><p:cSld name="Blank"><p:spTree>` +
  '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/>' +
  '</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>';

const slideMaster1 = DECL + `<p:sldMaster ${NS}><p:cSld>` +
  '<p:bg><p:bgPr><a:solidFill><a:schemeClr val="bg1"/></a:solidFill><a:effectLst/></p:bgPr></p:bg>' +
  '<p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree>' +
  '</p:cSld>' +
  '<p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" ' +
    'accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>' +
  '<p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rIdLayout1"/></p:sldLayoutIdLst>' +
  '</p:sldMaster>';

/* Distinctive theme colours: accent1 teal, accent2 magenta. Nothing near a
   default, so a renderer falling back to stock Office blue is obvious. */
const theme1 = DECL + `<a:theme ${A} name="TortureTheme"><a:themeElements>` +
  '<a:clrScheme name="Torture">' +
    '<a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1>' +
    '<a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1>' +
    '<a:dk2><a:srgbClr val="1F3864"/></a:dk2>' +
    '<a:lt2><a:srgbClr val="F2F2F2"/></a:lt2>' +
    '<a:accent1><a:srgbClr val="0F766E"/></a:accent1>' +
    '<a:accent2><a:srgbClr val="BE185D"/></a:accent2>' +
    '<a:accent3><a:srgbClr val="CA8A04"/></a:accent3>' +
    '<a:accent4><a:srgbClr val="4338CA"/></a:accent4>' +
    '<a:accent5><a:srgbClr val="0369A1"/></a:accent5>' +
    '<a:accent6><a:srgbClr val="B91C1C"/></a:accent6>' +
    '<a:hlink><a:srgbClr val="0563C1"/></a:hlink>' +
    '<a:folHlink><a:srgbClr val="954F72"/></a:folHlink>' +
  '</a:clrScheme>' +
  '<a:fontScheme name="Torture">' +
    '<a:majorFont><a:latin typeface="Georgia"/><a:ea typeface=""/><a:cs typeface=""/></a:majorFont>' +
    '<a:minorFont><a:latin typeface="Verdana"/><a:ea typeface=""/><a:cs typeface=""/></a:minorFont>' +
  '</a:fontScheme>' +
  '<a:fmtScheme name="Torture">' +
    '<a:fillStyleLst>' +
      '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>' +
      '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>' +
      '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>' +
    '</a:fillStyleLst>' +
    '<a:lnStyleLst>' +
      '<a:ln w="6350"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln>' +
      '<a:ln w="12700"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln>' +
      '<a:ln w="19050"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln>' +
    '</a:lnStyleLst>' +
    '<a:effectStyleLst>' +
      '<a:effectStyle><a:effectLst/></a:effectStyle>' +
      '<a:effectStyle><a:effectLst/></a:effectStyle>' +
      '<a:effectStyle><a:effectLst/></a:effectStyle>' +
    '</a:effectStyleLst>' +
    '<a:bgFillStyleLst>' +
      '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>' +
      '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>' +
      '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>' +
    '</a:bgFillStyleLst>' +
  '</a:fmtScheme>' +
  '</a:themeElements></a:theme>';

/* ---------------------------------------------------------- presentation */

const presentationXml = DECL + `<p:presentation ${NS}>` +
  '<p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rIdMaster1"/></p:sldMasterIdLst>' +
  '<p:sldIdLst>' +
    '<p:sldId id="256" r:id="rIdSlide1"/>' +
    '<p:sldId id="257" r:id="rIdSlide2"/>' +
    '<p:sldId id="258" r:id="rIdSlide3"/>' +
  '</p:sldIdLst>' +
  `<p:sldSz cx="${EMU_W}" cy="${EMU_H}"/><p:notesSz cx="${EMU_H}" cy="${EMU_W}"/>` +
  '</p:presentation>';

const rels = (list) => DECL +
  '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
  list.map(([id, type, target, mode]) =>
    `<Relationship Id="${id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/${type}" Target="${target}"${mode ? ` TargetMode="${mode}"` : ''}/>`
  ).join('') + '</Relationships>';

const contentTypes = DECL +
  '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
  '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
  '<Default Extension="xml" ContentType="application/xml"/>' +
  '<Default Extension="png" ContentType="image/png"/>' +
  '<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>' +
  '<Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>' +
  '<Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>' +
  '<Override PartName="/ppt/slides/slide1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>' +
  '<Override PartName="/ppt/slides/slide2.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>' +
  '<Override PartName="/ppt/slides/slide3.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>' +
  '<Override PartName="/ppt/notesSlides/notesSlide1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.notesSlide+xml"/>' +
  '<Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>' +
  '</Types>';

/* ----------------------------------------------------------------- emit */

const out = join(HERE, 'files', 'torture.pptx');
const bytes = await writePackage({
  '[Content_Types].xml': contentTypes,
  '_rels/.rels': rels([['rId1', 'officeDocument', 'ppt/presentation.xml']]),
  'ppt/presentation.xml': presentationXml,
  'ppt/_rels/presentation.xml.rels': rels([
    ['rIdMaster1', 'slideMaster', 'slideMasters/slideMaster1.xml'],
    ['rIdSlide1', 'slide', 'slides/slide1.xml'],
    ['rIdSlide2', 'slide', 'slides/slide2.xml'],
    ['rIdSlide3', 'slide', 'slides/slide3.xml'],
    ['rIdTheme', 'theme', 'theme/theme1.xml'],
  ]),
  'ppt/slideMasters/slideMaster1.xml': slideMaster1,
  'ppt/slideMasters/_rels/slideMaster1.xml.rels': rels([
    ['rIdLayout1', 'slideLayout', '../slideLayouts/slideLayout1.xml'],
    ['rIdTheme', 'theme', '../theme/theme1.xml'],
  ]),
  'ppt/slideLayouts/slideLayout1.xml': slideLayout1,
  'ppt/slideLayouts/_rels/slideLayout1.xml.rels': rels([
    ['rIdMaster1', 'slideMaster', '../slideMasters/slideMaster1.xml'],
  ]),
  'ppt/slides/slide1.xml': slide1,
  'ppt/slides/_rels/slide1.xml.rels': rels([
    ['rIdLayout', 'slideLayout', '../slideLayouts/slideLayout1.xml'],
    ['rIdNotes', 'notesSlide', '../notesSlides/notesSlide1.xml'],
  ]),
  'ppt/slides/slide2.xml': slide2,
  'ppt/slides/_rels/slide2.xml.rels': rels([
    ['rIdLayout', 'slideLayout', '../slideLayouts/slideLayout1.xml'],
    ['rIdImg', 'image', '../media/image1.png'],
  ]),
  'ppt/slides/slide3.xml': slide3,
  'ppt/slides/_rels/slide3.xml.rels': rels([
    ['rIdLayout', 'slideLayout', '../slideLayouts/slideLayout1.xml'],
  ]),
  'ppt/notesSlides/notesSlide1.xml': notesSlide1,
  'ppt/notesSlides/_rels/notesSlide1.xml.rels': rels([
    ['rIdSlide', 'slide', '../slides/slide1.xml'],
  ]),
  'ppt/theme/theme1.xml': theme1,
  'ppt/media/image1.png': markerPng(),
}, out);

console.log('torture.pptx  ' + bytes + ' bytes  3 slides, custom theme, table, picture, notes');
