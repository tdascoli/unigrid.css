import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://tdascoli.github.io',
  base: '/unigrid.css/',
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  },
});
