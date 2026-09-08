// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Deployed to GitHub Pages as a project site: https://ludobegins.github.io/ludoblog/
// If the repo is later renamed to `ludobegins.github.io`, set `base: '/'` (or drop it).
const site = 'https://ludobegins.github.io';
const base = '/ludoblog';

// https://astro.build/config
export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  build: {
    format: 'directory',
  },
});
