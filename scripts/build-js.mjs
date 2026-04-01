import * as esbuild from 'esbuild';
import { readdirSync } from 'fs';
import { join } from 'path';

const srcDir = 'src/js';
const distDir = 'dist';
const isWatch = process.argv.includes('--watch');

// Get all JS files from src/js/
const jsFiles = readdirSync(srcDir)
  .filter(f => f.endsWith('.js'))
  .map(f => join(srcDir, f));

console.log(`[js] Found ${jsFiles.length} files: ${jsFiles.map(f => f.replace(srcDir + '/', '')).join(', ')}`);

// Build config: bundle all JS into one file
const buildOptions = {
  entryPoints: [join(srcDir, 'index.js')],
  bundle: true,
  outfile: join(distDir, 'unigrid.js'),
  format: 'iife',
  target: 'es2020',
  minify: false,
};

const buildOptionsMin = {
  ...buildOptions,
  outfile: join(distDir, 'unigrid.min.js'),
  minify: true,
};

// Also build individual files for selective loading
const individualOptions = jsFiles.map(f => ({
  entryPoints: [f],
  outdir: distDir,
  format: 'iife',
  target: 'es2020',
  minify: false,
}));

async function build() {
  try {
    // Bundled
    await esbuild.build(buildOptions);
    await esbuild.build(buildOptionsMin);
    console.log(`[js] Built ${distDir}/unigrid.js + unigrid.min.js`);

    // Individual
    for (const opts of individualOptions) {
      await esbuild.build(opts);
    }
    console.log(`[js] Built individual files: ${jsFiles.map(f => f.replace(srcDir + '/', '')).join(', ')}`);
  } catch (err) {
    console.error('[js] Build failed:', err);
    process.exit(1);
  }
}

async function watch() {
  try {
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();

    const ctxMin = await esbuild.context(buildOptionsMin);
    await ctxMin.watch();

    for (const opts of individualOptions) {
      const ctxInd = await esbuild.context(opts);
      await ctxInd.watch();
    }

    console.log('[js] Watching for changes...');
  } catch (err) {
    console.error('[js] Watch failed:', err);
    process.exit(1);
  }
}

if (isWatch) {
  watch();
} else {
  build();
}
