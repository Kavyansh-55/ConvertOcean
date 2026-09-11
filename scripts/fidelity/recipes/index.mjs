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

export const recipes = [
  ...documentRecipes,
  ...dataRecipes,
  ...imageRecipes,
  ...mergeSplitRecipes,
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
];

export default recipes;
