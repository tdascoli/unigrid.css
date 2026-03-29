# Unigrid.css

A CSS grid framework inspired by [Massimo Vignelli's Unigrid system](https://en.wikipedia.org/wiki/Unigrids) for the National Park Service.

Built entirely with native **CSS Grid** — no dependencies.

## Concept

The Unigrid is a standardized graphic and production system developed for NPS site folders. Its key principles:

- **12-column base grid** with horizontal and vertical divisions
- **10 basic formats** in two series (A1–A4 small paper, B1–B6 large paper)
- **Broadside approach** — layouts designed as flat sheets divided into foldable panels
- **DIN proportions** (1:√2) for consistent scaling
- **Helvetica typography** with strict hierarchy
- **Signature black header band** with park name

## Quick Start

```html
<link rel="stylesheet" href="dist/unigrid.css">

<!-- NPS-style header -->
<header class="ug-header">
  <div class="ug-header__title">
    <h1>Park Name</h1>
    <p class="ug-header__subtitle">National Park / State</p>
  </div>
</header>

<!-- 12-column grid -->
<div class="ug-grid">
  <div class="ug-col-4">One third</div>
  <div class="ug-col-8">Two thirds</div>
</div>

<!-- Broadside with panels (A4 format = 6 panels) -->
<div class="ug-format-a4">
  <div class="ug-broadside">
    <section class="ug-panel">Panel 1</section>
    <section class="ug-panel">Panel 2</section>
    <section class="ug-panel">Panel 3</section>
    <section class="ug-panel">Panel 4</section>
    <section class="ug-panel">Panel 5</section>
    <section class="ug-panel">Panel 6</section>
  </div>
</div>
```

## Formats

| Format | Series | Panels | Paper Size       |
|--------|--------|--------|------------------|
| A1     | Small  | 2      | 508 × 762 mm    |
| A2     | Small  | 3      | 508 × 762 mm    |
| A3     | Small  | 4      | 508 × 762 mm    |
| A4     | Small  | 6      | 508 × 762 mm    |
| B1     | Large  | 2      | 660 × 1016 mm   |
| B2     | Large  | 3      | 660 × 1016 mm   |
| B3     | Large  | 4      | 660 × 1016 mm   |
| B4     | Large  | 6      | 660 × 1016 mm   |
| B5     | Large  | 8      | 660 × 1016 mm   |
| B6     | Large  | 10     | 660 × 1016 mm   |

## CSS Classes

### Grid
- `.ug-grid` — 12-column grid container
- `.ug-col-{1-12}` — column span
- `.ug-col-{sm|md|lg|xl}-{1-12}` — responsive column span
- `.ug-col-start-{1-12}` — column start position
- `.ug-row-{1-10}` — row span
- `.ug-subgrid` — nested subgrid

### Formats & Broadside
- `.ug-format-{a1-a4|b1-b6}` — format container
- `.ug-broadside` — broadside (unfolded sheet) container
- `.ug-panel` — panel within a broadside
- `.ug-panel--dark` / `.ug-panel--gray` — panel variants
- `.ug-fold` — visual fold line

### Components
- `.ug-header` — black header band
- `.ug-infobox` — information callout box
- `.ug-map` — map container
- `.ug-divider` — horizontal divider

### Typography
- `.ug-h1` – `.ug-h4` — headings
- `.ug-body` — body text
- `.ug-lead` — intro text
- `.ug-caption` — caption text
- `.ug-label` — uppercase label

## Build

```bash
npm run build
```

## License

MIT
