# Framework Adapters — Bootstrap, Tailwind, and Detection

## Table of Contents
1. [Framework Detection](#framework-detection)
2. [Unigrid.css Native](#unigridcss-native)
3. [Bootstrap Adapter](#bootstrap-adapter)
4. [Tailwind Adapter](#tailwind-adapter)
5. [Framework-Agnostic Fallback](#framework-agnostic-fallback)
6. [Component SCSS Patterns Per Framework](#component-scss-patterns-per-framework)

---

## Framework Detection

Before generating any component SCSS, detect the project's CSS framework:

### Detection logic

```
1. Read package.json dependencies + devDependencies
2. Check for:
   a. "unigrid.css" or "unigrid" → Unigrid native
   b. "bootstrap" → Bootstrap (check for unigrid-bootstrap theme too)
   c. "tailwindcss" → Tailwind
   d. Multiple found → ask user which is primary
   e. None found → framework-agnostic CSS custom properties

3. Check for existing configuration:
   a. tailwind.config.js/ts → Tailwind is configured
   b. angular.json styles array → what global styles are loaded
   c. _variables.scss or tokens.scss → existing design tokens
```

### Configuration detection commands

```bash
# Check package.json
cat package.json | grep -E '"(bootstrap|tailwindcss|unigrid)"'

# Check for Tailwind config
ls tailwind.config.* 2>/dev/null

# Check Angular styles
cat angular.json | grep -A 20 '"styles"'

# Check for unigrid-bootstrap theme
find . -name "unigrid-bootstrap*" -type f 2>/dev/null
```

---

## Unigrid.css Native

When unigrid.css is the CSS framework, components use its classes and tokens directly.

### SCSS imports

```scss
// In component SCSS files
@use 'unigrid' as ug;

.my-component {
  // Use unigrid spacing
  padding: var(--ug-spacing-3);
  margin-bottom: var(--ug-spacing-5);

  // Use unigrid typography
  font-family: var(--ug-font-family);
  font-size: var(--ug-font-size-base);
  line-height: var(--ug-leading);

  // Use unigrid colors
  color: var(--ug-black);
  background: var(--ug-warm-gray);
}
```

### Template classes

```html
<!-- Use unigrid grid classes directly -->
<div class="ug-grid">
  <div class="ug-col--12 ug-col--md-6 ug-col--lg-4">
    <!-- content -->
  </div>
</div>

<!-- Use unigrid component classes where they exist -->
<button class="ug-btn ug-btn--red ug-btn--lg">Action</button>
```

### When to use unigrid classes vs. custom SCSS

- **Use unigrid classes**: grid layout, basic typography (`.ug-prose`), utility spacing
- **Use custom SCSS**: component-specific styles, state management, animations
- **Never mix**: Don't put custom spacing on elements that use unigrid grid classes

---

## Bootstrap Adapter

When Bootstrap is detected, check if the `unigrid-bootstrap` theme is installed.
This theme maps all unigrid tokens to Bootstrap variables for seamless integration.

### With unigrid-bootstrap theme

The theme is already configured. Components MUST use Bootstrap class names in their templates.
This is the critical pattern: when Bootstrap is detected, **use Bootstrap's actual CSS classes**
in the Angular template HTML, then override spacing/rhythm in the component SCSS.

The reason this matters: Bootstrap users expect to see Bootstrap classes. Their existing
components use them, their IDE autocomplete suggests them, and their team's muscle memory
knows them. Generating custom BEM classes when Bootstrap is installed creates inconsistency
and confuses the team. Use what the project already has.

```html
<!-- Template — use Bootstrap's actual classes -->
<div class="form-floating mb-3">
  <input
    class="form-control"
    [class.is-invalid]="state === 'error'"
    [class.is-valid]="state === 'success'"
    [type]="type"
    [id]="inputId"
    [placeholder]="label"
    [disabled]="disabled"
    [attr.aria-invalid]="state === 'error' || null"
    [attr.aria-describedby]="feedbackId"
  />
  <label [for]="inputId">{{ label }}</label>
  <div class="invalid-feedback" *ngIf="state === 'error'" [id]="feedbackId" role="alert">
    {{ errorMessage }}
  </div>
  <div class="valid-feedback" *ngIf="state === 'success'" [id]="feedbackId">
    {{ successMessage }}
  </div>
</div>
```

```scss
// Component SCSS — rhythm overrides on Bootstrap classes
:host {
  display: block;
  margin-bottom: var(--ug-spacing-3);  // Rhythm-aligned spacing
}

.form-floating {
  .form-control {
    min-height: 44px;
    line-height: var(--ug-leading);
    font-family: var(--ug-font-family);

    &:focus-visible {
      outline: 3px solid var(--ui-focus-color, #1a73e8);
      outline-offset: 2px;
      box-shadow: none; // Override Bootstrap's default box-shadow focus
    }
  }
}

// Bootstrap buttons with rhythm
.btn {
  min-height: 44px;
  padding: var(--ug-spacing-1) var(--ug-spacing-3);
  line-height: var(--ug-leading);

  &:focus-visible {
    outline: 3px solid var(--ui-focus-color, #1a73e8);
    outline-offset: 2px;
    box-shadow: none;
  }
}
```

**Key Bootstrap classes to use in templates:**

| Component | Bootstrap classes |
|-----------|------------------|
| Form input | `form-control`, `form-floating`, `is-invalid`, `is-valid` |
| Select | `form-select`, `form-floating` |
| Checkbox/Radio | `form-check`, `form-check-input`, `form-check-label` |
| Button | `btn`, `btn-primary`, `btn-outline-*`, `btn-sm`, `btn-lg` |
| Card | `card`, `card-body`, `card-header`, `card-footer` |
| Grid | `container`, `row`, `col-*`, `g-3` |
| Table | `table`, `table-striped`, `table-hover` |
| Pagination | `pagination`, `page-item`, `page-link` |
| Modal | `modal`, `modal-dialog`, `modal-content` |
| Navbar | `navbar`, `nav`, `nav-link` |
| Alert/Feedback | `alert`, `invalid-feedback`, `valid-feedback` |

### Without unigrid-bootstrap theme — create token bridge

Generate a `_bootstrap-bridge.scss` that maps unigrid tokens to Bootstrap variables:

```scss
// _bootstrap-bridge.scss
// Import before Bootstrap's SCSS

// Colors
$primary: var(--ui-color-primary);
$secondary: var(--ui-color-secondary);
$success: var(--ui-color-success);
$danger: var(--ui-color-danger);
$warning: var(--ui-color-warning);
$info: var(--ui-color-info);

// Typography
$font-family-base: var(--ug-font-family);
$font-size-base: 1rem;
$line-height-base: 1.625;  // Matches mobile leading

// Spacing (Bootstrap uses a $spacer variable)
$spacer: var(--ug-spacing-3);  // 1× leading as base spacer

// Border radius
$border-radius: var(--ui-radius);
$border-radius-sm: var(--ui-radius-sm);
$border-radius-lg: var(--ui-radius-lg);

// Grid
$grid-columns: 12;
$grid-gutter-width: var(--ug-spacing-3);

// Enable CSS Grid
$enable-cssgrid: true;

@import 'bootstrap/scss/bootstrap';
```

---

## Tailwind Adapter

When Tailwind is detected, extend the Tailwind config with unigrid-aligned values.

### tailwind.config.ts extension

```typescript
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      // Map spacing to leading multiples
      spacing: {
        'rhythm-0': '0',
        'rhythm-1': 'calc(0.25 * var(--ug-leading))',   // ¼ line
        'rhythm-2': 'calc(0.5 * var(--ug-leading))',    // ½ line
        'rhythm-3': 'calc(1 * var(--ug-leading))',       // 1 line
        'rhythm-4': 'calc(1.5 * var(--ug-leading))',     // 1½ lines
        'rhythm-5': 'calc(2 * var(--ug-leading))',       // 2 lines
        'rhythm-6': 'calc(3 * var(--ug-leading))',       // 3 lines
        'rhythm-7': 'calc(4 * var(--ug-leading))',       // 4 lines
        'rhythm-8': 'calc(6 * var(--ug-leading))',       // 6 lines
      },

      // Colors from unigrid palette
      colors: {
        'ug-black': '#1a1a1a',
        'ug-white': '#ffffff',
        'ug-warm-gray': '#f5f2ed',
        'ug-dark-gray': '#333333',
        'ug-medium-gray': '#666666',
        'ug-light-gray': '#e8e5e0',
        'ug-red': '#c1272d',
        'ug-brown': '#4a3728',
        'ug-green': '#2d5a27',
        'ug-blue': '#274a5a',
      },

      // Font sizes with rhythm-aligned line-heights
      fontSize: {
        'xs': ['0.75rem', { lineHeight: 'var(--ug-leading)' }],
        'sm': ['0.875rem', { lineHeight: 'var(--ug-leading)' }],
        'base': ['1rem', { lineHeight: 'var(--ug-leading)' }],
        'lg': ['1.125rem', { lineHeight: 'var(--ug-leading)' }],
        'xl': ['1.25rem', { lineHeight: 'calc(2 * var(--ug-leading))' }],
        '2xl': ['1.5rem', { lineHeight: 'calc(2 * var(--ug-leading))' }],
        '3xl': ['2rem', { lineHeight: 'calc(2 * var(--ug-leading))' }],
      },

      // Font family
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },

      // Breakpoints matching unigrid
      screens: {
        'sm': '480px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },

      // Border radius
      borderRadius: {
        'none': '0',
        'DEFAULT': 'var(--ui-radius)',
        'sm': 'var(--ui-radius-sm)',
        'lg': 'var(--ui-radius-lg)',
        'pill': '9999px',
      },
    },
  },
  plugins: [],
} satisfies Config;
```

### Component templates with Tailwind

```html
<!-- Tailwind utility classes aligned to rhythm -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-rhythm-3">
  <div class="p-rhythm-3 bg-ug-warm-gray rounded">
    <h3 class="text-xl font-semibold mb-rhythm-2">Card Title</h3>
    <p class="text-base text-ug-dark-gray">Card content aligned to rhythm.</p>
  </div>
</div>
```

### Component SCSS with Tailwind

When Tailwind is the framework, component SCSS files are minimal — most styling lives
in the template via utility classes. The SCSS file handles:

```scss
// Only complex styles that can't be expressed as utilities
:host {
  display: block;
}

// Component-specific animations
.dropdown-panel {
  @media (prefers-reduced-motion: no-preference) {
    transition: opacity 0.15s ease, transform 0.15s ease;
  }
}

// States that need @apply for complex selectors
.input-wrapper {
  &:has(:focus-visible) {
    @apply ring-2 ring-blue-500 ring-offset-2;
  }
}
```

---

## Framework-Agnostic Fallback

When no CSS framework is detected, generate components using pure CSS custom properties.

### Base tokens file

Generate a `_tokens.scss` with all design tokens as CSS custom properties:

```scss
:root {
  // This file provides the same tokens unigrid.css would,
  // but without depending on the unigrid package.

  --ug-font-family: 'Inter', system-ui, sans-serif;
  --ug-leading: 1.625rem;
  --ug-spacing-1: calc(0.25 * var(--ug-leading));
  --ug-spacing-2: calc(0.5 * var(--ug-leading));
  --ug-spacing-3: calc(1 * var(--ug-leading));
  // ... (full token set from design-system.md)

  @media (min-width: 1024px) {
    --ug-leading: 1.7rem;
  }
}
```

### Component SCSS pattern

```scss
.component {
  // Use only CSS custom properties — no framework classes
  padding: var(--ug-spacing-2) var(--ug-spacing-3);
  font-family: var(--ug-font-family);
  line-height: var(--ug-leading);
  border-radius: var(--ui-radius);
}
```

---

## Component SCSS Patterns Per Framework

### Decision matrix

| Framework | SCSS file contains | Template uses |
|-----------|-------------------|---------------|
| Unigrid native | `@use 'unigrid'`, custom props | `.ug-grid`, `.ug-col--*`, etc. |
| Bootstrap | Custom props + overrides | `.container`, `.row`, `.col-*`, `.form-*` |
| Tailwind | Minimal (animations, complex states) | Utility classes: `p-rhythm-3`, `grid`, etc. |
| None | Full custom props | Custom classes only |

### The one constant

Regardless of framework, every component SCSS file:
1. Uses `var(--ug-spacing-*)` for spacing (rhythm-aligned)
2. Uses `var(--ug-leading)` for line-height calculations
3. Uses `var(--ui-color-*)` for semantic colors
4. Includes `:focus-visible` styles using `outline` (never box-shadow as primary — it's invisible in forced-colors mode)
5. Includes `@media (prefers-reduced-motion: reduce)` media query
6. Includes `min-height: 44px; min-width: 44px` on ALL interactive elements (buttons, links, pagination, checkboxes, sort triggers, tabs, accordion triggers)
7. Is written mobile-first (base = small screen, `min-width` breakpoints only)
