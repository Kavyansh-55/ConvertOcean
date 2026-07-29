/**
 * Locate the first syntax error in a JSON document, with an exact offset.
 *
 * WHY THIS EXISTS
 * ---------------
 * The formatter validates with the browser's native `JSON.parse()`, which is the
 * right call: if it passes there it parses in production. But `JSON.parse` is a
 * poor *reporter*. V8 emits two different message shapes:
 *
 *   "Expected ',' or '}' after property value in JSON at position 32 (line 5 column 1)"
 *   "Unexpected token ']', ..."\", \"json\"],\n  \"ok\":"... is not valid JSON"
 *
 * Only the first carries a position. The second — which is what you get for a
 * trailing comma in an array, or for an HTML error page returned instead of a
 * JSON response, i.e. two of the most common failures there are — carries no
 * offset at all. Firefox and Safari use different wording again.
 *
 * So we locate the error ourselves with a strict RFC 8259 scan. This runs ONLY
 * after `JSON.parse` has already rejected the input; it never decides validity,
 * so the native engine stays the source of truth and this can only add detail.
 */

const WS = ' \t\n\r';

/** Thrown internally; carries the offset the scan stopped at. */
function ScanError(message, index) {
  this.message = message;
  this.index = index;
}

/**
 * @param {string} src
 * @returns {{index:number, line:number, column:number, message:string,
 *            excerpt:string, caret:string} | null}
 *          null when no fault is found (the scan and the engine disagree, so we
 *          say nothing rather than something wrong).
 */
export function locateJsonError(src) {
  let i = 0;
  const n = src.length;

  const fail = (message, at) => {
    throw new ScanError(message, at === undefined ? i : at);
  };

  const skipWs = () => {
    while (i < n && WS.indexOf(src[i]) !== -1) i++;
  };

  const atEnd = (expected) =>
    fail('The document ends early — ' + expected + ' was expected', n);

  function scanString() {
    // assumes src[i] === '"'
    const open = i;
    i++;
    while (i < n) {
      const c = src[i];
      if (c === '"') { i++; return; }
      if (c === '\\') {
        const esc = src[i + 1];
        if (esc === undefined) atEnd('the closing quote of this string');
        if ('"\\/bfnrt'.indexOf(esc) !== -1) { i += 2; continue; }
        if (esc === 'u') {
          const hex = src.substr(i + 2, 4);
          if (!/^[0-9a-fA-F]{4}$/.test(hex)) {
            fail('A \\u escape needs exactly four hex digits', i);
          }
          i += 6;
          continue;
        }
        fail('\\' + esc + ' is not a valid JSON escape — valid ones are \\" \\\\ \\/ \\b \\f \\n \\r \\t and \\uXXXX', i);
      }
      if (c === '\n' || c === '\r') {
        fail('This string is never closed — a JSON string cannot span lines, use \\n inside it instead', open);
      }
      if (c < ' ') {
        fail('Raw control characters must be escaped inside a JSON string', i);
      }
      i++;
    }
    fail('This string is never closed — the document ends first', open);
  }

  function scanNumber() {
    const start = i;
    if (src[i] === '-') i++;
    if (src[i] === '0') {
      i++;
      if (src[i] >= '0' && src[i] <= '9') {
        fail('Numbers cannot have a leading zero — write ' + src.slice(start).match(/^-?0+(\d*)/)[1] + ' or quote it as a string to keep it', start);
      }
    } else if (src[i] >= '1' && src[i] <= '9') {
      while (src[i] >= '0' && src[i] <= '9') i++;
    } else {
      fail('Expected a digit here', i);
    }
    if (src[i] === '.') {
      i++;
      if (!(src[i] >= '0' && src[i] <= '9')) fail('A decimal point must be followed by at least one digit', i);
      while (src[i] >= '0' && src[i] <= '9') i++;
    }
    if (src[i] === 'e' || src[i] === 'E') {
      i++;
      if (src[i] === '+' || src[i] === '-') i++;
      if (!(src[i] >= '0' && src[i] <= '9')) fail('The exponent needs at least one digit', i);
      while (src[i] >= '0' && src[i] <= '9') i++;
    }
    // 0x1F, 1_000, 1.2.3 all land here
    if (i < n && /[0-9a-zA-Z_.]/.test(src[i])) {
      fail('"' + src.slice(start, i + 1) + '" is not a valid JSON number', i);
    }
  }

  /**
   * A comment can appear anywhere whitespace can, so every "I expected a
   * separator here" path has to consider it before blaming the separator.
   * Otherwise `{"a":1 // note\n}` reports a missing comma, which sends the
   * reader looking at the wrong thing entirely.
   */
  const commentHere = () =>
    src[i] === '/' && (src[i + 1] === '/' || src[i + 1] === '*');

  /** Diagnose a token that is not a legal start-of-value. */
  function badValue() {
    const c = src[i];
    const rest = src.slice(i);

    if (c === "'") return fail("JSON strings must use double quotes, not single quotes");
    if (c === '‘' || c === '’' || c === '“' || c === '”') {
      return fail('These are curly “smart quotes” (often pasted from a word processor) — JSON needs straight double quotes');
    }
    if (c === '<') return fail('This is not JSON — it starts with a tag, which usually means an HTML error page was returned instead of a JSON response');
    if (c === '/' && (src[i + 1] === '/' || src[i + 1] === '*')) return fail('JSON does not allow comments');
    if (/^NaN/.test(rest)) return fail('NaN is not a valid JSON value — use null, or quote it as a string');
    if (/^-?Infinity/.test(rest)) return fail('Infinity is not a valid JSON value — use null, or quote it as a string');
    if (/^undefined/.test(rest)) return fail('undefined is not a valid JSON value — use null, or omit the key');
    if (/^(True|False)\b/.test(rest)) return fail('JSON booleans are lowercase — write ' + rest.slice(0, 5).toLowerCase().replace(/[^a-z]/g, ''));
    if (/^None\b/.test(rest)) return fail("Python's None is not valid JSON — use null");
    if (/^(TRUE|FALSE|NULL)\b/.test(rest)) return fail('JSON keywords are lowercase — write ' + rest.match(/^(TRUE|FALSE|NULL)/)[1].toLowerCase());
    if (/^[+]/.test(rest)) return fail('JSON numbers cannot start with a plus sign');
    if (/^\./.test(rest)) return fail('A JSON number needs a digit before the decimal point — write 0.5, not .5');
    if (/^[A-Za-z_$]/.test(rest)) {
      const word = rest.match(/^[A-Za-z_$][A-Za-z0-9_$]*/)[0];
      return fail('"' + word + '" is not a valid JSON value — text must be wrapped in double quotes');
    }
    return fail('Unexpected character "' + c + '" where a value was expected');
  }

  function scanValue() {
    skipWs();
    if (i >= n) atEnd('a value');
    const c = src[i];
    if (c === '{') return scanObject();
    if (c === '[') return scanArray();
    if (c === '"') return scanString();
    if (c === '-' || (c >= '0' && c <= '9')) return scanNumber();
    if (src.startsWith('true', i)) { i += 4; return; }
    if (src.startsWith('false', i)) { i += 5; return; }
    if (src.startsWith('null', i)) { i += 4; return; }
    return badValue();
  }

  function scanObject() {
    const open = i;
    i++; // {
    skipWs();
    if (i >= n) fail('This object is never closed — the document ends first', open);
    if (src[i] === '}') { i++; return; }
    for (;;) {
      skipWs();
      if (i >= n) fail('This object is never closed — the document ends first', open);
      if (src[i] === '}') {
        fail('Trailing comma — JSON does not allow a comma after the last property', i - 1 >= 0 ? src.lastIndexOf(',', i) : i);
      }
      if (src[i] !== '"') {
        if (/[A-Za-z_$]/.test(src[i])) {
          const word = src.slice(i).match(/^[A-Za-z_$][A-Za-z0-9_$]*/)[0];
          fail('Property names must be in double quotes — write "' + word + '"');
        }
        if (src[i] === "'") fail('Property names must use double quotes, not single quotes');
        badValue();
      }
      scanString();
      skipWs();
      if (i >= n) fail('This object is never closed — the document ends first', open);
      if (src[i] !== ':') {
        if (commentHere()) fail('JSON does not allow comments');
        fail('Expected a colon after the property name');
      }
      i++;
      scanValue();
      skipWs();
      if (i >= n) fail('This object is never closed — the document ends first', open);
      if (src[i] === ',') { i++; continue; }
      if (src[i] === '}') { i++; return; }
      if (commentHere()) fail('JSON does not allow comments');
      fail('Expected a comma before the next property, or a closing brace');
    }
  }

  function scanArray() {
    const open = i;
    i++; // [
    skipWs();
    if (i >= n) fail('This array is never closed — the document ends first', open);
    if (src[i] === ']') { i++; return; }
    for (;;) {
      skipWs();
      if (i < n && src[i] === ']') {
        fail('Trailing comma — JSON does not allow a comma after the last item', src.lastIndexOf(',', i));
      }
      scanValue();
      skipWs();
      if (i >= n) fail('This array is never closed — the document ends first', open);
      if (src[i] === ',') { i++; continue; }
      if (src[i] === ']') { i++; return; }
      if (commentHere()) fail('JSON does not allow comments');
      fail('Expected a comma before the next item, or a closing bracket');
    }
  }

  try {
    if (src.charCodeAt(0) === 0xfeff) {
      return describe(src, 0, 'The file starts with an invisible byte-order mark (BOM). Strip it, or save the file as UTF-8 without BOM');
    }
    skipWs();
    if (i >= n) return describe(src, 0, 'The document is empty');
    scanValue();
    skipWs();
    if (i < n) {
      if (src[i] === '/' && (src[i + 1] === '/' || src[i + 1] === '*')) {
        return describe(src, i, 'JSON does not allow comments');
      }
      return describe(src, i, 'Extra content after the end of the JSON value — a document must contain exactly one top-level value');
    }
    return null; // scan found nothing; stay quiet rather than guess
  } catch (e) {
    if (!(e instanceof ScanError)) return null;
    return describe(src, Math.min(e.index, n), e.message);
  }
}

/** Turn an offset into line/column plus a caret excerpt of that line. */
function describe(src, index, message) {
  const before = src.slice(0, index);
  const line = (before.match(/\n/g) || []).length + 1;
  const lastNl = before.lastIndexOf('\n');
  const column = index - lastNl;

  const lineStart = lastNl + 1;
  let lineEnd = src.indexOf('\n', index);
  if (lineEnd === -1) lineEnd = src.length;
  let text = src.slice(lineStart, lineEnd).replace(/\t/g, ' ');
  let caretCol = column - 1;

  // Keep the excerpt readable for minified one-liners.
  const MAX = 72;
  if (text.length > MAX) {
    const from = Math.max(0, caretCol - Math.floor(MAX / 2));
    const to = Math.min(text.length, from + MAX);
    const head = from > 0 ? '…' : '';
    const tail = to < text.length ? '…' : '';
    caretCol = caretCol - from + head.length;
    text = head + text.slice(from, to) + tail;
  }

  return {
    index,
    line,
    column,
    message,
    excerpt: text,
    caret: ' '.repeat(Math.max(0, caretCol)) + '^'
  };
}
