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
  { slug: 'xls-to-csv', why: 'needs a real legacy BIFF .xls fixture; a renamed .xlsx would fake it' },
  { slug: 'xls-to-json', why: 'needs a real legacy BIFF .xls fixture' },
  { slug: 'xls-to-pdf', why: 'needs a real legacy BIFF .xls fixture' },
  { slug: 'ppt-to-pdf', why: 'the tool rejects legacy .ppt by design; pptx-to-pdf covers the code path' },
  { slug: 'image-to-text', why: 'OCR is slow and non-deterministic; needs its own tolerance-based recipe' },
  { slug: 'invoice-generator', why: 'form-driven generator, not a converter — needs a form-filling recipe' },
  { slug: 'receipt-generator', why: 'form-driven generator, not a converter' },
  { slug: 'percentage-calculator', why: 'calculator: arithmetic correctness, not file fidelity' },
  { slug: 'profit-margin-calculator', why: 'calculator' },
  { slug: 'break-even-calculator', why: 'calculator' },
  { slug: 'sales-tax-calculator', why: 'calculator (already has scratch/test-us-sales-tax.cjs)' },
];

export default recipes;
