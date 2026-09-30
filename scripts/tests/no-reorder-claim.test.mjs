/**
 * No page may promise a reorder control, because no tool has one.
 *
 * The Portuguese copy told readers of /pt/juntar-pdf/ and /pt/imagem-para-pdf/
 * to "reordene-os arrastando cada miniatura" and "arraste as miniaturas até a
 * sequência ficar correta" — on eight lines across four pages. None of the
 * multi-file tools (MergePdf, MergeWord, MergePptx, MergeExcel, MergeTxt,
 * MergeImages, ImageToPdf) can reorder: the list is the order the files were
 * chosen, and the only control is ✕ to remove one. The English copy made it
 * too, in wordings this list did not name until 2026-09-29.
 *
 * For a concurso applicant told to "drag the thumbnails into the order the
 * edital requires", a control that is not there means a document submitted in
 * the wrong order. So the claim is banned in both languages, and the order the
 * files ARE chosen in is guaranteed by scripts/fidelity/verify-order.mjs.
 *
 * If a reorder control is ever built, delete this test in the same commit.
 */
import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOTS = ['src/data', 'src/pages', 'src/components', 'src/i18n'];

const BANNED = [
  // Portuguese
  'reordene', 'reordená', 'reordenar os arquivos', 'lista que você pode reordenar',
  'arraste as miniaturas', 'arrastando cada miniatura', 'arraste-os para a ordem',
  'coloque-as na ordem desejada', 'arraste para reordenar',
  'arrastar uma das miniaturas', 'ordene e baixe', 'trocar de posição',
  // English
  'drag to reorder', 'drag the thumbnails', 'drag them into order',
  'reorder the files', 'reorder the pages', 'rearrange the files',
  'arrange them in reading order', 'arrange the photos', 'rename photos numerically',
  // Found 2026-09-29 on /merge-pdf/, /image-to-pdf/ and /merge-images/, which
  // the list above had never covered — the English copy DID make the claim.
  'arrange them in the order', 'arrange them in order', 'drag and drop thumbnails',
  'adjust the layout sequence', 'rearrange the order',
];

/* Lines that use the words while saying the control does NOT exist — or
   describing the ▲/▼ buttons that DO exist. Correction 2026-09-30: Merge
   Excel, Merge Images, Merge PowerPoint, Merge Text and Merge Word have move
   up/down buttons; only Merge PDF and Image to PDF have no reorder control at
   all. No tool has drag-and-drop. The header above overstated it, and copy
   written from it told Merge Word users they could not reorder. */
const ALLOWED = [
  '▲ and ▼', '▲ e ▼',
  'There is no drag-to-reorder',        // en guide, saying the control does not exist
  'Não existe arrastar para reordenar',
  'a lista não é reordenável',
  'A lista não é reordenável',
  'reordenar slides individualmente',   // merge-pptx: that is PowerPoint's job afterwards
  'Reordenar slides individualmente',
];

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|astro)$/.test(e)) out.push(p);
  }
  return out;
}

test('no page promises a reorder control the tools do not have', () => {
  const hits = [];
  for (const root of ROOTS) {
    for (const file of walk(root)) {
      readFileSync(file, 'utf8').split(/\r?\n/).forEach((line, i) => {
        const low = line.toLowerCase();
        if (!BANNED.some(b => low.includes(b.toLowerCase()))) return;
        if (ALLOWED.some(a => line.includes(a))) return;
        hits.push(`${file}:${i + 1}  ${line.trim().slice(0, 130)}`);
      });
    }
  }
  assert.deepStrictEqual(hits, [],
    'The multi-file tools list files in the order chosen and cannot reorder ' +
    'them. Say "adicione na ordem certa" / "add them in order" instead, or ' +
    'build the control and delete this test.\n' + hits.join('\n'));
});
