import type { Meta, StoryObj } from '@storybook/angular';
import { StepperIndicatorComponent } from './stepper-indicator.component';
import { StepDefinition } from '../registration-form.model';

const registrationSteps: StepDefinition[] = [
  { index: 0, label: 'Personal Info' },
  { index: 1, label: 'Address' },
  { index: 2, label: 'Review' },
];

const meta: Meta<StepperIndicatorComponent> = {
  title: 'Forms/StepperIndicator',
  component: StepperIndicatorComponent,
  tags: ['autodocs'],
  argTypes: {
    currentStep: {
      control: { type: 'number', min: 0, max: 2 },
      description: 'Index of the currently active step (0-based)',
      table: { defaultValue: { summary: '0' } },
    },
    stepClicked: { action: 'stepClicked' },
  },
  parameters: {
    docs: {
      description: {
        component: `
## Stepper Indicator

A horizontal progress indicator for multi-step forms. Shows step numbers,
labels, and completion state with a connecting progress track.

### Behavioral Economics
- **Progress anchoring**: visual progress bar motivates completion
- **Chunking**: numbered steps reduce cognitive load

### Accessibility
- \`aria-label\` on the nav element announces progress
- \`aria-current="step"\` on the active step
- Completed steps are clickable buttons for navigation
- High contrast mode supported via \`forced-colors\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<StepperIndicatorComponent>;

/** Default: first step active, none completed */
export const Default: Story = {
  args: {
    steps: registrationSteps,
    currentStep: 0,
    completedSteps: new Set<number>(),
  },
};

/** Step 2 active, step 1 completed */
export const SecondStep: Story = {
  args: {
    steps: registrationSteps,
    currentStep: 1,
    completedSteps: new Set<number>([0]),
  },
};

/** Step 3 (review) active, steps 1-2 completed */
export const ThirdStep: Story = {
  args: {
    steps: registrationSteps,
    currentStep: 2,
    completedSteps: new Set<number>([0, 1]),
  },
};

/** All steps completed (post-submission) */
export const AllCompleted: Story = {
  args: {
    steps: registrationSteps,
    currentStep: 2,
    completedSteps: new Set<number>([0, 1, 2]),
  },
};

/** Keyboard navigation — focus on a completed step button */
export const KeyboardNavigation: Story = {
  args: {
    steps: registrationSteps,
    currentStep: 2,
    completedSteps: new Set<number>([0, 1]),
  },
  parameters: {
    docs: {
      description: {
        story: 'Tab to focus completed steps. Enter/Space to navigate back. Focus ring must be visible.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('.stepper__button:not(:disabled)') as HTMLElement;
    button?.focus();
  },
};

/** Responsive: mobile viewport */
export const Mobile: Story = {
  args: {
    steps: registrationSteps,
    currentStep: 1,
    completedSteps: new Set<number>([0]),
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

/** Responsive: tablet viewport */
export const Tablet: Story = {
  args: {
    steps: registrationSteps,
    currentStep: 1,
    completedSteps: new Set<number>([0]),
  },
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
};

/** All states side by side for visual comparison */
export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <p style="font-size: 0.75rem; color: #666; margin-bottom: 0.5rem;">Step 1 active</p>
          <ui-stepper-indicator
            [steps]="steps"
            [currentStep]="0"
            [completedSteps]="empty"
          ></ui-stepper-indicator>
        </div>
        <div>
          <p style="font-size: 0.75rem; color: #666; margin-bottom: 0.5rem;">Step 2 active, step 1 completed</p>
          <ui-stepper-indicator
            [steps]="steps"
            [currentStep]="1"
            [completedSteps]="oneCompleted"
          ></ui-stepper-indicator>
        </div>
        <div>
          <p style="font-size: 0.75rem; color: #666; margin-bottom: 0.5rem;">Step 3 active, steps 1-2 completed</p>
          <ui-stepper-indicator
            [steps]="steps"
            [currentStep]="2"
            [completedSteps]="twoCompleted"
          ></ui-stepper-indicator>
        </div>
      </div>
    `,
    props: {
      steps: registrationSteps,
      empty: new Set<number>(),
      oneCompleted: new Set<number>([0]),
      twoCompleted: new Set<number>([0, 1]),
    },
  }),
};
