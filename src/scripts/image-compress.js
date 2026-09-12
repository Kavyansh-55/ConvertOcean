/**
 * When is re-encoding an embedded image worth it, and at what size?
 *
 * This is the policy half of every compressor on the site, kept apart from the
 * plumbing because the plumbing differs per format and the policy must not.
 * A PDF stores images as content-stream XObjects and a PPTX stores them as
 * files in a zip, but the question asked about a given image is identical:
 * *is it stored at more resolution than it is displayed at, and is there
 * anything left to win by re-encoding it?*
 *
 * Every rule below exists because the naive version got it wrong while
 * `/compress-pdf/` was being built, and one of them took three attempts. They
 * are shared rather than copied so that the next correction is made once.
 *
 *   1. Never grow a stream — a candidate is measured against what was there.
 *   2. Never touch an image already at the right resolution.
 *   3. Never turn lossless into lossy for small change.
 *   4. Report every image that was skipped, with a reason.
 *
 * The caller supplies the image's pixel dimensions, its stored byte count,
 * whether it is already lossy, and the size it is actually *drawn* at. What
 * "drawn at" means is the format's problem: PDF measures it in points off the
 * content-stream matrix, OOXML reads it in EMUs from the drawing XML. Both
 * arrive here as points, and everything after that is the same.
 */

/** 72 points to the inch — the unit both PDF and OOXML reduce to. */
export const POINTS_PER_INCH = 72;

/** OOXML's English Metric Units: 914,400 to the inch, 12,700 to the point. */
export const EMU_PER_POINT = 12700;

/**
 * The presets, as a single dial rather than two.
 *
 * Resolution is the setting that matters and quality is the one people fiddle
 * with. A 300 DPI scan at JPEG 0.9 is far bigger *and* no more readable on a
 * screen than the same scan at 150 DPI and 0.75, because the detail being
 * preserved was never visible. So each preset moves both together rather than
 * offering two sliders most people would set to a contradiction.
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
 * see on screen, while dropping JPEG quality adds artefacts visible at any
 * size. So the curve walks 300→72 DPI while quality only falls 0.92→0.40.
 */
export function dialToSettings(t) {
  const k = Math.max(0, Math.min(1, t));
  return {
    dpi: Math.round(300 - k * (300 - 72)),
    quality: Math.round((0.92 - k * (0.92 - 0.40)) * 100) / 100,
  };
}

/**
 * Minimum saving worth accepting, priced by what accepting it costs.
 *
 * These are not three arbitrary tolerances. Downsampling an over-resolution
 * image throws away detail nobody could see, so 5% is enough to be worth
 * doing. Re-encoding something already at the right size buys nothing back and
 * adds a second generation of artefacts, so it has to earn 15%. Turning a
 * *lossless* image lossy destroys information permanently — a flat diagram
 * cannot be recovered from its JPEG — so it has to earn 30%, which a
 * photograph easily does and a flat graphic never will.
 */
export const MIN_GAIN_RESAMPLE = 0.95;          // 5%  — removing invisible resolution
export const MIN_GAIN_QUALITY_ONLY = 0.85;      // 15% — no resolution to reclaim
export const MIN_GAIN_LOSSLESS_TO_LOSSY = 0.70; // 30% — permanent, so charge properly

/**
 * Bytes per pixel below which a lossless image is a graphic, not a photograph.
 *
 * This is the one that took three attempts. A flat 30% penalty for going lossy
 * correctly protected flat diagrams and then wrongly refused to shrink
 * *photographic* scans stored as PNG — the second most common cause of a
 * bloated document after an oversized JPEG. "Lossless" is not one category.
 *
 * What separates them is how well Deflate already did. A flat diagram packs to
 * ~0.006 bytes per pixel, which no lossy encoder will beat; a scanned page
 * needs ~0.08, and JPEG at screen quality lands well under that. So the
 * question is not "was it lossless" but "is there anything left to win", and
 * this is the line where the answer changes.
 */
export const GRAPHIC_BYTES_PER_PIXEL = 0.02;

/** Never go below this, whatever the dial says. Below it, text in a scan dies. */
export const DPI_FLOOR = 72;

/** No axis shrinks past this, so a thumbnail cannot become a smear. */
export const MIN_EDGE_PX = 16;

/**
 * How many pixels across is this image, per inch of the space it occupies?
 *
 * Infinity when it is drawn at zero size, which is a real thing in documents
 * (a hidden or collapsed placeholder) and must not become a divide-by-zero
 * that reads as "very low resolution" and gets upscaled.
 */
export function effectiveDpi(pixels, drawnPt) {
  if (!drawnPt || drawnPt <= 0) return Infinity;
  return pixels / (drawnPt / POINTS_PER_INCH);
}

/**
 * Decide whether to re-encode, and at what pixel size.
 *
 * Returns either `{ skip: true, reason }` — rules 2 and 3, decided before any
 * work is done — or the plan to try, which the caller encodes and then hands
 * to `judgeCandidate`. Split in two because the encode itself is the caller's
 * job: a PDF decodes its own raw streams, OOXML has a file it can hand
 * straight to `createImageBitmap`, and neither should be this module's
 * business.
 *
 * @param {object} img
 * @param {number} img.width       stored pixel width
 * @param {number} img.height      stored pixel height
 * @param {number} img.originalBytes  as stored, compressed
 * @param {boolean} img.lossy      already JPEG-like
 * @param {{w:number,h:number}|null} img.drawnPt  displayed size in points
 * @param {{dpi:number, quality:number}} settings
 */
export function planResample(img, settings) {
  const { width, height, originalBytes, lossy, drawnPt } = img;

  /* The larger axis wins: an image squashed on one axis is still
     over-resolution on the other, and downsampling to the smaller one would
     visibly soften it. */
  const dpiX = drawnPt ? effectiveDpi(width, drawnPt.w) : null;
  const dpiY = drawnPt ? effectiveDpi(height, drawnPt.h) : null;
  const effDpi = dpiX === null ? null : Math.max(dpiX, dpiY);

  const base = {
    width, height, bytes: originalBytes, lossy,
    drawnPt: drawnPt ? { w: Math.round(drawnPt.w), h: Math.round(drawnPt.h) } : null,
    effectiveDpi: effDpi === null ? null
      : (effDpi === Infinity ? Infinity : Math.round(effDpi)),
  };

  if (effDpi === null) {
    /* Not placed anywhere we could measure — an unused resource, or a part we
       could not parse. Leaving it alone is the safe failure. */
    return { skip: true, base, reason: 'not displayed anywhere we could measure' };
  }

  const targetDpi = Math.max(DPI_FLOOR, settings.dpi);
  const scale = effDpi > targetDpi ? targetDpi / effDpi : 1;
  const qualityOnly = scale === 1;

  /* Rules 2 and 3 together: at or below target resolution a lossless source is
     left completely alone, and a lossy one gets a single quality-only attempt
     that has to clear a higher bar. */
  if (qualityOnly && !lossy) {
    return { skip: true, base, reason: 'already at the target resolution, and lossless' };
  }

  let outW = Math.max(MIN_EDGE_PX, Math.round(width * scale));
  let outH = Math.max(MIN_EDGE_PX, Math.round(height * scale));
  if (outW >= width && outH >= height) { outW = width; outH = height; }

  /* A lossless source only has to clear the high bar if it looks like a
     graphic. If Deflate needed real bytes per pixel the content is
     photographic, and downsampling it is exactly the job. */
  const bytesPerPixel = originalBytes / Math.max(1, width * height);
  const looksGraphic = !lossy && bytesPerPixel < GRAPHIC_BYTES_PER_PIXEL;
  const threshold = qualityOnly
    ? MIN_GAIN_QUALITY_ONLY
    : (looksGraphic ? MIN_GAIN_LOSSLESS_TO_LOSSY : MIN_GAIN_RESAMPLE);

  return {
    skip: false, base, outW, outH, qualityOnly, looksGraphic, threshold,
    quality: settings.quality,
  };
}

/**
 * Rule 1, measured rather than assumed: is the candidate actually better?
 *
 * This is the branch a flat-colour graphic and an already-tight JPEG both land
 * in, and the reason strings are written to be shown to a reader in the
 * "what changed in your file" panel rather than logged.
 */
export function judgeCandidate(plan, candidateBytes) {
  const original = plan.base.bytes;
  if (candidateBytes >= original * plan.threshold) {
    return {
      accept: false,
      reason: candidateBytes >= original
        ? 'already smaller than any re-encoding of it'
        : (plan.looksGraphic
          ? 'a lossless graphic that compresses better than any JPEG of it'
          : 'the saving was too small to be worth re-encoding'),
    };
  }
  return { accept: true };
}

/**
 * Draw a bitmap down to `outW`×`outH` and encode it as JPEG.
 *
 * The white ground is not cosmetic: JPEG has no alpha, and a transparent
 * source drawn onto a transparent canvas encodes as **black**. Callers that
 * need to keep transparency must not route the image through here — in a PDF
 * the alpha lives in a separate /SMask stream handled as its own image, and in
 * OOXML a transparent PNG has to be left alone entirely, because there is
 * nowhere else for the alpha to go.
 */
export async function encodeJpeg(bitmap, outW, outH, quality) {
  const canvas = new OffscreenCanvas(outW, outH);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, outW, outH);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, outW, outH);
  const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality });
  return new Uint8Array(await blob.arrayBuffer());
}
