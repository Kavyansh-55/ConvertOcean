# Keeping ConvertOcean running

The site is static and every conversion runs in the visitor's browser, so
there is no server to patch and nothing that wears out. This page covers the
few things that can still go wrong, and how to change something safely.

## The weekly check

Every Monday a GitHub Action (`.github/workflows/live-check.yml`) runs about
270 checks against the live site. **If any fail, GitHub emails you.** No email
means the site is serving what this repo says.

- **Run it by hand:** GitHub → Actions → *Live site check* → *Run workflow*.
- **It stops after 60 quiet days.** GitHub disables scheduled jobs in a public
  repo with no activity for 60 days and emails a warning first. Open the
  Actions tab and click *Enable workflow*.
- **If it fails:** open the run, read the `FAIL` lines. Each one names the page
  and what it expected. Usual causes, most likely first:
  1. The domain or the Cloudflare account needs attention (renewal, billing).
  2. A Cloudflare dashboard setting was changed (redirects, bot rules).
  3. A deploy went out without the change a check was written for.

## Scheduled guides (the daily publish)

Guides can be written ahead and published on a date. Each has a `publishOn`
date (`YYYY-MM-DD`); until that day it is not built at all — no page, no
link, no sitemap entry. Every morning at 06:00 IST a second GitHub Action
(`.github/workflows/publish.yml`) rebuilds `main` and deploys it, so the
guides due that day appear without anyone doing anything.

- **One-time setup:** it needs two secrets in GitHub → Settings → Secrets and
  variables → Actions: `CLOUDFLARE_API_TOKEN` (Cloudflare → My Profile → API
  Tokens → Create Token → the *Edit Cloudflare Workers* template) and
  `CLOUDFLARE_ACCOUNT_ID` (on the right of the Cloudflare dashboard home).
- **Check it works:** Actions → *Publish scheduled guides* → *Run workflow*.
  A green run means build, deploy and the live checks all passed.
- **If a run fails, GitHub emails you.** Nothing breaks: the site stays as it
  was, and the guide simply appears the next morning a run succeeds.
- **It also stops after 60 quiet days**, like the weekly check — re-enable it
  the same way.
- **To see what is scheduled:** search the guide files in `src/data/` for
  `publishOn`. To publish one early, change its date to today and deploy.

## Updating the US sales tax rates (every January and July)

The Tax Foundation republishes state rates around February (January 1 data)
and July. One file holds all of it: `src/data/us-sales-tax-rates.ts`. The
comment at its top lists exactly what to replace. The guide's title, figures
and FAQs read from that file, and the build refuses to finish if new rankings
would make a sentence untrue, naming the sentence to fix.

After updating, change the national average asserted in
`scripts/fidelity/verify-live.mjs` (search for `7\.53`).

## Changing anything safely

Whoever makes the change, a person or an AI agent, these commands are the
safety net. Run them before deploying:

```sh
npm run build                       # must finish without errors
node --test scripts/tests/*.test.mjs  # unit tests, all must pass
npm run fidelity                    # only if a converter changed; serve dist on :4321 first
npm run deploy                      # build + publish to Cloudflare
node scripts/fidelity/verify-live.mjs # confirm production afterwards
```

Rules that keep the site what it is:

- Conversion stays in the browser. Never add a server that receives files.
- Never tell users they "upload" anything.
- Styling uses the tokens in `src/styles/theme.css`; see `DESIGN.md`.
- `AGENTS.md` (also `CLAUDE.md`, `GEMINI.md`) gives an AI agent the full rules.
