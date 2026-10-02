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

  /* /jpeg-to-jpg/ serves both directions (jpg-to-jpeg 301s to it): the
     output takes the spelling the input lacks. The image checks are the
     standard ones; the extra one is the saved filename, which is the whole
     point of the page and was never asserted before. */
  ...[['torture.jpg', 'jpeg', 'JPG → JPEG (same page, .jpg in)'],
      ['torture.jpeg', 'jpg', 'JPEG → JPG (same page, .jpeg in)']].map(([fixture, want, title]) => {
    const base = conversion('jpeg-to-jpg', fixture, 'jpeg', { sourceHasExif: true });
    return {
      ...base,
      title,
      outName: `jpeg-to-jpg-from-${fixture.split('.').pop()}.${want}`,
      async checks(ctx) {
        const got = (ctx.downloadName || '').split('.').pop();
        return [...await base.checks(ctx),
          ok('ext', `Saves as .${want}`, got === want, `downloaded "${ctx.downloadName}"`, 'blocker')];
      },
    };
  }),

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

  /* A phone photo: stored 240×160 with EXIF Orientation=6 (rotate 90° CW),
     so it DISPLAYS 160×240. The browser honours the tag and jsPDF does not —
     until 2026-09-27 the tool drew the raw landscape pixels into the rotated
     portrait box, sideways and squashed (embedded 1.5:1 into a 0.667 box),
     on production. The only way to see it is to compare the embedded image's
     pixel shape with the box it is painted into. */
  {
    slug: 'image-to-pdf',
    title: 'Image → PDF (phone photo with EXIF rotation)',
    fixture: 'torture.jpg',
    ready: '#actionControls',
    download: '#btnDownload',
    outName: 'image-to-pdf-exif.pdf',
    kind: 'pdf',
    async checks({ out, bytes }) {
      const pdf = Buffer.from(bytes).toString('latin1');
      const w = +(pdf.match(/\/Width (\d+)/) || [])[1];
      const h = +(pdf.match(/\/Height (\d+)/) || [])[1];
      const cm = pdf.match(/([\d.]+) 0 0 ([\d.]+) [\d.]+ [\d.]+ cm/);
      const drawnW = cm ? +cm[1] : 0, drawnH = cm ? +cm[2] : 0;
      const embedded = w && h ? w / h : 0;
      const drawn = drawnW && drawnH ? drawnW / drawnH : 0;
      return [
        ok('opens', 'Output is a readable PDF', out.pages > 0, `${out.pages} pages`, 'blocker'),
        ok('upright', 'The photo is painted upright (portrait, as it displays)',
           drawnH > drawnW, `drawn ${drawnW}×${drawnH}pt`, 'blocker'),
        ok('unsquashed', 'The embedded pixels have the shape of the box they are drawn in',
           embedded > 0 && Math.abs(embedded - drawn) < 0.02,
           `embedded ${w}×${h} (${embedded.toFixed(3)}) into ${drawn.toFixed(3)}`, 'blocker'),
      ];
    },
  },

  /* WebP is in the accept list and every page says it works; no recipe had
     ever sent one. jsPDF needs its own WebP path for this. */
  {
    slug: 'image-to-pdf',
    title: 'Image → PDF (WebP)',
    fixture: 'torture.webp',
    ready: '#actionControls',
    download: '#btnDownload',
    outName: 'image-to-pdf-webp.pdf',
    kind: 'pdf',
    async checks({ out }) {
      return [
        ok('opens', 'Output is a readable PDF', out.pages > 0, `${out.pages} pages`, 'blocker'),
        ok('embedded', 'The WebP image is actually embedded', out.imageCount > 0,
           `${out.imageCount} painted images`, 'blocker'),
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
           areaSum === IMG_W * IMG_H,
           `tiles cover ${areaSum}px² vs source ${IMG_W * IMG_H}px²`, 'major'),
        ok('alpha', 'Transparency survives the split',
           parsed.some((p) => p.hasAlpha),
           parsed.some((p) => p.hasAlpha) ? '' : 'all tiles opaque', 'minor'),
      ];
    },
  },
  {
    /* The shapes the 2×2 PNG above could never reach. 240×160 does not divide
       by 7 or 3, so a fractional tile size was truncated and lost pixel
       columns (the area check above used to allow 2%). And a WebP input was
       encoded as JPEG but named .webp, with its transparency turned black. */
    slug: 'split-image',
    title: 'Split image (WebP, 3×7 uneven grid)',
    fixture: 'torture.webp',
    ready: '#previewCard',
    pre: [{ setValue: '#numRows', value: '3' }, { setValue: '#numCols', value: '7' }],
    download: '#btnSplit',
    outName: 'split-image-webp.zip',
    kind: 'zip',
    async checks({ out, readImage }) {
      const imgs = out.entries.filter((e) => /\.(png|jpe?g|webp)$/i.test(e.name));
      const parsed = imgs.map((e) => ({ name: e.name, ...readImage(e.bytes) }));
      const areaSum = parsed.reduce((n, p) => n + p.width * p.height, 0);
      const mislabelled = parsed.filter((p) => {
        const ext = p.name.split('.').pop().toLowerCase();
        return !(ext === p.format || (ext === 'jpg' && p.format === 'jpeg'));
      });
      return [
        ok('count', '3×7 grid yields 21 tiles', imgs.length === 21, `${imgs.length} tiles`, 'blocker'),
        ok('area', 'Every source pixel lands in exactly one tile', areaSum === IMG_W * IMG_H,
           `tiles cover ${areaSum}px² vs source ${IMG_W * IMG_H}px²`, 'major'),
        ok('ext', 'Each tile\'s extension matches its actual format', mislabelled.length === 0,
           mislabelled.slice(0, 3).map((p) => `${p.name} is ${p.format}`).join(', '), 'major'),
        ok('alpha', 'A transparent WebP keeps its transparency in the tiles',
           parsed.some((p) => p.hasAlpha), parsed.map((p) => p.format)[0] || '', 'major'),
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

  /* The recipe above passed while this tool painted a rotated phone JPEG
     sideways and squashed, because it counted images and never looked at
     their shape; WebP was also handed to jsPDF labelled 'JPEG'. This compares
     every embedded image's pixel aspect with the aspect of the box it is
     painted into, as multisets, since object order and paint order differ. */
  {
    slug: 'merge-images',
    title: 'Merge images → PDF (phone photo with EXIF rotation, and WebP)',
    fixture: ['torture.jpg', 'torture.webp'],
    ready: '#imagesList',
    download: '#btnMerge',
    outName: 'merge-images-exif.pdf',
    kind: 'pdf',
    async checks({ out, bytes }) {
      const pdf = Buffer.from(bytes).toString('latin1');
      const embedded = [...pdf.matchAll(/\/Width (\d+)\s*\/Height (\d+)/g)].map(m => +m[1] / +m[2]).sort();
      const drawn = [...pdf.matchAll(/([\d.]+) 0 0 ([\d.]+) [\d.-]+ [\d.-]+ cm/g)].map(m => +m[1] / +m[2]).sort();
      const same = embedded.length === 2 && drawn.length === 2
        && embedded.every((a, i) => Math.abs(a - drawn[i]) < 0.02);
      const fmt = (xs) => xs.map(x => x.toFixed(3)).join(', ');
      return [
        ok('opens', 'Output is a readable PDF', out.pages > 0, `${out.pages} pages`, 'blocker'),
        ok('both', 'Both images embedded (JPEG and WebP)', out.imageCount >= 2,
           `${out.imageCount} painted images`, 'blocker'),
        ok('unsquashed', 'Each embedded image has the shape of the box it is drawn in',
           same, `embedded [${fmt(embedded)}] vs drawn [${fmt(drawn)}]`, 'blocker'),
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
      /* The report is now read row-per-line (see the DOM reader in run.mjs),
         so a tag and its value can be asserted together instead of hoping
         two loose numbers appear somewhere in one long concatenated string.
         Every detail below reports what was actually found: an earlier
         version passed '' for all of them, which made the one real failure
         here impossible to diagnose without re-running by hand. */
      const row = (name) => {
        const lines = t.split('\n');
        const i = lines.findIndex((l) => new RegExp('^' + name + '$', 'i').test(l.trim()));
        return i >= 0 ? (lines[i + 1] || '').trim() : null;
      };
      const iso = row('ISO');
      const orientation = row('Orientation');
      const make = row('Camera Make');
      const model = row('Camera Model');
      const lat = row('Latitude');
      const lon = row('Longitude');
      return [
        ok('nonempty', 'Produced a metadata report', t.trim().length > 0,
           `${t.split('\n').length} rows, ${t.length} chars`, 'blocker'),
        ok('orientation', 'Reports Orientation = 6',
           !!orientation && /\b6\b/.test(orientation), `Orientation → ${orientation ?? 'no such row'}`, 'major'),
        ok('camera', 'Reports camera make and model',
           /ConvertOcean/.test(make || '') && /Torture Cam/.test(model || ''),
           `${make ?? 'no make'} / ${model ?? 'no model'}`, 'major'),
        ok('gps', 'Reports GPS coordinates',
           /51/.test(lat || '') && /30/.test(lat || '') && !!lon,
           `lat ${lat ?? 'none'}, lon ${lon ?? 'none'}`, 'major'),
        ok('iso', 'Reports ISO 400', iso === '400', `ISO → ${iso ?? 'no such row'}`, 'minor'),
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
