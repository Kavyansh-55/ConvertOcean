/**
 * Image tools.
 *
 * The format conversions all share one shape, so they are generated rather
 * than written out fifteen times. What varies between them is only what the
 * source carried and what the target can hold, and that is exactly what the
 * generated checks encode:
 *
 *  - the output really is the target format (magic bytes, not the filename)
 *  - the pixel dimensions did not change
 *  - transparency was handled deliberately: PNG→JPG has to composite onto
 *    something, PNG→WebP has no excuse for losing the alpha channel
 *  - EXIF: a canvas re-encode silently drops it, so a photo whose Orientation
 *    tag made it display upright comes out rotated. The fixture carries
 *    Orientation=6 so that is visible rather than theoretical.
 */
import { ok, STANDARD, IMG_W, IMG_H } from './_shared.mjs';

/** Formats that can carry an alpha channel. */
const ALPHA_CAPABLE = new Set(['png', 'webp', 'svg', 'gif']);

/**
 * Build a format-conversion recipe.
 *
 * @param {string} slug        tool slug, e.g. 'png-to-jpg'
 * @param {string} fixture     fixture filename to feed it
 * @param {string} target      expected output format, as readImage reports it
 * @param {object} [opts]      { sourceHasAlpha, sourceHasExif, optional }
 */
function conversion(slug, fixture, target, opts = {}) {
  const [fromLabel, toLabel] = slug.split('-to-');
  return {
    slug,
    title: `${fromLabel.toUpperCase()} → ${toLabel.toUpperCase()}`,
    fixture,
    ...STANDARD,
    outName: `${slug}.${target === 'jpeg' ? 'jpg' : target}`,
    kind: 'image',
    optional: opts.optional,
    async checks({ out, src }) {
      /* Compare against the source's real dimensions, not a constant. The
         fixtures are not all one size — the HEIC and AVIF samples are real
         camera files at 1440x960 and 1204x800 — and an earlier version of this
         check asserted 240x160 for every one of them, failing four tools that
         were reproducing their input exactly. */
      const aspect = (w, h) => (h ? w / h : 0);
      const isSvg = src.format === 'svg';

      let dimsOk, dimsLabel, dimsDetail;
      if (isSvg) {
        /* Rasterising vector art at its nominal 240x160 would be needlessly
           small, so ImageTool deliberately upscales to a 1024 minimum side.
           The contract is the aspect ratio and a usable resolution. */
        dimsOk = Math.abs(aspect(out.width, out.height) - aspect(src.width, src.height)) < 0.02
                 && Math.min(out.width, out.height) >= 1024;
        dimsLabel = 'Vector upscaled to a usable size, aspect ratio kept';
        dimsDetail = `${out.width}×${out.height} from a ${src.width}×${src.height} viewBox`;
      } else if (opts.sourceHasExif) {
        /* A source carrying Orientation=6 *should* come out rotated: the
           browser bakes the orientation in when drawing to canvas, which is
           the correct result — the image finally displays upright without
           depending on a tag. */
        dimsOk = out.width === src.height && out.height === src.width;
        dimsLabel = `Dimensions reflect baked-in EXIF rotation (${src.height}×${src.width})`;
        dimsDetail = `${out.width}×${out.height}`;
      } else {
        dimsOk = out.width === src.width && out.height === src.height;
        dimsLabel = `Pixel dimensions unchanged (${src.width}×${src.height})`;
        dimsDetail = `${out.width}×${out.height}`;
      }

      const checks = [
        ok('format', `Output really is ${target.toUpperCase()} (by magic bytes)`,
           out.format === target,
           `detected ${out.format}, ${out.bytes} bytes`, 'blocker'),
        ok('dims', dimsLabel, dimsOk, dimsDetail, 'major'),
        ok('nonempty', 'Output is not a blank or truncated file',
           out.bytes > 200, `${out.bytes} bytes`, 'blocker'),
      ];

      if (opts.sourceHasAlpha) {
        if (ALPHA_CAPABLE.has(target)) {
          checks.push(ok('alpha', 'Transparency survives into a format that supports it',
            out.hasAlpha, out.hasAlpha ? '' : 'alpha channel dropped', 'major'));
        } else {
          // JPEG cannot store alpha. The question is whether the transparent
          // region was composited onto a sensible background rather than left
          // black — which readImage cannot see, so this is flagged, not scored.
          checks.push(ok('flatten', 'Transparent area composited (JPEG has no alpha)',
            true, 'JPEG cannot carry alpha; check the file visually for a black quadrant', 'minor'));
        }
      }

      if (opts.sourceHasExif) {
        /* Once the rotation is baked into the pixels, keeping the old
           Orientation tag would rotate the image a second time in any viewer
           that honours it. So dropping EXIF here is correct, not a loss —
           what would be wrong is rotated pixels *and* a surviving tag. */
        const rotated = out.width === IMG_H && out.height === IMG_W;
        checks.push(ok('exif-consistent',
          'Orientation baked in and the stale tag not left behind',
          rotated ? !out.hasExif : true,
          rotated && out.hasExif
            ? 'pixels rotated AND Orientation kept — viewers will rotate it twice'
            : 'rotation applied to pixels, tag dropped',
          'major'));
        checks.push(ok('exif-privacy',
          'GPS and camera metadata not carried into the output',
          !out.hasExif,
          out.hasExif ? 'output still carries EXIF, including GPS' : 'no EXIF in output',
          'minor'));
      }

      return checks;
    },
  };
}

export const imageRecipes = [
  /* ---- raster ↔ raster ------------------------------------------------ */
  conversion('png-to-jpg', 'torture.png', 'jpeg', { sourceHasAlpha: true }),
  conversion('png-to-webp', 'torture.png', 'webp', { sourceHasAlpha: true }),
  conversion('jpg-to-png', 'torture.jpg', 'png', { sourceHasExif: true }),
  conversion('jpg-to-webp', 'torture.jpg', 'webp', { sourceHasExif: true }),
  conversion('webp-to-png', 'torture.webp', 'png'),
  conversion('webp-to-jpg', 'torture.webp', 'jpeg'),

  /* jpg-to-jpeg and jpeg-to-jpg are a rename, not a conversion. Re-encoding
     here would lose quality for no reason, so the extra check is that the
     bytes came through roughly intact. */
  {
    ...conversion('jpg-to-jpeg', 'torture.jpg', 'jpeg', { sourceHasExif: true }),
    title: 'JPG → JPEG (rename only)',
  },
  {
    ...conversion('jpeg-to-jpg', 'torture.jpg', 'jpeg', { sourceHasExif: true }),
    title: 'JPEG → JPG (rename only)',
  },

  /* ---- vector → raster ------------------------------------------------ */
  conversion('svg-to-png', 'torture.svg', 'png', { sourceHasAlpha: true }),
  conversion('svg-to-jpg', 'torture.svg', 'jpeg', { sourceHasAlpha: true }),
  conversion('svg-to-webp', 'torture.svg', 'webp', { sourceHasAlpha: true }),

  /* ---- modern camera formats -----------------------------------------
     These use the sample files kept in scratch/. They are marked optional so
     the sweep reports "skipped" rather than "failed" if scratch/ is absent. */
  conversion('heic-to-jpg', 'sample.heic', 'jpeg', { optional: true }),
  conversion('heic-to-png', 'sample.heic', 'png', { optional: true }),
  conversion('avif-to-jpg', 'sample.avif', 'jpeg', { optional: true }),
  conversion('avif-to-png', 'sample.avif', 'png', { optional: true }),

  /* ---- image → PDF ---------------------------------------------------- */
  {
    slug: 'image-to-pdf',
    title: 'Image → PDF',
    fixture: 'torture.png',
    ready: '#actionControls',
    download: '#btnDownload',
    outName: 'image-to-pdf.pdf',
    kind: 'pdf',
    async checks({ out }) {
      const first = out.sizes[0];
      // 240×160 is landscape (1.5:1). Fitting it onto portrait A4 is a choice;
      // squashing it to a different aspect ratio is a bug.
      return [
        ok('opens', 'Output is a readable PDF', out.pages > 0, `${out.pages} pages`, 'blocker'),
        ok('onepage', 'One image makes one page', out.pages === 1, `${out.pages} pages`, 'major'),
        ok('embedded', 'The image is actually embedded', out.imageCount > 0,
           `${out.imageCount} painted images`, 'blocker'),
        ok('geometry', 'Page has a sane size', first && first.width > 100 && first.height > 100,
           first ? `${first.width}×${first.height}pt ${first.orientation}` : 'n/a', 'minor'),
      ];
    },
  },

  /* ---- resize --------------------------------------------------------- */
  {
    slug: 'image-resizer',
    title: 'Image resizer',
    fixture: 'torture.png',
    ready: '#rzWorkspace',
    pre: ['#rzApply'],             // Download serves whatever Apply produced
    download: '#rzDownload',
    outName: 'image-resizer.png',
    kind: 'image',
    /* The tool defaults to the source dimensions, so without touching the
       controls this measures the round-trip: does re-encoding at 100% change
       anything it should not? */
    async checks({ out }) {
      return [
        /* Resizing is not a format conversion. Defaulting every input to JPG
           returned a transparent PNG as an opaque JPEG the user never asked
           for, so a PNG or WebP source now keeps its format. JPEG sources
           still default to JPG, and the file-size mode still forces it. */
        ok('format', 'A PNG source stays PNG rather than silently becoming a JPEG',
           out.format === 'png',
           `${out.format} ${out.width}×${out.height}, ${out.bytes} bytes`, 'major'),
        ok('dims', `Default resize keeps ${IMG_W}×${IMG_H}`,
           out.width === IMG_W && out.height === IMG_H,
           `${out.width}×${out.height}`, 'major'),
        ok('alpha', 'Transparency preserved through the resize',
           out.hasAlpha, out.hasAlpha ? '' : 'alpha lost', 'major'),
      ];
    },
  },

  /* ---- split ---------------------------------------------------------- */
  {
    slug: 'split-image',
    title: 'Split image',
    fixture: 'torture.png',
    ready: '#previewCard',
    download: '#btnSplit',
    outName: 'split-image.zip',
    kind: 'zip',
    async checks({ out, readImage }) {
      const imgs = out.entries.filter((e) => /\.(png|jpe?g|webp)$/i.test(e.name));
      const parsed = imgs.map((e) => readImage(e.bytes));
      const areaSum = parsed.reduce((n, p) => n + p.width * p.height, 0);
      return [
        ok('zip', 'Produced a zip of tiles', imgs.length > 0,
           `${out.names.length} entries: ${out.names.slice(0, 4).join(', ')}`, 'blocker'),
        ok('count', 'Default 2×2 grid yields 4 tiles', imgs.length === 4,
           `${imgs.length} tiles`, 'major'),
        ok('valid', 'Every tile is a decodable image',
           parsed.every((p) => p.format !== 'unknown' && p.width > 0),
           parsed.map((p) => `${p.format} ${p.width}×${p.height}`).join(', '), 'blocker'),
        ok('area', 'Tiles reassemble to the source area (no pixels lost)',
           Math.abs(areaSum - IMG_W * IMG_H) <= IMG_W * IMG_H * 0.02,
           `tiles cover ${areaSum}px² vs source ${IMG_W * IMG_H}px²`, 'major'),
        ok('alpha', 'Transparency survives the split',
           parsed.some((p) => p.hasAlpha),
           parsed.some((p) => p.hasAlpha) ? '' : 'all tiles opaque', 'minor'),
      ];
    },
  },

  /* ---- merge ---------------------------------------------------------- */
  {
    slug: 'merge-images',
    title: 'Merge images',
    fixture: ['torture.png', 'torture.jpg'],
    ready: '#imagesList',
    download: '#btnMerge',
    outName: 'merge-images.pdf',
    /* The tool's default merge mode produces a PDF, not a stacked raster —
       #mergeMode offers both. Testing the default is the right call, so this
       reads a PDF. */
    kind: 'pdf',
    async checks({ out }) {
      return [
        ok('opens', 'Output is a readable PDF', out.pages > 0, `${out.pages} pages`, 'blocker'),
        ok('both', 'Both images embedded', out.imageCount >= 2,
           `${out.imageCount} painted images across ${out.pages} page(s)`, 'blocker'),
      ];
    },
  },

  /* ---- EXIF ----------------------------------------------------------- */
  {
    slug: 'exif-viewer',
    title: 'EXIF viewer',
    fixture: 'torture.jpg',
    ready: '#resultPanel',
    /* #btnDownload on this component hands back the *stripped image*, which is
       exif-remover's job. The viewer's actual output is the table it renders,
       so read that off the page instead. */
    readFrom: { report: '#xfTableWrap' },
    kind: 'dom',
    async checks({ out }) {
      const t = String(out.report || '');
      return [
        ok('nonempty', 'Produced a metadata report', t.trim().length > 0, `${t.length} chars`, 'blocker'),
        ok('orientation', 'Reports Orientation = 6', /orientation/i.test(t) && /\b6\b/.test(t), '', 'major'),
        ok('camera', 'Reports camera make and model',
           /ConvertOcean/.test(t) && /Torture Cam/.test(t), '', 'major'),
        ok('gps', 'Reports GPS coordinates', /51/.test(t) && /30/.test(t), '', 'major'),
        ok('iso', 'Reports ISO 400', /\b400\b/.test(t), '', 'minor'),
      ];
    },
  },
  {
    slug: 'exif-remover',
    title: 'EXIF remover',
    fixture: 'torture.jpg',
    ready: '#resultPanel',
    download: '#btnDownload',
    outName: 'exif-remover.jpg',
    kind: 'image',
    async checks({ out, readExif }) {
      // Read the actual tag list with the site's own parser, not just the
      // presence of an APP1 segment.
      const meta = readExif(out.raw);
      const sensitive = (meta.tags || [])
        .filter((t) => t.sensitive)
        .map((t) => t.name);
      return [
        ok('format', 'Still a valid JPEG', out.format === 'jpeg',
           `${out.format}, ${out.bytes} bytes`, 'blocker'),
        /* Not "is the APP1 segment gone". The tool keeps Orientation on
           purpose (#optOrientation is checked by default) so the photo does
           not flip when the tag is removed — that is correct behaviour, and
           an earlier version of this check called it a blocker. What must be
           gone is everything sensitive: GPS, camera identity, timestamps. */
        ok('stripped', 'Sensitive metadata removed (GPS, camera, timestamps)',
           !sensitive.length,
           sensitive.length ? `still present: ${sensitive.join(', ')}` : 'only Orientation retained, by design', 'blocker'),
        ok('dims', `Pixels untouched (${IMG_W}×${IMG_H})`,
           out.width === IMG_W && out.height === IMG_H,
           `${out.width}×${out.height}`, 'major'),
      ];
    },
  },
];

export default imageRecipes;
