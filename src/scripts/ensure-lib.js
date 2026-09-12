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
 * So: check the global, and if it is missing, fetch the library again — from a
 * second, independent CDN if the first will not answer. Only when every source
 * has failed do we say so, and then we say the true thing rather than blaming
 * the file.
 */

/**
 * Every library the tools load, with a fallback on a *different* host.
 *
 * The fallback is deliberately another provider rather than another path on
 * the same one: the failure being defended against is usually "this host is
 * unreachable from here", which a mirror on the same host does not fix. Every
 * URL below was checked to return 200 and, apart from `vfs_fonts.js` (a
 * 5-byte trailing-comment difference), to be byte-identical to its primary.
 *
 * `XLSX` is the one exception, and its entry explains why: no second provider
 * serves a build without a known CVE, so its fallback is a copy we host. A
 * fallback that is reachable but unsafe is not a fallback.
 *
 * Versions are pinned and must match the `is:inline` tag in the component. If
 * one is bumped, bump it here too, or a page can end up running two builds.
 *
 * `ready` exists for the two scripts that define no global of their own and
 * instead attach to one that is already there — checking `window.something`
 * would report success before they had done their work.
 */
export const LIB_SOURCES = {
  XLSX: {
    label: 'spreadsheet engine',
    /* The one entry whose fallback is our own origin rather than a second
       provider, because a second provider serving a *safe* build does not
       exist.

       npm's `xlsx` is frozen forever at 0.18.5, which carries CVE-2023-30533
       (prototype pollution from a crafted workbook) and CVE-2024-22363
       (ReDoS). SheetJS moved off npm, so every npm mirror — jsdelivr, cdnjs,
       unpkg — can only ever serve the vulnerable build. Patched releases live
       on cdn.sheetjs.com and nowhere else.

       That makes the usual "another provider" fallback a downgrade: a bad
       minute at SheetJS would silently drop a reader onto a vulnerable
       parser, which is worse than the outage it was meant to cover. So the
       fallback is a copy we serve ourselves. It is still a genuinely
       independent host — if our origin is unreachable the reader never got
       the page — and it cannot drift to a vulnerable version behind our back.

       `public/vendor/xlsx.full.min.js` must stay byte-identical to the pinned
       CDN release above; `scripts/tests/client-lib-security.test.mjs` checks
       the pair and fails if either moves without the other. */
    urls: [
      'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js',
      '/vendor/xlsx.full.min.js',
    ],
  },
  JSZip: {
    label: 'archive reader',
    urls: [
      'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
      'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js',
    ],
  },
  jspdf: {
    label: 'PDF engine',
    urls: [
      'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    ],
  },
  jspdfAutoTable: {
    label: 'PDF table plugin',
    urls: [
      'https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.2/dist/jspdf.plugin.autotable.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js',
    ],
    /* A plugin, not a library: it hangs autoTable off the jsPDF prototype and
       defines nothing under its own name. */
    ready: (win) => !!(win.jspdf && win.jspdf.jsPDF
                    && win.jspdf.jsPDF.API && win.jspdf.jsPDF.API.autoTable),
    needs: 'jspdf',
  },
  pdfjsLib: {
    label: 'PDF reader',
    /* Pinned to the last 3.x on purpose, with CVE-2024-4367 closed at the call
       site instead of by upgrading.

       That CVE (CVSS 8.8) lets a crafted PDF run arbitrary JavaScript in this
       origin, which on a site whose whole promise is that files never leave
       the machine is the worst-shaped bug available: script in our origin can
       read the document the reader just opened and post it anywhere. Mozilla
       fixed it in 4.2.67 — but pdfjs-dist 4.x ships **ESM only**, with no UMD
       build at all, so every `<script is:inline>` tag and the `window.pdfjsLib`
       global this whole module is built around stop working on it. That is a
       loader rewrite across six components, not a version bump.

       The advisory's own documented workaround is `isEvalSupported: false`,
       and it closes the hole completely: the vulnerability *is* the eval path.
       So every `getDocument()` call passes it, and
       `scripts/tests/client-lib-security.test.mjs` fails the build if a new
       call site forgets. Moving to 4.x/5.x is still worth doing for the fixes
       we are not getting; it is tracked as its own piece of work. */
    urls: [
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js',
      'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.min.js',
    ],
  },
  PDFLib: {
    label: 'PDF editor',
    urls: [
      'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
    ],
  },
  html2pdf: {
    label: 'PDF renderer',
    urls: [
      'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
      'https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js',
    ],
  },
  Tesseract: {
    label: 'text recognition engine',
    urls: [
      'https://cdn.jsdelivr.net/npm/tesseract.js@4.0.2/dist/tesseract.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/4.0.2/tesseract.min.js',
    ],
  },
  pdfMake: {
    label: 'PDF engine',
    urls: [
      'https://cdn.jsdelivr.net/npm/pdfmake@0.2.10/build/pdfmake.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.10/pdfmake.min.js',
    ],
  },
  heic2any: {
    label: 'HEIC decoder',
    /* Fetched on the first file rather than on page load — it is a ~1.3 MB
       libheif build, and most visitors to /heic-to-jpg/ are deciding whether
       to use the tool, not using it. That laziness is why it was missed when
       every other library got a fallback: `lib-bootstrap` repairs the script
       tags it can see in the document, and at page load there is no tag here
       to see. The loader in HeicTool asks for it by name instead. */
    urls: [
      'https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/heic2any/0.0.4/heic2any.min.js',
    ],
  },
  pdfMakeFonts: {
    label: 'PDF font pack',
    urls: [
      'https://cdn.jsdelivr.net/npm/pdfmake@0.2.10/build/vfs_fonts.js',
      'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.10/vfs_fonts.js',
    ],
    /* Fills the pdfMake virtual file system. Without it every text run renders
       as a blank box, which is worse than an error because it looks like a
       finished document. */
    ready: (win) => !!(win.pdfMake && win.pdfMake.vfs),
    needs: 'pdfMake',
  },
};

/** Thrown when every source for a library has been tried and none worked. */
export class LibraryUnavailableError extends Error {
  constructor(globalName, message) {
    super(message || (globalName + ' could not be loaded'));
    this.name = 'LibraryUnavailableError';
    this.globalName = globalName;
    this.label = (LIB_SOURCES[globalName] && LIB_SOURCES[globalName].label) || globalName;
  }
}

/**
 * What to tell a reader when a library genuinely cannot be reached.
 *
 * Names the real cause and the two things that actually fix it. It does not
 * mention their file, because their file is not the problem.
 */
export function libraryUnavailableMessage(what) {
  return 'The ' + what + ' could not be loaded, so this file cannot be '
       + 'processed right now — this is a loading problem on our side, not a '
       + 'problem with your file. Check your connection, and if you use an ad '
       + 'or script blocker allow this site, then reload the page and try again.';
}

/** The message for a caught error, whatever kind it turns out to be. */
export function messageForError(err, fallbackMessage) {
  if (err instanceof LibraryUnavailableError) return libraryUnavailableMessage(err.label);
  return fallbackMessage;
}

const pending = new Map();

/** Is this library present and usable right now? */
export function libPresent(globalName, win) {
  const w = win || (typeof window !== 'undefined' ? window : null);
  if (!w) return false;
  const spec = LIB_SOURCES[globalName];
  if (spec && spec.ready) return !!spec.ready(w);
  return !!w[globalName];
}

/**
 * Resolve once the library is usable, fetching it if it is not.
 *
 * Concurrent callers share one attempt — two tools on a page, or a reader
 * picking a second file while the first is still loading, must not start
 * competing injections of the same script.
 *
 * @param {string} globalName key in LIB_SOURCES, or a `window` property
 * @param {string[]} [urls] override the sources to try
 * @param {{timeoutMs?:number, win?:object, doc?:object, ready?:Function}} [opts]
 * @returns {Promise<any>} the library object, or true for attach-only scripts
 */
export function ensureLib(globalName, urls, opts = {}) {
  const win = opts.win || (typeof window !== 'undefined' ? window : null);
  const doc = opts.doc || (typeof document !== 'undefined' ? document : null);
  const timeoutMs = opts.timeoutMs == null ? 15000 : opts.timeoutMs;
  const spec = LIB_SOURCES[globalName] || {};
  const sources = urls || spec.urls || [];
  const ready = opts.ready || spec.ready || ((w) => w[globalName]);

  if (!win || !doc) {
    return Promise.reject(new LibraryUnavailableError(globalName, 'no browser environment'));
  }
  const already = ready(win);
  if (already) return Promise.resolve(already === true ? true : (win[globalName] || already));
  if (!sources.length) {
    return Promise.reject(new LibraryUnavailableError(globalName, 'no source URLs known'));
  }
  if (pending.has(globalName)) return pending.get(globalName);

  const attempt = (async () => {
    /* A plugin is useless without the thing it attaches to, and loading it
       first would let its ready check run against a half-built global. */
    if (spec.needs) await ensureLib(spec.needs, undefined, opts);

    for (const url of sources) {
      try {
        await loadScript(doc, url, timeoutMs);
        const got = ready(win);
        if (got) return got === true ? true : (win[globalName] || got);
        /* The script loaded but defined nothing under the expected name — a
           wrong URL, or an interception page served with a 200. Keep going. */
      } catch { /* try the next source */ }
    }
    throw new LibraryUnavailableError(globalName);
  })();

  pending.set(globalName, attempt);
  /* Clear the slot once it settles, either way. While the attempt is in
     flight, concurrent callers share it; afterwards there is nothing worth
     keeping, because a success is picked up by the ready() fast path above
     and a failure should be allowed to retry — a reader pressing the button
     again after reconnecting must not be handed the old rejection forever.
     Holding resolved promises here also made the map a hidden global: a
     second call with a different window saw the first one's result. */
  const clear = () => pending.delete(globalName);
  attempt.then(clear, clear);
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
