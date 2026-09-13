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
  planResample, judgeCandidate, encodeJpeg, dialToSettings, EMU_PER_POINT,
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
/**
 * How many megapixels of decoded bitmap to keep in memory at once.
 *
 * Target-size mode encodes the same images several times, and decoding them
 * again on every pass would make it unusably slow. Holding all of them is
 * worse: a 25 MB deck can be fifty 8-megapixel photos, which is about 1.7 GB
 * of RGBA and does not fail gracefully — it freezes the tab and the browser
 * kills it. That is the exact failure a byte limit alone does not prevent, and
 * it was found the hard way in the PDF compressor. So the cache is capped and
 * spills to re-decoding: slower past the cap, but it finishes.
 */
const DECODE_CAP_MEGAPIXELS = 48;

/**
 * Compress an OOXML file. Returns `{ bytes, report }`.
 *
 * `options.targetBytes` switches on target-size mode, which searches for the
 * gentlest setting that still comes in under the limit.
 *
 * `JSZipLib` is passed in rather than reached for, so this module stays
 * testable and the CDN-recovery bootstrap remains the one place that decides
 * whether the library really arrived.
 */
export async function compressOoxml(bytes, options, JSZipLib, hooks) {
  const opts = Object.assign({ dpi: 150, quality: 0.72, targetBytes: null }, options || {});
  const on = Object.assign({ progress: () => {}, yield: () => Promise.resolve() }, hooks || {});

  const zip = await JSZipLib.loadAsync(bytes);
  on.progress(8, 'Reading the document…');

  const placements = await measurePlacements(zip);
  on.progress(18, 'Measuring how each image is displayed…');

  /* ---- pass one: look at every image exactly once --------------------- */

  const imageParts = Object.keys(zip.files).filter((p) => IMAGE_RE.test(p) && !zip.files[p].dir);
  const entries = [];
  let cachedMegapixels = 0;

  for (let k = 0; k < imageParts.length; k++) {
    const path = imageParts[k];
    on.progress(18 + Math.round((k / Math.max(1, imageParts.length)) * 30),
      `Checking image ${k + 1} of ${imageParts.length}…`);
    await on.yield();

    const raw = new Uint8Array(await zip.file(path).async('uint8array'));
    const isPng = /\.png$/i.test(path);
    const dims = isPng ? pngSize(raw) : jpegSize(raw);
    const name = path.split('/').pop();

    if (!dims) {
      entries.push({ path, name, raw, skip: 'the image header could not be read' });
      continue;
    }

    const base = { path, name, raw, dims, isPng, drawn: placements.get(path) || null };

    /* Transparency is decided once, here, and never revisited: it does not
       depend on the settings, and it is the one check that must happen before
       the shared policy is consulted at all. */
    let bitmap = null;
    try {
      bitmap = await createImageBitmap(new Blob([raw], { type: isPng ? 'image/png' : 'image/jpeg' }));
    } catch {
      entries.push({ ...base, skip: 'this image could not be decoded, so it was left as it was' });
      continue;
    }

    if (isPng) {
      const probe = new OffscreenCanvas(bitmap.width, bitmap.height);
      const pctx = probe.getContext('2d', { willReadFrequently: true });
      pctx.drawImage(bitmap, 0, 0);
      if (hasTransparency(pctx, bitmap.width, bitmap.height)) {
        bitmap.close?.();
        entries.push({ ...base, skip: 'it has transparent areas, and JPEG cannot keep those' });
        continue;
      }
    }

    const mp = (dims.width * dims.height) / 1e6;
    if (cachedMegapixels + mp <= DECODE_CAP_MEGAPIXELS) {
      cachedMegapixels += mp;
      entries.push({ ...base, bitmap });
    } else {
      /* Over the cap: keep the entry but not the pixels, and decode again on
         demand. Slower, and it finishes. */
      bitmap.close?.();
      entries.push({ ...base, bitmap: null });
    }
  }

  /* ---- pass two: encode them at a given setting ------------------------ */

  async function bitmapFor(e) {
    if (e.bitmap) return { bitmap: e.bitmap, temporary: false };
    const b = await createImageBitmap(
      new Blob([e.raw], { type: e.isPng ? 'image/png' : 'image/jpeg' }));
    return { bitmap: b, temporary: true };
  }

  async function encodeAt(settings, label, from, span) {
    const out = [];
    for (let k = 0; k < entries.length; k++) {
      const e = entries[k];
      if (span) {
        on.progress(from + Math.round((k / Math.max(1, entries.length)) * span), label);
        await on.yield();
      }

      const common = {
        name: e.name,
        width: e.dims ? e.dims.width : undefined,
        height: e.dims ? e.dims.height : undefined,
        bytes: e.raw.length,
      };

      if (e.skip) { out.push({ e, summary: { ...common, action: 'kept', reason: e.skip } }); continue; }

      const plan = planResample({
        width: e.dims.width,
        height: e.dims.height,
        originalBytes: e.raw.length,
        lossy: !e.isPng,
        drawnPt: e.drawn,
      }, settings);

      const withDisplay = {
        ...common,
        displayedPt: plan.base.drawnPt,
        effectiveDpi: plan.base.effectiveDpi,
      };

      if (plan.skip) {
        out.push({ e, summary: { ...withDisplay, action: 'kept', reason: plan.reason } });
        continue;
      }

      const { bitmap, temporary } = await bitmapFor(e);
      const candidate = await encodeJpeg(bitmap, plan.outW, plan.outH, plan.quality);
      if (temporary) bitmap.close?.();

      const verdict = judgeCandidate(plan, candidate.length);
      if (!verdict.accept) {
        out.push({ e, summary: { ...withDisplay, action: 'kept', reason: verdict.reason } });
        continue;
      }

      out.push({
        e,
        bytes: candidate,
        summary: {
          ...withDisplay, action: 'shrunk',
          newWidth: plan.outW, newHeight: plan.outH, newBytes: candidate.length,
        },
      });
    }
    return out;
  }

  /* The size a result would be, without rezipping to find out. Images are
     already compressed, so the archive stores them essentially as-is and the
     difference in image bytes is the difference in file size to within a
     rounding error. Good enough to steer a search; the number reported to the
     reader is always measured from the real file. */
  const estimate = (results) => bytes.length
    - results.reduce((n, r) => n + (r.bytes ? r.e.raw.length - r.bytes.length : 0), 0);

  /* ---- choose a setting ------------------------------------------------ */

  let results;
  let targetMet = null;

  if (opts.targetBytes) {
    let lo = 0, hi = 1, best = null;
    const MAX_PASSES = 6;
    for (let p = 0; p < MAX_PASSES; p++) {
      const t = (lo + hi) / 2;
      const settings = dialToSettings(t);
      on.progress(50 + Math.round((p / MAX_PASSES) * 30),
        `Fitting your document to that size — attempt ${p + 1}…`);
      const attempt = await encodeAt(settings, `Fitting your document to that size — attempt ${p + 1}…`, 0, 0);
      const size = estimate(attempt);

      /* "Closest to the target" is the wrong thing to keep. A result over the
         limit has failed the request outright, and among results that fit, the
         largest gave away the least quality. So prefer any fit over any miss,
         then the biggest fit; only if nothing fits does the smallest attempt
         become the best on offer. */
      const fits = size <= opts.targetBytes;
      const bestFits = best ? best.size <= opts.targetBytes : false;
      const better = !best
        || (fits && !bestFits)
        || (fits && bestFits && size > best.size)
        || (!fits && !bestFits && size < best.size);
      if (better) best = { results: attempt, size, settings };

      if (fits) hi = t; else lo = t;
    }
    results = best.results;
    targetMet = best.size <= opts.targetBytes;
  } else {
    results = await encodeAt({ dpi: opts.dpi, quality: opts.quality },
      'Compressing images…', 50, 30);
  }

  for (const e of entries) e.bitmap?.close?.();

  /* ---- write the file -------------------------------------------------- */

  on.progress(85, 'Putting the document back together…');
  const renames = new Map();
  const images = [];

  for (const r of results) {
    images.push(r.summary);
    if (!r.bytes) continue;
    const newPath = r.e.path.replace(/\.(png|jpe?g)$/i, '.jpeg');
    zip.remove(r.e.path);
    zip.file(newPath, r.bytes);
    if (newPath !== r.e.path) renames.set(r.e.path, newPath);
  }

  if (renames.size) await applyRenames(zip, renames);
  await ensureJpegContentType(zip);

  const out = await zip.generateAsync({
    type: 'uint8array',
    compression: 'DEFLATE',
    /* Level 9 applies only to the parts replaced above. JSZip copies the
       already-compressed stream of every entry it was not asked to change, so
       the document XML is never re-deflated here — verified by regenerating a
       loaded package with nothing touched and getting back a byte-identical
       file. That matters, because re-deflating repetitive XML at level 9 is
       not automatically a win: on a sheet of 40,000 near-identical rows it
       produced a file 46% LARGER than level 6. Anything that rebuilds a
       package entry by entry has to measure rather than assume. */
    compressionOptions: { level: 9 },
  });

  /* The same guard `pdf-compress.js` carries, for the same reason: a
     compressor that hands back something larger than it was given has failed
     at its one job. No input is currently known to reach this — every image
     decision already refuses to grow a part, and untouched parts are copied
     rather than recompressed — so this is insurance against a future change
     to either of those, not a fix for an observed failure. */
  if (out.length >= bytes.length) {
    return {
      bytes,
      report: {
        originalBytes: bytes.length,
        newBytes: bytes.length,
        imagesFound: images.length,
        imagesShrunk: 0,
        bytesSavedOnImages: 0,
        /* Same shape as the normal return. A report missing `targetMet`
           would read as `undefined` in the panel that says whether the size
           you asked for was reached, which is worse than saying "no". */
        targetBytes: opts.targetBytes || null,
        targetMet: opts.targetBytes ? bytes.length <= opts.targetBytes : null,
        images,
        noGain: true,
      },
    };
  }

  const shrunk = images.filter((im) => im.action === 'shrunk');
  const saved = shrunk.reduce((n, im) => n + (im.bytes - im.newBytes), 0);
  on.progress(100, 'Done');

  return {
    bytes: out,
    report: {
      originalBytes: bytes.length,
      newBytes: out.length,
      imagesFound: images.length,
      imagesShrunk: shrunk.length,
      bytesSavedOnImages: saved,
      /* Measured from the real file, not from the estimate the search used —
         reporting "met" off an approximation would be a lie the reader could
         check. */
      targetBytes: opts.targetBytes || null,
      targetMet: opts.targetBytes ? out.length <= opts.targetBytes : null,
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
