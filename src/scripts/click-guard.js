/**
 * One tap, one file.
 *
 * Every tool's action button ran its handler once per click, with nothing
 * stopping a second click from starting the work again while the first was
 * still going. Three quick taps on `/excel-to-pdf/` produced **three**
 * conversions and three downloads — measured, on eight of twelve tools tested.
 *
 * That is not an exotic case. A double-tap is how a phone user presses
 * anything they are not sure registered, and a conversion that takes a few
 * seconds invites exactly that. The result is duplicate files in Downloads and
 * two or three copies of the same job competing for the tab's memory, which on
 * a phone is how a tab dies.
 *
 * The guard lives in one place rather than in twenty-odd components, for the
 * same reason the CDN recovery does: a rule copied into twenty files is twenty
 * chances to copy it slightly wrong.
 *
 * Two conditions swallow a click:
 *
 *  1. **A job is already running** — the shared `#progressOverlay` is visible.
 *     27 components use that same element, which is what makes a generic rule
 *     possible at all.
 *  2. **The same button was tapped a moment ago.** The overlay does not appear
 *     until the handler's first `await`, so there is a real window in which a
 *     second click lands before condition 1 can see anything. A short
 *     per-button debounce covers it.
 *
 * Deliberately *not* guarded: `#btnClear` and the page-selection buttons. A
 * reader must always be able to reset or change a selection, including while
 * something is running — locking those would trap them.
 */

/**
 * The buttons that start work and produce a file.
 *
 * An explicit list rather than a pattern like `id^="btn"`, because that would
 * also catch `#btnSelectAllPages`, which is a toggle a reader may legitimately
 * press twice in a second. `scripts/tests/click-guard.test.mjs` asserts this
 * covers the action button of every recipe in the fidelity harness, so a tool
 * added later with a new action id fails a test rather than silently going
 * unguarded.
 */
export const ACTION_BUTTON_IDS = [
  'btnConvert',
  'btnDownload',
  'btnMerge',
  'btnSplit',
  'btnExtract',
  'btnExportXlsx',
  'btnExportPdf',
  'btnProcess',
  'btnGenerate',
  /* These three do not follow the btn* convention, which is precisely why the
     test reads the recipes rather than trusting a naming pattern — all three
     were missing from the first version of this list. */
  'processBtn',
  'jf-download-btn',
  'rzDownload',
  /* The compressor auto-runs on drop, so its download is the first button a
     reader reaches — and a double-tap there saves the file twice. */
  'cmpDownload',
];

/** How long a second tap on the same button counts as the same tap. */
export const REPEAT_WINDOW_MS = 1200;

/** Is a job running right now? */
function busy(doc) {
  const overlay = doc.getElementById('progressOverlay');
  if (!overlay) return false;
  /* `offsetParent` is null for a `display: none` element and for anything
     inside one, which is how these overlays are hidden. */
  return overlay.offsetParent !== null
      && getComputedStyle(overlay).visibility !== 'hidden';
}

/**
 * Install the guard. Safe to call more than once.
 *
 * @param {{doc?:Document, now?:() => number, windowMs?:number}} [opts]
 * @returns {() => void} removes the guard, for tests
 */
export function installClickGuard(opts = {}) {
  const doc = opts.doc || (typeof document !== 'undefined' ? document : null);
  if (!doc) return () => {};
  const now = opts.now || (() => Date.now());
  const windowMs = opts.windowMs == null ? REPEAT_WINDOW_MS : opts.windowMs;

  const lastTap = new Map();
  /* Which button started the job currently running. Only that one is held
     while the overlay is up.

     Blocking *every* action button whenever the overlay was visible was too
     blunt and broke four tools: the overlay is also raised while a file is
     being read in, and the download button is a separate step. Clicking
     download during that read is a perfectly ordinary thing to do — the
     harness does it, and so would a reader — and it was being swallowed in
     silence, which is worse than the duplicate download this guard exists to
     prevent. */
  let activeButton = null;

  const onClick = (event) => {
    const target = event.target;
    const button = target && target.closest ? target.closest('button') : null;
    if (!button || !ACTION_BUTTON_IDS.includes(button.id)) return;

    const running = busy(doc);
    if (!running) activeButton = null;

    const previous = lastTap.get(button.id);
    const repeat = previous != null && now() - previous < windowMs;
    const reentrant = running && activeButton === button.id;

    if (repeat || reentrant) {
      /* stopImmediatePropagation, not just stopPropagation: the component's
         own handler is registered on this very element, so a bubbling stop
         would not reach it. */
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    lastTap.set(button.id, now());
    activeButton = button.id;
  };

  /* Capture phase, so this runs before the component's own listener. */
  doc.addEventListener('click', onClick, true);
  return () => doc.removeEventListener('click', onClick, true);
}
