/**
 * Pixel content for compression fixtures, as `shade(x, y)` functions.
 *
 * A compression fixture lives or dies on what its images actually contain, and
 * two obvious choices are both wrong:
 *
 *   - **Random noise** does not compress at all, so a fixture made of it fails
 *     a size assertion for reasons that have nothing to do with the
 *     compressor.
 *   - **Flat colour** already encodes to almost nothing, so there is no saving
 *     to find and a broken compressor passes.
 *
 * So each function here produces content of a specific, known compressibility,
 * chosen to land on a particular side of the engine's decisions. They were
 * written for `/compress-pdf/` and are shared rather than copied because the
 * office fixtures need exactly the same material — the point of a fixture is
 * that the tool meets the same content whatever container it arrives in.
 */

/**
 * Flatten a shade function into a raw interleaved buffer.
 *
 * PNG wants a per-pixel callback; a PDF image stream wants the raw planes to
 * deflate directly. Same pixels, two shapes, so the pixel logic is written
 * once as a shade function and this adapts it for the PDF side.
 */
export function rgbBuffer(w, h, shade) {
  const px = Buffer.alloc(w * h * 3);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const [r, g, b] = shade(x, y);
      const i = (y * w + x) * 3;
      px[i] = r; px[i + 1] = g; px[i + 2] = b;
    }
  }
  return px;
}

/**
 * A scanned page: paper ground, text-like bands, a figure box, sensor noise.
 *
 * Compresses well but not trivially, which is what a photograph or a scan
 * actually does. This is the content that must genuinely shrink — an image
 * like this stored at 300 DPI and shown at 96 is where all the real-world
 * saving comes from.
 */
export function scanLikeShade(w, h) {
  return (x, y) => {
    const vignette = 6 * Math.sin((x / w) * Math.PI) * Math.sin((y / h) * Math.PI);
    let v = 246 - vignette;

    const band = Math.floor(y / (h / 40));
    const inBandRow = (y % (h / 40)) < (h / 40) * 0.45;
    if (band > 3 && band < 36 && inBandRow) {
      const wordPhase = Math.floor(x / (w / 90)) % 7;
      if (wordPhase < 5 && x > w * 0.08 && x < w * 0.92) v = 40;
    }

    if (x > w * 0.55 && x < w * 0.9 && y > h * 0.55 && y < h * 0.82) {
      v = 150 + 40 * Math.sin((x / w) * 60) * Math.cos((y / h) * 60);
    }

    /* Deterministic, so the fixture is byte-reproducible and a size assertion
       means something across machines. */
    const n = ((x * 7919 + y * 104729) % 11) - 5;
    v = Math.max(0, Math.min(255, v + n));
    return [v, v, Math.min(255, v + 3)];
  };
}

/**
 * Four solid quadrants with a white cross.
 *
 * Deflates to a few bytes per thousand pixels, so **any** JPEG of it comes out
 * bigger. This is the image that proves rule 1 and rule 3: a compressor that
 * downsamples on resolution alone will grow this file, and one that charges a
 * flat penalty for going lossy will correctly refuse it. It is also instantly
 * readable by eye when something has gone wrong.
 */
export function flatGraphicShade(w, h) {
  const cols = [[220, 38, 38], [22, 163, 74], [37, 99, 235], [234, 179, 8]];
  return (x, y) => {
    const q = (x < w / 2 ? 0 : 1) + (y < h / 2 ? 0 : 2);
    const nearVert = Math.abs(x - w / 2) < w * 0.02;
    const nearHorz = Math.abs(y - h / 2) < h * 0.02;
    if (nearVert || nearHorz) return [255, 255, 255];
    return cols[q];
  };
}

/**
 * A coloured disc on a fully transparent ground.
 *
 * The transparency case, and in OOXML it is sharper than in PDF. A PDF keeps
 * alpha in a separate /SMask stream, so flattening the colour channel is
 * survivable. A PPTX has one PNG and nowhere else for the alpha to go — encode
 * it as JPEG and the transparent ground becomes an opaque white box around
 * every logo in the deck. So this image must come back byte-identical.
 */
export function discAlphaShade(w, h) {
  const cx = w / 2, cy = h / 2, rr = Math.min(w, h) * 0.42;
  return (x, y) => {
    const d = Math.hypot(x - cx, y - cy);
    if (d > rr) return [0, 0, 0, 0];
    /* A gradient inside, so a naive "is it all one colour" check cannot pass
       it by accident. */
    const t = d / rr;
    return [232 - Math.round(t * 90), 62 + Math.round(t * 60), 140, 255];
  };
}
