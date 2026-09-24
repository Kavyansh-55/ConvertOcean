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
  { term: 'mesclar pdf adobe', why: 'competitor brand navigation (Adobe)' },
  // batch 6
  { term: 'dividir pdf i love pdf', why: 'competitor brand navigation' },
  { term: 'ilovepdf dividir pdf', why: 'competitor brand navigation' },
  { term: 'dividir pdf ilove', why: 'competitor brand navigation' },
  { term: 'separar pdf i love pdf', why: 'competitor brand navigation' },
  { term: 'ilovepdf separar pdf', why: 'competitor brand navigation' },
  { term: 'separar pdf ilove', why: 'competitor brand navigation' },
  { term: 'i love pdf separar pdf', why: 'competitor brand navigation' },
  { term: 'smallpdf separar pdf', why: 'competitor brand navigation (Smallpdf)' },
  { term: 'compactar pdf adobe', why: 'competitor brand navigation (Adobe)' },
  { term: 'adobe compactar pdf', why: 'competitor brand navigation (Adobe)' },
  { term: 'compactar pdf i love pdf', why: 'competitor brand navigation' },
  { term: 'compactar pdf ilove', why: 'competitor brand navigation' },
  { term: 'comprimir pdf i love pdf', why: 'competitor brand navigation' },
  { term: 'ilovepdf comprimir pdf', why: 'competitor brand navigation' },
  { term: 'comprimir pdf ilove', why: 'competitor brand navigation' },
  { term: 'adobe comprimir pdf', why: 'competitor brand navigation (Adobe)' },
  { term: 'adobe diminuir pdf', why: 'competitor brand navigation (Adobe)' },
  { term: 'diminuir pdf adobe', why: 'competitor brand navigation (Adobe)' },
  // batch 9
  { term: 'calculadora de porcentagem online - 4devs', why: 'competitor brand navigation (4devs)' },
  { term: 'calculadora de porcentagem google', why: 'brand navigation (Google calculator)' },
  // batch 11
  { term: 'pinetools split image online', why: 'competitor brand navigation (PineTools)' },
  { term: 'split image online pinetools', why: 'competitor brand navigation (PineTools)' },
  { term: 'imagy.app – split image online', why: 'competitor brand navigation (Imagy)' },
  { term: 'como dividir uma imagem em 4 partes no canva', why: 'brand navigation (Canva) — a how-to for their editor' }
];

/**
 * Password removal. Not a tool we have, and not one to advertise.
 *
 * "Quebrar" means to break, and the `quebrar pdf` question set is dominated by
 * `como quebrar senha de pdf` — breaking a PDF's password. That is a different
 * category from everything else in this file. It is not a converter, we do not
 * build it, and a privacy-first site that markets itself on breaking document
 * protection is arguing against its own position: the same encryption someone
 * wants stripped here is what protects a contract or a payslip elsewhere.
 *
 * Volume is <100 across the set, so nothing is being given up. Recorded so the
 * decision is visible rather than looking like an oversight — and because the
 * split page DOES legitimately target `quebrar pdf` (Easy, >1000), which is a
 * genuine split query. The word is shared; the intent is not.
 */
export const passwordIntent: { term: string; kd: string; volume: string }[] = [
  { term: 'quebrar pdf protegido', kd: 'n/a', volume: '<100' },
  { term: 'como quebrar senha de pdf', kd: 'Easy', volume: '<100' },
  { term: 'como quebrar a senha de um pdf', kd: 'Easy', volume: '<100' },
  { term: 'como quebrar senha pdf', kd: 'n/a', volume: '<100' }
];

/**
 * Fraud. Not targeted, not answered, not hinted at.
 *
 * `gerador de nota fiscal fake` and `gerador de nota fiscal falsa` ask for a
 * generator of FALSE tax invoices. A nota fiscal is a legally regulated
 * Brazilian tax document; fabricating one is document fraud and tax evasion.
 * Both come back Easy, which only means nobody reputable competes for them.
 *
 * This is recorded rather than deleted so that the decision is explicit and
 * cannot be quietly reversed by someone reading "Easy" on a keyword list.
 */
export const fraudIntent: { term: string; kd: string; volume: string }[] = [
  { term: 'gerador de nota fiscal fake', kd: 'Easy', volume: '<100' },
  { term: 'gerador de nota fiscal falsa', kd: 'Easy', volume: '<100' }
];

/**
 * Regulated documents we cannot issue, and must not imply we can.
 *
 * "Emitir nota fiscal" means issuing an official electronic tax invoice. In
 * Brazil that runs through SEFAZ or a municipal system, and requires a CNPJ, a
 * digital certificate and government integration. Our invoice generator makes a
 * PDF. A PDF is not a nota fiscal and never becomes one.
 *
 * Ranking for these would be worse than useless: a MEI who believes they have
 * issued a nota fiscal because a website produced a document has a tax problem,
 * not a file-conversion problem. The same applies to `receita saúde`, which is
 * the Receita Federal's own app for health professionals' receipts.
 *
 * /pt/modelo-de-fatura/ states the distinction outright instead, because the
 * confusion is real and the honest answer is genuinely useful.
 */
export const regulatedDocument: { term: string; kd: string; volume: string; needs: string }[] = [
  { term: 'gerador de nota fiscal', kd: 'Hard', volume: '>100', needs: 'SEFAZ integration + CNPJ + digital certificate' },
  { term: 'gerador de nota fiscal gratuito', kd: 'Medium', volume: '>100', needs: 'SEFAZ integration' },
  { term: 'gerador de nota fiscal online', kd: 'n/a', volume: '<100', needs: 'SEFAZ integration' },
  { term: 'gerador de nota fiscal para teste', kd: 'Hard', volume: '<100', needs: 'developer sandbox, not a document tool' },
  { term: 'emitir nota fiscal online', kd: 'Hard', volume: '<100', needs: 'SEFAZ or municipal system' },
  { term: 'como emitir nota fiscal online', kd: 'Hard', volume: '<100', needs: 'SEFAZ or municipal system' },
  { term: 'emitir nota fiscal online grátis', kd: 'Medium', volume: '<100', needs: 'SEFAZ or municipal system' },
  { term: 'emitir nota fiscal online gratis', kd: 'Medium', volume: '<100', needs: 'SEFAZ or municipal system' },
  { term: 'como emitir nota fiscal online grátis', kd: 'n/a', volume: '<100', needs: 'SEFAZ or municipal system' },
  { term: 'sistema para emitir nota fiscal online', kd: 'n/a', volume: '<100', needs: 'SEFAZ or municipal system' },
  { term: 'emitir nota fiscal online sp mei', kd: 'n/a', volume: '<100', needs: 'São Paulo municipal system' },
  { term: 'quem pode emitir nota fiscal paulista online', kd: 'n/a', volume: '<100', needs: 'Nota Fiscal Paulista programme' },
  { term: 'como emitir nota fiscal eletronica online', kd: 'n/a', volume: '<100', needs: 'SEFAZ' },
  { term: 'quem pode emitir nota fiscal online', kd: 'n/a', volume: '<100', needs: 'eligibility question, not a tool' },
  { term: 'emitir recibo receita saude', kd: 'n/a', volume: '>100', needs: 'Receita Federal Receita Saúde app' },
  { term: 'emitir recibo receita saúde', kd: 'n/a', volume: '>100', needs: 'Receita Federal Receita Saúde app' },
  { term: 'como emitir recibo no receita saude', kd: 'n/a', volume: '>100', needs: 'Receita Federal Receita Saúde app' },
  { term: 'qual o fato gerador da nota fiscal de serviço', kd: 'n/a', volume: '<100', needs: 'tax-law definition, not a tool at all' }
];

/**
 * The same word, a completely different subject: "diminuir" in Excel is
 * SUBTRACTION, not file size.
 *
 * Batch 6 established that comprimir / compactar / diminuir are three names for
 * compressing a PDF. Batch 7 shows that pattern does not survive the move to
 * Excel. In a spreadsheet, "diminuir" is what you do to a number — `formula
 * diminuir excel` (Easy, >100), `como somar e diminuir no excel`, `como
 * diminuir porcentagem no excel`, `função diminuir excel` are all asking how to
 * subtract in Excel. They have nothing to do with a file being too big.
 *
 * Carrying the earlier rule across would have pointed a file-compression page
 * at spreadsheet-formula queries: a page that ranks, gets the click, and
 * answers a question nobody asked. The whole `diminuir excel` cluster is
 * therefore excluded, with one exception pulled out of it — `planilha excel
 * muito pesada como diminuir` genuinely is about file size, and that one is
 * targeted on /pt/comprimir-excel/.
 *
 * The lesson generalises: a synonym set verified on one tool is not
 * transferable evidence about another. Each cluster gets read on its own.
 */
export const wrongTool: { term: string; kd: string; volume: string; actually: string }[] = [
  { term: 'formula diminuir excel', kd: 'Easy', volume: '>100', actually: 'Excel subtraction formula' },
  { term: 'diminuir excel', kd: 'Easy', volume: '<100', actually: 'Excel subtraction formula' },
  { term: 'diminuir excel formula', kd: 'Easy', volume: '<100', actually: 'Excel subtraction formula' },
  { term: 'função diminuir excel', kd: 'Easy', volume: '<100', actually: 'Excel subtraction formula' },
  { term: 'como diminuir excel', kd: 'Easy', volume: '<100', actually: 'Excel subtraction formula' },
  { term: 'como diminuir no excel', kd: 'Easy', volume: '>100', actually: 'Excel subtraction formula' },
  { term: 'como diminuir porcentagem no excel', kd: 'Easy', volume: '<100', actually: 'Excel percentage formula' },
  { term: 'como diminuir no excel formula', kd: 'Easy', volume: '<100', actually: 'Excel subtraction formula' },
  { term: 'como somar e diminuir no excel', kd: 'Easy', volume: '<100', actually: 'Excel sum/subtract formulas' },
  { term: 'compactar excel em zip', kd: 'n/a', volume: '<100', actually: 'ZIP archiving, not reducing the .xlsx itself' },
  /* batch 11. "Com IA" means generative merging — blending faces, inventing a
     composite. Our tool stitches two pictures side by side. Same verb, a
     completely different product. */
  { term: 'juntar fotos com ia', kd: 'n/a', volume: '>100', actually: 'AI image generation, not stitching' },
  { term: 'unir imagens com ia', kd: 'n/a', volume: '<100', actually: 'AI image generation, not stitching' },
  { term: 'combinar fotos ia', kd: 'n/a', volume: '<100', actually: 'AI image generation, not stitching' },
  /* batch 9. "Porcentagem/percentual de gordura" is BODY FAT — a body-composition
     calculator taking skinfold measurements, nothing to do with arithmetic on a
     percentage. `calculadora de percentual de gordura` is Easy at >100 and would
     be pure bounce traffic. */
  { term: 'calculadora de porcentagem de gordura', kd: 'Hard', volume: '<100', actually: 'body-fat percentage calculator' },
  { term: 'calculadora de percentual de gordura', kd: 'Easy', volume: '>100', actually: 'body-fat percentage calculator' },
  { term: 'calculadora de percentual de gordura corporal', kd: 'Easy', volume: '<100', actually: 'body-fat percentage calculator' },
  { term: 'calculadora de percentual de gordura 7 dobras', kd: 'Easy', volume: '<100', actually: 'skinfold body-fat protocol' },
  { term: 'como calcular porcentagem de gordura corporal online', kd: 'Easy', volume: '<100', actually: 'body-fat percentage calculator' },
  /* ICMS is Brazil's state VAT, and it is not a flat percentage: substituicao
     tributaria, interstate rates and base reduction all change the answer. Our
     calculator applies a rate you type. Ranking for `calculadora de icms` would
     hand someone a confidently wrong tax figure, which is worse than no page. */
  { term: 'calculadora de icms', kd: 'Easy', volume: '<100', actually: 'Brazilian state VAT with ST and interstate rules, not a flat rate' },
  { term: 'calculadora de icms st', kd: 'Easy', volume: '<100', actually: 'substituicao tributaria — a different calculation entirely' },
  { term: 'calculadora de icms online', kd: 'Easy', volume: '<100', actually: 'Brazilian state VAT, not a flat rate' },
  { term: 'calculadora de icms antecipado', kd: 'n/a', volume: '<100', actually: 'ICMS antecipado regime' },
  { term: 'calculadora de icms importação', kd: 'n/a', volume: '<100', actually: 'import tax base calculation' }
];

/**
 * Right cluster, wrong page: "quebrar pdf em word" is a CONVERSION query that
 * arrived inside the split export because it shares the verb. It belongs to
 * /pt/pdf-para-word/ and /pt/pdf-para-excel/, where the tools actually do it.
 */
export const belongsElsewhere: { term: string; kd: string; volume: string; page: string }[] = [
  { term: 'quebrar pdf em word', kd: 'Medium', volume: '>100', page: 'pdf-para-word' },
  { term: 'quebrar pdf para word', kd: 'Medium', volume: '<100', page: 'pdf-para-word' },
  { term: 'como quebrar pdf para word', kd: 'Easy', volume: '<100', page: 'pdf-para-word' },
  { term: 'quebrar pdf em excel', kd: 'Easy', volume: '<100', page: 'pdf-para-excel' },
  { term: 'comprimir word em pdf', kd: 'n/a', volume: '<100', page: 'word-para-pdf' }
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
  { term: 'jpg para png sem fundo', kd: 'n/a', volume: '>100', wants: 'background removal, not format conversion' },
  /* batch 8. These want a .docx template to download and edit; the generator
     fills a form and outputs a PDF. Painful to leave — both are Easy at >1000
     — but a visitor who came for a Word file and gets a PDF leaves immediately.
     /pt/modelo-de-recibo/ answers the question in its own words rather than
     ranking for it. */
  { term: 'modelo de recibo word', kd: 'Easy', volume: '>1000', wants: 'an editable .docx template, not a generated PDF' },
  { term: 'modelo de recibo de pagamento word', kd: 'Easy', volume: '>1000', wants: 'an editable .docx template, not a generated PDF' }
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
  { term: 'que es mejor para imprimir png o jpg', language: 'es' },
  /* Second leak, batch 7. "un" and "pese menos" are Spanish; Portuguese would
     be "um ppt para que pese menos". Two leaks in seven batches suggests this
     is routine for pt exports rather than a one-off, so it is worth scanning
     for when the Spanish locale starts. */
  { term: 'como comprimir un ppt para que pese menos', language: 'es' },
  /* batch 9. IVA is the Spanish/European VAT term; Brazil's equivalents are
     ICMS, ISS and IPI. Every country modifier that came back is Spanish-speaking,
     which is what gives it away — this cluster is not Brazilian demand. Useful
     later: it is a preview of the Spanish locale's tax vocabulary. */
  { term: 'calculadora de iva', language: 'es' },
  { term: 'calculadora de iva ecuador', language: 'es' },
  { term: 'calculadora de iva el salvador', language: 'es' },
  { term: 'calculadora de iva uruguay', language: 'es' },
  { term: 'calculadora de iva paraguay', language: 'es' },
  /* batch 10 — not a foreign language, a different Portuguese. "Ficheiro" is
     the European Portuguese word for file; Brazilians say "arquivo". Worth
     noting because our hreflang is the bare `pt`, which claims every
     Portuguese market, while the copy is written in pt-BR. Low volume, so no
     action now — but if Portugal ever matters, this is the vocabulary split
     that would justify a separate pt-PT. */
  { term: 'ficheiro avif para png', language: 'pt-PT' },
  /* batch 11 — the EXIF sets leak in both directions. Portuguese for data is
     "dados"; "datos" is Spanish. And Brazilians searching a niche technical
     term often type it in English, which is why `view exif online` and `split
     image online` show up in a pt export at all. Neither belongs on a pt page:
     the English site already serves them. */
  { term: 'ver datos exif online', language: 'es' },
  { term: 'view exif online', language: 'en' },
  { term: 'exif online viewer', language: 'en' },
  { term: 'split image online', language: 'en' },
  { term: 'split image online free', language: 'en' }
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
  { term: 'unir pdf – unir pdfs online, grátis', why: 'scraped <title> tag, not a search query' },
  /* A song lyric, not a business query. "Só quero o que é meu" rides on the
     phrase rather than the accounting concept — the clearest reminder yet that
     a keyword tool matches strings, not meanings. */
  { term: 'ponto de equilíbrio só quero o que é meu', why: 'song lyric riding the phrase, not a break-even query' }
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
  { term: 'programa que passa imagem para texto', page: 'imagem-para-texto' },
  /* batch 6. Split and compress returned the largest variant sets yet — the
     compress cluster alone has three verbs × five ways of saying "file". */
  { term: 'como dividir um arquivo pdf', page: 'dividir-pdf' },
  { term: 'como dividir arquivo pdf', page: 'dividir-pdf' },
  { term: 'como dividir arquivos pdf', page: 'dividir-pdf' },
  { term: 'como dividir o pdf', page: 'dividir-pdf' },
  { term: 'onde dividir documentos pdf com facilidade', page: 'dividir-pdf' },
  { term: 'como separar pdf', page: 'dividir-pdf' },
  { term: 'como separar páginas de pdf', page: 'dividir-pdf' },
  { term: 'como quebrar um pdf', page: 'dividir-pdf' },
  { term: 'como comprimir um arquivo pdf', page: 'comprimir-pdf' },
  { term: 'como comprimir um pdf', page: 'comprimir-pdf' },
  { term: 'como comprimir arquivos pdf', page: 'comprimir-pdf' },
  { term: 'como comprimir arquivo pdf', page: 'comprimir-pdf' },
  { term: 'como comprimir um arquivo em pdf', page: 'comprimir-pdf' },
  { term: 'como compactar pdf', page: 'comprimir-pdf' },
  { term: 'como compactar arquivo pdf', page: 'comprimir-pdf' },
  { term: 'como compactar um arquivo pdf', page: 'comprimir-pdf' },
  { term: 'como compactar um arquivo em pdf', page: 'comprimir-pdf' },
  { term: 'como compactar um pdf', page: 'comprimir-pdf' },
  { term: 'como compactar pdf gratuito', page: 'comprimir-pdf' },
  { term: 'como diminuir pdf', page: 'comprimir-pdf' },
  { term: 'como diminuir o tamanho de um pdf', page: 'comprimir-pdf' },
  { term: 'como diminuir tamanho de pdf', page: 'comprimir-pdf' },
  { term: 'como diminuir o tamanho do pdf', page: 'comprimir-pdf' },
  { term: 'como diminuir um arquivo pdf', page: 'comprimir-pdf' },
  { term: 'como diminuir o tamanho do arquivo pdf', page: 'comprimir-pdf' },
  { term: 'como diminuir o mb de um pdf', page: 'comprimir-pdf' },
  { term: 'o que significa comprimir pdf', page: 'comprimir-pdf' },
  { term: 'o que é compactar pdf', page: 'comprimir-pdf' }
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
  { term: 'xml para json jquery', kd: 'n/a', volume: '<100', lang: 'jQuery' },
  { term: 'converter xls para csv java', kd: 'n/a', volume: '<100', lang: 'Java' },
  { term: 'dividir arquivo csv php', kd: 'n/a', volume: '<100', lang: 'PHP' }
];

export const noToolYet: { term: string; kd: string; volume: string; needs: string }[] = [
  { term: 'como converter pdf para ppt', kd: 'n/a', volume: '<100', needs: 'pdf-to-ppt' },
  { term: 'como posso converter pdf para ppt online?', kd: 'n/a', volume: '<100', needs: 'pdf-to-ppt' },
  { term: 'como converter pdf para ppt online', kd: 'n/a', volume: '<100', needs: 'pdf-to-ppt' },
  { term: 'qual o melhor conversor de pdf para ppt', kd: 'n/a', volume: '<100', needs: 'pdf-to-ppt' },
  { term: 'como converter pdf para powerpoint', kd: 'Easy', volume: '>100', needs: 'pdf-to-ppt' },
  { term: 'como converter de pdf para powerpoint', kd: 'n/a', volume: '<100', needs: 'pdf-to-ppt' },
  { term: 'como passar pdf para powerpoint', kd: 'Easy', volume: '<100', needs: 'pdf-to-ppt' },
  { term: 'qual o melhor conversor de pdf para powerpoint', kd: 'n/a', volume: '<100', needs: 'pdf-to-ppt' },
  /* batch 9. The site converts OFX/QFX/QBO -> CSV, but not the reverse. Tiny
     volume, so this is a note rather than a case for building it. */
  { term: 'csv para ofx', kd: 'Easy', volume: '<100', needs: 'csv-to-ofx' },
  { term: 'converter csv para ofx', kd: 'n/a', volume: '<100', needs: 'csv-to-ofx' },
  { term: 'como converter csv para ofx', kd: 'n/a', volume: '<100', needs: 'csv-to-ofx' },
  /* batch 11. CROPPING IS THE BIGGEST MISSING TOOL FOUND SO FAR: `cortar
     imagem online` is EASY at >1000, and the site has no crop tool at all —
     split-image cuts into tiles and image-resizer scales, neither of which
     crops. Unlike PDF->PowerPoint or background removal, this one is a small
     canvas operation, so the gap between demand and effort is unusually wide. */
  { term: 'cortar imagem online', kd: 'Easy', volume: '>1000', needs: 'image-crop' },
  { term: 'cortar imagem online grátis', kd: 'Easy', volume: '>100', needs: 'image-crop' },
  { term: 'cortar imagem online png', kd: 'Easy', volume: '<100', needs: 'image-crop' },
  { term: 'cortar imagem online redonda', kd: 'Easy', volume: '<100', needs: 'image-crop (circular)' },
  /* Vectorisation — raster back to vector. A different class of problem from
     every other converter here, and not one we do. */
  { term: 'onde converter png para svg', kd: 'n/a', volume: '<100', needs: 'png-to-svg (vectorisation)' },
  /* Background removal again, third sighting. See intentMismatch. */
  { term: 'como separar foto do fundo', kd: 'n/a', volume: '<100', needs: 'background removal' }
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
  },

  /* ---------------------------------------------------------------------
     Batch 6 — split and compress, 2026-09-24. Four synonyms and three.

     Split: dividir / separar / quebrar / extrair páginas. `dividir pdf` and
     `separar pdf` are BOTH Easy at >100K, which is the highest winnable volume
     anywhere in this programme — the split SERP is evidently far softer than
     the merge one, where every head term came back Hard.

     Compress: compactar / comprimir / diminuir, all at Medium. One page each,
     as with merge and OCR.

     `dividir pdf por tamanho` (Easy, >1000) is worth noting because the tool
     genuinely does it — split-pdf can cut a document into parts that each stay
     under a size set in MB. That is an exact capability match with real volume,
     which is rarer than it sounds.
     --------------------------------------------------------------------- */
  {
    slug: 'dividir-pdf',
    en: 'split-pdf',
    primary: 'dividir pdf',
    phrase: [
      { term: 'dividir pdf', kd: 'Easy', volume: '>100K' },
      { term: 'dividir pdf online', kd: 'Easy', volume: '>1000' },
      { term: 'dividir pdf por tamanho', kd: 'Easy', volume: '>1000' },
      { term: 'dividir pdf gratis', kd: 'Easy', volume: '>1000' },
      { term: 'dividir pdf em partes', kd: 'Easy', volume: '>100' },
      { term: 'dividir pdf grátis', kd: 'Easy', volume: '>100' },
      { term: 'separar pdf', kd: 'Easy', volume: '>100K' },
      { term: 'separar pdf online', kd: 'Easy', volume: '>1000' },
      { term: 'separar pdf por paginas', kd: 'Easy', volume: '>100' },
      { term: 'separar pdf gratis', kd: 'Easy', volume: '>100' },
      { term: 'quebrar pdf', kd: 'Easy', volume: '>1000' },
      { term: 'quebrar pdf em paginas', kd: 'n/a', volume: '<100' },
      { term: 'quebrar pdf online', kd: 'Easy', volume: '<100' },
      { term: 'extrair paginas de pdf', kd: 'Easy', volume: '>100' },
      { term: 'extrair páginas de pdf', kd: 'Easy', volume: '>100' },
      { term: 'extrair paginas de pdf gratuito', kd: 'n/a', volume: '<100' },
      { term: 'melhor ferramenta para extrair páginas de pdf', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'como separar paginas pdf', kd: 'Easy', volume: '>1000' },
      { term: 'como dividir pdf', kd: 'Easy', volume: '>100' },
      { term: 'como dividir um pdf', kd: 'Easy', volume: '>100' },
      { term: 'como separar paginas de um pdf', kd: 'Easy', volume: '>100' },
      { term: 'como dividir pdf em partes', kd: 'n/a', volume: '<100' },
      { term: 'como dividir um pdf em dois', kd: 'Easy', volume: '<100' },
      { term: 'como separar documentos em pdf', kd: 'Easy', volume: '<100' },
      { term: 'como quebrar pdf', kd: 'Easy', volume: '<100' },
      { term: 'onde dividir documentos pdf facilmente', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    slug: 'comprimir-pdf',
    en: 'compress-pdf',
    primary: 'comprimir pdf',
    phrase: [
      { term: 'comprimir pdf', kd: 'Medium', volume: '>100K' },
      { term: 'comprimir pdf gratuito', kd: 'Easy', volume: '>1000' },
      { term: 'comprimir pdf online', kd: 'Medium', volume: '>1000' },
      { term: 'comprimir pdf grátis', kd: 'Medium', volume: '>1000' },
      { term: 'comprimir pdf gratis', kd: 'Medium', volume: '>1000' },
      { term: 'compactar pdf', kd: 'Medium', volume: '>100K' },
      { term: 'compactar pdf online', kd: 'Medium', volume: '>1000' },
      { term: 'compactar pdf gratuito', kd: 'Medium', volume: '>1000' },
      { term: 'compactar pdf gratis', kd: 'Easy', volume: '>1000' },
      { term: 'compactar pdf grátis', kd: 'Medium', volume: '>1000' },
      { term: 'diminuir pdf', kd: 'Medium', volume: '>10,000' },
      { term: 'diminuir pdf online', kd: 'Easy', volume: '>100' },
      { term: 'diminuir pdf gratis', kd: 'Medium', volume: '>100' },
      { term: 'diminuir pdf tamanho', kd: 'Medium', volume: '<100' }
    ],
    questions: [
      { term: 'como comprimir pdf', kd: 'Medium', volume: '>1000' },
      { term: 'como diminuir o tamanho de um arquivo pdf', kd: 'Medium', volume: '>1000' },
      { term: 'como compactar arquivos pdf', kd: 'Medium', volume: '>1000' },
      { term: 'como compactar arquivos em pdf', kd: 'Easy', volume: '>100' },
      { term: 'como diminuir arquivo pdf', kd: 'Easy', volume: '>100' },
      { term: 'como diminuir o tamanho de um arquivo em pdf', kd: 'Easy', volume: '>100' },
      { term: 'como diminuir mb de pdf', kd: 'Medium', volume: '>100' },
      { term: 'como comprimir um arquivo pdf muito grande', kd: 'n/a', volume: '<100' },
      { term: 'como comprimir pdf sem perder qualidade', kd: 'n/a', volume: '<100' },
      { term: 'o que é comprimir pdf', kd: 'Medium', volume: '<100' },
      { term: 'como compactar pdf no iphone', kd: 'n/a', volume: '<100' }
    ]
  },

  /* ---------------------------------------------------------------------
     Batch 7 — the Office compressors, 2026-09-24.

     Small volumes throughout: `comprimir word` at >1000 is the only term above
     a few hundred. These are completion pages, not traffic drivers.

     The batch's real value was negative: it disproved a rule. `diminuir` means
     compress for PDF and SUBTRACT for Excel, so the whole `diminuir excel`
     cluster is in `wrongTool` rather than on a compression page. One query was
     rescued from it — `planilha excel muito pesada como diminuir` — and it is
     the best question in the batch precisely because it states the file-size
     intent explicitly.
     --------------------------------------------------------------------- */
  {
    slug: 'comprimir-word',
    en: 'compress-word',
    primary: 'comprimir word',
    phrase: [
      { term: 'comprimir word', kd: 'Easy', volume: '>1000' },
      { term: 'comprimir word online', kd: 'Easy', volume: '<100' },
      { term: 'compactar word', kd: 'Easy', volume: '>100' },
      { term: 'compactar word para 10mb', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'como comprimir arquivo word', kd: 'n/a', volume: '<100' },
      { term: 'como compactar arquivo word', kd: 'n/a', volume: '<100' },
      { term: 'como compactar imagens no word', kd: 'n/a', volume: '<100' },
      { term: 'o que é compactar imagem no word', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    slug: 'comprimir-powerpoint',
    en: 'compress-powerpoint',
    primary: 'comprimir powerpoint',
    phrase: [
      { term: 'comprimir powerpoint', kd: 'Easy', volume: '>100' },
      { term: 'comprimir ppt', kd: 'Easy', volume: '>100' },
      { term: 'comprimir powerpoint online', kd: 'Easy', volume: '<100' },
      { term: 'comprimir ppt online', kd: 'Easy', volume: '<100' },
      { term: 'comprimir ppt online grátis', kd: 'Easy', volume: '<100' },
      { term: 'comprimir powerpoint gratuito', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'como comprimir powerpoint', kd: 'n/a', volume: '<100' },
      { term: 'como comprimir ppt', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    slug: 'comprimir-excel',
    en: 'compress-excel',
    primary: 'comprimir excel',
    phrase: [
      { term: 'comprimir excel', kd: 'Easy', volume: '>100' },
      { term: 'compactar excel', kd: 'Easy', volume: '>100' },
      { term: 'comprimir excel online', kd: 'Easy', volume: '<100' },
      { term: 'compactar excel online', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'planilha excel muito pesada como diminuir', kd: 'Easy', volume: '<100' },
      { term: 'como compactar excel', kd: 'n/a', volume: '<100' }
    ]
  },

  /* ---------------------------------------------------------------------
     Batch 8 — the business tools, 2026-09-24.

     Kavya asked why "invoice generator" showed almost no Brazilian volume
     despite being a big English term, having tried several Portuguese
     translations. The answer is in this data and it is not a translation
     problem — it is a market-structure one.

     Brazilian businesses do not issue a generic "invoice". They issue a NOTA
     FISCAL, a government-regulated electronic document produced through SEFAZ
     or a municipal system. "Fatura" mostly means a bill you RECEIVE, like a
     credit-card statement. So there is no large market for an invoice
     generator, and the volume that does exist under `nota fiscal` is
     unreachable for us by law, not by SEO.

     What Brazilians actually search, for the same underlying job:
     `modelo de recibo` — EASY at >10,000, with 9,047 keywords in the cluster
     and eight separate variants at >1000, all Easy. That is the largest
     winnable opportunity found anywhere in this programme, and it was hidden
     behind the word "gerador". `gerador de recibos` is <100. `modelo de
     recibo` is >10,000. Same tool, same job, 100× the demand, purely because
     Brazilians search for a MODEL rather than a GENERATOR.

     The lesson for the remaining tools: translate the JOB, not the tool name.
     --------------------------------------------------------------------- */
  {
    slug: 'modelo-de-recibo',
    en: 'receipt-generator',
    primary: 'modelo de recibo',
    phrase: [
      { term: 'modelo de recibo', kd: 'Easy', volume: '>10,000' },
      { term: 'modelo de recibo de pagamento', kd: 'Easy', volume: '>1000' },
      { term: 'modelo de recibo de prestação de serviço', kd: 'Easy', volume: '>1000' },
      { term: 'modelo de recibo simples', kd: 'Easy', volume: '>1000' },
      { term: 'modelo de recibo de compra e venda', kd: 'Easy', volume: '>1000' },
      { term: 'modelo de recibo de aluguel', kd: 'Easy', volume: '>1000' },
      { term: 'modelo de recibo de pagamento de prestação de serviço', kd: 'Easy', volume: '>100' },
      { term: 'modelo de recibo pdf', kd: 'Easy', volume: '>100' },
      { term: 'emitir recibo', kd: 'Easy', volume: '>100' },
      { term: 'emitir recibo online', kd: 'Easy', volume: '>100' },
      { term: 'criar recibo online', kd: 'Easy', volume: '>100' },
      { term: 'gerador de recibos', kd: 'Easy', volume: '<100' },
      { term: 'emitir recibo de pagamento', kd: 'Easy', volume: '<100' },
      { term: 'emitir recibo de compra e venda', kd: 'Easy', volume: '<100' },
      { term: 'emitir recibo mei', kd: 'Medium', volume: '<100' }
    ],
    questions: [
      { term: 'como emitir recibo', kd: 'Easy', volume: '>100' },
      { term: 'como emitir um recibo de pagamento', kd: 'Easy', volume: '>100' },
      { term: 'como emitir recibo de compra e venda', kd: 'Easy', volume: '<100' },
      { term: 'como emitir um recibo', kd: 'Easy', volume: '<100' },
      { term: 'como emitir recibo mei', kd: 'Easy', volume: '<100' },
      { term: 'como emitir recibo de pagamento autônomo', kd: 'n/a', volume: '<100' },
      { term: 'como criar recibo online', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    slug: 'modelo-de-fatura',
    en: 'invoice-generator',
    primary: 'modelo de fatura',
    phrase: [
      { term: 'modelo de fatura', kd: 'Medium', volume: '>100' },
      { term: 'modelo de fatura de locação', kd: 'Easy', volume: '>100' },
      { term: 'modelo de fatura de serviços', kd: 'Easy', volume: '>100' },
      { term: 'modelo de fatura comercial', kd: 'Easy', volume: '<100' },
      { term: 'gerador de faturas', kd: 'Easy', volume: '<100' },
      { term: 'gerador de faturas gratuito', kd: 'n/a', volume: '<100' },
      { term: 'melhor gerador de faturas para freelancers', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'qual é o melhor software gerador de faturas', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    slug: 'calculadora-de-margem-de-lucro',
    en: 'profit-margin-calculator',
    primary: 'calculadora de margem de lucro',
    phrase: [
      { term: 'calculadora de margem de lucro', kd: 'Easy', volume: '>100' },
      { term: 'calcular margem de lucro online', kd: 'Easy', volume: '<100' },
      { term: 'calculadora de margem de lucro de um produto', kd: 'n/a', volume: '<100' },
      { term: 'calculadora de margem de lucro online', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'como calcular margem de lucro', kd: 'Easy', volume: '>1000' },
      { term: 'como calcular margem de lucro de um produto', kd: 'Easy', volume: '>100' },
      { term: 'margem de lucro como calcular', kd: 'Easy', volume: '>100' },
      { term: 'como calcular margem de lucro em porcentagem', kd: 'Easy', volume: '<100' },
      { term: 'como calcular margem de lucro no excel', kd: 'Easy', volume: '<100' },
      { term: 'como calcular minha margem de lucro', kd: 'Easy', volume: '<100' }
    ]
  },

  /* ---------------------------------------------------------------------
     Batch 9 — calculators and bank statements, 2026-09-24.

     Batch 8's lesson holds again, twice. `calculadora de ponto de equilibrio`
     is <100; `ponto de equilíbrio` is EASY at >1000 with a 12,052-keyword
     cluster. `calculadora de porcentagem` is HARD; `como calcular porcentagem`
     is >10,000 with a dozen Easy variants above 1000. In both cases the
     translated tool name is the weakest term available and the concept or the
     question is where the market is.

     Percentage is the biggest cluster in the programme after `modelo de
     recibo`, and it is also the most contaminated: "percentual de gordura" is
     BODY FAT, which is a different calculator entirely. Those are in
     `wrongTool`.
     --------------------------------------------------------------------- */
  {
    slug: 'calculadora-de-porcentagem',
    en: 'percentage-calculator',
    primary: 'como calcular porcentagem',
    phrase: [
      { term: 'como calcular porcentagem', kd: 'Medium', volume: '>10,000' },
      { term: 'calculadora de porcentagem', kd: 'Hard', volume: '>10,000' },
      { term: 'calculadora de percentual', kd: 'Medium', volume: '>1000' },
      { term: 'calculadora de porcentagem online', kd: 'Medium', volume: '>1000' },
      { term: 'calcular porcentagem online', kd: 'Medium', volume: '>100' },
      { term: 'calculadora de porcentagem de lucro', kd: 'Easy', volume: '>100' },
      { term: 'calculadora de porcentagem de desconto', kd: 'Easy', volume: '<100' },
      { term: 'calculadora de porcentagem entre dois valores', kd: 'Easy', volume: '<100' },
      { term: 'calculadora de percentual de aumento', kd: 'Medium', volume: '<100' },
      { term: 'calculadora de percentual online', kd: 'Easy', volume: '<100' }
    ],
    questions: [
      { term: 'como calcular porcentagem de um valor', kd: 'Medium', volume: '>1000' },
      { term: 'como calcular porcentagem na calculadora', kd: 'Easy', volume: '>1000' },
      { term: 'como calcular porcentagem de aumento', kd: 'Easy', volume: '>1000' },
      { term: 'como calcular porcentagem no excel', kd: 'Easy', volume: '>1000' },
      { term: 'como fazer conta de porcentagem na calculadora', kd: 'Easy', volume: '>1000' },
      { term: 'como calcular porcentagem de desconto', kd: 'Easy', volume: '>100' },
      { term: 'como calcular porcentagem no celular', kd: 'Easy', volume: '>100' },
      { term: 'como calcular porcentagem de um valor para outro', kd: 'Easy', volume: '>100' }
    ]
  },
  {
    slug: 'ponto-de-equilibrio',
    en: 'break-even-calculator',
    primary: 'ponto de equilíbrio',
    phrase: [
      { term: 'ponto de equilíbrio', kd: 'Easy', volume: '>1000' },
      { term: 'ponto de equilibrio', kd: 'Easy', volume: '>1000' },
      { term: 'ponto de equilíbrio financeiro', kd: 'Easy', volume: '>1000' },
      { term: 'ponto de equilíbrio contábil', kd: 'Easy', volume: '>1000' },
      { term: 'ponto de equilibrio contabil', kd: 'Easy', volume: '>100' },
      { term: 'ponto de equilíbrio econômico', kd: 'Easy', volume: '>100' },
      { term: 'calculo ponto de equilibrio', kd: 'Easy', volume: '>100' },
      { term: 'margem de contribuição e ponto de equilíbrio', kd: 'Easy', volume: '>100' },
      { term: 'calculadora de ponto de equilibrio', kd: 'Easy', volume: '<100' },
      { term: 'analise de ponto de equilibrio', kd: 'Easy', volume: '<100' }
    ],
    questions: [
      { term: 'como calcular ponto de equilibrio', kd: 'Easy', volume: '>100' },
      { term: 'como calcular o ponto de equilíbrio', kd: 'Easy', volume: '>100' },
      { term: 'o que é ponto de equilíbrio', kd: 'Easy', volume: '>100' },
      { term: 'o que é ponto de equilibrio de uma empresa', kd: 'Easy', volume: '<100' },
      { term: 'o que é ponto de equilibrio financeiro', kd: 'Easy', volume: '<100' },
      { term: 'como calcular ponto de equilibrio contabil', kd: 'Easy', volume: '<100' },
      { term: 'ponto de equilíbrio como calcular', kd: 'Easy', volume: '<100' },
      { term: 'o que é analise de ponto de equilibrio', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    slug: 'calculadora-de-imposto',
    en: 'sales-tax-calculator',
    primary: 'como calcular imposto sobre produto',
    phrase: [
      { term: 'calcular imposto sobre produto', kd: 'n/a', volume: '<100' },
      { term: 'calcular imposto sobre produto importado', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'como calcular imposto sobre produto', kd: 'Easy', volume: '<100' },
      { term: 'como calcular imposto sobre produto importado', kd: 'n/a', volume: '<100' },
      { term: 'como calcular imposto sobre produto formula', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    slug: 'ofx-para-csv',
    en: 'ofx-to-csv',
    primary: 'ofx para csv',
    phrase: [
      { term: 'ofx para csv', kd: 'n/a', volume: '<100' },
      { term: 'converter ofx para csv', kd: 'n/a', volume: '<100' },
      { term: 'conversor ofx para csv', kd: 'n/a', volume: '<100' },
      { term: 'converter arquivo ofx para csv', kd: 'n/a', volume: '<100' },
      { term: 'conversor de ofx para csv', kd: 'n/a', volume: '<100' },
      { term: 'converter ofx para csv online', kd: 'n/a', volume: '<100' }
    ],
    questions: []
  },

  /* ---------------------------------------------------------------------
     Batch 10 — the long tail, 2026-09-24. Fourteen tools, two tiers.

     The image formats are the last big Easy volume in the programme:
     `heic para jpg` and `converter heic para jpg` are BOTH Easy at >10,000,
     and `converter webp para jpg` is Easy at >10,000. HEIC in particular is a
     pure consumer problem — an iPhone photo that Windows and upload forms
     refuse — which is exactly the mobile-heavy Brazilian audience.

     The spreadsheet/XML converters are the opposite: everything <100, several
     with no KD at all. Completion pages.

     QBO to CSV returned no keywords whatsoever and is built blind, on the
     tool's own behaviour rather than on research.
     --------------------------------------------------------------------- */
  {
    slug: 'heic-para-jpg', en: 'heic-to-jpg', primary: 'heic para jpg',
    phrase: [
      { term: 'converter heic para jpg', kd: 'Easy', volume: '>10,000' },
      { term: 'heic para jpg', kd: 'Easy', volume: '>10,000' },
      { term: 'conversor de heic para jpg', kd: 'Easy', volume: '>1000' },
      { term: 'converter imagem heic para jpg', kd: 'Easy', volume: '>1000' },
      { term: 'converter arquivo heic para jpg', kd: 'Easy', volume: '>100' },
      { term: 'converter foto heic para jpg', kd: 'Easy', volume: '>100' },
      { term: 'converter de heic para jpg', kd: 'Easy', volume: '>100' },
      { term: 'arquivo heic para jpg', kd: 'Easy', volume: '>100' },
      { term: 'conversor heic para jpg', kd: 'Easy', volume: '>100' },
      { term: 'converter fotos heic para jpg', kd: 'Easy', volume: '>100' }
    ],
    questions: [
      { term: 'como converter heic para jpg', kd: 'Easy', volume: '>100' },
      { term: 'como converter arquivo heic para jpg', kd: 'Easy', volume: '>100' },
      { term: 'como converter fotos heic para jpg', kd: 'Easy', volume: '<100' },
      { term: 'como converter heic para jpg no iphone', kd: 'n/a', volume: '<100' },
      { term: 'como mudar formato de foto heic para jpg', kd: 'Easy', volume: '<100' }
    ]
  },
  {
    slug: 'webp-para-jpg', en: 'webp-to-jpg', primary: 'converter webp para jpg',
    phrase: [
      { term: 'converter webp para jpg', kd: 'Easy', volume: '>10,000' },
      { term: 'webp para jpg', kd: 'Easy', volume: '>1000' },
      { term: 'conversor de webp para jpg', kd: 'Easy', volume: '>100' },
      { term: 'converter imagem webp para jpg', kd: 'Easy', volume: '>100' },
      { term: 'arquivo webp para jpg', kd: 'Easy', volume: '>100' },
      { term: 'converter arquivo webp para jpg', kd: 'Easy', volume: '>100' },
      { term: 'converter de webp para jpg', kd: 'Easy', volume: '>100' },
      { term: 'de webp para jpg', kd: 'Easy', volume: '>100' },
      { term: 'imagem webp para jpg', kd: 'Easy', volume: '>100' },
      { term: 'converter foto webp para jpg', kd: 'Easy', volume: '<100' }
    ],
    questions: [
      { term: 'como converter imagem webp para jpg', kd: 'Easy', volume: '<100' },
      { term: 'como converter webp para jpg', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    slug: 'heic-para-png', en: 'heic-to-png', primary: 'heic para png',
    phrase: [
      { term: 'converter heic para png', kd: 'Easy', volume: '>1000' },
      { term: 'heic para png', kd: 'Easy', volume: '>1000' },
      { term: 'converter imagem heic para png', kd: 'Easy', volume: '>100' },
      { term: 'conversor de heic para png', kd: 'Easy', volume: '>100' },
      { term: 'arquivo heic para png', kd: 'Easy', volume: '>100' },
      { term: 'converter de heic para png', kd: 'Easy', volume: '>100' },
      { term: '.heic para png', kd: 'Easy', volume: '<100' },
      { term: 'converter foto heic para png', kd: 'Easy', volume: '<100' }
    ],
    questions: []
  },
  {
    slug: 'avif-para-jpg', en: 'avif-to-jpg', primary: 'avif para jpg',
    phrase: [
      { term: 'avif para jpg', kd: 'Easy', volume: '>1000' },
      { term: 'converter avif para jpg', kd: 'Easy', volume: '>1000' },
      { term: 'conversor avif para jpg', kd: 'Easy', volume: '>100' },
      { term: 'converter imagem avif para jpg', kd: 'Easy', volume: '>100' },
      { term: 'conversor de avif para jpg', kd: 'Easy', volume: '>100' },
      { term: 'converter de avif para jpg', kd: 'Easy', volume: '>100' },
      { term: 'arquivo avif para jpg', kd: 'Easy', volume: '<100' },
      { term: 'converter foto avif para jpg', kd: 'Easy', volume: '<100' }
    ],
    questions: []
  },
  {
    slug: 'avif-para-png', en: 'avif-to-png', primary: 'avif para png',
    phrase: [
      { term: 'avif para png', kd: 'Easy', volume: '>1000' },
      { term: 'converter avif para png', kd: 'Easy', volume: '>1000' },
      { term: 'arquivo avif para png', kd: 'Easy', volume: '>100' },
      { term: 'converter imagem avif para png', kd: 'Easy', volume: '>100' },
      { term: 'converter arquivo avif para png', kd: 'Easy', volume: '<100' },
      { term: 'conversor de avif para png', kd: 'Easy', volume: '<100' },
      { term: 'converter de avif para png', kd: 'Easy', volume: '<100' },
      { term: 'de avif para png', kd: 'Easy', volume: '<100' }
    ],
    questions: []
  },
  {
    slug: 'jpg-para-webp', en: 'jpg-to-webp', primary: 'jpg para webp',
    phrase: [
      { term: 'jpg para webp', kd: 'Easy', volume: '>1000' },
      { term: 'converter jpg para webp', kd: 'Easy', volume: '>100' },
      { term: 'converter imagem jpg para webp', kd: 'Easy', volume: '<100' },
      { term: 'conversor de jpg para webp', kd: 'Easy', volume: '<100' },
      { term: 'de jpg para webp', kd: 'n/a', volume: '<100' }
    ],
    /* Both of its returned questions are the opposite conversion and live on
       webp-para-jpg, where the tool can actually perform them. */
    questions: []
  },
  {
    slug: 'xls-para-pdf', en: 'xls-to-pdf', primary: 'xls para pdf',
    phrase: [
      { term: 'xls para pdf', kd: 'Easy', volume: '>100' },
      { term: 'converter xls para pdf', kd: 'Easy', volume: '>100' },
      { term: 'conversor de xls para pdf', kd: 'Easy', volume: '<100' },
      { term: 'converter arquivo xls para pdf', kd: 'n/a', volume: '<100' },
      { term: 'transformar arquivo xls para pdf', kd: 'n/a', volume: '<100' },
      { term: '.xls para pdf', kd: 'n/a', volume: '<100' }
    ],
    questions: []
  },
  {
    slug: 'csv-para-pdf', en: 'csv-to-pdf', primary: 'csv para pdf',
    phrase: [
      { term: 'csv para pdf', kd: 'Easy', volume: '>100' },
      { term: 'converter csv para pdf', kd: 'Hard', volume: '>100' },
      { term: 'arquivo csv para pdf', kd: 'Easy', volume: '>100' },
      { term: 'converter arquivo csv para pdf', kd: 'Easy', volume: '<100' },
      { term: 'conversor de csv para pdf', kd: 'n/a', volume: '<100' },
      { term: 'de csv para pdf', kd: 'n/a', volume: '<100' }
    ],
    questions: []
  },
  {
    slug: 'xls-para-csv', en: 'xls-to-csv', primary: 'xls para csv',
    phrase: [
      { term: 'converter xls para csv', kd: 'Easy', volume: '>100' },
      { term: 'xls para csv', kd: 'Easy', volume: '>100' },
      { term: 'conversor xls para csv', kd: 'n/a', volume: '<100' },
      { term: 'conversor de xls para csv', kd: 'n/a', volume: '<100' },
      { term: 'converter arquivo xls para csv', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'como converter xls para csv', kd: 'n/a', volume: '<100' },
      { term: 'converter xls para csv no excel', kd: 'n/a', volume: '<100' },
      { term: 'qual a diferença de csv para xls', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    slug: 'xml-para-csv', en: 'xml-to-csv', primary: 'xml para csv',
    phrase: [
      { term: 'xml para csv', kd: 'Easy', volume: '<100' },
      { term: 'converter xml para csv', kd: 'Easy', volume: '<100' },
      { term: 'conversor de xml para csv', kd: 'n/a', volume: '<100' },
      { term: 'arquivo xml para csv', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'como converter xml para csv', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    slug: 'xml-para-xlsx', en: 'xml-to-xlsx', primary: 'xml para xlsx',
    phrase: [
      { term: 'xml para xlsx', kd: 'Easy', volume: '<100' },
      { term: 'converter xml para xlsx', kd: 'Easy', volume: '<100' },
      { term: 'conversor de xml para xlsx', kd: 'n/a', volume: '<100' }
    ],
    questions: []
  },
  {
    slug: 'xlsx-para-json', en: 'xlsx-to-json', primary: 'xlsx para json',
    phrase: [
      { term: 'converter xlsx para json', kd: 'Easy', volume: '<100' },
      { term: 'xlsx para json', kd: 'n/a', volume: '<100' }
    ],
    questions: []
  },
  {
    slug: 'xls-para-json', en: 'xls-to-json', primary: 'xls para json',
    phrase: [
      { term: 'converter xls para json', kd: 'n/a', volume: '<100' },
      { term: 'xls para json', kd: 'n/a', volume: '<100' }
    ],
    questions: []
  },
  {
    /* No keyword data at all — Kavya found none. Built on the tool's own
       behaviour so the locale is complete, with no ranking expectation. */
    slug: 'qbo-para-csv', en: 'qbo-to-csv', primary: 'qbo para csv',
    phrase: [],
    questions: []
  },

  /* ---------------------------------------------------------------------
     Batch 11 — SVG, merge/split of images and spreadsheets, EXIF. 2026-09-24.

     Two real finds. `svg para png` and `converter svg para png` are both Easy
     at >1000. And the image split/merge cluster is bigger than its English
     equivalent suggests, because Brazilians attach two specific jobs to it:
     printing a poster across A4 sheets (`dividir imagem em folhas a4 para
     imprimir`, Easy >1000) and cutting an Instagram carousel (`dividir imagem
     carrossel`, Easy >100). The tool's own description already names social
     carousels, so that one is an exact capability match.

     EXIF confirms Kavya's own read: there is no market. Everything <100, most
     with no KD at all, and the set is contaminated with Spanish and English.
     Built for completeness only.

     CANNIBALISATION WATCH: `juntar fotos em pdf` and `unir imagens em pdf`
     (both Medium, >1000) are IMAGE-TO-PDF intent, and /pt/jpg-para-pdf/
     already exists for that. merge-images can also output PDF, so the two
     pages could easily compete. juntar-fotos therefore targets the STITCHED
     IMAGE job — `juntar duas fotos em uma só` — which jpg-para-pdf cannot do,
     and links across for the PDF case.
     --------------------------------------------------------------------- */
  {
    slug: 'svg-para-png', en: 'svg-to-png', primary: 'svg para png',
    phrase: [
      { term: 'svg para png', kd: 'Easy', volume: '>1000' },
      { term: 'converter svg para png', kd: 'Easy', volume: '>1000' },
      { term: 'converter de svg para png', kd: 'Easy', volume: '>100' },
      { term: 'conversor de svg para png', kd: 'Easy', volume: '<100' },
      { term: 'arquivo svg para png', kd: 'Easy', volume: '<100' },
      { term: 'converter imagem svg para png', kd: 'Easy', volume: '<100' },
      { term: 'converter arquivo svg para png', kd: 'Easy', volume: '<100' }
    ],
    questions: [
      { term: 'como converter svg para png', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    slug: 'svg-para-jpg', en: 'svg-to-jpg', primary: 'svg para jpg',
    phrase: [
      { term: 'svg para jpg', kd: 'Easy', volume: '>100' },
      { term: 'converter svg para jpg', kd: 'Easy', volume: '<100' },
      { term: 'converter imagem svg para jpg', kd: 'n/a', volume: '<100' },
      { term: 'converter svg para jpg online', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'como converter svg para jpg', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    slug: 'svg-para-webp', en: 'svg-to-webp', primary: 'svg para webp',
    phrase: [
      { term: 'svg para webp', kd: 'Easy', volume: '<100' },
      { term: 'converter svg para webp', kd: 'n/a', volume: '<100' }
    ],
    questions: []
  },
  {
    slug: 'dividir-imagem', en: 'split-image', primary: 'dividir imagem',
    phrase: [
      { term: 'dividir imagem', kd: 'Easy', volume: '>1000' },
      { term: 'site para dividir imagem em várias folhas a4', kd: 'Easy', volume: '>1000' },
      { term: 'dividir imagem para imprimir', kd: 'Easy', volume: '>1000' },
      { term: 'dividir imagem em folhas a4', kd: 'Easy', volume: '>1000' },
      { term: 'dividir imagem em 4 partes', kd: 'Easy', volume: '>1000' },
      { term: 'dividir imagem em partes', kd: 'Easy', volume: '>100' },
      { term: 'dividir imagem em folhas a4 para imprimir', kd: 'Easy', volume: '>100' },
      { term: 'dividir imagem online', kd: 'Easy', volume: '>100' },
      { term: 'dividir imagem carrossel', kd: 'Easy', volume: '>100' },
      { term: 'dividir imagem em 4 folhas a4', kd: 'Easy', volume: '>100' },
      { term: 'separar foto em partes', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'como dividir uma imagem em 4 partes', kd: 'Easy', volume: '>100' },
      { term: 'como dividir uma imagem em 4 partes para imprimir', kd: 'Easy', volume: '>100' },
      { term: 'como dividir imagem em 4 partes', kd: 'Easy', volume: '>100' },
      { term: 'como dividir imagem para imprimir', kd: 'Easy', volume: '<100' },
      { term: 'como dividir uma imagem em várias folhas a4', kd: 'Easy', volume: '<100' },
      { term: 'como dividir uma imagem em 6 partes para imprimir', kd: 'Easy', volume: '<100' }
    ]
  },
  {
    slug: 'juntar-fotos', en: 'merge-images', primary: 'juntar fotos',
    phrase: [
      { term: 'juntar fotos', kd: 'Easy', volume: '>1000' },
      { term: 'juntar fotos em uma só', kd: 'Easy', volume: '>100' },
      { term: 'juntar fotos online', kd: 'Easy', volume: '>100' },
      { term: 'juntar fotos jpg', kd: 'Easy', volume: '>100' },
      { term: 'juntar fotos online grátis', kd: 'Easy', volume: '>100' },
      { term: 'aplicativo para juntar fotos', kd: 'Easy', volume: '>100' },
      { term: 'unir imagens', kd: 'Easy', volume: '>100' },
      { term: 'unir imagens jpg', kd: 'Easy', volume: '>100' },
      { term: 'combinar fotos', kd: 'Easy', volume: '>100' },
      { term: 'mesclar imagens online', kd: 'Easy', volume: '<100' },
      { term: 'colar imagens juntas', kd: 'Easy', volume: '<100' }
    ],
    questions: [
      { term: 'como juntar duas fotos em uma só', kd: 'Easy', volume: '>1000' },
      { term: 'como juntar duas fotos', kd: 'Easy', volume: '>100' },
      { term: 'como juntar 2 fotos em 1', kd: 'Easy', volume: '>100' },
      { term: 'como juntar varias fotos em uma só', kd: 'Easy', volume: '>100' },
      { term: 'como juntar fotos em uma só', kd: 'Easy', volume: '>100' },
      { term: 'como unir duas imagens', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    slug: 'unir-arquivos-excel', en: 'merge-excel', primary: 'unir arquivos excel',
    phrase: [
      { term: 'unir arquivos excel', kd: 'Easy', volume: '<100' },
      { term: 'mesclar planilhas excel', kd: 'Easy', volume: '<100' },
      { term: 'unir arquivos csv', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'como unir varios arquivos excel em um só', kd: 'Easy', volume: '<100' },
      { term: 'como mesclar planilhas no excel', kd: 'Easy', volume: '<100' },
      { term: 'como mesclar duas planilhas no excel', kd: 'Easy', volume: '<100' },
      { term: 'como unir arquivos csv', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    slug: 'dividir-arquivo-excel', en: 'split-excel', primary: 'dividir arquivo excel',
    phrase: [
      { term: 'dividir arquivo excel', kd: 'n/a', volume: '<100' },
      { term: 'dividir arquivo excel varios', kd: 'n/a', volume: '<100' },
      { term: 'separar planilha excel', kd: 'n/a', volume: '<100' },
      { term: 'dividir arquivo csv', kd: 'n/a', volume: '<100' },
      { term: 'dividir arquivo csv em partes', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'como separar planilha excel', kd: 'n/a', volume: '<100' },
      { term: 'como dividir arquivo csv', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    /* No market, confirmed by Kavya and by the data. Completion pages. */
    slug: 'ver-exif', en: 'exif-viewer', primary: 'ver dados da foto',
    phrase: [
      { term: 'exif online', kd: 'Hard', volume: '<100' },
      { term: 'ver exif online', kd: 'n/a', volume: '<100' },
      { term: 'ver dados da foto', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'como ver dados da foto', kd: 'n/a', volume: '<100' }
    ]
  },
  {
    slug: 'remover-exif', en: 'exif-remover', primary: 'remover exif',
    phrase: [
      { term: 'remover exif', kd: 'n/a', volume: '<100' },
      { term: 'remover exif online', kd: 'n/a', volume: '<100' },
      { term: 'remover exif fotos', kd: 'n/a', volume: '<100' }
    ],
    questions: [
      { term: 'como remover exif', kd: 'n/a', volume: '<100' }
    ]
  }
];

export const keywordsBySlug = new Map(pageKeywords.map(p => [p.slug, p]));
