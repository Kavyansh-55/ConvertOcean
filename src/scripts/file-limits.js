/**
 * The file-size ceiling each tool promises, and the check that keeps it.
 *
 * Twenty-six tools told the reader "Max 25MB" (or 15, or 20, or 5) in their
 * drop zone. **Six actually checked.** On the other twenty the number was
 * decoration: hand one of them a 300MB PDF and it did not refuse, it tried —
 * and since every conversion here runs in the browser tab, trying means
 * allocating the whole file plus its decoded form in tab memory. The tab
 * slows, then freezes, then the browser kills it. No message, no explanation,
 * and on a phone it happens sooner and harder.
 *
 * A refusal is not a worse outcome than a crash. It is a much better one: it
 * takes a second, it says why, and it leaves the reader able to act.
 *
 * The limits differ per tool on purpose — a 25MB PDF costs far less memory to
 * hold than a 15MB image that decodes to a 200-megapixel bitmap — so the
 * number lives with the tool rather than here. What lives here is the check
 * and the wording, so twenty tools cannot drift into twenty phrasings.
 */

export const MB = 1024 * 1024;

/** "4.2 MB", "812 KB" — the size as a reader would describe it. */
export function formatSize(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return 'unknown size';
  if (bytes < 1024) return bytes + ' bytes';
  if (bytes < MB) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / MB).toFixed(bytes < 10 * MB ? 1 : 0) + ' MB';
}

/**
 * Is this file too big for the tool to hold in a browser tab?
 *
 * @param {File|{name?:string,size:number}} file
 * @param {number} limitMb the tool's own ceiling, matching what its drop zone says
 * @returns {string|null} the message to show, or null when the file is fine
 */
export function fileTooLarge(file, limitMb) {
  if (!file || typeof file.size !== 'number' || !Number.isFinite(limitMb)) return null;
  if (file.size <= limitMb * MB) return null;

  const name = file.name ? '"' + file.name + '"' : 'That file';
  return name + ' is ' + formatSize(file.size) + ', over this tool’s '
       + limitMb + 'MB limit. Everything here runs inside your browser tab, so a '
       + 'file larger than that would use more memory than the tab can hold and '
       + 'would freeze rather than convert. Nothing was sent anywhere — try a '
       + 'smaller file, or split it first.';
}

/**
 * The same question for a set of files, as the merge tools need.
 *
 * Reports the first offender by name rather than a count: "one of your files
 * is too large" leaves the reader to work out which of nine it was.
 *
 * @param {Array<File|{name?:string,size:number}>} files
 * @param {number} limitMb applies to each file individually
 * @returns {string|null}
 */
export function anyFileTooLarge(files, limitMb) {
  if (!files || !files.length) return null;
  for (const file of files) {
    const problem = fileTooLarge(file, limitMb);
    if (problem) return problem;
  }
  return null;
}

/* ------------------------------------------------- input with nothing in it */

/**
 * What to say when a file opens fine but holds nothing to convert.
 *
 * Thirteen tool paths accepted an empty file and cheerfully offered to convert
 * it. `word-to-pdf` handed back a 1,088-byte PDF containing a blank page;
 * `csv-to-json` produced two bytes, `[]`; `split-excel` and `split-txt` did
 * nothing at all and said nothing about it — the reader pressed the button and
 * the page simply sat there.
 *
 * None of those is a crash, which is why none of them ever showed up as one.
 * They are worse than a crash in one respect: the reader does not find out
 * until they open the file, and a blank page looks like the tool's opinion of
 * their document rather than a bug.
 *
 * The file is not broken and should not be called broken — it is empty, which
 * is usually a surprise to its owner, so the message says which and suggests
 * the likely cause.
 *
 * @param {string} what the thing that turned out to be empty, e.g. "spreadsheet"
 * @returns {string}
 */
export function nothingToConvert(what = 'file') {
  return 'This ' + what + ' opened correctly but has nothing in it to convert. '
       + 'If you expected content, check you picked the right file — an empty '
       + 'one is often a partly-finished download or a template saved before '
       + 'anything was added.';
}
