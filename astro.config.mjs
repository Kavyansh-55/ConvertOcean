import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://convertocean.com',
  integrations: [sitemap()],
  i18n: {
    defaultLocale: 'en',
    locales: [
      'en', 'hi', 'es', 'fr', 'de', 'pt', 'it', 'nl', 'ru', 'tr',
      'pl', 'uk', 'ar', 'fa', 'ur', 'bn', 'pa', 'ta', 'te', 'mr',
      'gu', 'zh', 'ja', 'ko', 'th', 'vi', 'id', 'ms', 'fil'
    ],
    routing: {
      prefixDefaultLocale: false,
      fallback: 'en'
    }
  }
});
