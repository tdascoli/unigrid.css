import type { Meta, StoryObj } from '@storybook/angular';
import { FormInputComponent } from './form-input.component';

const meta: Meta<FormInputComponent> = {
  title: 'Components/FormInput',
  component: FormInputComponent,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'tel', 'number'],
      description: 'HTML input type. Also sets the mobile inputmode attribute.',
      table: { defaultValue: { summary: 'text' } },
    },
    label: {
      control: 'text',
      description: 'Floating label text displayed inside the input.',
    },
    value: {
      control: 'text',
      description: 'Current value of the input.',
    },
    placeholder: {
      control: 'text',
      description:
        'Placeholder text (defaults to label). Required by Bootstrap floating labels.',
    },
    state: {
      control: 'select',
      options: ['default', 'error', 'success'],
      description: 'Validation state — controls is-invalid / is-valid classes.',
      table: { defaultValue: { summary: 'default' } },
    },
    errorMessage: {
      control: 'text',
      description: 'Error text shown when state is "error".',
    },
    successMessage: {
      control: 'text',
      description: 'Success text shown when state is "success".',
    },
    hint: {
      control: 'text',
      description: 'Hint text below the input in default state.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input and sets aria-disabled.',
    },
    required: {
      control: 'boolean',
      description: 'Marks the input as required with a visual asterisk and aria-required.',
    },
    valueChange: { action: 'valueChange' },
    blurred: { action: 'blurred' },
  },
};

export default meta;
type Story = StoryObj<FormInputComponent>;

// ---------------------------------------------------------------------------
// Default
// ---------------------------------------------------------------------------
export const Default: Story = {
  args: {
    type: 'text',
    label: 'Full Name',
    value: '',
    state: 'default',
    disabled: false,
    required: false,
  },
};

// ---------------------------------------------------------------------------
// Input Types
// ---------------------------------------------------------------------------
export const Email: Story = {
  args: {
    type: 'email',
    label: 'Email Address',
    hint: 'We will never share your email.',
  },
};

export const Telephone: Story = {
  args: {
    type: 'tel',
    label: 'Phone Number',
    hint: 'Format: +41 79 123 45 67',
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    label: 'Quantity',
    value: '1',
  },
};

// ---------------------------------------------------------------------------
// Validation States
// ---------------------------------------------------------------------------
export const ErrorState: Story = {
  args: {
    type: 'email',
    label: 'Email Address',
    value: 'not-an-email',
    state: 'error',
    errorMessage: 'Please enter a valid email address.',
  },
};

export const SuccessState: Story = {
  args: {
    type: 'email',
    label: 'Email Address',
    value: 'jane@example.com',
    state: 'success',
    successMessage: 'Looks good!',
  },
};

// ---------------------------------------------------------------------------
// Disabled
// ---------------------------------------------------------------------------
export const Disabled: Story = {
  args: {
    type: 'text',
    label: 'Locked Field',
    value: 'Cannot edit',
    disabled: true,
  },
};

// ---------------------------------------------------------------------------
// Required
// ---------------------------------------------------------------------------
export const Required: Story = {
  args: {
    type: 'text',
    label: 'Username',
    required: true,
  },
};

export const RequiredWithError: Story = {
  args: {
    type: 'text',
    label: 'Your Name',
    required: true,
    state: 'error',
    errorMessage: 'This field is required.',
  },
};

// ---------------------------------------------------------------------------
// With Hint Text
// ---------------------------------------------------------------------------
export const WithHint: Story = {
  args: {
    type: 'tel',
    label: 'Phone Number',
    hint: 'Format: +41 79 123 45 67',
  },
};

// ---------------------------------------------------------------------------
// Keyboard / Accessibility
// ---------------------------------------------------------------------------
export const KeyboardNavigation: Story = {
  args: {
    type: 'text',
    label: 'Focus Demo',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Tab to focus the input. The focus ring uses outline (3px solid) which remains visible in Windows High Contrast Mode. All inputs meet 44x44px touch target minimum.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    input?.focus();
  },
};

// ---------------------------------------------------------------------------
// All Variants (visual comparison)
// ---------------------------------------------------------------------------
export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: grid; gap: var(--ug-spacing-3, 1.625rem); grid-template-columns: 1fr;">
        <ui-form-input
          type="text"
          label="Default Text"
          hint="Hint text appears here."
        ></ui-form-input>

        <ui-form-input
          type="email"
          label="Email (Error)"
          value="not-valid"
          state="error"
          errorMessage="Please enter a valid email address."
        ></ui-form-input>

        <ui-form-input
          type="email"
          label="Email (Success)"
          value="jane@example.com"
          state="success"
          successMessage="Looks good!"
        ></ui-form-input>

        <ui-form-input
          type="text"
          label="Required Field"
          [required]="true"
        ></ui-form-input>

        <ui-form-input
          type="text"
          label="Disabled Field"
          value="Read only"
          [disabled]="true"
        ></ui-form-input>

        <ui-form-input
          type="tel"
          label="Phone"
          hint="Format: +41 79 123 45 67"
        ></ui-form-input>

        <ui-form-input
          type="number"
          label="Quantity"
          value="1"
        ></ui-form-input>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Responsive — viewport stories
// ---------------------------------------------------------------------------
export const Mobile: Story = {
  args: { ...Default.args },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

export const Tablet: Story = {
  args: { ...Default.args },
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
};

export const Desktop: Story = {
  args: { ...Default.args },
  parameters: {
    viewport: { defaultViewport: 'responsive' },
  },
};
