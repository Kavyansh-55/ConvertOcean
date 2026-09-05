# ConvertOcean — Design System

Read this before writing or changing any UI. It describes the visual system this
project uses. Extend it; do not invent a parallel system.

## What this product is

A browser-based file converter. 60+ tools. Files never leave the user's device.

The visitor is a stranger with one task. They arrive — usually on a tool page from
search — convert a file, and leave. They will not read marketing copy, will not
scroll to learn about us, and will not return often enough to learn an interface.

Design for that person. Every element must earn its place by helping them finish
the task faster.

---

## Page types

Three page types, three different jobs. Do not blur them.

### Homepage — a directory
Its job is to help someone find the right tool. It is not a workspace.

- Headline, one line of subtext, category filter row, tool grid.
- **No drop zone on the homepage.** Dropping a PDF here is ambiguous — merge,
  split, compress, convert? Disambiguation costs more than it saves.
- Search lives in the nav, not as a hero element.
- One primary action maximum above the fold.

### Tool page — a single action
This is the real product and where most traffic lands. Its job is to accept a
file and return a converted one.

- Above the fold: tool name, one line of subtext, the drop zone. Nothing else.
- The drop zone is the largest element on the page.
- Everything else — format notes, related tools, FAQ, SEO copy — goes below the
  fold. Empty space above the fold is correct, not a gap to fill.

### Category page — a filtered directory
Same as the homepage, scoped to one category. Useful for search traffic.

---

## Color

The canvas is a pale sea-stone: not white, not cream. It reads as considered
rather than defaulted, and it lets white surfaces lift without shadow.

```
--colors-canvas          #F3F5F4   page background
--colors-canvas-soft     #E9EDEB   recessed areas, inactive tabs
--colors-surface         #FFFFFF   cards, inputs, drop zone — lifts off canvas
--colors-ink             #16211F   headings, primary text
--colors-body            #4A5654   body copy
--colors-mute            #7C8886   captions, placeholder, metadata
--colors-hairline        #DCE2E0   borders, dividers
--colors-hairline-strong #B4BEBB   input borders, drop zone dash
--colors-accent          #0E7490   the single accent
--colors-accent-deep     #0A5A70   accent hover/active
--colors-accent-wash     #E3F0F2   accent-tinted backgrounds
--colors-error           #B4322C   errors only
--colors-error-wash      #F7E7E6
```

### Rules

- **One accent.** `#0E7490`. Delete every instance of `#0070f3` and `#00dfd8`.
  Those are Vercel's and Next.js's colors, not ours.
- The accent may appear in **at most three places per viewport**. It marks the
  primary action and the active state. It is not decoration.
- **No gradients.** No linear, no radial, no mesh, no glow. If depth is needed,
  use a hairline or a shadow.
- Success states use the accent, not a separate green.
- Dark mode: invert the ramp, keep the same accent. No neon, no bloom.

---

## Type

**Switzer** (Fontshare, free commercial use, no attribution) for everything.
Self-host the offline kit; do not use a CDN for a privacy-focused product.

```
--font-sans   'Switzer', system-ui, -apple-system, sans-serif
--font-mono   'JetBrains Mono', ui-monospace, Menlo, monospace
```

Monospace is for **machine data only** — file names, file sizes, dimensions,
format codes. It is not a styling device. Do not set taglines, captions, status
text, or marketing copy in mono. The current site does this in several places
and it reads as costume.

### Scale

Keep the existing fluid tokens. They are well-judged; do not replace them.

```
--fs-display   clamp(2rem, 1.30rem + 3.1vw, 3.5rem)
--fs-title     clamp(1.5rem, 1.28rem + 0.98vw, 2rem)
--fs-heading   clamp(1.25rem, 1.14rem + 0.49vw, 1.5rem)
--fs-subhead   1.125rem
--fs-lead      clamp(1rem, 0.95rem + 0.22vw, 1.125rem)
--fs-body      0.9375rem
--fs-small     0.8125rem
--fs-micro     0.6875rem
```

Tracking and line-height tokens (`--ls-*`, `--lh-*`) stay exactly as they are.

**Every font-size must reference a token.** `theme.css` currently contains 19
hardcoded sizes including `11.5px`, `12.5px`, `13.5px` and `14.5px`. Half-pixel
values are the signature of per-component guesswork. Purge them.

Body line length: 65–75 characters. Never full-width paragraphs.

### Typographic rules

- **Do not color one word or phrase in a headline.** The current hero sets
  "leave your device." in teal against black. This is the single most common
  tell of a generated page. Headlines are one color.
- **No all-caps eyebrow labels.** Delete "MOST USED" and anything like it. If a
  section needs a label, the heading is the label.
- No `→` appended to link or button text.
- No meta strings joined with middle dots (`A · B · C`).
- Sentence case for buttons and headings. Not Title Case.

---

## Space

Keep the existing scale. It is clean and on a 4px grid.

```
--spacing-xxs  4px     --spacing-xl   32px
--spacing-xs   8px     --spacing-2xl  40px
--spacing-sm   12px    --spacing-3xl  48px
--spacing-md   16px    --spacing-4xl  64px
--spacing-lg   24px    --spacing-5xl  96px
```

Section rhythm: `--spacing-5xl` between major sections on desktop,
`--spacing-3xl` on mobile. Consistent rhythm matters more than any single value.

---

## Radius

Radius encodes hierarchy. Larger containers get larger radius. Do not apply one
value to everything.

```
--rounded-sm    6px     badges, tags, format chips
--rounded-md    8px     buttons, inputs, small controls
--rounded-lg    12px    cards, drop zone, panels
--rounded-pill  100px   filter pills, status pills
```

Remove the stray `border-radius: 5px` on `.format-badge` — use `--rounded-sm`.
`--rounded-full: 9999px` is redundant with `--rounded-pill`; drop it.

---

## Elevation

`theme.css` currently contains **28 distinct box-shadow values**, none tokenized.
That is the loudest signal that the UI was assembled component by component
rather than designed. Collapse to three.

```
--shadow-sm   0 1px 2px rgba(22, 33, 31, 0.04)
--shadow-md   0 2px 8px rgba(22, 33, 31, 0.06)
--shadow-lg   0 8px 24px rgba(22, 33, 31, 0.08)
```

- `--shadow-sm` — resting cards, inputs
- `--shadow-md` — hover on interactive cards
- `--shadow-lg` — modals, dropdowns, drag-active drop zone

Because surfaces are white on a sea-stone canvas, most separation comes from
value contrast and hairlines. Shadows are a last resort. **No inset highlights,
no colored shadows, no stacked multi-layer shadows.**

---

## The drop zone

The most important component in the product.

- Dashed 2px border in `--colors-hairline-strong`, `--rounded-lg`.
- Background `--colors-surface`.
- Minimum height 320px on desktop, 240px on mobile.
- On a tool page it is the largest element above the fold.
- Contains: one Lucide icon (24px, `--colors-mute`), one line of instruction at
  `--fs-subhead`, and a secondary "browse files" text button. Nothing else.
- Drag-active: border becomes solid `--colors-accent`, background becomes
  `--colors-accent-wash`, elevation `--shadow-lg`. Transition 120ms.
- Empty state is an invitation, not an explanation. "Drop a PDF here" — not
  "Drag and drop your PDF file into this area to begin conversion".

---

## Icons

**Lucide** only (MIT, no attribution). No Flaticon, no Iconscout, no mixed sets.

- `strokeWidth` 1.75, never the default 2.
- 20px inline with text, 24px standalone.
- Icons inherit `currentColor`. Never multicolored, never in tinted squares.
- Tool cards: one icon, `--colors-mute` at rest, `--colors-accent` on hover.
  Not eight different colors like iLovePDF.

---

## Motion

Motion confirms an action. It does not decorate.

- Interaction transitions: 120–180ms, `cubic-bezier(0.4, 0, 0.2, 1)`.
- Conversion progress and result reveal may animate — the user did something and
  needs to see the result.
- **No scroll-triggered reveals.** No fade-and-slide-up on sections. No stagger.
- **No hover-lift on every card.** Cards change border color and shadow, not
  position.
- Respect `prefers-reduced-motion`.
- No animation library. CSS transitions are sufficient for everything above.

---

## Hard constraints

An agent working on this project must not:

1. Add any gradient, glow, mesh, or blurred colored shape.
2. Introduce a second accent color.
3. Put a drop zone on the homepage.
4. Put anything above the fold on a tool page other than the heading, one line
   of subtext, and the drop zone.
5. Write a hardcoded font-size, color, spacing, radius, or shadow value.
6. Set one word of a headline in a different color.
7. Use an ALL-CAPS eyebrow label.
8. Use monospace for anything that is not machine data.
9. Add a hover-lift or scroll-reveal animation.
10. Install Tailwind or shadcn/ui. This project is Astro with vanilla CSS.

---

## Voice

Plain, direct, no selling. The user already decided to use the tool.

- "Drop a PDF here" — not "Get started converting your files today"
- "Converting…" — not "Please wait while we process your request"
- "Couldn't read that file. Try a different PDF." — not "An error occurred"

Buttons name what happens: "Convert to Word", not "Submit". The same action keeps
the same name across the whole flow.

Errors explain what broke and what to do next. They do not apologize.
