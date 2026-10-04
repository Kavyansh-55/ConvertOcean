/**
 * Scheduled publishing for guides.
 *
 * A guide with `publishOn` (YYYY-MM-DD) is left out of the build until that
 * date: no page, no index card, no related-guide link, no sitemap entry, no
 * hreflang. The filter runs where the guide lists are created (guides.ts and
 * CONTENT in i18n/content.ts), so no page can list a guide another page is
 * not building.
 *
 * .github/workflows/publish.yml rebuilds and deploys main every morning, which
 * is what makes a written-ahead guide appear on its day without anyone at a
 * keyboard. A guide with no publishOn is always published.
 *
 * The date is UTC. The workflow runs at 00:30 UTC (06:00 IST), so UTC and
 * Indian calendar dates agree for every run. CO_BUILD_DATE overrides it, which
 * is how the scheduler is tested: build "tomorrow" and the next guide appears.
 */
export const BUILD_DATE: string = (process.env.CO_BUILD_DATE || new Date().toISOString()).slice(0, 10);

if (!/^\d{4}-\d{2}-\d{2}$/.test(BUILD_DATE)) {
  throw new Error(`CO_BUILD_DATE must be YYYY-MM-DD, got "${BUILD_DATE}"`);
}

export function isPublished(item: { publishOn?: string }): boolean {
  return !item.publishOn || item.publishOn <= BUILD_DATE;
}

/** "July 8, 2026" (the English guides' display dates) as YYYY-MM-DD. */
export function isoFromEnglishDate(text: string): string {
  const d = new Date(text);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Unparseable guide date "${text}" — give the guide publishOn: 'YYYY-MM-DD'.`);
  }
  // Local getters: the calendar date as written, whatever the build machine's zone.
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** YYYY-MM-DD as the reader's long date: "October 6, 2026", "6 de outubro de 2026", "6 Oktober 2026". */
export function displayDate(iso: string, locale: 'en' | 'pt' | 'id'): string {
  const tag = { en: 'en-US', pt: 'pt-BR', id: 'id-ID' }[locale];
  return new Intl.DateTimeFormat(tag, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));
}
