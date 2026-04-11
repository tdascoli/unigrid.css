import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegistrationFormComponent } from './registration-form.component';

const meta: Meta<RegistrationFormComponent> = {
  title: 'Forms/RegistrationForm',
  component: RegistrationFormComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, ReactiveFormsModule],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
A multi-step registration form with 3 steps:
1. **Personal Info** - Name, email, and phone
2. **Address** - Street, city, postal code, and country (auto-detected from browser locale)
3. **Review & Submit** - Summary of all entered data with edit links

Features:
- Progressive disclosure (one step at a time)
- Smart country default from browser locale
- Full viewport width on all screen sizes
- Form validation with inline error messages
- Accessible keyboard navigation
- Smooth step transitions with reduced-motion support
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<RegistrationFormComponent>;

/**
 * The default state shows the form starting at Step 1 (Personal Info).
 * The form uses full viewport width and adapts to all screen sizes.
 */
export const Default: Story = {};

/**
 * The form displayed on a mobile viewport (375px wide).
 * Step indicators show only numbers without labels.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * The form displayed on a tablet viewport (768px wide).
 */
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

/**
 * Demonstrates the form with pre-filled personal info data.
 * Navigate to Step 2 by clicking "Continue".
 */
export const WithPrefilledData: Story = {
  play: async ({ canvasElement }) => {
    // Wait for the component to render
    await new Promise((resolve) => setTimeout(resolve, 100));

    const firstNameInput = canvasElement.querySelector<HTMLInputElement>('#firstName');
    const lastNameInput = canvasElement.querySelector<HTMLInputElement>('#lastName');
    const emailInput = canvasElement.querySelector<HTMLInputElement>('#email');
    const phoneInput = canvasElement.querySelector<HTMLInputElement>('#phone');

    if (firstNameInput) {
      setNativeValue(firstNameInput, 'Jane');
      firstNameInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (lastNameInput) {
      setNativeValue(lastNameInput, 'Smith');
      lastNameInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (emailInput) {
      setNativeValue(emailInput, 'jane.smith@example.com');
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (phoneInput) {
      setNativeValue(phoneInput, '+1 (555) 987-6543');
      phoneInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  },
};

/**
 * Helper to set native input values for Angular reactive forms.
 */
function setNativeValue(element: HTMLInputElement, value: string): void {
  const valueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
  )?.set;
  if (valueSetter) {
    valueSetter.call(element, value);
  }
}
