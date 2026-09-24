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
  { term: 'i love excel para pdf', why: 'competitor brand navigation' },
  // batch 2
  { term: 'ilovepdf pdf para excel', why: 'competitor brand navigation' },
  { term: 'i love pdf para excel', why: 'competitor brand navigation' },
  { term: 'love pdf para excel', why: 'competitor brand navigation' },
  { term: 'i love pdf ppt para pdf', why: 'competitor brand navigation' },
  { term: 'ilovepdf ppt para pdf', why: 'competitor brand navigation' },
  { term: 'ilovepdf powerpoint para pdf', why: 'competitor brand navigation' }
];

/**
 * Researched, real, and unbuildable: these ask for PDF → PowerPoint, and there
 * is no such tool on this site.
 *
 * Eight of the ten questions returned for `ppt para pdf` and `powerpoint para
 * pdf` are the reverse conversion. The English side hit the identical wall and
 * recorded it in SEO-ROADMAP.md — `how to convert pdf to ppt`, "Easy in AU and
 * has no tool on this site". Two languages independently surfacing the same
 * demand for a tool we do not have is a product signal, not a keyword problem,
 * so it is kept here rather than discarded.
 *
 * Do NOT answer these on /pt/ppt-para-pdf/ or /pt/powerpoint-para-pdf/. A page
 * that ranks for "como converter pdf para powerpoint" and then cannot do it
 * earns a bounce and teaches Google the page does not satisfy the query.
 */
/**
 * Real demand, wrong page type: these want CODE, not a converter.
 *
 * `converter csv para json javascript`, `converter json para csv python`,
 * `converter xml para json java` — someone typing a language name is looking
 * for a snippet to paste into their editor, not for a web tool to click. Put
 * them on a converter page and the visitor bounces immediately, which teaches
 * Google the page does not answer the query.
 *
 * They belong on a guide. The English site already has exactly the right one,
 * `/guides/convert-csv-to-json-in-code/`, so the Portuguese home for these is
 * its translation rather than any tool page in ./index.ts.
 *
 * Every one is <100 volume, so this is a tidy-up for whenever the guides wave
 * happens — not a reason to write a guide now.
 */
export const codeIntent: { term: string; kd: string; volume: string; lang: string }[] = [
  { term: 'converter csv para json javascript', kd: 'n/a', volume: '<100', lang: 'JavaScript' },
  { term: 'converter json para csv python', kd: 'n/a', volume: '<100', lang: 'Python' },
  { term: 'converter xml para json c#', kd: 'n/a', volume: '<100', lang: 'C#' },
  { term: 'converter xml para json java', kd: 'n/a', volume: '<100', lang: 'Java' },
  { term: 'xml para json jquery', kd: 'n/a', volume: '<100', lang: 'jQuery' }
];

export const noToolYet: { term: string; kd: string; volume: string; needs: string }[] = [
  { term: 'como converter pdf para ppt', kd: 'n/a', volume: '<100', needs: 'pdf-to-ppt' },
  { term: 'como posso converter pdf para ppt online?', kd: 'n/a', volume: '<100', needs: 'pdf-to-ppt' },
  { term: 'como converter pdf para ppt online', kd: 'n/a', volume: '<100', needs: 'pdf-to-ppt' },
  { term: 'qual o melhor conversor de pdf para ppt', kd: 'n/a', volume: '<100', needs: 'pdf-to-ppt' },
  { term: 'como converter pdf para powerpoint', kd: 'Easy', volume: '>100', needs: 'pdf-to-ppt' },
  { term: 'como converter de pdf para powerpoint', kd: 'n/a', volume: '<100', needs: 'pdf-to-ppt' },
  { term: 'como passar pdf para powerpoint', kd: 'Easy', volume: '<100', needs: 'pdf-to-ppt' },
  { term: 'qual o melhor conversor de pdf para powerpoint', kd: 'n/a', volume: '<100', needs: 'pdf-to-ppt' }
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
   * Built in batch 2. These nine questions first arrived inside the `Excel para
   * pdf` export, where they did not belong — every one asks for the opposite
   * conversion. Parking them then meant the research survived until the tool
   * they actually describe came round.
   *
   * The strongest page in either batch: `pdf para excel` and `converter pdf
   * para excel` are both Easy at >10,000.
   */
  {
    slug: 'pdf-para-excel',
    en: 'pdf-to-excel',
    primary: 'pdf para excel',
    phrase: [
      { term: 'pdf para excel', kd: 'Easy', volume: '>10,000' },
      { term: 'converter pdf para excel', kd: 'Easy', volume: '>10,000' },
      { term: 'conversor de pdf para excel', kd: 'Easy', volume: '>1000' },
      { term: 'converter de pdf para excel', kd: 'Easy', volume: '>1000' },
      { term: 'de pdf para excel', kd: 'Easy', volume: '>1000' },
      { term: 'exportar pdf para excel', kd: 'Easy', volume: '>1000' },
      { term: 'conversor pdf para excel', kd: 'Easy', volume: '>100' }
    ],
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
  },
  {
    slug: 'pdf-para-txt',
    en: 'pdf-to-txt',
    primary: 'pdf para txt',
    phrase: [
      { term: 'pdf para txt', kd: 'Easy', volume: '>1000' },
      { term: 'converter pdf para txt', kd: 'Easy', volume: '>100' },
      { term: 'conversor de pdf para txt', kd: 'Easy', volume: '<100' },
      { term: 'pdf para txt converter', kd: 'n/a', volume: '<100' },
      { term: 'converter pdf para txt grátis', kd: 'Easy', volume: '<100' },
      { term: 'conversor pdf para txt', kd: 'n/a', volume: '<100' },
      { term: 'converter pdf para txt online', kd: 'n/a', volume: '<100' }
    ],
    /* The Questions tab returned nothing for this one. That is a real result,
       not a gap to fill with invented questions — people search this as a
       transactional term, so the page is built on the phrase set. */
    questions: []
  },
  {
    slug: 'word-para-txt',
    en: 'docx-to-txt',
    primary: 'word para txt',
    phrase: [
      { term: 'word para txt', kd: 'Easy', volume: '<100' },
      { term: 'converter word para txt', kd: 'Easy', volume: '<100' },
      { term: 'converter word para txt online', kd: 'n/a', volume: '<100' },
      { term: 'conversor word para txt', kd: 'n/a', volume: '<100' },
      { term: 'converter texto word para txt', kd: 'n/a', volume: '<100' }
    ],
    /* The Questions tab was empty here too — but two question-form queries were
       sitting in the PHRASE list, which is where Ahrefs put them because they
       contain the seed term. They are questions and they are used as such. */
    questions: [
      { term: 'como converter arquivo word para txt', kd: 'n/a', volume: '<100' },
      { term: 'como converter documento word para txt', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    slug: 'ppt-para-pdf',
    en: 'ppt-to-pdf',
    primary: 'ppt para pdf',
    phrase: [
      { term: 'ppt para pdf', kd: 'Easy', volume: '>1000' },
      { term: 'converter ppt para pdf', kd: 'Easy', volume: '>100' },
      { term: 'conversor de ppt para pdf', kd: 'Easy', volume: '>100' },
      { term: 'de ppt para pdf', kd: 'Easy', volume: '<100' },
      { term: 'converter de ppt para pdf', kd: 'Easy', volume: '<100' },
      { term: 'passar ppt para pdf', kd: 'Easy', volume: '<100' },
      { term: 'conversor ppt para pdf', kd: 'Easy', volume: '<100' }
    ],
    questions: [
      { term: 'como converter ppt para pdf', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    slug: 'powerpoint-para-pdf',
    en: 'pptx-to-pdf',
    primary: 'powerpoint para pdf',
    phrase: [
      { term: 'powerpoint para pdf', kd: 'Easy', volume: '>1000' },
      { term: 'converter powerpoint para pdf', kd: 'Easy', volume: '>1000' },
      { term: 'conversor de powerpoint para pdf', kd: 'Easy', volume: '>100' },
      { term: 'converter de powerpoint para pdf', kd: 'Easy', volume: '>100' },
      { term: 'de powerpoint para pdf', kd: 'Easy', volume: '>100' },
      { term: 'passar powerpoint para pdf', kd: 'Easy', volume: '>100' }
    ],
    questions: [
      { term: 'como converter powerpoint para pdf', kd: 'n/a', volume: '<100' }
    ]
  },

  /* ---------------------------------------------------------------------
     Batch 3 — data/developer converters, 2026-09-24.

     The first batch where the numbers argue against the work. csv↔json comes
     back HARD at <100 volume, which is the worst pairing there is: a contested
     SERP with nothing behind it. Those SERPs are Stack Overflow, dev blogs and
     established tooling, and no amount of on-page work moves a converter into
     them. The pages are still built, because the goal is a complete site in
     Portuguese and a visitor who lands on one still needs it to work — but
     they should carry no ranking expectation, and they are not where effort
     goes next. The xlsx↔csv pair is the only genuinely winnable set here.
     --------------------------------------------------------------------- */
  {
    slug: 'xlsx-para-csv',
    en: 'xlsx-to-csv',
    primary: 'xlsx para csv',
    phrase: [
      { term: 'converter xlsx para csv', kd: 'Easy', volume: '>100' },
      { term: 'xlsx para csv', kd: 'Easy', volume: '>100' },
      { term: 'converter arquivo xlsx para csv', kd: 'Easy', volume: '<100' },
      { term: 'conversor de xlsx para csv', kd: 'Easy', volume: '<100' },
      { term: 'converter de xlsx para csv', kd: 'Easy', volume: '<100' }
    ],
    questions: [
      { term: 'como converter xlsx para csv', kd: 'Easy', volume: '<100' }
    ]
  },
  {
    slug: 'csv-para-xlsx',
    en: 'csv-to-xlsx',
    primary: 'csv para xlsx',
    phrase: [
      { term: 'csv para xlsx', kd: 'Easy', volume: '>100' },
      { term: 'converter csv para xlsx', kd: 'Easy', volume: '>100' },
      { term: 'conversor de csv para xlsx', kd: 'Easy', volume: '>100' },
      { term: 'conversor csv para xlsx', kd: 'n/a', volume: '>100' }
    ],
    questions: [
      { term: 'como converter csv para xlsx', kd: 'Easy', volume: '<100' }
    ]
  },
  {
    slug: 'csv-para-json',
    en: 'csv-to-json',
    primary: 'csv para json',
    phrase: [
      { term: 'csv para json', kd: 'Hard', volume: '<100' },
      { term: 'converter csv para json', kd: 'Hard', volume: '<100' },
      { term: 'conversor de csv para json', kd: 'n/a', volume: '<100' },
      { term: 'converter arquivo csv para json', kd: 'n/a', volume: '<100' }
    ],
    questions: []
  },
  {
    slug: 'json-para-csv',
    en: 'json-to-csv',
    primary: 'json para csv',
    phrase: [
      { term: 'json para csv', kd: 'Hard', volume: '>100' },
      { term: 'converter json para csv', kd: 'Hard', volume: '<100' },
      { term: 'conversor de json para csv', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'como converter json para csv', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    slug: 'xml-para-json',
    en: 'xml-to-json',
    primary: 'xml para json',
    phrase: [
      { term: 'converter xml para json', kd: 'Easy', volume: '<100' },
      { term: 'xml para json', kd: 'Easy', volume: '<100' }
    ],
    questions: []
  },
  {
    slug: 'json-para-xlsx',
    en: 'json-to-xlsx',
    primary: 'json para xlsx',
    phrase: [
      { term: 'json para xlsx', kd: 'n/a', volume: '<100' },
      { term: 'converter json para xlsx', kd: 'n/a', volume: '<100' }
    ],
    questions: []
  }
];

export const keywordsBySlug = new Map(pageKeywords.map(p => [p.slug, p]));
