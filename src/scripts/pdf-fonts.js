/**
 * Unicode text for jsPDF.
 *
 * jsPDF's built-in fonts are the PDF standard 14, which are WinAnsi-encoded.
 * Hand them anything outside that repertoire and the result is not merely
 * unstyled — it is wrong. "नमस्ते" came out as "( . 8 M $ G", and the ASCII
 * sharing that string was emitted as UTF-16 with interleaved NULs, so the
 * Latin half broke too. For a site with substantial Indian traffic that is not
 * an edge case.
 *
 * The fix is to embed a real Unicode TrueType font. Two constraints shape how:
 *
 *  1. Weight. A Unicode font is hundreds of kilobytes, so nothing is fetched
 *     until a document actually contains a character that needs it. A plain
 *     ASCII file downloads nothing at all and keeps using Helvetica.
 *
 *  2. No font covers everything. NotoSansDevanagari, measured rather than
 *     assumed, contains no Latin glyphs — so a line reading "Invoice नमस्ते"
 *     cannot be set with one font. Text is therefore split into runs by script
 *     and each run drawn with a font that actually has its glyphs.
 *
 * CJK is deliberately not supported: the fonts are 5-15MB, which is not a
 * reasonable download. Those characters are reported through `unsupported` so
 * the tool can say so plainly instead of writing silent corruption.
 *
 * Fetching a font file does not weaken the privacy promise — the user's own
 * document never leaves the browser.
 */

const CDN = 'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/';

/**
 * Fonts we are willing to embed. `covers` is the test for whether a character
 * belongs to this font, checked in order, with `latin` last as the catch-all
 * for everything in its broad repertoire.
 */
const FONTS = {
  devanagari: {
    id: 'NotoSansDevanagari',
    file: 'NotoSansDevanagari-Regular.ttf',
    url: CDN + 'NotoSansDevanagari/NotoSansDevanagari-Regular.ttf',
    label: 'Devanagari',
    test: (cp) => (cp >= 0x0900 && cp <= 0x097f) || (cp >= 0xa8e0 && cp <= 0xa8ff),
  },
  latin: {
    id: 'NotoSans',
    file: 'NotoSans-Regular.ttf',
    url: CDN + 'NotoSans/NotoSans-Regular.ttf',
    label: 'Latin / Cyrillic / Greek',
    // Latin, Latin-Ext, IPA, Greek, Cyrillic, punctuation, currency, symbols.
    test: (cp) =>
      (cp >= 0x0020 && cp <= 0x058f) ||
      (cp >= 0x1e00 && cp <= 0x20cf) ||
      (cp >= 0x2100 && cp <= 0x21ff) ||
      (cp >= 0x2200 && cp <= 0x22ff),
  },
};

/** Scripts we knowingly cannot render, for an honest warning. */
const UNSUPPORTED = [
  { label: 'Chinese, Japanese or Korean', test: (cp) =>
      (cp >= 0x3000 && cp <= 0x30ff) || (cp >= 0x3400 && cp <= 0x4dbf) ||
      (cp >= 0x4e00 && cp <= 0x9fff) || (cp >= 0xac00 && cp <= 0xd7af) ||
      (cp >= 0xf900 && cp <= 0xfaff) },
  { label: 'Arabic', test: (cp) => (cp >= 0x0600 && cp <= 0x06ff) || (cp >= 0x0750 && cp <= 0x077f) },
  { label: 'Hebrew', test: (cp) => cp >= 0x0590 && cp <= 0x05ff },
  { label: 'Thai', test: (cp) => cp >= 0x0e00 && cp <= 0x0e7f },
  { label: 'Bengali', test: (cp) => cp >= 0x0980 && cp <= 0x09ff },
  { label: 'Tamil', test: (cp) => cp >= 0x0b80 && cp <= 0x0bff },
  { label: 'Telugu', test: (cp) => cp >= 0x0c00 && cp <= 0x0c7f },
  { label: 'emoji', test: (cp) => cp >= 0x1f300 && cp <= 0x1faff },
];

/** Anything the PDF standard fonts already handle needs no download. */
export function isWinAnsi(cp) {
  return cp <= 0xff && !(cp >= 0x80 && cp <= 0x9f);
}

/**
 * Which embedded font should set this character, or null when none can.
 * @param {number} cp
 * @returns {'latin'|'devanagari'|null}
 */
export function fontKeyFor(cp) {
  for (const key of ['devanagari', 'latin']) {
    if (FONTS[key].test(cp)) return key;
  }
  return null;
}

/**
 * Inspect text and report what it needs.
 *
 * @param {string} text
 * @returns {{ascii:boolean, needed:string[], unsupported:string[]}}
 */
export function analyseText(text) {
  const needed = new Set();
  const unsupported = new Set();
  let ascii = true;

  for (const ch of String(text)) {
    const cp = ch.codePointAt(0);
    if (!isWinAnsi(cp)) ascii = false;

    const key = fontKeyFor(cp);
    if (key) {
      // Only a character the standard fonts cannot set forces a download.
      if (!isWinAnsi(cp)) needed.add(key);
      continue;
    }
    if (isWinAnsi(cp)) continue;

    const bad = UNSUPPORTED.find((u) => u.test(cp));
    unsupported.add(bad ? bad.label : 'an unsupported script');
  }

  return { ascii, needed: [...needed], unsupported: [...unsupported] };
}

/**
 * Split text into consecutive runs that can each be drawn with one font.
 * `font` is a key of FONTS, or null for "the standard font is fine", or
 * 'unsupported' for characters no available font can set.
 *
 * @param {string} text
 * @returns {Array<{text:string, font:string|null}>}
 */
export function splitRuns(text) {
  const runs = [];
  let cur = null;

  for (const ch of String(text)) {
    const cp = ch.codePointAt(0);
    let font;
    if (isWinAnsi(cp)) font = 'ascii';
    else font = fontKeyFor(cp) || 'unsupported';

    /* Whitespace joins whichever run is open. Every font has a space, and
       breaking on one would turn an ordinary Hindi sentence into a dozen runs.
       Everything else starts a new run unless it matches exactly — an earlier
       version let ASCII be absorbed into a following script run, which merged
       "Invoice नमस्ते" into one Devanagari run and would have drawn the English
       half as tofu, since that font has no Latin glyphs. */
    if (cur && (cur.font === font || (/\s/.test(ch) && cur.font !== 'unsupported'))) {
      cur.text += ch;
      continue;
    }

    cur = { text: ch, font };
    runs.push(cur);
  }

  return runs.map((r) => ({ text: r.text, font: r.font === 'ascii' ? null : r.font }));
}

/* ------------------------------------------------------------- loading */

const cache = new Map();   // key -> base64 string
const inflight = new Map();

function toBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let bin = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
  }
  return btoa(bin);
}

/**
 * Fetch and cache one font as base64. Concurrent callers share one request.
 * @param {string} key
 * @returns {Promise<string>}
 */
export function loadFont(key) {
  if (cache.has(key)) return Promise.resolve(cache.get(key));
  if (inflight.has(key)) return inflight.get(key);

  const font = FONTS[key];
  if (!font) return Promise.reject(new Error('unknown font ' + key));

  const p = fetch(font.url)
    .then((r) => {
      if (!r.ok) throw new Error('font fetch failed: ' + r.status);
      return r.arrayBuffer();
    })
    .then((buf) => {
      const b64 = toBase64(buf);
      cache.set(key, b64);
      inflight.delete(key);
      return b64;
    })
    .catch((e) => { inflight.delete(key); throw e; });

  inflight.set(key, p);
  return p;
}

/**
 * Register into a jsPDF document every font the given text needs.
 *
 * Failure to fetch is not fatal: the conversion continues with the standard
 * font and the caller is told, which is better than refusing to produce a file
 * because a CDN was unreachable.
 *
 * @param {object} doc a jsPDF instance
 * @param {string} text all the text that will be drawn
 * @param {(msg:string)=>void} [onProgress]
 * @returns {Promise<{ready:string[], unsupported:string[], failed:string[]}>}
 */
export async function prepareFonts(doc, text, onProgress) {
  const { needed, unsupported } = analyseText(text);
  const ready = [];
  const failed = [];

  for (const key of needed) {
    const font = FONTS[key];
    try {
      if (onProgress) onProgress(`Loading ${font.label} font…`);
      const b64 = await loadFont(key);
      doc.addFileToVFS(font.file, b64);
      doc.addFont(font.file, font.id, 'normal');
      ready.push(key);
    } catch {
      failed.push(font.label);
    }
  }

  return { ready, unsupported, failed };
}

/** The jsPDF font name for a run, or null to keep the current standard font. */
export function jsPdfNameFor(key) {
  return key && FONTS[key] ? FONTS[key].id : null;
}

/**
 * Which jsPDF font should draw a run.
 *
 * When the Latin Noto font is loaded it also sets the plain-ASCII runs, so a
 * line reading "Invoice नमस्ते" is not half Helvetica and half Noto — mixing
 * two typefaces inside one sentence looks like a rendering fault even when
 * every glyph is correct.
 */
function fontForRun(runFont, ready, standard, keepStandardForAscii) {
  if (runFont && ready.has(runFont)) return jsPdfNameFor(runFont);
  // txt-to-pdf renders in a monospace face on purpose — indentation and
  // aligned columns in a text file only survive if the Latin runs stay
  // monospace, so it opts out of the promotion below.
  if (!keepStandardForAscii && ready.has('latin')) return FONTS.latin.id;
  return standard;
}

/**
 * Draw a possibly mixed-script string, switching fonts per run.
 *
 * @param {object} doc jsPDF instance
 * @param {string} text
 * @param {number} x
 * @param {number} y
 * @param {{standardFont?:string, ready?:string[]}} [opts]
 * @returns {number} the x position after the drawn text
 */
export function drawText(doc, text, x, y, opts = {}) {
  const standard = opts.standardFont || 'helvetica';
  const ready = new Set(opts.ready || []);
  let cursor = x;

  for (const run of splitRuns(text)) {
    doc.setFont(fontForRun(run.font, ready, standard, opts.keepStandardForAscii), 'normal');
    doc.text(run.text, cursor, y);
    cursor += doc.getTextWidth(run.text);
  }

  doc.setFont(standard, 'normal');
  return cursor;
}

/**
 * Wrap text to a width, measuring each run with the font that will draw it.
 * jsPDF's own splitTextToSize measures everything in the current font, which
 * mis-measures a mixed-script line badly.
 *
 * @returns {string[]} lines
 */
export function wrapText(doc, text, maxWidth, opts = {}) {
  const standard = opts.standardFont || 'helvetica';
  const ready = new Set(opts.ready || []);

  const widthOf = (s) => {
    let w = 0;
    for (const run of splitRuns(s)) {
      doc.setFont(fontForRun(run.font, ready, standard, opts.keepStandardForAscii), 'normal');
      w += doc.getTextWidth(run.text);
    }
    return w;
  };

  const lines = [];
  for (const paragraph of String(text).split('\n')) {
    if (!paragraph) { lines.push(''); continue; }
    let line = '';
    for (const word of paragraph.split(/(\s+)/)) {
      const candidate = line + word;
      if (line && widthOf(candidate) > maxWidth) {
        lines.push(line.replace(/\s+$/, ''));
        line = word.replace(/^\s+/, '');
      } else {
        line = candidate;
      }
    }
    // A single token longer than the line must still be broken somewhere.
    while (widthOf(line) > maxWidth && line.length > 1) {
      let cut = line.length;
      while (cut > 1 && widthOf(line.slice(0, cut)) > maxWidth) cut--;
      lines.push(line.slice(0, cut));
      line = line.slice(cut);
    }
    lines.push(line);
  }

  doc.setFont(standard, 'normal');
  return lines;
}

export { FONTS };
