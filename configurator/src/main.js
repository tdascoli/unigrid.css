import { defaultConfig, generateScssVariables, generateScssImports } from './config.js';

// Current config (deep clone of defaults)
let config = JSON.parse(JSON.stringify(defaultConfig));

// JS source files (bundled at build time by Vite)
const jsSources = {
  dropdown: () => import('../../src/js/dropdown.js?raw').then(m => m.default),
  tabs: () => import('../../src/js/tabs.js?raw').then(m => m.default),
  scrollspy: () => import('../../src/js/scrollspy.js?raw').then(m => m.default),
  modal: () => import('../../src/js/modal.js?raw').then(m => m.default),
};

// ---- Update Preview ----

function updatePreview() {
  const preview = document.getElementById('preview');
  preview.style.setProperty('--p-black', config.colors.black);
  preview.style.setProperty('--p-red', config.colors.red);
  preview.style.setProperty('--p-brown', config.colors.brown);
  preview.style.setProperty('--p-green', config.colors.green);
  preview.style.setProperty('--p-blue', config.colors.blue);
  preview.style.setProperty('--p-warmGray', config.colors.warmGray);
  preview.style.setProperty('--p-lightGray', config.colors.lightGray);
  preview.style.setProperty('--p-font', config.fontFamily);
  preview.style.setProperty('--p-radius', config.borderRadius === 0 ? '0' : config.borderRadius + 'rem');

  // Update SCSS output
  const scss = generateScssVariables(config) + '\n' + generateScssImports(config);
  document.getElementById('output-scss').textContent = scss;
}

// ---- Bind Inputs ----

function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

function initBindings() {
  // Color and text inputs
  document.querySelectorAll('[data-cfg]').forEach(input => {
    const path = input.getAttribute('data-cfg');

    input.addEventListener('input', () => {
      let value = input.value;

      // Convert numeric values
      if (input.type === 'range') {
        value = parseFloat(value);
      }

      setNestedValue(config, path, value);

      // Update display values
      const display = document.querySelector(`[data-cfg-display="${path}"]`);
      if (display) {
        if (path === 'borderRadius') {
          display.textContent = value === 0 ? '0' : value + 'rem';
        } else if (path.includes('FontSize')) {
          display.textContent = value + '%';
        } else {
          display.textContent = value;
        }
      }

      updatePreview();
    });
  });

  // Component checkboxes
  document.querySelectorAll('[data-cfg-comp]').forEach(input => {
    const comp = input.getAttribute('data-cfg-comp');
    input.addEventListener('change', () => {
      config.components[comp] = input.checked;
      updatePreview();
    });
  });

  // JS checkboxes
  document.querySelectorAll('[data-cfg-js]').forEach(input => {
    const comp = input.getAttribute('data-cfg-js');
    input.addEventListener('change', () => {
      config.js[comp] = input.checked;
    });
  });
}

// ---- Download Functions ----

function downloadFile(content, filename, type = 'text/css') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function setStatus(msg, isError = false) {
  const el = document.getElementById('status');
  el.textContent = msg;
  el.className = isError ? 'cfg-status cfg-status--error' : 'cfg-status';
  if (!isError) setTimeout(() => el.textContent = '', 3000);
}

// Download CSS
document.getElementById('btn-download-css').addEventListener('click', async () => {
  setStatus('Generating CSS...');

  // Generate the SCSS content
  const scssVars = generateScssVariables(config);
  const scssImports = generateScssImports(config);
  const fullScss = scssVars + '\n' + scssImports;

  // For now, download as SCSS (browser SCSS compilation is complex)
  // Users can compile with their own toolchain
  downloadFile(fullScss, 'unigrid-custom.scss', 'text/plain');
  setStatus('Downloaded unigrid-custom.scss');
});

// Download JS
document.getElementById('btn-download-js').addEventListener('click', async () => {
  setStatus('Generating JS...');

  const parts = [];
  for (const [name, loader] of Object.entries(jsSources)) {
    if (config.js[name]) {
      try {
        const src = await loader();
        parts.push(`// ${name}.js\n${src}`);
      } catch (e) {
        // Fallback: include a comment
        parts.push(`// ${name}.js — source not available in this build`);
      }
    }
  }

  const js = parts.join('\n\n');
  downloadFile(js, 'unigrid-custom.js', 'text/javascript');
  setStatus('Downloaded unigrid-custom.js');
});

// ---- Init ----

initBindings();
updatePreview();
