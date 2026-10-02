/**
 * The half of /image-resizer/ that nothing had ever pressed.
 *
 * The recipe checks drive the default path — resize by dimensions — and pass
 * three assertions about pixels and transparency. The page's OTHER mode,
 * "Compress to File Size", has its own tab, its own KB presets and its own
 * quality search, and no suite had ever clicked it. That is the same shape as
 * the /compress-pdf/ "Fit to this size" button, which was dead for months
 * behind 38 green engine-level checks.
 *
 * So this drives the real control: switch mode, set a target, press Resize,
 * and hold the RESULT to the number the reader was promised.
 *
 * The source image is generated in the page as photographic noise, because a
 * fixture that already fits the target proves nothing — torture.jpg is 4 KB,
 * a fifth of the smallest preset.
 *
 *   npm run imgsize
 *   CO_ORIGIN=https://convertocean.com npm run imgsize
 */
import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';
import { browserProfile, NO_TRACKING } from '../testing-paths.mjs';

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

let bad = 0;
const say = (ok, msg, detail = '') => {
  if (!ok) bad++;
  console.log(`${ok ? 'OK  ' : 'FAIL'}  ${msg}${detail ? `  — ${detail}` : ''}`);
};

const browser = await puppeteer.launch({
  executablePath: browserPath(), headless: 'new',
  args: [NO_TRACKING, '--no-sandbox'], userDataDir: browserProfile('image-resize'),
});
const page = await browser.newPage();
await page.goto(`${ORIGIN}/image-resizer/`, { waitUntil: 'networkidle0', timeout: 60000 });

// A noisy photo does not deflate, so the source is genuinely large.
const srcBytes = await page.evaluate(async () => {
  const c = document.createElement('canvas');
  c.width = 1600; c.height = 1200;
  const ctx = c.getContext('2d');
  const d = ctx.createImageData(c.width, c.height);
  for (let i = 0; i < d.data.length; i += 4) {
    d.data[i] = Math.random() * 255; d.data[i + 1] = Math.random() * 255;
    d.data[i + 2] = Math.random() * 255; d.data[i + 3] = 255;
  }
  ctx.putImageData(d, 0, 0);
  const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', 0.95));
  const file = new File([blob], 'noise.jpg', { type: 'image/jpeg' });
  const dt = new DataTransfer();
  dt.items.add(file);
  const input = document.getElementById('fileInput');
  input.files = dt.files;
  input.dispatchEvent(new Event('change', { bubbles: true }));
  return blob.size;
});
await page.waitForSelector('#rzWorkspace', { visible: true, timeout: 20000 });
say(srcBytes > 200 * 1024, 'Source is large enough for the target to mean something',
    `${(srcBytes / 1024).toFixed(0)} KB`);

for (const targetKB of [20, 100]) {
  await page.click('#rzTabSize');
  const shown = await page.$eval('#rzSizeFields', el => getComputedStyle(el).display !== 'none');
  say(shown, `Pressing "Compress to File Size" reveals the KB controls (${targetKB} KB run)`);

  await page.$eval('#rzTargetKB', (el, v) => {
    el.value = String(v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, targetKB);

  /* The download button is already enabled from the previous run, so waiting
     on it returns instantly and reads the PREVIOUS result. Wait for the
     preview's object URL to actually change instead. */
  const before = await page.$eval('#rzPreview', el => el.src);
  await page.click('#rzApply');
  await page.waitForFunction(
    prev => {
      const el = document.getElementById('rzPreview');
      return el && el.src && el.src !== prev && !document.getElementById('rzDownload').disabled;
    },
    { timeout: 45000 }, before);

  // Read the real encoded result, not the summary text describing it.
  const outBytes = await page.evaluate(async () => {
    const src = document.getElementById('rzPreview').src;
    const r = await fetch(src);
    return (await r.blob()).size;
  });

  say(outBytes <= targetKB * 1024,
      `Result honours the ${targetKB} KB target`,
      `${(outBytes / 1024).toFixed(1)} KB from ${(srcBytes / 1024).toFixed(0)} KB`);
  say(outBytes > 0.25 * targetKB * 1024,
      `${targetKB} KB result is not crushed far below what was asked`,
      `${((outBytes / (targetKB * 1024)) * 100).toFixed(0)}% of target`);
}

await browser.close();
console.log(bad ? `\n${bad} failed` : '\nall passed');
process.exit(bad ? 1 : 0);
