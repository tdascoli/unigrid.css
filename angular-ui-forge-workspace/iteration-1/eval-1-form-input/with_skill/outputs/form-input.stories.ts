import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { FormInputComponent } from './form-input.component';

/**
 * # Form Input
 *
 * A reusable form input with floating label, inline validation,
 * and error/success states. Supports text, email, tel, and number types.
 *
 * ## Design System
 * - Vertical rhythm aligned to `--ug-leading`
 * - Mobile-first responsive sizing
 * - WCAG 2.2 AA compliant (contrast, focus, touch targets)
 *
 * ## Behavioral Economics Checklist
 * - [x] Progressive disclosure: floating label reduces visual noise
 * - [x] Default optimization: smart inputmode per type for mobile keyboards
 * - [x] Loss aversion: inline validation prevents errors before submission
 * - [x] Friction reduction: optional fields labelled "(optional)" instead of asterisks
 * - [x] Positive framing: success state provides reinforcement
 * - [x] Chunking: single-field component designed for grouping in form sections
 *
 * ## Accessibility
 * - `<label>` associated via `for`/`id`
 * - `aria-invalid` on error state
 * - `aria-describedby` links to feedback message
 * - `aria-required` for required fields
 * - `role="status"` with `aria-live` on feedback for screen reader announcements
 * - Focus ring: 3px solid, high contrast, visible on `:focus-visible`
 * - Touch target: minimum 44px height (56px default md)
 * - Error/success conveyed via text + icon (not color alone)
 */
const meta: Meta<FormInputComponent> = {
  title: 'Components/FormInput',
  component: FormInputComponent,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Floating label text (also used as accessible label)',
      table: { defaultValue: { summary: '' } },
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'tel', 'number'],
      description: 'HTML input type',
      table: { defaultValue: { summary: 'text' } },
    },
    value: {
      control: 'text',
      description: 'Current value of the input',
    },
    state: {
      control: 'select',
      options: ['default', 'error', 'success'],
      description: 'Validation state — controls visual appearance and ARIA attributes',
      table: { defaultValue: { summary: 'default' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant following the spacing scale',
      table: { defaultValue: { summary: 'md' } },
    },
    errorMessage: {
      control: 'text',
      description: 'Error message displayed when state is "error"',
    },
    successMessage: {
      control: 'text',
      description: 'Success message displayed when state is "success"',
    },
    hint: {
      control: 'text',
      description: 'Hint text displayed below the input in default state',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the field is disabled',
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the field is readonly',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text (visible when label is floated)',
    },
    valueChange: { action: 'valueChange' },
    blurred: { action: 'blurred' },
    focused: { action: 'focused' },
  },
  render: (args) => ({
    props: args,
    template: `<ui-form-input ${argsToTemplate(args)}></ui-form-input>`,
  }),
};

export default meta;
type Story = StoryObj<FormInputComponent>;

// ─── Default ──────────────────────────────────────────────────────────────
export const Default: Story = {
  args: {
    label: 'Full Name',
    type: 'text',
    state: 'default',
    size: 'md',
    required: true,
    hint: 'Enter your first and last name',
  },
};

// ─── Input Types ──────────────────────────────────────────────────────────
export const TextInput: Story = {
  args: {
    label: 'Username',
    type: 'text',
    required: true,
    placeholder: 'e.g. johndoe',
  },
};

export const EmailInput: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    required: true,
    placeholder: 'you@example.com',
    hint: 'We will never share your email',
  },
};

export const TelInput: Story = {
  args: {
    label: 'Phone Number',
    type: 'tel',
    placeholder: '+41 79 123 45 67',
  },
};

export const NumberInput: Story = {
  args: {
    label: 'Quantity',
    type: 'number',
    value: 1,
    min: 0,
    max: 100,
    step: 1,
    required: true,
  },
};

// ─── Validation States ────────────────────────────────────────────────────
export const ErrorState: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    value: 'invalid-email',
    state: 'error',
    errorMessage: 'Please enter a valid email address',
    required: true,
  },
};

export const SuccessState: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    value: 'user@example.com',
    state: 'success',
    successMessage: 'Looks good!',
    required: true,
  },
};

// ─── Disabled ─────────────────────────────────────────────────────────────
export const Disabled: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    value: 'locked@example.com',
    disabled: true,
  },
};

// ─── Size Variants ────────────────────────────────────────────────────────
export const Small: Story = {
  args: {
    label: 'Search',
    type: 'text',
    size: 'sm',
    placeholder: 'Search...',
  },
};

export const Large: Story = {
  args: {
    label: 'Company Name',
    type: 'text',
    size: 'lg',
    required: true,
  },
};

// ─── With Pre-filled Value ────────────────────────────────────────────────
export const PreFilled: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    value: 'prefilled@example.com',
    required: true,
  },
};

// ─── Optional Field ───────────────────────────────────────────────────────
export const OptionalField: Story = {
  args: {
    label: 'Middle Name',
    type: 'text',
    required: false,
    hint: 'This field is optional',
  },
};

// ─── Keyboard Navigation (Accessibility) ──────────────────────────────────
export const KeyboardNavigation: Story = {
  args: {
    label: 'Accessible Input',
    type: 'text',
    required: true,
    hint: 'Tab to focus, type to enter value. Focus ring must be visible.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Tab to focus the input. The focus ring (3px solid blue) should be clearly visible. ' +
          'Screen readers announce the label, required state, and any hint/error text via aria-describedby.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    input?.focus();
  },
};

// ─── All States Comparison ────────────────────────────────────────────────
export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display: grid; gap: var(--ug-spacing-5, 3rem); max-width: 480px;">
        <ui-form-input
          label="Default"
          type="text"
          hint="Hint text for guidance"
          [required]="true"
        ></ui-form-input>

        <ui-form-input
          label="With Value"
          type="text"
          value="John Doe"
          [required]="true"
        ></ui-form-input>

        <ui-form-input
          label="Error State"
          type="email"
          value="invalid"
          state="error"
          errorMessage="Please enter a valid email address"
          [required]="true"
        ></ui-form-input>

        <ui-form-input
          label="Success State"
          type="email"
          value="user@example.com"
          state="success"
          successMessage="Looks good!"
          [required]="true"
        ></ui-form-input>

        <ui-form-input
          label="Disabled"
          type="text"
          value="Cannot edit"
          [disabled]="true"
        ></ui-form-input>

        <ui-form-input
          label="Optional Field"
          type="text"
          hint="This field is optional"
        ></ui-form-input>
      </div>
    `,
  }),
};

// ─── All Input Types Comparison ───────────────────────────────────────────
export const AllInputTypes: Story = {
  render: () => ({
    template: `
      <div style="display: grid; gap: var(--ug-spacing-5, 3rem); max-width: 480px;">
        <ui-form-input
          label="Text Input"
          type="text"
          [required]="true"
          placeholder="Enter text..."
        ></ui-form-input>

        <ui-form-input
          label="Email Input"
          type="email"
          [required]="true"
          placeholder="you@example.com"
          hint="Smart keyboard on mobile"
        ></ui-form-input>

        <ui-form-input
          label="Phone Input"
          type="tel"
          placeholder="+41 79 123 45 67"
          hint="Numeric keyboard on mobile"
        ></ui-form-input>

        <ui-form-input
          label="Number Input"
          type="number"
          [value]="1"
          [min]="0"
          [max]="100"
          [step]="1"
          hint="Decimal keyboard on mobile"
          [required]="true"
        ></ui-form-input>
      </div>
    `,
  }),
};

// ─── Responsive (Mobile) ─────────────────────────────────────────────────
export const Mobile: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    required: true,
    hint: 'Viewed at mobile viewport width',
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

// ─── Responsive (Tablet) ─────────────────────────────────────────────────
export const Tablet: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    required: true,
    hint: 'Viewed at tablet viewport width',
  },
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
};

// ─── Responsive (Desktop) ────────────────────────────────────────────────
export const Desktop: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    required: true,
    hint: 'Viewed at desktop viewport width',
  },
  parameters: {
    viewport: { defaultViewport: 'responsive' },
  },
};

// ─── Form Context (Multiple Inputs) ──────────────────────────────────────
export const FormContext: Story = {
  render: () => ({
    template: `
      <div style="display: grid; gap: var(--ug-spacing-3, 1.625rem);">
        <h3 style="font-family: var(--ug-font-family, Inter, system-ui, sans-serif);
                    font-size: var(--ug-font-size-xl, 1.25rem);
                    margin: 0 0 var(--ug-spacing-2, 0.8125rem);">
          Contact Information
        </h3>

        <div style="display: grid; grid-template-columns: 1fr; gap: var(--ug-spacing-3, 1.625rem);">
          <ui-form-input
            label="Full Name"
            type="text"
            value="Jane Smith"
            state="success"
            successMessage="Looks good!"
            [required]="true"
          ></ui-form-input>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--ug-spacing-3, 1.625rem);">
          <ui-form-input
            label="Email"
            type="email"
            value="invalid"
            state="error"
            errorMessage="Please enter a valid email"
            [required]="true"
          ></ui-form-input>

          <ui-form-input
            label="Phone"
            type="tel"
            placeholder="+41 79 123 45 67"
          ></ui-form-input>
        </div>

        <div style="display: grid; grid-template-columns: 1fr; gap: var(--ug-spacing-3, 1.625rem);">
          <ui-form-input
            label="Company"
            type="text"
            hint="Where do you work?"
          ></ui-form-input>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Multiple form inputs in a realistic form layout. ' +
          'Demonstrates grid-based layout, mixed validation states, and chunking pattern ' +
          '(related fields grouped together with 3-5 items per group).',
      },
    },
  },
};
