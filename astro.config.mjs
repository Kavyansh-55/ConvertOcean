import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://convertocean.com',
  integrations: [sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date()
    })]
});
