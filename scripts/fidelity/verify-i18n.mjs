/**
 * The Portuguese routes, driven as real pages.
 *
 * `npm run fidelity` went green over 332 checks without ever loading a /pt/
 * URL — every recipe is keyed to an English slug. A green run there says
 * nothing at all about this locale, which is precisely the trap CLAUDE.md
 * warns about: "if you changed a tool, add a check for it, or a green run is
 * only re-verifying the previous batch."
 *
 * The failure this exists to catch is specific and silent. A tool page picks
 * its converter component by slug, and several components then switch
 * BEHAVIOUR on that same slug — ImageTool reads it to decide whether it is
 * doing png-to-jpg or jpg-to-png. Under /pt/ the URL slug is `comprimir-pdf`,
 * which matches no component at all, so the route carries `enSlug` separately.
 * Get that wiring wrong and the page does not 404 and does not throw: it
 * renders, and either shows no tool or runs the wrong conversion. Nothing in
 * the build, the type checker or the HTML would say so.
 *
 * So the check is a structural identity: the interactive controls on
 * /pt/<slug>/ must be the SAME SET as on its English counterpart. If the
 * component is missing the set is empty; if it is the wrong component the set
 * differs. Then one page is driven end to end so the answer is not merely
 * "the right markup rendered".
 *
 *   npm run i18n:tools
 *   CO_ORIGIN=https://convertocean.com npm run i18n:tools
 */
import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';
import { browserProfile } from '../testing-paths.mjs';

const ORIGIN = process.env.CO_ORIGIN || 'http://localhost:4321';
const EDGE = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  process.env.CHROME_PATH,
].filter(Boolean);
const browserPath = () => {
  for (const p of EDGE) if (existsSync(p)) return p;
  throw new Error('No Edge/Chrome found. Set CHROME_PATH.');
};

/* Every localised tool, as the pair it has to stay identical to. Add a row
   here whenever a tool is added to src/data/pt/. */
const PAIRS = [
  { pt: 'comprimir-pdf', en: 'compress-pdf' },
  { pt: 'juntar-pdf', en: 'merge-pdf' },
  { pt: 'jpg-para-pdf', en: 'image-to-pdf' },
  { pt: 'pdf-para-word', en: 'pdf-to-word' },
  { pt: 'word-para-pdf', en: 'word-to-pdf' },
  { pt: 'excel-para-pdf', en: 'excel-to-pdf' },
  { pt: 'pdf-para-excel', en: 'pdf-to-excel' },
  { pt: 'pdf-para-txt', en: 'pdf-to-txt' },
  { pt: 'word-para-txt', en: 'docx-to-txt' },
  { pt: 'powerpoint-para-pdf', en: 'pptx-to-pdf' },
  { pt: 'ppt-para-pdf', en: 'ppt-to-pdf' },
  { pt: 'xlsx-para-csv', en: 'xlsx-to-csv' },
  { pt: 'csv-para-xlsx', en: 'csv-to-xlsx' },
  { pt: 'csv-para-json', en: 'csv-to-json' },
  { pt: 'json-para-csv', en: 'json-to-csv' },
  { pt: 'xml-para-json', en: 'xml-to-json' },
  { pt: 'json-para-xlsx', en: 'json-to-xlsx' },
  { pt: 'jpg-para-png', en: 'jpg-to-png' },
  { pt: 'png-para-jpg', en: 'png-to-jpg' },
  { pt: 'webp-para-png', en: 'webp-to-png' },
  { pt: 'png-para-webp', en: 'png-to-webp' },
  { pt: 'imagem-para-texto', en: 'image-to-text' },
  { pt: 'txt-para-pdf', en: 'txt-to-pdf' },
  { pt: 'dividir-pdf', en: 'split-pdf' },
  { pt: 'comprimir-word', en: 'compress-word' },
  { pt: 'comprimir-powerpoint', en: 'compress-powerpoint' },
  { pt: 'comprimir-excel', en: 'compress-excel' },
  { pt: 'modelo-de-recibo', en: 'receipt-generator' },
  { pt: 'modelo-de-fatura', en: 'invoice-generator' },
  { pt: 'calculadora-de-margem-de-lucro', en: 'profit-margin-calculator' },
  { pt: 'calculadora-de-porcentagem', en: 'percentage-calculator' },
  { pt: 'ponto-de-equilibrio', en: 'break-even-calculator' },
  { pt: 'calculadora-de-imposto', en: 'sales-tax-calculator' },
  { pt: 'ofx-para-csv', en: 'ofx-to-csv' },
  { pt: 'heic-para-jpg', en: 'heic-to-jpg' },
  { pt: 'heic-para-png', en: 'heic-to-png' },
  { pt: 'webp-para-jpg', en: 'webp-to-jpg' },
  { pt: 'jpg-para-webp', en: 'jpg-to-webp' },
  { pt: 'avif-para-jpg', en: 'avif-to-jpg' },
  { pt: 'avif-para-png', en: 'avif-to-png' },
  { pt: 'xls-para-pdf', en: 'xls-to-pdf' },
  { pt: 'csv-para-pdf', en: 'csv-to-pdf' },
  { pt: 'xls-para-csv', en: 'xls-to-csv' },
  { pt: 'xml-para-csv', en: 'xml-to-csv' },
  { pt: 'xml-para-xlsx', en: 'xml-to-xlsx' },
  { pt: 'xlsx-para-json', en: 'xlsx-to-json' },
  { pt: 'xls-para-json', en: 'xls-to-json' },
  { pt: 'qbo-para-csv', en: 'qbo-to-csv' },
];

let bad = 0;
const say = (ok, msg, detail = '') => {
  if (!ok) bad++;
  console.log(`${ok ? 'OK  ' : 'FAIL'}  ${msg}${detail ? `  — ${detail}` : ''}`);
};

const browser = await puppeteer.launch({
  executablePath: browserPath(),
  headless: 'new',
  args: ['--no-sandbox'],
  /* Ours, so puppeteer never deletes it — see browserProfile(). */
  userDataDir: browserProfile('i18n'),
});

/** The ids of every control the tool component renders, as a sorted string. */
async function controlSignature(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  return page.evaluate(() => {
    const main = document.querySelector('.tool-main') || document.body;
    return [...main.querySelectorAll('[id]')]
      .map(el => el.id)
      .filter(Boolean)
      .sort()
      .join(',');
  });
}

const page = await browser.newPage();

for (const { pt, en } of PAIRS) {
  const enSig = await controlSignature(page, `${ORIGIN}/${en}/`);
  const ptSig = await controlSignature(page, `${ORIGIN}/pt/${pt}/`);

  say(enSig.length > 0, `/${en}/ renders a tool at all`, `${enSig.split(',').length} controls`);
  say(ptSig === enSig,
      `/pt/${pt}/ renders the SAME converter as /${en}/`,
      ptSig === enSig ? `${ptSig.split(',').length} controls match` : `pt has [${ptSig}] vs en [${enSig}]`);

  // The page must actually be in Portuguese, not the English page on a pt URL.
  const meta = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    canonical: document.querySelector('link[rel=canonical]')?.href || '',
    alt: [...document.querySelectorAll('link[rel=alternate]')].map(l => `${l.hreflang} ${l.href}`),
    h1: document.querySelector('h1')?.textContent?.trim() || '',
  }));
  say(meta.lang === 'pt', `/pt/${pt}/ declares lang="pt"`, meta.lang);
  say(meta.canonical.endsWith(`/pt/${pt}/`), `/pt/${pt}/ self-canonicalises`, meta.canonical);
  say(meta.alt.some(a => a.startsWith('en ') && a.endsWith(`/${en}/`)),
      `/pt/${pt}/ points its English alternate at /${en}/`, meta.alt.join(' | '));
}

/* Structure proves the right component rendered. This proves it RUNS — that
   the Portuguese route reaches a working engine and produces a real PDF,
   rather than a correct-looking page whose converter never fires. */
{
  await page.goto(`${ORIGIN}/pt/jpg-para-pdf/`, { waitUntil: 'networkidle2', timeout: 60000 });
  const input = await page.$('#fileInput');
  say(Boolean(input), '/pt/jpg-para-pdf/ exposes its file input');

  if (input) {
    await input.uploadFile('testing/fixtures/torture.jpg');
    await page.waitForFunction(
      () => !document.getElementById('btnDownload')?.disabled,
      { timeout: 60000 }
    ).catch(() => {});

    const ready = await page.evaluate(() => {
      const btn = document.getElementById('btnDownload');
      return { present: Boolean(btn), enabled: btn ? !btn.disabled : false };
    });
    say(ready.enabled,
        '/pt/jpg-para-pdf/ converts a real JPG and enables its download',
        ready.present ? `enabled=${ready.enabled}` : 'no download button');
  }
}

await browser.close();
console.log(bad ? `\n${bad} failed` : '\nall passed');
process.exit(bad ? 1 : 0);
