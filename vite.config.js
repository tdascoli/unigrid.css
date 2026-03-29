import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "dev",
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "dev/index.html"),
        grid: resolve(__dirname, "dev/grid.html"),
        formats: resolve(__dirname, "dev/formats.html"),
        typography: resolve(__dirname, "dev/typography.html"),
        components: resolve(__dirname, "dev/components.html"),
        cheatsheet: resolve(__dirname, "dev/cheatsheet.html"),
      },
    },
  },
});
