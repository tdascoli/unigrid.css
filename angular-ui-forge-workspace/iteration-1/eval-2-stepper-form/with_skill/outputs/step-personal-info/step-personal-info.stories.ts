import type { Meta, StoryObj } from '@storybook/angular';
import { StepPersonalInfoComponent } from './step-personal-info.component';

const meta: Meta<StepPersonalInfoComponent> = {
  title: 'Forms/StepPersonalInfo',
  component: StepPersonalInfoComponent,
  tags: ['autodocs'],
  argTypes: {
    stepCompleted: { action: 'stepCompleted' },
    stepBack: { action: 'stepBack' },
  },
  parameters: {
    docs: {
      description: {
        component: `
## Step: Personal Information

Collects first name, last name, email, and phone. First step in the
registration flow.

### Behavioral Economics
- **Chunking**: 4 fields (within optimal 3-5 range)
- **Friction reduction**: correct \`inputmode\` for mobile keyboards
- **Loss aversion**: inline validation prevents submission errors
- **Smart defaults**: phone marked as optional (reduces perceived burden)

### Accessibility Checklist
- [x] All inputs have associated \`<label>\` elements
- [x] Error messages linked via \`aria-describedby\`
- [x] \`aria-invalid\` set on fields with errors
- [x] Touch targets meet 44px minimum
- [x] \`autocomplete\` attributes for browser autofill
- [x] Focus-visible styles on all interactive elements
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<StepPersonalInfoComponent>;

/** Default: empty form, first visit */
export const Default: Story = {
  args: {
    data: null,
  },
};

/** Pre-filled: returning to edit after completing */
export const PreFilled: Story = {
  args: {
    data: {
      firstName: 'Anna',
      lastName: 'Muster',
      email: 'anna.muster@example.com',
      phone: '+41 79 123 45 67',
    },
  },
};

/** With validation errors visible */
export const WithErrors: Story = {
  args: {
    data: null,
  },
  play: async ({ canvasElement }) => {
    // Simulate: focus and blur the first name field to trigger validation
    const firstNameInput = canvasElement.querySelector('#firstName') as HTMLInputElement;
    if (firstNameInput) {
      firstNameInput.focus();
      firstNameInput.blur();
    }
    // Focus and blur email with invalid value
    const emailInput = canvasElement.querySelector('#email') as HTMLInputElement;
    if (emailInput) {
      emailInput.focus();
      emailInput.value = 'not-an-email';
      emailInput.dispatchEvent(new Event('input'));
      emailInput.dispatchEvent(new Event('blur'));
    }
  },
};

/** Keyboard navigation */
export const KeyboardNavigation: Story = {
  args: { data: null },
  parameters: {
    docs: {
      description: {
        story: 'Tab through all fields. Focus ring must be visible on each. Error messages announced by screen readers via role="alert".',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const firstInput = canvasElement.querySelector('#firstName') as HTMLElement;
    firstInput?.focus();
  },
};

/** Responsive: mobile */
export const Mobile: Story = {
  args: { data: null },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

/** Responsive: tablet (2-column name row) */
export const Tablet: Story = {
  args: { data: null },
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
};

/** Responsive: desktop */
export const Desktop: Story = {
  args: { data: null },
  parameters: {
    viewport: { defaultViewport: 'responsive' },
  },
};
