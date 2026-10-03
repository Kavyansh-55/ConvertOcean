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
  { en: 'pdf-to-txt', seen: '10 keywords, all <100 (`pdf ke txt`, `ubah pdf ke txt`…)' },

  { en: 'invoice-generator', seen: '`pembuat faktur` family: 7 keywords, all <100, and `aplikasi pembuat faktur pajak` is regulated. Re-research as `contoh invoice` / `template invoice` / `format invoice` before deciding' },
  { en: 'receipt-generator', seen: '`buat tanda terima` family: 9 keywords, all <100. "tanda terima" is a delivery acknowledgment; re-research as `kwitansi` (`contoh kwitansi`, `kwitansi pembayaran`) before deciding' },
  { en: 'profit-margin-calculator', seen: '`hitung margin laba`: 3 keywords, all <100. Re-research `rumus margin keuntungan` / `cara menghitung margin` before deciding' },
  { en: 'break-even-calculator', seen: '`hitung titik impas`: 5 keywords, all <100. Indonesians say BEP — re-research `cara menghitung bep` / `rumus bep` before deciding' },

  { en: 'csv-to-pdf', seen: '22 keywords, all <100 (`ubah csv ke pdf`, `csv ke pdf`…); its questions are PDF-to-CSV, the other direction' },
  { en: 'sales-tax-calculator', seen: '`kalkulator/hitung pajak penjualan` returns only property and gold sale tax (rumah, tanah, emas), all <100 — a different tax this calculator does not model. Re-research as PPN (`kalkulator ppn`, `cara menghitung ppn`) and verify current PPN rules from DJP before building' },

  { en: 'xls-to-json', seen: 'no keyword ideas (screenshot labelled XLSX ke JSON)' },
  { en: 'xls-to-csv', seen: '21 keywords, all <100 (`xls ke csv`, `ubah xls ke csv`…)' },
  { en: 'avif-to-png', seen: '6 keywords, all <100' },
  { en: 'svg-to-png', seen: '14 keywords, all <100' },
  { en: 'svg-to-jpg', seen: '13 keywords, all <100' },
  { en: 'svg-to-webp', seen: 'no keyword ideas' },
  { en: 'exif-viewer', seen: 'no keyword ideas for `penampil exif`' },
  { en: 'exif-remover', seen: 'no keyword ideas for `penghapus exif`' },
  { en: 'docx-to-txt', seen: '9 keywords for `word ke txt`, all <100' },

  { en: 'split-excel', seen: '`pisahkan excel` family: 3 keywords + 1 question, all <100' },
  { en: 'merge-txt', seen: '`gabungkan teks` returns only Excel/Canva formula queries (`rumus gabungkan teks di excel`), all <100' },
  { en: 'split-txt', seen: '`pisahkan teks` returns only Excel formula queries (`rumus pisahkan teks di excel`), all <100' },

  { en: 'split-pptx', seen: '`pisahkan ppt`: 2 keywords, both <100; `gabungkan powerpoint` likewise' },
  { en: 'json-formatter', seen: 'no keyword ideas for `pemformat json` — developers search it in English' }
];

/* Recorded, not targeted. A competitor's brand inside the query. */
export const excluded: { term: string; why: string }[] = [
  { term: 'convertio xlsx ke csv', why: 'brand-navigational (Convertio)' },
  { term: 'i love pdf gabungkan pdf', why: 'brand-navigational (iLovePDF), >1000' },
  { term: 'i love pdf pisahkan pdf', why: 'brand-navigational (iLovePDF), >100' },
  { term: 'pisahkan pdf i love pdf', why: 'brand-navigational (iLovePDF), >100' },
  { term: 'cara kompres pdf di nitro', why: 'a how-to for Nitro PDF desktop software, >100' },
  { term: 'cara kompres ppt canva', why: 'a how-to inside Canva, <100' },
  { term: 'cara kompres file powerpoint 2010', why: 'a how-to inside PowerPoint 2010, <100' },

  { term: 'cara kompres file word 2010', why: 'a how-to inside Word 2010, <100' },

  { term: 'gabungkan gambar ai', why: 'wants an AI image tool, <100' },
  { term: 'ai pisahkan gambar', why: 'wants an AI tool, <100' },
  { term: 'cara gabungkan teks di canva', why: 'a how-to inside Canva, <100' },

  { term: 'i love pdf gabungkan word', why: 'brand-navigational (iLovePDF), <100' },
  { term: 'pisahkan word i love pdf', why: 'brand-navigational (iLovePDF), <100' },
  { term: 'pisahkan word i love', why: 'brand-navigational (iLovePDF), <100' },
  { term: 'pisahkan word i love word', why: 'brand-navigational, <100' },
  { term: 'i love pdf pisahkan word', why: 'brand-navigational (iLovePDF), <100' },
  { term: 'ai penghitung kata', why: 'wants an AI tool, <100' },

  { term: 'aspose products ubah ukuran gambar', why: 'brand-navigational (Aspose), <100' },
  { term: 'ai pengubah ukuran gambar', why: 'wants an AI tool, <100' }
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
    wants: 'slides as images — no tool.' },

  { term: 'kompres excel ke word', kd: 'Easy', volume: '>100', wants: 'Excel to Word — no tool.' },
  { term: 'kompres word ke jpg', kd: 'Easy', volume: '>100', wants: 'Word pages as images — no tool.' },
  { term: 'kalkulator persentase lemak tubuh', kd: 'Easy', volume: '<100', wants: 'a body-fat calculator, not a percentage calculator.' },

  { term: 'kalkulator pajak penjualan rumah', kd: 'n/a', volume: '<100', wants: 'tax on selling a house (PPh final + BPHTB), not sales tax/PPN.' },
  { term: 'cara hitung pajak penjualan rumah', kd: 'Easy', volume: '<100', wants: 'property sale tax.' },
  { term: 'cara hitung pajak penjualan emas', kd: 'n/a', volume: '<100', wants: 'tax on selling gold.' },
  { term: 'cara hitung pajak penjualan tanah', kd: 'n/a', volume: '<100', wants: 'land sale tax.' },
  { term: 'cara merubah pdf ke csv pajak', kd: 'Easy', volume: '<100', wants: 'PDF to CSV (tax-office data) — the opposite of CSV to PDF; no tool.' },
  { term: 'bagaimana merubah file pdf ke csv', kd: 'n/a', volume: '<100', wants: 'PDF to CSV — no tool.' },

  { term: 'cara mengubah pdf ke ppt', kd: 'Easy', volume: '>100', wants: 'PDF to PowerPoint — no tool (also missing in Portuguese).' },
  { term: 'cara ubah pdf ke ppt', kd: 'Easy', volume: '>100', wants: 'PDF to PowerPoint — no tool.' },
  { term: 'cara merubah pdf ke ppt', kd: 'Easy', volume: '>100', wants: 'PDF to PowerPoint — no tool.' },
  { term: 'cara mengubah pdf ke ppt di laptop', kd: 'Easy', volume: '<100', wants: 'PDF to PowerPoint — no tool.' },
  { term: 'cara mengubah file pdf ke ppt', kd: 'Easy', volume: '<100', wants: 'PDF to PowerPoint — no tool.' },
  { term: 'cara konversi pdf ke ppt', kd: 'Easy', volume: '<100', wants: 'PDF to PowerPoint — no tool.' },
  { term: 'cara convert pdf ke ppt', kd: 'Easy', volume: '<100', wants: 'PDF to PowerPoint — no tool.' },
  { term: 'cara mengubah pdf ke powerpoint', kd: 'Easy', volume: '<100', wants: 'PDF to PowerPoint — no tool.' },
  { term: 'cara merubah pdf ke powerpoint', kd: 'Easy', volume: '<100', wants: 'PDF to PowerPoint — no tool.' },
  { term: 'cara memasukkan pdf ke powerpoint', kd: 'n/a', volume: '<100', wants: 'inserting a PDF into a slide — a PowerPoint how-to.' },
  { term: 'gabung ppt ke pdf', kd: 'Easy', volume: '>100',
    wants: 'several decks (autocomplete: "gabung word dan ppt ke pdf") in one PDF. Two honest steps — convert each, then Gabungkan PDF — carried in body copy, not claimed as one step.' },
  { term: 'cara gabungkan kolom di excel', kd: 'Easy', volume: '<100', wants: 'merging columns inside a sheet — an Excel feature (& or CONCAT), not a file merge.' },
  { term: 'cara gabungkan 2 kolom excel', kd: 'n/a', volume: '<100', wants: 'merging columns — an Excel feature.' },
  { term: 'gabungkan excel ke pdf', kd: 'Medium', volume: '<100', wants: 'several workbooks in one PDF — convert, then Gabungkan PDF.' },
  { term: 'gabungkan excel dan pdf', kd: 'n/a', volume: '<100', wants: 'mixing formats in one file — no tool.' },
  { term: 'gabungkan excel dan word', kd: 'n/a', volume: '<100', wants: 'mixing formats in one file — no tool.' },
  { term: 'pisahkan gambar pdf', kd: 'n/a', volume: '<100', wants: 'images pulled out of a PDF — no tool.' },
  { term: 'pisahkan gambar di pdf', kd: 'n/a', volume: '<100', wants: 'images pulled out of a PDF — no tool.' },

  { term: 'gabungkan word ke pdf', kd: 'Easy', volume: '>100', wants: 'several Word files as one PDF — Word ke PDF each, then Gabungkan PDF; carried in body copy as two steps.' },
  { term: 'gabungkan word dan pdf', kd: 'Easy', volume: '>100', wants: 'mixing Word and PDF in one file — convert the Word file first, then Gabungkan PDF.' },
  { term: 'cara gabungkan tabel di word', kd: 'Easy', volume: '<100', wants: 'merging tables inside one document — a Word feature.' },
  { term: 'cara gabungkan kolom di word', kd: 'n/a', volume: '<100', wants: 'merging columns/cells — a Word feature.' },
  { term: 'cara gabungkan pdf ke word', kd: 'Easy', volume: '<100', wants: 'PDF into Word — PDF ke Word, then Gabungkan Word.' },
  { term: 'cara gabungkan file pdf ke word', kd: 'n/a', volume: '<100', wants: 'as above.' },
  { term: 'pisahkan word per halaman', kd: 'n/a', volume: '<100',
    wants: 'a split at page boundaries. A .docx has no fixed pages — Word lays them out when it displays the file — so Pisahkan Word splits by Heading 1 or by paragraph count (SplitWord.astro has exactly those two modes). Per page: Word ke PDF, then Pisahkan PDF per halaman. Said on the page, not claimed.' },
  { term: 'pisahkan word to pdf', kd: 'n/a', volume: '<100', wants: 'a PDF result — Word ke PDF, then Pisahkan PDF.' },
  { term: 'gabungkan ppt ke pdf', kd: 'Easy', volume: '<100', wants: 'decks into one PDF — convert each, then Gabungkan PDF.' },
  { term: 'gabungkan ppt dan pdf', kd: 'Easy', volume: '<100', wants: 'mixing formats — no tool.' },

  { term: 'cara memasukkan gambar ke pdf', kd: 'Easy', volume: '<100', wants: 'inserting an image into an existing PDF — PDF editing, no tool. (Two steps work: Gambar ke PDF, then Gabungkan PDF.)' },
  { term: 'cara memasukan gambar ke pdf', kd: 'n/a', volume: '<100', wants: 'as above (spelling variant).' },
  { term: 'cara menyimpan gambar dari pdf ke galeri hp', kd: 'Easy', volume: '<100', wants: 'images extracted from a PDF — no tool.' },
  { term: 'cara ubah ukuran gambar di word', kd: 'Easy', volume: '<100', wants: 'resizing a picture inside a Word document — a Word feature.' },
  { term: 'pengubah ukuran gambar untuk windows', kd: 'n/a', volume: '<100', wants: 'desktop software.' },
  { term: 'software pengubah ukuran gambar', kd: 'n/a', volume: '<100', wants: 'desktop software.' }
];

/* A real query, filed under a different page than the export put it. */
export const belongsElsewhere: { term: string; kd: string; volume: string; page: string }[] = [
  /* "kompres X ke Y" again names a conversion. */
  { term: 'kompres powerpoint to pdf', kd: 'n/a', volume: '<100', page: 'pptx-to-pdf' },
  { term: 'cara gabungkan jpg ke pdf', kd: 'n/a', volume: '<100', page: 'image-to-pdf' },

  { term: 'kompres excel to pdf', kd: 'Easy', volume: '<100', page: 'excel-to-pdf' },
  { term: 'cara kompres word ke pdf', kd: 'Easy', volume: '<100', page: 'word-to-pdf' },
  { term: 'cara kompres file word ke pdf', kd: 'n/a', volume: '<100', page: 'word-to-pdf' },
  { term: 'cara kompres pdf ke word', kd: 'Medium', volume: '<100', page: 'pdf-to-word' },
  { term: 'cara kompres file pdf ke word', kd: 'Easy', volume: '<100', page: 'pdf-to-word' }
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
  },

  {
    slug: 'kompres-excel',
    en: 'compress-excel',
    primary: 'kompres excel',
    phrase: [
      { term: 'kompres excel', kd: 'Easy', volume: '>1000' },
      { term: 'kompres excel 10 mb', kd: 'n/a', volume: '>100' },
      { term: 'kompres excel online', kd: 'Easy', volume: '>100' },
      { term: 'kompres excel ke ukuran kecil', kd: 'n/a', volume: '>100' },
      { term: 'kompres excel lebih kecil', kd: 'Easy', volume: '>100' },
      { term: 'kompres excel 2 mb', kd: 'n/a', volume: '>100' },
      { term: 'kompres excel ke excel', kd: 'Easy', volume: '>100' },
      { term: 'kompres excel jadi kecil', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'cara kompres file excel', kd: 'Easy', volume: '>100' },
      { term: 'cara kompres excel', kd: 'Easy', volume: '<100' },
      { term: 'cara kompres file excel menjadi kecil', kd: 'n/a', volume: '<100' },
      { term: 'cara kompres excel ke ukuran kecil', kd: 'n/a', volume: '<100' },
      /* Answered truthfully: the image pass re-encodes oversized pictures,
         but most of a big workbook's size is the empty formatted range. */
      { term: 'cara kompres foto di excel', kd: 'n/a', volume: '<100' },
      { term: 'cara kompres file excel yang terlalu besar', kd: 'n/a', volume: '<100' },
      { term: 'cara kompres file excel yang besar', kd: 'n/a', volume: '<100' },
      { term: 'cara kompres data excel', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    slug: 'kompres-word',
    en: 'compress-word',
    primary: 'kompres word',
    phrase: [
      { term: 'kompres word', kd: 'Easy', volume: '>10,000' },
      { term: 'kompres word 1 mb', kd: 'Easy', volume: '>100' },
      { term: 'kompres word ukuran kecil online', kd: 'Easy', volume: '>100' },
      { term: 'kompres word 10 mb', kd: 'Easy', volume: '>100' },
      { term: 'kompres word ke word', kd: 'Easy', volume: '>100' },
      { term: 'kompres word online', kd: 'Easy', volume: '>100' },
      { term: 'kompres word 2 mb', kd: 'n/a', volume: '>100' }
    ],
    questions: [
      { term: 'cara kompres file word', kd: 'Easy', volume: '>100' },
      { term: 'cara kompres word', kd: 'Easy', volume: '>100' },
      { term: 'cara kompres word jadi kecil', kd: 'n/a', volume: '<100' },
      { term: 'cara kompres file word di hp', kd: 'n/a', volume: '<100' },
      { term: 'cara kompres file word menjadi kecil', kd: 'n/a', volume: '<100' },
      { term: 'cara kompres foto di word', kd: 'Easy', volume: '<100' }
    ]
  },
  {
    /* Two seeds were researched: "kalkulator persentase" (the tool's name,
       >1000) and "hitung persentase" (the task, >1000, 130 ideas). The task
       set is the larger one — the lesson from Portuguese `modelo de recibo`. */
    slug: 'kalkulator-persentase',
    en: 'percentage-calculator',
    primary: 'kalkulator persentase',
    phrase: [
      { term: 'kalkulator persentase', kd: 'Easy', volume: '>1000' },
      { term: 'hitung persentase', kd: 'Medium', volume: '>1000' },
      { term: 'hitung persentase online', kd: 'Easy', volume: '>100' },
      { term: 'rumus hitung persentase', kd: 'Easy', volume: '>100' },
      { term: 'hitung persentase kenaikan', kd: 'Easy', volume: '>100' },
      { term: 'hitung persentase keuntungan', kd: 'Easy', volume: '<100' },
      { term: 'kalkulator persentase kenaikan', kd: 'Easy', volume: '<100' },
      { term: 'kalkulator persentase online', kd: 'Easy', volume: '<100' },
      { term: 'kalkulator persentase keuntungan', kd: 'n/a', volume: '<100' },
      { term: 'kalkulator persentase penurunan', kd: 'n/a', volume: '<100' },
      { term: 'kalkulator persentase diskon', kd: 'n/a', volume: '<100' },
      { term: 'kalkulator persentase harga', kd: 'n/a', volume: '<100' },
      { term: 'kalkulator persentase untung', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'cara hitung persentase', kd: 'Easy', volume: '>1000' },
      /* Answered with the Excel formula itself — a true answer, and the
         calculator is the check on it. */
      { term: 'cara hitung persentase di excel', kd: 'Easy', volume: '>100' },
      { term: 'cara hitung persentase keuntungan', kd: 'Easy', volume: '>100' },
      { term: 'cara hitung persentase kenaikan', kd: 'Easy', volume: '>100' },
      { term: 'cara hitung persentase kenaikan harga', kd: 'Easy', volume: '>100' },
      { term: 'cara hitung persentase kehadiran', kd: 'Easy', volume: '<100' },
      { term: 'cara hitung kenaikan persentase', kd: 'Easy', volume: '<100' },
      { term: 'cara hitung persentase diskon', kd: 'Easy', volume: '<100' },
      { term: 'cara hitung persentase dari total', kd: 'Easy', volume: '<100' },
      { term: 'cara hitung persentase kehadiran siswa', kd: 'Easy', volume: '<100' },
      { term: 'cara hitung persentase kenaikan gaji', kd: 'n/a', volume: '<100' },
      { term: 'cara menghitung persentase di kalkulator', kd: 'Easy', volume: '<100' },
      { term: 'cara mencari persentase di kalkulator', kd: 'n/a', volume: '<100' },
      { term: 'cara menghitung persentase dengan kalkulator', kd: 'n/a', volume: '<100' }
    ]
  },

  {
    slug: 'xls-ke-pdf',
    en: 'xls-to-pdf',
    primary: 'xls ke pdf',
    phrase: [
      { term: 'ubah xls ke pdf', kd: 'Easy', volume: '>100' },
      { term: 'konversi xls ke pdf', kd: 'Easy', volume: '>100' },
      { term: 'xls ke pdf', kd: 'Easy', volume: '>100' },
      { term: 'kompres xls ke pdf', kd: 'n/a', volume: '<100' },
      { term: 'convert xls ke pdf', kd: 'n/a', volume: '<100' },
      { term: 'mengubah xls ke pdf', kd: 'Easy', volume: '<100' },
      { term: 'merubah xls ke pdf', kd: 'Easy', volume: '<100' },
      { term: 'ubah file xls ke pdf', kd: 'n/a', volume: '<100' },
      { term: 'mengubah file xls ke pdf', kd: 'n/a', volume: '<100' }
    ],
    questions: []
  },

  {
    slug: 'jpg-ke-webp',
    en: 'jpg-to-webp',
    primary: 'jpg ke webp',
    phrase: [
      { term: 'ubah jpg ke webp', kd: 'n/a', volume: '>100' },
      { term: 'jpg ke webp', kd: 'Easy', volume: '>100' },
      { term: 'konversi jpg ke webp', kd: 'n/a', volume: '<100' },
      { term: 'convert jpg ke webp', kd: 'n/a', volume: '<100' },
      { term: 'kompres jpg ke webp', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'cara merubah format jpg ke webp', kd: 'n/a', volume: '<100' },
      { term: 'cara merubah jpg ke webp', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    /* The `JPG ke WebP` question export was entirely WebP-to-JPG queries;
       they are filed here, on the page that does that job. */
    slug: 'webp-ke-jpg',
    en: 'webp-to-jpg',
    primary: 'webp ke jpg',
    phrase: [
      { term: 'ubah webp ke jpg', kd: 'Easy', volume: '>1000' },
      { term: 'webp ke jpg', kd: 'Easy', volume: '>100' },
      { term: 'konversi webp ke jpg', kd: 'Easy', volume: '>100' },
      { term: 'convert webp ke jpg', kd: 'Easy', volume: '>100' },
      { term: 'ubah file webp ke jpg', kd: 'Easy', volume: '>100' },
      { term: 'mengubah webp ke jpg', kd: 'Easy', volume: '>100' },
      { term: 'merubah webp ke jpg', kd: 'Easy', volume: '>100' },
      { term: 'ubah format webp ke jpg', kd: 'Easy', volume: '<100' },
      { term: 'ubah foto webp ke jpg', kd: 'Easy', volume: '<100' },
      { term: 'ubah gambar webp ke jpg', kd: 'Easy', volume: '<100' }
    ],
    questions: [
      { term: 'cara ubah webp ke jpg', kd: 'Easy', volume: '<100' },
      { term: 'cara merubah webp ke jpg', kd: 'Easy', volume: '<100' },
      { term: 'cara merubah file webp ke jpg', kd: 'Easy', volume: '<100' },
      { term: 'cara ubah file webp ke jpg', kd: 'n/a', volume: '<100' },
      { term: 'cara mengubah file webp ke jpg', kd: 'Easy', volume: '<100' },
      { term: 'cara mengubah format webp ke jpg', kd: 'Easy', volume: '<100' },
      { term: 'cara merubah format webp ke jpg', kd: 'Easy', volume: '<100' }
    ]
  },
  {
    slug: 'heic-ke-jpg',
    en: 'heic-to-jpg',
    primary: 'heic ke jpg',
    phrase: [
      { term: 'ubah heic ke jpg', kd: 'Easy', volume: '>1000' },
      { term: 'heic ke jpg', kd: 'Easy', volume: '>1000' },
      { term: 'konversi heic ke jpg', kd: 'Easy', volume: '>1000' },
      { term: 'convert heic ke jpg', kd: 'Easy', volume: '>100' },
      { term: 'ubah foto heic ke jpg', kd: 'Easy', volume: '>100' },
      { term: 'ubah file heic ke jpg', kd: 'Easy', volume: '>100' },
      { term: 'ubah format heic ke jpg', kd: 'Easy', volume: '>100' },
      { term: 'mengubah heic ke jpg', kd: 'Easy', volume: '>100' },
      { term: 'merubah heic ke jpg', kd: 'Easy', volume: '>100' }
    ],
    questions: [
      { term: 'cara ubah heic ke jpg', kd: 'Easy', volume: '>100' },
      { term: 'cara mengubah heic ke jpg', kd: 'Easy', volume: '>100' },
      { term: 'cara mengubah file heic ke jpg', kd: 'Easy', volume: '<100' },
      { term: 'cara mengubah foto heic ke jpg', kd: 'Easy', volume: '<100' },
      { term: 'cara mengubah format heic ke jpg', kd: 'Easy', volume: '<100' },
      { term: 'cara ubah format heic ke jpg', kd: 'n/a', volume: '<100' },
      { term: 'cara mengubah format heic ke jpg di android', kd: 'Easy', volume: '<100' },
      { term: 'cara ubah file heic ke jpg', kd: 'Easy', volume: '<100' },
      { term: 'cara ubah heic ke jpg di laptop', kd: 'n/a', volume: '<100' },
      /* Answered with the iPhone's own setting (Camera › Formats › Most
         Compatible), which is true and needs no tool. */
      { term: 'cara mengubah heic ke jpg di iphone', kd: 'Easy', volume: '<100' }
    ]
  },
  {
    slug: 'heic-ke-png',
    en: 'heic-to-png',
    primary: 'heic ke png',
    phrase: [
      { term: 'ubah heic ke png', kd: 'Easy', volume: '>100' },
      { term: 'heic ke png', kd: 'Easy', volume: '>100' },
      { term: 'ubah file heic ke png', kd: 'n/a', volume: '<100' },
      { term: 'konversi heic ke png', kd: 'Easy', volume: '<100' },
      { term: 'ubah foto heic ke png', kd: 'n/a', volume: '<100' },
      { term: 'ubah format heic ke png', kd: 'Easy', volume: '<100' },
      { term: 'convert heic ke png', kd: 'Easy', volume: '<100' },
      { term: 'mengubah heic ke png', kd: 'Easy', volume: '<100' }
    ],
    questions: []
  },
  {
    slug: 'avif-ke-jpg',
    en: 'avif-to-jpg',
    primary: 'avif ke jpg',
    phrase: [
      { term: 'ubah avif ke jpg', kd: 'Easy', volume: '>100' },
      { term: 'avif ke jpg', kd: 'n/a', volume: '>100' },
      { term: 'konversi avif ke jpg', kd: 'n/a', volume: '>100' },
      { term: 'ubah file avif ke jpg', kd: 'n/a', volume: '<100' },
      { term: 'convert avif ke jpg', kd: 'n/a', volume: '<100' },
      { term: 'mengubah avif ke jpg', kd: 'n/a', volume: '<100' },
      { term: 'merubah avif ke jpg', kd: 'n/a', volume: '<100' },
      { term: 'ubah format avif ke jpg', kd: 'n/a', volume: '<100' }
    ],
    questions: []
  },
  {
    slug: 'word-ke-pdf',
    en: 'word-to-pdf',
    primary: 'word ke pdf',
    phrase: [
      { term: 'ubah word ke pdf', kd: 'Easy', volume: '>100K' },
      { term: 'word ke pdf', kd: 'Easy', volume: '>100K' },
      { term: 'konversi word ke pdf', kd: 'Easy', volume: '>10,000' },
      { term: 'convert word ke pdf', kd: 'Easy', volume: '>10,000' },
      /* Convert-and-fit (autocomplete: "500 kb", "200kb", "1 mb"). */
      { term: 'kompres word ke pdf', kd: 'Easy', volume: '>10,000' },
      { term: 'mengubah word ke pdf', kd: 'Easy', volume: '>10,000' },
      { term: 'merubah word ke pdf', kd: 'Easy', volume: '>10,000' },
      { term: 'ubah file word ke pdf', kd: 'Easy', volume: '>1000' },
      { term: 'word ke pdf online', kd: 'Easy', volume: '>1000' },
      { term: 'kompres word to pdf', kd: 'Easy', volume: '>1000' },
      { term: 'kompres word ke pdf gratis', kd: 'Easy', volume: '>100' }
    ],
    questions: [
      { term: 'cara mengubah word ke pdf', kd: 'Easy', volume: '>1000' },
      { term: 'cara ubah word ke pdf', kd: 'Easy', volume: '>1000' },
      { term: 'cara merubah word ke pdf', kd: 'Easy', volume: '>1000' }
    ]
  },
  {
    slug: 'pdf-ke-word',
    en: 'pdf-to-word',
    primary: 'pdf ke word',
    phrase: [
      { term: 'ubah pdf ke word', kd: 'Easy', volume: '>100K' },
      { term: 'pdf ke word', kd: 'Easy', volume: '>100K' },
      { term: 'konversi pdf ke word', kd: 'Medium', volume: '>100K' },
      { term: 'convert pdf ke word', kd: 'Easy', volume: '>10,000' },
      { term: 'merubah pdf ke word', kd: 'Easy', volume: '>10,000' },
      { term: 'mengubah pdf ke word', kd: 'Easy', volume: '>10,000' },
      /* "kompres" here names the conversion, as everywhere in this export. */
      { term: 'kompres pdf ke word', kd: 'Easy', volume: '>10,000' },
      { term: 'pdf ke word gratis', kd: 'Easy', volume: '>10,000' },
      { term: 'pdf ke word online', kd: 'Easy', volume: '>10,000' }
    ],
    questions: [
      { term: 'cara mengubah pdf ke word', kd: 'Easy', volume: '>10,000' },
      { term: 'cara merubah pdf ke word', kd: 'Easy', volume: '>1000' },
      { term: 'cara ubah pdf ke word', kd: 'Easy', volume: '>1000' },
      { term: 'cara mengubah pdf ke word di laptop', kd: 'Easy', volume: '>1000' },
      { term: 'cara convert pdf ke word', kd: 'Easy', volume: '>1000' },
      { term: 'cara merubah file pdf ke word', kd: 'Easy', volume: '>1000' },
      { term: 'cara mengubah file pdf ke word', kd: 'Medium', volume: '>1000' },
      { term: 'cara pdf ke word', kd: 'n/a', volume: '>1000' }
    ]
  },

  {
    /* "ppt" is what Indonesians call any PowerPoint, so the page is built on
       `ppt ke pdf` (>1000 ×4) — and must say plainly that a real legacy .ppt
       file has to be re-saved as .pptx first, because only .pptx is read. */
    slug: 'ppt-ke-pdf',
    en: 'pptx-to-pdf',
    primary: 'ppt ke pdf',
    phrase: [
      { term: 'konversi ppt ke pdf', kd: 'Easy', volume: '>1000' },
      { term: 'ppt ke pdf', kd: 'Easy', volume: '>1000' },
      { term: 'ubah ppt ke pdf', kd: 'Easy', volume: '>1000' },
      { term: 'convert ppt ke pdf', kd: 'Easy', volume: '>1000' },
      { term: 'kompres ppt ke pdf', kd: 'Easy', volume: '>100' },
      { term: 'mengubah ppt ke pdf', kd: 'Easy', volume: '>100' },
      { term: 'merubah ppt ke pdf', kd: 'Easy', volume: '>100' },
      { term: 'ppt ke pdf gratis', kd: 'Easy', volume: '>100' },
      { term: 'ubah powerpoint ke pdf', kd: 'Easy', volume: '>100' },
      { term: 'powerpoint ke pdf', kd: 'Easy', volume: '>100' },
      { term: 'konversi powerpoint ke pdf', kd: 'Easy', volume: '>100' },
      { term: 'mengubah powerpoint ke pdf', kd: 'Easy', volume: '<100' },
      { term: 'kompres powerpoint ke pdf', kd: 'Easy', volume: '<100' },
      { term: 'convert powerpoint ke pdf', kd: 'Easy', volume: '<100' },
      { term: 'powerpoint ke pdf gratis', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'cara mengubah ppt ke pdf', kd: 'Easy', volume: '>100' },
      { term: 'cara ubah ppt ke pdf', kd: 'Easy', volume: '>100' },
      { term: 'cara merubah ppt ke pdf', kd: 'Easy', volume: '<100' },
      { term: 'cara convert powerpoint ke pdf', kd: 'n/a', volume: '<100' },
      { term: 'cara mengubah powerpoint ke pdf', kd: 'Easy', volume: '<100' },
      { term: 'cara merubah powerpoint ke pdf', kd: 'Easy', volume: '<100' }
    ]
  },
  {
    slug: 'pdf-ke-excel',
    en: 'pdf-to-excel',
    primary: 'pdf ke excel',
    phrase: [
      { term: 'ubah pdf ke excel', kd: 'Medium', volume: '>10,000' },
      { term: 'pdf ke excel', kd: 'Easy', volume: '>10,000' },
      { term: 'konversi pdf ke excel', kd: 'Medium', volume: '>10,000' },
      { term: 'convert pdf ke excel', kd: 'Easy', volume: '>1000' },
      { term: 'merubah pdf ke excel', kd: 'Easy', volume: '>1000' },
      { term: 'mengubah pdf ke excel', kd: 'Easy', volume: '>1000' },
      /* "kompres" names the conversion again. */
      { term: 'kompres pdf ke excel', kd: 'Easy', volume: '>1000' },
      { term: 'ubah file pdf ke excel', kd: 'n/a', volume: '>100' }
    ],
    questions: [
      { term: 'cara convert pdf ke excel', kd: 'Easy', volume: '>100' },
      { term: 'cara merubah pdf ke excel', kd: 'Easy', volume: '>100' },
      { term: 'cara mengubah pdf ke excel', kd: 'Easy', volume: '>100' },
      { term: 'cara ubah pdf ke excel', kd: 'Easy', volume: '>100' },
      { term: 'cara merubah file pdf ke excel', kd: 'Easy', volume: '>100' }
    ]
  },
  {
    slug: 'gabungkan-excel',
    en: 'merge-excel',
    primary: 'gabungkan excel',
    phrase: [
      { term: 'gabungkan excel', kd: 'Easy', volume: '>100' },
      { term: 'gabungkan excel jadi satu', kd: 'n/a', volume: '<100' },
      { term: 'gabungkan excel ke excel', kd: 'n/a', volume: '<100' },
      { term: 'gabungkan excel jadi 1', kd: 'n/a', volume: '<100' },
      { term: 'gabungkan excel online', kd: 'Easy', volume: '<100' },
      { term: 'gabungkan excel dalam satu file', kd: 'n/a', volume: '<100' },
      { term: 'gabungkan csv', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'cara gabungkan file excel', kd: 'n/a', volume: '<100' },
      { term: 'cara gabungkan excel jadi satu', kd: 'n/a', volume: '<100' },
      /* Answered truthfully: sheets from several files land in one
         workbook as separate sheets; rows are not stacked into one sheet. */
      { term: 'cara gabungkan sheet excel', kd: 'Easy', volume: '<100' },
      { term: 'cara gabungkan sheet di excel', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    /* Owns "photos into ONE PICTURE" (stitched). The "...ke pdf" variants
       moved to gambar-ke-pdf once that page was researched, so the two pages
       do not compete for one query. */
    slug: 'gabungkan-gambar',
    en: 'merge-images',
    primary: 'gabungkan gambar',
    phrase: [
      { term: 'gabungkan gambar', kd: 'Easy', volume: '>1000' },
      { term: 'gabungkan gambar online', kd: 'Easy', volume: '>100' },
      { term: 'gabungkan gambar jadi satu', kd: 'n/a', volume: '>100' },
      { term: 'gabungkan gambar jpg', kd: 'Easy', volume: '>100' },
      { term: 'gabungkan gambar jadi 1', kd: 'Easy', volume: '>100' }
    ],
    questions: [
      { term: 'cara gabungkan gambar', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    slug: 'pisahkan-gambar',
    en: 'split-image',
    primary: 'pisahkan gambar',
    phrase: [
      { term: 'pisahkan gambar', kd: 'n/a', volume: '>100' },
      { term: 'pisahkan gambar jpg', kd: 'n/a', volume: '<100' },
      { term: 'pisahkan gambar online', kd: 'n/a', volume: '<100' },
      { term: 'pisahkan gambar png', kd: 'n/a', volume: '<100' },
      { term: 'pisahkan gambar menjadi beberapa bagian', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'cara pisahkan gambar', kd: 'n/a', volume: '<100' }
    ]
  },

  {
    slug: 'gabungkan-word',
    en: 'merge-word',
    primary: 'gabungkan word',
    phrase: [
      { term: 'gabungkan word', kd: 'Easy', volume: '>1000' },
      { term: 'gabungkan word dan word', kd: 'Easy', volume: '>100' },
      { term: 'gabungkan word ke word', kd: 'Easy', volume: '>100' },
      { term: 'gabungkan word online', kd: 'Easy', volume: '>100' },
      { term: 'gabungkan word dengan word', kd: 'Easy', volume: '>100' },
      { term: 'gabungkan word to word', kd: 'Easy', volume: '<100' },
      { term: 'gabungkan word gratis', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'cara gabungkan file word', kd: 'Easy', volume: '<100' },
      { term: 'cara gabungkan word', kd: 'Easy', volume: '<100' },
      { term: 'cara gabungkan file word jadi satu', kd: 'Easy', volume: '<100' },
      { term: 'cara gabungkan file word yang terpisah', kd: 'n/a', volume: '<100' },
      { term: 'cara gabungkan word yang terpisah', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    slug: 'pisahkan-word',
    en: 'split-word',
    primary: 'pisahkan word',
    phrase: [
      { term: 'pisahkan word', kd: 'Easy', volume: '>1000' },
      { term: 'pisahkan word online', kd: 'Easy', volume: '>100' },
      /* The Heading 1 mode is exactly this. */
      { term: 'pisahkan word per bab', kd: 'n/a', volume: '<100' },
      { term: 'pisahkan word menjadi beberapa file', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'cara pisahkan file word', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    /* "gabungkan ppt" (>100) over "gabungkan powerpoint" (<100), as with
       `kompres ppt` and `ppt ke pdf`. */
    slug: 'gabungkan-ppt',
    en: 'merge-pptx',
    primary: 'gabungkan ppt',
    phrase: [
      { term: 'gabungkan ppt', kd: 'Medium', volume: '>100' },
      { term: 'gabungkan ppt jadi satu', kd: 'Easy', volume: '>100' },
      { term: 'gabungkan ppt ke ppt', kd: 'n/a', volume: '<100' },
      { term: 'gabungkan ppt online', kd: 'Easy', volume: '<100' },
      { term: 'gabungkan powerpoint', kd: 'Easy', volume: '<100' }
    ],
    questions: [
      { term: 'cara gabungkan ppt jadi satu', kd: 'Easy', volume: '<100' },
      { term: 'cara gabungkan ppt', kd: 'Easy', volume: '<100' },
      { term: 'cara gabungkan powerpoint', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    /* Two seeds: the tool's name `penghitung kata` (>10,000, Hard) and the
       task `hitung jumlah kata` (>1000, Easy). The slug takes the bigger
       exact term; the winnable task term leads the H1 and the questions. */
    slug: 'penghitung-kata',
    en: 'word-counter',
    primary: 'penghitung kata',
    phrase: [
      { term: 'penghitung kata', kd: 'Hard', volume: '>10,000' },
      { term: 'hitung jumlah kata', kd: 'Easy', volume: '>1000' },
      { term: 'penghitung kata online', kd: 'Hard', volume: '>100' },
      { term: 'web penghitung kata', kd: 'Hard', volume: '>100' },
      { term: 'penghitung kata teks', kd: 'n/a', volume: '>100' },
      { term: 'aplikasi penghitung kata', kd: 'Hard', volume: '>100' },
      { term: 'hitung jumlah kata online', kd: 'Hard', volume: '>100' },
      { term: 'website penghitung kata', kd: 'Hard', volume: '<100' },
      { term: 'alat penghitung kata', kd: 'Easy', volume: '<100' },
      { term: 'penghitung kata word', kd: 'Hard', volume: '<100' },
      { term: 'penghitung kata dalam kalimat', kd: 'n/a', volume: '<100' },
      { term: 'web hitung jumlah kata', kd: 'n/a', volume: '<100' },
      { term: 'hitung jumlah kata teks bahasa indonesia', kd: 'n/a', volume: '<100' },
      { term: 'aplikasi hitung jumlah kata', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'cara hitung jumlah kata', kd: 'n/a', volume: '<100' },
      /* Answered with the apps' own counters — true, and no tool needed. */
      { term: 'cara hitung jumlah kata di word', kd: 'n/a', volume: '<100' },
      { term: 'cara hitung jumlah kata di google docs', kd: 'n/a', volume: '<100' },
      { term: 'hitung jumlah kata di word', kd: 'n/a', volume: '<100' }
    ]
  },

  {
    slug: 'gambar-ke-pdf',
    en: 'image-to-pdf',
    primary: 'gambar ke pdf',
    phrase: [
      { term: 'gambar ke pdf', kd: 'Hard', volume: '>10,000' },
      { term: 'ubah gambar ke pdf', kd: 'Hard', volume: '>10,000' },
      { term: 'gabung gambar ke pdf', kd: 'Easy', volume: '>1000' },
      { term: 'gambar ke pdf gratis', kd: 'Hard', volume: '>1000' },
      { term: 'convert gambar ke pdf', kd: 'Hard', volume: '>1000' },
      { term: 'konversi gambar ke pdf', kd: 'Hard', volume: '>1000' },
      { term: 'mengubah gambar ke pdf', kd: 'Easy', volume: '>1000' },
      { term: 'gabungkan gambar ke pdf', kd: 'Medium', volume: '>1000' },
      { term: 'scan gambar ke pdf', kd: 'Medium', volume: '>1000' },
      { term: 'gabungkan gambar jadi pdf', kd: 'Medium', volume: '>100' },
      { term: 'gabungkan gambar menjadi pdf', kd: 'Medium', volume: '>100' },
      { term: 'gabungkan gambar jadi 1 pdf', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'cara mengubah gambar ke pdf', kd: 'Easy', volume: '>1000' },
      { term: 'cara ubah gambar ke pdf', kd: 'Medium', volume: '>100' },
      { term: 'cara merubah gambar ke pdf', kd: 'Medium', volume: '>100' },
      { term: 'cara menjadikan gambar ke pdf', kd: 'Easy', volume: '>100' },
      { term: 'cara buat gambar ke pdf', kd: 'Easy', volume: '>100' },
      { term: 'cara membuat gambar ke pdf', kd: 'Easy', volume: '>100' },
      { term: 'cara jadikan gambar ke pdf', kd: 'Easy', volume: '<100' },
      { term: 'cara gambar ke pdf', kd: 'Medium', volume: '<100' }
    ]
  },
  {
    /* "ubah ukuran gambar" (>1000, Easy) is the researched seed. Autocomplete
       for `resize foto` and `kompres foto` (not researched for volume) ends in
       "200kb", "1 mb", "3x4", "4x6" — the same form-upload job, so those words
       appear in body copy, but only researched terms are tracked here. */
    slug: 'ubah-ukuran-gambar',
    en: 'image-resizer',
    primary: 'ubah ukuran gambar',
    phrase: [
      { term: 'ubah ukuran gambar', kd: 'Easy', volume: '>1000' },
      { term: 'ubah ukuran gambar online', kd: 'Hard', volume: '>100' },
      /* Pixels are what the tool sets; cm is answered with the conversion
         (cm × DPI ÷ 2.54), e.g. pas foto 3×4 cm at 300 DPI = 354 × 472 px. */
      { term: 'ubah ukuran gambar cm', kd: 'n/a', volume: '>100' },
      { term: 'ubah ukuran gambar jadi 1 mb', kd: 'n/a', volume: '<100' },
      { term: 'ubah ukuran gambar menjadi 200 kb', kd: 'n/a', volume: '<100' },
      { term: 'ubah ukuran gambar jpg', kd: 'n/a', volume: '<100' },
      { term: 'ubah ukuran gambar 4x6', kd: 'n/a', volume: '<100' },
      { term: 'ubah ukuran gambar png', kd: 'Easy', volume: '<100' },
      { term: 'ubah ukuran gambar menjadi 1 mb', kd: 'n/a', volume: '<100' },
      { term: 'pengubah ukuran gambar', kd: 'Hard', volume: '<100' },
      { term: 'aplikasi pengubah ukuran gambar', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'cara ubah ukuran gambar', kd: 'Hard', volume: '<100' }
    ]
  },
  {
    /* The tool converts both ways (the output takes the spelling the input
       lacks), so the JPG-to-JPEG questions belong here too. */
    slug: 'jpeg-ke-jpg',
    en: 'jpeg-to-jpg',
    primary: 'jpeg ke jpg',
    phrase: [
      { term: 'ubah jpeg ke jpg', kd: 'Easy', volume: '>1000' },
      { term: 'jpeg ke jpg', kd: 'Easy', volume: '>1000' },
      { term: 'konversi jpeg ke jpg', kd: 'Easy', volume: '>1000' },
      { term: 'convert jpeg ke jpg', kd: 'Easy', volume: '>1000' },
      { term: 'mengubah jpeg ke jpg', kd: 'Easy', volume: '>1000' },
      { term: 'ubah foto jpeg ke jpg', kd: 'Easy', volume: '>100' },
      { term: 'kompres jpeg ke jpg', kd: 'Medium', volume: '>100' },
      { term: 'merubah jpeg ke jpg', kd: 'Easy', volume: '>100' },
      { term: 'ubah file jpeg ke jpg', kd: 'Easy', volume: '>100' },
      { term: 'ubah format jpeg ke jpg', kd: 'Easy', volume: '>100' }
    ],
    questions: [
      { term: 'cara mengubah jpeg ke jpg', kd: 'Easy', volume: '>100' },
      { term: 'cara ubah jpeg ke jpg', kd: 'Easy', volume: '>100' },
      { term: 'cara merubah jpeg ke jpg', kd: 'Easy', volume: '>100' },
      { term: 'cara ubah jpg ke jpeg', kd: 'Easy', volume: '<100' },
      { term: 'cara ubah foto jpeg ke jpg', kd: 'Easy', volume: '<100' },
      { term: 'cara mengubah jpg ke jpeg', kd: 'Easy', volume: '<100' },
      { term: 'cara mengubah jpg ke jpeg di hp', kd: 'Easy', volume: '<100' },
      { term: 'cara merubah jpg ke jpeg', kd: 'Easy', volume: '<100' },
      { term: 'cara ganti jpeg ke jpg', kd: 'n/a', volume: '<100' },
      { term: 'cara mengubah foto jpg ke jpeg', kd: 'Easy', volume: '<100' },
      { term: 'cara mengubah file jpeg ke jpg', kd: 'n/a', volume: '<100' }
    ]
  }
];

export const keywordsBySlug = new Map(pageKeywords.map(p => [p.slug, p]));
