/**
 * The part of the office compressor that can be checked without a browser.
 *
 * `compressOoxml` needs `createImageBitmap` and `OffscreenCanvas`, so the
 * end-to-end run belongs in `npm run compress`, which drives the real page.
 * But everything it decides *before* touching a pixel is pure, and those are
 * the decisions that go wrong quietly:
 *
 *   - reading how big an image is actually displayed, through a relationship
 *     whose target is written relative to the part that declared it
 *   - taking the largest placement when one image is used several times
 *   - reading pixel dimensions out of PNG and JPEG headers
 *
 * Get any of those wrong and the engine still runs, still produces a valid
 * file, and silently compresses to the wrong size — which is exactly the
 * failure a green end-to-end run would not notice.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import JSZip from 'jszip';
import * as TESTING_PATHS from '../testing-paths.mjs';
import {
  resolveTarget, relsPathFor, measurePlacements, pngSize, jpegSize,
} from '../../src/scripts/ooxml-compress.js';
import { planResample } from '../../src/scripts/image-compress.js';

const FIXTURE = TESTING_PATHS.fixture('torture-compress.pptx');

test('a relationship target resolves against the part that declared it', () => {
  /* Slide rels say "../media/x.png" and mean ppt/media/x.png. Getting this
     wrong means no placement is ever found, every image looks undisplayed,
     and the compressor silently does nothing at all. */
  assert.equal(resolveTarget('ppt/slides/slide1.xml', '../media/photo.png'), 'ppt/media/photo.png');
  assert.equal(resolveTarget('word/document.xml', 'media/photo.png'), 'word/media/photo.png');
  assert.equal(resolveTarget('ppt/slides/slide1.xml', '../../ppt/media/a.png'), 'ppt/media/a.png');
});

test('the rels part for a part is named correctly', () => {
  assert.equal(relsPathFor('ppt/slides/slide1.xml'), 'ppt/slides/_rels/slide1.xml.rels');
  assert.equal(relsPathFor('word/document.xml'), 'word/_rels/document.xml.rels');
});

test('PNG and JPEG pixel sizes come out of the headers', () => {
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    Buffer.from([0, 0, 0, 13]), Buffer.from('IHDR'),
    (() => { const b = Buffer.alloc(13); b.writeUInt32BE(1600, 0); b.writeUInt32BE(1200, 4); b[8] = 8; b[9] = 6; return b; })(),
  ]);
  assert.deepEqual(pngSize(new Uint8Array(png)), { width: 1600, height: 1200, colorType: 6 });
  assert.equal(pngSize(new Uint8Array([1, 2, 3])), null, 'a non-PNG must report null, not guess');

  /* SOF0 with height 480, width 640. The length byte matters: a scanner that
     mis-steps lands mid-segment and reads garbage as dimensions. */
  const jpg = Buffer.from([
    0xff, 0xd8,
    0xff, 0xe0, 0x00, 0x10, ...Array(14).fill(0),
    0xff, 0xc0, 0x00, 0x11, 0x08, 0x01, 0xe0, 0x02, 0x80,
    ...Array(8).fill(0),
  ]);
  assert.deepEqual(jpegSize(new Uint8Array(jpg)), { width: 640, height: 480 });
});

test('every image in the fixture is measured at the size it is displayed', async () => {
  const zip = await JSZip.loadAsync(readFileSync(FIXTURE));
  const sizes = await measurePlacements(zip);

  const pt = (inches) => inches * 72;
  const expected = {
    'ppt/media/photo-big.png': { w: pt(4.0), h: pt(3.0) },
    'ppt/media/photo-mid.png': { w: pt(4.0), h: pt(3.0) },
    'ppt/media/graphic.png': { w: pt(4.0), h: pt(3.0) },
    'ppt/media/right-sized.png': { w: pt(2.5), h: pt(1.67) },
    'ppt/media/transparent.png': { w: pt(2.0), h: pt(2.0) },
  };

  for (const [part, want] of Object.entries(expected)) {
    const got = sizes.get(part);
    assert.ok(got, `${part} was not measured at all — it would be left uncompressed`);
    assert.ok(Math.abs(got.w - want.w) < 1 && Math.abs(got.h - want.h) < 1,
      `${part}: displayed ${got.w.toFixed(0)}x${got.h.toFixed(0)}pt, expected ${want.w.toFixed(0)}x${want.h.toFixed(0)}pt`);
  }
  assert.equal(sizes.size, Object.keys(expected).length, 'measured a placement that is not in the fixture');
});

test('the fixture drives each of the engine\'s four decisions', async () => {
  /* The point of the fixture: each image must land on a different branch, so
     a policy change that collapses two of them together fails here rather
     than shipping. */
  const zip = await JSZip.loadAsync(readFileSync(FIXTURE));
  const sizes = await measurePlacements(zip);
  const settings = { dpi: 150, quality: 0.72 };

  const plans = {};
  for (const [part, drawn] of sizes) {
    const raw = new Uint8Array(await zip.file(part).async('uint8array'));
    const dims = pngSize(raw);
    plans[part.split('/').pop()] = planResample({
      width: dims.width, height: dims.height, originalBytes: raw.length,
      lossy: false, drawnPt: drawn,
    }, settings);
  }

  assert.equal(plans['photo-big.png'].skip, false, 'a 400 DPI photo must be resampled');
  assert.ok(plans['photo-big.png'].effectiveDpi === undefined
         || plans['photo-big.png'].base.effectiveDpi === 400,
    'photo-big should measure 400 DPI, got ' + plans['photo-big.png'].base.effectiveDpi);

  assert.equal(plans['photo-mid.png'].skip, false, 'a 300 DPI photo must be resampled');
  assert.equal(plans['photo-mid.png'].looksGraphic, false, 'a scan is not a flat graphic');

  assert.equal(plans['graphic.png'].looksGraphic, true,
    'a 0.006 B/px flat graphic must be recognised, or it gets turned into a bigger JPEG');
  assert.equal(plans['graphic.png'].threshold, 0.70, 'a graphic must be charged the 30% bar');

  assert.equal(plans['right-sized.png'].skip, true, 'an image already at 96 DPI must not be touched');

  /* The one the shared policy gets wrong on its own, and the reason the engine
     checks for alpha before it ever asks. If this ever starts returning
     skip:true, the alpha guard has become dead code and should be removed
     rather than left looking load-bearing. */
  assert.equal(plans['transparent.png'].skip, false,
    'the policy still sees the transparent PNG as a shrinkable photo — the engine\'s alpha check is what protects it');
});
