# ConvertOcean — agent instructions

Client-side file-converter site. Astro + Cloudflare Workers, 66 tools, MIT and
public. Identical copies of this file are `AGENTS.md`, `CLAUDE.md` and
`GEMINI.md` — edit all three together.

## Skills

**Always:**

- `astro` — the framework this site is built in. Components, pages, routing,
  config, build.
- `web-design-guidelines` — run against any UI change before shipping it.

**By task:**

- `cloudflare` — deploys, `wrangler.toml`, redirects, caching, 404 handling.
  It fetches real Cloudflare docs rather than recalling them. The empty-404
  bug (a missing `not_found_handling`) was exactly its problem class, and it
  was installed the whole time it went unused.
- `seo-audit` — technical SEO diagnosis. Traffic is the stated #1 goal.
- `aeo` — answer-engine optimization: being cited by ChatGPT, Perplexity and
  Gemini. Every tool page carries a quick-answer block written to be quoted
  verbatim, so their accuracy is a ranking surface, not just copy.
- `frontend-design` — visual direction when building or reshaping UI. The
  standing brief is that it must not read as templated.

**Do not go looking for `tailwind-4-docs`.** It is not installed and this
project has no Tailwind. Earlier versions of this file named it, which sent
every session hunting for a skill that does not exist.

## Styling: hand-written CSS, no framework

Dependencies are `astro` and `@astrojs/sitemap`. That is the whole list.

Styling is a custom-property token system in `src/styles/theme.css`: raw
palette `--p-*` → semantic `--colors-*` → per-band overrides. This already does
what Tailwind's `@theme` would, without the dependency. **Do not add Tailwind**
— resolve colours and spacing through the existing tokens instead.

`DESIGN.md` is the design reference for this project.

### The scoped-CSS trap

Astro's scoped styles silently no-op on `set:html` children, on `<html>`
ancestors, and on **any element built at runtime** — `createElement` plus
`className`, or a chunk of `innerHTML` — because the `data-astro-cid-*`
attribute Astro scopes against only lands on elements written in the template.
Six rounds of live bugs, the sixth being 44 rules across 12 components that had
never applied to anything (`/split-pdf/`'s page thumbnails among them).

Fix it with `:global(...)` around the affected selector, keeping the rest of the
block scoped, or `<style is:global>` with a per-component class prefix when
effectively all the UI is runtime-built. **`scripts/tests/scoped-css.test.mjs`
now fails on any new instance**, so this is enforced rather than remembered.

Read every declaration before reviving a rule that looks dead — it may be dead
on purpose, and it may be hiding a second bug. Those `/split-pdf/` rules also
carried a font dropped in the Satoshi migration.

## Non-negotiables

- **Conversion runs in the browser. Never propose server-side conversion.**
  Privacy plus the open-source repo is the entire USP. The fidelity ceiling
  that choice imposes gets disclosed, not hidden.
- **Never tell users they "upload" anything.** The site's promise is that
  nothing leaves their machine. Describing what competitors do, or our own
  "we never upload" claims, are the exceptions.
- **Run `npm run fidelity` before calling any converter fixed.** It drives the
  real tool pages with torture fixtures. Unit tests live in `scripts/tests/`.
  After a deploy, `node scripts/fidelity/verify-live.mjs` confirms production
  serves what the repo says — and if you changed a tool, add a check for it,
  or a green run is only re-verifying the previous batch.
- **Approval and deployment are separately authorized.** Build on a branch,
  report, wait. A bare "approve" is not permission to deploy; "approve and
  deploy" is the full sequence including live verification and a dated entry
  in `SEO-ROADMAP.md`.

`SEO-ROADMAP.md` is the living plan and the log of every deploy.
