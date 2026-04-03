import * as sass from 'sass';
import { generateScssVariables, generateScssImports } from './config.js';

// All SCSS source files bundled at build time
const scssFiles = import.meta.glob('../../src/scss/_*.scss', { as: 'raw', eager: true });
const mainScss = import.meta.glob('../../src/scss/unigrid.scss', { as: 'raw', eager: true });

// Build a virtual filesystem for sass
function buildScssContent(config) {
  const variables = generateScssVariables(config);
  const imports = generateScssImports(config);

  // Custom entry point: variables override + selected imports
  return `${variables}\n${imports}`;
}

// Compile SCSS to CSS in the browser
export async function compileCss(config) {
  const entryScss = buildScssContent(config);

  try {
    const result = sass.compileString(entryScss, {
      style: 'compressed',
      importers: [{
        findFileUrl(url) {
          // Resolve relative imports to our virtual files
          const key = `../../src/scss/_${url}.scss`;
          if (scssFiles[key] !== undefined) {
            return new URL(`file:///virtual/_${url}.scss`);
          }
          return null;
        }
      }],
      url: new URL('file:///virtual/entry.scss'),
    });
    return { css: result.css, error: null };
  } catch (err) {
    return { css: null, error: err.message };
  }
}

// Generate JS bundle based on selected components
export function generateJs(config) {
  const parts = [];
  const jsFiles = import.meta.glob('../../src/js/dropdown.js', { as: 'raw', eager: true });
  const jsTabsFiles = import.meta.glob('../../src/js/tabs.js', { as: 'raw', eager: true });
  const jsScrollspyFiles = import.meta.glob('../../src/js/scrollspy.js', { as: 'raw', eager: true });
  const jsModalFiles = import.meta.glob('../../src/js/modal.js', { as: 'raw', eager: true });

  if (config.js.dropdown) {
    const key = Object.keys(jsFiles)[0];
    if (key) parts.push(jsFiles[key]);
  }
  if (config.js.tabs) {
    const key = Object.keys(jsTabsFiles)[0];
    if (key) parts.push(jsTabsFiles[key]);
  }
  if (config.js.scrollspy) {
    const key = Object.keys(jsScrollspyFiles)[0];
    if (key) parts.push(jsScrollspyFiles[key]);
  }
  if (config.js.modal) {
    const key = Object.keys(jsModalFiles)[0];
    if (key) parts.push(jsModalFiles[key]);
  }

  return parts.join('\n\n');
}

// Download helper
export function downloadFile(content, filename, type = 'text/css') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
