/**
 * Repair a tool page's CDN libraries before anyone tries to use one.
 *
 * The per-tool guard in `ensure-lib.js` fixes a library at the moment of use,
 * which is correct but late: it only runs once a reader has already picked a
 * file, so the first thing they experience is a wait. This runs as soon as the
 * page's own module script does — which, because module scripts are deferred,
 * is immediately after the parser-blocking `<script is:inline src="…">` tags
 * have either succeeded or failed.
 *
 * It asks one question per script tag on the page: *you loaded this, did it
 * actually define anything?* If not, the fallback CDN is fetched right away,
 * usually finishing long before a file is chosen. A reader on a blocked
 * network then never sees a failure at all.
 *
 * This deliberately takes no view on which tool it is running under. It reads
 * the script tags that are really in the document, so a component that gains
 * or loses a library needs no change here.
 */
import { LIB_SOURCES, ensureLib, libPresent } from './ensure-lib.js';

/**
 * Which library is this script tag?
 *
 * Matched on the URL's filename rather than the whole string, so a version
 * bump or a switch between hosts in a component does not silently stop the
 * page being repaired — the failure mode of exact-URL matching would be
 * invisible, since an unrecognised tag simply gets skipped.
 */
function keyForScript(src) {
  for (const [key, spec] of Object.entries(LIB_SOURCES)) {
    for (const url of spec.urls) {
      const file = url.split('/').pop();
      if (src.endsWith(file)) return key;
    }
  }
  return null;
}

/** Every library this page declares, in the order the tags appear. */
export function declaredLibraries(doc) {
  const keys = [];
  const tags = doc.querySelectorAll('script[src]');
  for (const tag of tags) {
    const key = keyForScript(tag.getAttribute('src') || '');
    if (key && !keys.includes(key)) keys.push(key);
  }
  return keys;
}

/**
 * Reload whatever did not survive. Resolves to the list that could not be
 * recovered, which is empty on a healthy page.
 *
 * Never rejects: a page that cannot repair itself must still be usable for
 * whatever does not need the missing piece — on `/excel-to-pdf/` the CSV path
 * keeps working even when the spreadsheet engine is unreachable.
 */
export async function recoverPageLibraries(opts = {}) {
  const doc = opts.doc || (typeof document !== 'undefined' ? document : null);
  const win = opts.win || (typeof window !== 'undefined' ? window : null);
  if (!doc || !win) return [];

  const missing = declaredLibraries(doc).filter((key) => !libPresent(key, win));
  if (!missing.length) return [];

  const failed = [];
  await Promise.all(missing.map(async (key) => {
    try { await ensureLib(key, undefined, { win, doc, timeoutMs: opts.timeoutMs }); }
    catch { failed.push(key); }
  }));
  return failed;
}

/**
 * Hold the controls shut while a repair is in progress.
 *
 * Repair takes a few hundred milliseconds, and a reader who drops a file into
 * the page during that window would hit exactly the failure this is meant to
 * prevent. Rather than teach two dozen components to await something, the
 * inputs are disabled until the libraries are back.
 *
 * This runs **only on a page that is already broken**. A healthy page finds
 * nothing missing and returns before any of this, so the ordinary path is
 * untouched — which is also why it cannot regress the fidelity sweep.
 *
 * Returns a function that puts back exactly what it disabled, and nothing it
 * did not: a control the component had disabled for its own reasons must stay
 * that way.
 */
function holdControls(doc) {
  const touched = [];
  const controls = doc.querySelectorAll('input[type="file"], button');
  for (const el of controls) {
    if (el.disabled) continue;
    el.disabled = true;
    /* Marked so a test can tell *this* apart from a control the component
       disabled for its own reasons — a merge tool's button starts disabled
       until files are queued, and counting those made a healthy page look
       like a page being repaired. */
    if (el.setAttribute) el.setAttribute('data-lib-held', '');
    touched.push(el);
  }

  const notice = doc.createElement('div');
  notice.setAttribute('role', 'status');
  notice.setAttribute('data-lib-recovery', '');
  notice.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);'
    + 'z-index:9999;padding:10px 18px;border-radius:999px;font:500 14px/1.4 system-ui,sans-serif;'
    + 'background:#1f2937;color:#fff;box-shadow:0 4px 16px rgba(0,0,0,.25);max-width:90vw;';
  notice.textContent = 'Finishing loading the tools…';
  (doc.body || doc.documentElement).appendChild(notice);

  return (failedKeys) => {
    for (const el of touched) {
      el.disabled = false;
      if (el.removeAttribute) el.removeAttribute('data-lib-held');
    }
    if (!failedKeys || !failedKeys.length) { notice.remove(); return; }
    /* Leave the notice up when the repair did not work. The controls go back
       on regardless — a tool whose other paths still function (CSV, on a page
       whose spreadsheet engine is gone) must not be locked out. */
    notice.textContent = 'Some tools could not finish loading. Check your connection '
      + 'or an ad blocker, then reload.';
    notice.style.background = '#7f1d1d';
  };
}

/**
 * Start the repair and publish a promise tools can wait on.
 *
 * Exposed on `window` rather than exported alone because the tools' own
 * scripts are separate bundles — each component imports what it needs, and a
 * shared module instance is not guaranteed across them.
 */
export function startLibraryRecovery(opts = {}) {
  const win = opts.win || (typeof window !== 'undefined' ? window : null);
  const doc = opts.doc || (typeof document !== 'undefined' ? document : null);
  if (!win || !doc) return Promise.resolve([]);

  /* Published for the same reason as `__libsReady`: a component's script is a
     separate bundle, and an `is:inline` one cannot import at all. A tool that
     fetches its library on first use rather than declaring a script tag — the
     HEIC decoder is the only one — has no other way to reach the fallback
     list, and hand-rolling a second loader there is how it ended up with no
     fallback in the first place. */
  win.__ensureLib = ensureLib;

  if (win.__libsReady) return win.__libsReady;

  const missing = declaredLibraries(doc).filter((key) => !libPresent(key, win));
  if (!missing.length) {
    const done = Promise.resolve([]);
    win.__libsReady = done;
    return done;
  }

  const release = opts.quiet ? () => {} : holdControls(doc);
  const p = recoverPageLibraries(opts).then((failedKeys) => {
    release(failedKeys);
    return failedKeys;
  });
  win.__libsReady = p;
  return p;
}
