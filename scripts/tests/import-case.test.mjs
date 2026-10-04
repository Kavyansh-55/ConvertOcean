/* Every relative import must match the file name's exact case.
 *
 * Windows resolves '../components/footer.astro' to Footer.astro without a
 * word; Linux does not. Since 2026-10 the scheduled guides are built and
 * deployed by a GitHub Action on Ubuntu (.github/workflows/publish.yml), so a
 * case slip that every local build accepts would fail the morning deploy —
 * and a guide's publish day would pass with nothing published.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

function sourceFiles(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) sourceFiles(p, out);
    else if (/\.(astro|ts|mjs|js)$/.test(f)) out.push(p);
  }
  return out;
}

const isFile = (p) => { try { return statSync(p).isFile(); } catch { return false; } };

/** True only if every path segment exists with exactly this spelling. */
function existsExactly(p) {
  const parts = resolve(p).split(/[\\/]/);
  let cur = parts[0] + '/';
  for (let i = 1; i < parts.length; i++) {
    let names;
    try { names = readdirSync(cur); } catch { return false; }
    if (!names.includes(parts[i])) return false;
    cur = join(cur, parts[i]);
  }
  return true;
}

test('relative imports match the case of the files they name', () => {
  const files = sourceFiles(join(ROOT, 'src'));
  let checked = 0;
  const bad = [];
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    for (const m of src.matchAll(/(?:from\s+|import\s*\(\s*|import\s+)['"](\.{1,2}\/[^'"]+)['"]/g)) {
      const spec = m[1];
      const base = resolve(dirname(f), spec);
      const candidates = extname(spec) ? [base] : ['.ts', '.js', '.mjs', '.astro', '/index.ts', '/index.js'].map((e) => base + e);
      if (!candidates.some(isFile)) continue; // not a file import this check can judge
      checked++;
      if (!candidates.some(existsExactly)) bad.push(`${f.slice(ROOT.length + 1)}: ${spec}`);
    }
  }
  // A floor, so a regex that silently stops matching cannot pass on zero.
  assert.ok(checked > 200, `only ${checked} imports parsed — the scan is broken`);
  assert.deepStrictEqual(bad, [], 'Fix the case to match the file on disk:\n' + bad.join('\n'));
});
