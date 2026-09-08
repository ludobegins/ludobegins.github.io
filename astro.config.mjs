// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkBreaks from 'remark-breaks';

// Deployed to GitHub Pages as a project site: https://ludobegins.github.io/ludoblog/
// If the repo is later renamed to `ludobegins.github.io`, set `base: '/'` (or drop it).
const site = 'https://ludobegins.github.io';
const base = '/ludoblog';

// https://astro.build/config
export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  i18n: {
    locales: ['pt', 'en'],
    defaultLocale: 'pt',
    routing: {
      // pt lives at the root (/, /sobre); en is prefixed (/en/, /en/sobre).
      prefixDefaultLocale: false,
    },
  },
  integrations: [sitemap({ i18n: { defaultLocale: 'pt', locales: { pt: 'pt-BR', en: 'en' } } })],
  build: {
    format: 'directory',
  },
  markdown: {
    // Use the unified processor so we can add remark plugins. `remark-breaks`
    // turns a single newline into a <br>, so verse keeps its line breaks.
    processor: unified({
      remarkPlugins: [remarkBreaks],
    }),
  },
});
