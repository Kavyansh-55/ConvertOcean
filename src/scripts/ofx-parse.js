/**
 * Parse OFX / QFX / QBO bank files into plain transaction rows.
 *
 * WHY THIS IS HAND-WRITTEN AND NOT `DOMParser`
 * --------------------------------------------
 * Three properties of real bank files each break a strict XML parser, and all
 * three are common enough that any one of them would make the tool useless:
 *
 *   1. OFX 1.x is SGML, not XML. `<TRNAMT>-42.50` has no closing tag — that is
 *      valid and it is what most banks still emit today (VERSION:102).
 *   2. Payee names contain raw ampersands. "AT&T", "BARNES & NOBLE" and
 *      "H&M" are not escaped by many institutions, which is malformed XML.
 *   3. OFX 2.x *is* valid XML. Rather than keep two parsers that can disagree,
 *      one tolerant walker reads both — closing tags are simply honoured when
 *      they are present.
 *
 * DELIBERATE NON-BEHAVIOUR: dates are never shifted into a local timezone.
 * `20260101120000[-5:EST]` is reported as 2026-01-01, full stop. Converting to
 * the reader's zone is how a January 1 transaction lands in the previous year
 * and silently moves between tax periods. The file states a posted date; we
 * report the date the file states.
 */

/**
 * Container tags. Anything not listed here is treated as a leaf, which is what
 * lets `<CHECKNUM>` with an empty value close itself when the next tag opens
 * instead of swallowing its siblings as children.
 */
const AGGREGATES = new Set([
  'OFX',
  'SIGNONMSGSRSV1', 'SONRS', 'STATUS', 'FI',
  'BANKMSGSRSV1', 'STMTTRNRS', 'STMTRS', 'BANKACCTFROM', 'BANKACCTTO',
  'CREDITCARDMSGSRSV1', 'CCSTMTTRNRS', 'CCSTMTRS', 'CCACCTFROM', 'CCACCTTO',
  'INVSTMTMSGSRSV1', 'INVSTMTTRNRS', 'INVSTMTRS', 'INVACCTFROM',
  'BANKTRANLIST', 'STMTTRN', 'PAYEE',
  'LEDGERBAL', 'AVAILBAL', 'CURRENCY', 'ORIGCURRENCY',
  'INVTRANLIST', 'INVBANKTRAN', 'INVTRAN', 'SECID',
  'BUYSTOCK', 'SELLSTOCK', 'BUYMF', 'SELLMF', 'BUYDEBT', 'SELLDEBT',
  'BUYOPT', 'SELLOPT', 'BUYOTHER', 'SELLOTHER',
  'INVBUY', 'INVSELL', 'INCOME', 'REINVEST', 'TRANSFER', 'INVEXPENSE',
  'MARGININTEREST', 'CLOSUREOPT', 'JRNLFUND', 'JRNLSEC', 'SPLIT'
]);

/** Investment transaction wrappers we can see but cannot express as a bank row. */
const INVESTMENT_TRANSACTIONS = new Set([
  'BUYSTOCK', 'SELLSTOCK', 'BUYMF', 'SELLMF', 'BUYDEBT', 'SELLDEBT',
  'BUYOPT', 'SELLOPT', 'BUYOTHER', 'SELLOTHER', 'INCOME', 'REINVEST',
  'TRANSFER', 'INVEXPENSE', 'MARGININTEREST', 'CLOSUREOPT',
  'JRNLFUND', 'JRNLSEC', 'SPLIT'
]);

const NAMED_ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' '
};

/**
 * Decode SGML/XML entities. Unknown sequences are left exactly as written, so a
 * payee of "AT&T" survives (there is no `&T;` to decode) rather than being
 * mangled by a greedy replace.
 */
function decodeEntities(s) {
  if (s.indexOf('&') === -1) return s;
  return s.replace(/&(#[0-9]+|#x[0-9a-fA-F]+|[a-zA-Z]+);/g, (whole, body) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' || body[1] === 'X'
        ? parseInt(body.slice(2), 16)
        : parseInt(body.slice(1), 10);
      if (!isFinite(code) || code <= 0 || code > 0x10ffff) return whole;
      try { return String.fromCodePoint(code); } catch (e) { return whole; }
    }
    const named = NAMED_ENTITIES[body.toLowerCase()];
    return named === undefined ? whole : named;
  });
}

/** SGML leaf values carry the trailing newline and the next line's indent. */
function clean(s) {
  return decodeEntities(String(s == null ? '' : s)).replace(/\s+/g, ' ').trim();
}

function tagNameOf(raw) {
  return raw.trim().split(/[\s/]/)[0].toUpperCase();
}

/**
 * Walk the markup, emitting open/close/text events. Tolerant by design: a `<`
 * that cannot begin a tag is treated as text, so `<MEMO>a < b` does not eat the
 * rest of the document.
 */
function walk(body, onOpen, onClose, onText) {
  let i = 0;
  const n = body.length;

  while (i < n) {
    const lt = body.indexOf('<', i);
    if (lt === -1) { onText(body.slice(i)); break; }
    if (lt > i) onText(body.slice(i, lt));

    const next = body[lt + 1];
    if (next === undefined || !/[A-Za-z/!?]/.test(next)) {
      onText('<');
      i = lt + 1;
      continue;
    }

    if (body.startsWith('<!--', lt)) {
      const end = body.indexOf('-->', lt + 4);
      i = end === -1 ? n : end + 3;
      continue;
    }
    if (body.startsWith('<![CDATA[', lt)) {
      const end = body.indexOf(']]>', lt + 9);
      onText(body.slice(lt + 9, end === -1 ? n : end));
      i = end === -1 ? n : end + 3;
      continue;
    }
    if (body.startsWith('<?', lt) || body.startsWith('<!', lt)) {
      const end = body.indexOf('>', lt);
      i = end === -1 ? n : end + 1;
      continue;
    }

    const gt = body.indexOf('>', lt);
    if (gt === -1) { onText(body.slice(lt)); break; }

    let raw = body.slice(lt + 1, gt).trim();
    if (raw[0] === '/') {
      onClose(tagNameOf(raw.slice(1)));
    } else {
      const selfClosing = raw.endsWith('/');
      if (selfClosing) raw = raw.slice(0, -1);
      onOpen(tagNameOf(raw), selfClosing);
    }
    i = gt + 1;
  }
}

/** Build a node tree that reads SGML and XML identically. */
function buildTree(body) {
  const root = { tag: '#root', children: [], value: '' };
  const stack = [root];
  const top = () => stack[stack.length - 1];

  walk(
    body,
    function onOpen(tag, selfClosing) {
      // Close any leaf still on the stack. A known leaf closes even when empty;
      // an unknown tag closes once it has collected text, which covers vendor
      // extensions such as <INTU.BID> without needing to know them.
      while (stack.length > 1 &&
             (!AGGREGATES.has(top().tag) || top().value.trim() !== '')) {
        stack.pop();
      }
      const node = { tag, children: [], value: '' };
      top().children.push(node);
      if (!selfClosing) stack.push(node);
    },
    function onClose(tag) {
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tag === tag) { stack.length = i; return; }
      }
      // An unmatched close tag is ignored: in SGML the leaves it would have
      // closed are already closed, and guessing would corrupt the tree.
    },
    function onText(t) {
      if (stack.length > 1) top().value += t;
    }
  );

  return root;
}

function childrenNamed(node, tag) {
  const out = [];
  for (const c of node.children) if (c.tag === tag) out.push(c);
  return out;
}

function firstChild(node, tag) {
  for (const c of node.children) if (c.tag === tag) return c;
  return null;
}

function childValue(node, tag) {
  const c = firstChild(node, tag);
  return c ? clean(c.value) : '';
}

function findAll(node, tag, out) {
  out = out || [];
  for (const c of node.children) {
    if (c.tag === tag) out.push(c);
    findAll(c, tag, out);
  }
  return out;
}

/**
 * Parse an OFX timestamp. Time and timezone are extracted for completeness but
 * are never used to move the calendar date — see the note at the top of the file.
 */
export function parseOfxDate(raw) {
  const s = clean(raw);
  const m = /^(\d{4})(\d{2})(\d{2})/.exec(s);
  if (!m) return null;

  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  const t = /^\d{8}(\d{2})(\d{2})(\d{2})/.exec(s);
  const tz = /\[\s*([+-]?\d+(?:\.\d+)?)\s*(?::([^\]]*))?\]/.exec(s);

  return {
    year, month, day,
    iso: m[1] + '-' + m[2] + '-' + m[3],
    time: t ? t[1] + ':' + t[2] + ':' + t[3] : '',
    tzOffset: tz ? tz[1] : '',
    tzName: tz && tz[2] ? tz[2].trim() : ''
  };
}

/**
 * Parse an OFX amount. The spec mandates a plain decimal with `.` and no
 * thousands separator, but files from non-US institutions do arrive with a
 * decimal comma, so both are read without ever guessing wrongly:
 * when both separators are present the LAST one is the decimal point.
 */
export function parseAmount(raw) {
  const original = clean(raw);
  let s = original.replace(/\s| /g, '');
  if (!s) return { raw: original, value: null };

  const negative = s.charAt(0) === '-' || /^\(.*\)$/.test(s);
  s = s.replace(/[()]/g, '').replace(/^[+-]/, '');

  const hasDot = s.indexOf('.') !== -1;
  const hasComma = s.indexOf(',') !== -1;

  if (hasDot && hasComma) {
    if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
      s = s.replace(/\./g, '').replace(',', '.');
    } else {
      s = s.replace(/,/g, '');
    }
  } else if (hasComma) {
    // A comma trailed by one or two digits is a decimal comma ("12,34");
    // anything else is a thousands separator ("1,234").
    s = /,\d{1,2}$/.test(s) ? s.replace(',', '.') : s.replace(/,/g, '');
  }

  if (!/^\d+(\.\d+)?$|^\.\d+$/.test(s)) return { raw: original, value: null };

  const value = parseFloat(s);
  if (!isFinite(value)) return { raw: original, value: null };
  return { raw: original, value: negative ? -value : value };
}

/** Read one STMTTRN aggregate into a flat row. */
function readTransaction(node, account) {
  const payee = firstChild(node, 'PAYEE');
  const name = childValue(node, 'NAME') || (payee ? childValue(payee, 'NAME') : '');
  const amount = parseAmount(childValue(node, 'TRNAMT'));
  const posted = parseOfxDate(childValue(node, 'DTPOSTED'));
  const currencyNode = firstChild(node, 'CURRENCY') || firstChild(node, 'ORIGCURRENCY');

  return {
    type: childValue(node, 'TRNTYPE'),
    datePosted: posted,
    dateUser: parseOfxDate(childValue(node, 'DTUSER')),
    amount: amount.value,
    amountRaw: amount.raw,
    name,
    memo: childValue(node, 'MEMO'),
    checkNumber: childValue(node, 'CHECKNUM'),
    referenceNumber: childValue(node, 'REFNUM'),
    fitid: childValue(node, 'FITID'),
    currency: (currencyNode && childValue(currencyNode, 'CURSYM')) || account.currency || '',
    accountId: account.accountId,
    accountLabel: account.label
  };
}

function readBalance(node, tag) {
  const bal = firstChild(node, tag);
  if (!bal) return null;
  const amount = parseAmount(childValue(bal, 'BALAMT'));
  return { amount: amount.value, amountRaw: amount.raw, asOf: parseOfxDate(childValue(bal, 'DTASOF')) };
}

function accountLabel(kind, acctId, acctType) {
  const tail = acctId ? acctId.slice(-4) : '';
  if (kind === 'creditcard') return 'Credit Card' + (tail ? ' ••••' + tail : '');
  if (kind === 'investment') return 'Investment' + (tail ? ' ••••' + tail : '');
  const type = acctType ? acctType.charAt(0) + acctType.slice(1).toLowerCase() : 'Account';
  return type + (tail ? ' ••••' + tail : '');
}

/**
 * Parse a complete OFX/QFX/QBO document.
 *
 * Returns every account found — not just the first. Files that bundle several
 * accounts are common from credit unions, and a converter that silently keeps
 * only the first one loses data without saying so.
 */
export function parseOfx(text) {
  const source = String(text || '').replace(/^﻿/, '');
  const warnings = [];

  const bodyStart = source.search(/<OFX[\s>]/i);
  if (bodyStart === -1) {
    return {
      ok: false,
      reason: 'not-ofx',
      headers: {},
      accounts: [],
      transactionCount: 0,
      unsupportedInvestmentCount: 0,
      warnings
    };
  }

  const headers = {};
  // OFX 1.x: `KEY:VALUE` lines above the body. OFX 2.x: attributes on the
  // `<?OFX ... ?>` processing instruction. Both are read; both are optional.
  const headerText = source.slice(0, bodyStart);
  const lineRe = /^\s*([A-Za-z][A-Za-z0-9._-]*)\s*:\s*(.*)$/;
  for (const line of headerText.split(/\r?\n/)) {
    const m = lineRe.exec(line);
    if (m) headers[m[1].toUpperCase()] = m[2].trim();
  }
  const piMatch = /<\?OFX\s+([^?]*)\?>/i.exec(headerText);
  if (piMatch) {
    const attrRe = /([A-Za-z][A-Za-z0-9._-]*)\s*=\s*"([^"]*)"/g;
    let a;
    while ((a = attrRe.exec(piMatch[1])) !== null) headers[a[1].toUpperCase()] = a[2];
  }

  const isXml = /^\s*<\?xml/i.test(source) || headers.OFXHEADER === '200';
  const root = buildTree(source.slice(bodyStart));

  const accounts = [];
  let unsupportedInvestmentCount = 0;

  function readStatement(stmt, kind, acctTag) {
    const acct = firstChild(stmt, acctTag);
    const accountId = acct ? childValue(acct, 'ACCTID') : '';
    const acctType = acct ? childValue(acct, 'ACCTTYPE') : '';
    const account = {
      kind,
      accountId,
      accountType: kind === 'creditcard' ? 'CREDITCARD' : acctType,
      routingNumber: acct ? childValue(acct, 'BANKID') : '',
      brokerId: acct ? childValue(acct, 'BROKERID') : '',
      currency: childValue(stmt, 'CURDEF'),
      label: accountLabel(kind, accountId, acctType),
      periodStart: null,
      periodEnd: null,
      ledgerBalance: readBalance(stmt, 'LEDGERBAL'),
      availableBalance: readBalance(stmt, 'AVAILBAL'),
      transactions: []
    };

    const bankList = firstChild(stmt, 'BANKTRANLIST');
    if (bankList) {
      account.periodStart = parseOfxDate(childValue(bankList, 'DTSTART'));
      account.periodEnd = parseOfxDate(childValue(bankList, 'DTEND'));
      for (const trn of childrenNamed(bankList, 'STMTTRN')) {
        account.transactions.push(readTransaction(trn, account));
      }
    }

    // An investment statement carries its cash activity inside INVBANKTRAN;
    // those rows are ordinary bank transactions and are kept. Security trades
    // have a different shape (units, unit price, security id) that cannot
    // honestly be flattened into a bank row, so they are counted and reported
    // rather than dropped in silence.
    const invList = firstChild(stmt, 'INVTRANLIST');
    if (invList) {
      account.periodStart = account.periodStart || parseOfxDate(childValue(invList, 'DTSTART'));
      account.periodEnd = account.periodEnd || parseOfxDate(childValue(invList, 'DTEND'));
      for (const wrapper of childrenNamed(invList, 'INVBANKTRAN')) {
        for (const trn of childrenNamed(wrapper, 'STMTTRN')) {
          account.transactions.push(readTransaction(trn, account));
        }
      }
      for (const child of invList.children) {
        if (INVESTMENT_TRANSACTIONS.has(child.tag)) unsupportedInvestmentCount++;
      }
    }

    for (const trn of account.transactions) {
      if (trn.amount === null) {
        warnings.push('A transaction in ' + account.label + ' had an unreadable amount (' + (trn.amountRaw || 'empty') + ') and was kept with a blank amount.');
      }
      if (!trn.datePosted) {
        warnings.push('A transaction in ' + account.label + ' had no readable posted date.');
      }
    }

    accounts.push(account);
  }

  for (const stmt of findAll(root, 'STMTRS')) readStatement(stmt, 'bank', 'BANKACCTFROM');
  for (const stmt of findAll(root, 'CCSTMTRS')) readStatement(stmt, 'creditcard', 'CCACCTFROM');
  for (const stmt of findAll(root, 'INVSTMTRS')) readStatement(stmt, 'investment', 'INVACCTFROM');

  const transactionCount = accounts.reduce((n, a) => n + a.transactions.length, 0);

  // A signon failure explains an empty file far better than "no transactions".
  const sonrsStatus = findAll(root, 'SONRS')[0];
  if (sonrsStatus && transactionCount === 0) {
    const status = firstChild(sonrsStatus, 'STATUS');
    const code = status ? childValue(status, 'CODE') : '';
    const message = status ? childValue(status, 'MESSAGE') : '';
    if (code && code !== '0') {
      warnings.push('The file reports an error from the bank (status code ' + code + (message ? ': ' + message : '') + ').');
    }
  }

  return {
    ok: true,
    format: isXml ? 'xml' : 'sgml',
    version: headers.VERSION || '',
    isIntuit: Boolean(headers['INTU.BID'] || findAll(root, 'INTU.BID').length),
    headers,
    accounts,
    transactionCount,
    unsupportedInvestmentCount,
    warnings
  };
}

/* ------------------------------------------------------------------------- *
 * Row shaping
 * ------------------------------------------------------------------------- */

const DATE_FORMATS = {
  iso: d => d.iso,
  us: d => pad(d.month) + '/' + pad(d.day) + '/' + d.year,
  uk: d => pad(d.day) + '/' + pad(d.month) + '/' + d.year
};

function pad(n) { return n < 10 ? '0' + n : String(n); }

/**
 * Excel's day-serial number, computed from calendar parts rather than from a
 * `Date` object. Going through `Date` reintroduces exactly the timezone shift
 * this file avoids everywhere else: a serial derived from a local-midnight Date
 * can land on the previous day for anyone west of UTC.
 *
 * Correct for every date from 1900-03-01 onward (Excel's fictional 1900-02-29
 * is before any bank statement that exists).
 */
export function excelSerial(year, month, day) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y +
    Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  return jdn - 2415019;
}

export const LAYOUTS = {
  full: {
    label: 'Full detail',
    columns: ['Date', 'Type', 'Description', 'Memo', 'Amount', 'Check #', 'Currency', 'Account', 'Transaction ID']
  },
  three: {
    label: '3 columns (Date, Description, Amount)',
    columns: ['Date', 'Description', 'Amount']
  },
  four: {
    label: '4 columns (Date, Description, Debit, Credit)',
    columns: ['Date', 'Description', 'Debit', 'Credit']
  }
};

/** Description used by the compact layouts: payee first, memo as the fallback. */
function describe(trn) {
  if (trn.name && trn.memo && trn.memo !== trn.name) return trn.name + ' — ' + trn.memo;
  return trn.name || trn.memo || trn.type || '';
}

/**
 * Flatten parsed accounts into a header row plus data rows.
 *
 * Cells are emitted as typed objects ({kind:'date'|'number'|'text'}) so the CSV
 * and XLSX writers can each render them correctly instead of the XLSX writer
 * having to re-parse strings the CSV writer already formatted.
 */
export function buildRows(parsed, options) {
  const opts = options || {};
  const layout = LAYOUTS[opts.layout] ? opts.layout : 'full';
  const dateFormat = DATE_FORMATS[opts.dateFormat] ? opts.dateFormat : 'iso';
  const formatDate = DATE_FORMATS[dateFormat];

  const columns = LAYOUTS[layout].columns.slice();
  const multiAccount = parsed.accounts.length > 1;

  // The Account column is noise when there is only one account in the file.
  if (layout === 'full' && !multiAccount) {
    const i = columns.indexOf('Account');
    if (i !== -1) columns.splice(i, 1);
  }

  const rows = [];
  for (const account of parsed.accounts) {
    for (const trn of account.transactions) {
      const date = trn.datePosted
        ? { kind: 'date', text: formatDate(trn.datePosted), date: trn.datePosted }
        : { kind: 'text', text: '' };
      const amount = { kind: 'number', text: trn.amount === null ? trn.amountRaw : trn.amount.toFixed(2), value: trn.amount };

      if (layout === 'three') {
        rows.push([date, { kind: 'text', text: describe(trn) }, amount]);
      } else if (layout === 'four') {
        const isDebit = trn.amount !== null && trn.amount < 0;
        const magnitude = trn.amount === null ? null : Math.abs(trn.amount);
        rows.push([
          date,
          { kind: 'text', text: describe(trn) },
          { kind: 'number', text: isDebit && magnitude !== null ? magnitude.toFixed(2) : '', value: isDebit ? magnitude : null },
          { kind: 'number', text: !isDebit && magnitude !== null ? magnitude.toFixed(2) : '', value: !isDebit ? magnitude : null }
        ]);
      } else {
        const row = [
          date,
          { kind: 'text', text: trn.type },
          { kind: 'text', text: trn.name },
          { kind: 'text', text: trn.memo },
          amount,
          { kind: 'text', text: trn.checkNumber },
          { kind: 'text', text: trn.currency }
        ];
        if (multiAccount) row.push({ kind: 'text', text: trn.accountLabel });
        row.push({ kind: 'text', text: trn.fitid });
        rows.push(row);
      }
    }
  }

  return { columns, rows };
}

/**
 * Guard against CSV formula injection (CWE-1236).
 *
 * A transfer memo is text a stranger can choose, and a spreadsheet evaluates a
 * cell beginning `=`, `+`, `@` or a control character as a formula the moment
 * the file is opened. Those characters never legitimately begin a payee name,
 * so they are prefixed with an apostrophe. A leading `-` is deliberately NOT
 * touched: negative amounts start that way and mangling them would be worse
 * than the risk. The XLSX output needs none of this — its cells carry an
 * explicit type, so a string is always a string.
 */
function neutralizeFormula(text) {
  return /^[=+@\t\r]/.test(text) ? "'" + text : text;
}

function csvCell(cell) {
  const text = cell.kind === 'text' ? neutralizeFormula(cell.text) : cell.text;
  if (text === '') return '';
  return /[",\r\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
}

export function toCsv(columns, rows) {
  const lines = [columns.map(c => csvCell({ kind: 'text', text: c })).join(',')];
  for (const row of rows) lines.push(row.map(csvCell).join(','));
  // CRLF per RFC 4180 — Excel on Windows is the overwhelmingly common consumer.
  return lines.join('\r\n') + '\r\n';
}

/** Human-readable summary used for the on-screen result panel. */
export function summarize(parsed) {
  let credits = 0, debits = 0, creditTotal = 0, debitTotal = 0, unreadable = 0;
  for (const account of parsed.accounts) {
    for (const trn of account.transactions) {
      if (trn.amount === null) { unreadable++; continue; }
      if (trn.amount < 0) { debits++; debitTotal += trn.amount; } else { credits++; creditTotal += trn.amount; }
    }
  }
  return {
    accounts: parsed.accounts.length,
    transactions: parsed.transactionCount,
    credits, debits,
    creditTotal: Math.round(creditTotal * 100) / 100,
    debitTotal: Math.round(debitTotal * 100) / 100,
    net: Math.round((creditTotal + debitTotal) * 100) / 100,
    unreadable
  };
}
