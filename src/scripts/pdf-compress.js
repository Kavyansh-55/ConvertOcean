/**
 * Shrink a PDF in the browser without making anything worse than it has to be.
 *
 * Almost every oversized PDF is oversized for one reason: raster images stored
 * at far more resolution than the page ever shows. A phone photo dropped into a
 * Word document arrives 4000px wide and gets drawn in a three-inch box — that
 * is ~1300 DPI of detail doing a 150 DPI job, and most of those bytes are never
 * looked at by anything.
 *
 * So this does not "compress a PDF". It finds images stored bigger than they
 * are drawn, redraws those at a sane resolution, and puts them back where they
 * were. Everything else — text, fonts, vector art, links, form fields,
 * bookmarks, page structure — is left untouched.
 *
 * The alternative, which several well-known tools effectively take, is to
 * render each page to a bitmap and build a new PDF from the bitmaps. That
 * reliably produces a smaller file and destroys the document: text stops being
 * selectable and searchable, links stop working, forms stop being fillable, and
 * crisp vector logos turn to mush. We never do that, at any setting.
 *
 * Four rules run throughout, and they are the whole difference between this and
 * a naive "downsample anything above 150 DPI" filter:
 *
 *   1. **Never grow a stream.** A re-encoded image is kept only if it came out
 *      meaningfully smaller. A flat-colour graphic that Deflate already holds
 *      in 6 KB becomes a 40 KB JPEG if you judge it on resolution alone, so
 *      every candidate is measured against what was there and discarded if it
 *      lost.
 *   2. **Never touch what is already the right size.** An image drawn at its
 *      natural resolution is left byte-identical. Re-encoding it can only cost
 *      quality.
 *   3. **Never turn lossless into lossy for small change.** A PNG-origin
 *      diagram already at the target resolution stays as it is. Only images
 *      that were already JPEG get a quality-only pass, and only when that pass
 *      is worth at least 15%.
 *   4. **Say what was skipped.** Every image the engine declines is reported
 *      with a reason. A tool that silently ignores half a file and announces
 *      "compressed" has misrepresented its own coverage.
 *
 * Everything runs on the reader's own machine. Nothing is sent anywhere.
 */

/* --------------------------------------------------------------- geometry */

/** Identity transform. PDF matrices are [a b c d e f]. */
export const IDENTITY = [1, 0, 0, 1, 0, 0];

/** Concatenate `m` onto `base` — the effect of a `cm` operator. */
export function matMul(m, base) {
  const [a, b, c, d, e, f] = m;
  const [A, B, C, D, E, F] = base;
  return [
    a * A + b * C,
    a * B + b * D,
    c * A + d * C,
    c * B + d * D,
    e * A + f * C + E,
    e * B + f * D + F,
  ];
}

/**
 * How big, in points, a unit-square image drawn under `ctm` comes out.
 *
 * Images in PDF are always drawn into the unit square and scaled by the
 * current transform, so the transform *is* the on-page size. Taking the
 * hypotenuse of each column rather than just |a| and |d| keeps this right for
 * rotated and flipped placements, which scanners produce constantly.
 */
export function drawnSize(ctm) {
  const [a, b, c, d] = ctm;
  return { w: Math.hypot(a, b), h: Math.hypot(c, d) };
}

/**
 * Stored pixels per inch of drawn space.
 *
 * Infinity for a zero-sized placement, which is a real thing in generated PDFs
 * (an image scaled to nothing, left behind by a template). Infinity is the
 * honest answer — it is infinitely over-resolution — and it makes the rule
 * below treat it as maximally shrinkable, which is correct.
 */
export function effectiveDpi(pixels, drawnPt) {
  if (!(drawnPt > 0)) return Infinity;
  return pixels / (drawnPt / 72);
}

/* -------------------------------------------------------------- tokenizer */

/**
 * Walk a content stream's operators, reporting every `Do` with the transform
 * in force at that point.
 *
 * A content stream is postfix: operands accumulate and an operator consumes
 * them. Only four operators matter here, so everything else simply clears the
 * operand list.
 *
 * The one genuinely dangerous construct is the inline image (`BI … ID <binary>
 * EI`), whose payload is arbitrary bytes that will certainly contain things
 * that look like `Q` or `cm`. Tokenizing straight through one corrupts the
 * transform stack for the rest of the page and silently misreports the DPI of
 * every image after it, so `ID` skips ahead to a whitespace-delimited `EI`.
 */
export function walkContentStream(text, onDo, initialCtm) {
  const saved = [];
  let ctm = initialCtm || IDENTITY;
  let operands = [];

  const re = /\/([^\s/<>\[\]()]+)|(-?\d*\.?\d+)|(<<|>>|\[|\])|([A-Za-z'"*]+[01*]?)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m[1] !== undefined) { operands.push({ name: m[1] }); continue; }
    if (m[2] !== undefined) { operands.push(parseFloat(m[2])); continue; }
    if (m[3] !== undefined) { continue; }

    switch (m[4]) {
      case 'q':
        saved.push(ctm);
        break;
      case 'Q':
        if (saved.length) ctm = saved.pop();
        break;
      case 'cm': {
        const n = operands.slice(-6);
        if (n.length === 6 && n.every((x) => typeof x === 'number')) ctm = matMul(n, ctm);
        break;
      }
      case 'Do': {
        const last = operands[operands.length - 1];
        if (last && last.name) onDo(last.name, ctm);
        break;
      }
      case 'ID': {
        /* Inline image payload — jump past it or its bytes get tokenized. */
        const end = /\sEI(?=[\s\]/<(]|$)/g;
        end.lastIndex = re.lastIndex;
        const hit = end.exec(text);
        re.lastIndex = hit ? end.lastIndex : text.length;
        break;
      }
      default:
        break;
    }
    operands = [];
  }
}

/* ------------------------------------------------------------ pixel layout */

/**
 * Expand decoded component bytes into the RGBA a canvas will accept.
 *
 * CMYK is converted with the naive formula rather than through an ICC profile.
 * That is also what a viewer without the profile does, so the re-encoded image
 * matches what the reader was already looking at — but it is a real limitation,
 * which is why CMYK images are named in the summary instead of passed over.
 */
export function toRgba(components, comps, width, height) {
  const px = width * height;
  const rgba = new Uint8ClampedArray(px * 4);
  for (let i = 0; i < px; i++) {
    const s = i * comps;
    const d = i * 4;
    if (comps === 1) {
      rgba[d] = rgba[d + 1] = rgba[d + 2] = components[s];
    } else if (comps === 3) {
      rgba[d] = components[s];
      rgba[d + 1] = components[s + 1];
      rgba[d + 2] = components[s + 2];
    } else if (comps === 4) {
      const k = components[s + 3];
      rgba[d] = 255 - Math.min(255, components[s] + k);
      rgba[d + 1] = 255 - Math.min(255, components[s + 1] + k);
      rgba[d + 2] = 255 - Math.min(255, components[s + 2] + k);
    }
    rgba[d + 3] = 255;
  }
  return rgba;
}

/* ----------------------------------------------------------------- presets */

/**
 * The three settings offered, and one hidden truth about them: the DPI is the
 * setting that matters and the quality is the one that gets fiddled with. A
 * 300 DPI scan at JPEG 0.9 is far bigger *and* no more readable on screen than
 * the same scan at 150 DPI and 0.75, because the detail being preserved was
 * never visible. So each preset moves both together rather than exposing two
 * sliders that most people would set to a contradiction.
 */
export const PRESETS = {
  light: { label: 'Light', dpi: 220, quality: 0.85, note: 'Safe for printing' },
  balanced: { label: 'Recommended', dpi: 150, quality: 0.72, note: 'Best size for screen and email' },
  strong: { label: 'Strong', dpi: 110, quality: 0.55, note: 'Smallest file, visible softening' },
};

/**
 * Map a single 0..1 dial onto a (dpi, quality) pair for target-size mode.
 *
 * Resolution is spent before quality: dropping DPI removes detail nobody can
 * see on screen, while dropping JPEG quality adds artefacts that are visible at
 * any size. So the curve walks 300→72 DPI while quality only falls 0.92→0.40.
 */
export function dialToSettings(t) {
  const k = Math.max(0, Math.min(1, t));
  return {
    dpi: Math.round(300 - k * (300 - 72)),
    quality: Math.round((0.92 - k * (0.92 - 0.40)) * 100) / 100,
  };
}

/* ----------------------------------------------------- the engine proper */

/**
 * Minimum saving worth accepting, by what accepting it actually costs.
 *
 * These are not three arbitrary tolerances; they price the loss. Downsampling
 * an over-resolution JPEG throws away detail nobody could see, so 5% is enough
 * to be worth doing. Re-encoding a JPEG that is already the right size buys
 * nothing back and adds a second generation of artefacts, so it has to earn
 * 15%. And turning a *lossless* image lossy destroys information permanently —
 * a flat diagram cannot be recovered from its JPEG — so it has to earn 30%,
 * which a photograph easily does and a flat graphic never will.
 */
const MIN_GAIN_RESAMPLE = 0.95;          // 5%  — removing invisible resolution
const MIN_GAIN_QUALITY_ONLY = 0.85;      // 15% — no resolution to reclaim
const MIN_GAIN_LOSSLESS_TO_LOSSY = 0.70; // 30% — permanent, so charge properly

/**
 * Bytes per pixel below which a lossless image is treated as a graphic rather
 * than a photograph.
 *
 * "Lossless" is not one category, and an earlier version of this file made
 * that mistake: it charged a flat 30% for going lossy, which correctly
 * protected flat diagrams and then wrongly refused to touch *photographic*
 * scans that happened to be stored as PNG — the single most common thing in a
 * bloated PDF after an oversized JPEG.
 *
 * What separates them is how well Deflate already did. A flat diagram packs to
 * ~0.006 bytes per pixel, which no lossy encoder will beat; a scanned page
 * needs ~0.08, and JPEG at screen quality lands well under that. So the
 * question is not "was it lossless" but "is there anything left to win", and
 * this is the line where the answer changes.
 */
const GRAPHIC_BYTES_PER_PIXEL = 0.02;

/** Never go below this, whatever the dial says. Below it, text in a scan dies. */
const DPI_FLOOR = 72;
const MIN_EDGE_PX = 16;

/**
 * Compress `bytes` and return `{ bytes, report }`.
 *
 * `lib` is the `PDFLib` global, passed in rather than reached for so this
 * module stays testable and so the CDN-recovery bootstrap remains the single
 * place that decides whether the library is really there.
 */
export async function compressPdf(bytes, options, lib, hooks) {
  const opts = Object.assign({ dpi: 150, quality: 0.72, targetBytes: null }, options || {});
  const on = Object.assign({ progress: () => {}, yield: () => Promise.resolve() }, hooks || {});
  const { PDFDocument, PDFName, PDFRawStream, decodePDFRawStream } = lib;

  const originalSize = bytes.length;
  on.progress(2, 'Reading the document…');

  const doc = await PDFDocument.load(bytes, {
    ignoreEncryption: true,
    updateMetadata: false,      // keep the author's own metadata; it is theirs
  });
  const ctx = doc.context;

  /* --- 1. how big is every image actually drawn ------------------------- */

  on.progress(8, 'Measuring how each image is used…');
  const drawn = measureDrawnSizes(doc, lib);

  /* --- 2. find the images and decide what each one deserves ------------- */

  const candidates = [];
  for (const [ref, obj] of ctx.enumerateIndirectObjects()) {
    if (!(obj instanceof PDFRawStream)) continue;
    if (nameOf(obj.dict.get(PDFName.of('Subtype')))!== 'Image') continue;
    candidates.push({ ref, obj });
  }

  const report = {
    originalSize,
    compressedSize: originalSize,
    images: [],
    pages: doc.getPageCount(),
    settings: { dpi: opts.dpi, quality: opts.quality },
    passes: 1,
  };

  if (!candidates.length) {
    /* No images at all. Structural re-save can still win a little, but saying
       "we made your text-only PDF 1% smaller" is more honest than implying
       there was a compression win to be had. */
    on.progress(90, 'Rewriting…');
    const out = await doc.save({ useObjectStreams: true, addDefaultPage: false });
    report.compressedSize = out.length;
    report.noImages = true;
    return { bytes: out, report };
  }

  /* --- 3. work out which images are eligible --------------------------- */

  const decoded = [];
  for (let i = 0; i < candidates.length; i++) {
    const { ref, obj } = candidates[i];
    on.progress(10 + Math.round((i / candidates.length) * 20),
      `Examining image ${i + 1} of ${candidates.length}…`);
    await on.yield();

    const info = describeImage(obj, ref, drawn, lib);
    if (info.skip) {
      report.images.push({ ...info.summary, action: 'skipped', reason: info.skip });
      continue;
    }
    decoded.push({ ref, obj, info, bitmap: null });
  }

  /* --- 4. encode, either once or searching for a target size ----------- */

  /**
   * Decoded bitmaps are cached, but only up to a budget.
   *
   * Target-size mode re-encodes the same images several times, so holding the
   * decoded form makes each extra pass nearly free. The catch is that decoded
   * is enormous: a single 300 DPI A4 scan is 8.4 million pixels, and this tool
   * accepts files with fifty of them. Holding all of those at once is roughly
   * 1.7 GB, which does not fail gracefully — the tab freezes and the browser
   * kills it, which is the exact outcome `file-limits.js` exists to prevent and
   * which a 25MB ceiling alone does not stop.
   *
   * So the cache is capped by total pixels. Under the cap, passes are cheap.
   * Over it, the least useful bitmaps are released and re-decoded on demand:
   * slower, but it finishes, and finishing slowly beats being killed.
   */
  const PIXEL_BUDGET = 48e6;   // ~192 MB of RGBA, safe on a mid-range phone
  let heldPixels = 0;

  const getBitmap = async (entry) => {
    if (entry.bitmap) return entry.bitmap;
    let bmp;
    try {
      bmp = await decodeToBitmap(entry.obj, entry.info, lib, decodePDFRawStream);
    } catch (err) {
      entry.failed = 'could not be decoded in this browser';
      return null;
    }
    if (!bmp) { entry.failed = 'unsupported image encoding'; return null; }

    const px = bmp.width * bmp.height;
    if (heldPixels + px <= PIXEL_BUDGET) {
      entry.bitmap = bmp;
      heldPixels += px;
    } else {
      entry.transient = bmp;   // used for this pass, released straight after
    }
    return bmp;
  };

  const releaseTransient = (entry) => {
    if (entry.transient) {
      if (typeof entry.transient.close === 'function') entry.transient.close();
      entry.transient = null;
    }
  };

  const encodeOnce = async (settings, label, base) => {
    const results = [];
    for (let i = 0; i < decoded.length; i++) {
      const d = decoded[i];
      on.progress(base + Math.round((i / decoded.length) * 30), label);
      await on.yield();

      const bmp = await getBitmap(d);
      if (!bmp) {
        results.push({ ref: d.ref, keep: false, summary: { ...d.info.summary, action: 'skipped', reason: d.failed } });
        continue;
      }
      results.push(await reencode(d, bmp, settings, lib));
      releaseTransient(d);
    }
    return results;
  };

  let settings = { dpi: opts.dpi, quality: opts.quality };
  let results = await encodeOnce(settings, 'Re-encoding images…', 48);

  if (opts.targetBytes) {
    const search = await searchForTarget({
      doc, decoded, targetBytes: opts.targetBytes, encodeOnce, applyAll, lib, on,
    });
    settings = search.settings;
    results = search.results;
    report.passes = search.passes;
    report.targetBytes = opts.targetBytes;
    report.targetMet = search.met;
  }

  report.settings = settings;

  /* --- 5. apply, and record what happened to each image ---------------- */

  on.progress(86, 'Putting the images back…');
  applyAll(results, lib, ctx);
  for (const r of results) report.images.push(r.summary);

  /* --- 6. rewrite ------------------------------------------------------- */

  on.progress(92, 'Rewriting the document…');
  const out = await doc.save({ useObjectStreams: true, addDefaultPage: false });
  report.compressedSize = out.length;

  /* Release the decode cache now rather than waiting for collection. The
     caller is about to render a before/after preview of two full pages, and
     that is the worst possible moment to still be holding a few hundred
     megabytes of bitmaps we have finished with. */
  for (const d of decoded) {
    if (d.bitmap && typeof d.bitmap.close === 'function') d.bitmap.close();
    d.bitmap = null;
  }

  /* A compressor that hands back something larger than it was given has
     failed at its one job. Rather than pretend, return the original and say
     so — the caller shows "already as small as it goes". */
  if (out.length >= originalSize) {
    report.compressedSize = originalSize;
    report.noGain = true;
    return { bytes, report };
  }

  on.progress(100, 'Done');
  return { bytes: out, report };
}

/* --------------------------------------------------------------- internals */

/** `/DeviceRGB` → `DeviceRGB`; anything that is not a name → null. */
function nameOf(v) {
  if (v === undefined || v === null) return null;
  const s = typeof v.asString === 'function' ? v.asString() : String(v);
  return s.startsWith('/') ? s.slice(1) : s;
}

function numOf(v) {
  if (v === undefined || v === null) return null;
  return typeof v.asNumber === 'function' ? v.asNumber() : Number(v);
}

/**
 * Largest on-page size, in points, that each image stream is drawn at.
 *
 * Keyed by ref tag. Form XObjects are recursed into with their own resources
 * and `/Matrix`, because a logo placed through a form — which is how most
 * generated PDFs place anything — would otherwise be invisible to the walk and
 * come out treated as un-drawn.
 *
 * The `/SMask` and `/Mask` of a processed image inherit its size: a soft mask
 * is never the subject of a `Do` operator, so nothing draws it directly and it
 * would otherwise measure as un-drawn and be downsampled to nothing, taking
 * the transparency with it.
 */
function measureDrawnSizes(doc, lib) {
  const { PDFName, PDFDict, PDFRawStream, PDFArray, decodePDFRawStream } = lib;
  const ctx = doc.context;
  const sizes = new Map();
  const seen = new Set();

  const note = (ref, w, h) => {
    const key = ref.tag;
    const prev = sizes.get(key);
    if (!prev || w * h > prev.w * prev.h) sizes.set(key, { w, h });
  };

  const contentText = (node) => {
    const c = node.Contents ? node.Contents() : null;
    if (!c) return '';
    const streams = [];
    if (c instanceof PDFArray) {
      for (let i = 0; i < c.size(); i++) streams.push(ctx.lookup(c.get(i)));
    } else {
      streams.push(c);
    }
    let text = '';
    for (const s of streams) {
      if (!s) continue;
      try {
        const raw = s instanceof PDFRawStream ? decodePDFRawStream(s).decode() : s.getContents();
        text += new TextDecoder('latin1').decode(raw) + '\n';
      } catch (err) {
        /* An undecodable content stream means we cannot measure this page.
           Images it draws stay un-measured and are therefore left alone,
           which is the safe direction to fail in. */
      }
    }
    return text;
  };

  const walk = (resources, text, baseCtm, depth) => {
    if (!resources || depth > 8) return;   // depth cap: forms can self-reference
    const xobjects = resources.lookupMaybe(PDFName.of('XObject'), PDFDict);
    if (!xobjects) return;

    walkContentStream(text, (name, ctm) => {
      const ref = xobjects.get(PDFName.of(name));
      if (!ref) return;
      const target = ctx.lookup(ref);
      if (!target) return;
      const sub = nameOf(target.dict && target.dict.get(PDFName.of('Subtype')));

      if (sub === 'Image') {
        const { w, h } = drawnSize(ctm);
        note(ref, w, h);
        return;
      }
      if (sub === 'Form') {
        const key = ref.tag + '@' + ctm.join(',');
        if (seen.has(key)) return;        // same form, same transform, already walked
        seen.add(key);
        const matrix = target.dict.lookupMaybe(PDFName.of('Matrix'), PDFArray);
        let inner = ctm;
        if (matrix && matrix.size() === 6) {
          const m = [];
          for (let i = 0; i < 6; i++) m.push(numOf(matrix.get(i)));
          inner = matMul(m, ctm);
        }
        const ownRes = target.dict.lookupMaybe(PDFName.of('Resources'), PDFDict) || resources;
        walk(ownRes, contentText({ Contents: () => target }), inner, depth + 1);
      }
    }, baseCtm);
  };

  for (const page of doc.getPages()) {
    const node = page.node;
    walk(node.Resources && node.Resources(), contentText(node), IDENTITY, 0);
  }

  /* Masks inherit their parent's footprint. */
  for (const [ref, obj] of ctx.enumerateIndirectObjects()) {
    if (!(obj instanceof PDFRawStream)) continue;
    if (nameOf(obj.dict.get(PDFName.of('Subtype'))) !== 'Image') continue;
    const own = sizes.get(ref.tag);
    if (!own) continue;
    for (const key of ['SMask', 'Mask']) {
      const m = obj.dict.get(PDFName.of(key));
      if (m && m.tag && !sizes.has(m.tag)) sizes.set(m.tag, own);
    }
  }

  return sizes;
}

/** Colour components per pixel for a colour space we are willing to handle. */
function componentsFor(dict, lib) {
  const { PDFName, PDFArray } = lib;
  const cs = dict.get(PDFName.of('ColorSpace'));
  const direct = nameOf(cs);
  if (direct === 'DeviceRGB') return 3;
  if (direct === 'DeviceGray') return 1;
  if (direct === 'DeviceCMYK') return 4;

  /* `[/ICCBased <stream>]` is overwhelmingly the common indirect form; its /N
     says how many components without us having to read the profile. */
  const arr = dict.lookupMaybe(PDFName.of('ColorSpace'), PDFArray);
  if (arr && arr.size() >= 2 && nameOf(arr.get(0)) === 'ICCBased') {
    const streamDict = arr.lookup ? arr.lookup(1) : null;
    const n = streamDict && streamDict.dict ? numOf(streamDict.dict.get(PDFName.of('N'))) : null;
    if (n === 1 || n === 3 || n === 4) return n;
  }
  return null;
}

/**
 * Decide whether an image is worth touching, and why not when it is not.
 *
 * The skip reasons are user-facing. "Indexed colour palette" is more use to
 * someone wondering why their file only shrank 12% than a silent omission is.
 */
function describeImage(obj, ref, drawn, lib) {
  const { PDFName } = lib;
  const d = obj.dict;
  const width = numOf(d.get(PDFName.of('Width')));
  const height = numOf(d.get(PDFName.of('Height')));
  const filter = nameOf(d.get(PDFName.of('Filter')));
  const bpc = numOf(d.get(PDFName.of('BitsPerComponent')));
  const isMask = String(d.get(PDFName.of('ImageMask'))) === 'true';
  const placed = drawn.get(ref.tag) || null;

  const summary = { width, height, filter, bytes: obj.contents.length };

  if (isMask || bpc === 1) {
    return { skip: 'a 1-bit stencil mask — already the smallest it can be', summary };
  }
  if (bpc !== 8) {
    return { skip: `${bpc}-bit colour, which re-encoding would not improve`, summary };
  }
  if (filter === 'JPXDecode') {
    return { skip: 'JPEG 2000, which browsers cannot re-encode', summary };
  }
  if (filter === 'JBIG2Decode' || filter === 'CCITTFaxDecode') {
    return { skip: 'a bilevel fax-encoded scan, already smaller than any JPEG of it', summary };
  }
  const comps = componentsFor(d, lib);
  if (filter !== 'DCTDecode' && comps === null) {
    return { skip: 'an indexed or uncommon colour space', summary };
  }

  return { skip: null, summary, width, height, filter, bpc, comps, placed };
}

/** Decode an image stream to an ImageBitmap, whatever it was stored as. */
async function decodeToBitmap(obj, info, lib, decodePDFRawStream) {
  if (info.filter === 'DCTDecode') {
    /* A DCTDecode stream's bytes already *are* a JPEG file, so hand them
       straight to the browser's decoder rather than reimplementing one. CMYK
       JPEGs with an Adobe APP14 marker will throw here, and that throw is the
       intended path: the caller reports them as skipped. */
    return await createImageBitmap(new Blob([obj.contents], { type: 'image/jpeg' }));
  }

  const raw = decodePDFRawStream(obj).decode();
  const expected = info.width * info.height * info.comps;
  if (raw.length < expected) return null;    // truncated; leave it alone

  const rgba = toRgba(raw, info.comps, info.width, info.height);
  return await createImageBitmap(new ImageData(rgba, info.width, info.height));
}

/**
 * Produce the re-encoded candidate for one image, and decide whether to keep
 * it. Returns a record either way, so the report can show the decision.
 */
async function reencode(entry, bitmap, settings, lib) {
  const { obj, info } = entry;
  const { width, height, filter, placed } = info;
  const originalBytes = obj.contents.length;

  /* Effective DPI uses the larger of the two axes: an image squashed on one
     axis is still over-resolution on the other, and downsampling to the
     smaller one would visibly soften it. */
  const dpiX = placed ? effectiveDpi(width, placed.w) : null;
  const dpiY = placed ? effectiveDpi(height, placed.h) : null;
  const effDpi = (dpiX === null) ? null : Math.max(dpiX, dpiY);

  const base = {
    width, height, filter, bytes: originalBytes,
    drawnPt: placed ? { w: Math.round(placed.w), h: Math.round(placed.h) } : null,
    effectiveDpi: effDpi === null ? null : (effDpi === Infinity ? Infinity : Math.round(effDpi)),
  };

  if (effDpi === null) {
    /* Never drawn anywhere we could find — an unused resource, or a page whose
       content stream would not decode. Leaving it alone is the safe failure. */
    return { ref: entry.ref, keep: false, summary: { ...base, action: 'kept', reason: 'not drawn on any page we could measure' } };
  }

  const targetDpi = Math.max(DPI_FLOOR, settings.dpi);
  let scale = effDpi > targetDpi ? targetDpi / effDpi : 1;

  /* Rule 2 and rule 3 together: at or below the target resolution, a lossless
     source is left completely alone, and a JPEG source gets one quality-only
     attempt that has to earn a bigger saving to be accepted. */
  const qualityOnly = scale === 1;
  if (qualityOnly && filter !== 'DCTDecode') {
    return { ref: entry.ref, keep: false, summary: { ...base, action: 'kept', reason: 'already at the target resolution, and lossless' } };
  }

  let outW = Math.max(MIN_EDGE_PX, Math.round(width * scale));
  let outH = Math.max(MIN_EDGE_PX, Math.round(height * scale));
  if (outW >= width && outH >= height) { outW = width; outH = height; }

  const canvas = new OffscreenCanvas(outW, outH);
  const cctx = canvas.getContext('2d');
  /* White ground: JPEG has no alpha, and a transparent source drawn onto a
     transparent canvas encodes as black. The alpha itself is not lost — it
     lives in the separate /SMask stream, which is processed as its own image. */
  cctx.fillStyle = '#ffffff';
  cctx.fillRect(0, 0, outW, outH);
  cctx.imageSmoothingEnabled = true;
  cctx.imageSmoothingQuality = 'high';
  cctx.drawImage(bitmap, 0, 0, outW, outH);

  const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: settings.quality });
  const candidate = new Uint8Array(await blob.arrayBuffer());

  /* A lossless source only has to clear the high bar if it looks like a
     graphic. If Deflate needed real bytes per pixel, the content is
     photographic and downsampling it is exactly the job. */
  const bytesPerPixel = originalBytes / Math.max(1, width * height);
  const looksGraphic = filter !== 'DCTDecode' && bytesPerPixel < GRAPHIC_BYTES_PER_PIXEL;
  const threshold = qualityOnly
    ? MIN_GAIN_QUALITY_ONLY
    : (looksGraphic ? MIN_GAIN_LOSSLESS_TO_LOSSY : MIN_GAIN_RESAMPLE);
  if (candidate.length >= originalBytes * threshold) {
    /* Rule 1. Measured, not assumed — this is the branch a flat-colour graphic
       and an already-tight JPEG both land in. */
    return {
      ref: entry.ref,
      keep: false,
      summary: {
        ...base, action: 'kept',
        reason: candidate.length >= originalBytes
          ? 'already smaller than any re-encoding of it'
          : (looksGraphic
            ? 'a lossless graphic that compresses better than any JPEG of it'
            : 'the saving was too small to be worth re-encoding'),
      },
    };
  }

  return {
    ref: entry.ref,
    keep: true,
    bytes: candidate,
    outW,
    outH,
    obj,
    summary: {
      ...base, action: 'shrunk', newWidth: outW, newHeight: outH, newBytes: candidate.length,
    },
  };
}

/** Swap every kept candidate into the document at its existing ref. */
function applyAll(results, lib, ctx) {
  const { PDFName, PDFRawStream } = lib;
  for (const r of results) {
    if (!r.keep) continue;
    const old = r.obj.dict;

    /* Build the new dict from the old one so anything we do not understand
       (/Intent, /Metadata, an /OC membership) is carried across rather than
       quietly dropped. Only what re-encoding actually changed is overwritten,
       and the entries that described the old encoding are removed. */
    const dict = old.clone(ctx);
    dict.set(PDFName.of('Width'), ctx.obj(r.outW));
    dict.set(PDFName.of('Height'), ctx.obj(r.outH));
    dict.set(PDFName.of('ColorSpace'), PDFName.of('DeviceRGB'));
    dict.set(PDFName.of('BitsPerComponent'), ctx.obj(8));
    dict.set(PDFName.of('Filter'), PDFName.of('DCTDecode'));
    dict.set(PDFName.of('Length'), ctx.obj(r.bytes.length));
    dict.delete(PDFName.of('DecodeParms'));
    dict.delete(PDFName.of('Decode'));

    ctx.assign(r.ref, PDFRawStream.of(dict, r.bytes));
  }
}

/**
 * Find the gentlest settings that fit a requested file size.
 *
 * This is a bisection on the single 0..1 dial rather than a sweep of the two
 * real knobs, which keeps it to a handful of passes: the images are decoded
 * once and only re-encoded per pass, so each step costs an encode rather than a
 * full parse. It stops as soon as it is within 4% under the target, because
 * hunting the last 2 KB costs a pass a reader can feel and buys nothing.
 *
 * Crucially it reports what it actually achieved. A target of 100 KB on a
 * 40-page scan is not physically reachable at readable quality, and saying so
 * is better than returning an unreadable file that meets the number.
 */
async function searchForTarget({ doc, decoded, targetBytes, encodeOnce, applyAll, lib, on }) {
  let lo = 0, hi = 1;
  let best = null;
  let passes = 0;
  const MAX_PASSES = 6;

  for (let i = 0; i < MAX_PASSES; i++) {
    const t = (lo + hi) / 2;
    const settings = dialToSettings(t);
    passes++;
    on.progress(48 + Math.round((i / MAX_PASSES) * 34),
      `Fitting to your target — attempt ${passes}…`);

    const results = await encodeOnce(settings, `Fitting to your target — attempt ${passes}…`, 48);

    /* Measure by saving a throwaway copy: the only honest size is the size of
       a real save, since object streams and structure are part of the total. */
    const probe = await saveWithApplied(doc, results, lib, applyAll);
    const size = probe.length;

    /* "Closest to the target" is the wrong thing to keep. A result over the
       target has failed the request outright, and among results that fit, the
       *largest* is the one that gave away the least quality. So prefer any fit
       over any miss, then prefer the biggest fit; only if nothing fits does
       the smallest attempt become the best on offer. */
    const fits = size <= targetBytes;
    const bestFits = best ? best.size <= targetBytes : false;
    const better = !best
      || (fits && !bestFits)
      || (fits && bestFits && size > best.size)
      || (!fits && !bestFits && size < best.size);
    if (better) best = { settings, results, size };

    if (fits && size >= targetBytes * 0.96) break;   // close enough under
    if (size > targetBytes) lo = t; else hi = t;
  }

  return {
    settings: best.settings,
    results: best.results,
    passes,
    met: best.size <= targetBytes,
  };
}

/**
 * Save a copy with `results` applied, without disturbing the working document.
 *
 * pdf-lib has no "save a branch" operation, so this applies the swaps, saves,
 * and restores the original streams. Restoring matters: the search tries
 * several settings and a leftover from a rejected pass would ship.
 */
async function saveWithApplied(doc, results, lib, applyAll) {
  const ctx = doc.context;
  const originals = results.filter((r) => r.keep).map((r) => [r.ref, ctx.lookup(r.ref)]);
  applyAll(results, lib, ctx);
  const out = await doc.save({ useObjectStreams: true, addDefaultPage: false });
  for (const [ref, obj] of originals) ctx.assign(ref, obj);
  return out;
}
