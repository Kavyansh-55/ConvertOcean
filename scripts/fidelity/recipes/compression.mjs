/**
 * Compression tools.
 *
 * Every other family here asks "did the content survive the conversion". A
 * compressor is judged on two things at once, and they pull against each
 * other: it has to make the file meaningfully smaller, and it has to leave
 * everything that is not image data completely alone.
 *
 * That second half is why these checks lean so heavily on things a size
 * number cannot see. The cheap way to build a PDF compressor is to render
 * every page to a bitmap and wrap the bitmaps in a new document. It produces
 * excellent size figures and a ruined file: no selectable text, dead links,
 * dead form fields, and vector art turned to mush. A suite that only measured
 * bytes would score that implementation *higher* than a correct one.
 *
 * So the assertions are mostly survival assertions, and the size assertion
 * exists to stop a tool passing them all by doing nothing at all.
 *
 * `torture-compress.pdf` is built for exactly this: four pages holding one
 * over-resolution JPEG, a photographic PNG-style image, a flat graphic that
 * must NOT be re-encoded, an image already at the right size, a 1-bit stencil,
 * a soft-masked image, four fonts, a link and an AcroForm field. The
 * per-image decisions — which of those got touched and which did not — are
 * checked by `npm run compress`, which can read the streams directly.
 */
import { ok } from './_shared.mjs';

/** The text markers that are real text. M01 is painted inside the JPEG on
 *  page 1, and M14 is the form field's value, so neither is page text. */
const TEXT_MARKERS = ['M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M09', 'M10', 'M11', 'M12', 'M13'];

export const compressionRecipes = [
  {
    slug: 'compress-pdf',
    title: 'Compress PDF',
    fixture: 'torture-compress.pdf',
    /* The tool compresses as soon as a file lands rather than making the
       reader press a button, so "ready" is not the workspace appearing — it is
       the download becoming available, which is the moment the first pass has
       actually finished. */
    ready: '#cmpDownload:not([disabled])',
    download: '#cmpDownload',
    outName: 'compress-pdf.pdf',
    kind: 'pdf',
    async checks({ out, src, bytes, srcBytes }) {
      const ratio = bytes.length / srcBytes;
      const gone = TEXT_MARKERS.filter((m) => !out.text.replace(/\s+/g, ' ').includes(m));
      const link = (out.links || []).find((l) => /compress-pdf/.test(l.url || ''));
      const field = (out.fields || []).find((f) => f.value === 'M14-FORM-VALUE');

      return [
        ok('opens', 'Output is a readable PDF', out.pages > 0,
           `${out.pages} pages`, 'blocker'),

        ok('pages', 'All four pages survive', out.pages === 4,
           `${out.pages} pages (source had ${src.pages})`, 'blocker'),

        /* The default preset on this fixture lands near 25%. Asserting "under
           half" rather than a tight number leaves room for browser JPEG
           encoders to differ by a few percent between versions without
           turning a working tool red. */
        ok('smaller', 'File is at least 50% smaller', ratio < 0.5,
           `${srcBytes.toLocaleString()} -> ${bytes.length.toLocaleString()} bytes ` +
           `(${Math.round((1 - ratio) * 100)}% smaller)`, 'blocker'),

        /* The check that rules out the rasterise-everything shortcut. */
        ok('text', 'Every text marker is still selectable text', gone.length === 0,
           gone.length ? `missing: ${gone.join(', ')}` : `all ${TEXT_MARKERS.length} present`, 'blocker'),

        ok('fonts', 'All four embedded fonts remain',
           out.fonts.length >= 4, `fonts: ${out.fonts.join(', ')}`, 'blocker'),

        ok('link', 'Link annotation survives with its URL', !!link,
           link ? link.url : `links found: ${(out.links || []).length}`, 'blocker'),

        ok('form', 'AcroForm field keeps its value', !!field,
           field ? `${field.name}=${field.value}`
                 : `fields found: ${JSON.stringify(out.fields || [])}`, 'blocker'),

        /* An image the compressor could not handle must be left in place, not
           dropped. Losing one silently is a far worse bug than not shrinking
           it, and it would otherwise look like an excellent size result. */
        ok('images', 'No image is dropped from the document',
           out.imageCount === src.imageCount,
           `${out.imageCount} image paints vs ${src.imageCount} in the source`, 'blocker'),

        ok('geometry', 'Page size unchanged (612x792pt Letter)',
           out.sizes.every((s) => Math.abs(s.width - 612) < 4 && Math.abs(s.height - 792) < 4),
           out.sizes.map((s) => `${s.width}x${s.height}`).join(' '), 'major'),

        /* Page 4 has no images at all, so nothing on it had any reason to
           change. If its text sizes have shifted, the tool is re-authoring
           pages rather than swapping image streams. */
        ok('textsizes', 'Text sizes unchanged',
           src.sizes_pt.every((s) => out.sizes_pt.includes(s)),
           `out: ${out.sizes_pt.join(',')} | src: ${src.sizes_pt.join(',')}`, 'major'),
      ];
    },
  },
];

export default compressionRecipes;
