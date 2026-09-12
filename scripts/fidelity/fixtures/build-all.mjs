/** Rebuild every fixture. Cheap enough to run before each harness pass. */
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
for (const f of ['build-docx.mjs', 'build-xlsx.mjs', 'build-pptx.mjs', 'build-pdf.mjs',
                 'build-compress-pdf.mjs', 'build-text.mjs', 'build-images.mjs']) {
  execFileSync(process.execPath, [join(HERE, f)], { stdio: 'inherit' });
}

/* Merge tools take several files at once, and some of them de-duplicate by
   filename — uploading the same fixture twice leaves the Merge button
   disabled and the harness waiting on a download that can never come. Make a
   distinctly-named second copy of each mergeable fixture so "merge two files"
   is actually what gets tested. */
import { copyFileSync, existsSync as exists } from 'node:fs';
import * as TESTING_PATHS from '../../testing-paths.mjs';
const FILES = TESTING_PATHS.FIXTURES;

/* The legacy .xls fixture needs a browser to write it — there is no SheetJS in
   node_modules, so it is produced by the very library the tools use, and
   checked for the OLE2 signature before it is written. It is slower than the
   rest and does not change between runs, so it is only built when missing;
   delete the file to force a fresh one. */
if (!exists(join(FILES, 'torture.xls'))) {
  execFileSync(process.execPath, [join(HERE, 'build-xls.mjs')], { stdio: 'inherit' });
} else {
  console.log('torture.xls   already present (delete it to rebuild)');
}

// torture-b.pptx and torture-b.xlsx are NOT copies: their builders emit a
// deliberately different deck and workbook, because two identical files
// cannot reveal a merger that forgets to copy media and layouts, or one that
// appends cells still pointing at their old workbook's style table.
for (const name of ['torture.pdf', 'torture.docx', 'torture.txt']) {
  const src = join(FILES, name);
  if (exists(src)) copyFileSync(src, join(FILES, name.replace('torture.', 'torture-b.')));
}
console.log('second copies written for merge inputs (torture-b.*)');
