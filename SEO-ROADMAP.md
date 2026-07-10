# ConvertOcean — 30-Day Growth Roadmap

**Goal:** steady, quality-first growth in organic traffic for convertocean.com — a new (June 2026) Astro/Cloudflare Pages site of client-side file converters + business calculators, competing in a brutal niche (Smallpdf/iLovePDF/Adobe).

**Operating rules (read every run):**
1. **Quality gate — never mass-produce.** No thin/near-duplicate pages. Every new page needs unique title/meta/H1, genuinely useful content (300+ words of *unique* prose, not boilerplate), FAQ schema, and 3+ relevant internal links. A rushed page HURTS a new site's trust.
2. **Draft & propose — do NOT deploy live.** Do the work on a branch, open/refresh a PR, build + verify, then report the batch and STOP. The human approves; only then does it merge/deploy (`npm run deploy`).
3. **Verify before proposing:** `npm run build` must pass; spot-check that new/changed pages render and links resolve; confirm no layout shift / accessibility regressions; keep the hero LCP instant.
4. **Respect the design system:** follow `DESIGN.md`, reuse `theme.css` tokens, and the existing motion system (scroll-reveal is JS-gated + reduced-motion aware). Match existing code style.
5. **Small, reviewable batches.** One themed deliverable per session beats ten half-baked ones.
6. **Realistic expectations:** meaningful ranking movement is 1–3 months out. Measure trend, not day-to-day.

**Cadence:** ~12 work-sessions, done 3–4× per week → finishes in **~20–25 days** (or 2×/week → ~30 days). Pick the pace that fits.

**How to run this (works with ANY agent — not tied to a subscription or a cron):**
- Open the project and tell your coding agent: *"Do the next unchecked task in SEO-ROADMAP.md, following the operating rules."*
- Works with Claude Code, a Gemini/Antigravity agent, or manually. The agent reads this file, does one session's task, opens/updates a PR for review, and ticks the box.
- Nothing here depends on a scheduled cloud routine — this document IS the plan.

---

## Standing checklist (every session)
- [ ] Pull latest `main`; create/refresh a working branch.
- [ ] Quick health scan: build passes, no broken internal links, sitemap still clean, no new console errors.
- [ ] Do the session's primary task (below) to the quality gate.
- [ ] Add/verify internal links between new content and related tools (both directions).
- [ ] Confirm title ≤ ~60 chars, meta ~150–160, exactly one H1, FAQ schema present.
- [ ] Build + verify; open/refresh PR; **report batch for approval; do not deploy.**
- [ ] Tick off completed items below and note anything discovered for a future session.

---

## Week 1 — Content foundation + AEO groundwork
- [x] **S1 — E-E-A-T + author/trust signals.** Add an author/"who built this" section to `/about/` and to the calculators (accuracy/method notes). This is the cheapest AEO + trust win. Add `Organization`/`Person` schema where appropriate. *(Done 2026-07-07, branch `seo/s1-eeat-trust`.)*
- [x] **S2 — Guide: "How to calculate profit margin (with formula + examples)."** Targets the calculator already getting organic traffic. 800–1200 words, worked examples, links to `/profit-margin-calculator/`. FAQ schema. *(Done 2026-07-08, branch `seo/s2-profit-margin-guide`.)*
- [x] **S3 — Guide: "CSV to JSON: when and how to convert (developer guide)."** Supports the `/csv-to-json/` "crawled-not-indexed" page. Internal-link both ways. *(Done 2026-07-09, branch `seo/s3-csv-json-guide`.)*

## Week 2 — Content expansion + first new tool
- [x] **S4 — Guide: "Excel to PDF without cutting off columns"** (expand/refresh existing) + "PDF to Word formatting tips." Strengthen the two best-trafficked tool clusters. *(Done 2026-07-10, branch `seo/s4-cluster-guides`.)*
- [ ] **S5 — New tool: a low-competition calculator** (e.g. break-even, markup, or discount calculator). Build it well (matches existing calculator components), unique content + FAQ, link from `/business-tools/` and related calculators.
- [ ] **S6 — Internal linking + AEO pass.** Audit that every tool links to ≥2 relevant guides and vice-versa. Add concise "quick answer" (40–60 word) summaries near the top of tool pages for AI-overview citation.

## Week 3 — AEO deepening + tools + comparisons
- [ ] **S7 — AEO: structured answers + schema audit.** Ensure `HowTo`/`FAQPage` schema on tool + guide pages; add clear H2 questions with direct answers. (Use the `aeo` skill.)
- [ ] **S8 — New tool** targeting a long-tail keyword surfaced by GSC/keyword research (quality-gated).
- [ ] **S9 — Expand `/vs/` comparison pages** (e.g. "ConvertOcean vs X") — these win "alternative" queries. Keep factual + fair.

## Week 4 — Authority, polish, measure
- [ ] **S10 — Guide cluster completion:** fill topical gaps so each tool category has ≥2 supporting guides (pillar → spoke internal linking).
- [ ] **S11 — Technical & CWV pass:** Core Web Vitals check, image/asset optimization, accessibility sweep (web-design-guidelines), fix any bugs found.
- [ ] **S12 — Month review:** check Search Console (indexed count, impressions/clicks trend, remaining errors), summarize what moved, and draft the next 30-day roadmap based on what's actually ranking.

---

## Backlog / discovered ideas
_(routine appends here as it finds opportunities)_
- **AEO vs AI-blocking conflict (review in S7):** Cloudflare's "Managed robots.txt" is injecting a block that Disallows AI crawlers (Amazonbot, Applebot-Extended, Bytespider, likely GPTBot/PerplexityBot/ClaudeBot) plus a `Content-Signal: ai-train=no` line. This blocks the very AI engines we want to cite us. Decide: keep blocking AI scrapers vs. allow AI *search* bots (PerplexityBot, OAI-SearchBot, ChatGPT-User) for AEO. Adjust in Cloudflare (AI Audit / Managed robots.txt settings), not in repo. The GSC "Rule ignored by Googlebot (line 30)" warning itself is harmless — Googlebot just skips the unrecognized Content-Signal line.
- Consider self-hosting Geist font (brand fidelity per DESIGN.md) vs. current Inter — perf tradeoff.
- Reconsider AdSense on thin/low-traffic tool pages (quality signal while building trust).
- Proper 1200×630 OG image (current og:image is a 180×180 icon — looks broken when shared).

## Progress log
_(routine appends a dated one-line entry per session: what shipped, what's pending approval)_
- 2026-07-06 — Roadmap created. Baseline: host canonicalization fixed, GSC Validate Fix submitted, UI polish + mobile-menu fix + word-counter content deployed live.
- 2026-07-07 — S1 shipped on branch `seo/s1-eeat-trust` (pending approval): about-page "who builds this" + verification-methodology sections with AboutPage schema; accuracy/last-reviewed notes on 3 calculators; enriched Organization schema. Note: `gh` CLI not installed — PRs proposed via chat review instead.
- 2026-07-07 — S1 approved, merged to main, deployed, verified live.
- 2026-07-08 — S2 shipped on branch `seo/s2-profit-margin-guide` (pending approval): new guide /guides/how-to-calculate-profit-margin/ (983-word article + 5 FAQs, on-page score 88), bidirectionally linked with 4 business tools, listed on homepage/guides index/HTML+XML sitemaps.
- 2026-07-08 — S2 approved, merged to main, deployed, verified live (200 + FAQ schema + backlinks + in XML sitemap). Next: S3 — CSV-to-JSON developer guide.
- 2026-07-09 — S3 shipped on branch `seo/s3-csv-json-guide` (pending approval): new guide /guides/csv-to-json/ (1,029-word developer article + 5 FAQs, on-page score 90 — site best), bidirectionally linked with csv-to-json / json-to-csv / json-formatter / xml-to-json, listed on homepage/guides index/HTML+XML sitemaps. Week 1 of roadmap complete.
- 2026-07-09 — S3 approved, merged to main, deployed, verified live (200, FAQ schema, backlinks, XML sitemap). WEEK 1 COMPLETE. Next: S4 — strengthen excel-to-pdf + pdf-to-word guide cluster.
- 2026-07-10 — S4 shipped on branch `seo/s4-cluster-guides` (pending approval): expanded excel-to-pdf guide 372→974 words (+scale-to-fit, print titles, CSV case, split/merge workflow, troubleshooting; +3 FAQs) and pdf-to-word guide 538→1,067 words (+scanned-vs-digital, Word cleanup checklist, troubleshooting; +2 FAQs); guides now feed links to unindexed csv-to-pdf/split-excel pages. Fixed sitewide guide-template h1→h3 heading skip (tool-callout h3→p) — all guide scores up: pdf-to-word 100, csv-to-json 92, excel-to-pdf 90, profit-margin 90. Trimmed pdf-to-word title to 60ch.
