import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://convertocean.com',
  /* Astro 7's default. It strips whitespace around inline elements by JSX
     rules rather than HTML rules, which is worth about 290 bytes a page —
     ~32 KB across the site.

     Held at `true` through the Astro 7 upgrade on purpose: that was a
     security batch, and a security batch should change what we serve as
     little as it can. The open question was whether any of the removed
     spaces were ones a reader could see — the space between two adjacent
     inline elements is the kind that shows up as two words run together.

     Answered by measurement, not by reading the diff: both builds were
     rendered in a real browser and compared on `innerText`, which is the
     text as laid out, so whitespace that only exists between block elements
     cannot produce a false alarm. See the roadmap entry for the result. */
  compressHTML: 'jsx',
  /* @astrojs/sitemap's `i18n` option is deliberately NOT set, and turning it on
     would make our hreflang worse, not better.

     It pairs locales by assuming the same path segment under each prefix —
     /second-page/ ↔ /es/second-page/ ↔ /fr/second-page/. Our Portuguese slugs
     are translated, because a Brazilian searches "comprimir PDF" and the slug
     is a ranking surface: /compress-pdf/ pairs with /pt/comprimir-pdf/. Enable
     the option and it would advertise /pt/compress-pdf/, a URL that does not
     exist, on every page — and Google discards an hreflang cluster whose links
     do not resolve, which would void the locale silently.

     hreflang is therefore declared in the HTML head only, from the content
     graph in src/i18n/content.ts. Head and sitemap are alternative delivery
     mechanisms for the same signal, not a pair that both have to be present,
     so one correct source beats two that disagree. The /pt/ URLs themselves
     are still listed here — that part needs no configuration. */
  integrations: [sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date()
    })]
});
