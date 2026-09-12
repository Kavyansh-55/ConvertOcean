/**
 * Shrink a PowerPoint or Word file in the browser without breaking the document.
 *
 * A .pptx and a .docx are zip archives of XML plus a `media/` folder, and
 * presentation bloat is almost entirely that folder: a ten-slide deck with one
 * phone photo per slide reaches 80 MB, every photo stored at camera resolution
 * and displayed in a box a few inches wide. So this does the same job as
 * `/compress-pdf/` in a different container — find images stored at more
 * resolution than they are shown at, redraw those at a sane size, and put them
 * back. Slides, text, layouts, notes, tables, charts, fonts and every part it
 * does not understand are copied through untouched.
 *
 * The judgement lives in `image-compress.js`, shared with the PDF compressor,
 * because the question is identical whatever the container. What is genuinely
 * different here, and what this module exists to get right:
 *
 *  - **Transparency has nowhere to go.** A PDF keeps alpha in a separate
 *    /SMask stream, so flattening a colour channel is survivable. An OOXML
 *    part is one file: re-encode a transparent PNG as JPEG and every logo in
 *    the deck gains an opaque white box. Any image with a non-opaque pixel is
 *    left alone, checked by decoding rather than by trusting the header.
 *
 *  - **One image can be placed many times, at different sizes.** The same
 *    `media/image3.png` might be a thumbnail on one slide and full-bleed on
 *    another. Sizing it for the thumbnail would visibly wreck the big one, so
 *    every placement is measured and the **largest** wins.
 *
 *  - **Changing format means renaming the part.** A `.png` part holding JPEG
 *    bytes is a malformed package. When an image is re-encoded the part is
 *    renamed, every relationship pointing at it is rewritten, and the content
 *    type is declared.
 *
 * Everything runs on the reader's machine. Nothing is uploaded.
 */
import {
  planResample, judgeCandidate, encodeJpeg, EMU_PER_POINT,
} from './image-compress.js';

/** Parts that are images we might touch. Anything else is copied verbatim. */
const IMAGE_RE = /^(ppt|word|xl)\/media\/[^/]+\.(png|jpe?g)$/i;

/** Where the drawing XML lives, per format. */
const DRAWING_RE = /^(ppt\/slides\/slide\d+\.xml|ppt\/slideLayouts\/[^/]+\.xml|ppt\/slideMasters\/[^/]+\.xml|ppt\/notesSlides\/[^/]+\.xml|word\/document\.xml|word\/header\d*\.xml|word\/footer\d*\.xml)$/i;

/** `<a:ext cx cy>` in PPTX, `<wp:extent cx cy>` in DOCX. Both are EMUs. */
const EXT_RE = /<(?:a|wp):ext(?:ent)?\s+cx="(\d+)"\s+cy="(\d+)"/;
const EMBED_RE = /r:(?:embed|link)="([^"]+)"/;

/** The drawing element that pairs a picture with its size, in either format. */
const PIC_RE = /<(p:pic|pic:pic|w:drawing)\b[\s\S]*?<\/\1>/g;

/** Resolve a relationship target against the part that declared it. */
export function resolveTarget(ownerPath, target) {
  const base = ownerPath.split('/').slice(0, -1).join('/');
  const stack = base.split('/').filter(Boolean);
  for (const seg of target.split('/')) {
    if (seg === '..') stack.pop();
    else if (seg !== '.' && seg !== '') stack.push(seg);
  }
  return stack.join('/');
}

/** The `_rels` part that describes `path`. */
export const relsPathFor = (path) => {
  const bits = path.split('/');
  const file = bits.pop();
  return [...bits, '_rels', file + '.rels'].join('/');
};

/**
 * Every placement of every image, as `partPath -> largest displayed size`.
 *
 * Reading the XML with regexes rather than a DOM parser is deliberate: the
 * file is untrusted input, the shapes wanted here are narrow and well-defined,
 * and a full parse-and-reserialise round trip risks changing parts we have no
 * business changing. A placement that does not match is simply not measured,
 * and an unmeasured image is left alone — the safe failure.
 */
export async function measurePlacements(zip) {
  const sizes = new Map();

  for (const path of Object.keys(zip.files)) {
    if (!DRAWING_RE.test(path)) continue;
    const relsPath = relsPathFor(path);
    const relsFile = zip.file(relsPath);
    if (!relsFile) continue;

    const relsXml = await relsFile.async('string');
    const rels = new Map();
    for (const m of relsXml.matchAll(/Id="([^"]+)"[^>]*Target="([^"]+)"/g)) {
      rels.set(m[1], resolveTarget(path, m[2].replace(/^\//, '')));
    }

    const xml = await zip.file(path).async('string');
    for (const block of xml.match(PIC_RE) || []) {
      const embed = block.match(EMBED_RE);
      const ext = block.match(EXT_RE);
      if (!embed || !ext) continue;
      const target = rels.get(embed[1]);
      if (!target) continue;

      const wPt = Number(ext[1]) / EMU_PER_POINT;
      const hPt = Number(ext[2]) / EMU_PER_POINT;
      const prev = sizes.get(target);
      /* Largest placement wins: sizing for a thumbnail would visibly wreck the
         same image used full-bleed on another slide. */
      if (!prev || wPt * hPt > prev.w * prev.h) sizes.set(target, { w: wPt, h: hPt });
    }
  }
  return sizes;
}

/** PNG pixel size, straight out of the IHDR. */
export function pngSize(bytes) {
  if (bytes.length < 24) return null;
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (dv.getUint32(0) !== 0x89504e47) return null;
  return { width: dv.getUint32(16), height: dv.getUint32(20), colorType: bytes[25] };
}

/** JPEG pixel size, from the first start-of-frame marker. */
export function jpegSize(bytes) {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  let i = 2;
  while (i < bytes.length - 9) {
    if (bytes[i] !== 0xff) { i++; continue; }
    const marker = bytes[i + 1];
    /* SOF0-SOF15, skipping the four that are not frame headers. */
    if (marker >= 0xc0 && marker <= 0xcf
        && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      return { height: dv.getUint16(i + 5), width: dv.getUint16(i + 7) };
    }
    const len = (bytes[i + 2] << 8) | bytes[i + 3];
    i += 2 + (len || 2);
  }
  return null;
}

/**
 * Does this bitmap have a pixel that is not fully opaque?
 *
 * Checked by decoding rather than by reading the PNG colour type, because a
 * great many RGBA PNGs — screenshots especially — carry an alpha channel in
 * which every pixel is 255. Trusting the header would refuse to compress all
 * of them, which is most of the saving on a deck full of pasted screenshots.
 *
 * The decode has to happen anyway to re-encode, so this costs one pass over
 * the pixels and no extra decode.
 */
function hasTransparency(ctx, w, h) {
  const { data } = ctx.getImageData(0, 0, w, h);
  for (let i = 3; i < data.length; i += 4) if (data[i] !== 255) return true;
  return false;
}

/**
 * Compress an OOXML file. Returns `{ bytes, report }`.
 *
 * `JSZipLib` is passed in rather than reached for, so this module stays
 * testable and the CDN-recovery bootstrap remains the one place that decides
 * whether the library really arrived.
 */
export async function compressOoxml(bytes, options, JSZipLib, hooks) {
  const opts = Object.assign({ dpi: 150, quality: 0.72 }, options || {});
  const on = Object.assign({ progress: () => {}, yield: () => Promise.resolve() }, hooks || {});

  const zip = await JSZipLib.loadAsync(bytes);
  on.progress(10, 'Reading the document…');

  const placements = await measurePlacements(zip);
  on.progress(25, 'Measuring how each image is displayed…');

  const imageParts = Object.keys(zip.files).filter((p) => IMAGE_RE.test(p) && !zip.files[p].dir);
  const images = [];
  const renames = new Map();

  for (let i = 0; i < imageParts.length; i++) {
    const path = imageParts[i];
    on.progress(25 + Math.round((i / Math.max(1, imageParts.length)) * 55),
      `Checking image ${i + 1} of ${imageParts.length}…`);
    await on.yield();

    const raw = new Uint8Array(await zip.file(path).async('uint8array'));
    const isPng = /\.png$/i.test(path);
    const dims = isPng ? pngSize(raw) : jpegSize(raw);
    const name = path.split('/').pop();

    if (!dims) {
      images.push({ name, bytes: raw.length, action: 'kept', reason: 'the image header could not be read' });
      continue;
    }

    const drawn = placements.get(path) || null;
    const plan = planResample({
      width: dims.width,
      height: dims.height,
      originalBytes: raw.length,
      lossy: !isPng,
      drawnPt: drawn,
    }, opts);

    const base = {
      name, width: dims.width, height: dims.height, bytes: raw.length,
      displayedPt: plan.base.drawnPt,
      effectiveDpi: plan.base.effectiveDpi,
    };

    if (plan.skip) { images.push({ ...base, action: 'kept', reason: plan.reason }); continue; }

    /* Decode once: the alpha check and the re-encode share it. */
    let bitmap;
    try {
      bitmap = await createImageBitmap(new Blob([raw], { type: isPng ? 'image/png' : 'image/jpeg' }));
    } catch {
      images.push({ ...base, action: 'kept', reason: 'this image could not be decoded, so it was left as it was' });
      continue;
    }

    if (isPng) {
      const probe = new OffscreenCanvas(bitmap.width, bitmap.height);
      const pctx = probe.getContext('2d', { willReadFrequently: true });
      pctx.drawImage(bitmap, 0, 0);
      if (hasTransparency(pctx, bitmap.width, bitmap.height)) {
        bitmap.close?.();
        images.push({
          ...base, action: 'kept',
          reason: 'it has transparent areas, and JPEG cannot keep those',
        });
        continue;
      }
    }

    const candidate = await encodeJpeg(bitmap, plan.outW, plan.outH, plan.quality);
    bitmap.close?.();

    const verdict = judgeCandidate(plan, candidate.length);
    if (!verdict.accept) { images.push({ ...base, action: 'kept', reason: verdict.reason }); continue; }

    /* A .png part holding JPEG bytes is a malformed package, so the part is
       renamed and every relationship pointing at it is rewritten below. */
    const newPath = path.replace(/\.(png|jpe?g)$/i, '.jpeg');
    zip.remove(path);
    zip.file(newPath, candidate);
    if (newPath !== path) renames.set(path, newPath);

    images.push({
      ...base, action: 'shrunk',
      newWidth: plan.outW, newHeight: plan.outH, newBytes: candidate.length,
    });
  }

  on.progress(85, 'Putting the document back together…');
  if (renames.size) await applyRenames(zip, renames);
  await ensureJpegContentType(zip);

  const out = await zip.generateAsync({
    type: 'uint8array',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  const shrunk = images.filter((i) => i.action === 'shrunk');
  const saved = shrunk.reduce((n, i) => n + (i.bytes - i.newBytes), 0);
  on.progress(100, 'Done');

  return {
    bytes: out,
    report: {
      originalBytes: bytes.length,
      newBytes: out.length,
      imagesFound: images.length,
      imagesShrunk: shrunk.length,
      bytesSavedOnImages: saved,
      images,
    },
  };
}

/** Point every relationship at the renamed part. */
async function applyRenames(zip, renames) {
  for (const path of Object.keys(zip.files)) {
    if (!/\.rels$/i.test(path) || zip.files[path].dir) continue;
    let xml = await zip.file(path).async('string');
    let touched = false;
    for (const [from, to] of renames) {
      const fromName = from.split('/').pop();
      const toName = to.split('/').pop();
      if (fromName === toName) continue;
      /* Match the filename inside a Target attribute rather than the whole
         path: targets are written relative to the owning part, so the same
         image appears as "../media/x.png" here and "media/x.png" elsewhere. */
      if (xml.includes(fromName)) {
        xml = xml.split(fromName).join(toName);
        touched = true;
      }
    }
    if (touched) zip.file(path, xml);
  }
}

/**
 * Make sure the package declares what a .jpeg part is.
 *
 * Without this a renamed part has no content type and PowerPoint refuses the
 * file outright — which is the worst possible failure for a compressor,
 * because it is silent until the reader tries to open the result.
 */
async function ensureJpegContentType(zip) {
  const path = '[Content_Types].xml';
  const file = zip.file(path);
  if (!file) return;
  let xml = await file.async('string');
  if (/Extension="jpeg"/i.test(xml)) return;
  xml = xml.replace(/<Types([^>]*)>/i,
    '<Types$1><Default Extension="jpeg" ContentType="image/jpeg"/>');
  zip.file(path, xml);
}
