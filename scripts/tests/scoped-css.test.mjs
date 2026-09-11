/**
 * Does any component style a class that its own scoped CSS can never reach?
 *
 * Astro rewrites a scoped selector `.thing` to `.thing[data-astro-cid-xxxx]`,
 * and it stamps that attribute onto elements written in the template. Elements
 * built at runtime — `document.createElement` plus `className`, or a chunk of
 * `innerHTML` — carry no such attribute, so every rule written for them is
 * dead. The page still renders; it just renders unstyled, which is why this
 * keeps shipping unnoticed.
 *
 * It has shipped six times. `/split-pdf/`'s page thumbnails were the sixth:
 * 40 lines of card, border and canvas-sizing rules that have never applied to
 * anything. So this stops being a thing people remember to check.
 *
 * The rule: a class that appears in a **scoped** `<style>` block and in
 * runtime-generated markup, but nowhere in the template, is dead.
 *
 * Deliberately not flagged:
 *   - `<style is:global>` blocks — global rules reach runtime markup fine, and
 *     that is the documented fix.
 *   - classes applied with `classList.add()` / `.remove()` / `.toggle()`, which
 *     normally decorate an element that *is* in the template and does carry the
 *     attribute (`.selected`, `.dragover`, `.active`).
 *   - classes defined in `src/styles/`, which is not scoped at all.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';

const ROOTS = ['src/components', 'src/components/tools'];

/** Every .astro file directly inside the given directories. */
function componentFiles() {
  const out = [];
  for (const dir of ROOTS) {
    for (const name of readdirSync(dir, { withFileTypes: true })) {
      if (name.isFile() && name.name.endsWith('.astro')) out.push(join(dir, name.name));
    }
  }
  return out;
}

/** The contents of each `<style>` block, split by whether it is scoped. */
function styleBlocks(src) {
  const scoped = [];
  const global = [];
  const re = /<style([^>]*)>([\s\S]*?)<\/style>/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    (/\bis:global\b/.test(m[1]) ? global : scoped).push(m[2]);
  }
  return { scoped, global };
}

/**
 * Class names targeted by scoped rules in a chunk of CSS.
 *
 * Anything inside Astro's `:global(...)` is removed first. That modifier is
 * the documented fix for exactly this problem and is already used correctly in
 * HeroDropzone, ExifTool and JsonFormatter, so counting those classes would
 * report the fix as the bug.
 */
function styledClasses(css) {
  const out = new Set();
  /* Strip comments, then `:global(...)`, then declaration blocks, so neither a
     deliberate global escape nor a property value can be read as a selector. */
  const selectorsOnly = css
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    /* One level of nesting allowed inside :global(), because real selectors
       contain it: `:global(.item-edit-row td:nth-child(1)::before)`. A
       non-nesting pattern stops at that inner paren and reports the class
       as unscoped. */
    .replace(/:global\s*\((?:[^()]|\([^()]*\))*\)/g, ' ')
    .replace(/\{[^{}]*\}/g, '{}');
  for (const m of selectorsOnly.matchAll(/\.(-?[A-Za-z_][\w-]*)/g)) out.add(m[1]);
  return out;
}

/** Everything outside `<style>` and `<script>` — i.e. the real template. */
function templateMarkup(src) {
  return src
    .replace(/<style[^>]*>[\s\S]*?<\/style>/g, ' ')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/g, ' ');
}

/** Class names written into the template's own markup. */
function templateClasses(src) {
  const out = new Set();
  const markup = templateMarkup(src);
  for (const m of markup.matchAll(/class(?:Name)?\s*=\s*(?:"([^"]*)"|'([^']*)'|\{`([^`]*)`\})/g)) {
    for (const c of (m[1] || m[2] || m[3] || '').split(/[\s{}?:|]+/)) {
      if (c) out.add(c.replace(/^\./, ''));
    }
  }
  return out;
}

/**
 * Class names that only ever arrive on an element built at runtime.
 *
 * Reads `className = '…'` assignments and any markup inside a string handed to
 * `innerHTML` / `insertAdjacentHTML`. `classList` is intentionally excluded —
 * see the header note.
 */
function runtimeClasses(src) {
  const out = new Set();
  const scripts = [...src.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n');

  for (const m of scripts.matchAll(/\.className\s*=\s*(?:'([^']*)'|"([^"]*)"|`([^`]*)`)/g)) {
    for (const c of (m[1] || m[2] || m[3] || '').split(/\s+/)) if (c) out.add(c);
  }
  /* Markup assembled as a string: pick class attributes out of it. */
  for (const m of scripts.matchAll(/class\s*=\s*(?:\\?"([^"\\]*)\\?"|'([^']*)')/g)) {
    for (const c of (m[1] || m[2] || '').split(/\s+/)) if (c) out.add(c);
  }
  return out;
}

test('no component styles a class its scoped CSS cannot reach', () => {
  const findings = [];

  for (const file of componentFiles()) {
    const src = readFileSync(file, 'utf8');
    const { scoped, global } = styleBlocks(src);
    if (!scoped.length) continue;

    const scopedStyled = styledClasses(scoped.join('\n'));
    const globalStyled = styledClasses(global.join('\n'));
    const inTemplate = templateClasses(src);
    const atRuntime = runtimeClasses(src);

    for (const cls of scopedStyled) {
      if (inTemplate.has(cls)) continue;      // template element carries the attribute
      if (globalStyled.has(cls)) continue;    // also styled globally, so it does apply
      if (!atRuntime.has(cls)) continue;      // never applied anywhere we can see
      findings.push(`${basename(file)} .${cls}`);
    }
  }

  assert.deepEqual(
    findings, [],
    'These classes are styled in a scoped <style> block but only ever land on ' +
    'elements built at runtime, so the rules never apply. Move them to ' +
    '<style is:global> (and prefix the class) or render the element in the ' +
    `template:\n  ${findings.join('\n  ')}\n`,
  );
});
