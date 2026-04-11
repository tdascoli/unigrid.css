import type { Meta, StoryObj } from '@storybook/angular';
import { StepReviewComponent } from './step-review.component';
import { RegistrationFormData } from '../registration-form.model';

const sampleData: RegistrationFormData = {
  personalInfo: {
    firstName: 'Anna',
    lastName: 'Muster',
    email: 'anna.muster@example.com',
    phone: '+41 79 123 45 67',
  },
  address: {
    street: 'Bahnhofstrasse 42',
    city: 'Zurich',
    postalCode: '8001',
    country: 'CH',
  },
};

const sampleDataNoPhone: RegistrationFormData = {
  personalInfo: {
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max@example.de',
    phone: '',
  },
  address: {
    street: 'Friedrichstrasse 100',
    city: 'Berlin',
    postalCode: '10117',
    country: 'DE',
  },
};

const meta: Meta<StepReviewComponent> = {
  title: 'Forms/StepReview',
  component: StepReviewComponent,
  tags: ['autodocs'],
  argTypes: {
    submitting: {
      control: 'boolean',
      description: 'Whether submission is in progress',
    },
    submitForm: { action: 'submitForm' },
    stepBack: { action: 'stepBack' },
    editStep: { action: 'editStep' },
  },
  parameters: {
    docs: {
      description: {
        component: `
## Step: Review & Submit

Displays a summary of all collected data before final submission.
Users can edit individual sections or go back.

### Behavioral Economics
- **Loss aversion**: review prevents accidental wrong submissions
- **Progress anchoring**: "Almost there!" motivates completion
- **Social proof**: trust signal reassures data handling
- **Positive framing**: encouraging language throughout

### Accessibility Checklist
- [x] Summary uses semantic \`<dl>\`/\`<dt>\`/\`<dd>\`
- [x] Edit buttons have descriptive \`aria-label\`
- [x] Submit button uses \`aria-busy\` during submission
- [x] Loading spinner respects \`prefers-reduced-motion\`
- [x] Trust signal is \`aria-hidden\` (decorative)
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<StepReviewComponent>;

/** Default: complete data ready for review */
export const Default: Story = {
  args: {
    formData: sampleData,
    submitting: false,
  },
};

/** Without phone number (optional field) */
export const WithoutPhone: Story = {
  args: {
    formData: sampleDataNoPhone,
    submitting: false,
  },
};

/** Submitting state (spinner visible, buttons disabled) */
export const Submitting: Story = {
  args: {
    formData: sampleData,
    submitting: true,
  },
};

/** Keyboard navigation */
export const KeyboardNavigation: Story = {
  args: {
    formData: sampleData,
    submitting: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Tab to Edit buttons and Submit. Edit buttons announce their target section via aria-label.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const editBtn = canvasElement.querySelector('.review__edit-btn') as HTMLElement;
    editBtn?.focus();
  },
};

/** Responsive: mobile */
export const Mobile: Story = {
  args: {
    formData: sampleData,
    submitting: false,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

/** Responsive: tablet */
export const Tablet: Story = {
  args: {
    formData: sampleData,
    submitting: false,
  },
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
};
