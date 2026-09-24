/**
 * Portuguese keyword targets, recorded verbatim.
 *
 * Supplied by Kavya from Ahrefs on 2026-09-24 for the first three tools. The
 * strings here are EXACT and must not be reworded, re-cased or "improved" when
 * they are used on a page. Altering the wording is what breaks exact match —
 * the same rule the English pages follow, where fourteen reader-supplied
 * questions went in lowercase and all.
 *
 * This file is the source of truth for what each page targets. It is data, not
 * copy: nothing here is rendered directly. Pages in ./index.ts quote these
 * strings into headings, FAQ questions and body text.
 *
 * ---------------------------------------------------------------------------
 * THREE THINGS THE RAW EXPORT GETS WRONG, HANDLED HERE
 * ---------------------------------------------------------------------------
 *
 * 1. BRAND QUERIES ARE EXCLUDED, NOT TARGETED.
 *    `ilovepdf pdf para word`, `i love pdf word para pdf` and their variants
 *    are navigational searches for a competitor. Someone typing them has
 *    already chosen a destination. The English side already settled this —
 *    SEO-ROADMAP.md rejected `adobe image resizer` and `canva image resizer`
 *    on the same grounds — so they are listed in `excluded` with the reason
 *    rather than silently dropped, and must not be reintroduced.
 *
 * 2. THE QUESTION EXPORTS CROSS DIRECTIONS, AND ARE SPLIT BY DIRECTION HERE.
 *    Ahrefs returned an identical 322-keyword question set for both `pdf para
 *    word` and `word para pdf`, mixing both conversions together. Worse, the
 *    `Excel para pdf` question export is nine-tenths PDF-to-Excel queries:
 *    `como exportar pdf para excel`, `como copiar uma tabela do pdf para o
 *    excel` and so on. Those are a different tool. Putting them on the
 *    Excel-to-PDF page would answer a question that page cannot perform, and
 *    would make our own two pages compete for one query. Each question is
 *    therefore filed under the page that actually does the job.
 *
 * 3. KD IS RECORDED AS REPORTED, AND IS NOT TRUSTED.
 *    The same export gave `pdf para word` as Easy/>1K in one view and
 *    Medium/>100K in another. Both are recorded in `kdConflict`. This is the
 *    known failure mode of Ahrefs' free KD on converter terms, already logged
 *    on the English side, where all three "Easy" head terms turned out to have
 *    Adobe, Microsoft and Smallpdf in the live top ten. SERP-check before
 *    committing a page to a head term; the question keywords are the winnable
 *    ones and always have been.
 */

export interface KeywordTarget {
  /** Exact query string. Never edit. */
  term: string;
  /** KD as the export reported it. 'n/a' where it was blank or gated. */
  kd: 'Easy' | 'Medium' | 'Hard' | 'n/a';
  /** Volume band as reported. */
  volume: string;
}

export interface PageKeywords {
  /** Portuguese slug this set belongs to, under /pt/. */
  slug: string;
  /** English tool slug it localises. */
  en: string;
  /** The single term the page is built around. */
  primary: string;
  /** Phrase-match variants worth carrying in body copy and headings. */
  phrase: KeywordTarget[];
  /** Question queries. These become FAQ questions, quoted exactly. */
  questions: KeywordTarget[];
}

/* Recorded, not targeted. Brand-navigational queries for competitors. */
export const excluded: { term: string; why: string }[] = [
  { term: 'ilovepdf pdf para word', why: 'competitor brand navigation' },
  { term: 'i love pdf para word', why: 'competitor brand navigation' },
  { term: 'i love pdf pdf para word', why: 'competitor brand navigation' },
  { term: 'love pdf para word', why: 'competitor brand navigation' },
  { term: 'i love pdf word para pdf', why: 'competitor brand navigation' },
  { term: 'ilovepdf word para pdf', why: 'competitor brand navigation' },
  { term: 'i love word para pdf', why: 'competitor brand navigation' },
  { term: 'ilovepdf excel para pdf', why: 'competitor brand navigation' },
  { term: 'i love pdf excel para pdf', why: 'competitor brand navigation' },
  { term: 'i love excel para pdf', why: 'competitor brand navigation' }
];

/* Terms the export rated inconsistently across two views of the same data. */
export const kdConflict: { term: string; seen: string[] }[] = [
  { term: 'pdf para word', seen: ['Easy / >1000', 'Medium / >100K'] },
  { term: 'converter pdf para word', seen: ['Easy / >1000', 'Medium / >100K'] },
  { term: 'passar pdf para word', seen: ['Easy / >1000', 'Medium / >1000'] },
  { term: 'passar de pdf para word', seen: ['Easy / >1000', 'n/a — gated'] }
];

export const pageKeywords: PageKeywords[] = [
  {
    slug: 'pdf-para-word',
    en: 'pdf-to-word',
    primary: 'pdf para word',
    phrase: [
      { term: 'pdf para word', kd: 'Medium', volume: '>100K' },
      { term: 'converter pdf para word', kd: 'Medium', volume: '>100K' },
      { term: 'conversor de pdf para word', kd: 'Medium', volume: '>10,000' },
      { term: 'converter de pdf para word', kd: 'Medium', volume: '>10,000' },
      { term: 'de pdf para word', kd: 'Medium', volume: '>10,000' },
      { term: 'passar pdf para word', kd: 'Medium', volume: '>1000' },
      { term: 'passar de pdf para word', kd: 'n/a', volume: '>1000' },
      { term: 'transformar pdf para word', kd: 'n/a', volume: '>1000' },
      { term: 'transformar de pdf para word', kd: 'n/a', volume: '>1000' },
      { term: 'mudar pdf para word', kd: 'n/a', volume: '>1000' }
    ],
    questions: [
      { term: 'como converter pdf para word', kd: 'Easy', volume: '>1000' },
      { term: 'como passar pdf para word', kd: 'Easy', volume: '>100' },
      { term: 'como converter de pdf para word', kd: 'Medium', volume: '>100' },
      { term: 'como passar de pdf para word', kd: 'Easy', volume: '>100' },
      { term: 'como mudar pdf para word', kd: 'Medium', volume: '>100' },
      { term: 'como mudar de pdf para word', kd: 'Medium', volume: '>100' },
      { term: 'como converter pdf para word gratuito', kd: 'Easy', volume: '<100' },
      { term: 'como transformar de pdf para word', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    slug: 'word-para-pdf',
    en: 'word-to-pdf',
    primary: 'word para pdf',
    phrase: [
      { term: 'word para pdf', kd: 'Easy', volume: '>100K' },
      { term: 'converter word para pdf', kd: 'Easy', volume: '>100K' },
      { term: 'converter de word para pdf', kd: 'Medium', volume: '>10,000' },
      { term: 'conversor de word para pdf', kd: 'Medium', volume: '>1000' },
      { term: 'de word para pdf', kd: 'Easy', volume: '>1000' },
      { term: 'conversor word para pdf', kd: 'Easy', volume: '>1000' },
      { term: 'transformar de word para pdf', kd: 'Easy', volume: '>1000' },
      { term: 'passar word para pdf', kd: 'n/a', volume: '>1000' }
    ],
    questions: [
      { term: 'como converter word para pdf', kd: 'Easy', volume: '>1000' },
      { term: 'como converter de word para pdf', kd: 'Easy', volume: '>100' },
      { term: 'como passar word para pdf', kd: 'Easy', volume: '>100' }
    ]
  },
  {
    slug: 'excel-para-pdf',
    en: 'excel-to-pdf',
    primary: 'excel para pdf',
    phrase: [
      { term: 'excel para pdf', kd: 'Easy', volume: '>10,000' },
      { term: 'converter excel para pdf', kd: 'Easy', volume: '>1000' },
      { term: 'conversor de excel para pdf', kd: 'Easy', volume: '>1000' },
      { term: 'converter de excel para pdf', kd: 'Easy', volume: '>100' },
      { term: 'de excel para pdf', kd: 'Easy', volume: '>100' },
      { term: 'passar excel para pdf', kd: 'Easy', volume: '>100' },
      { term: 'conversor excel para pdf', kd: 'Easy', volume: '>100' }
    ],
    questions: [
      { term: 'como converter excel para pdf', kd: 'Easy', volume: '<100' }
    ]
  },
  /**
   * Not yet built. These nine questions arrived inside the `Excel para pdf`
   * export but every one of them asks for the opposite conversion, which is a
   * different tool (/pdf-to-excel/). They are parked here so the research is
   * not lost and so nobody files them onto the Excel-to-PDF page later.
   */
  {
    slug: 'pdf-para-excel',
    en: 'pdf-to-excel',
    primary: 'pdf para excel',
    phrase: [],
    questions: [
      { term: 'como converter pdf para excel', kd: 'Easy', volume: '>100' },
      { term: 'como exportar pdf para excel', kd: 'Easy', volume: '<100' },
      { term: 'como passar pdf para excel', kd: 'Easy', volume: '<100' },
      { term: 'como importar pdf para excel', kd: 'Easy', volume: '<100' },
      { term: 'como converter de pdf para excel', kd: 'Easy', volume: '<100' },
      { term: 'como transferir pdf para excel', kd: 'Easy', volume: '<100' },
      { term: 'como copiar uma tabela do pdf para o excel', kd: 'Easy', volume: '<100' },
      { term: 'como alterar pdf para excel', kd: 'n/a', volume: '<100' },
      { term: 'como copiar pdf para excel', kd: 'Easy', volume: '<100' }
    ]
  }
];

export const keywordsBySlug = new Map(pageKeywords.map(p => [p.slug, p]));
