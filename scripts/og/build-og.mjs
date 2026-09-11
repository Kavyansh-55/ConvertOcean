/**
 * Build the Open Graph / WhatsApp preview image from the site's own tokens.
 *
 * The previous `og-image.png` was cut on 2026-07-19, before the v1.1.0 palette
 * landed. It showed a dark navy hero that no longer exists anywhere on the
 * site, so every link shared to WhatsApp, Slack or X advertised a product that
 * looked nothing like the page it opened.
 *
 * Rendering it from HTML rather than hand-painting it means the card uses the
 * real palette values and the real Satoshi faces, and can be regenerated from
 * the same command whenever the design moves again:
 *
 *   node scripts/og/build-og.mjs
 *
 * Output is exactly 1200x630, the size declared in `og:image:width/height`.
 */
import puppeteer from 'puppeteer-core';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const EDGE_CANDIDATES = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  process.env.CHROME_PATH,
].filter(Boolean);

function browserPath() {
  for (const p of EDGE_CANDIDATES) if (existsSync(p)) return p;
  throw new Error('No Edge/Chrome found. Set CHROME_PATH to a browser executable.');
}

/* The fonts and mark are inlined as data URIs. A headless page loading them
   over file:// is fragile, and the image must not depend on the dev server. */
const dataUri = (path, mime) =>
  `data:${mime};base64,` + readFileSync(join(ROOT, path)).toString('base64');

const satoshi900 = dataUri('public/fonts/satoshi-900.woff2', 'font/woff2');
const satoshi700 = dataUri('public/fonts/satoshi-700.woff2', 'font/woff2');
const satoshi500 = dataUri('public/fonts/satoshi-500.woff2', 'font/woff2');
const mark = dataUri('public/logo.png', 'image/png');

/* Straight from src/styles/theme.css — if the palette moves, move these. */
const LIME = '#d2e823';
const INK = '#1e2330';

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face { font-family:'Satoshi'; src:url('${satoshi900}') format('woff2'); font-weight:900; }
  @font-face { font-family:'Satoshi'; src:url('${satoshi700}') format('woff2'); font-weight:700; }
  @font-face { font-family:'Satoshi'; src:url('${satoshi500}') format('woff2'); font-weight:500; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    width:1200px; height:630px; background:${LIME}; color:${INK};
    font-family:'Satoshi', system-ui, sans-serif;
    padding:64px 72px; display:flex; flex-direction:column; justify-content:space-between;
    -webkit-font-smoothing:antialiased;
  }
  .brand { display:flex; align-items:center; gap:16px; }
  .brand img { width:64px; height:64px; border-radius:16px; display:block; }
  .brand .name { font-size:34px; font-weight:700; letter-spacing:-0.01em; }
  .brand .name span { font-weight:500; opacity:.72; }

  .pill {
    display:inline-flex; align-items:center; gap:12px; align-self:flex-start;
    background:${INK}; color:#fff; border-radius:999px;
    padding:14px 26px; font-size:22px; font-weight:700; letter-spacing:-0.01em;
  }
  .pill .dot { width:11px; height:11px; border-radius:50%; background:${LIME}; }
  .pill .lime { color:${LIME}; }

  h1 {
    font-size:96px; font-weight:900; line-height:0.98; letter-spacing:-0.035em;
    margin:26px 0 22px;
  }
  .sub { font-size:27px; font-weight:500; line-height:1.35; max-width:940px; opacity:.82; }

  .foot { display:flex; gap:12px; flex-wrap:wrap; }
  .chip {
    border:2px solid ${INK}; border-radius:999px; padding:11px 22px;
    font-size:20px; font-weight:700; letter-spacing:-0.01em;
  }
  .chip.solid { background:${INK}; color:${LIME}; border-color:${INK}; }
</style></head>
<body>
  <div class="brand">
    <img src="${mark}" alt="">
    <div class="name">Convert<span>ocean</span></div>
  </div>

  <div>
    <div class="pill"><span class="dot"></span><span class="lime">0 bytes uploaded.</span> Works with your Wi-Fi off.</div>
    <h1>Convert files.<br>Upload nothing.</h1>
    <div class="sub">65 free tools for PDFs, images, spreadsheets and documents &mdash; every one of them runs inside your browser tab.</div>
  </div>

  <div class="foot">
    <div class="chip solid">No uploads</div>
    <div class="chip">No sign-up</div>
    <div class="chip">Works offline</div>
    <div class="chip">Open source</div>
  </div>
</body></html>`;

const browser = await puppeteer.launch({
  executablePath: browserPath(), headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluateHandle('document.fonts.ready');
await new Promise((r) => setTimeout(r, 400));

const out = join(ROOT, 'public', 'og-cover-v2.png');
await page.screenshot({ path: out, type: 'png' });
await browser.close();

const bytes = readFileSync(out);
const w = bytes.readUInt32BE(16);
const h = bytes.readUInt32BE(20);
console.log(`og-cover-v2.png  ${w}x${h}  ${(bytes.length / 1024).toFixed(0)} KB`);
if (w !== 1200 || h !== 630) {
  console.error('dimensions must stay 1200x630 to match the meta tags');
  process.exit(1);
}
