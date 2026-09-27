/**
 * Prepare a browser-loaded image for jsPDF's addImage.
 *
 * jsPDF embeds image bytes as they are stored. Two things go wrong with that:
 *
 *  - EXIF orientation. Phones save a portrait photo as landscape pixels plus a
 *    "rotate 90°" tag. The browser honours the tag, so the <img> reports the
 *    ROTATED size, but jsPDF never reads EXIF — the raw pixels were painted
 *    sideways into the rotated box, squashed (measured on production
 *    2026-09-27: 240×160 painted into a 0.667 box).
 *  - Formats jsPDF has no path for. MergeImages accepts image/* and advertises
 *    SVG, but labelled everything that was not PNG as 'JPEG'.
 *
 * So: PNG, WebP and upright JPEG are embedded byte for byte, as before. A
 * rotated JPEG, or any other format, is drawn through a canvas — drawImage
 * applies the orientation — and embedded from there (JPEG stays JPEG at 0.92;
 * anything else becomes PNG, so transparency survives).
 *
 * The tool components are `is:inline` and cannot import, so [tool].astro
 * publishes this as window.coPdfImage.
 */

/** EXIF Orientation (1–8) of a JPEG data URL, or 1 when absent or unreadable. */
export function jpegOrientation(dataUrl) {
  try {
    const comma = dataUrl.indexOf(',');
    // 87384 base64 chars = 65538 bytes: enough to cover a maximal APP1 segment.
    const bin = atob(dataUrl.slice(comma + 1, comma + 1 + 87384));
    const u8 = (i) => bin.charCodeAt(i);
    if (u8(0) !== 0xff || u8(1) !== 0xd8) return 1;
    let p = 2;
    while (p + 4 < bin.length) {
      if (u8(p) !== 0xff) return 1;
      const marker = u8(p + 1);
      const len = (u8(p + 2) << 8) | u8(p + 3);
      if (marker === 0xe1 && bin.slice(p + 4, p + 10) === 'Exif\0\0') {
        const t = p + 10;
        const le = bin.slice(t, t + 2) === 'II';
        const r16 = (o) => (le ? u8(t + o) | (u8(t + o + 1) << 8) : (u8(t + o) << 8) | u8(t + o + 1));
        const r32 = (o) => (le
          ? u8(t + o) + u8(t + o + 1) * 256 + u8(t + o + 2) * 65536 + u8(t + o + 3) * 16777216
          : u8(t + o) * 16777216 + u8(t + o + 1) * 65536 + u8(t + o + 2) * 256 + u8(t + o + 3));
        const ifd = r32(4);
        const n = r16(ifd);
        for (let k = 0; k < n; k++) {
          const e = ifd + 2 + k * 12;
          if (r16(e) === 0x0112) {
            const v = r16(e + 8);
            return v >= 1 && v <= 8 ? v : 1;
          }
        }
        return 1;
      }
      if (marker === 0xda) return 1; // scan data begins; no EXIF before it
      p += 2 + len;
    }
  } catch { /* malformed: embed as before */ }
  return 1;
}

/**
 * @param {HTMLImageElement} img  already loaded from dataUrl
 * @param {string} dataUrl
 * @returns {{ data: string, format: 'PNG'|'JPEG'|'WEBP' }}
 */
export function pdfImage(img, dataUrl) {
  const type = dataUrl.slice(5, dataUrl.indexOf(';')).toLowerCase();
  if (type === 'image/png') return { data: dataUrl, format: 'PNG' };
  if (type === 'image/webp') return { data: dataUrl, format: 'WEBP' };
  const isJpeg = type === 'image/jpeg' || type === 'image/jpg';
  if (isJpeg && jpegOrientation(dataUrl) <= 1) return { data: dataUrl, format: 'JPEG' };

  const c = document.createElement('canvas');
  c.width = img.naturalWidth || img.width;
  c.height = img.naturalHeight || img.height;
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return isJpeg
    ? { data: c.toDataURL('image/jpeg', 0.92), format: 'JPEG' }
    : { data: c.toDataURL('image/png'), format: 'PNG' };
}
