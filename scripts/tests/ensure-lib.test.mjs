/**
 * ensureLib — the guard that stops a missing CDN library being reported as a
 * broken file.
 *
 * Driven against a fake document so the interesting paths (first CDN dead,
 * both dead, script loads but defines nothing) can be exercised without a
 * network. The behaviour that matters most is the last one: a 200 response
 * that is not the library must count as a failure, because a captive portal
 * or an interception proxy answers 200 for everything.
 */
import { ensureLib, LibraryUnavailableError, libraryUnavailableMessage, LIB_SOURCES }
  from '../../src/scripts/ensure-lib.js';

let passed = 0, failed = 0;
function check(label, cond, detail = '') {
  if (cond) { passed++; console.log('  ok   ' + label); }
  else { failed++; console.log('  FAIL ' + label + (detail ? '  — ' + detail : '')); }
}

/** A document whose script tags succeed or fail according to `behaviour`. */
function fakeEnv(behaviour) {
  const win = {};
  const attempted = [];
  const doc = {
    head: { appendChild(el) { setTimeout(() => el.__run(), 0); } },
    createElement() {
      const el = {};
      Object.defineProperty(el, 'src', {
        set(v) { el.__url = v; attempted.push(v); },
        get() { return el.__url; },
      });
      el.__run = () => {
        const what = behaviour(el.__url, win);
        if (what === 'load') el.onload();
        else if (what === 'error') el.onerror();
        /* 'hang' — never settles, so the timeout has to do the work */
      };
      return el;
    },
  };
  return { win, doc, attempted };
}

console.log('\nensure-lib\n');

/* --- already present -------------------------------------------------- */
{
  const { win, doc, attempted } = fakeEnv(() => 'load');
  win.XLSX = { marker: 1 };
  const got = await ensureLib('XLSX', ['http://a/1.js'], { win, doc });
  check('a library already on the page is returned without a fetch',
        got.marker === 1 && attempted.length === 0);
}

/* --- first source works ----------------------------------------------- */
{
  const { win, doc, attempted } = fakeEnv((url, w) => { w.LibA = { url }; return 'load'; });
  const got = await ensureLib('LibA', ['http://a/1.js', 'http://b/1.js'], { win, doc });
  check('the first working source is used and the second is not tried',
        got.url === 'http://a/1.js' && attempted.length === 1);
}

/* --- first source dead, second works ---------------------------------- */
{
  const { win, doc, attempted } = fakeEnv((url, w) => {
    if (url.includes('//a/')) return 'error';
    w.LibB = { url }; return 'load';
  });
  const got = await ensureLib('LibB', ['http://a/1.js', 'http://b/1.js'], { win, doc });
  check('a dead first CDN falls through to the second',
        got.url === 'http://b/1.js' && attempted.length === 2, JSON.stringify(attempted));
}

/* --- a 200 that is not the library ------------------------------------ */
{
  const { win, doc, attempted } = fakeEnv((url, w) => {
    if (url.includes('//a/')) return 'load';        // loads, defines nothing
    w.LibC = { url }; return 'load';
  });
  const got = await ensureLib('LibC', ['http://a/1.js', 'http://b/1.js'], { win, doc });
  check('a script that loads but defines nothing is not mistaken for success',
        got.url === 'http://b/1.js' && attempted.length === 2);
}

/* --- everything dead --------------------------------------------------- */
{
  const { win, doc } = fakeEnv(() => 'error');
  let err = null;
  try { await ensureLib('LibD', ['http://a/1.js', 'http://b/1.js'], { win, doc }); }
  catch (e) { err = e; }
  check('every source failing raises LibraryUnavailableError',
        err instanceof LibraryUnavailableError && err.globalName === 'LibD');
}

/* --- a hanging source is bounded by the timeout ------------------------ */
{
  const { win, doc } = fakeEnv((url, w) => {
    if (url.includes('//a/')) return 'hang';
    w.LibE = { url }; return 'load';
  });
  const started = Date.now();
  const got = await ensureLib('LibE', ['http://a/1.js', 'http://b/1.js'], { win, doc, timeoutMs: 40 });
  check('a source that never answers times out and the next one is tried',
        got.url === 'http://b/1.js' && Date.now() - started < 2000);
}

/* --- concurrent callers share one attempt ------------------------------ */
{
  const { win, doc, attempted } = fakeEnv((url, w) => { w.LibF = { url }; return 'load'; });
  const [a, b] = await Promise.all([
    ensureLib('LibF', ['http://a/1.js'], { win, doc }),
    ensureLib('LibF', ['http://a/1.js'], { win, doc }),
  ]);
  check('two callers at once cause one injection, not two',
        a === b && attempted.length === 1, 'attempts: ' + attempted.length);
}

/* --- a failure may be retried later ------------------------------------ */
{
  let online = false;
  const { win, doc } = fakeEnv((url, w) => {
    if (!online) return 'error';
    w.LibG = { url }; return 'load';
  });
  let first = null;
  try { await ensureLib('LibG', ['http://a/1.js'], { win, doc }); } catch (e) { first = e; }
  online = true;
  const second = await ensureLib('LibG', ['http://a/1.js'], { win, doc });
  check('a retry after a failure is allowed to succeed',
        first instanceof LibraryUnavailableError && !!second);
}

/* --- the message ------------------------------------------------------- */
{
  const msg = libraryUnavailableMessage('spreadsheet engine');
  check('the message names the real cause, not the file',
        /not a problem with your file/i.test(msg) && /blocker/i.test(msg));
  check('…and does not tell the reader their file is invalid',
        !/invalid|corrupt/i.test(msg));
}

/* --- the pinned sources ------------------------------------------------ */
check('every known library has a fallback on a different host',
      Object.values(LIB_SOURCES).every((urls) => {
        const host = (u) => u.split('/')[2];
        return urls.length >= 2 && new Set(urls.map(host)).size >= 2;
      }));

console.log(`\n  ${passed} passed, ${failed} failed\n`);
process.exit(failed ? 1 : 0);
