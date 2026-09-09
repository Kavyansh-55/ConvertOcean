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
