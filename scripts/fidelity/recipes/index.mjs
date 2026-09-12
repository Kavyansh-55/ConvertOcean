/**
 * Every recipe the harness knows about, and the record of what it does not.
 *
 * The uncovered list matters as much as the recipes. A sweep that reports
 * "36 passed" without saying what it never looked at reads as a clean bill of
 * health it has not earned.
 */
import documentRecipes from './documents.mjs';
import dataRecipes from './data.mjs';
import imageRecipes from './images.mjs';
import mergeSplitRecipes from './mergesplit.mjs';
import compressionRecipes from './compression.mjs';

export const recipes = [
  ...documentRecipes,
  ...dataRecipes,
  ...imageRecipes,
  ...mergeSplitRecipes,
  ...compressionRecipes,
];

/**
 * Tools with no recipe, and why. Printed by the runner so the scorecard is
 * honest about its own reach.
 */
export const uncovered = [
  { slug: 'ppt-to-pdf', why: 'rejects legacy .ppt by design; that refusal is asserted by npm run generators' },
  { slug: 'image-to-text', why: 'OCR is non-deterministic — covered with a word-recall tolerance by npm run generators' },
  { slug: 'invoice-generator', why: 'form-driven, no input file — covered by npm run generators (totals and names)' },
  { slug: 'receipt-generator', why: 'form-driven — covered by npm run generators' },
  { slug: 'percentage-calculator', why: 'arithmetic, not file fidelity — covered by npm run calculators' },
  { slug: 'profit-margin-calculator', why: 'arithmetic — covered by npm run calculators (margin vs markup asserted separately)' },
  { slug: 'break-even-calculator', why: 'arithmetic — covered by npm run calculators' },
  { slug: 'sales-tax-calculator', why: 'arithmetic — covered by npm run calculators (forward and reverse tax)' },
  { slug: 'compress-powerpoint', why: 'compression is not a conversion — covered end to end by npm run compress:office, which unzips the result and checks each part' },
  { slug: 'compress-word', why: 'shares the engine and the suite above; npm run compress:office asserts the page loads and accepts .docx' },
];

/**
 * Tools whose recipe covers only part of the job, and what covers the rest.
 *
 * Distinct from `uncovered` on purpose. Listing a tool that *has* a recipe
 * under a heading reading "not covered by any recipe" trades one inaccuracy
 * for another, and the point of these lists is that the scorecard does not
 * overstate its own reach. A partial recipe is a third state and gets said as
 * one.
 */
export const partiallyCovered = [
  {
    slug: 'compress-pdf',
    covers: 'document survival and total size, from the real downloaded file',
    missing: 'per-image decisions, byte-identity of untouched streams, soft-mask transparency, preset ordering and target-size honesty',
    where: 'npm run compress',
  },
];

export default recipes;
