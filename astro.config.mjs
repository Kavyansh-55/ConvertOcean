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
  integrations: [sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date()
    })]
});
