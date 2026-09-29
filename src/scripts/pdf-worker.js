/**
 * Fetch pdf.js's worker while the page loads, not when the first PDF arrives.
 *
 * pdf.js does its parsing in a separate worker script, and it only requests
 * that script from the CDN on the first `getDocument()` call. So "works
 * offline once the page has loaded" was false for every pdf.js tool: load
 * /split-pdf/, lose the connection, drop a PDF, and it failed — measured
 * 2026-09-29 on /split-pdf/, /compress-pdf/ and /pdf-to-txt/. Compress PDF
 * then blamed the file ("If it is password-protected…"), the exact
 * wrong-culprit message ensure-lib.js exists to prevent.
 *
 * Fetching the worker's text up front and handing pdf.js a blob: URL of it
 * makes the claim true. It also means pdf.js gets a real same-origin Worker
 * instead of falling back to running on the main thread, which it does when
 * workerSrc is cross-origin.
 *
 * If every fetch fails, workerSrc is left as it was — the tool then behaves
 * exactly as it did before, fetching on first use.
 */

export const PDF_WORKER_URLS = [
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js',
  'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.worker.min.js',
];

/**
 * @param {object} [opts]
 * @param {object} [opts.win] window (injectable for tests)
 * @param {string[]} [opts.urls]
 * @returns {Promise<boolean>} true when pdf.js now points at a local copy
 */
export async function preloadPdfWorker(opts = {}) {
  const win = opts.win || (typeof window !== 'undefined' ? window : null);
  const urls = opts.urls || PDF_WORKER_URLS;
  if (!win || !win.pdfjsLib || !win.pdfjsLib.GlobalWorkerOptions) return false;

  for (const url of urls) {
    try {
      const res = await win.fetch(url);
      if (!res.ok) continue;
      const text = await res.text();
      // A captive portal or filter can answer 200 with an HTML page.
      if (!text || /^\s*</.test(text)) continue;
      const blob = new win.Blob([text], { type: 'text/javascript' });
      win.pdfjsLib.GlobalWorkerOptions.workerSrc = win.URL.createObjectURL(blob);
      return true;
    } catch { /* try the next host */ }
  }
  return false;
}
