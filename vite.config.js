import { resolve } from "path";
import { defineConfig } from "vite";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

export default defineConfig({
  root: "dev",
  plugins: [
    createSvgIconsPlugin({
      iconDirs: [resolve(__dirname, "src/icons")],
      symbolId: "ug-icon-[name]",
      inject: "body-first",
    }),
  ],
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
        modules: resolve(__dirname, "dev/modules.html"),
        typography: resolve(__dirname, "dev/typography.html"),
        components: resolve(__dirname, "dev/components.html"),
        cheatsheet: resolve(__dirname, "dev/cheatsheet.html"),
        example: resolve(__dirname, "dev/example.html"),
        exampleHero: resolve(__dirname, "dev/example-hero.html"),
        exampleSection: resolve(__dirname, "dev/example-section.html"),
        exampleProse: resolve(__dirname, "dev/example-prose.html"),
        exampleModules: resolve(__dirname, "dev/example-modules.html"),
      },
    },
  },
});
