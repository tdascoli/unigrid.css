import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { FormInputComponent } from './form-input.component';

const meta: Meta<FormInputComponent> = {
  title: 'Components/FormInput',
  component: FormInputComponent,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'tel', 'number'],
      description: 'HTML input type',
      table: { defaultValue: { summary: 'text' } },
    },
    label: {
      control: 'text',
      description: 'Floating label text',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown when input is empty and unfocused',
    },
    state: {
      control: 'select',
      options: ['default', 'error', 'success'],
      description: 'Validation state controlling visual feedback',
      table: { defaultValue: { summary: 'default' } },
    },
    errorMessage: {
      control: 'text',
      description: 'Error message shown in error state',
    },
    successMessage: {
      control: 'text',
      description: 'Success message shown in success state',
    },
    helpText: {
      control: 'text',
      description: 'Help text displayed below the input',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
      table: { defaultValue: { summary: 'false' } },
    },
    required: {
      control: 'boolean',
      description: 'Whether the input is required',
      table: { defaultValue: { summary: 'false' } },
    },
    min: {
      control: 'number',
      description: 'Minimum value (number type only)',
      if: { arg: 'type', eq: 'number' },
    },
    max: {
      control: 'number',
      description: 'Maximum value (number type only)',
      if: { arg: 'type', eq: 'number' },
    },
    step: {
      control: 'number',
      description: 'Step value (number type only)',
      if: { arg: 'type', eq: 'number' },
    },
    blurred: { action: 'blurred' },
    focused: { action: 'focused' },
    valueChange: { action: 'valueChange' },
  },
  render: (args) => ({
    props: args,
    template: `<ui-form-input ${argsToTemplate(args)}></ui-form-input>`,
  }),
};

export default meta;
type Story = StoryObj<FormInputComponent>;

// ---- Default ----
export const Default: Story = {
  args: {
    type: 'text',
    label: 'Full Name',
    state: 'default',
    disabled: false,
    required: false,
    helpText: 'Enter your full legal name',
  },
};

// ---- Input Types ----
export const Email: Story = {
  args: {
    type: 'email',
    label: 'Email Address',
    helpText: 'We will never share your email',
  },
};

export const Telephone: Story = {
  args: {
    type: 'tel',
    label: 'Phone Number',
    helpText: 'Include country code',
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    label: 'Quantity',
    min: 1,
    max: 99,
    step: 1,
    helpText: 'Enter a quantity between 1 and 99',
  },
};

// ---- Validation States ----
export const ErrorState: Story = {
  args: {
    type: 'email',
    label: 'Email Address',
    state: 'error',
    errorMessage: 'Please enter a valid email address',
  },
  render: (args) => ({
    props: { ...args, value: 'invalid-email' },
    template: `
      <ui-form-input
        ${argsToTemplate(args)}
      ></ui-form-input>
    `,
  }),
};

export const SuccessState: Story = {
  args: {
    type: 'email',
    label: 'Email Address',
    state: 'success',
    successMessage: 'Email address is available',
  },
  render: (args) => ({
    props: { ...args, value: 'user@example.com' },
    template: `
      <ui-form-input
        ${argsToTemplate(args)}
      ></ui-form-input>
    `,
  }),
};

// ---- States ----
export const Required: Story = {
  args: {
    type: 'text',
    label: 'Username',
    required: true,
    helpText: 'This field is required',
  },
};

export const Disabled: Story = {
  args: {
    type: 'text',
    label: 'Disabled Field',
    disabled: true,
  },
  render: (args) => ({
    props: { ...args, value: 'Cannot edit this' },
    template: `
      <ui-form-input
        ${argsToTemplate(args)}
      ></ui-form-input>
    `,
  }),
};

// ---- Accessibility: Keyboard Navigation ----
export const KeyboardNavigation: Story = {
  args: {
    type: 'text',
    label: 'Keyboard Test',
    helpText: 'Tab to focus, type to fill, Tab away to blur',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Tab to focus the input. The floating label should animate up. ' +
          'Type a value — the label stays floated. Tab away — onTouched fires. ' +
          'Focus ring must be visible and high-contrast.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    input?.focus();
  },
};

// ---- All Variants for Visual Comparison ----
export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display: grid; gap: var(--ug-spacing-3, 1.625rem); max-width: 400px;">
        <ui-form-input
          type="text"
          label="Default"
          helpText="Help text goes here"
        ></ui-form-input>

        <ui-form-input
          type="email"
          label="Error State"
          state="error"
          errorMessage="Please enter a valid email"
        ></ui-form-input>

        <ui-form-input
          type="text"
          label="Success State"
          state="success"
          successMessage="Looks great!"
        ></ui-form-input>

        <ui-form-input
          type="text"
          label="Required Field"
          [required]="true"
          helpText="This field is required"
        ></ui-form-input>

        <ui-form-input
          type="text"
          label="Disabled Field"
          [disabled]="true"
        ></ui-form-input>
      </div>
    `,
  }),
};

export const AllTypes: Story = {
  render: () => ({
    template: `
      <div style="display: grid; gap: var(--ug-spacing-3, 1.625rem); max-width: 400px;">
        <ui-form-input type="text" label="Text Input"></ui-form-input>
        <ui-form-input type="email" label="Email Input"></ui-form-input>
        <ui-form-input type="tel" label="Telephone Input"></ui-form-input>
        <ui-form-input type="number" label="Number Input" [min]="0" [max]="100" [step]="1"></ui-form-input>
      </div>
    `,
  }),
};
