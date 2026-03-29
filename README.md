# Unigrid.css

A CSS grid framework inspired by [Massimo Vignelli's Unigrid system](https://en.wikipedia.org/wiki/Unigrids) for the National Park Service.

Built with **SCSS**, native **CSS Grid**, and **BEM** naming — no dependencies.

## Concept

The Unigrid is a standardized graphic and production system developed for NPS site folders:

- **12-column base grid** with responsive breakpoints
- **10 basic formats** — A-series (1 panel wide: A1–A4, A6) and B-series (2 panels wide: B1–B4, B6)
- **Broadside approach** — layouts as flat sheets divided into foldable panels
- **DIN proportions** (1:√2) — panel unit: 99 × 210 mm, folded size always constant
- **Helvetica typography** with strict hierarchy
- **Signature black header band**

## Quick Start

```html
<link rel="stylesheet" href="dist/unigrid.css">

<header class="ug-header">
  <div class="ug-header__title">
    <h1>Park Name</h1>
    <p class="ug-header__subtitle">National Park / State</p>
  </div>
</header>

<div class="ug-grid">
  <div class="ug-col--4">One third</div>
  <div class="ug-col--8">Two thirds</div>
</div>

<div class="ug-format ug-format--a4">
  <div class="ug-broadside ug-broadside--stack">
    <section class="ug-panel">Panel 1</section>
    <section class="ug-panel">Panel 2</section>
    <section class="ug-panel">Panel 3</section>
    <section class="ug-panel">Panel 4</section>
  </div>
</div>
```

## Formats

| Format | Wide × Long | Panel Size | Description |
|--------|-------------|------------|-------------|
| A1 | 1 × 1 | 99 × 210 mm | Single panel |
| A2 | 1 × 2 | 198 × 210 mm | Letter-fold |
| A3 | 1 × 3 | 297 × 210 mm | Tri-fold |
| A4 | 1 × 4 | 396 × 210 mm | Most common NPS format |
| A6 | 1 × 6 | 594 × 210 mm | Extended folder |
| B1 | 2 × 1 | 99 × 420 mm | Double-height single |
| B2 | 2 × 2 | 198 × 420 mm | Double-height bifold |
| B3 | 2 × 3 | 297 × 420 mm | Double-height trifold |
| B4 | 2 × 4 | 396 × 420 mm | Double-height quad |
| B6 | 2 × 6 | 594 × 420 mm | DIN A2 — largest format |

## Development

```bash
npm install
npm run dev        # Start Vite dev server with hot reload
npm run build      # Build dist/unigrid.css + dist/unigrid.min.css
```

The dev server provides pages for testing each component:
- **Overview** — color palette, quick demo
- **Grid** — column spans, responsive, alignment
- **Formats** — all 10 formats with broadside examples
- **Typography** — headings, body, captions, labels
- **Components** — header, infobox, map, divider, panels
- **Cheatsheet** — all CSS classes at a glance

## SCSS Customization

Override variables before importing:

```scss
$ug-font-family: "Frutiger", sans-serif;
$ug-black: #222;
$ug-gap: 1rem;
@import "unigrid";
```

Key variables: `$ug-columns`, `$ug-gap`, `$ug-breakpoints`, `$ug-colors`, `$ug-font-sizes`, `$ug-formats`.

## BEM Naming

All classes follow BEM (Block__Element--Modifier):

```
.ug-header              → Block
.ug-header__logo        → Element
.ug-header--compact     → Modifier
```

## License

MIT
