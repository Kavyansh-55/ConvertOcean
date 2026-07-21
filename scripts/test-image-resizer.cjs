// Regression test: image-resizer compress-to-KB + dimensions modes.
// Usage: npm run build && npx astro preview --port 4321 & node scratch/test-image-resizer.cjs
// Isolated end-to-end tests of /image-resizer/ — fresh page per case, sentinel-based waits
const puppeteer = require('puppeteer-core');

async function newLoadedPage(browser) {
  const page = await browser.newPage();
  page.on('pageerror', e => console.log('  PAGE ERROR:', e.message));
  await page.goto('http://localhost:4321/image-resizer/', { waitUntil: 'networkidle2' });
  await page.evaluate(async () => {
    const c = document.createElement('canvas');
    c.width = 2400; c.height = 1600;
    const ctx = c.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 2400, 1600);
    grad.addColorStop(0, '#3a6ea5'); grad.addColorStop(0.5, '#c46a33'); grad.addColorStop(1, '#2d8a4e');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 2400, 1600);
    const d = ctx.getImageData(0, 0, 2400, 1600);
    for (let i = 0; i < d.data.length; i += 4) {
      const n = (Math.random() - 0.5) * 60;
      d.data[i] += n; d.data[i + 1] += n; d.data[i + 2] += n;
    }
    ctx.putImageData(d, 0, 0);
    const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', 0.95));
    window.__inBytes = blob.size;
    const file = new File([blob], 'test-photo.jpg', { type: 'image/jpeg' });
    const dt = new DataTransfer();
    dt.items.add(file);
    const input = document.getElementById('fileInput');
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForFunction(() => document.getElementById('rzWorkspace').style.display === 'grid', { timeout: 15000 });
  return page;
}

async function applyAndWait(page) {
  await page.evaluate(() => { document.getElementById('rzSummary').textContent = '__PENDING__'; });
  await page.click('#rzApply');
  await page.waitForFunction(() => {
    const s = document.getElementById('rzSummary').textContent;
    const e = document.getElementById('errorBanner');
    return (s !== '__PENDING__' && s.includes('Result')) || (e.style.display === 'flex');
  }, { timeout: 60000 });
  const summary = await page.$eval('#rzSummary', el => el.textContent.replace(/\s+/g, ' ').trim());
  const error = await page.$eval('#errorBanner', el => el.style.display === 'flex' ? el.textContent.trim() : '');
  return { summary, error };
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });

  let allPass = true;

  // Size-target cases (isolated pages)
  for (const targetKB of [100, 20, 10]) {
    const page = await newLoadedPage(browser);
    const inKB = (await page.evaluate(() => window.__inBytes)) / 1024;
    await page.click('#rzTabSize');
    await page.evaluate(kb => { document.getElementById('rzTargetKB').value = kb; }, targetKB);
    const { summary, error } = await applyAndWait(page);
    const m = summary.match(/Result:\s*(\d+)×(\d+) px · ([\d.]+) (KB|MB)/);
    const outKB = m ? parseFloat(m[3]) * (m[4] === 'MB' ? 1024 : 1) : NaN;
    const pass = m && outKB <= targetKB;
    allPass = allPass && pass;
    console.log(`[size ${String(targetKB).padStart(3)} KB] in=${inKB.toFixed(0)}KB -> ${summary}${error ? ' | ERR: ' + error : ''} => ${pass ? 'PASS' : 'FAIL'}`);
    await page.close();
  }

  // Re-run on the SAME page: change target and apply again (the user's likely flow)
  {
    const page = await newLoadedPage(browser);
    await page.click('#rzTabSize');
    await page.evaluate(() => { document.getElementById('rzTargetKB').value = 100; });
    const r1 = await applyAndWait(page);
    await page.evaluate(() => { document.getElementById('rzTargetKB').value = 20; });
    const r2 = await applyAndWait(page);
    const m = r2.summary.match(/Result:\s*\d+×\d+ px · ([\d.]+) KB/);
    const pass = m && parseFloat(m[1]) <= 20;
    allPass = allPass && pass;
    console.log(`[rerun 100->20 KB] run1: ${r1.summary}`);
    console.log(`                   run2: ${r2.summary} => ${pass ? 'PASS' : 'FAIL'}`);
    await page.close();
  }

  // Dimensions-after-size flow (mode switching on same page)
  {
    const page = await newLoadedPage(browser);
    await page.click('#rzTabSize');
    await page.evaluate(() => { document.getElementById('rzTargetKB').value = 50; });
    await applyAndWait(page);
    await page.click('#rzTabDims');
    await page.evaluate(() => {
      document.getElementById('rzLock').checked = false;
      document.getElementById('rzWidth').value = 200;
      document.getElementById('rzHeight').value = 230;
    });
    const { summary } = await applyAndWait(page);
    const pass = summary.includes('200×230');
    allPass = allPass && pass;
    console.log(`[size->dims switch] ${summary} => ${pass ? 'PASS' : 'FAIL'}`);
    await page.close();
  }

  // User-reported scenario: small smooth photo whose max-quality re-encode is
  // ALREADY under the target — expect same dimensions + "already under" message
  {
    const page = await browser.newPage();
    page.on('pageerror', e => console.log('  PAGE ERROR:', e.message));
    await page.goto('http://localhost:4321/image-resizer/', { waitUntil: 'networkidle2' });
    await page.evaluate(async () => {
      const c = document.createElement('canvas');
      c.width = 373; c.height = 482;
      const ctx = c.getContext('2d');
      const grad = ctx.createLinearGradient(0, 0, 0, 482);
      grad.addColorStop(0, '#8a7ba8'); grad.addColorStop(0.6, '#4a4a6a'); grad.addColorStop(1, '#101020');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, 373, 482);
      ctx.fillStyle = '#0a0a12';
      ctx.fillRect(150, 150, 80, 300);
      const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', 1.0));
      const file = new File([blob], 'small-photo.jpg', { type: 'image/jpeg' });
      const dt = new DataTransfer();
      dt.items.add(file);
      const input = document.getElementById('fileInput');
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.waitForFunction(() => document.getElementById('rzWorkspace').style.display === 'grid', { timeout: 15000 });
    await page.click('#rzTabSize');
    await page.evaluate(() => { document.getElementById('rzTargetKB').value = 79; });
    const { summary } = await applyAndWait(page);
    const sameDims = summary.includes('373×482 px') && summary.split('373×482').length >= 3;
    const hasMsg = summary.includes('maximum quality');
    const m = summary.match(/Result:\s*\d+×\d+ px · ([\d.]+) KB/);
    const under = m && parseFloat(m[1]) <= 79;
    const pass = sameDims && hasMsg && under;
    allPass = allPass && pass;
    console.log(`[already-fits 79 KB] ${summary} => ${pass ? 'PASS' : 'FAIL'} (dims=${sameDims} msg=${hasMsg} under=${under})`);
    await page.close();
  }

  console.log('\nOVERALL:', allPass ? 'ALL TESTS PASS' : 'FAILURES PRESENT');
  await browser.close();
  process.exit(allPass ? 0 : 1);
})().catch(e => { console.error('TEST HARNESS FAILED:', e.message); process.exit(1); });
