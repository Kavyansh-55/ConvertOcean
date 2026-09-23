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
import { DEFAULT_LOCALE, LOCALES, LOCALE_CODES, normalizePath, type Locale } from './config';
import { ptTools, ptGuides, ptCategories, ptStaticPages } from '../data/pt';

/**
 * A translated tool page. Fields absent here fall back to the English tool, so
 * an overlay never has to restate `icon`, `categorySlug` or `relatedTools` —
 * those are structural, not linguistic.
 */
export interface PtTool {
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

export interface PtGuide {
  en: string;
  slug: string;
  title: string;
  description: string;
  h1: string;
  readTime: string;
  intro: string;
  contentHtml: string;
  faqs: { question: string; answer: string }[];
}

/** Category pages are structural, so a translation is just the strings. */
export interface PtCategory {
  en: string;
  slug: string;
  name: string;
  title: string;
  description: string;
  headline: string;
  subtitle: string;
}

/** About, privacy, terms and the like: path pairs plus their copy blocks. */
export interface PtStaticPage {
  en: string;
  slug: string;
  title: string;
  description: string;
}

// ---------------------------------------------------------------------------
// Merged content accessors
// ---------------------------------------------------------------------------

const ptToolByEn = new Map(ptTools.map(t => [t.en, t]));
const ptGuideByEn = new Map(ptGuides.map(g => [g.en, g]));

/**
 * The tool list for a locale. Portuguese returns only the tools that have been
 * localised — a half-translated page is worse than no page, and an untranslated
 * one under `/pt/` is the thin-content pattern that got the previous locale
 * folders removed.
 */
export function getTools(lang: Locale): ToolData[] {
  if (lang === DEFAULT_LOCALE) return tools;
  return tools
    .filter(t => ptToolByEn.has(t.slug))
    .map(t => mergeTool(t, ptToolByEn.get(t.slug)!));
}

export function getTool(slug: string, lang: Locale): ToolData | undefined {
  if (lang === DEFAULT_LOCALE) return tools.find(t => t.slug === slug);
  const overlay = ptTools.find(t => t.slug === slug);
  if (!overlay) return undefined;
  const base = tools.find(t => t.slug === overlay.en);
  return base ? mergeTool(base, overlay) : undefined;
}

function mergeTool(base: ToolData, overlay: PtTool): ToolData {
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
    // relatedTools are English slugs; translate them through the map so the
    // Portuguese page never links back into the English site.
    relatedTools: base.relatedTools
      .filter(s => ptToolByEn.has(s))
      .map(s => ptToolByEn.get(s)!.slug)
  };
}

export function getGuides(lang: Locale): GuideData[] {
  if (lang === DEFAULT_LOCALE) return guides;
  return guides
    .filter(g => ptGuideByEn.has(g.slug))
    .map(g => mergeGuide(g, ptGuideByEn.get(g.slug)!));
}

export function getGuide(slug: string, lang: Locale): GuideData | undefined {
  if (lang === DEFAULT_LOCALE) return guides.find(g => g.slug === slug);
  const overlay = ptGuides.find(g => g.slug === slug);
  if (!overlay) return undefined;
  const base = guides.find(g => g.slug === overlay.en);
  return base ? mergeGuide(base, overlay) : undefined;
}

function mergeGuide(base: GuideData, overlay: PtGuide): GuideData {
  return {
    ...base,
    slug: overlay.slug,
    title: overlay.title,
    description: overlay.description,
    h1: overlay.h1,
    readTime: overlay.readTime,
    intro: overlay.intro,
    contentHtml: overlay.contentHtml,
    faqs: overlay.faqs,
    relatedTools: base.relatedTools
      .filter(s => ptToolByEn.has(s))
      .map(s => ptToolByEn.get(s)!.slug),
    relatedGuides: base.relatedGuides
      .filter(s => ptGuideByEn.has(s))
      .map(s => ptGuideByEn.get(s)!.slug)
  };
}

export function getCategory(slug: string, lang: Locale): PtCategory | undefined {
  if (lang === DEFAULT_LOCALE) return undefined;
  return ptCategories.find(c => c.slug === slug);
}

/**
 * Portuguese categories that actually contain a localised tool.
 *
 * A category page listing nothing is a thin page, and an hreflang link to one
 * that was never built is a dangling link that voids the cluster — the exact
 * failure `scripts/tests/i18n.test.mjs` caught on the first run of this locale.
 * Categories therefore appear as translations are added, not before.
 */
export const activePtCategories: PtCategory[] = ptCategories.filter(c =>
  tools.some(t => t.categorySlug === c.en && ptToolByEn.has(t.slug))
);

export function getCategories(lang: Locale): PtCategory[] {
  return lang === DEFAULT_LOCALE ? [] : activePtCategories;
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

for (const t of ptTools) link(`/${t.en}/`, 'pt', `/pt/${t.slug}/`);
for (const g of ptGuides) link(`/guides/${g.en}/`, 'pt', `/pt/guias/${g.slug}/`);
for (const c of activePtCategories) link(`/${c.en}/`, 'pt', `/pt/${c.slug}/`);
for (const p of ptStaticPages) link(`/${p.en}/`, 'pt', `/pt/${p.slug}/`);

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
  // we have not translated, which is every language but Portuguese.
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
