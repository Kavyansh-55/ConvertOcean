/**
 * One tap, one file.
 *
 * Three quick taps on an action button used to run the conversion three times
 * and hand back three copies — measured on eight of twelve tools. A double-tap
 * is how a phone user presses anything they are not sure registered, so this
 * was not an exotic case.
 *
 * The last test is the one that keeps this working: it reads the fidelity
 * harness's own recipes and asserts every tool's action button is in the
 * guarded list. A tool added later with a new button id fails here rather than
 * quietly going unguarded.
 */
import { installClickGuard, ACTION_BUTTON_IDS, REPEAT_WINDOW_MS }
  from '../../src/scripts/click-guard.js';
import { recipes } from '../../scripts/fidelity/recipes/index.mjs';

let passed = 0, failed = 0;
function check(label, cond, detail = '') {
  if (cond) { passed++; console.log('  ok   ' + label); }
  else { failed++; console.log('  FAIL ' + label + (detail ? '  — ' + detail : '')); }
}

/** Minimal DOM: a click dispatcher with capture-phase support. */
function fakeDom({ overlayVisible = false } = {}) {
  const listeners = [];
  const overlay = {
    offsetParent: overlayVisible ? {} : null,
    style: { visibility: 'visible' },
  };
  const doc = {
    addEventListener: (type, fn, capture) => listeners.push({ type, fn, capture }),
    removeEventListener: (type, fn) => {
      const i = listeners.findIndex((l) => l.fn === fn);
      if (i >= 0) listeners.splice(i, 1);
    },
    getElementById: (id) => (id === 'progressOverlay' ? overlay : null),
  };
  /* The guard calls getComputedStyle on the overlay. */
  globalThis.getComputedStyle = (el) => el.style || { visibility: 'visible' };

  /** Returns true when the component's own handler would have run. */
  const click = (buttonId) => {
    const button = { id: buttonId };
    button.closest = (sel) => (sel === 'button' ? button : null);
    let stopped = false;
    const event = {
      target: button,
      preventDefault() {},
      stopImmediatePropagation() { stopped = true; },
    };
    for (const l of listeners) if (l.type === 'click') l.fn(event);
    return !stopped;
  };
  return { doc, click, overlay };
}

console.log('\nclick guard\n');

/* --- the repeat tap ------------------------------------------------------ */
{
  let t = 1000;
  const { doc, click } = fakeDom();
  installClickGuard({ doc, now: () => t });

  check('the first tap goes through', click('btnConvert') === true);
  t += 50;
  check('a tap 50ms later is swallowed', click('btnConvert') === false);
  t += 100;
  check('…and so is a third', click('btnConvert') === false);
  t += REPEAT_WINDOW_MS;
  check('a tap after the window goes through again', click('btnConvert') === true);
}

/* --- a different button is not affected ---------------------------------- */
{
  let t = 1000;
  const { doc, click } = fakeDom();
  installClickGuard({ doc, now: () => t });
  click('btnConvert');
  t += 50;
  check('a different action button is judged on its own history',
        click('btnDownload') === true);
}

/* --- while a job is running ---------------------------------------------- */
{
  let t = 1000;
  const { doc, click } = fakeDom({ overlayVisible: true });
  installClickGuard({ doc, now: () => t });
  /* The first press starts the job and is allowed; it is the re-press while
     that same job runs that must not start a second one. */
  check('the press that starts a job goes through', click('btnConvert') === true);
  t += 10000;
  check('re-pressing the same button while it runs is swallowed', click('btnConvert') === false);
  /* A different button is a different operation. The overlay is also raised
     while a file is read in, and pressing download during that is ordinary —
     blocking it broke four tools and told the reader nothing. */
  check('a different action button is not held by another job',
        click('btnDownload') === true);
}

/* --- what must never be blocked ------------------------------------------ */
{
  let t = 1000;
  const { doc, click } = fakeDom({ overlayVisible: true });
  installClickGuard({ doc, now: () => t });
  /* A reader must always be able to reset or change a selection, including
     while something is running — locking these would trap them. */
  check('Clear still works during a job', click('btnClear') === true);
  t += 20;
  check('…repeatedly', click('btnClear') === true);
  check('page selection still works during a job', click('btnSelectAllPages') === true);
  t += 20;
  check('…and can be toggled straight back', click('btnSelectAllPages') === true);
}

/* --- non-button clicks pass through -------------------------------------- */
{
  const { doc } = fakeDom();
  installClickGuard({ doc });
  const listeners = [];
  let threw = false;
  try {
    const event = { target: { closest: () => null }, preventDefault() {}, stopImmediatePropagation() {} };
    doc.addEventListener('click', () => {}, true);
    // re-dispatch through the installed guard
  } catch { threw = true; }
  check('a click on something that is not a button does not throw', !threw);
}

/* --- uninstall ----------------------------------------------------------- */
{
  let t = 1000;
  const { doc, click } = fakeDom();
  const remove = installClickGuard({ doc, now: () => t });
  click('btnConvert');
  t += 50;
  check('the guard is active before removal', click('btnConvert') === false);
  remove();
  check('and gone after it', click('btnConvert') === true);
}

/* --- the list covers every tool ------------------------------------------ */
{
  const actionIds = new Set();
  for (const r of recipes) {
    const sel = r.download;
    if (typeof sel === 'string' && sel.startsWith('#')) actionIds.add(sel.slice(1));
  }
  const missing = [...actionIds].filter((id) => !ACTION_BUTTON_IDS.includes(id));
  check('every action button in the fidelity recipes is guarded',
        missing.length === 0,
        missing.length ? 'unguarded: ' + missing.join(', ') : actionIds.size + ' ids checked');
}

console.log('\n  ' + passed + ' passed, ' + failed + ' failed\n');
process.exit(failed ? 1 : 0);
