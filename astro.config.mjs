// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const NOINDEX_PATHS = [
  '/premiere-ou-nouvelle',
  '/etude-posturale-ou-cales',
  '/nouveau-velo-ou-reglage',
  '/etude-posturale',
];

// https://astro.build/config
export default defineConfig({
  site: 'https://id-postur.fr',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    sitemap({
      filter: (page) => !NOINDEX_PATHS.some((path) => page.includes(path)),
    }),
  ],
});
