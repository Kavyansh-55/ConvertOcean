/**
 * A minimal EXIF (APP1) writer, enough to give a JPEG fixture real metadata.
 *
 * Needed for two reasons. exif-viewer and exif-remover cannot be tested at all
 * without a file that actually carries metadata. And every image conversion has
 * a quieter question hanging over it: a canvas re-encode silently drops EXIF,
 * so a photo that displayed the right way up because of its Orientation tag
 * comes out of a converter rotated. Orientation=6 here makes that visible.
 *
 * Structure written: APP1 → "Exif\0\0" → little-endian TIFF header → IFD0,
 * with an Exif sub-IFD and a GPS sub-IFD, followed by a shared data area for
 * every value too big to sit inline in its 4-byte slot.
 */

const TYPE = { ASCII: 2, SHORT: 3, LONG: 4, RATIONAL: 5 };
const TYPE_SIZE = { 2: 1, 3: 2, 4: 4, 5: 8 };

/** Values the fixture asserts on. Exported so recipes read the same constants. */
export const EXIF_EXPECTED = {
  description: 'ConvertOcean fidelity fixture',
  make: 'ConvertOcean',
  model: 'Torture Cam M01',
  orientation: 6,               // rotate 90 CW — visible if honoured, visible if not
  dateTime: '2025:01:01 12:00:00',
  dateTimeOriginal: '2025:01:01 12:00:00',
  isoSpeed: 400,
  // 51° 30' 26.4" N, 0° 7' 39.6" W  (London)
  gpsLatitude: [[51, 1], [30, 1], [264, 10]],
  gpsLongitude: [[0, 1], [7, 1], [396, 10]],
  gpsLatitudeRef: 'N',
  gpsLongitudeRef: 'W',
};

/** One IFD entry, pre-typed. `value` is an array for count>1. */
function entry(tag, type, value) {
  return { tag, type, value: Array.isArray(value) ? value : [value] };
}

/** Serialised byte length of an entry's payload. */
function payloadSize(e) {
  if (e.type === TYPE.ASCII) return e.value[0].length + 1; // NUL terminated
  return e.value.length * TYPE_SIZE[e.type];
}

/** Element count as EXIF records it (ASCII counts bytes, including the NUL). */
function count(e) {
  return e.type === TYPE.ASCII ? e.value[0].length + 1 : e.value.length;
}

function writePayload(buf, off, e) {
  if (e.type === TYPE.ASCII) {
    buf.write(e.value[0], off, 'latin1');
    buf[off + e.value[0].length] = 0;
    return;
  }
  let p = off;
  for (const v of e.value) {
    if (e.type === TYPE.SHORT) { buf.writeUInt16LE(v, p); p += 2; }
    else if (e.type === TYPE.LONG) { buf.writeUInt32LE(v, p); p += 4; }
    else if (e.type === TYPE.RATIONAL) {
      /* A rational is a numerator/denominator pair, so accept one explicitly
         as [num, den]. Deriving it from a float instead loses small values:
         an exposure of 1/125 forced through a denominator of 10 rounds to
         0/10, and the fixture then asserts "exposure = 0" — a fixture bug
         that would mask whatever the tool actually did. */
      let num, den;
      if (Array.isArray(v)) { [num, den] = v; }
      else if (Number.isInteger(v)) { num = v; den = 1; }
      else { den = 10; num = Math.round(v * den); }
      buf.writeUInt32LE(num, p);
      buf.writeUInt32LE(den, p + 4);
      p += 8;
    }
  }
}

/**
 * Build the TIFF block (everything after "Exif\0\0").
 * Layout: header(8) | IFD0 | ExifIFD | GpsIFD | data area
 */
function buildTiff() {
  const E = EXIF_EXPECTED;

  const exifEntries = [
    entry(0x9003, TYPE.ASCII, E.dateTimeOriginal),   // DateTimeOriginal
    entry(0x829a, TYPE.RATIONAL, [[1, 125]]),        // ExposureTime = 1/125
    entry(0x829d, TYPE.RATIONAL, [[28, 10]]),        // FNumber = f/2.8
    entry(0x8827, TYPE.SHORT, E.isoSpeed),           // ISOSpeedRatings
    entry(0x920a, TYPE.RATIONAL, [[50, 1]]),         // FocalLength = 50mm
  ];

  const gpsEntries = [
    entry(0x0001, TYPE.ASCII, E.gpsLatitudeRef),
    entry(0x0002, TYPE.RATIONAL, E.gpsLatitude),
    entry(0x0003, TYPE.ASCII, E.gpsLongitudeRef),
    entry(0x0004, TYPE.RATIONAL, E.gpsLongitude),
  ];

  // IFD0 carries two pointer entries whose values are filled in once the
  // sub-IFD offsets are known.
  const ifd0Entries = [
    entry(0x010e, TYPE.ASCII, E.description),
    entry(0x010f, TYPE.ASCII, E.make),
    entry(0x0110, TYPE.ASCII, E.model),
    entry(0x0112, TYPE.SHORT, E.orientation),
    entry(0x0132, TYPE.ASCII, E.dateTime),
    entry(0x8769, TYPE.LONG, 0),                     // ExifIFDPointer  (patched)
    entry(0x8825, TYPE.LONG, 0),                     // GPSInfoIFDPointer (patched)
  ];

  const ifdSize = (n) => 2 + 12 * n + 4;
  const ifd0Off = 8;
  const exifOff = ifd0Off + ifdSize(ifd0Entries.length);
  const gpsOff = exifOff + ifdSize(exifEntries.length);
  const dataOff = gpsOff + ifdSize(gpsEntries.length);

  ifd0Entries[5].value = [exifOff];
  ifd0Entries[6].value = [gpsOff];

  const dataBytes = [ifd0Entries, exifEntries, gpsEntries]
    .flat()
    .reduce((n, e) => n + (payloadSize(e) > 4 ? payloadSize(e) : 0), 0);

  const buf = Buffer.alloc(dataOff + dataBytes);
  buf.write('II', 0, 'latin1');
  buf.writeUInt16LE(0x002a, 2);
  buf.writeUInt32LE(ifd0Off, 4);

  let dataCursor = dataOff;

  function writeIfd(off, entries, nextIfd = 0) {
    buf.writeUInt16LE(entries.length, off);
    let p = off + 2;
    for (const e of entries) {
      buf.writeUInt16LE(e.tag, p);
      buf.writeUInt16LE(e.type, p + 2);
      buf.writeUInt32LE(count(e), p + 4);
      const size = payloadSize(e);
      if (size > 4) {
        buf.writeUInt32LE(dataCursor, p + 8);
        writePayload(buf, dataCursor, e);
        dataCursor += size;
      } else {
        writePayload(buf, p + 8, e);
      }
      p += 12;
    }
    buf.writeUInt32LE(nextIfd, p);
  }

  writeIfd(ifd0Off, ifd0Entries);
  writeIfd(exifOff, exifEntries);
  writeIfd(gpsOff, gpsEntries);
  return buf;
}

/**
 * Insert an APP1/EXIF segment into a JPEG, immediately after SOI.
 * Any APP1 already present is replaced.
 *
 * @param {Buffer} jpeg
 * @returns {Buffer}
 */
export function withExif(jpeg) {
  if (jpeg[0] !== 0xff || jpeg[1] !== 0xd8) throw new Error('not a JPEG (no SOI)');

  const tiff = buildTiff();
  const payload = Buffer.concat([Buffer.from('Exif\0\0', 'latin1'), tiff]);
  const len = payload.length + 2; // the length field counts itself
  if (len > 0xffff) throw new Error('EXIF segment too large');
  const header = Buffer.alloc(4);
  header.writeUInt16BE(0xffe1, 0);
  header.writeUInt16BE(len, 2);

  // Skip an existing APP1 so we never write two.
  let rest = jpeg.subarray(2);
  if (rest[0] === 0xff && rest[1] === 0xe1) {
    rest = rest.subarray(2 + rest.readUInt16BE(2));
  }

  return Buffer.concat([jpeg.subarray(0, 2), header, payload, rest]);
}

/**
 * Does this JPEG carry an APP1/EXIF segment? Used to assert that
 * exif-remover actually removed it, rather than merely claiming to.
 */
export function hasExif(buf) {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return false;
  let p = 2;
  while (p < buf.length - 4) {
    if (buf[p] !== 0xff) break;
    const marker = buf.readUInt16BE(p);
    if (marker === 0xffda) break; // start of scan — headers are done
    const segLen = buf.readUInt16BE(p + 2);
    if (marker === 0xffe1 && buf.subarray(p + 4, p + 8).toString('latin1') === 'Exif') return true;
    p += 2 + segLen;
  }
  return false;
}
