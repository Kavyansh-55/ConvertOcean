/**
 * pdf-worker — fetch pdf.js's worker at page load so a PDF opens offline.
 *
 * pdf.js requested its worker only on the first getDocument(), so every
 * pdf.js tool failed when the connection dropped after the page had loaded —
 * while four FAQ answers promised it would keep working. The browser-level
 * proof is scripts/fidelity/verify-offline.mjs; this covers the decisions.
 */
import { test } from 'node:test';
import assert from 'node:assert';
import { preloadPdfWorker, PDF_WORKER_URLS } from '../../src/scripts/pdf-worker.js';

function fakeWin(responses) {
  const asked = [];
  const win = {
    pdfjsLib: { GlobalWorkerOptions: { workerSrc: 'https://cdn.example/pdf.worker.min.js' } },
    Blob: class { constructor(parts, o) { this.parts = parts; this.type = o.type; } },
    URL: { createObjectURL: (b) => 'blob:local/' + b.parts[0].length },
    fetch: async (url) => {
      asked.push(url);
      const r = responses[url];
      if (r === 'throw') throw new TypeError('Failed to fetch');
      return { ok: r !== undefined && r !== 404, text: async () => r };
    },
  };
  return { win, asked };
}

const [A, B] = PDF_WORKER_URLS;

test('points pdf.js at a local copy of the worker', async () => {
  const { win } = fakeWin({ [A]: 'var pdfjsWorker=1;' });
  assert.strictEqual(await preloadPdfWorker({ win }), true);
  assert.match(win.pdfjsLib.GlobalWorkerOptions.workerSrc, /^blob:/);
});

test('falls back to the second host when the first is unreachable', async () => {
  const { win, asked } = fakeWin({ [A]: 'throw', [B]: 'var pdfjsWorker=2;' });
  assert.strictEqual(await preloadPdfWorker({ win }), true);
  assert.deepStrictEqual(asked, [A, B]);
  assert.match(win.pdfjsLib.GlobalWorkerOptions.workerSrc, /^blob:/);
});

test('refuses an HTML page served with status 200 (captive portal, filter)', async () => {
  const { win } = fakeWin({ [A]: '<!doctype html><title>Log in</title>', [B]: 404 });
  assert.strictEqual(await preloadPdfWorker({ win }), false);
});

test('leaves workerSrc untouched when every host fails', async () => {
  const { win } = fakeWin({ [A]: 'throw', [B]: 404 });
  const before = win.pdfjsLib.GlobalWorkerOptions.workerSrc;
  assert.strictEqual(await preloadPdfWorker({ win }), false);
  assert.strictEqual(win.pdfjsLib.GlobalWorkerOptions.workerSrc, before);
});

test('does nothing on a page without pdf.js', async () => {
  const { win, asked } = fakeWin({});
  delete win.pdfjsLib;
  assert.strictEqual(await preloadPdfWorker({ win }), false);
  assert.strictEqual(asked.length, 0, 'no fetch on pages that never read a PDF');
});

test('both hosts serve the same pinned version as the page', () => {
  for (const u of PDF_WORKER_URLS) assert.match(u, /3\.4\.120\/(build\/)?pdf\.worker\.min\.js$/);
});
