---
name: angular-ui-forge
description: >
  Build Angular UI components in Nx monorepos with Smart/Dumb pattern, unigrid.css vertical rhythm,
  Storybook stories, WCAG 2.2 AA accessibility, and Behavioral Economics UX. Supports Bootstrap
  and Tailwind auto-detection. Use whenever creating Angular components (buttons, inputs, tables,
  modals, forms, navigation, date pickers, steppers, cards), building UI libraries, setting up
  Storybook in Nx, improving form UX or completion rates, implementing design tokens, making
  components accessible (ARIA, focus, contrast, touch targets), or generating component scaffolds.
  Even "add a button" or "create a settings page" in Angular/Nx triggers this. NOT for: backend
  APIs, CI/CD, React/Vue, SSR, bundle optimization, or Angular migrations without UI components.
---

# Angular UI Forge

A skill for building Angular UI components and libraries in Nx monorepos. Every component follows
the Smart/Dumb pattern, ships with Storybook stories, respects vertical rhythm, and is accessible
by default. The output is modern, configurable, aesthetic, and unforgettable.

## Philosophy

Three systems work together to produce consistent, beautiful interfaces:

1. **Vertical Rhythm (Gutenberg)** — Every element's height, margin, padding, and line-height
   snaps to multiples of the leading unit (`--ug-leading`). This creates the invisible baseline
   grid that makes typography feel "right." The leading adapts responsively: ~26px on mobile,
   ~31px on desktop.

2. **Proportional Grid (Golden Grid / Unigrid)** — A 12-column CSS Grid where columns subdivide
   harmonically (halves, thirds, quarters). DIN proportions (1:√2) govern format relationships.
   The grid gap itself is rhythm-aware.

3. **Behavioral Economics** — UI decisions are informed by cognitive biases: progressive disclosure
   reduces overwhelm, smart defaults reduce friction, loss-aversion framing prevents errors, and
   anchoring guides choices. Complex forms become simple through chunking and sequencing.

These aren't decorative add-ons — they're structural. When vertical rhythm is broken, the page
feels "off" even if nobody can articulate why. When cognitive load isn't managed, users abandon
forms. The skill enforces these systematically so you don't have to think about them per-component.

---

## Workflow

### Step 0: Detect Project Context

Before generating anything, understand the project:

1. **Check for Nx workspace** — look for `nx.json`, `project.json`, or `workspace.json`
2. **Detect CSS framework** — scan `package.json` for `bootstrap`, `tailwindcss`, or `unigrid.css`
3. **Find existing libraries** — run `nx show projects` or check `libs/` structure
4. **Check for Storybook** — look for `.storybook/` directories
5. **Read existing design tokens** — find `_variables.scss`, `tailwind.config`, or `styles.scss`

If the project uses **unigrid.css**: import its tokens directly. The spacing scale, typography,
colors, and grid are already rhythm-aligned.

If **Bootstrap**: use Bootstrap's component classes in templates. This is important — when Bootstrap
is detected, the generated HTML templates should use Bootstrap class names like `form-floating`,
`form-control`, `form-select`, `btn`, `card`, `container`, `row`, `col-*`, etc. These classes
are what Bootstrap users expect and they integrate with Bootstrap's JavaScript components.
Additionally, check for the `unigrid-bootstrap` theme (maps unigrid tokens to Bootstrap variables).
If not present, create a token bridge. The component SCSS should layer rhythm-aligned overrides
*on top* of Bootstrap's classes, not replace them with custom BEM classes.

Example for a Bootstrap-detected project:
```html
<!-- Template uses Bootstrap classes -->
<div class="form-floating">
  <input class="form-control" [class.is-invalid]="hasError" [class.is-valid]="isSuccess" />
  <label>{{ label }}</label>
  <div class="invalid-feedback" *ngIf="hasError">{{ errorMessage }}</div>
</div>
```
```scss
// SCSS overrides Bootstrap defaults with rhythm-aligned values
.form-floating {
  margin-bottom: var(--ug-spacing-3);

  .form-control {
    min-height: 44px;
    line-height: var(--ug-leading);
    &:focus-visible {
      outline: 3px solid var(--ui-focus-color, #1a73e8);
      outline-offset: 2px;
    }
  }
}
```

If **Tailwind**: extend the Tailwind config with rhythm-based spacing and unigrid color palette.

If **none detected**: ask the user which framework to use, or generate framework-agnostic SCSS
with CSS custom properties.

Read `references/framework-adapters.md` for detailed adapter generation per framework.

### Step 1: Determine What to Build

Ask the user (or infer from context) what they need:

- **Single component** — e.g., "create a date picker"
- **Component family** — e.g., "build form controls" (input, select, checkbox, radio, textarea)
- **Full UI library** — scaffold the Nx library, Storybook config, and base components
- **Page layout** — smart container + dumb presentation components for a specific view

For component families, identify all members upfront. Design tokens and patterns must be
consistent across the family — a checkbox should feel like it belongs with the radio button.

### Step 2: Design Before Code

Before writing any component code, make design decisions:

1. **Visual identity** — What mood? (clean/minimal, bold/expressive, warm/organic, sharp/technical)
2. **Color usage** — Map semantic colors (primary, success, danger, warning, info) to the palette
3. **Spacing rhythm** — Confirm the leading unit and spacing scale
4. **Border radius** — 0 (sharp, unigrid default), small (4px), medium (8px), or pill
5. **Typography** — Font stack, size scale, weight usage
6. **Motion** — Transition timing, easing curves, reduced-motion respect

Write these decisions as SCSS variables / CSS custom properties in a shared tokens file.
Every component in the family references this single source of truth.

Read `references/design-system.md` for the full design token structure and how each token
connects to Gutenberg rhythm and accessibility requirements.

### Step 3: Generate Components (Smart/Dumb Pattern)

Every UI element splits into two Angular components:

**Dumb Component (Presentational)**
- Lives in the UI library (`libs/ui/` or `libs/<domain>/ui/`)
- Has **separate files**: `*.component.ts`, `*.component.html`, `*.component.scss`
- **Never** uses `template:` or `styles:` inline — always `templateUrl` and `styleUrls`/`styleUrl`
- Receives data via `@Input()` (use signal inputs where Angular 17+)
- Emits events via `@Output()` (or output signals)
- Has **zero** injected services — no `HttpClient`, no `Store`, no `Router`
- Is fully controlled by its inputs — same inputs always produce same output
- Uses `ChangeDetectionStrategy.OnPush`
- Exported from the library's public API

**Smart Component (Container)**
- Lives in the feature library (`libs/<domain>/feature/`)
- Orchestrates data flow: fetches from services, manages state, handles routing
- Passes data down to dumb components via property bindings
- Handles events bubbled up from dumb components
- May use inline template if it's just glue code (`<app-user-list [users]="users$ | async">`)

Read `references/angular-patterns.md` for detailed file templates, naming conventions,
and the full scaffold structure.

### Step 4: Write Accessible, Rhythm-Aligned SCSS

Every `.component.scss` file follows these rules:

**Mobile-First Responsive Design**
```scss
// Base styles = mobile
.component {
  padding: var(--ug-spacing-2);  // 0.5× leading

  @media (min-width: 768px) {
    padding: var(--ug-spacing-3);  // 1× leading
  }
}
```

**Vertical Rhythm Compliance**
- All margins and paddings use the spacing scale (multiples of leading)
- Line-heights snap to leading or half-leading
- Component total height should be a multiple of the leading unit
- Use `references/design-system.md` for the rhythm calculator approach

**Accessibility in CSS — Non-Negotiable Rules**

Focus indicators use `outline`, never `box-shadow` alone. The reason: `box-shadow` is invisible
in Windows High Contrast Mode, leaving keyboard users unable to see where they are. Always:
```scss
&:focus-visible {
  outline: 3px solid var(--ui-focus-color, #1a73e8);
  outline-offset: 2px;
}
```
Never replace this with `box-shadow` or border-color changes. You may *add* a box-shadow
alongside the outline for aesthetic polish, but the outline must be the primary indicator.

Touch targets: **every** interactive element must be at least 44×44px. This includes:
- Buttons (including small icon buttons) — use `min-height: 44px; min-width: 44px`
- Pagination links/buttons — these are commonly undersized; always set min dimensions
- Checkboxes and radio buttons — if the native input is smaller, wrap with a label and add
  `padding` so the clickable area reaches 44×44px, or use `min-height/min-width` on the wrapper
- Sort headers in tables — use `min-height: 44px` on the `<button>` inside the `<th>`
- Dropdown toggles, tab buttons, accordion headers — all 44px minimum

Color contrast: 4.5:1 for normal text, 3:1 for large text (WCAG 2.2 AA). Document contrast
ratios as SCSS comments next to color assignments.

Reduced motion: wrap animations in `@media (prefers-reduced-motion: no-preference)`.

High contrast mode: test with `@media (forced-colors: active)`. Because outlines are preserved
in forced-colors mode but box-shadows are not, the outline-based focus approach above
automatically works in high contrast.

**Viewport Utilization**
- Forms and data-dense UIs should use the full available width, not narrow centered columns
- Use the 12-column grid to fill the viewport meaningfully
- On mobile, stack to single column; on tablet, use 2-column; on desktop, use the grid fully
- Modal and overlay content should be sized relative to the viewport, not fixed pixels

Read `references/design-system.md` for the complete SCSS patterns, contrast checking approach,
and rhythm utilities.

### Step 5: Generate Storybook Stories

Every dumb component gets a `.stories.ts` file:

- **Default story** — component with typical props
- **All variants** — one story per visual variant (sizes, colors, states)
- **Accessibility story** — demonstrates keyboard navigation, screen reader behavior
- **Responsive story** — shows component at mobile/tablet/desktop viewports
- **Interactive story** — demonstrates user interactions (hover, focus, click sequences)

Use the **storybook-addon MCP server** to verify stories render correctly.
Use the **shadcn MCP server** when adapting shadcn component patterns.

Read `references/storybook-guide.md` for story templates, addon configuration,
and MCP verification workflow.

### Step 6: Apply Behavioral Economics

After the component works, audit it through a behavioral lens:

- **Progressive Disclosure** — Is all information shown at once? Can we reveal complexity
  gradually? (e.g., "Advanced options" accordion, stepped wizards instead of mega-forms)
- **Default Optimization** — Are smart defaults pre-filled? Is the most common choice
  pre-selected? (Reduces decision fatigue)
- **Loss Aversion** — Do destructive actions feel appropriately weighty? (Red color, confirmation
  dialogs, undo options instead of immediate deletion)
- **Anchoring** — In pricing/comparison UIs, is the recommended option visually anchored?
- **Chunking** — Are long forms broken into digestible groups? (3-5 fields per group)
- **Social Proof** — Where applicable, show what others chose ("Most popular")
- **Friction Reduction** — Minimize required fields, use autocomplete, inline validation

Read `references/behavioral-economics.md` for the full pattern library with examples.

### Step 7: Verify with MCP Servers

If the shadcn MCP server is available:
- Use it to reference shadcn/ui component APIs and patterns
- Adapt patterns to Angular (shadcn is React-native, so translate the concepts)
- Ensure generated components match shadcn quality standards

If the storybook-addon MCP server is available:
- Verify rendered stories match expected visual output
- Check accessibility audit results from the a11y addon
- Validate responsive behavior across viewport sizes

### Step 8: Review Consistency

Before finishing, verify cross-component consistency:

1. **Spacing** — Do all components in the family use the same spacing scale?
2. **Typography** — Are font sizes, weights, and line-heights from the shared scale?
3. **Colors** — Are semantic colors used consistently (not random hex values)?
4. **Border radius** — Same radius across all components in the family?
5. **Transitions** — Same timing and easing for similar interactions?
6. **Focus styles** — Identical focus ring treatment everywhere?
7. **Vertical rhythm** — Open the baseline grid overlay and verify alignment

---

## Output Configuration

The skill adapts its output based on what the user asks for:

| User says | Output |
|-----------|--------|
| "create a button" | Single dumb component + story |
| "build form controls" | Component family with shared tokens |
| "set up the UI library" | Full Nx lib scaffold + Storybook + tokens + base components |
| "design this page" | Smart container + dumb components + layout + stories |
| "add a feature" | Smart + dumb components in appropriate libs |

Always generate **separate files** (never inline templates/styles).
Always generate **Storybook stories** alongside components.
Always use **mobile-first** responsive styles.
Always check **accessibility** requirements.
Always generate an **HTML mockup** — a standalone `.html` file with embedded CSS (and minimal JS
for interactions) that demonstrates the component in all visual states. This is a first-priority
deliverable, not an afterthought. Generate it early in the process so it exists even if subsequent
work is interrupted. The mockup lets designers and stakeholders review the visual design without
running Angular or Storybook.

---

## File Naming Conventions

```
libs/ui/src/lib/
  button/
    button.component.ts        # Component class
    button.component.html      # Template (NEVER inline)
    button.component.scss      # Styles (NEVER inline)
    button.component.spec.ts   # Unit tests
    button.stories.ts          # Storybook stories
    button.model.ts            # Interfaces/types (if needed)
    index.ts                   # Barrel export

libs/<domain>/feature/src/lib/
  user-dashboard/
    user-dashboard.component.ts
    user-dashboard.component.html
    user-dashboard.component.scss
    user-dashboard.component.spec.ts
```

---

## Reference Files

These contain detailed guidance for each domain. Read them as needed:

- **`references/angular-patterns.md`** — Component scaffolding templates, Nx library setup,
  barrel exports, signal-based patterns, dependency injection rules
- **`references/design-system.md`** — Unigrid.css token integration, vertical rhythm calculator,
  color contrast in CSS, responsive breakpoints, grid composition, viewport utilization
- **`references/behavioral-economics.md`** — Full pattern library: progressive disclosure,
  defaults, loss aversion, anchoring, chunking, social proof, friction reduction — with
  Angular component examples for each
- **`references/storybook-guide.md`** — Story file templates, Storybook configuration for Nx,
  addon setup (a11y, viewport, controls), MCP server verification workflow
- **`references/framework-adapters.md`** — Bootstrap token bridge, Tailwind config extension,
  framework detection logic, CSS custom property generation
