/**
 * Locale registry.
 *
 * This is the single source of truth for which languages the site serves.
 * Everything else — the URL prefix, `<html lang>`, the `rel="alternate"`
 * hreflang set, the sitemap and the language switcher — derives from here, so
 * adding a language is one entry plus its content, never a hunt through the
 * templates.
 *
 * History worth knowing before editing: the site once shipped 28 machine
 * translated locale folders. They were removed and every `/xx/*` path now 301s
 * to its English equivalent in `public/_redirects`. A locale listed here MUST
 * have its redirect rule deleted, or every page it serves will bounce to
 * English and never be indexed.
 */

export type Locale = 'en' | 'pt';

export interface LocaleConfig {
  /** Path segment the locale lives under. Empty for the default, which is at the root. */
  prefix: string;
  /**
   * Value for `<html lang>` and `rel="alternate" hreflang`.
   *
   * `pt`, not `pt-BR`, is deliberate. The copy is written in Brazilian
   * Portuguese because Brazil is ~85% of the world's Portuguese speakers, but a
   * region-tagged `pt-BR` tells Google to serve it to Brazil *only* — which
   * would hand Portugal, Angola and Mozambique back to the English pages. The
   * bare language code covers every Portuguese-speaking market. If a distinct
   * Portugal variant is ever written, it joins as `pt-PT` and this stays `pt-BR`.
   */
  hreflang: string;
  /** Name shown in the language switcher, written in that language. */
  label: string;
  /** Two-letter form for the nav pill, where the full name will not fit. */
  short: string;
}

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALES: Record<Locale, LocaleConfig> = {
  en: { prefix: '', hreflang: 'en', label: 'English', short: 'EN' },
  pt: { prefix: 'pt', hreflang: 'pt', label: 'Português', short: 'PT' }
};

/** Every locale code, default first. */
export const LOCALE_CODES = Object.keys(LOCALES) as Locale[];

/** Locales that are not the default, i.e. the ones that carry a URL prefix. */
export const PREFIXED_LOCALES = LOCALE_CODES.filter(c => c !== DEFAULT_LOCALE);

export function isLocale(value: string): value is Locale {
  return Object.prototype.hasOwnProperty.call(LOCALES, value);
}

/**
 * Strip a leading locale segment from a path.
 *
 * The `(?=\/|$)` boundary is load-bearing and must not be removed. Without it a
 * locale code matches the *start* of an ordinary path rather than a whole
 * segment: the old 28-locale list made `gu` (Gujarati) match `/guides/`, which
 * canonicalised the entire guides section to `convertocean.comides/` — live, for
 * a month. Only a complete path segment is a locale.
 *
 * Narrowing the list to locales we actually serve is the second half of that
 * fix: a code that is not in LOCALES can no longer collide with a real path.
 */
export function stripLocale(pathname: string): string {
  const pattern = new RegExp(`^/(${PREFIXED_LOCALES.join('|')})(?=/|$)`);
  return pathname.replace(pattern, '');
}

/** Read the locale a path is served under. Returns the default when unprefixed. */
export function localeFromPath(pathname: string): Locale {
  const match = pathname.match(new RegExp(`^/(${PREFIXED_LOCALES.join('|')})(?=/|$)`));
  return match && isLocale(match[1]) ? match[1] : DEFAULT_LOCALE;
}

/** Normalise to a single leading slash and exactly one trailing slash. */
export function normalizePath(pathname: string): string {
  const withLeading = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const collapsed = withLeading.replace(/\/+$/, '');
  return `${collapsed}/`;
}

/**
 * Build a locale-prefixed path. `path` is always the *unprefixed* path, so
 * callers never have to know which locale they are already in.
 */
export function localePath(lang: Locale, path: string): string {
  const clean = normalizePath(stripLocale(path));
  const { prefix } = LOCALES[lang];
  return prefix ? `/${prefix}${clean}` : clean;
}

/** Absolute URL for a path in a given locale. */
export function localeUrl(lang: Locale, path: string, site = 'https://convertocean.com'): string {
  return `${site}${localePath(lang, path)}`;
}

/**
 * Translated path segment for the guides section.
 *
 * Section names are part of the URL a Brazilian sees and searches, so `/guias/`
 * rather than `/guides/`. Anything building a guide link must route through
 * this — a hard-coded `/guides/` inside a Portuguese page sends the reader to
 * the English site and leaks link equity out of the locale.
 */
const GUIDES_SEGMENT: Record<Locale, string> = {
  en: 'guides',
  pt: 'guias'
};

export function guidesBase(lang: Locale): string {
  return GUIDES_SEGMENT[lang];
}
