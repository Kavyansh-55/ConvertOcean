/**
 * Translate a message a module builds at runtime.
 *
 * Error and progress messages are assembled in the browser, after the page is
 * rendered, so the build-time `t()` never sees them. Layout publishes the
 * page's dictionary as `window.__t`; this looks the English TEMPLATE up there
 * and then fills in `{0}`, `{1}`… — so "That file is {0}" is one dictionary
 * key however many sizes it is shown with.
 *
 * With no dictionary (English pages, and Node when the unit tests run) the
 * result is exactly the English it always was.
 *
 * Every template passed here must appear in src/i18n/ui.ts and its
 * RUNTIME_KEYS list; scripts/tests/ui-strings.test.mjs enforces both.
 */

/** Substitute `{0}`, `{1}`… with the arguments, in order. */
export function fill(template, args) {
  let out = String(template);
  args.forEach((v, i) => { out = out.split('{' + i + '}').join(String(v)); });
  return out;
}

/**
 * @param {string} template English text, with `{0}`-style slots
 * @param {...any} args values for the slots
 * @returns {string}
 */
export function tr(template, ...args) {
  const w = typeof window !== 'undefined' ? window : null;
  const t = w && typeof w.__t === 'function' ? w.__t(template) : template;
  return fill(t, args);
}
