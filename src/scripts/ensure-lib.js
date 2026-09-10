/**
 * Make sure a CDN-hosted library is really there before a tool leans on it.
 *
 * Every converter on this site pulls its heavy lifting from a CDN with a
 * parser-blocking `<script is:inline src="…">`. That is fine while the request
 * succeeds. When it does not — a network blip, an ad or script blocker, a
 * corporate filter, a CDN having a bad minute — the page still renders, the
 * file picker still works, and the tool fails at the moment of use with
 * whatever its `catch` block happens to say.
 *
 * On `/excel-to-pdf/` that came out as *"Failed to parse the file. Please
 * ensure it is a valid CSV/Excel workbook."* CSV kept working, because the CSV
 * path needs no library at all, so the tool looked like it was rejecting one
 * particular spreadsheet. A reader hit exactly this and reasonably concluded
 * their file was broken. It was not: `XLSX` was `undefined`.
 *
 * So: check the global, and if it is missing, try to fetch the library again —
 * from a second, independent CDN if the first will not answer. Only when every
 * source has failed do we say so, and then we say the true thing rather than
 * blaming the file.
 */

/**
 * Where each library can be found, in the order to try.
 *
 * The second entry is deliberately a *different* provider, not a different
 * path on the same one — the failure being defended against is usually "this
 * host is unreachable from here", which a mirror on the same host does not
 * fix. Versions are pinned and must match the `is:inline` tag in the
 * component, or a page could end up running two different builds.
 */
export const LIB_SOURCES = {
  XLSX: [
    'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  ],
  JSZip: [
    'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
    'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js',
  ],
  jspdf: [
    'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  ],
};

/** Thrown when every source for a library has been tried and none worked. */
export class LibraryUnavailableError extends Error {
  constructor(globalName, message) {
    super(message || (globalName + ' could not be loaded'));
    this.name = 'LibraryUnavailableError';
    this.globalName = globalName;
  }
}

/**
 * What to tell a reader when a library genuinely cannot be reached.
 *
 * Names the real cause and the two things that actually fix it. It does not
 * mention their file, because their file is not the problem.
 */
export function libraryUnavailableMessage(what) {
  return 'The ' + what + ' could not be loaded, so this file cannot be read '
       + 'right now — this is a loading problem on our side, not a problem '
       + 'with your file. Check your connection, and if you use an ad or '
       + 'script blocker allow this site, then reload the page and try again.';
}

const pending = new Map();

/**
 * Resolve once `window[globalName]` exists, fetching the library if needed.
 *
 * Concurrent callers share one attempt — two tools on a page, or a reader
 * picking a second file while the first is still loading, must not start
 * competing injections of the same script.
 *
 * @param {string} globalName the property the library defines on `window`
 * @param {string[]} [urls] sources to try in order; defaults to LIB_SOURCES
 * @param {{timeoutMs?:number, win?:object, doc?:object}} [opts]
 * @returns {Promise<any>} the library object
 */
export function ensureLib(globalName, urls, opts = {}) {
  const win = opts.win || (typeof window !== 'undefined' ? window : null);
  const doc = opts.doc || (typeof document !== 'undefined' ? document : null);
  const timeoutMs = opts.timeoutMs == null ? 15000 : opts.timeoutMs;
  const sources = urls || LIB_SOURCES[globalName] || [];

  if (!win || !doc) {
    return Promise.reject(new LibraryUnavailableError(globalName, 'no browser environment'));
  }
  if (win[globalName]) return Promise.resolve(win[globalName]);
  if (!sources.length) {
    return Promise.reject(new LibraryUnavailableError(globalName, 'no source URLs known'));
  }
  if (pending.has(globalName)) return pending.get(globalName);

  const attempt = (async () => {
    for (const url of sources) {
      try {
        await loadScript(doc, url, timeoutMs);
        if (win[globalName]) return win[globalName];
        /* The script loaded but defined nothing under the expected name —
           a wrong URL, or an interception page served with a 200. Keep going. */
      } catch { /* try the next source */ }
    }
    throw new LibraryUnavailableError(globalName);
  })();

  pending.set(globalName, attempt);
  /* Clear the slot on failure so a later retry — a reader pressing the button
     again after reconnecting — is allowed to try once more. A success stays
     cached, since the global is set and the fast path above will catch it. */
  attempt.catch(() => pending.delete(globalName));
  return attempt;
}

/** Inject one `<script src>` and settle when it loads, errors, or times out. */
function loadScript(doc, url, timeoutMs) {
  return new Promise((resolve, reject) => {
    const el = doc.createElement('script');
    let done = false;
    const finish = (fn, arg) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      fn(arg);
    };
    const timer = setTimeout(() => finish(reject, new Error('timeout: ' + url)), timeoutMs);
    el.src = url;
    el.async = false;
    el.onload = () => finish(resolve, undefined);
    el.onerror = () => finish(reject, new Error('failed: ' + url));
    (doc.head || doc.body || doc.documentElement).appendChild(el);
  });
}
