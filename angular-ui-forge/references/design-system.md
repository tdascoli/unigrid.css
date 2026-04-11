# Design System — Unigrid.css Integration

## Table of Contents
1. [Design Tokens](#design-tokens)
2. [Vertical Rhythm (Gutenberg)](#vertical-rhythm)
3. [Grid Composition (Golden Grid / Unigrid)](#grid-composition)
4. [Color System and Contrast](#color-system-and-contrast)
5. [Typography Scale](#typography-scale)
6. [Spacing Scale](#spacing-scale)
7. [Responsive Breakpoints](#responsive-breakpoints)
8. [Accessibility in CSS](#accessibility-in-css)
9. [Viewport Utilization](#viewport-utilization)
10. [Component Height Calculator](#component-height-calculator)

---

## Design Tokens

All design decisions flow from a single token file. When unigrid.css is detected, use its
tokens directly. Otherwise, generate equivalent CSS custom properties.

### Unigrid.css Token Map

```scss
// Typography
--ug-font-family: 'Inter', system-ui, sans-serif;
--ug-font-size-xs: 0.75rem;    // 12px
--ug-font-size-sm: 0.875rem;   // 14px
--ug-font-size-base: 1rem;     // 16px mobile, 18px desktop
--ug-font-size-lg: 1.125rem;   // 18px
--ug-font-size-xl: 1.25rem;    // 20px
--ug-font-size-2xl: 1.5rem;    // 24px
--ug-font-size-3xl: 2rem;      // 32px

// Leading (the heartbeat of vertical rhythm)
--ug-leading: 1.625rem;        // ~26px mobile
// At desktop breakpoint (1024px+): --ug-leading: 1.7rem (~31px)

// Spacing scale (multiples of leading)
--ug-spacing-0: 0;
--ug-spacing-1: calc(0.25 * var(--ug-leading));  // ~6.5px
--ug-spacing-2: calc(0.5 * var(--ug-leading));   // ~13px
--ug-spacing-3: calc(1 * var(--ug-leading));      // ~26px (1 line)
--ug-spacing-4: calc(1.5 * var(--ug-leading));    // ~39px
--ug-spacing-5: calc(2 * var(--ug-leading));      // ~52px (2 lines)
--ug-spacing-6: calc(3 * var(--ug-leading));      // ~78px
--ug-spacing-7: calc(4 * var(--ug-leading));      // ~104px
--ug-spacing-8: calc(6 * var(--ug-leading));      // ~156px

// Colors (NPS-inspired, WCAG AA compliant pairs)
--ug-black: #1a1a1a;
--ug-white: #ffffff;
--ug-warm-gray: #f5f2ed;
--ug-dark-gray: #333333;
--ug-medium-gray: #666666;
--ug-light-gray: #e8e5e0;
--ug-red: #c1272d;
--ug-brown: #4a3728;
--ug-green: #2d5a27;
--ug-blue: #274a5a;

// Grid
--ug-columns: 12;
--ug-gap: var(--ug-spacing-3);  // Grid gap = 1 leading unit

// Borders
--ug-border-radius: 0;  // Sharp by default (unigrid aesthetic)
```

### Semantic Token Layer (Component-Level)

Map raw tokens to semantic meanings for components:

```scss
// In the UI library's _tokens.scss
:root {
  // Surfaces
  --ui-surface: var(--ug-white);
  --ui-surface-raised: var(--ug-warm-gray);
  --ui-surface-overlay: var(--ug-white);

  // Text
  --ui-text-primary: var(--ug-black);
  --ui-text-secondary: var(--ug-dark-gray);
  --ui-text-muted: var(--ug-medium-gray);
  --ui-text-inverse: var(--ug-white);

  // Interactive
  --ui-color-primary: var(--ug-red);
  --ui-color-on-primary: var(--ug-white);
  --ui-color-secondary: var(--ug-brown);
  --ui-color-on-secondary: var(--ug-white);
  --ui-color-danger: var(--ug-red);
  --ui-color-success: var(--ug-green);
  --ui-color-warning: #d4a017;  // Ensure 4.5:1 on white
  --ui-color-info: var(--ug-blue);

  // Focus
  --ui-focus-color: #1a73e8;  // High contrast blue
  --ui-focus-width: 3px;

  // Radius (configurable per project)
  --ui-radius: var(--ug-border-radius);
  --ui-radius-sm: 0;
  --ui-radius-lg: 0;
  --ui-radius-pill: 9999px;

  // Transitions
  --ui-transition-fast: 0.1s ease;
  --ui-transition-base: 0.15s ease;
  --ui-transition-slow: 0.3s ease;
}
```

---

## Vertical Rhythm

Vertical rhythm means every element on the page aligns to an invisible baseline grid.
The grid line spacing equals the leading (line-height of body text).

### The Rule

Every block-level element's total height (content + padding + border + margin) should be
a **whole multiple** of the leading unit.

### How to Achieve It

**Text elements**: Set line-height to 1× or 2× leading. Margins to whole multiples.
```scss
h2 {
  font-size: 1.6875rem;
  line-height: calc(2 * var(--ug-leading));    // 2 lines tall
  margin-top: calc(3 * var(--ug-leading));     // 3 lines above
  margin-bottom: calc(1 * var(--ug-leading));  // 1 line below
}
```

**Components with borders**: Account for border in the padding calculation.
```scss
.card {
  border: 1px solid var(--ug-light-gray);
  // Padding compensates for 2px total border (top + bottom)
  padding: calc(var(--ug-spacing-3) - 1px) var(--ug-spacing-3);
}
```

**Components with fixed heights**: Ensure height is a multiple of leading.
```scss
.toolbar {
  // Height = 2 leading units
  height: calc(2 * var(--ug-leading));
  display: flex;
  align-items: center;
}
```

**Images**: Use the Gutenberg approach — constrain to rhythm-fitting heights.
```scss
.article-image {
  width: 100%;
  // Round height to nearest leading multiple (JS-assisted or object-fit)
  object-fit: cover;
}
```

### Rhythm Debug Overlay

Unigrid.css includes `grid-debug.js` which overlays baseline grid lines on the page.
In Storybook, activate this as a decorator to visually verify rhythm during development.

---

## Grid Composition

The unigrid grid is a 12-column CSS Grid. Key patterns for component layouts:

### Full-Width Data UI
```scss
.data-dashboard {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--ug-gap);

  // Use the full viewport on all sizes
  &__filters { grid-column: 1 / -1; }      // Full width
  &__chart   { grid-column: 1 / -1; }      // Full width

  @media (min-width: 768px) {
    &__sidebar { grid-column: 1 / 4; }     // 3 columns
    &__main    { grid-column: 4 / -1; }    // 9 columns
  }

  @media (min-width: 1024px) {
    &__sidebar { grid-column: 1 / 3; }     // 2 columns
    &__main    { grid-column: 3 / 10; }    // 7 columns
    &__aside   { grid-column: 10 / -1; }   // 3 columns
  }
}
```

### Form Layout (Maximize Viewport)
```scss
.form-grid {
  display: grid;
  gap: var(--ug-spacing-3);

  // Mobile: single column
  grid-template-columns: 1fr;

  // Tablet: 2 columns for related field pairs
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  // Desktop: up to 3 or 4 columns for dense forms
  @media (min-width: 1024px) {
    grid-template-columns: repeat(var(--form-cols, 2), 1fr);
  }

  // Full-width fields span all columns
  &__full {
    grid-column: 1 / -1;
  }
}
```

### Using Unigrid Classes in Templates
```html
<div class="ug-grid">
  <div class="ug-col--12 ug-col--md-6 ug-col--lg-4">
    <!-- 12 cols mobile, 6 tablet, 4 desktop -->
  </div>
</div>
```

### DIN Proportion Formats

When building content that should match NPS publication formats:
```html
<div class="ug-format--A4">
  <!-- 1 panel wide × 4 panels long, DIN 1:√2 ratio -->
</div>
```

---

## Color System and Contrast

### WCAG 2.2 AA Contrast Requirements

| Content Type | Minimum Ratio | Example |
|-------------|--------------|---------|
| Normal text (<24px, <18.66px bold) | 4.5:1 | Body copy on backgrounds |
| Large text (≥24px, ≥18.66px bold) | 3:1 | Headings, large labels |
| UI components & graphics | 3:1 | Borders, icons, focus indicators |
| Non-text contrast | 3:1 | Form field boundaries, chart elements |

### Contrast-Safe Color Pairs

Pre-verified pairs from the unigrid palette:

```scss
// Passing pairs (4.5:1+ on white #ffffff)
// --ug-black (#1a1a1a):     contrast 16.15:1 ✓
// --ug-dark-gray (#333333): contrast 12.63:1 ✓
// --ug-medium-gray (#666):  contrast  5.74:1 ✓
// --ug-red (#c1272d):       contrast  5.37:1 ✓
// --ug-brown (#4a3728):     contrast  9.22:1 ✓
// --ug-green (#2d5a27):     contrast  7.64:1 ✓
// --ug-blue (#274a5a):      contrast  8.63:1 ✓

// Failing pairs (below 4.5:1 on white)
// --ug-light-gray (#e8e5e0): contrast 1.44:1 ✗ — never for text
// --ug-warm-gray (#f5f2ed):  contrast 1.12:1 ✗ — background only
```

### Encoding Contrast in CSS

Embed contrast checks as comments in the SCSS to maintain awareness:

```scss
.alert--warning {
  // ⚠ Contrast: #d4a017 on #fff = 3.1:1 (fails AA for small text)
  // Solution: use dark background or darker text
  background-color: #fef3cd;
  color: var(--ug-dark-gray);  // #333 on #fef3cd = 10.9:1 ✓
  border-left: 4px solid #d4a017;  // decorative, 3:1 minimum met ✓
}
```

### Dark Mode Token Override

```scss
@media (prefers-color-scheme: dark) {
  :root {
    --ui-surface: #1a1a1a;
    --ui-text-primary: #f0f0f0;
    --ui-text-secondary: #b0b0b0;
    // Re-verify all contrast ratios for dark mode
  }
}
```

---

## Typography Scale

Based on Gutenberg's Perfect Fifth modular scale, adapted for UI:

| Token | Size | Use |
|-------|------|-----|
| `--ug-font-size-xs` | 0.75rem (12px) | Captions, labels |
| `--ug-font-size-sm` | 0.875rem (14px) | Secondary text, form help |
| `--ug-font-size-base` | 1rem (16–18px) | Body text, inputs |
| `--ug-font-size-lg` | 1.125rem (18px) | Lead paragraphs |
| `--ug-font-size-xl` | 1.25rem (20px) | Section titles |
| `--ug-font-size-2xl` | 1.5rem (24px) | Page headings |
| `--ug-font-size-3xl` | 2rem (32px) | Hero headlines |

All sizes generate line-heights that snap to the leading grid.

---

## Spacing Scale

The spacing scale is derived from the leading unit. This is the *only* spacing system
components should use — no magic numbers, no `8px`, no `1.5rem`.

| Token | Value | Rhythm |
|-------|-------|--------|
| `--ug-spacing-0` | 0 | 0 lines |
| `--ug-spacing-1` | 0.25× leading | ¼ line |
| `--ug-spacing-2` | 0.5× leading | ½ line |
| `--ug-spacing-3` | 1× leading | 1 line |
| `--ug-spacing-4` | 1.5× leading | 1½ lines |
| `--ug-spacing-5` | 2× leading | 2 lines |
| `--ug-spacing-6` | 3× leading | 3 lines |
| `--ug-spacing-7` | 4× leading | 4 lines |
| `--ug-spacing-8` | 6× leading | 6 lines |

---

## Responsive Breakpoints

Mobile-first. Always write base styles first, then layer on complexity.

| Name | Min-width | Typical device |
|------|-----------|----------------|
| (base) | 0 | Phone portrait |
| `sm` | 480px | Phone landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Wide desktop |

```scss
// Mixin pattern
@mixin respond-to($bp) {
  @if $bp == sm { @media (min-width: 480px) { @content; } }
  @if $bp == md { @media (min-width: 768px) { @content; } }
  @if $bp == lg { @media (min-width: 1024px) { @content; } }
  @if $bp == xl { @media (min-width: 1280px) { @content; } }
}
```

---

## Accessibility in CSS

### Focus Indicators (WCAG 2.4.7, 2.4.11, 2.4.12)

Use `outline` for focus indicators, never `box-shadow` as the primary focus style.
`box-shadow` is invisible in Windows High Contrast Mode (forced-colors), which means
keyboard users in high contrast mode would have no focus indicator at all. `outline`
is preserved by forced-colors mode and is the only reliable cross-mode focus indicator.

```scss
// Global focus style — applied to all interactive elements
// ALWAYS use outline, never box-shadow as primary focus indicator
:focus-visible {
  outline: var(--ui-focus-width, 3px) solid var(--ui-focus-color, #1a73e8);
  outline-offset: 2px;
  // Contrast: #1a73e8 against any surface must be ≥ 3:1

  // Optional: add box-shadow for aesthetic polish alongside outline
  // box-shadow: 0 0 0 4px rgba(26, 115, 232, 0.2);
}

// Never remove focus styles — customize them
:focus:not(:focus-visible) {
  outline: none;  // Remove only for mouse users
}
```

For form inputs with border styling, the focus-visible outline goes on the wrapper or
the input itself — not as a border-color change (which may not meet the 3:1 contrast
requirement for focus indicators):

```scss
.form-input:focus-visible {
  // Primary: outline (works in forced-colors mode)
  outline: 3px solid var(--ui-focus-color, #1a73e8);
  outline-offset: 2px;
  // Secondary: visual polish (optional, NOT a replacement for outline)
  border-color: var(--ui-focus-color, #1a73e8);
}
```

### Touch Targets (WCAG 2.5.8)

Every interactive element needs a 44×44px minimum touch area. This is the most commonly
missed accessibility requirement — especially on pagination, table sort buttons, and checkboxes.

```scss
// Base pattern: apply to ALL interactive elements
.interactive-element {
  min-height: 44px;
  min-width: 44px;
}

// Pagination buttons — the most common offender
.pagination__button {
  min-height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

// Checkboxes and radios — native inputs are tiny, expand the clickable area
.checkbox-wrapper {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  min-width: 44px;
  cursor: pointer;

  input[type="checkbox"],
  input[type="radio"] {
    // Visual size can be smaller
    width: 20px;
    height: 20px;
    // But the label/wrapper provides the 44px target
  }
}

// Table sort buttons — must be full 44px clickable
th button.sort-trigger {
  min-height: 44px;
  padding: var(--ug-spacing-2);
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--ug-spacing-1);
}

// Tab buttons, accordion triggers, dropdown toggles
[role="tab"],
.accordion__trigger,
.dropdown__toggle {
  min-height: 44px;
  min-width: 44px;
}
```

### Reduced Motion (WCAG 2.3.3)

```scss
// Wrap ALL animations and transitions
@media (prefers-reduced-motion: no-preference) {
  .animate-in {
    animation: fadeIn 0.3s ease;
  }
}

// Or disable transitions globally
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### High Contrast Mode

```scss
@media (forced-colors: active) {
  .button {
    // In forced-colors, custom colors are overridden
    // Use system colors for visibility
    border: 2px solid ButtonText;
    forced-color-adjust: none;  // Only when custom styling is essential
  }
}
```

### Color Independence

Never convey information through color alone. Pair color with:
- Icons (error = red + ✕ icon)
- Text labels ("Error: ...")
- Patterns (striped background for disabled)
- Shape (rounded badge vs. square badge)

---

## Viewport Utilization

Complex UIs should use space efficiently. The goal is to minimize scrolling for data-heavy
views while maintaining readability and rhythm.

### Principles

1. **Forms fill the width** — Don't center a 400px form on a 1400px screen. Use multi-column
   grid layouts that expand fields to fill available space.
2. **Data tables stretch** — Tables should use 100% width with proportional columns.
3. **Navigation uses the edge** — Sidebars, toolbars use screen edges; content fills the rest.
4. **Whitespace is intentional** — The unigrid grid's gaps and the leading-based spacing provide
   natural breathing room. Extra padding is unnecessary.
5. **Dense on desktop, spaced on mobile** — Use responsive grid columns to show more columns
   on wider screens.

### Pattern: Full-Viewport Dashboard

```scss
.dashboard {
  display: grid;
  min-height: 100vh;
  min-height: 100dvh;  // Dynamic viewport height for mobile
  grid-template-rows: auto 1fr auto;  // header, content, footer
  grid-template-columns: auto 1fr;    // sidebar, main

  &__header  { grid-column: 1 / -1; }
  &__sidebar { display: none; }
  &__main    { grid-column: 1 / -1; overflow-y: auto; }
  &__footer  { grid-column: 1 / -1; }

  @media (min-width: 768px) {
    &__sidebar { display: block; width: 240px; }
    &__main    { grid-column: 2; }
  }
}
```

---

## Component Height Calculator

For components that need exact rhythm alignment, calculate the total height:

```
Total Height = content_height + padding_top + padding_bottom + border_top + border_bottom + margin_top + margin_bottom
```

This must equal N × leading, where N is a positive integer.

**Example: Input field**
```
font-size: 1rem → line-height: 1.625rem (1× leading)
padding: 0.5× leading top + 0.5× leading bottom = 1× leading
border: 1px top + 1px bottom = 2px
Total: 1 leading + 1 leading + 2px ≈ 2 leading + 2px

Adjust: padding = calc(0.5 * var(--ug-leading) - 1px) each side
Total: exactly 2× leading ✓
```

When exact alignment isn't possible (e.g., complex components with dynamic content),
align the outer margins to the grid and let internal content flow naturally.
