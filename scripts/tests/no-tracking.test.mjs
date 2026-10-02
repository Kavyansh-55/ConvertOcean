/**
 * Every test browser must block analytics and ads.
 *
 * Suites run against production, and each run used to be counted by Google
 * Analytics as new visitors firing real file_converted events — the GA spikes
 * of 6-7 and 11-13 Sep 2026 were verification runs, not readers. Once AdSense
 * serves ads, automated page loads that request them are invalid traffic.
 * The block lives in testing-paths.mjs (NO_TRACKING / TRACKING_URL); this
 * asserts every browser launch actually uses it, because a new suite copied
 * from an old example is exactly how it would quietly stop.
 *
 * Run: node --test scripts/tests/no-tracking.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const FIDELITY = join('scripts', 'fidelity');
const suites = [
  ...readdirSync(FIDELITY).filter((f) => f.endsWith('.mjs')).map((f) => join(FIDELITY, f)),
  join('scripts', 'screenshots.mjs'),
];

test('every Chromium suite launches with the tracking block', () => {
  const launches = [];
  const missing = [];
  for (const file of suites) {
    const src = readFileSync(file, 'utf8');
    for (const m of src.matchAll(/puppeteer\.launch\(\{/g)) {
      launches.push(file);
      // The launch options object: up to the first "})" after the call.
      const opts = src.slice(m.index, src.indexOf('})', m.index));
      if (!/NO_TRACKING/.test(opts)) missing.push(file);
    }
  }
  // A parse floor: a regex that stops matching would otherwise pass vacuously.
  assert.ok(launches.length >= 18, `only ${launches.length} launches found — the scan is not reading the suites`);
  assert.deepStrictEqual(missing, [], `suites launching a browser that can reach analytics/ads:\n${missing.join('\n')}`);
});

test('the WebKit suite routes tracking hosts to abort in every context', () => {
  const src = readFileSync(join(FIDELITY, 'verify-webkit.mjs'), 'utf8');
  const contexts = (src.match(/browser\.newContext\(/g) || []).length;
  const routed = (src.match(/context\.route\(TESTING_PATHS\.TRACKING_URL/g) || []).length;
  assert.ok(contexts > 0, 'no WebKit contexts found — the scan is not reading the suite');
  assert.strictEqual(routed, contexts, `${contexts} WebKit contexts but ${routed} block tracking`);
});

test('the block covers analytics, ads and Cloudflare beacons', () => {
  const src = readFileSync(join('scripts', 'testing-paths.mjs'), 'utf8');
  for (const host of ['googletagmanager', 'google-analytics', 'googlesyndication', 'doubleclick', 'cloudflareinsights']) {
    assert.ok(src.includes(host), `testing-paths.mjs does not block ${host}`);
  }
});
