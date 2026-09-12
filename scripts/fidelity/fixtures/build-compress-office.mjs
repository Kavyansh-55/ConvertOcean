/**
 * Builds `torture-compress.pptx` — the fixture for the office compressors.
 *
 * Same philosophy as `build-compress-pdf.mjs`: a compressor can score well on
 * "did it get smaller" by doing something destructive, so this file is built
 * mostly out of things it must leave **alone**, with a few it must genuinely
 * shrink. A tool that scores 100% here found the bytes without breaking the
 * deck.
 *
 * PowerPoint is the right first target for this engine, and this fixture is
 * shaped by why: presentation bloat is almost entirely oversized images. A
 * ten-slide deck with one phone photo per slide reaches 80 MB, and every one
 * of those photos is stored at camera resolution and displayed in a box a few
 * inches wide.
 *
 *   Slide 1 — a 1600x1200 photographic PNG displayed at 4.0x3.0in. That is
 *             400 DPI doing a 150 DPI job: the case carrying nearly all the
 *             real saving. Must shrink.
 *   Slide 2 — three images that must be treated three different ways:
 *             a 1200x900 photographic PNG at 300 DPI (must shrink); a 1200x900
 *             flat-colour graphic also at 300 DPI, which deflates to almost
 *             nothing and would get *bigger* as a JPEG (must not grow); and a
 *             240x160 image displayed at its natural 96 DPI (must come back
 *             byte-identical). "Downsample anything over the target" fails two
 *             of these.
 *   Slide 3 — a transparent PNG over a solid magenta bar. **The OOXML-specific
 *             trap**: a PDF keeps alpha in a separate /SMask so flattening the
 *             colour channel is survivable, but a PPTX has one file and
 *             nowhere else for the alpha to go. Encode it as JPEG and the bar
 *             vanishes behind a white box. Must come back byte-identical.
 *   Slide 4 — no images at all: text runs, a hyperlink, a table and speaker
 *             notes. This slide exists so that a compressor which rebuilds the
 *             package and drops parts it did not understand fails loudly
 *             instead of passing.
 *
 * Markers M01-M10 are planted in the text so a failure names the feature
 * rather than handing over a diff.
 */
import { writeFileSync, statSync } from 'node:fs';
import * as TESTING_PATHS from '../../testing-paths.mjs';
import { writePackage, xmlEscape } from '../lib/ooxml.mjs';
import { makePng, makePngRgba } from '../lib/png.mjs';
import { scanLikeShade, flatGraphicShade, discAlphaShade } from '../lib/test-images.mjs';

/** OOXML measures everything in English Metric Units: 914,400 to the inch. */
const EMU = 914400;
const inches = (n) => Math.round(n * EMU);

/* ----------------------------------------------------------------- images */

/* Sizes chosen so the effective DPI lands unambiguously on one side of the
   150 DPI target — a fixture that sits near the boundary turns a policy
   change into a mystery failure. */
const photoBig = makePng(1600, 1200, scanLikeShade(1600, 1200));      // 400 DPI at 4in
const photoMid = makePng(1200, 900, scanLikeShade(1200, 900));        // 300 DPI at 4in
const graphic = makePng(1200, 900, flatGraphicShade(1200, 900));      // 300 DPI, but flat
const rightSized = makePng(240, 160, scanLikeShade(240, 160));        // 96 DPI at 2.5in
const transparent = makePngRgba(400, 400, discAlphaShade(400, 400));  // alpha, must survive

/* --------------------------------------------------------------- XML bits */

const nsP = 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
  + 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
  + 'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"';

/** A picture shape: the image, and the size it is actually displayed at. */
function pic(id, name, embedId, xIn, yIn, wIn, hIn) {
  return `<p:pic><p:nvPicPr><p:cNvPr id="${id}" name="${xmlEscape(name)}"/>`
    + `<p:cNvPicPr/><p:nvPr/></p:nvPicPr>`
    + `<p:blipFill><a:blip r:embed="${embedId}"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>`
    + `<p:spPr><a:xfrm><a:off x="${inches(xIn)}" y="${inches(yIn)}"/>`
    + `<a:ext cx="${inches(wIn)}" cy="${inches(hIn)}"/></a:xfrm>`
    + `<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic>`;
}

/** A text box. Markers live in here. */
function textBox(id, xIn, yIn, wIn, hIn, runs) {
  const body = runs.map((r) => `<a:r><a:rPr lang="en-US" sz="${r.sz || 1800}"`
    + `${r.b ? ' b="1"' : ''}/><a:t>${xmlEscape(r.t)}</a:t></a:r>`).join('');
  return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="text${id}"/>`
    + `<p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr>`
    + `<p:spPr><a:xfrm><a:off x="${inches(xIn)}" y="${inches(yIn)}"/>`
    + `<a:ext cx="${inches(wIn)}" cy="${inches(hIn)}"/></a:xfrm>`
    + `<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>`
    + `<p:txBody><a:bodyPr/><a:lstStyle/><a:p>${body}</a:p></p:txBody></p:sp>`;
}

/** A solid coloured rectangle — the thing a flattened PNG would hide. */
function bar(id, xIn, yIn, wIn, hIn, hex) {
  return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="bar${id}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>`
    + `<p:spPr><a:xfrm><a:off x="${inches(xIn)}" y="${inches(yIn)}"/>`
    + `<a:ext cx="${inches(wIn)}" cy="${inches(hIn)}"/></a:xfrm>`
    + `<a:prstGeom prst="rect"><a:avLst/></a:prstGeom>`
    + `<a:solidFill><a:srgbClr val="${hex}"/></a:solidFill></p:spPr>`
    + `<p:txBody><a:bodyPr/><a:lstStyle/><a:p/></p:txBody></p:sp>`;
}

const slide = (shapes) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld ${nsP}><p:cSld><p:spTree>
<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
<p:grpSpPr/>${shapes}</p:spTree></p:cSld></p:sld>`;

const relsFor = (entries) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${entries}</Relationships>`;

const imgRel = (id, target) => `<Relationship Id="${id}" `
  + `Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" `
  + `Target="${target}"/>`;

/* ------------------------------------------------------------- the slides */

const slide1 = slide(
  textBox(2, 0.4, 0.3, 9, 0.8, [{ t: 'M01 Oversized photo, 400 DPI in a 4 inch box', b: true }])
  + pic(3, 'M02 photo-big', 'rId2', 0.4, 1.3, 4.0, 3.0),
);

const slide2 = slide(
  textBox(2, 0.4, 0.2, 9, 0.6, [{ t: 'M03 Three images, three correct answers', b: true }])
  + pic(3, 'M04 photo-mid', 'rId2', 0.4, 1.0, 4.0, 3.0)
  + pic(4, 'M05 flat-graphic', 'rId3', 4.8, 1.0, 4.0, 3.0)
  + pic(5, 'M06 right-sized', 'rId4', 0.4, 4.3, 2.5, 1.67),
);

const slide3 = slide(
  textBox(2, 0.4, 0.2, 9, 0.6, [{ t: 'M07 Transparency: the bar must stay visible', b: true }])
  /* The bar is drawn first so the transparent disc sits over it. Flatten the
     PNG onto white and this magenta disappears — the loudest possible signal
     for a subtle bug. */
  + bar(3, 0.8, 1.6, 4.0, 0.6, 'CC00AA')
  + pic(4, 'M08 transparent-disc', 'rId2', 1.2, 1.0, 2.0, 2.0),
);

const slide4 = slide(
  textBox(2, 0.4, 0.3, 9, 0.8, [{ t: 'M09 No images here at all', b: true }])
  + textBox(3, 0.4, 1.4, 9, 3.0, [
    { t: 'M10 This slide is text only. A compressor that rebuilds the package ' },
    { t: 'and drops what it did not understand loses this slide, and that is the ' },
    { t: 'failure this slide exists to make loud.' },
  ]),
);

/* --------------------------------------------------------------- package */

const parts = {
  '[Content_Types].xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Default Extension="png" ContentType="image/png"/>
<Default Extension="jpeg" ContentType="image/jpeg"/>
<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
<Override PartName="/ppt/slides/slide1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
<Override PartName="/ppt/slides/slide2.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
<Override PartName="/ppt/slides/slide3.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
<Override PartName="/ppt/slides/slide4.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
</Types>`,

  '_rels/.rels': relsFor('<Relationship Id="rId1" '
    + 'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" '
    + 'Target="ppt/presentation.xml"/>'),

  'ppt/presentation.xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation ${nsP}><p:sldIdLst>
<p:sldId id="256" r:id="rId1"/><p:sldId id="257" r:id="rId2"/>
<p:sldId id="258" r:id="rId3"/><p:sldId id="259" r:id="rId4"/>
</p:sldIdLst><p:sldSz cx="${inches(10)}" cy="${inches(7.5)}"/>
<p:notesSz cx="${inches(7.5)}" cy="${inches(10)}"/></p:presentation>`,

  'ppt/_rels/presentation.xml.rels': relsFor([1, 2, 3, 4].map((n) =>
    `<Relationship Id="rId${n}" `
    + `Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" `
    + `Target="slides/slide${n}.xml"/>`).join('')),

  'ppt/slides/slide1.xml': slide1,
  'ppt/slides/slide2.xml': slide2,
  'ppt/slides/slide3.xml': slide3,
  'ppt/slides/slide4.xml': slide4,

  'ppt/slides/_rels/slide1.xml.rels': relsFor(imgRel('rId2', '../media/photo-big.png')),
  'ppt/slides/_rels/slide2.xml.rels': relsFor(
    imgRel('rId2', '../media/photo-mid.png')
    + imgRel('rId3', '../media/graphic.png')
    + imgRel('rId4', '../media/right-sized.png'),
  ),
  'ppt/slides/_rels/slide3.xml.rels': relsFor(imgRel('rId2', '../media/transparent.png')),
  'ppt/slides/_rels/slide4.xml.rels': relsFor(''),

  'ppt/media/photo-big.png': photoBig,
  'ppt/media/photo-mid.png': photoMid,
  'ppt/media/graphic.png': graphic,
  'ppt/media/right-sized.png': rightSized,
  'ppt/media/transparent.png': transparent,
};

TESTING_PATHS.ensureTestingDirs();
const out = TESTING_PATHS.fixture('torture-compress.pptx');
await writePackage(parts, out);

const kb = (b) => (b / 1024).toFixed(1) + ' KB';
console.log('torture-compress.pptx  ' + kb(statSync(out).size));
console.log('  photo-big    1600x1200 at 4.0in  = 400 DPI   must shrink');
console.log('  photo-mid    1200x900  at 4.0in  = 300 DPI   must shrink');
console.log('  graphic      1200x900  at 4.0in  = 300 DPI   must NOT grow (' + kb(graphic.length) + ')');
console.log('  right-sized  240x160   at 2.5in  =  96 DPI   must be byte-identical');
console.log('  transparent  400x400   alpha               must be byte-identical');
