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
  { term: 'ilovepdf powerpoint para pdf', why: 'competitor brand navigation' },
  // batch 4
  { term: 'ilovepdf jpg para png', why: 'competitor brand navigation' },
  { term: 'png para jpg ilovepdf', why: 'competitor brand navigation' },
  /* batch 5. The merge cluster is where brand searching is heaviest in the
     whole programme — several of these carry >10,000 volume, which measures
     how completely iLovePDF owns the word "juntar" in Brazil. Still not ours
     to take: the searcher has already chosen where they are going. */
  { term: 'unir pdf ilove', why: 'competitor brand navigation' },
  { term: 'unir pdf love', why: 'competitor brand navigation' },
  { term: 'unir pdf ilovepdf', why: 'competitor brand navigation' },
  { term: 'unir pdf i love pdf', why: 'competitor brand navigation' },
  { term: 'i love pdf unir pdf', why: 'competitor brand navigation' },
  { term: 'juntar pdf i love pdf', why: 'competitor brand navigation' },
  { term: 'juntar pdf ilove', why: 'competitor brand navigation' },
  { term: 'juntar pdf ilovepdf', why: 'competitor brand navigation' },
  { term: 'juntar pdf love', why: 'competitor brand navigation' },
  { term: 'ilovepdf juntar pdf', why: 'competitor brand navigation' },
  { term: 'i love pdf juntar pdf', why: 'competitor brand navigation' },
  { term: 'ilove juntar pdf', why: 'competitor brand navigation' },
  { term: 'mesclar pdf adobe', why: 'competitor brand navigation (Adobe)' }
];

/**
 * Right words, wrong job: this asks for background removal, not a conversion.
 *
 * `jpg para png sem fundo` — "sem fundo" means "without background" — rests on
 * a widespread belief that PNG *is* transparency, so converting to PNG must
 * strip the background. It does not. A JPG has no alpha channel and therefore
 * no transparency to carry over; converting it produces a PNG whose background
 * is just as opaque as before. Removing it requires actually detecting the
 * subject, which is a different tool that this site does not have.
 *
 * At >100 volume this is the second-largest missing-tool signal in the whole
 * programme, after PDF → PowerPoint. It is NOT targeted — a page that ranks for
 * it and then cannot deliver earns a bounce. The misconception behind it IS
 * worth correcting, so /pt/jpg-para-png/ answers it in its own words rather
 * than quoting the query as a heading.
 */
export const intentMismatch: { term: string; kd: string; volume: string; wants: string }[] = [
  { term: 'jpg para png sem fundo', kd: 'n/a', volume: '>100', wants: 'background removal, not format conversion' }
];

/**
 * Not Portuguese. `que es mejor para imprimir png o jpg` is Spanish — the
 * Portuguese would be "qual é melhor". Ahrefs leaked it into a pt keyword set,
 * which is worth knowing because it will happen again.
 *
 * Kept rather than deleted: Spanish is the next locale, and this is a free
 * preview of how that question is phrased there.
 */
export const wrongLanguage: { term: string; language: string }[] = [
  { term: 'que es mejor para imprimir png o jpg', language: 'es' }
];

/**
 * Not a query — a scraped page title that leaked into the keyword export.
 *
 * `unir pdf – unir pdfs online, grátis` carries an en-dash and a trailing
 * comma clause: that is a <title> tag, almost certainly a competitor's, not
 * something a person typed into a search box. Recorded so it is not mistaken
 * for a long-tail opportunity.
 */
export const notAQuery: { term: string; why: string }[] = [
  { term: 'unir pdf – unir pdfs online, grátis', why: 'scraped <title> tag, not a search query' }
];

/**
 * Ambiguous intent — recorded, used only in body copy, never as a heading.
 *
 * `traduzir imagem para texto` (>100). In Brazilian usage "traduzir" often
 * means simply "convert", which would be OCR and exactly what the tool does.
 * But its literal meaning is translate between languages, which the tool does
 * NOT do. Roughly half this traffic would arrive wanting something we cannot
 * give, so it is not worth a heading or an FAQ that promises it.
 */
export const ambiguousIntent: { term: string; kd: string; volume: string; why: string }[] = [
  { term: 'traduzir imagem para texto', kd: 'Easy', volume: '>100', why: '"traduzir" may mean translate between languages; OCR does not translate' }
];

/**
 * Researched, recorded, and deliberately NOT used as FAQ headings.
 *
 * Batch 5 returned far more question variants than a page can carry without
 * becoming a list of restatements. `como juntar dois pdf`, `como juntar 2 pdf
 * em 1`, `como juntar dois arquivos pdf` and `como juntar dois pdf em um só`
 * are one question asked four ways; four headings with four near-identical
 * answers is the near-duplicate pattern this site already audits against, and
 * it reads to a human as keyword stuffing.
 *
 * They are covered by the body copy of their page instead, which is where
 * phrase variants belong. Nothing is lost: the page targets the cluster, it
 * just does not repeat itself in ten headings to do so. Kavya can overrule
 * this — the terms are all here, unaltered.
 */
export const coveredInBodyCopy: { term: string; page: string }[] = [
  { term: 'como juntar pdf', page: 'juntar-pdf' },
  { term: 'como juntar 2 pdf em 1', page: 'juntar-pdf' },
  { term: 'como juntar dois pdf em um só', page: 'juntar-pdf' },
  { term: 'como juntar dois arquivos pdf', page: 'juntar-pdf' },
  { term: 'como juntar arquivos pdf em um só', page: 'juntar-pdf' },
  { term: 'como unir dois pdf', page: 'juntar-pdf' },
  { term: 'como unir dois arquivos pdf', page: 'juntar-pdf' },
  { term: 'como unir arquivos pdf', page: 'juntar-pdf' },
  { term: 'como unir pdf em um só', page: 'juntar-pdf' },
  { term: 'como unir varios arquivos pdf em um só', page: 'juntar-pdf' },
  { term: 'como unir documentos em pdf', page: 'juntar-pdf' },
  { term: 'como mesclar dois arquivos pdf', page: 'juntar-pdf' },
  { term: 'como mesclar arquivos pdf', page: 'juntar-pdf' },
  { term: 'o que significa mesclar pdf', page: 'juntar-pdf' },
  { term: 'como extrair texto de imagem', page: 'imagem-para-texto' },
  { term: 'como extrair o texto de uma imagem', page: 'imagem-para-texto' },
  { term: 'como extrair um texto de uma imagem', page: 'imagem-para-texto' },
  { term: 'como converter uma imagem em texto', page: 'imagem-para-texto' },
  { term: 'programa que passa imagem para texto', page: 'imagem-para-texto' }
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
  },

  /* ---------------------------------------------------------------------
     Batch 4 — image formats, 2026-09-24. The strongest set so far.

     `jpg para png`, `webp para png` and `converter webp para png` are all Easy
     at >10,000 — the highest-volume winnable terms in the whole programme, and
     consumer rather than office queries, which fits a heavily mobile Brazilian
     audience.

     The comparison questions (`qual a diferença de png para jpg`, `qual é
     melhor para imprimir jpg ou png`) are answered on the tool pages because
     someone converting genuinely asks them there — but their natural home is a
     guide, and the English site already has /guides/png-vs-jpg/. Translating
     that guide would serve them better than a FAQ entry can.
     --------------------------------------------------------------------- */
  {
    slug: 'jpg-para-png',
    en: 'jpg-to-png',
    primary: 'jpg para png',
    phrase: [
      { term: 'jpg para png', kd: 'Easy', volume: '>10,000' },
      { term: 'converter jpg para png', kd: 'Easy', volume: '>1000' },
      { term: 'converter de jpg para png', kd: 'Easy', volume: '>100' },
      { term: 'conversor de jpg para png', kd: 'Easy', volume: '>100' },
      { term: 'converter imagem jpg para png', kd: 'Easy', volume: '>100' },
      { term: 'de jpg para png', kd: 'Easy', volume: '>100' },
      { term: 'transformar jpg para png', kd: 'Easy', volume: '>100' },
      { term: 'conversor jpg para png', kd: 'Easy', volume: '<100' }
    ],
    questions: [
      { term: 'como converter jpg para png', kd: 'n/a', volume: '<100' },
      { term: 'qual a diferença de jpg para png', kd: 'Easy', volume: '<100' },
      { term: 'como mudar a extensão de um arquivo jpg para png', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    slug: 'png-para-jpg',
    en: 'png-to-jpg',
    primary: 'png para jpg',
    phrase: [
      { term: 'png para jpg', kd: 'Easy', volume: '>1000' },
      { term: 'converter png para jpg', kd: 'Easy', volume: '>1000' },
      { term: 'converter de png para jpg', kd: 'Easy', volume: '>100' },
      { term: 'converter imagem png para jpg', kd: 'Easy', volume: '>100' },
      { term: 'conversor de png para jpg', kd: 'Easy', volume: '>100' },
      { term: 'de png para jpg', kd: 'Easy', volume: '>100' },
      { term: 'mudar png para jpg', kd: 'Easy', volume: '>100' },
      { term: 'transformar png para jpg', kd: 'Easy', volume: '>100' },
      { term: 'conversor png para jpg', kd: 'Easy', volume: '<100' }
    ],
    questions: [
      { term: 'como converter png para jpg', kd: 'n/a', volume: '<100' },
      { term: 'qual a diferença de png para jpg', kd: 'Easy', volume: '<100' },
      { term: 'como mudar de png para jpg', kd: 'n/a', volume: '<100' },
      { term: 'onde converter png para jpg com eficiência', kd: 'n/a', volume: '<100' },
      { term: 'qual é melhor para imprimir jpg ou png', kd: 'n/a', volume: '<100' },
      { term: 'para postar no instagram é melhor png ou jpg', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    slug: 'webp-para-png',
    en: 'webp-to-png',
    primary: 'webp para png',
    phrase: [
      { term: 'webp para png', kd: 'Easy', volume: '>10,000' },
      { term: 'converter webp para png', kd: 'Easy', volume: '>10,000' },
      { term: 'converter imagem webp para png', kd: 'Easy', volume: '>1000' },
      { term: 'converter arquivo webp para png', kd: 'Easy', volume: '>100' },
      { term: 'arquivo webp para png', kd: 'Easy', volume: '>100' },
      { term: 'converter de webp para png', kd: 'Easy', volume: '>100' },
      { term: 'conversor de webp para png', kd: 'Easy', volume: '>100' },
      { term: 'de webp para png', kd: 'Easy', volume: '>100' },
      { term: 'imagem webp para png', kd: 'Easy', volume: '>100' },
      { term: 'conversor webp para png', kd: 'Easy', volume: '<100' }
    ],
    questions: [
      { term: 'como converter imagem webp para png', kd: 'Easy', volume: '<100' }
    ]
  },
  {
    slug: 'png-para-webp',
    en: 'png-to-webp',
    primary: 'png para webp',
    phrase: [
      { term: 'converter png para webp', kd: 'Easy', volume: '>1000' },
      { term: 'png para webp', kd: 'Easy', volume: '>1000' },
      { term: 'converter de png para webp', kd: 'Easy', volume: '>100' },
      { term: 'converter imagem png para webp', kd: 'Easy', volume: '>100' },
      { term: 'conversor png para webp', kd: 'Easy', volume: '<100' },
      { term: 'conversor de png para webp', kd: 'Easy', volume: '<100' },
      { term: 'de png para webp', kd: 'n/a', volume: '<100' },
      { term: 'converter png para webp sem perder qualidade', kd: 'n/a', volume: '<100' },
      { term: 'transformar png para webp', kd: 'n/a', volume: '<100' }
    ],
    /* Its only returned question — `como converter imagem webp para png` — is
       the opposite conversion and belongs to webp-para-png, where it is used. */
    questions: []
  },

  /* ---------------------------------------------------------------------
     Batch 5 — txt→pdf, OCR and merge, 2026-09-24.

     THREE EXPORTS, ONE TOOL — twice. `juntar pdf`, `unir pdf` and `mesclar
     pdf` are three Portuguese words for merging, and all three are the same
     tool. So are `imagem para texto`, `extrair texto de imagem` and `converter
     imagem em texto`. Building a page per export would split one page's
     authority across three near-identical URLs that then compete with each
     other — textbook cannibalisation. Each cluster gets ONE page, slugged on
     the highest-volume term, covering the synonyms in its copy.

     The head terms here are the hardest in the programme: `juntar pdf` is Hard
     at >1M, `unir pdf` Hard at >100K, `mesclar pdf` Hard at >10,000. Those are
     not winnable and are not the target. The questions are: `como juntar
     varios pdf em um só` is EASY at >1000, which is the single best
     question-keyword anyone has sent. That is the site's own rule holding
     again — the winnable ones are always the how-to questions.
     --------------------------------------------------------------------- */
  {
    slug: 'juntar-pdf',
    en: 'merge-pdf',
    primary: 'juntar pdf',
    phrase: [
      { term: 'juntar pdf', kd: 'Hard', volume: '>1M' },
      { term: 'juntar pdf online', kd: 'Hard', volume: '>10,000' },
      { term: 'juntar pdf gratis', kd: 'Medium', volume: '>10,000' },
      { term: 'juntar pdf grátis', kd: 'Medium', volume: '>1000' },
      { term: 'juntar pdf gratuito', kd: 'n/a', volume: '>1000' },
      { term: 'juntar pdf em um só', kd: 'n/a', volume: '>1000' },
      { term: 'juntar pdf e jpg', kd: 'n/a', volume: '>1000' },
      { term: 'unir pdf', kd: 'Hard', volume: '>100K' },
      { term: 'unir pdf online', kd: 'Hard', volume: '>1000' },
      { term: 'unir pdf gratis', kd: 'Medium', volume: '>1000' },
      { term: 'unir pdf em um só', kd: 'Hard', volume: '>100' },
      { term: 'unir pdf gratuito', kd: 'Medium', volume: '>100' },
      { term: 'unir pdf online gratuito', kd: 'Hard', volume: '>100' },
      { term: 'mesclar pdf', kd: 'Hard', volume: '>10,000' },
      { term: 'mesclar pdf gratis', kd: 'Easy', volume: '>1000' },
      { term: 'mesclar pdf online', kd: 'Hard', volume: '>100' },
      { term: 'mesclar pdf gratuito', kd: 'Easy', volume: '<100' },
      { term: 'ferramenta de mesclar pdf', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'como juntar varios pdf em um só', kd: 'Easy', volume: '>1000' },
      { term: 'como juntar arquivos pdf', kd: 'Medium', volume: '>1000' },
      { term: 'como juntar dois pdf', kd: 'Easy', volume: '>100' },
      { term: 'como juntar pdf em um só', kd: 'Easy', volume: '>100' },
      { term: 'como juntar fotos em pdf', kd: 'Medium', volume: '>100' },
      { term: 'como unir pdf', kd: 'Medium', volume: '>100' },
      { term: 'como unir varios pdf em um só', kd: 'n/a', volume: '>100' },
      { term: 'como mesclar pdf', kd: 'Medium', volume: '>100' },
      { term: 'o que é mesclar pdf', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    slug: 'imagem-para-texto',
    en: 'image-to-text',
    primary: 'converter imagem em texto',
    phrase: [
      { term: 'converter imagem em texto', kd: 'Easy', volume: '>10,000' },
      { term: 'imagem para texto', kd: 'Easy', volume: '>1000' },
      { term: 'extrair texto de imagem', kd: 'Easy', volume: '>1000' },
      { term: 'converter imagem para texto', kd: 'Easy', volume: '>100' },
      { term: 'conversor de imagem para texto', kd: 'Easy', volume: '>100' },
      { term: 'transcrever imagem para texto', kd: 'Easy', volume: '>100' },
      { term: 'leitor de imagem para texto', kd: 'Easy', volume: '>100' },
      { term: 'imagem para texto online', kd: 'Easy', volume: '>100' },
      { term: 'transcrição de imagem para texto', kd: 'Easy', volume: '>100' },
      { term: 'de imagem para texto', kd: 'Easy', volume: '>100' },
      { term: 'converter imagem em texto editável', kd: 'Easy', volume: '>100' },
      { term: 'converter imagem em texto word', kd: 'Easy', volume: '>100' },
      { term: 'extrair texto de imagem online grátis', kd: 'Easy', volume: '>100' },
      { term: 'extrair texto de imagem online', kd: 'Easy', volume: '>100' },
      { term: 'extrair texto de imagem pdf', kd: 'Easy', volume: '<100' },
      { term: 'ia para extrair texto de imagem', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'como converter imagem em texto', kd: 'Easy', volume: '>100' },
      { term: 'como extrair texto de uma imagem', kd: 'Easy', volume: '>100' },
      { term: 'como converter imagem em texto editável', kd: 'n/a', volume: '<100' },
      { term: 'como converter texto de imagem para word', kd: 'n/a', volume: '<100' },
      { term: 'como transcrever uma imagem para texto', kd: 'Easy', volume: '<100' },
      { term: 'aplicativo que converte imagem para texto', kd: 'n/a', volume: '<100' },
      { term: 'programa que converte imagem para texto', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    slug: 'txt-para-pdf',
    en: 'txt-to-pdf',
    primary: 'txt para pdf',
    phrase: [
      { term: 'txt para pdf', kd: 'Easy', volume: '>1000' },
      { term: 'converter txt para pdf', kd: 'Easy', volume: '>100' },
      { term: 'conversor de txt para pdf', kd: 'Easy', volume: '>100' },
      { term: 'converter arquivo txt para pdf', kd: 'Easy', volume: '>100' },
      { term: 'conversor txt para pdf', kd: 'n/a', volume: '>100' },
      { term: 'arquivo txt para pdf', kd: 'Easy', volume: '>100' },
      { term: '.txt para pdf', kd: 'n/a', volume: '<100' },
      { term: 'converter de txt para pdf', kd: 'Easy', volume: '<100' },
      { term: 'de txt para pdf', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'como converter txt para pdf', kd: 'n/a', volume: '<100' }
    ]
  }
];

export const keywordsBySlug = new Map(pageKeywords.map(p => [p.slug, p]));
