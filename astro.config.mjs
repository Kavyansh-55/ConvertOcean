import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://convertocean.com',
  /* Astro 7 changed this default from `true` to `'jsx'`, which strips
     whitespace around inline elements by JSX rules instead of HTML rules.
     Pinned to the old behaviour deliberately: this was a security upgrade,
     and a security upgrade should change what we serve as little as it can.

     Left on the new default, all 111 pages lost whitespace — including the
     space between adjacent inline elements, which is the kind that a reader
     can see as two words run together. Checking whether any of those spaces
     actually mattered means rendering every page in a browser and comparing,
     and that is a different piece of work from upgrading a framework.

     With this pinned, what remains between the two builds is: every
     `data-astro-cid-*` value (Astro 7 hashes them differently — verified
     that HTML and CSS agree, with **zero** orphaned scope ids in either
     build), one extra space after the skip link, and CSS declarations
     reordered by the minifier. Declaration sets are identical on 110 of 111
     pages; the one exception drops `ease` from a transition, which is the
     default timing function and so means the same thing.

     Worth revisiting on its own later — `'jsx'` is a genuine size win, about
     290 bytes a page and ~32 KB across the site. It needs its own testing
     pass, not a free ride on this one. */
  compressHTML: true,
  integrations: [sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date()
    })]
});
