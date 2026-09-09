/**
 * Shared vocabulary for every recipe family.
 *
 * `weight` marks how much a failure matters to a real user:
 *   'blocker'  — the output is unusable or wrong
 *   'major'    — the document visibly stopped looking like itself
 *   'minor'    — a detail a careful user would still notice
 */

export const ok = (id, label, pass, detail = '', weight = 'major') =>
  ({ id, label, pass: !!pass, detail, weight });

/** Marker tokens each fixture plants. docx 01-20, pdf 01-13. */
export const DOCX_MARKERS = Array.from({ length: 20 }, (_, i) => 'M' + String(i + 1).padStart(2, '0'));
export const PDF_MARKERS = Array.from({ length: 13 }, (_, i) => 'M' + String(i + 1).padStart(2, '0'));

/** Which of `markers` are absent from `text`. */
export function missing(text, markers) {
  const t = String(text).replace(/\s+/g, ' ');
  return markers.filter((m) => !t.includes(m));
}

/** Standard drop-file-then-download shape, which most tools share. */
export const STANDARD = { ready: '#actionControls', download: '#btnDownload' };

/**
 * The image fixtures are all 240×160. A conversion that changes the pixel
 * dimensions has resampled without being asked to.
 */
export const IMG_W = 240;
export const IMG_H = 160;
