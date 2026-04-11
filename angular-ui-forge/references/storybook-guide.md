# Storybook Guide for Angular UI Libraries

## Table of Contents
1. [Storybook Setup in Nx](#storybook-setup-in-nx)
2. [Story File Template](#story-file-template)
3. [Story Categories](#story-categories)
4. [Decorators & Providers](#decorators--providers)
5. [Accessibility Testing](#accessibility-testing)
6. [Responsive Stories](#responsive-stories)
7. [MCP Server Verification](#mcp-server-verification)
8. [Documentation with MDX](#documentation-with-mdx)

---

## Storybook Setup in Nx

### Initial configuration

```bash
# Add Storybook to the UI library
nx generate @nx/storybook:configuration ui \
  --uiFramework=@storybook/angular \
  --configureCypress=false

# Verify it works
nx run ui:storybook
```

### .storybook/main.ts

```typescript
import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../src/lib/**/*.stories.@(ts|mdx)'],
  addons: [
    '@storybook/addon-essentials',    // Controls, actions, viewport, backgrounds
    '@storybook/addon-a11y',          // Accessibility audit panel
    '@storybook/addon-interactions',  // Play function testing
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
};

export default config;
```

### .storybook/preview.ts

```typescript
import type { Preview } from '@storybook/angular';

// Import the design system styles
import 'unigrid.css/dist/unigrid.css';
// Or if using SCSS:
// import '../src/styles/tokens.scss';

const preview: Preview = {
  parameters: {
    // Mobile-first: default viewport is mobile
    viewport: {
      defaultViewport: 'mobile1',
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'warm-gray', value: '#f5f2ed' },
        { name: 'dark', value: '#1a1a1a' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
```

---

## Story File Template

Every dumb component gets a `.stories.ts` file next to its component file.

```typescript
import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  title: 'Components/Button',
  component: ButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
      description: 'Visual variant of the button',
      table: { defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size following the spacing scale',
      table: { defaultValue: { summary: 'md' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button and sets aria-disabled',
    },
    clicked: { action: 'clicked' },
  },
  render: (args) => ({
    props: args,
    template: `<ui-button ${argsToTemplate(args)}>Click me</ui-button>`,
  }),
};

export default meta;
type Story = StoryObj<ButtonComponent>;

// Default story — the component in its most common state
export const Default: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
};

// Variant stories — one per visual variant
export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Ghost: Story = {
  args: { variant: 'ghost' },
};

export const Danger: Story = {
  args: { variant: 'danger' },
};

// Size stories
export const Small: Story = {
  args: { size: 'sm' },
};

export const Large: Story = {
  args: { size: 'lg' },
};

// State stories
export const Disabled: Story = {
  args: { disabled: true },
};

// Accessibility story — demonstrates keyboard navigation
export const KeyboardNavigation: Story = {
  args: { variant: 'primary' },
  parameters: {
    docs: {
      description: {
        story: 'Tab to focus, Enter/Space to activate. Focus ring must be visible.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    button?.focus();
  },
};

// All variants together for visual comparison
export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: var(--ug-spacing-3); flex-wrap: wrap; align-items: center;">
        <ui-button variant="primary">Primary</ui-button>
        <ui-button variant="secondary">Secondary</ui-button>
        <ui-button variant="ghost">Ghost</ui-button>
        <ui-button variant="danger">Danger</ui-button>
        <ui-button variant="primary" disabled>Disabled</ui-button>
      </div>
    `,
  }),
};
```

---

## Story Categories

Organize stories in a consistent hierarchy:

```
Components/
  Button
  Input
  Select
  Checkbox
  Card
  Badge
  ...

Forms/
  FormGroup
  Stepper
  InlineValidation
  ...

Layout/
  Grid
  Sidebar
  Dashboard
  ...

Patterns/
  ProgressiveDisclosure
  ConfirmationDialog
  SearchFilter
  ...

Pages/  (smart component compositions)
  UserDashboard
  SettingsPage
  ...
```

### Required stories per component

| Story | Purpose |
|-------|---------|
| **Default** | Component in its most common configuration |
| **Variants** | One story per visual variant (color, size, shape) |
| **States** | Disabled, loading, error, empty, success |
| **Keyboard** | Demonstrates focus behavior and keyboard interaction |
| **Responsive** | Shows component at different viewport widths |
| **AllVariants** | Visual comparison of all variants side by side |

---

## Decorators & Providers

### Vertical Rhythm Overlay Decorator

Add this to preview.ts to optionally show the baseline grid:

```typescript
import { componentWrapperDecorator } from '@storybook/angular';

const withRhythmGrid = componentWrapperDecorator(
  (story) => `
    <div class="story-rhythm-wrapper" style="position: relative;">
      ${story}
      <div class="rhythm-overlay" style="
        position: absolute; inset: 0; pointer-events: none; z-index: 9999;
        background-image: linear-gradient(
          to bottom,
          rgba(200, 0, 0, 0.1) 0px,
          rgba(200, 0, 0, 0.1) 1px,
          transparent 1px
        );
        background-size: 100% var(--ug-leading);
      "></div>
    </div>
  `
);
```

### Theme Provider Decorator

For components that need Angular services or theming:

```typescript
import { applicationConfig, moduleMetadata } from '@storybook/angular';

const withTheme = applicationConfig({
  providers: [
    // Add any required providers here
  ],
});

const withImports = moduleMetadata({
  imports: [
    CommonModule,
    // Shared modules the component needs
  ],
});
```

---

## Accessibility Testing

### Storybook a11y addon

The a11y addon runs axe-core on every story automatically. It checks:
- Color contrast ratios
- ARIA attribute validity
- Keyboard accessibility
- Focus management
- Label associations

### Writing accessible stories

```typescript
export const AccessibleForm: Story = {
  render: () => ({
    template: `
      <!-- Every input has a label -->
      <ui-input label="Email" type="email" id="email-input">
        <span slot="help">We'll never share your email</span>
      </ui-input>

      <!-- Error states include aria-invalid and aria-describedby -->
      <ui-input
        label="Password"
        type="password"
        [hasError]="true"
        errorMessage="Password must be at least 8 characters"
      ></ui-input>
    `,
  }),
  parameters: {
    a11y: {
      // Override specific rules if needed (document why)
      config: {
        rules: [
          // { id: 'color-contrast', enabled: false }, // NEVER disable contrast
        ],
      },
    },
  },
};
```

### Manual accessibility checks

Include in story documentation:
1. **Tab order** — Can you reach all interactive elements with Tab?
2. **Screen reader** — Does the component announce its role and state?
3. **Zoom** — Does the component work at 200% zoom?
4. **Keyboard** — Can all mouse interactions be done with keyboard?
5. **Color** — Remove color — is information still conveyed?

---

## Responsive Stories

### Viewport parameters

```typescript
export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

export const Tablet: Story = {
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
};

export const Desktop: Story = {
  parameters: {
    viewport: { defaultViewport: 'responsive' },
  },
};
```

### Custom viewport presets

In preview.ts:
```typescript
parameters: {
  viewport: {
    viewports: {
      mobile: { name: 'Mobile', styles: { width: '375px', height: '812px' } },
      tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
      desktop: { name: 'Desktop', styles: { width: '1280px', height: '800px' } },
      wide: { name: 'Wide', styles: { width: '1440px', height: '900px' } },
    },
  },
},
```

---

## MCP Server Verification

### Storybook Addon MCP Server

When the storybook-addon MCP server is available, use it to:

1. **Verify story rendering** — Check that stories render without errors
2. **Run accessibility audits** — Get a11y violation reports for each story
3. **Capture screenshots** — Visual regression baseline per viewport
4. **Check interaction tests** — Verify play functions complete successfully

Workflow:
```
1. Generate component + story files
2. Start Storybook (nx run ui:storybook)
3. Use storybook MCP to navigate to the story
4. Verify: no console errors, a11y panel is green, component renders correctly
5. Check responsive viewports: mobile, tablet, desktop
6. If issues found → fix component → re-verify
```

### Shadcn MCP Server

When the shadcn MCP server is available, use it to:

1. **Reference component APIs** — Look up shadcn/ui component props and patterns
2. **Translate React patterns to Angular** — shadcn is React-based; translate the
   component structure, prop naming, and composition patterns to Angular equivalents
3. **Match quality standards** — Ensure generated components match shadcn's level of:
   - Keyboard navigation coverage
   - ARIA attribute completeness
   - Variant system design
   - Composition flexibility

Translation mapping:
| shadcn (React) | Angular equivalent |
|----------------|-------------------|
| `React.forwardRef` | `@ViewChild` / element ref |
| `className` prop | `@HostBinding('class')` |
| `children` | `<ng-content>` |
| `variants` via cva | `@Input() variant` with host class binding |
| `asChild` | `<ng-content select="...">` or directive |
| `useState` | Signal or `@Input`/`@Output` |
| Slot pattern | Named `<ng-content>` with `select` |

---

## Documentation with MDX

For complex components, add an MDX documentation page:

```mdx
{/* button.mdx */}
import { Meta, Story, Canvas, ArgsTable } from '@storybook/blocks';
import * as ButtonStories from './button.stories';

<Meta of={ButtonStories} />

# Button

Buttons trigger actions. They follow the unigrid design system's spacing scale
and meet WCAG 2.2 AA for contrast, focus indicators, and touch targets.

## Behavioral Economics Notes

- **Default variant**: Primary (most common action gets the strongest visual weight)
- **Danger variant**: Red + confirmation dialog for destructive actions (loss aversion)
- **Touch target**: Minimum 44×44px even on the small variant (friction reduction)

## Usage

<Canvas of={ButtonStories.Default} />

## Variants

<Canvas of={ButtonStories.AllVariants} />

## Props

<ArgsTable of={ButtonStories} />

## Accessibility

- `role="button"` implicit from `<button>` element
- `aria-disabled` set when disabled (preserves focusability)
- Focus ring: 3px solid, high contrast, always visible on `:focus-visible`
- Keyboard: Enter or Space activates
```
