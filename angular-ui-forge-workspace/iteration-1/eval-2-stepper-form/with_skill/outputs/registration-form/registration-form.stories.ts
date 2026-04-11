import type { Meta, StoryObj } from '@storybook/angular';
import { RegistrationFormComponent } from './registration-form.component';

const meta: Meta<RegistrationFormComponent> = {
  title: 'Pages/RegistrationForm',
  component: RegistrationFormComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Registration Form (Smart Container)

A 3-step registration flow that orchestrates:
1. **Personal Info** — name, email, phone
2. **Address** — street, city, postal code, country (auto-detected)
3. **Review & Submit** — summary with edit affordances

### Smart/Dumb Pattern
This is the **smart (container)** component. It:
- Manages step navigation state
- Holds collected form data
- Tracks step completion
- Handles form submission
- Passes data down to dumb step components

The dumb components (\`StepperIndicator\`, \`StepPersonalInfo\`,
\`StepAddress\`, \`StepReview\`) have zero services and are
pure functions of their inputs.

### Behavioral Economics Applied
- **Progressive disclosure**: 3-step wizard instead of one mega-form
- **Default optimization**: country auto-detected from browser locale
- **Chunking**: 3-4 fields per step (within 3-5 optimal range)
- **Loss aversion**: review step prevents accidental wrong submission
- **Friction reduction**: autocomplete, correct inputmode, inline validation
- **Progress anchoring**: stepper indicator shows completion progress
- **Social proof**: trust signal on the review step
- **Positive framing**: encouraging microcopy throughout

### Viewport Utilization
The form uses the full viewport width on all screen sizes.
Fields expand to fill available space. On tablet+, related fields
(first/last name, city/postal code) sit side by side.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<RegistrationFormComponent>;

/** Default: full interactive registration flow */
export const Default: Story = {};

/** Responsive: mobile viewport */
export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

/** Responsive: tablet viewport */
export const Tablet: Story = {
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
};

/** Responsive: desktop viewport */
export const Desktop: Story = {
  parameters: {
    viewport: { defaultViewport: 'responsive' },
  },
};
