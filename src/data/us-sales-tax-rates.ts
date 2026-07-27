/**
 * US state + local sales tax rates.
 *
 * Source: Tax Foundation, "State and Local Sales Tax Rates, Midyear 2026"
 *   https://taxfoundation.org/data/all/state/2026-sales-tax-rates-midyear/
 * Data as of July 1, 2026 (report published July 6, 2026).
 *
 * `avgLocal` is Tax Foundation's POPULATION-WEIGHTED average of local rates —
 * it is a statewide average, not the rate at any specific address. `combined`
 * is their published figure, so for a couple of states it differs from
 * state + avgLocal by 0.01pp because the components are rounded for display
 * (Missouri and New Jersey). Always publish `combined` as given rather than
 * recomputing it.
 *
 * New Jersey's avgLocal is NEGATIVE: sellers in its Urban Enterprise Zones
 * collect half the statewide rate (3.3125%), which the population weighting
 * expresses as a small negative adjustment.
 *
 * UPDATING (roughly every January + July, when Tax Foundation republishes):
 * replace the rows and bump AS_OF / SOURCE_URL together. The consistency check
 * at the bottom of this file runs at build time and will fail the build on a
 * transposed digit.
 */

export interface StateSalesTax {
  state: string;
  abbr: string;
  /** Statewide rate, percent. */
  stateRate: number;
  /** Population-weighted average local rate, percent. Can be negative (NJ). */
  avgLocal: number;
  /** Highest local rate levied anywhere in the state, percent. */
  maxLocal: number;
  /** Tax Foundation's published combined rate, percent. */
  combined: number;
  /** Rank by combined rate, 1 = highest. null for D.C., which they leave unranked. */
  combinedRank: number | null;
}

export const AS_OF = 'July 1, 2026';
export const SOURCE_NAME = 'Tax Foundation';
export const SOURCE_TITLE = 'State and Local Sales Tax Rates, Midyear 2026';
export const SOURCE_URL = 'https://taxfoundation.org/data/all/state/2026-sales-tax-rates-midyear/';

/** Population-weighted national average combined rate, percent. */
export const US_AVERAGE_COMBINED = 7.53;

export const stateSalesTaxRates: StateSalesTax[] = [
  { state: 'Alabama',        abbr: 'AL', stateRate: 4.00, avgLocal: 5.46, maxLocal: 8.00, combined: 9.46,  combinedRank: 5 },
  { state: 'Alaska',         abbr: 'AK', stateRate: 0.00, avgLocal: 1.82, maxLocal: 7.85, combined: 1.82,  combinedRank: 46 },
  { state: 'Arizona',        abbr: 'AZ', stateRate: 5.60, avgLocal: 2.94, maxLocal: 5.30, combined: 8.54,  combinedRank: 11 },
  { state: 'Arkansas',       abbr: 'AR', stateRate: 6.50, avgLocal: 2.98, maxLocal: 6.13, combined: 9.48,  combinedRank: 4 },
  { state: 'California',     abbr: 'CA', stateRate: 7.25, avgLocal: 1.78, maxLocal: 5.25, combined: 9.03,  combinedRank: 7 },
  { state: 'Colorado',       abbr: 'CO', stateRate: 2.90, avgLocal: 4.99, maxLocal: 9.10, combined: 7.89,  combinedRank: 16 },
  { state: 'Connecticut',    abbr: 'CT', stateRate: 6.35, avgLocal: 0.00, maxLocal: 0.00, combined: 6.35,  combinedRank: 33 },
  { state: 'Delaware',       abbr: 'DE', stateRate: 0.00, avgLocal: 0.00, maxLocal: 0.00, combined: 0.00,  combinedRank: 47 },
  { state: 'District of Columbia', abbr: 'DC', stateRate: 6.00, avgLocal: 0.00, maxLocal: 0.00, combined: 6.00, combinedRank: null },
  { state: 'Florida',        abbr: 'FL', stateRate: 6.00, avgLocal: 0.98, maxLocal: 2.00, combined: 6.98,  combinedRank: 28 },
  { state: 'Georgia',        abbr: 'GA', stateRate: 4.00, avgLocal: 3.56, maxLocal: 5.00, combined: 7.56,  combinedRank: 18 },
  { state: 'Hawaii',         abbr: 'HI', stateRate: 4.00, avgLocal: 0.50, maxLocal: 0.50, combined: 4.50,  combinedRank: 45 },
  { state: 'Idaho',          abbr: 'ID', stateRate: 6.00, avgLocal: 0.03, maxLocal: 3.00, combined: 6.03,  combinedRank: 37 },
  { state: 'Illinois',       abbr: 'IL', stateRate: 6.25, avgLocal: 2.73, maxLocal: 4.75, combined: 8.98,  combinedRank: 8 },
  { state: 'Indiana',        abbr: 'IN', stateRate: 7.00, avgLocal: 0.00, maxLocal: 0.00, combined: 7.00,  combinedRank: 25 },
  { state: 'Iowa',           abbr: 'IA', stateRate: 6.00, avgLocal: 0.94, maxLocal: 2.00, combined: 6.94,  combinedRank: 29 },
  { state: 'Kansas',         abbr: 'KS', stateRate: 6.50, avgLocal: 2.21, maxLocal: 4.25, combined: 8.71,  combinedRank: 9 },
  { state: 'Kentucky',       abbr: 'KY', stateRate: 6.00, avgLocal: 0.00, maxLocal: 0.00, combined: 6.00,  combinedRank: 38 },
  { state: 'Louisiana',      abbr: 'LA', stateRate: 5.00, avgLocal: 5.13, maxLocal: 7.00, combined: 10.13, combinedRank: 1 },
  { state: 'Maine',          abbr: 'ME', stateRate: 5.50, avgLocal: 0.00, maxLocal: 0.00, combined: 5.50,  combinedRank: 43 },
  { state: 'Maryland',       abbr: 'MD', stateRate: 6.00, avgLocal: 0.00, maxLocal: 0.00, combined: 6.00,  combinedRank: 38 },
  { state: 'Massachusetts',  abbr: 'MA', stateRate: 6.25, avgLocal: 0.00, maxLocal: 0.00, combined: 6.25,  combinedRank: 35 },
  { state: 'Michigan',       abbr: 'MI', stateRate: 6.00, avgLocal: 0.00, maxLocal: 0.00, combined: 6.00,  combinedRank: 38 },
  { state: 'Minnesota',      abbr: 'MN', stateRate: 6.88, avgLocal: 1.26, maxLocal: 3.00, combined: 8.14,  combinedRank: 15 },
  { state: 'Mississippi',    abbr: 'MS', stateRate: 7.00, avgLocal: 0.06, maxLocal: 1.00, combined: 7.06,  combinedRank: 24 },
  { state: 'Missouri',       abbr: 'MO', stateRate: 4.23, avgLocal: 4.22, maxLocal: 6.25, combined: 8.44,  combinedRank: 12 },
  { state: 'Montana',        abbr: 'MT', stateRate: 0.00, avgLocal: 0.00, maxLocal: 0.00, combined: 0.00,  combinedRank: 47 },
  { state: 'Nebraska',       abbr: 'NE', stateRate: 5.50, avgLocal: 1.48, maxLocal: 2.00, combined: 6.98,  combinedRank: 27 },
  { state: 'Nevada',         abbr: 'NV', stateRate: 6.85, avgLocal: 1.39, maxLocal: 1.53, combined: 8.24,  combinedRank: 13 },
  { state: 'New Hampshire',  abbr: 'NH', stateRate: 0.00, avgLocal: 0.00, maxLocal: 0.00, combined: 0.00,  combinedRank: 47 },
  { state: 'New Jersey',     abbr: 'NJ', stateRate: 6.63, avgLocal: -0.02, maxLocal: 3.31, combined: 6.60, combinedRank: 30 },
  { state: 'New Mexico',     abbr: 'NM', stateRate: 4.88, avgLocal: 2.80, maxLocal: 4.56, combined: 7.68,  combinedRank: 17 },
  { state: 'New York',       abbr: 'NY', stateRate: 4.00, avgLocal: 4.54, maxLocal: 4.88, combined: 8.54,  combinedRank: 10 },
  { state: 'North Carolina', abbr: 'NC', stateRate: 4.75, avgLocal: 2.35, maxLocal: 3.50, combined: 7.10,  combinedRank: 22 },
  { state: 'North Dakota',   abbr: 'ND', stateRate: 5.00, avgLocal: 2.09, maxLocal: 3.75, combined: 7.09,  combinedRank: 23 },
  { state: 'Ohio',           abbr: 'OH', stateRate: 5.75, avgLocal: 1.54, maxLocal: 2.25, combined: 7.29,  combinedRank: 21 },
  { state: 'Oklahoma',       abbr: 'OK', stateRate: 4.50, avgLocal: 4.56, maxLocal: 7.00, combined: 9.06,  combinedRank: 6 },
  { state: 'Oregon',         abbr: 'OR', stateRate: 0.00, avgLocal: 0.00, maxLocal: 0.00, combined: 0.00,  combinedRank: 47 },
  { state: 'Pennsylvania',   abbr: 'PA', stateRate: 6.00, avgLocal: 0.34, maxLocal: 2.00, combined: 6.34,  combinedRank: 34 },
  { state: 'Rhode Island',   abbr: 'RI', stateRate: 7.00, avgLocal: 0.00, maxLocal: 0.00, combined: 7.00,  combinedRank: 25 },
  { state: 'South Carolina', abbr: 'SC', stateRate: 6.00, avgLocal: 1.49, maxLocal: 3.00, combined: 7.49,  combinedRank: 19 },
  { state: 'South Dakota',   abbr: 'SD', stateRate: 4.20, avgLocal: 1.91, maxLocal: 4.50, combined: 6.11,  combinedRank: 36 },
  { state: 'Tennessee',      abbr: 'TN', stateRate: 7.00, avgLocal: 2.61, maxLocal: 2.75, combined: 9.61,  combinedRank: 2 },
  { state: 'Texas',          abbr: 'TX', stateRate: 6.25, avgLocal: 1.95, maxLocal: 2.00, combined: 8.20,  combinedRank: 14 },
  { state: 'Utah',           abbr: 'UT', stateRate: 6.10, avgLocal: 1.32, maxLocal: 4.70, combined: 7.42,  combinedRank: 20 },
  { state: 'Vermont',        abbr: 'VT', stateRate: 6.00, avgLocal: 0.43, maxLocal: 1.00, combined: 6.43,  combinedRank: 32 },
  { state: 'Virginia',       abbr: 'VA', stateRate: 5.30, avgLocal: 0.47, maxLocal: 2.70, combined: 5.77,  combinedRank: 41 },
  { state: 'Washington',     abbr: 'WA', stateRate: 6.50, avgLocal: 3.07, maxLocal: 4.20, combined: 9.57,  combinedRank: 3 },
  { state: 'West Virginia',  abbr: 'WV', stateRate: 6.00, avgLocal: 0.60, maxLocal: 1.40, combined: 6.60,  combinedRank: 31 },
  { state: 'Wisconsin',      abbr: 'WI', stateRate: 5.00, avgLocal: 0.72, maxLocal: 2.90, combined: 5.72,  combinedRank: 42 },
  { state: 'Wyoming',        abbr: 'WY', stateRate: 4.00, avgLocal: 1.39, maxLocal: 3.00, combined: 5.39,  combinedRank: 44 }
];

/** The five states with no statewide sales tax. Alaska is the one that still allows local rates. */
export const NO_STATEWIDE_TAX = ['Alaska', 'Delaware', 'Montana', 'New Hampshire', 'Oregon'];

const pct = (n: number) => `${n.toFixed(2)}%`;

/**
 * Renders the full rate table as HTML for the guide body.
 *
 * Inline styles are deliberate: guide content is injected with `set:html`, and
 * Astro's scoped styles in guides/[slug].astro never match injected children
 * (the scope attribute lands on the wrapper, not on the parsed HTML). The one
 * pre-existing guide table styles itself the same way.
 */
export function renderRateTableHtml(): string {
  const cell = 'padding: 9px 12px; border-bottom: 1px solid var(--colors-hairline);';
  const num = `${cell} text-align: right; font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; white-space: nowrap;`;
  const head = 'padding: 10px 12px; border-bottom: 1px solid var(--colors-hairline-strong); text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.4px; color: var(--colors-mute); font-weight: 600;';
  const headNum = `${head} text-align: right;`;

  const rows = stateSalesTaxRates.map(r => `
            <tr>
              <th scope="row" style="${cell} font-weight: 500; color: var(--colors-ink); text-align: left; white-space: nowrap;">${r.state}</th>
              <td style="${num}">${pct(r.stateRate)}</td>
              <td style="${num}">${pct(r.avgLocal)}</td>
              <td style="${num} font-weight: 600; color: var(--colors-ink);">${pct(r.combined)}</td>
              <td style="${num}">${r.combinedRank ?? '&mdash;'}</td>
            </tr>`).join('');

  return `
      <div style="overflow-x: auto; -webkit-overflow-scrolling: touch; border: 1px solid var(--colors-hairline); border-radius: var(--rounded-md); margin: var(--spacing-lg) 0;">
        <table style="width: 100%; min-width: 520px; border-collapse: collapse; font-size: 14px;">
          <caption style="caption-side: top; padding: 12px; text-align: left; font-size: 13px; color: var(--colors-mute); border-bottom: 1px solid var(--colors-hairline);">State and average local sales tax rates as of ${AS_OF}. Source: ${SOURCE_NAME}.</caption>
          <thead>
            <tr style="background-color: var(--colors-canvas-soft-2);">
              <th scope="col" style="${head}">State</th>
              <th scope="col" style="${headNum}">State rate</th>
              <th scope="col" style="${headNum}">Avg. local</th>
              <th scope="col" style="${headNum}">Combined</th>
              <th scope="col" style="${headNum}">Rank</th>
            </tr>
          </thead>
          <tbody>${rows}
          </tbody>
        </table>
      </div>`;
}

// Build-time guard: catches a transposed digit when these rows are refreshed.
// Tolerance covers Tax Foundation's display rounding (MO and NJ are off by 0.01).
for (const r of stateSalesTaxRates) {
  if (Math.abs(r.stateRate + r.avgLocal - r.combined) > 0.05) {
    throw new Error(
      `us-sales-tax-rates: ${r.state} is inconsistent — ${r.stateRate} + ${r.avgLocal} != ${r.combined}`
    );
  }
  if (r.maxLocal < 0 || r.maxLocal > 12 || r.stateRate < 0 || r.stateRate > 12) {
    throw new Error(`us-sales-tax-rates: ${r.state} has an out-of-range rate`);
  }
}
