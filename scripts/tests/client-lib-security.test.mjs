/**
 * Can a file a reader opens run code in our origin?
 *
 * Every converter here is client-side, which removes a server to attack and
 * replaces it with a different exposure: the parsers run in the reader's tab,
 * on a document the reader was invited to open, inside an origin that is
 * holding their other files in memory. A parser bug is therefore not a
 * theoretical CVE row — it is the exact failure the site's promise rules out.
 *
 * Two of the shipped libraries have known advisories, and both are closed in
 * ways a future edit could undo without anything looking wrong:
 *
 *   pdf.js 3.4.120 — CVE-2024-4367 (CVSS 8.8). A crafted PDF executes
 *   arbitrary JavaScript in this origin unless `isEvalSupported: false` is
 *   passed. Nothing about a `getDocument()` call that omits it looks unusual,
 *   and the page works perfectly, so a new PDF tool would reintroduce it
 *   silently. Checked below at every call site.
 *
 *   xlsx — npm's copy is frozen at 0.18.5 (CVE-2023-30533 prototype
 *   pollution, CVE-2024-22363 ReDoS) and no npm mirror will ever carry a fix,
 *   because SheetJS publishes elsewhere now. The hazard is that jsdelivr and
 *   cdnjs still answer 200 for the old URL, so pasting a familiar-looking CDN
 *   line is a downgrade that no build step would reject. Checked below as an
 *   absence: that URL shape must not reappear.
 *
 * Also checked: the invariant `ensure-lib.js` states in prose but nothing
 * enforced — that a component's `is:inline` version matches LIB_SOURCES. A
 * mismatch loads two builds of one library into a page, and whichever wins is
 * a race.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { LIB_SOURCES } from '../../src/scripts/ensure-lib.js';

const ROOTS = ['src/components', 'src/components/tools'];

function componentFiles() {
  const out = [];
  for (const dir of ROOTS) {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.isFile() && e.name.endsWith('.astro')) out.push(join(dir, e.name));
    }
  }
  return out;
}

/**
 * The argument list of each `getDocument(` call, balanced-paren scanned.
 *
 * A regex stops at the first `)`, which lands mid-call on every one of these
 * — `getDocument({ data: new Uint8Array(e.target.result) })` closes an inner
 * paren first. A check that reads only part of the arguments would pass a
 * call whose second half is wrong.
 */
function getDocumentCalls(src) {
  const calls = [];
  const needle = 'getDocument(';
  let i = src.indexOf(needle);
  while (i !== -1) {
    let depth = 0;
    let j = i + needle.length - 1;
    for (; j < src.length; j++) {
      if (src[j] === '(') depth++;
      else if (src[j] === ')') { depth--; if (depth === 0) break; }
    }
    calls.push(src.slice(i + needle.length, j));
    i = src.indexOf(needle, j);
  }
  return calls;
}

test('every pdf.js getDocument() disables eval (CVE-2024-4367)', () => {
  const offenders = [];
  let checked = 0;
  for (const f of componentFiles()) {
    const src = readFileSync(f, 'utf8');
    for (const args of getDocumentCalls(src)) {
      checked++;
      if (!/isEvalSupported\s*:\s*false/.test(args)) {
        offenders.push(`${f}: getDocument(${args.slice(0, 60)}…`);
      }
    }
  }
  /* If this ever reads zero, the scanner broke rather than the risk going
     away — a passing run that inspected nothing is the failure mode this
     whole file exists to avoid. */
  assert.ok(checked > 0, 'found no getDocument() calls at all — scanner is broken');
  assert.deepEqual(offenders, [],
    `getDocument() without isEvalSupported:false lets a crafted PDF run JS in our origin:\n  ${offenders.join('\n  ')}`);
});

test('no npm-hosted xlsx: it is frozen at a vulnerable 0.18.5', () => {
  const offenders = [];
  const files = [...componentFiles(), 'src/scripts/ensure-lib.js'];
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    for (const m of src.matchAll(/https?:\/\/[^"'\s]*xlsx[^"'\s]*\.js/gi)) {
      const url = m[0];
      if (!url.startsWith('https://cdn.sheetjs.com/')) offenders.push(`${f}: ${url}`);
    }
  }
  assert.deepEqual(offenders, [],
    `xlsx must come from cdn.sheetjs.com — npm mirrors only ever serve 0.18.5 (CVE-2023-30533, CVE-2024-22363):\n  ${offenders.join('\n  ')}`);
});

test('the self-hosted xlsx fallback exists and is the patched build', () => {
  const vendored = 'public/vendor/xlsx.full.min.js';
  assert.ok(existsSync(vendored), `${vendored} is the XLSX fallback and is missing`);
  /* Guards the plausible accident of committing a stub or an LFS pointer. */
  assert.ok(statSync(vendored).size > 500_000, `${vendored} is too small to be the real library`);

  const pinned = LIB_SOURCES.XLSX.urls[0];
  const version = pinned.match(/xlsx-(\d+\.\d+\.\d+)/)?.[1];
  assert.ok(version, `could not read a version out of the pinned URL: ${pinned}`);
  assert.notEqual(version, '0.18.5', 'pinned to the vulnerable release');

  const src = readFileSync(vendored, 'utf8');
  assert.ok(src.includes(version),
    `${vendored} does not report ${version} — the vendored copy and the pinned CDN release have drifted`);
});

test('component <script> versions match LIB_SOURCES', () => {
  /* `ensure-lib.js` asks for this in prose. Prose does not fail a build. */
  const pinned = new Map();
  for (const spec of Object.values(LIB_SOURCES)) {
    for (const url of spec.urls) {
      const file = url.split('/').pop();
      if (file) pinned.set(file, (pinned.get(file) || new Set()).add(url));
    }
  }

  const offenders = [];
  for (const f of componentFiles()) {
    const src = readFileSync(f, 'utf8');
    for (const m of src.matchAll(/https:\/\/[^"'\s]+\.js/g)) {
      const url = m[0];
      const file = url.split('/').pop();
      const known = pinned.get(file);
      /* Only libraries ensure-lib knows about; a component may legitimately
         reference a URL that is not a recoverable library (a worker, say),
         and those are covered by the worker check below. */
      if (known && !known.has(url)) {
        offenders.push(`${f}: ${url} is not one of the pinned sources for ${file}`);
      }
    }
  }
  assert.deepEqual(offenders, [],
    `a component loads a different build than ensure-lib would recover:\n  ${offenders.join('\n  ')}`);
});

test('no component hand-rolls a loader for a library that has a fallback', () => {
  /* Both lazily-loaded libraries shipped this way: a `document.createElement
     ('script')` with one hardcoded URL and an onerror that gives up. It reads
     like ordinary lazy-loading, and it is invisible to `lib-bootstrap`, which
     can only repair script tags that exist in the document at load — so
     `/heic-to-jpg/` and the bank tools' Excel path sat outside the whole
     CDN-resilience effort while every check was green. The rule is that a
     library with an entry in LIB_SOURCES is requested through `ensureLib`. */
  const known = new Set();
  for (const spec of Object.values(LIB_SOURCES)) {
    for (const url of spec.urls) {
      const file = url.split('/').pop();
      if (file) known.add(file);
    }
  }

  const offenders = [];
  for (const f of componentFiles()) {
    const src = readFileSync(f, 'utf8');
    for (const m of src.matchAll(/\.src\s*=\s*['"]([^'"]+)['"]/g)) {
      const file = m[1].split('/').pop();
      if (known.has(file)) offenders.push(`${f}: assigns .src = ${m[1]}`);
    }
  }
  assert.deepEqual(offenders, [],
    `load these through ensureLib() so they get their fallback host:\n  ${offenders.join('\n  ')}`);
});

test('the pdf.js worker matches the pdf.js build', () => {
  /* A worker from a different release than the main script is a silent
     version split: the API surface is negotiated across that boundary. */
  const pdfUrls = LIB_SOURCES.pdfjsLib.urls;
  const version = pdfUrls[0].match(/pdf\.js\/(\d+\.\d+\.\d+)\//)?.[1];
  assert.ok(version, `could not read a version out of ${pdfUrls[0]}`);

  const offenders = [];
  for (const f of componentFiles()) {
    const src = readFileSync(f, 'utf8');
    for (const m of src.matchAll(/workerSrc\s*=\s*['"]([^'"]+)['"]/g)) {
      if (!m[1].includes(version)) offenders.push(`${f}: worker ${m[1]} vs pdf.js ${version}`);
    }
  }
  assert.deepEqual(offenders, [], `worker/library version split:\n  ${offenders.join('\n  ')}`);
});
