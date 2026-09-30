/**
 * The keys of the Portuguese dictionaries — src/i18n/ui.ts and
 * src/i18n/ui-runtime-pt.ts — read as text so Node can check them without
 * compiling TypeScript. Keys are single-quoted English strings at the start of
 * a line followed by a colon.
 */
import { readFileSync } from 'node:fs';

export const PT_FILES = ['src/i18n/ui.ts', 'src/i18n/ui-runtime-pt.ts'];

export function ptKeys(files = PT_FILES) {
  const out = new Set();
  for (const file of files) {
    const src = readFileSync(file, 'utf8');
    for (const m of src.matchAll(/^\s+'((?:[^'\\]|\\.)*)':\s*['"`]/gm)) {
      out.add(m[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\'));
    }
  }
  return out;
}
