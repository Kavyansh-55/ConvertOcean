/**
 * Minimal TrueType cmap reader — answers "does this font actually have a glyph
 * for this character?".
 *
 * Needed because the whole Unicode-in-PDF fix rests on an assumption worth
 * checking rather than believing: that a script-specific Noto font (Devanagari,
 * say) also carries basic Latin, so one font can set a line that mixes the two.
 * If that were false, every mixed line would need font switching mid-string.
 *
 * Only the formats Noto actually ships are handled: cmap subtable format 4
 * (BMP) and format 12 (full range).
 */

/** @param {Buffer|Uint8Array} buf @returns {Set<number>|null} covered code points, sampled */
export function readCmapCoverage(buf, probes) {
  const b = Buffer.from(buf);
  const numTables = b.readUInt16BE(4);
  let cmapOff = 0;

  for (let i = 0; i < numTables; i++) {
    const rec = 12 + i * 16;
    if (b.subarray(rec, rec + 4).toString('latin1') === 'cmap') {
      cmapOff = b.readUInt32BE(rec + 8);
      break;
    }
  }
  if (!cmapOff) return null;

  // Prefer a Unicode subtable: (3,10) full repertoire, then (3,1) BMP, then (0,x).
  const n = b.readUInt16BE(cmapOff + 2);
  let best = 0;
  let bestScore = -1;
  for (let i = 0; i < n; i++) {
    const rec = cmapOff + 4 + i * 8;
    const platform = b.readUInt16BE(rec);
    const encoding = b.readUInt16BE(rec + 2);
    const offset = b.readUInt32BE(rec + 4);
    let score = -1;
    if (platform === 3 && encoding === 10) score = 3;
    else if (platform === 3 && encoding === 1) score = 2;
    else if (platform === 0) score = 1;
    if (score > bestScore) { bestScore = score; best = cmapOff + offset; }
  }
  if (!best) return null;

  const format = b.readUInt16BE(best);
  const has = new Set();

  if (format === 4) {
    const segX2 = b.readUInt16BE(best + 6);
    const segs = segX2 / 2;
    const endsAt = best + 14;
    const startsAt = endsAt + segX2 + 2;
    const deltasAt = startsAt + segX2;
    const rangesAt = deltasAt + segX2;

    for (const cp of probes) {
      if (cp > 0xffff) continue;
      for (let s = 0; s < segs; s++) {
        const end = b.readUInt16BE(endsAt + s * 2);
        if (cp > end) continue;
        const start = b.readUInt16BE(startsAt + s * 2);
        if (cp < start) break;
        const delta = b.readInt16BE(deltasAt + s * 2);
        const rangeOff = b.readUInt16BE(rangesAt + s * 2);
        let gid;
        if (rangeOff === 0) gid = (cp + delta) & 0xffff;
        else {
          const gi = rangesAt + s * 2 + rangeOff + (cp - start) * 2;
          if (gi + 1 >= b.length) break;
          gid = b.readUInt16BE(gi);
          if (gid !== 0) gid = (gid + delta) & 0xffff;
        }
        if (gid !== 0) has.add(cp);
        break;
      }
    }
    return has;
  }

  if (format === 12) {
    const groups = b.readUInt32BE(best + 12);
    for (const cp of probes) {
      for (let g = 0; g < groups; g++) {
        const off = best + 16 + g * 12;
        const start = b.readUInt32BE(off);
        const end = b.readUInt32BE(off + 4);
        if (cp < start) break;
        if (cp <= end) { has.add(cp); break; }
      }
    }
    return has;
  }

  return null;
}

/** Convenience: does the font cover every character in `text`? */
export function covers(buf, text) {
  const probes = [...new Set([...text].map((c) => c.codePointAt(0)))].sort((a, b) => a - b);
  const has = readCmapCoverage(buf, probes);
  if (!has) return { ok: false, missing: probes, reason: 'no readable cmap' };
  const missing = probes.filter((cp) => !has.has(cp));
  return { ok: missing.length === 0, missing };
}
