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

/**
 * Extract one worksheet into a standalone .xlsx, keeping everything else.
 *
 * Round-tripping a sheet through SheetJS's community build loses every fill,
 * font, border, column width and frozen pane, because that build does not read
 * styles at all. A user who *splits* a workbook expects the pieces to be the
 * workbook, so this copies the original package and removes the other sheets
 * instead of rebuilding one from parsed values. styles.xml, sharedStrings.xml
 * and the theme travel untouched, so the part looks exactly like its source.
 *
 * @param {object} JSZipCtor the JSZip constructor
 * @param {object} zip a loaded JSZip of the original workbook
 * @param {string} sheetName the sheet to keep
 * @returns {Promise<Uint8Array|null>} the new package, or null if not found
 */
export async function extractSheetPackage(JSZipCtor, zip, sheetName) {
  const read = (p) => (zip.file(p) ? zip.file(p).async('string') : Promise.resolve(''));

  const workbookXml = await read('xl/workbook.xml');
  const relsXml = await read('xl/_rels/workbook.xml.rels');
  if (!workbookXml || !relsXml) return null;

  const sheetTags = [...workbookXml.matchAll(/<sheet\b[^>]*\/>/g)].map((m) => m[0]);
  const keep = sheetTags.find((t) => {
    const name = (t.match(/name="([^"]*)"/) || [])[1];
    return name === sheetName;
  });
  if (!keep) return null;

  const keepRid = (keep.match(/r:id="([^"]+)"/) || [])[1];
  const relFor = (rid) => {
    /* No \b here: inside a quoted string that is the backspace character, not
       a word boundary, and the pattern silently matched nothing. The plural
       <Relationships> wrapper cannot match anyway, because it carries no Id. */
    const re = new RegExp('<Relationship[^>]*Id="' + rid + '"[^>]*>', 'i');
    const tag = (relsXml.match(re) || [])[0] || '';
    return (tag.match(/Target="([^"]+)"/) || [])[1] || '';
  };

  const keepTarget = relFor(keepRid).replace(/^\/?/, '').replace(/^xl\//, '');
  const keepPath = 'xl/' + keepTarget;

  /* Every worksheet part in the package, so the others can be dropped along
     with the rels and content-type overrides that name them. */
  const allSheetPaths = Object.keys(zip.files)
    .filter((p) => /^xl\/worksheets\/sheet[^/]*\.xml$/.test(p));

  const out = new JSZipCtor();

  for (const path of Object.keys(zip.files)) {
    const entry = zip.files[path];
    if (entry.dir) continue;

    // Drop the other worksheets and their rels.
    if (allSheetPaths.includes(path) && path !== keepPath) continue;
    if (/^xl\/worksheets\/_rels\//.test(path) &&
        !path.includes(keepPath.split('/').pop())) continue;

    /* calcChain records formula evaluation order across the whole workbook.
       Left behind after removing sheets it refers to cells that no longer
       exist, and Excel reports the file as needing repair. */
    if (path === 'xl/calcChain.xml') continue;

    if (path === 'xl/workbook.xml') {
      let xml = workbookXml;
      for (const tag of sheetTags) if (tag !== keep) xml = xml.replace(tag, '');
      // definedNames can reference removed sheets; drop the block wholesale.
      xml = xml.replace(/<definedNames>[\s\S]*?<\/definedNames>/g, '');
      out.file(path, xml);
      continue;
    }

    if (path === 'xl/_rels/workbook.xml.rels') {
      let xml = relsXml;
      for (const m of [...relsXml.matchAll(/<Relationship\b[^>]*\/>/g)]) {
        const tag = m[0];
        if (!/\/worksheet"/.test(tag)) continue;         // keep styles, theme, sharedStrings
        if (tag.includes('Id="' + keepRid + '"')) continue;
        xml = xml.replace(tag, '');
      }
      out.file(path, xml);
      continue;
    }

    if (path === '[Content_Types].xml') {
      let xml = await entry.async('string');
      for (const sheetPath of allSheetPaths) {
        if (sheetPath === keepPath) continue;
        /* No `\b` here either, and the path is escaped: in a quoted string
           that escape is a backspace character, so this matched nothing and
           the removed worksheets kept their content-type declarations. The
           calcChain line just below is a regex *literal*, where the same
           `\b` is the word boundary it looks like — which is exactly why
           this one survived so long sitting next to it. */
        const quoted = sheetPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp('<Override[^>]*PartName="/' + quoted + '"[^>]*/>', 'g');
        xml = xml.replace(re, '');
      }
      xml = xml.replace(/<Override\b[^>]*PartName="\/xl\/calcChain\.xml"[^>]*\/>/g, '');
      out.file(path, xml);
      continue;
    }

    out.file(path, await entry.async('uint8array'));
  }

  return out.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
}

/* ------------------------------------------------ workbook merging */

/**
 * Pull out the full text of every `<tag>` element directly inside `xml`.
 *
 * Written as an index scan rather than a regex alternation on purpose. The
 * obvious pattern — `<xf\b(?:\/>|>[\s\S]*?<\/xf>)` — looks right and is not:
 * on a self-closing element the lazy `</xf>` branch can succeed first by
 * running on to a later element's close tag, so one match swallows several
 * entries and the style table reads short. That cost a debugging session
 * once already; scanning for the end of each element is unambiguous.
 */
function splitElements(xml, tag) {
  const out = [];
  const opener = new RegExp('<' + tag + '(?=[\\s/>])', 'g');
  let m;
  while ((m = opener.exec(xml))) {
    const start = m.index;
    const gt = xml.indexOf('>', start);
    if (gt < 0) break;
    if (xml[gt - 1] === '/') {                       // <xf .../>
      out.push(xml.slice(start, gt + 1));
      opener.lastIndex = gt + 1;
      continue;
    }
    // Paired element: walk to its matching close, allowing for nesting.
    const scan = new RegExp('<' + tag + '(?=[\\s/>])|</' + tag + '>', 'g');
    scan.lastIndex = gt + 1;
    let depth = 1;
    let end = xml.length;
    let s;
    while ((s = scan.exec(xml))) {
      if (s[0][1] === '/') {
        if (--depth === 0) { end = scan.lastIndex; break; }
      } else {
        const inner = xml.indexOf('>', s.index);
        if (inner >= 0 && xml[inner - 1] !== '/') depth++;
      }
    }
    out.push(xml.slice(start, end));
    opener.lastIndex = end;
  }
  return out;
}

/** The inner text of `<name …> … </name>`, or '' when the section is absent. */
function sectionOf(xml, name) {
  const open = new RegExp('<' + name + '(?=[\\s/>])');
  const m = open.exec(xml);
  if (!m) return '';
  const gt = xml.indexOf('>', m.index);
  if (gt < 0 || xml[gt - 1] === '/') return '';
  const close = xml.indexOf('</' + name + '>', gt);
  return close < 0 ? '' : xml.slice(gt + 1, close);
}

/** Read one attribute off an element's opening tag. */
function attrOf(tag, name) {
  const m = new RegExp('\\b' + name + '="([^"]*)"').exec(tag);
  return m ? m[1] : null;
}

/** Set (or add) an attribute on an element's opening tag. */
function withAttr(tag, name, value) {
  const re = new RegExp('(\\b' + name + '=")[^"]*(")');
  if (re.test(tag)) return tag.replace(re, '$1' + value + '$2');
  const gt = tag.indexOf('>');
  const selfClosing = tag[gt - 1] === '/';
  const cut = selfClosing ? gt - 1 : gt;
  return tag.slice(0, cut) + ' ' + name + '="' + value + '"' + tag.slice(cut);
}

/**
 * The pieces of an xl/styles.xml, as arrays of element text.
 *
 * Every index a cell carries (`s="4"`) is a position in *this* workbook's
 * cellXfs, and each of those entries points in turn at positions in this
 * workbook's fonts, fills, borders and number formats. None of that means
 * anything in another file, which is what makes merging workbooks harder than
 * merging slides.
 */
function readStyleTable(xml) {
  return {
    numFmts: splitElements(sectionOf(xml, 'numFmts'), 'numFmt'),
    fonts: splitElements(sectionOf(xml, 'fonts'), 'font'),
    fills: splitElements(sectionOf(xml, 'fills'), 'fill'),
    borders: splitElements(sectionOf(xml, 'borders'), 'border'),
    cellStyleXfs: splitElements(sectionOf(xml, 'cellStyleXfs'), 'xf'),
    cellXfs: splitElements(sectionOf(xml, 'cellXfs'), 'xf'),
  };
}

/** Serialise a merged style table back into a styles.xml part. */
function writeStyleTable(t) {
  const section = (name, items, extra) =>
    items.length
      ? '<' + name + ' count="' + items.length + '"' + (extra || '') + '>' + items.join('') + '</' + name + '>'
      : '';
  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    section('numFmts', t.numFmts) +
    section('fonts', t.fonts) +
    section('fills', t.fills) +
    section('borders', t.borders) +
    section('cellStyleXfs', t.cellStyleXfs) +
    section('cellXfs', t.cellXfs) +
    '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>' +
    '</styleSheet>';
}

/** Fold a donor workbook's style table into the merged one.
 *  @returns {Map<number,number>} donor cellXfs index -> merged cellXfs index */
function foldStyleTable(merged, donorXml) {
  const d = readStyleTable(donorXml);

  /* Number formats below 164 are the built-ins every reader knows (0 is
     General, 14 is a short date). Anything from 164 up is defined by the file
     itself, so two workbooks routinely disagree about what 164 means — here
     one says dollars and the other euros. Re-id the donor's custom formats,
     reusing an existing id when the format code is genuinely the same. */
  const codeToId = new Map();
  let maxId = 163;
  for (const nf of merged.numFmts) {
    const id = Number(attrOf(nf, 'numFmtId'));
    codeToId.set(attrOf(nf, 'formatCode'), id);
    if (id > maxId) maxId = id;
  }
  const numFmtMap = new Map();
  for (const nf of d.numFmts) {
    const id = Number(attrOf(nf, 'numFmtId'));
    const code = attrOf(nf, 'formatCode');
    if (codeToId.has(code)) { numFmtMap.set(id, codeToId.get(code)); continue; }
    const fresh = ++maxId;
    codeToId.set(code, fresh);
    numFmtMap.set(id, fresh);
    merged.numFmts.push(withAttr(nf, 'numFmtId', fresh));
  }

  /* Fonts, fills and borders are value types: an identical definition can be
     shared rather than duplicated, which keeps the merged table close to the
     size of the two originals instead of their sum. */
  const fold = (into, from) => {
    const map = new Map();
    from.forEach((el, i) => {
      let at = into.indexOf(el);
      if (at < 0) { at = into.length; into.push(el); }
      map.set(i, at);
    });
    return map;
  };
  const fontMap = fold(merged.fonts, d.fonts);
  const fillMap = fold(merged.fills, d.fills);
  const borderMap = fold(merged.borders, d.borders);

  const remap = (xf) => {
    let out = xf;
    const move = (attr, map) => {
      const raw = attrOf(out, attr);
      if (raw !== null && map.has(Number(raw))) out = withAttr(out, attr, map.get(Number(raw)));
    };
    move('numFmtId', numFmtMap);
    move('fontId', fontMap);
    move('fillId', fillMap);
    move('borderId', borderMap);
    return out;
  };

  const styleXfMap = new Map();
  d.cellStyleXfs.forEach((xf, i) => {
    const r = remap(xf);
    let at = merged.cellStyleXfs.indexOf(r);
    if (at < 0) { at = merged.cellStyleXfs.length; merged.cellStyleXfs.push(r); }
    styleXfMap.set(i, at);
  });

  const xfMap = new Map();
  d.cellXfs.forEach((xf, i) => {
    let r = remap(xf);
    const xfId = attrOf(r, 'xfId');
    if (xfId !== null && styleXfMap.has(Number(xfId))) r = withAttr(r, 'xfId', styleXfMap.get(Number(xfId)));
    let at = merged.cellXfs.indexOf(r);
    if (at < 0) { at = merged.cellXfs.length; merged.cellXfs.push(r); }
    xfMap.set(i, at);
  });

  return xfMap;
}

/**
 * Rewrite one worksheet's private indices into the merged workbook's.
 *
 * `s=` on a cell, a row or a column is a position in cellXfs, and a `t="s"`
 * cell's value is a position in sharedStrings. Both are meaningless once the
 * sheet moves into another package, and neither is validated by Excel — a
 * stale index simply renders as some other cell's formatting, or as the wrong
 * string, which is why this failure looks like "the merge worked" until
 * somebody reads the numbers.
 */
function remapSheetIndices(xml, xfMap, stringMap) {
  let out = xml.replace(/<(c|row|col)\b([^>]*)>/g, (whole, tag, attrs) => {
    const key = tag === 'col' ? 'style' : 's';
    const re = new RegExp('\\b' + key + '="(\\d+)"');
    const m = re.exec(attrs);
    if (!m) return whole;
    const mapped = xfMap.get(Number(m[1]));
    if (mapped === undefined) return whole;
    return '<' + tag + attrs.replace(re, key + '="' + mapped + '"') + '>';
  });

  if (stringMap && stringMap.size) {
    /* `[^>]*` cannot cross the end of the opening tag, so this can only ever
       match a `<v>` that belongs to the cell it started on. A looser
       `<c…>([\s\S]*?)</c>` would run past a self-closing `<c/>` and rewrite
       the *following* cell's value. */
    out = out.replace(/(<c\b[^>]*\bt="s"[^>]*>\s*<v[^>]*>)(\d+)(<\/v>)/g,
      (whole, head, idx, tail) => {
        const mapped = stringMap.get(Number(idx));
        return mapped === undefined ? whole : head + mapped + tail;
      });
  }
  return out;
}

/**
 * A sheet tab name that satisfies Excel and is unique across the merge.
 *
 * Renaming is kept to the minimum a merged workbook forces, because a sheet's
 * name is not decoration: a formula in another sheet says ='Q1 Data'!B4, and
 * renaming the sheet it points at silently repoints or breaks it. Names are
 * therefore left exactly as they were unless the merged workbook already
 * holds that name, and only then is the source file's own name used to tell
 * the two apart.
 *
 * @param {string[]} preferred names to try in order, best first
 * @param {Set<string>} taken lower-cased names already used
 */
function uniqueSheetName(preferred, taken) {
  const clean = (raw) => String(raw || '').replace(/[[\]?*/\\:]/g, '_').slice(0, 31);
  for (const raw of preferred) {
    const name = clean(raw);
    if (name && !taken.has(name.toLowerCase())) { taken.add(name.toLowerCase()); return name; }
  }
  const stem = clean(preferred[0]) || 'Sheet';
  for (let n = 2; ; n++) {
    const suffix = '_' + n;
    const candidate = stem.slice(0, 31 - suffix.length) + suffix;
    if (!taken.has(candidate.toLowerCase())) { taken.add(candidate.toLowerCase()); return candidate; }
  }
}

/** Fold a donor's shared strings into the merged table.
 *  @returns {Map<number,number>} donor string index -> merged index */
function foldSharedStrings(into, from) {
  const map = new Map();
  from.forEach((si, i) => {
    let at = into.indexOf(si);
    if (at < 0) { at = into.length; into.push(si); }
    map.set(i, at);
  });
  return map;
}

/* A workbook with no styles.xml of its own still needs the two reserved
   fills — index 0 "none" and index 1 "gray125" — because every other fill is
   numbered relative to them. */
const MINIMAL_STYLES =
  '<styleSheet><fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts>' +
  '<fills count="2"><fill><patternFill patternType="none"/></fill>' +
  '<fill><patternFill patternType="gray125"/></fill></fills>' +
  '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
  '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
  '<cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs>' +
  '</styleSheet>';

const WORKSHEET_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml';
const SHAREDSTRINGS_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml';

/** Resolve a relationship Target against the folder of the part holding it. */
function resolvePart(baseDir, target) {
  const stack = baseDir.replace(/\/$/, '').split('/').filter(Boolean);
  for (const segment of String(target).replace(/^\//, '').split('/')) {
    if (segment === '..') stack.pop();
    else if (segment && segment !== '.') stack.push(segment);
  }
  return stack.join('/');
}

/** Express an absolute part path relative to a folder. */
function relativeFrom(baseDir, path) {
  const from = baseDir.replace(/\/$/, '').split('/').filter(Boolean);
  const to = path.split('/');
  while (from.length && to.length && from[0] === to[0]) { from.shift(); to.shift(); }
  return from.map(() => '..').concat(to).join('/');
}

/** The Target of one relationship id.
 *  No `\b` in this pattern: inside a quoted string that is a backspace
 *  character, not a word boundary, and it silently matches nothing. */
function relTarget(relsXml, rid) {
  const re = new RegExp('<Relationship[^>]*Id="' + rid + '"[^>]*>', 'i');
  const tag = (relsXml.match(re) || [])[0] || '';
  return (tag.match(/Target="([^"]+)"/) || [])[1] || '';
}

/** A part path that nothing in the output is using yet. */
function freshPath(used, path) {
  if (!used.has(path)) return path;
  const slash = path.lastIndexOf('/');
  const dir = path.slice(0, slash + 1);
  const file = path.slice(slash + 1);
  const dot = file.lastIndexOf('.');
  const stem = dot < 0 ? file : file.slice(0, dot);
  const ext = dot < 0 ? '' : file.slice(dot);
  for (let n = 2; ; n++) {
    const candidate = dir + stem + '_m' + n + ext;
    if (!used.has(candidate)) return candidate;
  }
}

/**
 * Copy a part and everything it points at into the output package.
 *
 * A worksheet is not self-contained: its .rels reach out to drawings,
 * hyperlinks, comments and printer settings, and a drawing's own .rels reach
 * on to the image files. Copying the sheet alone leaves those references
 * dangling, and Excel does not ignore a dangling reference — it declares the
 * workbook damaged. This is the same lesson merge-pptx learned about slides.
 */
async function copyRelatedParts(donorZip, donorCt, out, srcPath, newPath, used, types) {
  const srcDir = srcPath.slice(0, srcPath.lastIndexOf('/'));
  const srcFile = srcPath.slice(srcPath.lastIndexOf('/') + 1);
  const relsPath = srcDir + '/_rels/' + srcFile + '.rels';
  if (!donorZip.file(relsPath)) return;

  let relsXml = await donorZip.file(relsPath).async('string');
  const newDir = newPath.slice(0, newPath.lastIndexOf('/'));
  const newFile = newPath.slice(newPath.lastIndexOf('/') + 1);

  for (const tag of splitElements(relsXml, 'Relationship')) {
    if (/TargetMode="External"/i.test(tag)) continue;   // a URL, not a part
    const target = attrOf(tag, 'Target');
    if (!target) continue;
    const childSrc = resolvePart(srcDir, target);
    const childEntry = donorZip.file(childSrc);
    if (!childEntry) continue;

    const childNew = freshPath(used, childSrc);
    used.add(childNew);
    out.file(childNew, await childEntry.async('uint8array'));
    types.carryOver(childNew, childSrc, donorCt);
    await copyRelatedParts(donorZip, donorCt, out, childSrc, childNew, used, types);

    if (childNew !== childSrc) {
      const rewritten = withAttr(tag, 'Target', relativeFrom(newDir, childNew));
      relsXml = relsXml.replace(tag, rewritten);
    }
  }
  const newRelsPath = newDir + '/_rels/' + newFile + '.rels';
  out.file(newRelsPath, relsXml);
  used.add(newRelsPath);
}

/**
 * Track what [Content_Types].xml must declare.
 *
 * Every part in an OOXML package needs a content type, by extension or by
 * name. Excel does not guess: an undeclared part means "the file is damaged",
 * which is the failure people report as "the merge produced a broken file".
 */
function contentTypeIndex(baseXml) {
  const overrides = new Map();
  const defaults = new Map();
  for (const tag of splitElements(baseXml, 'Override')) {
    overrides.set(attrOf(tag, 'PartName'), attrOf(tag, 'ContentType'));
  }
  for (const tag of splitElements(baseXml, 'Default')) {
    defaults.set(String(attrOf(tag, 'Extension') || '').toLowerCase(), attrOf(tag, 'ContentType'));
  }
  return {
    setOverride(path, type) { overrides.set('/' + path, type); },
    dropOverride(path) { overrides.delete('/' + path); },
    /** Declare a copied part the way its own package declared it. */
    carryOver(newPath, srcPath, donorXml) {
      const ext = String(newPath.split('.').pop() || '').toLowerCase();
      const donorOverride = splitElements(donorXml || '', 'Override')
        .find((t) => String(attrOf(t, 'PartName') || '').toLowerCase() === ('/' + srcPath).toLowerCase());
      if (donorOverride) { overrides.set('/' + newPath, attrOf(donorOverride, 'ContentType')); return; }
      if (defaults.has(ext)) return;
      const donorDefault = splitElements(donorXml || '', 'Default')
        .find((t) => String(attrOf(t, 'Extension') || '').toLowerCase() === ext);
      if (donorDefault) defaults.set(ext, attrOf(donorDefault, 'ContentType'));
    },
    render() {
      const parts = [];
      for (const [ext, type] of defaults) parts.push('<Default Extension="' + ext + '" ContentType="' + type + '"/>');
      for (const [name, type] of overrides) parts.push('<Override PartName="' + name + '" ContentType="' + type + '"/>');
      return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        parts.join('') + '</Types>';
    },
  };
}

/** Escape a value going into an XML attribute. */
function xmlAttr(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Merge several .xlsx packages into one, keeping every workbook's formatting.
 *
 * The tool used to read each file with SheetJS and append the parsed
 * worksheets to a new workbook. SheetJS's community build does not read
 * xl/styles.xml at all, so what came back was values only: every fill, font,
 * border, number format and column width in all of the inputs was gone, and
 * the merged file looked nothing like either source. `split-excel` hit the
 * same ceiling and answered it the same way — do not re-author the workbook,
 * operate on the package.
 *
 * The hard part is that a cell's `s="4"` indexes its *own* workbook's style
 * table. Appending a second workbook's sheets unchanged leaves every cell
 * pointing at whatever sits at that position in the first workbook's table,
 * so a euro column silently becomes dollars and a purple header turns navy.
 * The file still opens, which is what makes that failure worse than a visibly
 * broken one. So the donor's style table is folded into the base's — sharing
 * identical fonts, fills and borders rather than duplicating them, and
 * re-numbering custom formats whose ids collide — and every index in the
 * incoming sheet XML is rewritten to match.
 *
 * Two limits are inherent to merging rather than bugs left for later: a
 * cross-sheet formula naming a sheet that had to be renamed for uniqueness
 * will point at the surviving sheet of that name, and defined names from the
 * second and later workbooks are dropped.
 *
 * @param {object} JSZipCtor the JSZip constructor
 * @param {{name:string, zip:object}[]} inputs loaded packages, first is the base
 * @returns {Promise<Uint8Array|null>} the merged package, or null if unusable
 */
export async function mergeWorkbookPackages(JSZipCtor, inputs) {
  if (!Array.isArray(inputs) || inputs.length === 0) return null;
  const read = (zip, path) => (zip.file(path) ? zip.file(path).async('string') : Promise.resolve(''));

  const base = inputs[0];
  const baseWorkbook = await read(base.zip, 'xl/workbook.xml');
  const baseRels = await read(base.zip, 'xl/_rels/workbook.xml.rels');
  if (!baseWorkbook || !baseRels) return null;

  /* calcChain records the order formulas were last evaluated in across the
     whole workbook. Carried into a package with new sheets it refers to cells
     that are no longer where it says, and Excel reports the file as needing
     repair — the trap split-excel already hit. Excel rebuilds it on open. */
  const REWRITTEN = new Set([
    '[Content_Types].xml', 'xl/workbook.xml', 'xl/_rels/workbook.xml.rels',
    'xl/styles.xml', 'xl/sharedStrings.xml', 'xl/calcChain.xml',
  ]);

  const out = new JSZipCtor();
  const used = new Set();
  for (const path of Object.keys(base.zip.files)) {
    const entry = base.zip.files[path];
    if (entry.dir) continue;
    used.add(path);
    if (REWRITTEN.has(path)) continue;
    out.file(path, await entry.async('uint8array'));
  }

  const types = contentTypeIndex(await read(base.zip, '[Content_Types].xml'));
  types.dropOverride('xl/calcChain.xml');

  const merged = readStyleTable((await read(base.zip, 'xl/styles.xml')) || MINIMAL_STYLES);
  const sharedItems = splitElements(await read(base.zip, 'xl/sharedStrings.xml'), 'si');
  const hadSharedStrings = sharedItems.length > 0;

  const baseSheetTags = splitElements(sectionOf(baseWorkbook, 'sheets'), 'sheet');
  const taken = new Set(baseSheetTags.map((t) => String(attrOf(t, 'name') || '').toLowerCase()));
  const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
  let maxSheetId = Math.max(0, ...baseSheetTags.map((t) => num(attrOf(t, 'sheetId'))));
  let maxRid = Math.max(0, ...splitElements(baseRels, 'Relationship')
    .map((t) => num(String(attrOf(t, 'Id') || '').replace(/\D/g, ''))));
  let sheetSeq = Math.max(0, ...Object.keys(base.zip.files)
    .map((p) => num((/^xl\/worksheets\/sheet(\d+)\.xml$/.exec(p) || [])[1])));

  const addedSheets = [];
  const addedRels = [];

  for (let i = 1; i < inputs.length; i++) {
    const donor = inputs[i];
    const donorWorkbook = await read(donor.zip, 'xl/workbook.xml');
    const donorRels = await read(donor.zip, 'xl/_rels/workbook.xml.rels');
    if (!donorWorkbook || !donorRels) continue;
    const donorCt = await read(donor.zip, '[Content_Types].xml');
    const label = String(donor.name || '').replace(/\.[^./\\]+$/, '');

    const xfMap = foldStyleTable(merged, (await read(donor.zip, 'xl/styles.xml')) || MINIMAL_STYLES);
    const stringMap = foldSharedStrings(
      sharedItems, splitElements(await read(donor.zip, 'xl/sharedStrings.xml'), 'si'));

    for (const tag of splitElements(sectionOf(donorWorkbook, 'sheets'), 'sheet')) {
      const rid = attrOf(tag, 'r:id') || attrOf(tag, 'id');
      const target = rid ? relTarget(donorRels, rid) : '';
      const srcPath = target ? resolvePart('xl', target) : '';
      if (!srcPath || !donor.zip.file(srcPath)) continue;

      const sheetXml = await read(donor.zip, srcPath);
      const newPath = freshPath(used, 'xl/worksheets/sheet' + (++sheetSeq) + '.xml');
      used.add(newPath);
      out.file(newPath, remapSheetIndices(sheetXml, xfMap, stringMap));
      types.setOverride(newPath, WORKSHEET_TYPE);
      await copyRelatedParts(donor.zip, donorCt, out, srcPath, newPath, used, types);

      const original = attrOf(tag, 'name') || 'Sheet';
      const name = uniqueSheetName([original, label ? label + '_' + original : ''], taken);
      const newRid = 'rId' + (++maxRid);
      addedRels.push('<Relationship Id="' + newRid + '" Type="http://schemas.openxmlformats.org'
        + '/officeDocument/2006/relationships/worksheet" Target="' + relativeFrom('xl', newPath) + '"/>');
      addedSheets.push('<sheet name="' + xmlAttr(name) + '" sheetId="' + (++maxSheetId)
        + '" r:id="' + newRid + '"/>');
    }
  }

  if (!addedSheets.length) return null;

  const sheetsInner = sectionOf(baseWorkbook, 'sheets');
  out.file('xl/workbook.xml', baseWorkbook.replace(sheetsInner, sheetsInner + addedSheets.join('')));
  out.file('xl/styles.xml', writeStyleTable(merged));
  types.setOverride('xl/styles.xml',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml');

  let rels = baseRels.replace('</Relationships>', addedRels.join('') + '</Relationships>');
  if (sharedItems.length) {
    out.file('xl/sharedStrings.xml',
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
      + '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="'
      + sharedItems.length + '" uniqueCount="' + sharedItems.length + '">'
      + sharedItems.join('') + '</sst>');
    types.setOverride('xl/sharedStrings.xml', SHAREDSTRINGS_TYPE);
    /* A base workbook with no strings of its own has no relationship to the
       part either, and a part nothing declares is a damaged file. */
    if (!hadSharedStrings) {
      rels = rels.replace('</Relationships>',
        '<Relationship Id="rId' + (++maxRid) + '" Type="http://schemas.openxmlformats.org'
        + '/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>'
        + '</Relationships>');
    }
  }
  out.file('xl/_rels/workbook.xml.rels', rels);
  out.file('[Content_Types].xml', types.render());

  return out.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
}

/* ------------------------------------------------- why a workbook won't open */

/**
 * Find an ASCII string in a byte array.
 *
 * A ZIP stores each member's path uncompressed in its local file header, so
 * the presence of `xl/workbook.xml` can be answered by scanning the raw
 * bytes — no unzipping, and no async, which means this can run inside a
 * `catch` without restructuring the caller.
 */
function bytesContain(bytes, ascii, limit) {
  const end = Math.min(bytes.length, limit || bytes.length);
  const first = ascii.charCodeAt(0);
  outer:
  for (let i = 0; i <= end - ascii.length; i++) {
    if (bytes[i] !== first) continue;
    for (let j = 1; j < ascii.length; j++) {
      if (bytes[i + j] !== ascii.charCodeAt(j)) continue outer;
    }
    return true;
  }
  return false;
}

/** The same scan for UTF-16LE, which is how OLE2 stores its stream names. */
function bytesContainUtf16(bytes, ascii, limit) {
  const end = Math.min(bytes.length, limit || bytes.length);
  outer:
  for (let i = 0; i <= end - ascii.length * 2; i++) {
    for (let j = 0; j < ascii.length; j++) {
      if (bytes[i + j * 2] !== ascii.charCodeAt(j) || bytes[i + j * 2 + 1] !== 0) continue outer;
    }
    return true;
  }
  return false;
}

/**
 * Explain, in the user's terms, why a file could not be read as a spreadsheet.
 *
 * This exists because the honest answer to "why won't my .xlsx open" was a
 * single generic sentence that fit every cause equally badly. A file named
 * `.xlsx` is very often not one: exports rename HTML and CSV, Excel 97-2003
 * workbooks get relabelled, and a password-protected workbook is an encrypted
 * OLE2 container with no readable sheet in it at all. Those need different
 * actions from the reader, so they need different messages.
 *
 * Call it **only after a parse has already failed** — several of the shapes it
 * recognises (HTML tables, CSV under an .xlsx name) are read perfectly well by
 * SheetJS, and refusing them up front would break files that work today.
 *
 * @param {Uint8Array} bytes the file's raw bytes
 * @param {string} fileName used only to name the extension in the message
 * @returns {string|null} a specific explanation, or null if nothing is recognised
 */
export function diagnoseSpreadsheet(bytes, fileName = '') {
  if (!bytes || bytes.length === 0) {
    return 'This file is empty (0 bytes). If it lives in OneDrive or another '
         + 'sync folder, it may still be online-only — open it once so it '
         + 'downloads, then try again.';
  }
  if (bytes.length < 64) {
    /* Only binary. A 30-byte CSV is a perfectly ordinary file, and telling its
       owner it was "truncated while downloading" would be a confident lie —
       if something that small failed to parse, the parser's own complaint is
       the more honest one. */
    let printable = 0;
    for (let i = 0; i < bytes.length; i++) {
      const b = bytes[i];
      if (b === 9 || b === 10 || b === 13 || (b >= 32 && b < 127)) printable++;
    }
    if (printable / bytes.length < 0.85) {
      return 'This file is only ' + bytes.length + ' bytes and is not readable '
           + 'text, so it cannot be a workbook. It was most likely truncated '
           + 'while being copied or downloaded.';
    }
    return null;
  }

  const ext = (fileName.match(/\.([a-z0-9]+)$/i) || [, ''])[1].toLowerCase();

  /* OLE2 — the Microsoft compound-file container. Both Excel 97-2003 and any
     password-protected modern workbook look like this from the outside. */
  const isOle2 = bytes[0] === 0xD0 && bytes[1] === 0xCF && bytes[2] === 0x11 && bytes[3] === 0xE0
              && bytes[4] === 0xA1 && bytes[5] === 0xB1 && bytes[6] === 0x1A && bytes[7] === 0xE1;
  if (isOle2) {
    if (bytesContainUtf16(bytes, 'EncryptedPackage', 1 << 16)) {
      return 'This workbook is password-protected, so its contents are '
           + 'encrypted and cannot be read here. Open it in Excel, save a copy '
           + 'without a password (File → Info → Protect Workbook → Encrypt '
           + 'with Password, then clear it), and convert that copy.';
    }
    return 'This is an Excel 97-2003 workbook (.xls) in an older format'
         + (ext === 'xlsx' ? ', despite the .xlsx name' : '')
         + '. Open it in Excel or LibreOffice and use Save As → Excel Workbook '
         + '(.xlsx), then convert that file.';
  }

  /* ZIP — every modern Office format is one, so the question is which. */
  const isZip = bytes[0] === 0x50 && bytes[1] === 0x4B;
  if (isZip) {
    const head = 1 << 18;   // member names live near the front
    if (bytesContain(bytes, 'xl/workbook.xml', head)) return null;   // really is a workbook
    if (bytesContain(bytes, 'word/document.xml', head)) {
      return 'This is a Word document (.docx), not a spreadsheet. Try the '
           + 'Word to PDF tool instead.';
    }
    if (bytesContain(bytes, 'ppt/presentation.xml', head)) {
      return 'This is a PowerPoint file (.pptx), not a spreadsheet. Try the '
           + 'PowerPoint to PDF tool instead.';
    }
    if (bytesContain(bytes, 'opendocument.spreadsheet', head)) {
      return 'This is an OpenDocument spreadsheet (.ods). Open it in Excel or '
           + 'LibreOffice and save as .xlsx, then convert that file.';
    }
    return 'This file is a ZIP archive but does not contain a workbook inside '
         + 'it. If it is a folder of spreadsheets, extract it first and convert '
         + 'one file at a time.';
  }

  /* A PDF renamed to .xlsx is a surprisingly common mix-up. */
  if (bytesContain(bytes, '%PDF-', 8)) {
    return 'This is a PDF, not a spreadsheet. Try the PDF to Excel tool instead.';
  }

  return null;
}
