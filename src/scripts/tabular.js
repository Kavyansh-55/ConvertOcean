/**
 * Tabular conversion core: CSV / JSON / XML → rows.
 *
 * The spreadsheet tools used to hand their input straight to SheetJS and hope.
 * That lost data silently and in ways nobody notices until much later:
 *
 *   - the CSV bytes were decoded with the default codepage, so every non-ASCII
 *     character came out as mojibake ("Ünïcodé" → "ÃnÃ¯codÃ©")
 *   - `0044123456` was parsed as a number and shipped as `44123456`, taking
 *     phone numbers, account numbers, postcodes and SKUs with it
 *   - a quoted field containing a newline ended the row early and dropped the
 *     rest of it
 *   - `2025-01-01` became a local-midnight Date, so the serial carried the
 *     browser's UTC offset and every date drifted
 *   - a JSON object or an XML document that was not already a flat array
 *     produced one row of empty cells, because the nested values stringified
 *     to nothing
 *
 * Everything here is pure data-in / data-out so it can be tested in Node as
 * well as run in the browser. The DOM wiring stays in SpreadsheetTool.astro.
 */

/* ------------------------------------------------------------------- CSV */

/**
 * RFC 4180 CSV parser.
 *
 * Written out rather than delegated because the delegation is what broke:
 * quoted fields may contain the delimiter, doubled quotes, and raw newlines,
 * and a row ends only at a newline that is *outside* quotes.
 *
 * @param {string} text
 * @param {string} [delimiter] defaults to auto-detection
 * @returns {string[][]} rows of raw (unconverted) field strings
 */
export function parseCsv(text, delimiter) {
  // Strip a UTF-8 BOM: Excel writes one, and left in place it becomes part of
  // the first header name.
  let s = String(text).replace(/^﻿/, '');
  const delim = delimiter || sniffDelimiter(s);

  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let i = 0;

  while (i < s.length) {
    const ch = s[i];

    if (inQuotes) {
      if (ch === '"') {
        if (s[i + 1] === '"') { field += '"'; i += 2; continue; } // escaped quote
        inQuotes = false; i++; continue;
      }
      field += ch; i++; continue;
    }

    if (ch === '"' && field === '') { inQuotes = true; i++; continue; }
    if (ch === delim) { row.push(field); field = ''; i++; continue; }
    if (ch === '\r') { i++; continue; }              // CRLF and lone CR
    if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; i++; continue; }

    field += ch; i++;
  }

  // Whatever is buffered at EOF is a final field, unless the file ended on a
  // newline and there is nothing pending.
  if (field !== '' || row.length) { row.push(field); rows.push(row); }

  return rows.filter((r) => r.length > 1 || (r[0] != null && r[0] !== ''));
}

/**
 * Guess the delimiter from the first non-empty line outside quotes.
 * Comma, semicolon (common in European exports) and tab are considered.
 */
export function sniffDelimiter(text) {
  const sample = String(text).slice(0, 8192);
  const counts = { ',': 0, ';': 0, '\t': 0, '|': 0 };
  let inQuotes = false;
  for (let i = 0; i < sample.length; i++) {
    const ch = sample[i];
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (inQuotes) continue;
    if (ch === '\n') break;                 // first line is enough
    if (ch in counts) counts[ch]++;
  }
  let best = ',';
  for (const k of Object.keys(counts)) if (counts[k] > counts[best]) best = k;
  return best;
}

/* -------------------------------------------------------------- typing */

/** Excel's epoch is 1899-12-30 (its leap-year bug included). */
const EXCEL_EPOCH_UTC = Date.UTC(1899, 11, 30);

/**
 * Convert a `YYYY-MM-DD` string to an Excel date serial, computed in UTC.
 *
 * Going through `new Date('2025-01-01')` and letting a spreadsheet library
 * derive the serial produced 45658.229… — the fractional part being the
 * browser's own UTC offset. A date with no time in it must not acquire one.
 */
export function isoDateToSerial(y, m, d) {
  return Math.round((Date.UTC(y, m - 1, d) - EXCEL_EPOCH_UTC) / 86400000);
}

/**
 * Decide what a raw CSV field actually is.
 *
 * The rule that matters: a run of digits is only a number when reading it as
 * one loses nothing. A leading zero is information (`0044123456` is a phone
 * number, not 44,123,456), and more than 15 significant digits cannot survive
 * a double, so both stay text.
 *
 * @param {string} raw
 * @returns {{t:'s'|'n'|'d'|'b', v:string|number|boolean}}
 */
export function coerceValue(raw) {
  const s = String(raw);
  const trimmed = s.trim();

  if (trimmed === '') return { t: 's', v: '' };

  // Dates, date-only and unambiguous. Anything else stays text rather than
  // being guessed at.
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (iso) {
    const y = +iso[1], m = +iso[2], d = +iso[3];
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      return { t: 'd', v: isoDateToSerial(y, m, d) };
    }
  }

  if (/^(true|false)$/i.test(trimmed)) {
    return { t: 'b', v: /^true$/i.test(trimmed) };
  }

  // Plain decimal number, optionally signed. No thousands separators here —
  // "1,440" is ambiguous across locales, so it is left as text.
  if (/^[+-]?(\d+\.?\d*|\.\d+)$/.test(trimmed)) {
    const digits = trimmed.replace(/^[+-]/, '');
    const hasLeadingZero = /^0\d/.test(digits);           // 0044…, 007
    const significant = digits.replace(/[.]/g, '').replace(/^0+/, '').length;
    if (!hasLeadingZero && significant <= 15) {
      const n = Number(trimmed);
      if (Number.isFinite(n)) return { t: 'n', v: n };
    }
    return { t: 's', v: s };
  }

  return { t: 's', v: s };
}

/* --------------------------------------------- numbers recovered from text */

/** Currency symbols worth recognising on a business document. */
const CURRENCY = '$€£¥₹₽₩₪₺R$CHFkr';

/**
 * Recover the number hiding inside a formatted string.
 *
 * This is a different question from `coerceValue`, and deliberately a looser
 * rule. In a CSV, "1,440" is ambiguous across locales and is safest left as
 * text. In a table lifted off a PDF page, the thousands separator and the
 * currency symbol *are* the formatting — the whole point of converting to a
 * spreadsheet is to get a number back that SUM() can add. pdf-to-excel used to
 * write every cell as a string, so the output looked right and totalled
 * nothing.
 *
 * The returned `numFmt` reproduces how the value looked on the page, so the
 * cell reads as "$1,440.00" while holding 1440.
 *
 * @param {string} raw
 * @returns {{value:number, numFmt:string}|null} null when it is not a number
 */
export function parseNumericCell(raw) {
  let s = String(raw == null ? '' : raw).trim();
  if (!s) return null;

  // Accounting negatives: (450.00) and a trailing minus.
  let negative = false;
  if (/^\(.*\)$/.test(s)) { negative = true; s = s.slice(1, -1).trim(); }
  if (/-$/.test(s)) { negative = true; s = s.slice(0, -1).trim(); }

  const percent = /%$/.test(s);
  if (percent) s = s.slice(0, -1).trim();

  /* Sign and currency symbol appear in either order — "-$450.00" and
     "$-450.00" are both written — so strip whichever is in front until
     neither is, rather than assuming a fixed sequence. */
  let symbol = '';
  const symbolRe = new RegExp('^([' + CURRENCY + ']+)\\s*');
  for (let guard = 0; guard < 4; guard++) {
    const m = s.match(symbolRe);
    if (m) { symbol = symbol || m[1]; s = s.slice(m[0].length).trim(); continue; }
    if (/^-/.test(s)) { negative = true; s = s.slice(1).trim(); continue; }
    if (/^\+/.test(s)) { s = s.slice(1).trim(); continue; }
    break;
  }
  // A trailing symbol, as in "1,440.00 £".
  const trailing = s.match(new RegExp('\\s*([' + CURRENCY + ']+)$'));
  if (trailing) { symbol = symbol || trailing[1]; s = s.slice(0, trailing.index).trim(); }

  // What is left must be digits and separators only.
  if (!/^\d[\d.,\s]*$/.test(s)) return null;
  s = s.replace(/\s/g, '');

  /* Leading zeros mean the string is an identifier, not a quantity — an
     account or phone number that must not be turned into arithmetic. */
  if (/^0\d/.test(s)) return null;

  const commas = (s.match(/,/g) || []).length;
  const dots = (s.match(/\./g) || []).length;

  /* Which separator is the decimal point. With both present the last one
     wins. With one of a kind it is a judgement call, resolved the way an
     English-language document usually means it: a lone dot is decimal, and a
     lone comma is a thousands separator only when exactly three digits
     follow it. Repeated separators are always grouping. */
  let decimalSep = null;
  if (commas && dots) {
    decimalSep = s.lastIndexOf(',') > s.lastIndexOf('.') ? ',' : '.';
  } else if (commas === 1) {
    decimalSep = /,\d{3}$/.test(s) ? null : ',';
  } else if (dots === 1) {
    decimalSep = '.';
  }

  /* Whatever is not the decimal point is grouping. With no decimal point at
     all — "1.234.567" — the grouping separator is simply whichever one the
     string actually uses; defaulting to a comma there left the dots in place
     and the parse failed. */
  let groupSep;
  if (decimalSep === ',') groupSep = '.';
  else if (decimalSep === '.') groupSep = ',';
  else groupSep = dots ? '.' : ',';

  const grouped = s.includes(groupSep);

  let normalised = s.split(groupSep).join('');
  if (decimalSep) normalised = normalised.replace(decimalSep, '.');

  if (!/^\d+(\.\d+)?$/.test(normalised)) return null;

  // More precision than a double can hold would be corrupted by converting.
  if (normalised.replace('.', '').replace(/^0+/, '').length > 15) return null;

  let value = Number(normalised);
  if (!Number.isFinite(value)) return null;
  if (negative) value = -value;

  const decimals = decimalSep ? (normalised.split('.')[1] || '').length : 0;
  if (percent) value = value / 100;

  /* Rebuild the look of the original. */
  const digits = (grouped ? '#,##0' : '0') + (decimals ? '.' + '0'.repeat(decimals) : '');
  let numFmt;
  if (percent) numFmt = (decimals ? '0.' + '0'.repeat(decimals) : '0') + '%';
  else if (symbol) numFmt = '"' + symbol + '"' + digits;
  else numFmt = digits;

  return { value, numFmt };
}

/**
 * Decide what a cell lifted off a PDF page should become.
 * Falls back to the raw string whenever it is not confidently a number or date.
 *
 * @param {string} raw
 * @returns {{t:'s'|'n'|'d', v:string|number, numFmt?:string}}
 */
export function typedCellFromText(raw) {
  const s = String(raw == null ? '' : raw);

  const iso = /^\s*(\d{4})-(\d{2})-(\d{2})\s*$/.exec(s);
  if (iso) {
    const y = +iso[1], m = +iso[2], d = +iso[3];
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      return { t: 'd', v: isoDateToSerial(y, m, d), numFmt: 'yyyy-mm-dd' };
    }
  }

  const num = parseNumericCell(s);
  if (num) return { t: 'n', v: num.value, numFmt: num.numFmt };

  return { t: 's', v: s };
}

/* ------------------------------------------------------------ flattening */

/**
 * Flatten nested objects and arrays into dotted-path columns.
 *
 * `{a:{b:1}, c:[2,3]}` becomes `{'a.b':1, 'c.0':2, 'c.1':3}`. Without this a
 * nested value lands in a cell as "[object Object]" or, worse, as nothing —
 * which is exactly how json-to-csv came to emit a header row and one line of
 * empty fields.
 *
 * @param {any} value
 * @param {string} [prefix]
 * @param {object} [out]
 * @param {number} [depth]
 */
export function flatten(value, prefix = '', out = {}, depth = 0) {
  // A pathological document should degrade, not hang the tab.
  if (depth > 12) { out[prefix || 'value'] = String(value); return out; }

  if (value === null || value === undefined) {
    if (prefix) out[prefix] = '';
    return out;
  }

  if (Array.isArray(value)) {
    if (!value.length && prefix) out[prefix] = '';
    value.forEach((v, i) => flatten(v, prefix ? `${prefix}.${i}` : String(i), out, depth + 1));
    return out;
  }

  if (typeof value === 'object') {
    const keys = Object.keys(value);
    if (!keys.length && prefix) out[prefix] = '';
    for (const k of keys) {
      // "@attributes" is an XML artefact; fold it away so a column reads
      // "sku" rather than "@attributes.sku".
      const label = k === '@attributes' ? prefix : (prefix ? `${prefix}.${k}` : k);
      flatten(value[k], label, out, depth + 1);
    }
    return out;
  }

  out[prefix || 'value'] = value;
  return out;
}

/**
 * Turn a list of records into a header row plus data rows, using the union of
 * every record's keys so a field missing from the first record is not lost.
 *
 * @param {object[]} records
 * @returns {Array<Array<any>>} rows, first row is the header
 */
export function recordsToRows(records) {
  const flatRecords = records.map((r) =>
    (r && typeof r === 'object' && !Array.isArray(r)) ? flatten(r) : { value: r });

  const header = [];
  const seen = new Set();
  for (const rec of flatRecords) {
    for (const k of Object.keys(rec)) {
      if (!seen.has(k)) { seen.add(k); header.push(k); }
    }
  }

  const rows = [header];
  for (const rec of flatRecords) {
    rows.push(header.map((k) => (rec[k] === undefined ? '' : rec[k])));
  }
  return rows;
}

/* ------------------------------------------------------- record discovery */

/**
 * Find the rows inside an arbitrary JSON value.
 *
 * A tabular export is only meaningful if we can identify what a *row* is.
 * Most real payloads are one of: an array of objects; an envelope with the
 * array under a key (`{data:[…]}`, `{results:[…]}`, `{rows:[…]}`); or a single
 * object that is itself one record. Previously anything but the first case
 * produced a single row of empty cells.
 *
 * @param {any} json
 * @returns {{records: object[], source: string}}
 */
export function pickRecords(json) {
  if (Array.isArray(json)) return { records: json, source: 'root array' };

  if (json && typeof json === 'object') {
    // Prefer the largest array of objects anywhere shallow in the envelope.
    let best = null;
    const consider = (key, val) => {
      if (!Array.isArray(val) || !val.length) return;
      const objects = val.filter((v) => v && typeof v === 'object' && !Array.isArray(v)).length;
      const score = objects === val.length ? val.length * 10 : val.length;
      if (!best || score > best.score) best = { key, val, score };
    };
    for (const [k, v] of Object.entries(json)) consider(k, v);
    if (!best) {
      for (const v of Object.values(json)) {
        if (v && typeof v === 'object' && !Array.isArray(v)) {
          for (const [k2, v2] of Object.entries(v)) consider(k2, v2);
        }
      }
    }
    if (best) return { records: best.val, source: `array at "${best.key}"` };

    // No array at all: the object is a single record. Flattening keeps every
    // nested value instead of emitting a row of blanks.
    return { records: [json], source: 'single object' };
  }

  return { records: [{ value: json }], source: 'scalar' };
}

/**
 * Find the repeating record elements in an XML document.
 *
 * Walks the tree for the largest group of same-named sibling elements — in a
 * catalogue of `<item>`s that is the items, which is what a person means by a
 * row. Falls back to the root's children, and finally to the root itself.
 *
 * @param {Element} root documentElement
 * @returns {{elements: Element[], name: string}}
 */
export function pickXmlRecords(root) {
  let best = null;

  const visit = (el, depth) => {
    if (depth > 12) return;
    const groups = new Map();
    for (const child of Array.from(el.children || [])) {
      const list = groups.get(child.tagName) || [];
      list.push(child);
      groups.set(child.tagName, list);
    }
    for (const [name, list] of groups) {
      if (list.length > 1 && (!best || list.length > best.elements.length)) {
        best = { elements: list, name };
      }
    }
    for (const child of Array.from(el.children || [])) visit(child, depth + 1);
  };

  visit(root, 0);
  if (best) return best;

  const kids = Array.from(root.children || []);
  if (kids.length) return { elements: kids, name: root.tagName };
  return { elements: [root], name: root.tagName };
}

/**
 * Convert one XML element to a plain object: attributes become fields, child
 * elements recurse, and an element holding only text becomes that text.
 *
 * @param {Element} el
 * @param {number} [depth]
 */
export function xmlElementToObject(el, depth = 0) {
  if (depth > 12) return el.textContent;

  const kids = Array.from(el.children || []);
  const attrs = {};
  for (const a of Array.from(el.attributes || [])) attrs[a.name] = a.value;

  if (!kids.length) {
    const text = (el.textContent || '').trim();
    // Text-only element with attributes keeps both, under a "#text" field.
    if (Object.keys(attrs).length) return text ? { ...attrs, '#text': text } : attrs;
    return text;
  }

  const obj = { ...attrs };
  for (const child of kids) {
    const val = xmlElementToObject(child, depth + 1);
    if (obj[child.tagName] === undefined) obj[child.tagName] = val;
    else {
      if (!Array.isArray(obj[child.tagName])) obj[child.tagName] = [obj[child.tagName]];
      obj[child.tagName].push(val);
    }
  }
  return obj;
}

/* ----------------------------------------------------------- CSV writing */

/** Quote a value for CSV output only when it needs it. */
export function csvCell(value, delim = ',') {
  const s = value === null || value === undefined ? '' : String(value);
  if (s === '') return '';
  if (s.includes('"') || s.includes('\n') || s.includes('\r') || s.includes(delim)) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

/**
 * Serialise rows to CSV text.
 * A UTF-8 BOM is prepended so Excel opens non-ASCII correctly — without it
 * Excel assumes the local codepage and reintroduces the mojibake this module
 * exists to prevent.
 */
export function rowsToCsv(rows, { delimiter = ',', bom = true } = {}) {
  const body = rows.map((r) => r.map((c) => csvCell(c, delimiter)).join(delimiter)).join('\r\n');
  return (bom ? '﻿' : '') + body + (body ? '\r\n' : '');
}

/* ------------------------------------------------- xlsx cell formatting */

/**
 * Read per-cell fill colours out of an .xlsx package.
 *
 * SheetJS's community build does not parse styles at all, so a workbook
 * converted through it arrives with its fills, fonts and borders gone — the
 * data is right and the document no longer looks like itself. The colours live
 * in `xl/styles.xml`, indexed by each cell's `s=` attribute, so they can be
 * read directly from the zip alongside whatever SheetJS returns.
 *
 * Kept string-based rather than DOM-based so it runs in Node for tests as well
 * as in the browser.
 *
 * @param {object} zip a loaded JSZip instance
 * @returns {Promise<Map<string, Map<string,string>>>} sheet name -> "A1" -> "#rrggbb"
 */
export async function readXlsxFills(zip) {
  const out = new Map();
  const file = (p) => (zip.file(p) ? zip.file(p).async('string') : Promise.resolve(''));

  const stylesXml = await file('xl/styles.xml');
  if (!stylesXml) return out;

  /* fills[] -> the solid foreground colour of each fill, or null. Indexed
     positionally, which is how cellXfs refers to them. */
  const fills = [];
  const fillsBlock = (stylesXml.match(/<fills[\s\S]*?<\/fills>/) || [''])[0];
  for (const m of fillsBlock.matchAll(/<fill>([\s\S]*?)<\/fill>/g)) {
    const pattern = m[1];
    if (!/patternType="solid"/.test(pattern)) { fills.push(null); continue; }
    const rgb = (pattern.match(/<fgColor[^>]*rgb="([0-9A-Fa-f]{6,8})"/) || [])[1];
    // An 8-digit value is ARGB; the alpha is leading and not a colour channel.
    fills.push(rgb ? '#' + rgb.slice(-6).toLowerCase() : null);
  }

  /* cellXfs[] -> fill index, but only when applyFill says the fill is the
     cell's own rather than inherited from a named style. */
  /* Match only the opening tag, never its children.
     An earlier `(?:\/>|>[\s\S]*?<\/xf>)` looked like it handled both the
     self-closing and the container form, but the lazy `</xf>` branch succeeds
     before the engine ever backtracks far enough to try `/>`, so one match
     swallowed several elements and the whole table collapsed to three zeroes.
     Only the attributes are needed here, so there is nothing to gain by
     consuming the body. */
  const xfFill = [];
  const xfsBlock = (stylesXml.match(/<cellXfs[\s\S]*?<\/cellXfs>/) || [''])[0];
  for (const m of xfsBlock.matchAll(/<xf\b([^>]*?)\/?>/g)) {
    xfFill.push(Number((m[1].match(/fillId="(\d+)"/) || [])[1] || 0));
  }

  // Sheet names, in the order their rels resolve.
  const workbookXml = await file('xl/workbook.xml');
  const names = [...workbookXml.matchAll(/<sheet\b[^>]*name="([^"]+)"/g)].map((m) => m[1]);

  const paths = Object.keys(zip.files)
    .filter((p) => /^xl\/worksheets\/sheet\d+\.xml$/.test(p))
    .sort((a, b) => (+a.match(/(\d+)/)[1]) - (+b.match(/(\d+)/)[1]));

  for (let i = 0; i < paths.length; i++) {
    const xml = await file(paths[i]);
    const map = new Map();
    // Opening tag only, for the same reason as the cellXfs scan above.
    for (const m of xml.matchAll(/<c\b([^>]*?)\/?>/g)) {
      const attrs = m[1];
      const ref = (attrs.match(/r="([A-Z]+\d+)"/) || [])[1];
      const s = (attrs.match(/\bs="(\d+)"/) || [])[1];
      if (!ref || s === undefined) continue;
      const colour = fills[xfFill[+s]] || null;
      // Fill 0 is "none" and fill 1 is the gray125 default; neither is a colour.
      if (colour) map.set(ref, colour);
    }
    out.set(names[i] || paths[i], map);
  }

  return out;
}

/** "A1" -> { row: 0, col: 0 }, zero-based. */
export function decodeRef(ref) {
  const m = /^([A-Z]+)(\d+)$/.exec(String(ref));
  if (!m) return null;
  let col = 0;
  for (const ch of m[1]) col = col * 26 + (ch.charCodeAt(0) - 64);
  return { row: +m[2] - 1, col: col - 1 };
}

/**
 * Explicit column widths from an .xlsx, in points.
 *
 * Excel stores a width in "characters of the default font", which is not a
 * unit anything else uses. The conventional conversion is
 * `pixels = characters * 7 + 5` at 96dpi, then points at 3/4 of that. Exact
 * fidelity is impossible without the workbook's font metrics; the useful part
 * is the *relative* width, so a label column stays wider than a quantity one.
 *
 * @param {object} zip a loaded JSZip instance
 * @returns {Promise<Map<string, number[]>>} sheet name -> width per column index
 */
export async function readXlsxColWidths(zip) {
  const out = new Map();
  const file = (p) => (zip.file(p) ? zip.file(p).async('string') : Promise.resolve(''));

  const workbookXml = await file('xl/workbook.xml');
  const names = [...workbookXml.matchAll(/<sheet\b[^>]*name="([^"]+)"/g)].map((m) => m[1]);

  const paths = Object.keys(zip.files)
    .filter((p) => /^xl\/worksheets\/sheet\d+\.xml$/.test(p))
    .sort((a, b) => (+a.match(/(\d+)/)[1]) - (+b.match(/(\d+)/)[1]));

  for (let i = 0; i < paths.length; i++) {
    const xml = await file(paths[i]);
    const widths = [];
    for (const m of xml.matchAll(/<col\b([^>]*?)\/?>/g)) {
      const attrs = m[1];
      // customWidth marks a width the user actually set, as opposed to the
      // default one Excel writes for every column in some exports.
      if (!/customWidth="1"/.test(attrs)) continue;
      const min = Number((attrs.match(/min="(\d+)"/) || [])[1] || 0);
      const max = Number((attrs.match(/max="(\d+)"/) || [])[1] || min);
      const chars = Number((attrs.match(/width="([\d.]+)"/) || [])[1] || 0);
      if (!min || !chars) continue;
      const pt = (chars * 7 + 5) * 0.75;
      for (let c = min; c <= max; c++) widths[c - 1] = pt;
    }
    if (widths.length) out.set(names[i] || paths[i], widths);
  }
  return out;
}
