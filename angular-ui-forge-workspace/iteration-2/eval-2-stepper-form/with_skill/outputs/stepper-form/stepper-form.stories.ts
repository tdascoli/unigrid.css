import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { StepperFormComponent } from './stepper-form.component';
import { StepPanelDirective } from './step-panel.directive';
import { StepConfig } from './stepper-form.model';

const defaultSteps: StepConfig[] = [
  { id: 'personal', label: 'Personal Info' },
  { id: 'address', label: 'Address' },
  { id: 'review', label: 'Review & Submit' },
];

const meta: Meta<StepperFormComponent> = {
  title: 'Forms/StepperForm',
  component: StepperFormComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [CommonModule, StepPanelDirective],
    }),
  ],
  argTypes: {
    steps: {
      control: 'object',
      description: 'Array of step configurations (id, label, optional)',
      table: { defaultValue: { summary: '[]' } },
    },
    currentStepIndex: {
      control: { type: 'number', min: 0, max: 2 },
      description: 'Currently active step index (0-based)',
      table: { defaultValue: { summary: '0' } },
    },
    showProgressBar: {
      control: 'boolean',
      description: 'Whether to show the progress bar',
      table: { defaultValue: { summary: 'true' } },
    },
    stepChange: { action: 'stepChange' },
    previousStep: { action: 'previousStep' },
    nextStep: { action: 'nextStep' },
    formSubmit: { action: 'formSubmit' },
  },
  parameters: {
    docs: {
      description: {
        component: `
A multi-step form navigation component with stepper header, progress bar, and step content projection.

**Behavioral Economics Applied:**
- Progressive disclosure: one step visible at a time
- Progress anchoring: progress bar shows completion percentage
- Chunking: navigation groups steps into digestible sections

**Accessibility:**
- Step buttons use aria-current="step" for the active step
- Progress bar uses role="progressbar" with aria-valuenow
- Step changes announced via aria-live region
- All interactive elements have min-height: 44px
- Focus indicators use outline (not box-shadow)
- Reduced motion respected
- High contrast mode supported
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<StepperFormComponent>;

/** Default state: Step 1 active with sample content */
export const Default: Story = {
  args: {
    steps: defaultSteps,
    currentStepIndex: 0,
    showProgressBar: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-stepper-form
        [steps]="steps"
        [currentStepIndex]="currentStepIndex"
        [showProgressBar]="showProgressBar"
        (stepChange)="stepChange($event)"
        (previousStep)="previousStep($event)"
        (nextStep)="nextStep($event)"
        (formSubmit)="formSubmit($event)"
      >
        <ng-template uiStepPanel>
          <div style="padding: var(--ug-spacing-3, 1.625rem);">
            <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">Personal Information</h2>
            <p style="color: #666;">Step 1 content placeholder</p>
          </div>
        </ng-template>
        <ng-template uiStepPanel>
          <div style="padding: var(--ug-spacing-3, 1.625rem);">
            <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">Address</h2>
            <p style="color: #666;">Step 2 content placeholder</p>
          </div>
        </ng-template>
        <ng-template uiStepPanel>
          <div style="padding: var(--ug-spacing-3, 1.625rem);">
            <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">Review &amp; Submit</h2>
            <p style="color: #666;">Step 3 content placeholder</p>
          </div>
        </ng-template>
      </ui-stepper-form>
    `,
  }),
};

/** Step 2: Address step active */
export const StepTwo: Story = {
  args: {
    steps: defaultSteps,
    currentStepIndex: 1,
    showProgressBar: true,
  },
  render: Default.render,
};

/** Step 3: Review step active (last step shows Submit button) */
export const StepThree: Story = {
  args: {
    steps: defaultSteps,
    currentStepIndex: 2,
    showProgressBar: true,
  },
  render: Default.render,
};

/** Without progress bar */
export const NoProgressBar: Story = {
  args: {
    steps: defaultSteps,
    currentStepIndex: 0,
    showProgressBar: false,
  },
  render: Default.render,
};

/** Two steps only */
export const TwoSteps: Story = {
  args: {
    steps: [
      { id: 'info', label: 'Information' },
      { id: 'confirm', label: 'Confirm' },
    ],
    currentStepIndex: 0,
    showProgressBar: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-stepper-form
        [steps]="steps"
        [currentStepIndex]="currentStepIndex"
        [showProgressBar]="showProgressBar"
        (stepChange)="stepChange($event)"
        (previousStep)="previousStep($event)"
        (nextStep)="nextStep($event)"
        (formSubmit)="formSubmit($event)"
      >
        <ng-template uiStepPanel>
          <div style="padding: var(--ug-spacing-3, 1.625rem);">
            <h2 style="font-size: 1.5rem; font-weight: 700;">Information</h2>
          </div>
        </ng-template>
        <ng-template uiStepPanel>
          <div style="padding: var(--ug-spacing-3, 1.625rem);">
            <h2 style="font-size: 1.5rem; font-weight: 700;">Confirm</h2>
          </div>
        </ng-template>
      </ui-stepper-form>
    `,
  }),
};

/** Five steps (stress test) */
export const FiveSteps: Story = {
  args: {
    steps: [
      { id: 'account', label: 'Account' },
      { id: 'personal', label: 'Personal' },
      { id: 'address', label: 'Address' },
      { id: 'preferences', label: 'Preferences' },
      { id: 'review', label: 'Review' },
    ],
    currentStepIndex: 2,
    showProgressBar: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-stepper-form
        [steps]="steps"
        [currentStepIndex]="currentStepIndex"
        [showProgressBar]="showProgressBar"
        (stepChange)="stepChange($event)"
        (previousStep)="previousStep($event)"
        (nextStep)="nextStep($event)"
        (formSubmit)="formSubmit($event)"
      >
        <ng-template uiStepPanel><div style="padding: 1.625rem;"><h2>Account</h2></div></ng-template>
        <ng-template uiStepPanel><div style="padding: 1.625rem;"><h2>Personal</h2></div></ng-template>
        <ng-template uiStepPanel><div style="padding: 1.625rem;"><h2>Address</h2></div></ng-template>
        <ng-template uiStepPanel><div style="padding: 1.625rem;"><h2>Preferences</h2></div></ng-template>
        <ng-template uiStepPanel><div style="padding: 1.625rem;"><h2>Review</h2></div></ng-template>
      </ui-stepper-form>
    `,
  }),
};

/** Keyboard navigation: demonstrates focus behavior */
export const KeyboardNavigation: Story = {
  args: {
    steps: defaultSteps,
    currentStepIndex: 0,
    showProgressBar: true,
  },
  render: Default.render,
  parameters: {
    docs: {
      description: {
        story: `
Tab to navigate between step indicators and buttons.
Focus ring is 3px solid outline (not box-shadow) for WCAG compliance.
Works in Windows High Contrast Mode.
All interactive elements have minimum 44px touch target.
        `,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const firstStep = canvasElement.querySelector('.stepper__step');
    (firstStep as HTMLElement)?.focus();
  },
};

/** Mobile viewport */
export const Mobile: Story = {
  args: {
    steps: defaultSteps,
    currentStepIndex: 0,
    showProgressBar: true,
  },
  render: Default.render,
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

/** Tablet viewport */
export const Tablet: Story = {
  args: {
    steps: defaultSteps,
    currentStepIndex: 1,
    showProgressBar: true,
  },
  render: Default.render,
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
};

/** Desktop viewport */
export const Desktop: Story = {
  args: {
    steps: defaultSteps,
    currentStepIndex: 0,
    showProgressBar: true,
  },
  render: Default.render,
  parameters: {
    viewport: { defaultViewport: 'responsive' },
  },
};
