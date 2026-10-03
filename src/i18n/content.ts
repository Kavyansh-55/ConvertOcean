/**
 * Translated content, and the path graph that ties locales together.
 *
 * Two rules this module exists to enforce:
 *
 * 1. **A page only advertises locale variants that actually exist.** The old
 *    Layout emitted one `rel="alternate"` per configured locale on every page,
 *    which meant switching a locale on would have had all ~110 English pages
 *    pointing at `/pt/…` URLs that 404. Google drops an entire hreflang cluster
 *    when the links do not resolve and reciprocate, so that one bug would have
 *    silently voided the whole translation effort. `alternatesForPath` derives
 *    the set from the content that is really there.
 *
 * 2. **Slugs are translated, and the mapping is bidirectional.** A Brazilian
 *    searches "juntar PDF", not "merge PDF", so the Portuguese page lives at
 *    `/pt/juntar-pdf/`. That means the language switcher cannot just prefix the
 *    current path — it has to resolve the *equivalent* page, and hreflang pairs
 *    have to point at each other exactly. Both directions come from one map.
 */

import { tools, type ToolData } from '../data/tools';
import { guides, type GuideData } from '../data/guides';
import { DEFAULT_LOCALE, LOCALES, LOCALE_CODES, PREFIXED_LOCALES, normalizePath, guidesBase, type Locale } from './config';
import { ptTools, ptGuides, ptCategories, ptStaticPages } from '../data/pt';
import { idTools, idGuides, idCategories, idStaticPages, ID_READY } from '../data/id';

/**
 * A translated tool page. Fields absent here fall back to the English tool, so
 * an overlay never has to restate `icon`, `categorySlug` or `relatedTools` —
 * those are structural, not linguistic.
 */
export interface LocaleTool {
  /** English slug this localises. Must match a slug in `tools`. */
  en: string;
  /** Portuguese URL slug, keyword-led rather than transliterated. */
  slug: string;
  name: string;
  title: string;
  description: string;
  headline: string;
  subtitle: string;
  quickAnswer?: string;
  category: string;
  faqs: { question: string; answer: string }[];
  content?: string;
}

export interface LocaleGuide {
  en: string;
  slug: string;
  title: string;
  description: string;
  h1: string;
  readTime: string;
  /**
   * Written in Portuguese, e.g. "24 de setembro de 2026".
   *
   * Without it the page inherits the English guide's date string — "July 10,
   * 2026" — rendered under a Portuguese label. The schema.org datePublished is
   * parsed from the ENGLISH base date, so it stays valid either way; this is
   * only what the reader sees.
   */
  publishDate?: string;
  intro: string;
  contentHtml: string;
  faqs: { question: string; answer: string }[];
}

/** Category pages are structural, so a translation is just the strings. */
export interface LocaleCategory {
  en: string;
  slug: string;
  name: string;
  title: string;
  description: string;
  headline: string;
  subtitle: string;
  /** Intro prose under the tool grid (HTML with /pt/ links). */
  intro?: string;
  /** Category FAQs; also emitted as FAQPage structured data. */
  faqs?: { q: string; a: string }[];
}

/** About, privacy, terms and the like: path pairs plus their copy blocks. */
export interface LocaleStaticPage {
  en: string;
  slug: string;
  title: string;
  description: string;
}

/* The Portuguese names predate the second locale; kept so existing imports read. */
export type PtTool = LocaleTool;
export type PtGuide = LocaleGuide;
export type PtCategory = LocaleCategory;
export type PtStaticPage = LocaleStaticPage;

/** A prefixed locale's content. English is the base, so it has none. */
type PrefixedLocale = Exclude<Locale, typeof DEFAULT_LOCALE>;
interface LocaleContent {
  tools: LocaleTool[];
  guides: LocaleGuide[];
  categories: LocaleCategory[];
  staticPages: LocaleStaticPage[];
}

const CONTENT: Record<PrefixedLocale, LocaleContent> = {
  pt: { tools: ptTools, guides: ptGuides, categories: ptCategories, staticPages: ptStaticPages },
  /* Content is written ahead of launch; ID_READY holds it back until /id/ has
     its homepage and static pages, so nothing links to an unbuilt page. */
  id: ID_READY
    ? { tools: idTools, guides: idGuides, categories: idCategories, staticPages: idStaticPages }
    : { tools: [], guides: [], categories: [], staticPages: [] }
};

/** The overlays for a locale, by English slug. */
const toolByEn = new Map<Locale, Map<string, LocaleTool>>();
const guideByEn = new Map<Locale, Map<string, LocaleGuide>>();
for (const code of PREFIXED_LOCALES as PrefixedLocale[]) {
  toolByEn.set(code, new Map(CONTENT[code].tools.map(t => [t.en, t])));
  guideByEn.set(code, new Map(CONTENT[code].guides.map(g => [g.en, g])));
}

/**
 * Whether a locale is served at all. A locale whose content is still empty
 * builds no pages, registers no paths and advertises no hreflang — so it can
 * sit in the registry while its pages are being written.
 */
export function isServed(lang: Locale): boolean {
  return lang === DEFAULT_LOCALE || CONTENT[lang as PrefixedLocale].tools.length > 0;
}

/** Every locale that builds pages, default first. */
export const SERVED_LOCALES: Locale[] = LOCALE_CODES.filter(isServed);

// ---------------------------------------------------------------------------
// Merged content accessors
// ---------------------------------------------------------------------------

/** The localised tools of a locale, as authored. Used by the route files. */
export function localeTools(lang: Locale): LocaleTool[] {
  return lang === DEFAULT_LOCALE ? [] : CONTENT[lang as PrefixedLocale].tools;
}

/** The localised guides of a locale, as authored. Used by the route files. */
export function localeGuides(lang: Locale): LocaleGuide[] {
  return lang === DEFAULT_LOCALE ? [] : CONTENT[lang as PrefixedLocale].guides;
}

/**
 * The tool list for a locale. A prefixed locale returns only the tools that
 * have been localised — a half-translated page is worse than no page, and an
 * untranslated one under a prefix is the thin-content pattern that got the
 * previous locale folders removed.
 */
export function getTools(lang: Locale): ToolData[] {
  if (lang === DEFAULT_LOCALE) return tools;
  const byEn = toolByEn.get(lang)!;
  return tools
    .filter(t => byEn.has(t.slug))
    .map(t => mergeTool(t, byEn.get(t.slug)!, lang));
}

export function getTool(slug: string, lang: Locale): ToolData | undefined {
  if (lang === DEFAULT_LOCALE) return tools.find(t => t.slug === slug);
  const overlay = localeTools(lang).find(t => t.slug === slug);
  if (!overlay) return undefined;
  const base = tools.find(t => t.slug === overlay.en);
  return base ? mergeTool(base, overlay, lang) : undefined;
}

function mergeTool(base: ToolData, overlay: LocaleTool, lang: Locale): ToolData {
  const byEn = toolByEn.get(lang)!;
  return {
    ...base,
    slug: overlay.slug,
    enSlug: overlay.en,
    name: overlay.name,
    title: overlay.title,
    description: overlay.description,
    headline: overlay.headline,
    subtitle: overlay.subtitle,
    quickAnswer: overlay.quickAnswer ?? base.quickAnswer,
    category: overlay.category,
    faqs: overlay.faqs,
    content: overlay.content ?? undefined,
    // relatedTools are English slugs; translate them through the map so a
    // localised page never links back into the English site.
    relatedTools: base.relatedTools
      .filter(s => byEn.has(s))
      .map(s => byEn.get(s)!.slug)
  };
}

export function getGuides(lang: Locale): GuideData[] {
  if (lang === DEFAULT_LOCALE) return guides;
  const byEn = guideByEn.get(lang)!;
  return guides
    .filter(g => byEn.has(g.slug))
    .map(g => mergeGuide(g, byEn.get(g.slug)!, lang));
}

export function getGuide(slug: string, lang: Locale): GuideData | undefined {
  if (lang === DEFAULT_LOCALE) return guides.find(g => g.slug === slug);
  const overlay = localeGuides(lang).find(g => g.slug === slug);
  if (!overlay) return undefined;
  const base = guides.find(g => g.slug === overlay.en);
  return base ? mergeGuide(base, overlay, lang) : undefined;
}

function mergeGuide(base: GuideData, overlay: LocaleGuide, lang: Locale): GuideData {
  const tByEn = toolByEn.get(lang)!;
  const gByEn = guideByEn.get(lang)!;
  return {
    ...base,
    slug: overlay.slug,
    title: overlay.title,
    description: overlay.description,
    h1: overlay.h1,
    readTime: overlay.readTime,
    publishDate: overlay.publishDate ?? base.publishDate,
    intro: overlay.intro,
    contentHtml: overlay.contentHtml,
    faqs: overlay.faqs,
    relatedTools: base.relatedTools
      .filter(s => tByEn.has(s))
      .map(s => tByEn.get(s)!.slug),
    relatedGuides: base.relatedGuides
      .filter(s => gByEn.has(s))
      .map(s => gByEn.get(s)!.slug)
  };
}

/**
 * A locale's categories that actually contain a localised tool.
 *
 * A category page listing nothing is a thin page, and an hreflang link to one
 * that was never built is a dangling link that voids the cluster — the exact
 * failure `scripts/tests/i18n.test.mjs` caught on the first run of Portuguese.
 * Categories therefore appear as translations are added, not before.
 */
function activeCategoriesOf(lang: PrefixedLocale): LocaleCategory[] {
  const byEn = toolByEn.get(lang)!;
  return CONTENT[lang].categories.filter(c =>
    tools.some(t => t.categorySlug === c.en && byEn.has(t.slug))
  );
}
const ACTIVE_CATEGORIES = new Map<Locale, LocaleCategory[]>(
  (PREFIXED_LOCALES as PrefixedLocale[]).map(code => [code, activeCategoriesOf(code)])
);

/** Portuguese active categories; kept for existing imports. */
export const activePtCategories: LocaleCategory[] = ACTIVE_CATEGORIES.get('pt')!;

export function getCategories(lang: Locale): LocaleCategory[] {
  return lang === DEFAULT_LOCALE ? [] : ACTIVE_CATEGORIES.get(lang)!;
}

export function getCategory(slug: string, lang: Locale): LocaleCategory | undefined {
  if (lang === DEFAULT_LOCALE) return undefined;
  return CONTENT[lang as PrefixedLocale].categories.find(c => c.slug === slug);
}

// ---------------------------------------------------------------------------
// The path graph
// ---------------------------------------------------------------------------

/**
 * Every page that exists in more than one locale, as a set of per-locale paths.
 * Keyed by the English path, which is the identity of the page.
 */
const pathGraph = new Map<string, Partial<Record<Locale, string>>>();

function link(enPath: string, lang: Locale, translatedPath: string) {
  const key = normalizePath(enPath);
  const entry = pathGraph.get(key) ?? { en: key };
  entry[lang] = normalizePath(translatedPath);
  pathGraph.set(key, entry);
}

for (const code of PREFIXED_LOCALES as PrefixedLocale[]) {
  if (!isServed(code)) continue;
  const c = CONTENT[code];
  const root = `/${LOCALES[code].prefix}`;
  /* The locale root. Registered explicitly because the homepage has no slug to
     derive from — and without it every "Início", logo and footer-brand link on
     all 75 Portuguese pages once resolved to the English homepage. */
  link('/', code, `${root}/`);
  /* The guides index. Its section name is translated too — /guides/ becomes
     /pt/guias/ — so it cannot be derived by prefixing. */
  link('/guides/', code, `${root}/${guidesBase(code)}/`);

  for (const t of c.tools) link(`/${t.en}/`, code, `${root}/${t.slug}/`);
  for (const g of c.guides) link(`/guides/${g.en}/`, code, `${root}/${guidesBase(code)}/${g.slug}/`);
  for (const cat of ACTIVE_CATEGORIES.get(code)!) link(`/${cat.en}/`, code, `${root}/${cat.slug}/`);
  for (const p of c.staticPages) link(`/${p.en}/`, code, `${root}/${p.slug}/`);
}

/** Reverse index: any translated path back to its English path. */
const enPathByTranslated = new Map<string, string>();
for (const [enPath, variants] of pathGraph) {
  for (const code of LOCALE_CODES) {
    const p = variants[code];
    if (p && code !== DEFAULT_LOCALE) enPathByTranslated.set(p, enPath);
  }
}

/** The English path for any path in any locale. Identity for English paths. */
export function canonicalEnglishPath(pathname: string): string {
  const key = normalizePath(pathname);
  return enPathByTranslated.get(key) ?? key;
}

export interface AlternateLink {
  /** hreflang value, or `x-default`. */
  lang: string;
  href: string;
}

/**
 * The `rel="alternate"` set for a page, including itself, and `x-default`.
 *
 * Returns an empty array when the page exists in only one locale. That is the
 * correct output, not a gap: hreflang on a page with no alternates is noise,
 * and advertising a variant that 404s invalidates the cluster.
 */
export function alternatesForPath(pathname: string, site = 'https://convertocean.com'): AlternateLink[] {
  const enPath = canonicalEnglishPath(pathname);
  const variants = pathGraph.get(enPath);
  if (!variants) return [];

  const links: AlternateLink[] = [];
  for (const code of LOCALE_CODES) {
    const path = variants[code];
    if (path) links.push({ lang: LOCALES[code].hreflang, href: `${site}${path}` });
  }
  // x-default points at the English page: it is the fallback for any language
  // we have not translated.
  if (variants[DEFAULT_LOCALE]) {
    links.push({ lang: 'x-default', href: `${site}${variants[DEFAULT_LOCALE]}` });
  }
  return links.length > 1 ? links : [];
}

/**
 * Where the language switcher should send someone. Falls back to the locale's
 * home page rather than a 404 when the current page has no counterpart — a
 * switcher that dead-ends is worse than one that lands you somewhere real.
 */
export function switcherTarget(pathname: string, target: Locale): string {
  const enPath = canonicalEnglishPath(pathname);
  const variants = pathGraph.get(enPath);
  const path = variants?.[target];
  if (path) return path;
  return target === DEFAULT_LOCALE ? '/' : `/${LOCALES[target].prefix}/`;
}

/**
 * Resolve an ENGLISH path to its equivalent in `lang`, for navigation links.
 *
 * This exists because the obvious implementation is wrong in a way that is
 * invisible until something crawls the site. Header and Footer originally built
 * locale links by prefixing: `/compress-pdf/` became `/pt/compress-pdf/`. But
 * Portuguese slugs are translated, so the real page is `/pt/comprimir-pdf/` and
 * the prefixed URL 404s. That produced 76 distinct dead links on all 75
 * Portuguese pages — every tool in the footer, every category in the nav, the
 * logo, the sitemap link — and nothing in the build said a word about it.
 *
 * A path with no translation falls back to the English URL rather than
 * inventing a prefixed one. A working cross-language link is imperfect; a 404
 * is not. `scripts/tests/i18n-links.test.mjs` fails the build if any internal
 * link points at a page that was not built.
 */
export function localeHref(enPath: string, lang: Locale): string {
  const key = normalizePath(enPath);
  if (lang === DEFAULT_LOCALE) return key;
  return pathGraph.get(key)?.[lang] ?? key;
}

/** Which locales serve this page. Used to decide whether to show the switcher. */
export function localesForPath(pathname: string): Locale[] {
  const variants = pathGraph.get(canonicalEnglishPath(pathname));
  if (!variants) return [DEFAULT_LOCALE];
  return LOCALE_CODES.filter(code => Boolean(variants[code]));
}

/** Every path the site serves in a non-default locale. Used by the sitemap check. */
export function allTranslatedPaths(): string[] {
  return [...enPathByTranslated.keys()];
}
