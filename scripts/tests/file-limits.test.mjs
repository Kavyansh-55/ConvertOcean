/**
 * The size limit a tool shows must be the size limit it keeps.
 *
 * Twenty-six components printed "Max NN MB" in their drop zone and six checked
 * it. The number was decoration on the other twenty: hand one a file ten times
 * that size and it would try, exhaust the tab's memory and freeze — no
 * message, and worst on a phone.
 *
 * The interesting half of this file is the last test. Checking that the guards
 * work is easy; what actually stops the bug coming back is asserting that
 * **every component displaying a limit also enforces that same number**, read
 * out of the source. A tool added next year with a drop zone reading
 * "Max 40MB" and no check fails here, which is how it should be found.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileTooLarge, anyFileTooLarge, formatSize, MB }
  from '../../src/scripts/file-limits.js';

const TOOLS = join(process.cwd(), 'src', 'components', 'tools');

let passed = 0, failed = 0;
function check(label, cond, detail = '') {
  if (cond) { passed++; console.log('  ok   ' + label); }
  else { failed++; console.log('  FAIL ' + label + (detail ? '  — ' + detail : '')); }
}

console.log('\nfile size limits\n');

/* --- the check itself ---------------------------------------------------- */
check('a file under the limit passes',
      fileTooLarge({ name: 'a.pdf', size: 4 * MB }, 25) === null);
check('a file exactly at the limit passes',
      fileTooLarge({ name: 'a.pdf', size: 25 * MB }, 25) === null);
check('a file one byte over is refused',
      typeof fileTooLarge({ name: 'a.pdf', size: 25 * MB + 1 }, 25) === 'string');
check('the message names the file',
      fileTooLarge({ name: 'report.pdf', size: 99 * MB }, 25).includes('"report.pdf"'));
check('…and its actual size',
      fileTooLarge({ name: 'r.pdf', size: 99 * MB }, 25).includes('99 MB'));
check('…and the limit it broke',
      fileTooLarge({ name: 'r.pdf', size: 99 * MB }, 25).includes('25MB'));
check('…and says nothing was sent anywhere',
      /nothing was sent anywhere/i.test(fileTooLarge({ name: 'r.pdf', size: 99 * MB }, 25)));
check('…and explains why the limit exists rather than just asserting it',
      /browser tab|memory/i.test(fileTooLarge({ name: 'r.pdf', size: 99 * MB }, 25)));
check('a missing file is not an error',
      fileTooLarge(null, 25) === null);
check('a file with no size is not an error',
      fileTooLarge({ name: 'x' }, 25) === null);

/* --- the multi-file form ------------------------------------------------- */
check('a set of small files passes',
      anyFileTooLarge([{ name: 'a', size: 1 * MB }, { name: 'b', size: 2 * MB }], 25) === null);
check('one oversized file in a set is caught',
      typeof anyFileTooLarge(
        [{ name: 'a', size: 1 * MB }, { name: 'huge.pdf', size: 80 * MB }], 25) === 'string');
check('…and it is named, not just counted',
      anyFileTooLarge(
        [{ name: 'a', size: 1 * MB }, { name: 'huge.pdf', size: 80 * MB }], 25)
        .includes('huge.pdf'));
check('an empty set is not an error', anyFileTooLarge([], 25) === null);

/* --- sizes as a reader would read them ----------------------------------- */
check('bytes stay bytes', formatSize(512) === '512 bytes');
check('kilobytes round to whole numbers', formatSize(4096) === '4 KB');
check('small megabytes keep a decimal', formatSize(Math.round(4.2 * MB)) === '4.2 MB');
check('large megabytes drop it', formatSize(99 * MB) === '99 MB');

/* --- what the site actually ships ---------------------------------------- */
const components = readdirSync(TOOLS).filter((f) => f.endsWith('.astro'));
const claims = [];
for (const file of components) {
  const src = readFileSync(join(TOOLS, file), 'utf8');
  const shown = src.match(/Max\s+(\d+)\s?MB/i);
  if (!shown) continue;
  const limitMb = Number(shown[1]);
  /* Enforcement counts if the component either uses the shared helper or
     compares .size against that same number of megabytes. */
  /* Both spellings count: module scripts import `fileTooLarge` directly,
     while is:inline ones call the `window.coFileTooLarge` published by
     [tool].astro, since Astro does not process them and they cannot import. */
  const usesHelper = /\b(co)?(Any)?[Ff]ileTooLarge\b/.test(src);
  const inlineGuard = new RegExp('\\b' + limitMb + '\\s*\\*\\s*1024\\s*\\*\\s*1024').test(src);
  claims.push({ file, limitMb, enforced: usesHelper || inlineGuard, usesHelper });
}

check('every tool component that shows a limit was found',
      claims.length >= 26, claims.length + ' found');

const unenforced = claims.filter((c) => !c.enforced).map((c) => c.file.replace('.astro', ''));
check('every displayed limit is actually enforced',
      unenforced.length === 0,
      unenforced.length ? unenforced.length + ' not enforced: ' + unenforced.join(', ') : '');

/* A component enforcing a *different* number than it prints is the subtler
   version of the same bug, and reads as a broken promise either way. */
const mismatched = [];
for (const c of claims) {
  if (c.usesHelper) continue;                      // helper is called with the shown value
  const guards = [...readFileSync(join(TOOLS, c.file), 'utf8')
    .matchAll(/(\d+)\s*\*\s*1024\s*\*\s*1024/g)].map((m) => Number(m[1]));
  if (guards.length && !guards.includes(c.limitMb)) {
    mismatched.push(c.file.replace('.astro', '') + ' shows ' + c.limitMb + ' guards ' + guards.join('/'));
  }
}
check('no tool enforces a different number than it displays',
      mismatched.length === 0, mismatched.join('; '));

/* A guard that refuses the file and then calls an error function the component
   does not have fails silently — the file is rejected and the reader is told
   nothing, which looks exactly like the tool ignoring them. PptxTool names its
   reporter `showErr`, not `showError`, and the first wiring pass called the
   wrong one: the check ran, the return happened, and the page sat there. */
const brokenReporters = [];
for (const c of claims) {
  const src = readFileSync(join(TOOLS, c.file), 'utf8');
  const call = src.match(/if \(tooLarge\) \{ (\w+)\(tooLarge\)/);
  if (!call) continue;
  const reporter = call[1];
  const defined = new RegExp('function\\s+' + reporter + '\\s*\\(').test(src)
               || new RegExp('(const|let|var)\\s+' + reporter + '\\s*=').test(src);
  if (!defined) brokenReporters.push(c.file.replace('.astro', '') + ' calls ' + reporter + '()');
}
check('every size guard reports through a function that exists',
      brokenReporters.length === 0, brokenReporters.join('; '));

console.log('\n  ' + passed + ' passed, ' + failed + ' failed\n');
process.exit(failed ? 1 : 0);
