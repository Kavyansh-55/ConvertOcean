/**
 * lib-bootstrap — the page-level repair that runs before anyone picks a file.
 *
 * The interesting property is not that it reloads a missing library; it is
 * that it decides *which* libraries a page has by reading the script tags
 * really in the document. An unrecognised tag is skipped silently, so the
 * matching has to survive a version bump and a change of host — otherwise a
 * page would quietly stop being repaired and nothing would say so.
 */
import { declaredLibraries, recoverPageLibraries, startLibraryRecovery }
  from '../../src/scripts/lib-bootstrap.js';
import { LIB_SOURCES } from '../../src/scripts/ensure-lib.js';

let passed = 0, failed = 0;
function check(label, cond, detail = '') {
  if (cond) { passed++; console.log('  ok   ' + label); }
  else { failed++; console.log('  FAIL ' + label + (detail ? '  — ' + detail : '')); }
}

/** A document with the given script srcs, plus a loader that can be steered. */
function fakeEnv(srcs, behaviour) {
  const win = {};
  const attempted = [];
  const doc = {
    querySelectorAll: () => srcs.map((s) => ({ getAttribute: () => s })),
    head: { appendChild(el) { setTimeout(() => el.__run(), 0); } },
    createElement() {
      const el = {};
      Object.defineProperty(el, 'src', {
        set(v) { el.__url = v; attempted.push(v); }, get() { return el.__url; },
      });
      el.__run = () => {
        const what = behaviour ? behaviour(el.__url, win) : 'error';
        if (what === 'load') el.onload(); else el.onerror();
      };
      return el;
    },
  };
  return { win, doc, attempted };
}

console.log('\nlib-bootstrap\n');

/* --- recognising what the page declares -------------------------------- */
{
  const { doc } = fakeEnv([
    'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
    '/_astro/SomeTool.abc123.js',
  ]);
  const found = declaredLibraries(doc);
  check('the page\'s own libraries are recognised', found.includes('XLSX') && found.includes('JSZip'));
  check('the site\'s own bundles are not mistaken for libraries', found.length === 2, found.join(','));
}
{
  /* Matching on the filename rather than the whole URL is what keeps this
     working when a component is pointed at the other CDN. */
  const { doc } = fakeEnv(['https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js']);
  check('a library served from the fallback host is still recognised',
        declaredLibraries(doc).includes('XLSX'));
}
{
  const { doc } = fakeEnv(['https://cdn.jsdelivr.net/npm/pdfmake@0.2.10/build/vfs_fonts.js']);
  check('the pdfmake font pack is recognised as its own entry',
        declaredLibraries(doc).includes('pdfMakeFonts'));
}

/* --- a healthy page does nothing --------------------------------------- */
{
  const { win, doc, attempted } = fakeEnv(
    ['https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'], () => 'load');
  win.XLSX = {};
  const failedKeys = await recoverPageLibraries({ win, doc });
  check('a page whose libraries all loaded refetches nothing',
        failedKeys.length === 0 && attempted.length === 0);
}

/* --- a broken page repairs itself -------------------------------------- */
{
  const { win, doc, attempted } = fakeEnv(
    ['https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'],
    (url, w) => { if (url.includes('cdnjs')) { w.XLSX = { ok: 1 }; return 'load'; } return 'error'; });
  const failedKeys = await recoverPageLibraries({ win, doc });
  check('a missing library is refetched from the other host',
        failedKeys.length === 0 && !!win.XLSX && attempted.length >= 1, attempted.join(' '));
}

/* --- an unrepairable page reports rather than throws -------------------- */
{
  const { win, doc } = fakeEnv(
    ['https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'], () => 'error');
  let threw = false;
  let failedKeys = [];
  try { failedKeys = await recoverPageLibraries({ win, doc, timeoutMs: 40 }); }
  catch { threw = true; }
  check('a page that cannot be repaired resolves instead of throwing', !threw);
  check('…and names what is still missing', failedKeys.includes('XLSX'), failedKeys.join(','));
}

/* --- several libraries at once ----------------------------------------- */
{
  const { win, doc } = fakeEnv([
    'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  ], (url, w) => {
    if (url.includes('xlsx')) { w.XLSX = {}; return 'load'; }
    if (url.includes('jszip')) { w.JSZip = function () {}; return 'load'; }
    return 'error';
  });
  const failedKeys = await recoverPageLibraries({ win, doc });
  check('two missing libraries are both recovered',
        failedKeys.length === 0 && !!win.XLSX && !!win.JSZip);
}

/* --- the published promise --------------------------------------------- */
{
  const { win, doc } = fakeEnv([], () => 'load');
  const a = startLibraryRecovery({ win, doc });
  const b = startLibraryRecovery({ win, doc });
  check('recovery is started once and shared', a === b && win.__libsReady === a);
  await a;
}

/* --- the table itself --------------------------------------------------- */
check('every library in the table is reachable by its filename',
      Object.values(LIB_SOURCES).every((spec) => spec.urls.every((u) => u.split('/').pop().length > 3)));

/* --- holding the controls during a repair ------------------------------ */

/** A document that also has controls and a body, for the hold/release path. */
function fakeEnvWithControls(srcs, behaviour, controls) {
  const win = {};
  const appended = [];
  const doc = {
    body: { appendChild(el) { appended.push(el); } },
    querySelectorAll: (sel) => {
      if (sel.includes('script')) return srcs.map((s) => ({ getAttribute: () => s }));
      return controls;
    },
    head: { appendChild(el) { setTimeout(() => el.__run(), 0); } },
    createElement: (tag) => {
      if (tag === 'div') {
        const d = { style: {}, tagName: 'DIV', attrs: {} };
        d.setAttribute = (k, v) => { d.attrs[k] = v; };
        d.remove = () => { d.removed = true; };
        d.style.cssText = '';
        return d;
      }
      const el = {};
      Object.defineProperty(el, 'src', {
        set(v) { el.__url = v; }, get() { return el.__url; },
      });
      el.__run = () => {
        const what = behaviour ? behaviour(el.__url, win) : 'error';
        if (what === 'load') el.onload(); else el.onerror();
      };
      return el;
    },
  };
  return { win, doc, appended };
}

{
  const mark = () => { const c = { disabled: false, attrs: {} }; c.setAttribute = (k) => { c.attrs[k] = true; }; c.removeAttribute = (k) => { delete c.attrs[k]; }; return c; };
  const controls = [mark(), mark(), { disabled: true }];
  const { win, doc, appended } = fakeEnvWithControls(
    ['https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'],
    (url, w) => { if (url.includes('cdnjs')) { w.XLSX = {}; return 'load'; } return 'error'; },
    controls);

  const p = startLibraryRecovery({ win, doc });
  check('a broken page disables its controls while repairing',
        controls[0].disabled === true && controls[1].disabled === true);
  check('the held controls are marked so a test can tell them apart',
        controls[0].attrs['data-lib-held'] === true);
  check('…and puts up a notice', appended.length === 1 && /loading/i.test(appended[0].textContent));

  await p;
  check('a successful repair re-enables the controls',
        controls[0].disabled === false && controls[1].disabled === false);
  check('…and takes the notice down', appended[0].removed === true);
  check('…and clears the marker it set',
        controls[0].attrs['data-lib-held'] === undefined);
  check('a control the component had already disabled is left alone',
        controls[2].disabled === true);
}
{
  const controls = [{ disabled: false }];
  const { win, doc, appended } = fakeEnvWithControls(
    ['https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'],
    () => 'error', controls);
  const failedKeys = await startLibraryRecovery({ win, doc, timeoutMs: 40 });
  check('a failed repair still gives the controls back',
        controls[0].disabled === false && failedKeys.includes('XLSX'));
  check('…and says so rather than clearing the notice',
        appended[0].removed !== true && /could not/i.test(appended[0].textContent));
}
{
  const controls = [{ disabled: false }];
  const { win, doc, appended } = fakeEnvWithControls(
    ['https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'], () => 'load', controls);
  win.XLSX = {};
  await startLibraryRecovery({ win, doc });
  check('a healthy page never touches the controls or shows a notice',
        controls[0].disabled === false && appended.length === 0);
}

console.log('\n  ' + passed + ' passed, ' + failed + ' failed\n');
process.exit(failed ? 1 : 0);
