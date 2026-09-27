/**
 * jpegOrientation() decides whether a photo is re-drawn upright before it is
 * embedded in a PDF. Wrong in one direction, phone photos come out sideways
 * and squashed (the production bug of 2026-09-27); wrong in the other, every
 * JPEG is needlessly re-encoded. Both byte orders are tested because cameras
 * write both — Apple and most Android phones "MM", others "II".
 */
import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { jpegOrientation } from '../../src/scripts/pdf-image.js';

const url = (buf) => 'data:image/jpeg;base64,' + Buffer.from(buf).toString('base64');

/** Minimal JPEG: SOI, one APP1 Exif segment with a single Orientation entry, SOS. */
function jpegWithOrientation(value, order) {
  const le = order === 'II';
  const u16 = (v) => (le ? [v & 255, v >> 8] : [v >> 8, v & 255]);
  const u32 = (v) => (le ? [v & 255, (v >> 8) & 255, (v >> 16) & 255, v >>> 24]
                         : [v >>> 24, (v >> 16) & 255, (v >> 8) & 255, v & 255]);
  const tiff = [
    ...(le ? [0x49, 0x49] : [0x4d, 0x4d]), ...u16(42), ...u32(8), // header, IFD0 at 8
    ...u16(1),                                                    // one entry
    ...u16(0x0112), ...u16(3), ...u32(1), ...u16(value), 0, 0,    // Orientation SHORT
    ...u32(0),                                                    // no next IFD
  ];
  const body = [0x45, 0x78, 0x69, 0x66, 0, 0, ...tiff];           // "Exif\0\0"
  const len = body.length + 2;
  return [0xff, 0xd8, 0xff, 0xe1, len >> 8, len & 255, ...body, 0xff, 0xda, 0, 2];
}

test('the phone-photo fixture reads as rotate-90 (6)', () => {
  assert.strictEqual(jpegOrientation(url(readFileSync('testing/fixtures/torture.jpg'))), 6);
});

test('every orientation value round-trips in both byte orders', () => {
  for (const order of ['II', 'MM']) {
    for (let v = 1; v <= 8; v++) {
      assert.strictEqual(jpegOrientation(url(jpegWithOrientation(v, order))), v, `${order} ${v}`);
    }
  }
});

test('no EXIF, not a JPEG, or garbage all mean "embed as is" (1)', () => {
  assert.strictEqual(jpegOrientation(url([0xff, 0xd8, 0xff, 0xda, 0, 2])), 1);
  assert.strictEqual(jpegOrientation(url(readFileSync('testing/fixtures/torture.png'))), 1);
  assert.strictEqual(jpegOrientation('data:image/jpeg;base64,%%%not-base64'), 1);
  assert.strictEqual(jpegOrientation(url(jpegWithOrientation(99, 'MM'))), 1);
});
