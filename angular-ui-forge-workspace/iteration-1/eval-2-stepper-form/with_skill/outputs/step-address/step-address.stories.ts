import type { Meta, StoryObj } from '@storybook/angular';
import { StepAddressComponent } from './step-address.component';

const meta: Meta<StepAddressComponent> = {
  title: 'Forms/StepAddress',
  component: StepAddressComponent,
  tags: ['autodocs'],
  argTypes: {
    stepCompleted: { action: 'stepCompleted' },
    stepBack: { action: 'stepBack' },
  },
  parameters: {
    docs: {
      description: {
        component: `
## Step: Address

Collects street, city, postal code, and country. Second step in the
registration flow.

### Behavioral Economics
- **Default optimization**: country auto-detected from browser locale
  (accept rate for defaults is ~70-90%)
- **Chunking**: 4 fields (within optimal 3-5 range)
- **Friction reduction**: \`autocomplete\` attributes for browser autofill
- **Progressive disclosure**: only shown after personal info is validated

### Accessibility Checklist
- [x] All inputs have associated \`<label>\` elements
- [x] Country \`<select>\` has proper ARIA attributes
- [x] Error messages linked via \`aria-describedby\`
- [x] Help text for auto-detected country
- [x] Touch targets meet 44px minimum
- [x] Custom select chevron respects forced-colors
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<StepAddressComponent>;

/** Default: empty form with auto-detected country */
export const Default: Story = {
  args: {
    data: null,
  },
};

/** Pre-filled: returning to edit */
export const PreFilled: Story = {
  args: {
    data: {
      street: 'Bahnhofstrasse 42',
      city: 'Zurich',
      postalCode: '8001',
      country: 'CH',
    },
  },
};

/** With validation errors */
export const WithErrors: Story = {
  args: { data: null },
  play: async ({ canvasElement }) => {
    // Trigger validation on all fields
    const inputs = canvasElement.querySelectorAll('input, select');
    inputs.forEach((input) => {
      (input as HTMLElement).focus();
      (input as HTMLElement).blur();
    });
  },
};

/** Keyboard navigation */
export const KeyboardNavigation: Story = {
  args: { data: null },
  parameters: {
    docs: {
      description: {
        story: 'Tab through fields including Back and Continue buttons. Country select navigable with arrow keys.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const firstInput = canvasElement.querySelector('#street') as HTMLElement;
    firstInput?.focus();
  },
};

/** Responsive: mobile (single column) */
export const Mobile: Story = {
  args: { data: null },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

/** Responsive: tablet (city/postal code side by side) */
export const Tablet: Story = {
  args: { data: null },
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
};
