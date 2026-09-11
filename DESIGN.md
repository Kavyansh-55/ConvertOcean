# ConvertOcean — Design Reference

The authoritative source is `src/styles/theme.css`. This document explains how
that file is organised and which layer to reach for; when the two disagree,
the stylesheet is right and this file is stale.

> **History.** Until 2026-09-11 this file was a style reference for an
> unrelated product — it described Tailwind v4 and a `Linksans` typeface,
> neither of which this project has ever used, while `CLAUDE.md` pointed at it
> as the design reference. Anything built from it was built from the wrong
> palette. It has been replaced with the system actually in the stylesheet.

## No framework, by decision

Dependencies are `astro` and `@astrojs/sitemap`. That is the whole list.
Styling is hand-written CSS with a custom-property token system, which already
does what Tailwind's `@theme` would without the dependency. **Do not add
Tailwind.** Resolve colours and spacing through the tokens below.

## Three layers, in order

```
--p-*        raw palette      the only place a hex literal belongs
  ↓
--colors-*   semantic roles   what the UI actually references
  ↓
.band--*     per-band override  a section re-points the semantic tokens
```

Components should reference **`--colors-*`**, never `--p-*` and never a hex
literal. The exception is paper: a rendered document page is white in both
themes, so `#ffffff` is correct there and appears deliberately in the PDF
preview and export paths.

### Layer 1 — raw palette

| Token | Value | |
|---|---|---|
| `--p-lime` / `--p-lime-deep` | `#d2e823` / `#b8cc17` | primary action |
| `--p-cobalt` / `--p-cobalt-ink` | `#2665d6` / `#2258c4` | accent, links |
| `--p-maroon` / `-deep` / `-lift` | `#780016` / `#5a0010` / `#8f0f26` | errors, footer band |
| `--p-ink` | `#1e2330` | text, near-black |
| `--p-bone` | `#f3f3f1` | page ground |
| `--p-white` | `#ffffff` | surfaces, paper |
| `--p-slate` / `--p-carbon` / `--p-cement` | `#676b5f` / `#222222` / `#adadad` | secondary text, neutrals |
| `--p-lilac` / `--p-indigo` / `--p-forest` / `--p-saffron` | `#e9c0e9` / `#061492` / `#254f1a` / `#d6a337` | accents, success |

### Layer 2 — semantic roles

Grounds and surfaces: `--colors-canvas` (page), `--colors-canvas-soft`,
`--colors-canvas-soft-2` (raised panels), `--colors-surface` (white cards).

Text: `--colors-ink` (primary), `--colors-display` (headings),
`--colors-body`, `--colors-mute` (secondary and captions).

Lines: `--colors-hairline` (`#dcd9d0`, the default border everywhere),
`--colors-hairline-strong`.

Action and accent: `--colors-action` / `-hover` / `-ink` (the lime button),
`--colors-accent` / `-deep` / `-wash`, `--colors-link` / `-deep` /
`-bg-soft`.

State: `--colors-error` / `-deep` / `-wash` / `-wash-strong` / `-soft`,
`--colors-success`.

`--colors-ink-static` exists for the cases that must not flip with the theme.

### Layer 3 — bands

A page is a vertical stack of `.band` sections. Each band variant re-points the
semantic tokens for everything inside it, so the same component reads correctly
on any ground: `.band--lime`, `.band--cobalt`, `.band--maroon`,
`.band--paper`, `.band--bone`, plus `.band--tight` and `.band--flush-top` for
rhythm. Vertical rhythm is `--band-pad`.

`Layout.astro` takes a `band` prop naming the colour of the band the floating
nav pill sits on, because the pill must never sit on a flat white page edge.
Pages set it to whatever their first band is.

## Type

`--font-sans` is **Satoshi**, with `ui-sans-serif, system-ui, -apple-system,
'Segoe UI', Roboto, sans-serif` behind it. `--font-mono` is the system mono
stack. There is no `Geist` and no `Inter`: both were dropped in the Satoshi
migration, and eleven stale `Geist, Inter` declarations were found still
rendering as Segoe UI beside a Satoshi wordmark. **Never name a font
directly — always `var(--font-sans)`.**

Sizes are fluid `clamp()` and paired with their own letter-spacing. Use the
pair, never a size with a mismatched tracking.

| Size | Tracking | Use |
|---|---|---|
| `--fs-display` | `--ls-display` (`-0.043em`) | homepage hero only |
| `--fs-title` | `--ls-title` | page `h1` |
| `--fs-heading` | `--ls-heading` | section `h2` |
| `--fs-subhead` | `--ls-subhead` | `h3` |
| `--fs-lead` | `--ls-lead` | intro paragraph |
| `--fs-body` / `--fs-small` / `--fs-micro` | `--ls-body` / `--ls-micro` | body, captions, eyebrow labels |

Weights: `--fw-regular` 400, `--fw-medium` 500, `--fw-bold` 700,
`--fw-extrabold` 900.

## Spacing

`--spacing-xxs` 4 · `xs` 8 · `sm` 12 · `md` 16 · `lg` 24 · `xl` 32 · `2xl` 40 ·
`3xl` 48 · `4xl` 64 · `5xl` 96. Use the scale; do not invent intermediate
pixel values.

## Elevation

**Separation comes from colour and hairlines, not shadow.** Several components
carry an explicit `/* elevation removed */` note where a shadow used to be.
Do not reintroduce `box-shadow` for depth.

## Dark mode

`[data-theme="dark"]` on `<html>`, set by an inline script in `Layout.astro`
from `localStorage.getItem('theme')`, defaulting to **light**. `prefers-color-scheme`
alone does not switch this site — a screenshot or test must set the stored
value.

Every band variant has a dark counterpart. Two traps have cost live bugs:

- **A themed colour behind rendered paper tints the paper.** `--colors-ink` is
  `#f5f5f5` in dark mode, and html2canvas paints a transparent background
  white, which produced near-white text on white paper in exported PDFs. The
  shared `exportElementToPdf` helper renders an off-screen clone with paper
  colours forced literally.
- **Contrast must be checked in both themes, not inferred.** `npm run themes`
  measures it.

## Reduced motion

`theme.css` disables animation site-wide under
`@media (prefers-reduced-motion: reduce)` with
`transition-duration: 0.001ms !important`. That `!important` beats a
component's own `transition: none`, so per-component reduced-motion rules are
usually redundant. Motion started from **JavaScript** is outside CSS's reach
and must check `matchMedia('(prefers-reduced-motion: reduce)')` itself — a
smooth `scrollTo` is the common case.

## The scoped-CSS trap

Astro rewrites a scoped selector `.thing` to `.thing[data-astro-cid-xxxx]` and
stamps that attribute onto elements **written in the template**. Elements built
at runtime — `document.createElement` plus `className`, or a chunk of
`innerHTML` — carry no such attribute, so every rule written for them is dead.
The page still renders; it renders unstyled, which is why this shipped six
times before being caught, most recently as 40 lines of page-thumbnail styling
on `/split-pdf/` that had never applied to anything.

**The fix is `:global(...)` around the affected selector**, keeping the rest of
the block scoped:

```css
/* dead — the runtime element has no scope attribute */
.page-thumb-card { border: 1px solid var(--colors-hairline); }

/* works */
:global(.page-thumb-card) { border: 1px solid var(--colors-hairline); }
```

`<style is:global>` for a whole block is also valid, and is what
`CompressPdf.astro` uses because effectively all of its UI is runtime-built; in
that case prefix every class (`cmp-`) so the global surface cannot collide.

`scripts/tests/scoped-css.test.mjs` now fails the build for any new instance,
so this is enforced rather than remembered. It also means **reading a rule that
looks dead is not enough — check whether it is dead on purpose** before
reviving it. Those dead `.page-thumb-card` rules also carried `font-family:
Geist, Inter, system-ui`; the broken selector was the only thing preventing a
dropped font from rendering, so fixing the scoping alone would have traded a
spacing bug for a wrong-typeface bug across ~90 pages.

## Responsive

Test the **band**, not the extremes: 320 (smallest real phone), 360 (most
common Android), 390, 768, 1024. 1440-plus-390 alone hides everything that
lives between. `npm run mobile` sweeps the tool pages' landing states;
workspace UI that only exists after a file is processed needs its own check
(see `npm run compress`).

`body` is a column flex container, so every `<main>` is a flex item carrying an
automatic `min-width: auto` equal to its min-content width — content pushes it
past the viewport. `min-width: 0` on the inner containers is the fix; this has
caused a 329px-wide page in a 320px window. Tables, diagrams and code may
exceed the viewport, each inside its own `overflow-x: auto` container; the page
body must never scroll horizontally.

## Copy rules that are also design rules

- **Never tell users they "upload" anything.** Conversion runs in the browser;
  that is the entire product promise. Describing what competitors do, or our
  own "we never upload" claims, are the exceptions.
- Ellipsis `…`, not `...`. Curly quotes. Loading states end with `…`.
- `font-variant-numeric: tabular-nums` wherever numbers are compared.
- Error messages name the fix, not just the problem, and never blame the
  user's file for our own missing library.
