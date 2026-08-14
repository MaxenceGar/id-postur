// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

/**
 * Pages exclues du sitemap (celles en noindex).
 * Le parcours /reserver sert uniquement à orienter le client vers le bon
 * créneau : aucune valeur en résultat de recherche, et il ferait doublon
 * avec /etudes-posturales. Ajouter ici toute future page en noindex.
 */
const NOINDEX_PATHS = [
  '/reserver',
  '/reserver/premiere-etude',
  '/reserver/deja-client',
];

// https://astro.build/config
export default defineConfig({
  site: 'https://id-postur.fr',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname.replace(/\/$/, "");
        return !NOINDEX_PATHS.includes(pathname);
      },
    }),
  ],
});
