/**
 * Read and remove image metadata (EXIF / XMP / IPTC) without re-encoding.
 *
 * WHY BYTE SURGERY AND NOT A CANVAS
 * ---------------------------------
 * The common way to "remove EXIF" in a browser is to draw the photo onto a
 * canvas and re-export it. That does strip the metadata — by throwing away the
 * original pixels and producing a brand-new lossy JPEG. The result is a second
 * generation of compression artefacts on every photo, for a job that requires
 * no decoding at all.
 *
 * Metadata lives in container structures that sit *beside* the compressed image
 * data: APP segments in JPEG, ancillary chunks in PNG, RIFF chunks in WebP.
 * Removing them is a copy operation. In JPEG every metadata segment appears
 * before the first Start-of-Scan marker, so everything from SOS to end-of-file
 * is copied verbatim — which makes the output's image data byte-identical to
 * the input's, not merely visually identical.
 *
 * THE ORIENTATION TRAP
 * --------------------
 * Orientation (tag 0x0112) lives in EXIF, but it is not private information —
 * it is how the file says "this photo was taken sideways". Strip it wholesale
 * and a portrait photo suddenly displays on its side in every viewer that
 * honoured it. So by default a minimal EXIF block carrying *only* Orientation
 * is rebuilt, and nothing else survives. Removing it as well is offered, with
 * the consequence stated.
 */

/* --------------------------------------------------------------- Tag tables */

const IFD0_TAGS = {
  0x010e: 'Image Description',
  0x010f: 'Camera Make',
  0x0110: 'Camera Model',
  0x0112: 'Orientation',
  0x011a: 'X Resolution',
  0x011b: 'Y Resolution',
  0x0128: 'Resolution Unit',
  0x0131: 'Software',
  0x0132: 'Date/Time Modified',
  0x013b: 'Artist',
  0x8298: 'Copyright',
  0x9c9b: 'Title (Windows)',
  0x9c9c: 'Comment (Windows)',
  0x9c9d: 'Author (Windows)',
  0x9c9e: 'Keywords (Windows)',
  0x9c9f: 'Subject (Windows)'
};

const EXIF_TAGS = {
  0x829a: 'Exposure Time',
  0x829d: 'F Number',
  0x8822: 'Exposure Program',
  0x8827: 'ISO',
  0x9000: 'Exif Version',
  0x9003: 'Date Taken',
  0x9004: 'Date Digitised',
  0x9201: 'Shutter Speed',
  0x9202: 'Aperture',
  0x9204: 'Exposure Bias',
  0x9207: 'Metering Mode',
  0x9209: 'Flash',
  0x920a: 'Focal Length',
  0x927c: 'Maker Note',
  0x9286: 'User Comment',
  0xa002: 'Pixel X Dimension',
  0xa003: 'Pixel Y Dimension',
  0xa402: 'Exposure Mode',
  0xa403: 'White Balance',
  0xa405: 'Focal Length (35mm)',
  0xa430: 'Camera Owner Name',
  0xa431: 'Body Serial Number',
  0xa432: 'Lens Specification',
  0xa433: 'Lens Make',
  0xa434: 'Lens Model',
  0xa435: 'Lens Serial Number'
};

const GPS_TAGS = {
  0x0000: 'GPS Version',
  0x0001: 'Latitude Ref',
  0x0002: 'Latitude',
  0x0003: 'Longitude Ref',
  0x0004: 'Longitude',
  0x0005: 'Altitude Ref',
  0x0006: 'Altitude',
  0x0007: 'GPS Timestamp',
  0x0008: 'GPS Satellites',
  0x0012: 'Map Datum',
  0x001d: 'GPS Datestamp'
};

/**
 * Tags that identify a person, a place, or a specific physical device.
 * These are what make metadata a privacy question rather than a technical one.
 */
const SENSITIVE = new Set([
  'Latitude', 'Longitude', 'Latitude Ref', 'Longitude Ref', 'Altitude',
  'GPS Timestamp', 'GPS Datestamp', 'GPS Satellites', 'Map Datum', 'GPS Version',
  'Altitude Ref',
  'Camera Owner Name', 'Body Serial Number', 'Lens Serial Number',
  'Artist', 'Copyright', 'Author (Windows)', 'Comment (Windows)',
  'Title (Windows)', 'Keywords (Windows)', 'Subject (Windows)',
  'Date Taken', 'Date Digitised', 'Date/Time Modified',
  'Camera Make', 'Camera Model', 'Software', 'Maker Note', 'User Comment',
  'Image Description'
]);

const TYPE_SIZES = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 6: 1, 7: 1, 8: 2, 9: 4, 10: 8, 11: 4, 12: 8 };

const ORIENTATION_TEXT = {
  1: 'Normal',
  2: 'Mirrored horizontally',
  3: 'Rotated 180°',
  4: 'Mirrored vertically',
  5: 'Mirrored and rotated 270° clockwise',
  6: 'Rotated 90° clockwise',
  7: 'Mirrored and rotated 90° clockwise',
  8: 'Rotated 270° clockwise'
};

/* ------------------------------------------------------------ TIFF/EXIF read */

function makeReader(bytes, base, littleEndian) {
  return {
    u16(off) {
      const i = base + off;
      return littleEndian ? bytes[i] | (bytes[i + 1] << 8) : (bytes[i] << 8) | bytes[i + 1];
    },
    u32(off) {
      const i = base + off;
      const v = littleEndian
        ? bytes[i] | (bytes[i + 1] << 8) | (bytes[i + 2] << 16) | (bytes[i + 3] << 24)
        : (bytes[i] << 24) | (bytes[i + 1] << 16) | (bytes[i + 2] << 8) | bytes[i + 3];
      return v >>> 0;
    },
    i32(off) {
      const i = base + off;
      return littleEndian
        ? bytes[i] | (bytes[i + 1] << 8) | (bytes[i + 2] << 16) | (bytes[i + 3] << 24)
        : (bytes[i] << 24) | (bytes[i + 1] << 16) | (bytes[i + 2] << 8) | bytes[i + 3];
    }
  };
}

function readAscii(bytes, base, offset, count) {
  let out = '';
  for (let i = 0; i < count; i++) {
    const c = bytes[base + offset + i];
    if (c === 0 || c === undefined) break;
    out += String.fromCharCode(c);
  }
  return out.trim();
}

function formatRational(num, den) {
  if (den === 0) return num === 0 ? '0' : 'undefined';
  const v = num / den;
  if (Number.isInteger(v)) return String(v);
  return String(Math.round(v * 10000) / 10000);
}

/** Decode one IFD entry into a display value plus the raw numbers behind it. */
function readEntry(bytes, tiffBase, entryOffset, littleEndian) {
  const r = makeReader(bytes, tiffBase, littleEndian);
  const tag = r.u16(entryOffset);
  const type = r.u16(entryOffset + 2);
  const count = r.u32(entryOffset + 4);
  const size = TYPE_SIZES[type];
  if (!size) return { tag, type, count, value: '(unsupported type)', numbers: [] };

  const total = size * count;
  // Values of four bytes or fewer are stored inline in the offset field itself.
  const valueOffset = total <= 4 ? entryOffset + 8 : r.u32(entryOffset + 8);
  if (tiffBase + valueOffset + total > bytes.length) {
    return { tag, type, count, value: '(truncated)', numbers: [] };
  }

  if (type === 2) {
    return { tag, type, count, value: readAscii(bytes, tiffBase, valueOffset, count), numbers: [] };
  }

  const numbers = [];
  const parts = [];
  const limit = Math.min(count, 24);
  for (let i = 0; i < limit; i++) {
    const off = valueOffset + i * size;
    if (type === 1 || type === 7) { numbers.push(bytes[tiffBase + off]); parts.push(String(bytes[tiffBase + off])); }
    else if (type === 3) { const v = r.u16(off); numbers.push(v); parts.push(String(v)); }
    else if (type === 8) { let v = r.u16(off); if (v > 32767) v -= 65536; numbers.push(v); parts.push(String(v)); }
    else if (type === 4) { const v = r.u32(off); numbers.push(v); parts.push(String(v)); }
    else if (type === 9) { const v = r.i32(off); numbers.push(v); parts.push(String(v)); }
    else if (type === 5) {
      const n = r.u32(off), d = r.u32(off + 4);
      numbers.push(d === 0 ? 0 : n / d);
      parts.push(formatRational(n, d));
    } else if (type === 10) {
      const n = r.i32(off), d = r.i32(off + 4);
      numbers.push(d === 0 ? 0 : n / d);
      parts.push(formatRational(n, d));
    } else { parts.push('?'); }
  }
  const suffix = count > limit ? ' …' : '';
  return { tag, type, count, value: parts.join(', ') + suffix, numbers };
}

function readIfd(bytes, tiffBase, ifdOffset, littleEndian, tagNames, ifdLabel, out, seen) {
  if (ifdOffset <= 0 || tiffBase + ifdOffset + 2 > bytes.length) return null;
  if (seen.has(ifdOffset)) return null; // malformed files can loop
  seen.add(ifdOffset);

  const r = makeReader(bytes, tiffBase, littleEndian);
  const count = r.u16(ifdOffset);
  // A plausible IFD cannot have thousands of entries; refuse rather than crawl.
  if (count > 512) return null;

  const pointers = {};
  for (let i = 0; i < count; i++) {
    const entryOffset = ifdOffset + 2 + i * 12;
    if (tiffBase + entryOffset + 12 > bytes.length) break;
    const entry = readEntry(bytes, tiffBase, entryOffset, littleEndian);

    if (entry.tag === 0x8769) { pointers.exif = entry.numbers[0]; continue; }
    if (entry.tag === 0x8825) { pointers.gps = entry.numbers[0]; continue; }
    if (entry.tag === 0xa005) { pointers.interop = entry.numbers[0]; continue; }

    const name = tagNames[entry.tag];
    if (!name) continue; // skip vendor/undocumented tags rather than show noise

    let display = entry.value;
    if (name === 'Orientation') {
      display = (ORIENTATION_TEXT[entry.numbers[0]] || 'Unknown') + ' (' + entry.numbers[0] + ')';
    }

    out.push({
      ifd: ifdLabel,
      tag: entry.tag,
      name,
      value: display,
      numbers: entry.numbers,
      sensitive: SENSITIVE.has(name)
    });
  }

  const nextOffset = ifdOffset + 2 + count * 12;
  pointers.next = tiffBase + nextOffset + 4 <= bytes.length ? r.u32(nextOffset) : 0;
  return pointers;
}

function gpsCoordinate(parts, ref) {
  if (!parts || parts.length < 3) return null;
  const [deg, min, sec] = parts;
  let value = deg + min / 60 + sec / 3600;
  if (ref === 'S' || ref === 'W') value = -value;
  return Math.round(value * 1000000) / 1000000;
}

/**
 * Parse a TIFF/EXIF block. `bytes` must start at the TIFF header ("II"/"MM"),
 * which is where a JPEG APP1 payload begins after "Exif\0\0", and also what a
 * PNG eXIf chunk and a WebP EXIF chunk contain.
 */
export function parseTiff(bytes, tiffBase) {
  const base = tiffBase || 0;
  if (base + 8 > bytes.length) return { tags: [], gps: null, orientation: null };

  const b0 = bytes[base], b1 = bytes[base + 1];
  let littleEndian;
  if (b0 === 0x49 && b1 === 0x49) littleEndian = true;
  else if (b0 === 0x4d && b1 === 0x4d) littleEndian = false;
  else return { tags: [], gps: null, orientation: null };

  const r = makeReader(bytes, base, littleEndian);
  if (r.u16(2) !== 42) return { tags: [], gps: null, orientation: null };

  const tags = [];
  const seen = new Set();
  const ifd0 = readIfd(bytes, base, r.u32(4), littleEndian, IFD0_TAGS, 'Image', tags, seen);
  if (ifd0) {
    if (ifd0.exif) readIfd(bytes, base, ifd0.exif, littleEndian, EXIF_TAGS, 'Camera', tags, seen);
    if (ifd0.gps) readIfd(bytes, base, ifd0.gps, littleEndian, GPS_TAGS, 'Location', tags, seen);
  }

  const find = name => tags.find(t => t.name === name);
  const latTag = find('Latitude'), lonTag = find('Longitude');
  const latRef = find('Latitude Ref'), lonRef = find('Longitude Ref');
  let gps = null;
  if (latTag && lonTag) {
    const lat = gpsCoordinate(latTag.numbers, latRef ? latRef.value : 'N');
    const lon = gpsCoordinate(lonTag.numbers, lonRef ? lonRef.value : 'E');
    if (lat !== null && lon !== null && isFinite(lat) && isFinite(lon)) {
      gps = { latitude: lat, longitude: lon };
    }
  }

  const orientationTag = find('Orientation');
  const orientation = orientationTag ? orientationTag.numbers[0] : null;
  const hasThumbnail = Boolean(ifd0 && ifd0.next);

  return { tags, gps, orientation, hasThumbnail };
}

/* -------------------------------------------------------------------- JPEG  */

const STANDALONE = new Set([0x01, 0xd0, 0xd1, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9]);

function segmentLabel(marker, bytes, payloadStart) {
  const id = readAscii(bytes, 0, payloadStart, 32);
  if (marker === 0xe0) return { name: 'JFIF header', kind: 'keep' };
  if (marker === 0xe1) {
    if (id.startsWith('Exif')) return { name: 'EXIF metadata', kind: 'metadata' };
    if (id.startsWith('http://ns.adobe.com/xap')) return { name: 'XMP metadata', kind: 'metadata' };
    return { name: 'APP1 data', kind: 'metadata' };
  }
  if (marker === 0xe2) {
    if (id.startsWith('ICC_PROFILE')) return { name: 'ICC colour profile', kind: 'icc' };
    return { name: 'APP2 data', kind: 'metadata' };
  }
  if (marker === 0xed) return { name: 'IPTC / Photoshop metadata', kind: 'metadata' };
  if (marker === 0xee) return { name: 'Adobe colour marker', kind: 'keep' };
  if (marker === 0xfe) return { name: 'Comment', kind: 'metadata' };
  if (marker >= 0xe3 && marker <= 0xef) return { name: 'APP' + (marker - 0xe0) + ' data', kind: 'metadata' };
  return { name: null, kind: 'keep' };
}

/** Walk a JPEG's segments up to the first scan. */
function walkJpeg(bytes) {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  const segments = [];
  let i = 2;

  while (i < bytes.length - 1) {
    if (bytes[i] !== 0xff) { i++; continue; }         // resync past padding
    const marker = bytes[i + 1];
    if (marker === 0xff) { i++; continue; }           // fill byte
    if (STANDALONE.has(marker)) { i += 2; continue; }
    if (i + 4 > bytes.length) break;

    const length = (bytes[i + 2] << 8) | bytes[i + 3];
    if (length < 2) break;
    const end = i + 2 + length;
    if (end > bytes.length) break;

    if (marker === 0xda) return { segments, scanStart: i };  // everything after is image data

    const info = segmentLabel(marker, bytes, i + 4);
    segments.push({ marker, start: i, end, bytes: end - i, name: info.name, kind: info.kind });
    i = end;
  }
  return { segments, scanStart: -1 };
}

/* --------------------------------------------------------------------- PNG  */

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const PNG_METADATA_CHUNKS = {
  tEXt: 'Text metadata',
  zTXt: 'Compressed text metadata',
  iTXt: 'International text metadata',
  eXIf: 'EXIF metadata',
  tIME: 'Last-modified time'
};

function walkPng(bytes) {
  for (let i = 0; i < 8; i++) if (bytes[i] !== PNG_SIGNATURE[i]) return null;
  const chunks = [];
  let i = 8;
  while (i + 8 <= bytes.length) {
    const length = ((bytes[i] << 24) | (bytes[i + 1] << 16) | (bytes[i + 2] << 8) | bytes[i + 3]) >>> 0;
    const type = String.fromCharCode(bytes[i + 4], bytes[i + 5], bytes[i + 6], bytes[i + 7]);
    const end = i + 12 + length;
    if (end > bytes.length) break;
    chunks.push({ type, start: i, end, dataStart: i + 8, length, bytes: end - i });
    i = end;
    if (type === 'IEND') break;
  }
  return chunks.length ? chunks : null;
}

/* -------------------------------------------------------------------- WebP  */

function walkWebp(bytes) {
  if (bytes.length < 12) return null;
  const riff = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
  const webp = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
  if (riff !== 'RIFF' || webp !== 'WEBP') return null;

  const chunks = [];
  let i = 12;
  while (i + 8 <= bytes.length) {
    const fourcc = String.fromCharCode(bytes[i], bytes[i + 1], bytes[i + 2], bytes[i + 3]);
    const size = (bytes[i + 4] | (bytes[i + 5] << 8) | (bytes[i + 6] << 16) | (bytes[i + 7] << 24)) >>> 0;
    const padded = size + (size % 2);          // RIFF chunks are padded to even
    const end = i + 8 + padded;
    if (end > bytes.length + 1) break;
    chunks.push({ fourcc, start: i, end: Math.min(end, bytes.length), dataStart: i + 8, size, bytes: padded + 8 });
    i = end;
  }
  return chunks.length ? chunks : null;
}

/* ------------------------------------------------------------------ Reading */

export function readImageMetadata(input) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  const empty = { ok: false, format: null, tags: [], gps: null, orientation: null, items: [], metadataBytes: 0, totalBytes: bytes.length };
  if (!bytes.length) return { ...empty, reason: 'empty' };

  const jpeg = walkJpeg(bytes);
  if (jpeg) {
    const items = [];
    let tags = [], gps = null, orientation = null, hasThumbnail = false;
    let metadataBytes = 0;

    for (const seg of jpeg.segments) {
      if (seg.kind === 'metadata' || seg.kind === 'icc') {
        if (seg.name) items.push({ name: seg.name, bytes: seg.bytes, removable: seg.kind === 'metadata' });
        if (seg.kind === 'metadata') metadataBytes += seg.bytes;
      }
      if (seg.marker === 0xe1) {
        const id = readAscii(bytes, 0, seg.start + 4, 6);
        if (id.startsWith('Exif')) {
          // "Exif\0\0" is 6 bytes; the TIFF header follows it.
          const parsed = parseTiff(bytes, seg.start + 10);
          tags = tags.concat(parsed.tags);
          gps = gps || parsed.gps;
          if (orientation === null) orientation = parsed.orientation;
          hasThumbnail = hasThumbnail || Boolean(parsed.hasThumbnail);
        }
      }
    }
    return {
      ok: true, format: 'jpeg', tags, gps, orientation, hasThumbnail,
      items, metadataBytes, totalBytes: bytes.length
    };
  }

  const png = walkPng(bytes);
  if (png) {
    const items = [];
    let tags = [], gps = null, orientation = null, metadataBytes = 0;
    for (const chunk of png) {
      const label = PNG_METADATA_CHUNKS[chunk.type];
      if (!label) continue;
      items.push({ name: label + ' (' + chunk.type + ')', bytes: chunk.bytes, removable: true });
      metadataBytes += chunk.bytes;
      if (chunk.type === 'eXIf') {
        const parsed = parseTiff(bytes, chunk.dataStart);
        tags = tags.concat(parsed.tags);
        gps = gps || parsed.gps;
        if (orientation === null) orientation = parsed.orientation;
      }
      if (chunk.type === 'tEXt') {
        // tEXt is `keyword\0text`. The separator is a NUL, so the text has to be
        // read past it. A NUL-terminated string read returns the keyword and
        // silently drops the value — which is the half that identifies someone.
        const limit = Math.min(chunk.length, 400);
        let key = '', val = '', seenNul = false;
        for (let i = 0; i < limit; i++) {
          const c = bytes[chunk.dataStart + i];
          if (c === undefined) break;
          if (!seenNul && c === 0) { seenNul = true; continue; }
          if (seenNul) val += String.fromCharCode(c);
          else key += String.fromCharCode(c);
        }
        tags.push({
          ifd: 'Text', tag: 0, name: key.trim() || 'Text',
          value: val.trim(), numbers: [], sensitive: true
        });
      }
    }
    return { ok: true, format: 'png', tags, gps, orientation, hasThumbnail: false, items, metadataBytes, totalBytes: bytes.length };
  }

  const webp = walkWebp(bytes);
  if (webp) {
    const items = [];
    let tags = [], gps = null, orientation = null, metadataBytes = 0;
    for (const chunk of webp) {
      if (chunk.fourcc !== 'EXIF' && chunk.fourcc !== 'XMP ') continue;
      items.push({ name: (chunk.fourcc === 'EXIF' ? 'EXIF metadata' : 'XMP metadata') + ' (WebP chunk)', bytes: chunk.bytes, removable: true });
      metadataBytes += chunk.bytes;
      if (chunk.fourcc === 'EXIF') {
        // Some encoders prefix the payload with "Exif\0\0"; tolerate both.
        let off = chunk.dataStart;
        if (readAscii(bytes, 0, off, 4) === 'Exif') off += 6;
        const parsed = parseTiff(bytes, off);
        tags = tags.concat(parsed.tags);
        gps = gps || parsed.gps;
        if (orientation === null) orientation = parsed.orientation;
      }
    }
    return { ok: true, format: 'webp', tags, gps, orientation, hasThumbnail: false, items, metadataBytes, totalBytes: bytes.length };
  }

  return { ...empty, reason: 'unsupported' };
}

/* ------------------------------------------------------------------ Removal */

/** Minimal EXIF APP1 carrying nothing but the Orientation tag. */
function buildOrientationApp1(orientation) {
  const tiff = [
    0x49, 0x49, 0x2a, 0x00,           // "II", 42 — little-endian TIFF
    0x08, 0x00, 0x00, 0x00,           // IFD0 begins at offset 8
    0x01, 0x00,                       // one entry
    0x12, 0x01,                       // tag 0x0112 Orientation
    0x03, 0x00,                       // type SHORT
    0x01, 0x00, 0x00, 0x00,           // count 1
    orientation & 0xff, 0x00, 0x00, 0x00, // value, inline, padded to 4 bytes
    0x00, 0x00, 0x00, 0x00            // no next IFD
  ];
  const payload = [0x45, 0x78, 0x69, 0x66, 0x00, 0x00].concat(tiff); // "Exif\0\0"
  const length = payload.length + 2;
  return new Uint8Array([0xff, 0xe1, (length >> 8) & 0xff, length & 0xff].concat(payload));
}

/** True when an APP1 EXIF segment contains no tag other than Orientation. */
function isOrientationOnlyExif(bytes, seg) {
  if (seg.marker !== 0xe1) return false;
  if (!readAscii(bytes, 0, seg.start + 4, 6).startsWith('Exif')) return false;
  const parsed = parseTiff(bytes, seg.start + 10);
  return parsed.tags.every(t => t.name === 'Orientation');
}

function concat(parts, totalLength) {
  const out = new Uint8Array(totalLength);
  let at = 0;
  for (const part of parts) { out.set(part, at); at += part.length; }
  return out;
}

/**
 * Remove metadata, keeping the compressed image data byte-identical.
 *
 * options.keepOrientation (default true) rebuilds a minimal EXIF block holding
 * only the rotation flag, so the photo does not display sideways afterwards.
 * options.keepColourProfile (default true) preserves the ICC profile, which is
 * colour information rather than anything identifying — dropping it can visibly
 * shift a wide-gamut photo's colours.
 */
export function stripMetadata(input, options) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  const opts = options || {};
  const keepOrientation = opts.keepOrientation !== false;
  const keepColourProfile = opts.keepColourProfile !== false;

  const removed = [];
  const parts = [];
  let total = 0;
  const push = part => { parts.push(part); total += part.length; };

  const jpeg = walkJpeg(bytes);
  if (jpeg) {
    const meta = readImageMetadata(bytes);
    push(bytes.subarray(0, 2)); // SOI

    if (keepOrientation && meta.orientation && meta.orientation !== 1) {
      push(buildOrientationApp1(meta.orientation));
    }

    for (const seg of jpeg.segments) {
      const drop = seg.kind === 'metadata' || (seg.kind === 'icc' && !keepColourProfile);
      if (drop) {
        // An EXIF block holding nothing but Orientation carries no private
        // information, and when orientation is being preserved an identical
        // block is written back. Reporting that as "removed metadata" would
        // tell someone their already-clean photo had something to clean —
        // which is how a tool teaches people to distrust it.
        if (keepOrientation && isOrientationOnlyExif(bytes, seg)) continue;
        removed.push({ name: seg.name || 'Metadata segment', bytes: seg.bytes });
      } else {
        push(bytes.subarray(seg.start, seg.end));
      }
    }

    // From the first scan marker to end-of-file, copied verbatim. This is the
    // guarantee that the image data is untouched.
    if (jpeg.scanStart >= 0) push(bytes.subarray(jpeg.scanStart));
    else if (!jpeg.segments.length) push(bytes.subarray(2));

    return finish(parts, total, removed, bytes, keepOrientation && meta.orientation > 1, 'jpeg');
  }

  const png = walkPng(bytes);
  if (png) {
    push(bytes.subarray(0, 8));
    for (const chunk of png) {
      if (PNG_METADATA_CHUNKS[chunk.type]) {
        removed.push({ name: PNG_METADATA_CHUNKS[chunk.type] + ' (' + chunk.type + ')', bytes: chunk.bytes });
        continue;
      }
      push(bytes.subarray(chunk.start, chunk.end));
    }
    return finish(parts, total, removed, bytes, false, 'png');
  }

  const webp = walkWebp(bytes);
  if (webp) {
    const kept = [];
    for (const chunk of webp) {
      if (chunk.fourcc === 'EXIF' || chunk.fourcc === 'XMP ') {
        removed.push({ name: (chunk.fourcc === 'EXIF' ? 'EXIF metadata' : 'XMP metadata') + ' (WebP chunk)', bytes: chunk.bytes });
        continue;
      }
      kept.push(chunk);
    }

    let payloadLength = 4; // the "WEBP" fourcc
    for (const chunk of kept) payloadLength += Math.min(chunk.end, bytes.length) - chunk.start;

    const header = new Uint8Array(12);
    header.set(bytes.subarray(0, 12));
    // The RIFF size field counts everything after itself and must be corrected.
    header[4] = payloadLength & 0xff;
    header[5] = (payloadLength >> 8) & 0xff;
    header[6] = (payloadLength >> 16) & 0xff;
    header[7] = (payloadLength >> 24) & 0xff;
    push(header);

    for (const chunk of kept) {
      const slice = bytes.slice(chunk.start, Math.min(chunk.end, bytes.length));
      // VP8X advertises which optional chunks exist; leaving the EXIF/XMP flags
      // set after removing those chunks produces a file decoders may reject.
      if (chunk.fourcc === 'VP8X' && slice.length > 8) {
        slice[8] = slice[8] & ~0x08 & ~0x04;
      }
      push(slice);
    }
    return finish(parts, total, removed, bytes, false, 'webp');
  }

  return { ok: false, reason: 'unsupported', output: null, removed: [], removedBytes: 0 };
}

function finish(parts, total, removed, original, keptOrientation, format) {
  const output = concat(parts, total);
  return {
    ok: true,
    format,
    output,
    removed,
    removedBytes: original.length - output.length,
    originalBytes: original.length,
    outputBytes: output.length,
    keptOrientation
  };
}

/** Convenience for the UI: a flat, human-readable summary. */
export function summarizeMetadata(meta) {
  const sensitive = meta.tags.filter(t => t.sensitive);
  return {
    format: meta.format,
    tagCount: meta.tags.length,
    sensitiveCount: sensitive.length,
    hasGps: Boolean(meta.gps),
    hasThumbnail: Boolean(meta.hasThumbnail),
    metadataBytes: meta.metadataBytes,
    percentOfFile: meta.totalBytes ? Math.round((meta.metadataBytes / meta.totalBytes) * 1000) / 10 : 0
  };
}
