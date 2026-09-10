/** Rebuild every fixture. Cheap enough to run before each harness pass. */
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
for (const f of ['build-docx.mjs', 'build-xlsx.mjs', 'build-pptx.mjs', 'build-pdf.mjs',
                 'build-text.mjs', 'build-images.mjs']) {
  execFileSync(process.execPath, [join(HERE, f)], { stdio: 'inherit' });
}

/* Merge tools take several files at once, and some of them de-duplicate by
   filename — uploading the same fixture twice leaves the Merge button
   disabled and the harness waiting on a download that can never come. Make a
   distinctly-named second copy of each mergeable fixture so "merge two files"
   is actually what gets tested. */
import { copyFileSync, existsSync as exists } from 'node:fs';
const FILES = join(HERE, 'files');
// torture-b.pptx is NOT a copy: build-pptx.mjs emits a deliberately
// different deck, because two identical decks cannot reveal a merger that
// forgets to copy media and layouts.
for (const name of ['torture.pdf', 'torture.docx', 'torture.txt', 'torture.xlsx']) {
  const src = join(FILES, name);
  if (exists(src)) copyFileSync(src, join(FILES, name.replace('torture.', 'torture-b.')));
}
console.log('second copies written for merge inputs (torture-b.*)');
