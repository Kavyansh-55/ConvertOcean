/**
 * Indonesian keyword targets, recorded verbatim.
 *
 * Supplied by Kavya from Ahrefs (country: Indonesia) as screenshots, from
 * 2026-10-03. Same contract as src/data/pt/keywords.ts: the strings are EXACT
 * and must not be reworded, re-cased or "improved" on the page — altering the
 * wording is what breaks exact match. This file is the source of truth for
 * what each /id/ page targets; nothing here renders directly.
 *
 * ---------------------------------------------------------------------------
 * WHAT THE INDONESIAN EXPORTS TAUGHT, BATCH 1
 * ---------------------------------------------------------------------------
 *
 * 1. "KOMPRES X KE Y" MEANS CONVERT *AND* HIT A SIZE LIMIT.
 *    `kompres excel ke pdf` (>1000) reads like a compression query, but
 *    Google's Indonesian autocomplete completes it with "1 mb", "2 mb",
 *    "landscape" and "tanpa terpotong"; `kompres word ke pdf` with "500 kb",
 *    "200kb", "100kb"; `kompres png ke jpg` with "200 kb", "100kb". The reader
 *    has a portal with a size cap (CPNS/SSCASN, LPDP, school admissions) and
 *    needs the converted file under it. So these are filed under the
 *    CONVERTER, and the page answers the size half honestly: convert here,
 *    then Kompres PDF if the result is still over the limit — or, for photos,
 *    the image resizer's KB mode, which does both in one step.
 *
 * 2. THE QUESTION EXPORTS CROSS DIRECTIONS (as in Portuguese).
 *    `Excel ke PDF` questions are half PDF-to-Excel (`cara convert pdf ke
 *    excel`), and the PNG/JPG question sets are one shared list covering both
 *    directions. Each question is filed under the page that does the job.
 *
 * 3. TOOLS WITH NO INDONESIAN DEMAND ARE NOT BUILT.
 *    Indonesians search developer formats in English (`csv to json`), so the
 *    English page serves them. See `noDemand`.
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
  /** Indonesian slug this set belongs to, under /id/. */
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

/* Researched, and too small to justify an Indonesian page: every term under
   100, or no keyword ideas at all. The English page serves these readers. */
export const noDemand: { en: string; seen: string }[] = [
  { en: 'csv-to-json', seen: '1 keyword, `cara convert csv ke json` <100' },
  { en: 'json-to-csv', seen: 'no keyword ideas' },
  { en: 'json-to-xlsx', seen: 'no keyword ideas' },
  { en: 'xml-to-json', seen: 'no keyword ideas' },
  { en: 'xlsx-to-csv', seen: '15 keywords, all <100 (`ubah xlsx ke csv`, `xlsx ke csv`…)' },
  { en: 'csv-to-xlsx', seen: '13 keywords, all <100 (`ubah csv ke xlsx`, `csv ke xlsx`…)' },
  { en: 'ofx-to-csv', seen: 'no keyword ideas (earlier spreadsheet)' },
  { en: 'qfx-to-csv', seen: 'no keyword ideas (earlier spreadsheet)' },
  { en: 'qbo-to-csv', seen: 'no keyword ideas (earlier spreadsheet)' },
  { en: 'xlsx-to-json', seen: 'no keyword ideas (earlier spreadsheet)' },
  { en: 'xml-to-csv', seen: 'no keyword ideas (earlier spreadsheet)' },
  { en: 'xml-to-xlsx', seen: 'no keyword ideas (earlier spreadsheet)' }
];

/* Recorded, not targeted. A competitor's brand inside the query. */
export const excluded: { term: string; why: string }[] = [
  { term: 'convertio xlsx ke csv', why: 'brand-navigational (Convertio)' }
];

/* The query asks for something the tool does not do. */
export const intentMismatch: { term: string; kd: string; volume: string; wants: string }[] = [
  { term: 'ubah jpg ke png transparan online', kd: 'Easy', volume: '>100',
    wants: 'background removal. Saving a JPG as PNG keeps every pixel, background included — it cannot make anything transparent. The JPG-to-PNG page says so plainly instead of targeting this.' }
];

/* A real query, filed under a different page than the export put it. */
export const belongsElsewhere: { term: string; kd: string; volume: string; page: string }[] = [
  { term: 'cara convert pdf ke excel', kd: 'Easy', volume: '>100', page: 'pdf-to-excel' },
  { term: 'cara merubah pdf ke excel', kd: 'Easy', volume: '>100', page: 'pdf-to-excel' },
  { term: 'cara mengubah pdf ke excel', kd: 'Easy', volume: '>100', page: 'pdf-to-excel' },
  { term: 'cara ubah pdf ke excel', kd: 'Easy', volume: '>100', page: 'pdf-to-excel' },
  { term: 'cara merubah file pdf ke excel', kd: 'Easy', volume: '>100', page: 'pdf-to-excel' }
];

export const pageKeywords: PageKeywords[] = [
  {
    slug: 'excel-ke-pdf',
    en: 'excel-to-pdf',
    primary: 'excel ke pdf',
    phrase: [
      { term: 'ubah excel ke pdf', kd: 'Easy', volume: '>10,000' },
      { term: 'konversi excel ke pdf', kd: 'Easy', volume: '>10,000' },
      { term: 'excel ke pdf', kd: 'Easy', volume: '>10,000' },
      { term: 'convert excel ke pdf', kd: 'Easy', volume: '>1000' },
      { term: 'mengubah excel ke pdf', kd: 'Easy', volume: '>1000' },
      { term: 'merubah excel ke pdf', kd: 'Easy', volume: '>1000' },
      /* Convert-and-fit, not compress: see note 1 above. */
      { term: 'kompres excel ke pdf', kd: 'Easy', volume: '>1000' },
      { term: 'ubah file excel ke pdf', kd: 'Easy', volume: '>100' },
      { term: 'dari excel ke pdf', kd: 'n/a', volume: '>100' }
    ],
    questions: [
      { term: 'cara mengubah excel ke pdf', kd: 'Easy', volume: '>100' },
      { term: 'cara merubah excel ke pdf', kd: 'Easy', volume: '>100' },
      { term: 'cara ubah excel ke pdf', kd: 'Easy', volume: '>100' },
      { term: 'cara excel ke pdf', kd: 'Easy', volume: '>100' },
      { term: 'cara save excel ke pdf', kd: 'Easy', volume: '>100' },
      { term: 'cara mengubah file excel ke pdf', kd: 'n/a', volume: '>100' }
    ]
  },
  {
    slug: 'png-ke-jpg',
    en: 'png-to-jpg',
    primary: 'png ke jpg',
    phrase: [
      { term: 'ubah png ke jpg', kd: 'Easy', volume: '>10,000' },
      { term: 'png ke jpg', kd: 'Easy', volume: '>1000' },
      { term: 'mengubah png ke jpg', kd: 'Easy', volume: '>1000' },
      { term: 'convert png ke jpg', kd: 'Easy', volume: '>1000' },
      { term: 'konversi png ke jpg', kd: 'Easy', volume: '>1000' },
      { term: 'ubah foto png ke jpg', kd: 'Easy', volume: '>1000' },
      { term: 'merubah png ke jpg', kd: 'Easy', volume: '>100' },
      { term: 'ubah file png ke jpg', kd: 'Easy', volume: '>100' },
      /* Convert-and-fit: autocomplete ends it in "200 kb", "100kb". */
      { term: 'kompres png ke jpg', kd: 'Easy', volume: '>100' }
    ],
    questions: [
      { term: 'cara ubah png ke jpg', kd: 'Easy', volume: '>100' },
      { term: 'cara mengubah png ke jpg', kd: 'Easy', volume: '>100' },
      { term: 'cara merubah png ke jpg', kd: 'Easy', volume: '>100' },
      { term: 'cara ubah foto png ke jpg', kd: 'Easy', volume: '<100' },
      { term: 'cara mengubah foto png ke jpg', kd: 'Easy', volume: '<100' },
      { term: 'cara merubah file png ke jpg', kd: 'Easy', volume: '<100' },
      { term: 'cara mengubah file png ke jpg', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    slug: 'jpg-ke-png',
    en: 'jpg-to-png',
    primary: 'jpg ke png',
    phrase: [
      { term: 'ubah jpg ke png', kd: 'Easy', volume: '>1000' },
      { term: 'jpg ke png', kd: 'Easy', volume: '>1000' },
      { term: 'konversi jpg ke png', kd: 'Easy', volume: '>1000' },
      { term: 'merubah jpg ke png', kd: 'Easy', volume: '>100' },
      { term: 'mengubah jpg ke png', kd: 'Easy', volume: '>100' },
      { term: 'ubah foto jpg ke png', kd: 'Easy', volume: '>100' },
      { term: 'convert jpg ke png', kd: 'Easy', volume: '>100' },
      { term: 'ubah format jpg ke png', kd: 'Easy', volume: '>100' },
      { term: 'ubah jpg ke png gratis', kd: 'n/a', volume: '>100' }
    ],
    questions: [
      { term: 'cara ubah jpg ke png', kd: 'Easy', volume: '>100' },
      { term: 'cara mengubah jpg ke png', kd: 'Easy', volume: '>100' },
      { term: 'cara merubah jpg ke png', kd: 'Easy', volume: '<100' },
      { term: 'cara mengubah jpg ke png di hp', kd: 'Easy', volume: '<100' }
    ]
  },
  {
    slug: 'webp-ke-png',
    en: 'webp-to-png',
    primary: 'webp ke png',
    phrase: [
      { term: 'ubah webp ke png', kd: 'Easy', volume: '>100' },
      { term: 'webp ke png', kd: 'Easy', volume: '>100' },
      { term: 'konversi webp ke png', kd: 'Easy', volume: '>100' },
      { term: 'ubah file webp ke png', kd: 'n/a', volume: '<100' },
      { term: 'convert webp ke png', kd: 'Easy', volume: '<100' },
      { term: 'mengubah webp ke png', kd: 'Easy', volume: '<100' },
      { term: 'ubah gambar webp ke png', kd: 'n/a', volume: '<100' },
      { term: 'merubah webp ke png', kd: 'n/a', volume: '<100' },
      { term: 'ubah foto webp ke png', kd: 'n/a', volume: '<100' },
      { term: 'ubah format webp ke png', kd: 'n/a', volume: '<100' }
    ],
    questions: []
  },
  {
    slug: 'png-ke-webp',
    en: 'png-to-webp',
    primary: 'png ke webp',
    phrase: [
      { term: 'png ke webp', kd: 'n/a', volume: '>100' },
      { term: 'ubah png ke webp', kd: 'n/a', volume: '<100' },
      { term: 'convert png ke webp', kd: 'n/a', volume: '<100' },
      { term: 'konversi png ke webp', kd: 'n/a', volume: '<100' },
      { term: 'kompres png ke webp', kd: 'n/a', volume: '<100' }
    ],
    questions: []
  },
  {
    slug: 'txt-ke-pdf',
    en: 'txt-to-pdf',
    primary: 'txt ke pdf',
    phrase: [
      { term: 'ubah txt ke pdf', kd: 'Easy', volume: '>100' },
      { term: 'txt ke pdf', kd: 'Easy', volume: '>100' },
      { term: 'ubah file txt ke pdf', kd: 'n/a', volume: '<100' },
      { term: 'konversi txt ke pdf', kd: 'n/a', volume: '<100' },
      { term: 'mengubah txt ke pdf', kd: 'n/a', volume: '<100' },
      { term: 'convert txt ke pdf', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'cara ubah txt ke pdf', kd: 'n/a', volume: '<100' },
      { term: 'cara mengubah txt ke pdf', kd: 'n/a', volume: '<100' },
      { term: 'cara merubah file txt ke pdf', kd: 'n/a', volume: '<100' },
      { term: 'cara merubah txt ke pdf', kd: 'n/a', volume: '<100' },
      { term: 'cara ubah file txt ke pdf', kd: 'n/a', volume: '<100' }
    ]
  }
];

export const keywordsBySlug = new Map(pageKeywords.map(p => [p.slug, p]));
