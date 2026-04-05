#!/usr/bin/env node
// Bundle the Vite configurator and the Bootstrap theme demo into
// docs/dist so a single `npm run build` in docs/ produces the exact
// same artifact that the GitHub Pages workflow uploads.

import { execSync } from 'node:child_process';
import { cpSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');
const docsDist = resolve(repoRoot, 'docs', 'dist');

function run(label, cmd, cwd) {
  console.log(`\n▶ ${label}`);
  execSync(cmd, { stdio: 'inherit', cwd });
}

function copy(src, dest) {
  mkdirSync(dest, { recursive: true });
  cpSync(src, dest, { recursive: true });
}

if (!existsSync(docsDist)) {
  console.error('docs/dist does not exist — run `astro build` first.');
  process.exit(1);
}

// ---- Configurator ----
const configuratorDir = resolve(repoRoot, 'configurator');
run('Installing configurator dependencies', 'npm install --no-audit --no-fund', configuratorDir);
run('Building configurator', 'npm run build', configuratorDir);
copy(resolve(configuratorDir, 'dist'), resolve(docsDist, 'configurator'));
console.log('✓ Copied configurator → docs/dist/configurator/');

// ---- Bootstrap theme ----
const themeDir = resolve(repoRoot, 'themes', 'bootstrap');
run('Installing Bootstrap theme dependencies', 'npm install --no-audit --no-fund', themeDir);
run('Building Bootstrap theme', 'npm run build', themeDir);
const themeDest = resolve(docsDist, 'themes', 'bootstrap');
mkdirSync(themeDest, { recursive: true });
cpSync(resolve(themeDir, 'index.html'), resolve(themeDest, 'index.html'));
copy(resolve(themeDir, 'dist'), resolve(themeDest, 'dist'));

// Ship the grid-debug overlay alongside the theme CSS so the trigger
// element in index.html can load it. Built by `npm run build` at repo root.
const gridDebugSrc = resolve(repoRoot, 'dist', 'grid-debug.js');
if (existsSync(gridDebugSrc)) {
  cpSync(gridDebugSrc, resolve(themeDest, 'dist', 'grid-debug.js'));
  console.log('✓ Copied grid-debug.js → docs/dist/themes/bootstrap/dist/');
} else {
  console.warn('⚠ dist/grid-debug.js missing — run `npm run build` at repo root first');
}
console.log('✓ Copied Bootstrap theme → docs/dist/themes/bootstrap/');

console.log('\n✓ docs/dist is ready for Pages deploy.');
