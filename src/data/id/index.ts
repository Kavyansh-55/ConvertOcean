/**
 * Indonesian (Bahasa Indonesia) page content.
 *
 * Same method as src/data/pt/: localisation, not translation. Each page is
 * built around the query an Indonesian actually types (`gabung pdf`, `kompres
 * pdf`, `kwitansi`), so slugs are Indonesian too, and a tool is only listed
 * here once its keyword research exists. Tools with no Indonesian search
 * demand (OFX/QFX/QBO, XML, XLS/XLSX to JSON…) are deliberately absent: their
 * Indonesian visitors search the English terms and get the English page.
 *
 * Every entry here becomes a built page plus an hreflang pair, so an empty
 * list is a valid state: nothing under /id/ is built until something is.
 */
import type { LocaleTool, LocaleGuide, LocaleCategory, LocaleStaticPage } from '../../i18n/content';

export const idCategories: LocaleCategory[] = [];
export const idTools: LocaleTool[] = [];
export const idGuides: LocaleGuide[] = [];
export const idStaticPages: LocaleStaticPage[] = [];
