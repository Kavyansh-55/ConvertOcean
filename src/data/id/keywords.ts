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
  { en: 'xml-to-xlsx', seen: 'no keyword ideas (earlier spreadsheet)' },
  { en: 'pdf-to-txt', seen: '10 keywords, all <100 (`pdf ke txt`, `ubah pdf ke txt`…)' }
];

/* Recorded, not targeted. A competitor's brand inside the query. */
export const excluded: { term: string; why: string }[] = [
  { term: 'convertio xlsx ke csv', why: 'brand-navigational (Convertio)' },
  { term: 'i love pdf gabungkan pdf', why: 'brand-navigational (iLovePDF), >1000' },
  { term: 'i love pdf pisahkan pdf', why: 'brand-navigational (iLovePDF), >100' },
  { term: 'pisahkan pdf i love pdf', why: 'brand-navigational (iLovePDF), >100' },
  { term: 'cara kompres pdf di nitro', why: 'a how-to for Nitro PDF desktop software, >100' },
  { term: 'cara kompres ppt canva', why: 'a how-to inside Canva, <100' },
  { term: 'cara kompres file powerpoint 2010', why: 'a how-to inside PowerPoint 2010, <100' }
];

/* The query asks for something the tool does not do. */
export const intentMismatch: { term: string; kd: string; volume: string; wants: string }[] = [
  { term: 'ubah jpg ke png transparan online', kd: 'Easy', volume: '>100',
    wants: 'background removal. Saving a JPG as PNG keeps every pixel, background included — it cannot make anything transparent. The JPG-to-PNG page says so plainly instead of targeting this.' },
  { term: 'gambar ke teks ai', kd: 'n/a', volume: '>100',
    wants: 'an AI tool. The OCR here is Tesseract, a recognition engine; calling it AI to catch the query would be the overclaim this site removes elsewhere.' },
  { term: 'translate gambar ke teks', kd: 'Easy', volume: '>100',
    wants: 'translation (Google Lens style). The tool reads the text; it does not translate it.' },
  { term: 'gabungkan pdf dan jpg', kd: 'Easy', volume: '>1000',
    wants: 'one merge of PDFs and photos together. Merge PDF takes PDFs only — answered in body copy as two honest steps (Gambar ke PDF first, then merge), not targeted as a one-step claim.' },
  { term: 'gabungkan pdf dan foto', kd: 'Easy', volume: '>1000',
    wants: 'same as `gabungkan pdf dan jpg`.' },
  { term: 'cara gabungkan pdf ke word', kd: 'Easy', volume: '<100',
    wants: 'a merged Word file. Nothing here merges into Word from PDF.' },
  { term: 'pisahkan pdf ke jpg', kd: 'n/a', volume: '>100',
    wants: 'PDF pages as JPG images. There is no PDF-to-JPG tool yet (also missing in Portuguese research).' },
  { term: 'kompres pdf ke jpg', kd: 'Easy', volume: '>1000',
    wants: 'PDF to JPG — no tool yet.' },
  { term: 'kompres powerpoint ke word', kd: 'n/a', volume: '<100',
    wants: 'PowerPoint to Word — no tool.' },
  { term: 'kompres powerpoint ke jpg', kd: 'n/a', volume: '<100',
    wants: 'slides as images — no tool.' }
];

/* A real query, filed under a different page than the export put it. */
export const belongsElsewhere: { term: string; kd: string; volume: string; page: string }[] = [
  { term: 'cara convert pdf ke excel', kd: 'Easy', volume: '>100', page: 'pdf-to-excel' },
  { term: 'cara merubah pdf ke excel', kd: 'Easy', volume: '>100', page: 'pdf-to-excel' },
  { term: 'cara mengubah pdf ke excel', kd: 'Easy', volume: '>100', page: 'pdf-to-excel' },
  { term: 'cara ubah pdf ke excel', kd: 'Easy', volume: '>100', page: 'pdf-to-excel' },
  { term: 'cara merubah file pdf ke excel', kd: 'Easy', volume: '>100', page: 'pdf-to-excel' },
  /* "kompres X ke Y" again names a conversion. */
  { term: 'kompres pdf ke word', kd: 'Easy', volume: '>10,000', page: 'pdf-to-word' },
  { term: 'kompres ppt ke pdf', kd: 'Easy', volume: '>100', page: 'pptx-to-pdf' },
  { term: 'kompres powerpoint ke pdf', kd: 'Easy', volume: '<100', page: 'pptx-to-pdf' },
  { term: 'kompres powerpoint to pdf', kd: 'n/a', volume: '<100', page: 'pptx-to-pdf' },
  { term: 'cara gabungkan jpg ke pdf', kd: 'n/a', volume: '<100', page: 'image-to-pdf' }
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
  },
  {
    slug: 'gambar-ke-teks',
    en: 'image-to-text',
    primary: 'gambar ke teks',
    phrase: [
      { term: 'gambar ke teks', kd: 'Easy', volume: '>1000' },
      { term: 'ubah gambar ke teks', kd: 'Hard', volume: '>100' },
      { term: 'konversi gambar ke teks', kd: 'Easy', volume: '>100' },
      { term: 'salin gambar ke teks', kd: 'Easy', volume: '>100' },
      { term: 'convert gambar ke teks', kd: 'Hard', volume: '>100' },
      { term: 'scan gambar ke teks', kd: 'Easy', volume: '>100' },
      { term: 'gambar ke teks gratis', kd: 'n/a', volume: '>100' },
      { term: 'dari gambar ke teks', kd: 'n/a', volume: '>100' },
      { term: 'mengubah gambar ke teks', kd: 'n/a', volume: '>100' }
    ],
    questions: [
      { term: 'cara mengubah gambar ke teks', kd: 'Easy', volume: '<100' },
      /* Answered truthfully: recognise here, copy, paste into Word. */
      { term: 'cara menyalin teks dari gambar ke word', kd: 'Easy', volume: '<100' },
      { term: 'cara mengubah gambar teks ke word', kd: 'Easy', volume: '<100' }
    ]
  },
  {
    slug: 'gabungkan-pdf',
    en: 'merge-pdf',
    primary: 'gabungkan pdf',
    phrase: [
      { term: 'gabungkan pdf', kd: 'Easy', volume: '>100K' },
      { term: 'gabungkan pdf online', kd: 'Easy', volume: '>10,000' },
      { term: 'gabungkan pdf jadi satu', kd: 'Easy', volume: '>1000' },
      { term: 'gabungkan pdf jadi 1', kd: 'Easy', volume: '>1000' },
      { term: 'gabungkan pdf dan pdf', kd: 'Easy', volume: '>1000' },
      { term: 'gabungkan pdf ke pdf', kd: 'Easy', volume: '>1000' },
      { term: 'gabungkan pdf jadi 1 file', kd: 'n/a', volume: '>100' }
    ],
    questions: [
      { term: 'cara gabungkan pdf', kd: 'Easy', volume: '>1000' },
      { term: 'cara gabungkan file pdf', kd: 'Easy', volume: '>1000' },
      { term: 'cara gabungkan pdf jadi satu', kd: 'Easy', volume: '>100' },
      { term: 'cara gabungkan pdf jadi 1 file', kd: 'n/a', volume: '>100' },
      { term: 'cara gabungkan 2 pdf', kd: 'Easy', volume: '<100' },
      { term: 'cara gabungkan 2 pdf jadi 1', kd: 'Easy', volume: '<100' },
      { term: 'cara gabungkan pdf jadi satu file', kd: 'Easy', volume: '<100' },
      { term: 'cara gabungkan 2 file pdf', kd: 'Easy', volume: '<100' },
      { term: 'cara gabungkan file pdf jadi satu', kd: 'Easy', volume: '<100' }
    ]
  },
  {
    slug: 'pisahkan-pdf',
    en: 'split-pdf',
    primary: 'pisahkan pdf',
    phrase: [
      { term: 'pisahkan pdf', kd: 'Easy', volume: '>100K' },
      { term: 'pisahkan pdf online', kd: 'Easy', volume: '>1000' },
      { term: 'pisahkan pdf per halaman', kd: 'Easy', volume: '>1000' },
      { term: 'pisahkan pdf gratis', kd: 'Easy', volume: '>100' },
      { term: 'pisahkan pdf secara online', kd: 'n/a', volume: '>100' },
      { term: 'pisahkan pdf free', kd: 'n/a', volume: '>100' },
      { term: 'pisahkan pdf halaman', kd: 'n/a', volume: '>100' }
    ],
    questions: [
      { term: 'cara pisahkan pdf', kd: 'Easy', volume: '>100' },
      { term: 'cara pisahkan halaman pdf', kd: 'Easy', volume: '>100' },
      { term: 'cara pisahkan file pdf', kd: 'Easy', volume: '>100' },
      { term: 'cara pisahkan pdf per halaman', kd: 'n/a', volume: '<100' },
      { term: 'pisahkan file pdf yang tergabung', kd: 'n/a', volume: '<100' },
      { term: 'cara pisahkan pdf yang tergabung', kd: 'n/a', volume: '<100' },
      { term: 'pisahkan file pdf yang digabungkan', kd: 'n/a', volume: '<100' },
      { term: 'pisahkan pdf yang tergabung', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    slug: 'kompres-pdf',
    en: 'compress-pdf',
    primary: 'kompres pdf',
    phrase: [
      { term: 'kompres pdf', kd: 'Easy', volume: '>1M' },
      /* Size targets: the page's "fit to this size" mode is the answer. */
      { term: 'kompres pdf 1 mb', kd: 'Easy', volume: '>10,000' },
      { term: 'kompres pdf 200kb', kd: 'Easy', volume: '>10,000' },
      { term: 'kompres pdf 500kb', kd: 'Easy', volume: '>10,000' },
      { term: 'kompres pdf online', kd: 'Easy', volume: '>10,000' },
      { term: 'kompres pdf 2 mb', kd: 'Easy', volume: '>10,000' },
      { term: 'kompres pdf 100kb', kd: 'Easy', volume: '>1000' },
      { term: 'kompres pdf 300 kb', kd: 'n/a', volume: '>1000' }
    ],
    questions: [
      { term: 'cara kompres pdf', kd: 'Easy', volume: '>10,000' },
      { term: 'kompres pdf sesuai ukuran yang diinginkan', kd: 'Easy', volume: '>1000' },
      { term: 'cara kompres file pdf', kd: 'Easy', volume: '>1000' },
      { term: 'cara kompres pdf jadi 1 mb', kd: 'Easy', volume: '>100' },
      { term: 'cara kompres ukuran pdf', kd: 'Easy', volume: '>100' },
      { term: 'cara kompres file pdf di hp', kd: 'Easy', volume: '>100' },
      { term: 'kompres pdf sesuai ukuran yang diinginkan gratis', kd: 'Easy', volume: '<100' },
      { term: 'cara kompres pdf di laptop', kd: 'Easy', volume: '<100' },
      { term: 'cara kompres pdf di hp', kd: 'Easy', volume: '<100' },
      { term: 'cara kompres pdf jadi 2 mb', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    /* "kompres ppt" (>10,000) is how Indonesians name it; "kompres
       powerpoint" (>100) is the minority spelling, carried in body copy. */
    slug: 'kompres-ppt',
    en: 'compress-powerpoint',
    primary: 'kompres ppt',
    phrase: [
      { term: 'kompres ppt', kd: 'Easy', volume: '>10,000' },
      { term: 'kompres ppt gratis', kd: 'Easy', volume: '>100' },
      { term: 'kompres ppt jadi 1 mb', kd: 'Easy', volume: '>100' },
      { term: 'kompres ppt online', kd: 'Easy', volume: '>100' },
      { term: 'kompres ppt ke ppt', kd: 'Easy', volume: '>100' },
      { term: 'kompres ppt jadi 10 mb', kd: 'n/a', volume: '>100' },
      { term: 'kompres ppt jadi 5 mb', kd: 'n/a', volume: '>100' },
      { term: 'kompres ppt jadi 2 mb', kd: 'n/a', volume: '>100' },
      { term: 'kompres ppt 1 mb', kd: 'Easy', volume: '>100' },
      { term: 'kompres powerpoint', kd: 'Easy', volume: '>100' },
      { term: 'kompres powerpoint online', kd: 'n/a', volume: '<100' },
      { term: 'kompres powerpoint gratis', kd: 'n/a', volume: '<100' },
      { term: 'kompres powerpoint ke powerpoint', kd: 'n/a', volume: '<100' },
      { term: 'kompres powerpoint 10 mb', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'cara kompres ppt', kd: 'Easy', volume: '>100' },
      { term: 'cara kompres file ppt', kd: 'Easy', volume: '<100' },
      { term: 'cara kompres ppt jadi kecil', kd: 'n/a', volume: '<100' },
      /* Answered truthfully: images are recompressed; embedded video is
         left as it is (ooxml-compress.js only touches PNG/JPEG media). */
      { term: 'cara kompres ppt yang ada videonya', kd: 'n/a', volume: '<100' },
      { term: 'cara kompres ppt di hp', kd: 'Easy', volume: '<100' },
      { term: 'cara kompres ppt di laptop', kd: 'Easy', volume: '<100' },
      { term: 'kompres ppt sesuai ukuran yang diinginkan', kd: 'n/a', volume: '<100' },
      { term: 'cara kompres powerpoint', kd: 'Easy', volume: '<100' },
      { term: 'cara kompres powerpoint online', kd: 'n/a', volume: '<100' }
    ]
  }
];

export const keywordsBySlug = new Map(pageKeywords.map(p => [p.slug, p]));
