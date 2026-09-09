/**
 * Shared plumbing for the OOXML fixture builders.
 *
 * The fixtures are hand-written XML, which means a stray tag turns a "the
 * converter dropped our table" failure into "the converter refused a file Word
 * would also refuse" — a wasted afternoon. So every XML part is parsed in
 * strict mode before it is allowed into the package. A fixture that does not
 * validate is a build error, not a test failure.
 */
import sax from 'sax';
import JSZip from 'jszip';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

/**
 * Parse `xml` in sax's strict mode and throw on the first defect. Strict mode
 * enforces well-formedness — matched tags, quoted attributes, legal entities —
 * which is the class of mistake hand-written markup actually makes.
 *
 * @param {string} xml
 * @param {string} label part name, used in the error message
 */
export function assertWellFormed(xml, label) {
  const parser = sax.parser(true, { xmlns: false });
  let failure = null;
  parser.onerror = (e) => {
    if (!failure) failure = e.message.replace(/\n/g, ' ');
    parser.resume();
  };
  parser.write(xml).close();
  if (failure) throw new Error(`${label} is not well-formed XML: ${failure}`);

  // A well-formed document still needs its tags balanced end to end; sax
  // reports that separately from a parse error only when the stream ends
  // mid-element, which the close() above surfaces as an error too. Belt and
  // braces: check the declaration is present so we never ship a part Word
  // silently treats as text.
  if (!/^<\?xml /.test(xml)) throw new Error(`${label} is missing its XML declaration`);
}

/**
 * Build a zip package from a { path: string | Buffer } map, validating every
 * part whose name ends in .xml or .rels.
 *
 * @param {Record<string, string|Buffer>} parts
 * @param {string} outPath
 * @returns {Promise<number>} bytes written
 */
export async function writePackage(parts, outPath) {
  const zip = new JSZip();
  for (const [path, content] of Object.entries(parts)) {
    if (typeof content === 'string' && /\.(xml|rels)$/.test(path)) {
      assertWellFormed(content, path);
    }
    zip.file(path, content);
  }
  const buf = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, buf);
  return buf.length;
}

/** Escape text for inclusion in an XML text node or attribute value. */
export function xmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
