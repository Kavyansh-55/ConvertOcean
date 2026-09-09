/**
 * Minimal PNG encoder — no dependencies.
 *
 * The fixtures need a real raster image to drop into a .docx / .pptx so we can
 * assert "did the image survive the conversion". Pulling a PNG library in for
 * that would be silly, and a checked-in binary blob is opaque when a test
 * fails. Generating one from code keeps the fixture readable: you can see
 * exactly what pixels the converter was handed.
 */
import { deflateSync } from 'node:zlib';

function crc32(buf) {
  let c, table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (const b of buf) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/**
 * @param {number} w width in px
 * @param {number} h height in px
 * @param {(x:number,y:number)=>[number,number,number]} shade RGB for a pixel
 * @returns {Buffer} a valid 8-bit RGB PNG
 */
export function makePng(w, h, shade) {
  const raw = Buffer.alloc(h * (1 + w * 3));
  let p = 0;
  for (let y = 0; y < h; y++) {
    raw[p++] = 0; // filter: none
    for (let x = 0; x < w; x++) {
      const [r, g, b] = shade(x, y);
      raw[p++] = r; raw[p++] = g; raw[p++] = b;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 2;   // colour type: truecolour
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/**
 * A deliberately unmistakable image: four saturated quadrants with a white
 * cross. If a converter rescales, recolours or drops it, the change is obvious
 * both to the eye and to a pixel assertion.
 */
export function markerPng(w = 240, h = 160) {
  return makePng(w, h, (x, y) => {
    const cx = Math.abs(x - w / 2) < 6;
    const cy = Math.abs(y - h / 2) < 6;
    if (cx || cy) return [255, 255, 255];
    const left = x < w / 2, top = y < h / 2;
    if (top && left) return [220, 38, 38];    // red
    if (top && !left) return [22, 163, 74];   // green
    if (!top && left) return [37, 99, 235];   // blue
    return [234, 179, 8];                     // amber
  });
}

/**
 * 8-bit RGBA PNG. Transparency is the single most common thing an image
 * converter gets wrong — PNG→JPG has no alpha channel to write into, so a
 * converter either composites onto a colour it chose or leaves the transparent
 * pixels black, and the user finds out afterwards.
 *
 * @param {(x:number,y:number)=>[number,number,number,number]} shade RGBA
 */
export function makePngRgba(w, h, shade) {
  const raw = Buffer.alloc(h * (1 + w * 4));
  let p = 0;
  for (let y = 0; y < h; y++) {
    raw[p++] = 0; // filter: none
    for (let x = 0; x < w; x++) {
      const [r, g, b, a] = shade(x, y);
      raw[p++] = r; raw[p++] = g; raw[p++] = b; raw[p++] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 6;   // colour type: truecolour with alpha
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/**
 * The marker pattern with a fully transparent lower-right quadrant and a
 * soft alpha ramp across the top-right one. Converting this to JPEG forces a
 * visible decision about the background; converting it to WebP or PNG should
 * preserve both the hard hole and the gradient.
 */
export function markerPngAlpha(w = 240, h = 160) {
  return makePngRgba(w, h, (x, y) => {
    const left = x < w / 2, top = y < h / 2;
    if (Math.abs(x - w / 2) < 6 || Math.abs(y - h / 2) < 6) return [255, 255, 255, 255];
    if (top && left) return [220, 38, 38, 255];                                  // opaque red
    if (top && !left) return [22, 163, 74, Math.round(255 * ((x - w / 2) / (w / 2)))]; // alpha ramp
    if (!top && left) return [37, 99, 235, 255];                                 // opaque blue
    return [0, 0, 0, 0];                                                          // fully transparent
  });
}
