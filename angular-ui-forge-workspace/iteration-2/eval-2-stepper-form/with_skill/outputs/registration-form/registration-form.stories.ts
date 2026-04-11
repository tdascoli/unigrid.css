import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegistrationFormComponent } from './registration-form.component';
import { CountryOption, PersonalInfo, AddressInfo } from './registration-form.model';

const defaultCountries: CountryOption[] = [
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgium' },
  { code: 'CA', name: 'Canada' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'IT', name: 'Italy' },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'US', name: 'United States' },
];

const emptyPersonal: PersonalInfo = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
};

const filledPersonal: PersonalInfo = {
  firstName: 'Maria',
  lastName: 'Muster',
  email: 'maria@example.com',
  phone: '+41 79 123 45 67',
};

const emptyAddress: AddressInfo = {
  street: '',
  city: '',
  postalCode: '',
  country: '',
};

const filledAddress: AddressInfo = {
  street: 'Bahnhofstrasse 42',
  city: 'Zurich',
  postalCode: '8001',
  country: 'CH',
};

const meta: Meta<RegistrationFormComponent> = {
  title: 'Forms/RegistrationForm',
  component: RegistrationFormComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormsModule],
    }),
  ],
  argTypes: {
    activeStep: {
      control: 'select',
      options: ['personal', 'address', 'review'],
      description: 'Which registration step to render',
      table: { defaultValue: { summary: 'personal' } },
    },
    personalInfo: {
      control: 'object',
      description: 'Personal information form data',
    },
    addressInfo: {
      control: 'object',
      description: 'Address form data',
    },
    countries: {
      control: 'object',
      description: 'Available country options',
    },
    personalInfoChange: { action: 'personalInfoChange' },
    addressInfoChange: { action: 'addressInfoChange' },
    editStep: { action: 'editStep' },
  },
  parameters: {
    docs: {
      description: {
        component: `
A presentational registration form that renders different fields depending on the active step.

**Steps:**
1. **Personal Info** — First name, last name, email, phone (optional)
2. **Address** — Street, city, postal code, country (with smart default)
3. **Review** — Summary of all entered data with edit buttons

**Behavioral Economics:**
- Progressive disclosure: only current step fields shown
- Smart defaults: country pre-detected from browser locale
- Chunking: 3-4 fields per step (within working memory limits)
- Friction reduction: autocomplete, proper inputmode for mobile keyboards
- Trust signal on review step (shield icon + privacy message)
- Optional fields marked "(optional)" not required with "*"

**Accessibility:**
- All inputs have associated labels
- Required fields marked with aria-required
- Email hint linked via aria-describedby
- All inputs/selects have min-height: 44px touch target
- Focus uses outline (not box-shadow)
- Review edit buttons have min 44px target + aria-label
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<RegistrationFormComponent>;

/** Step 1: Personal Information (empty) */
export const PersonalInfoEmpty: Story = {
  args: {
    activeStep: 'personal',
    personalInfo: { ...emptyPersonal },
    addressInfo: { ...emptyAddress },
    countries: defaultCountries,
  },
};

/** Step 1: Personal Information (pre-filled) */
export const PersonalInfoFilled: Story = {
  args: {
    activeStep: 'personal',
    personalInfo: { ...filledPersonal },
    addressInfo: { ...emptyAddress },
    countries: defaultCountries,
  },
};

/** Step 2: Address (empty) */
export const AddressEmpty: Story = {
  args: {
    activeStep: 'address',
    personalInfo: { ...filledPersonal },
    addressInfo: { ...emptyAddress },
    countries: defaultCountries,
  },
};

/** Step 2: Address with smart default country */
export const AddressWithDefault: Story = {
  args: {
    activeStep: 'address',
    personalInfo: { ...filledPersonal },
    addressInfo: { ...emptyAddress, country: 'CH' },
    countries: defaultCountries,
  },
};

/** Step 2: Address fully filled */
export const AddressFilled: Story = {
  args: {
    activeStep: 'address',
    personalInfo: { ...filledPersonal },
    addressInfo: { ...filledAddress },
    countries: defaultCountries,
  },
};

/** Step 3: Review with all data filled */
export const ReviewFilled: Story = {
  args: {
    activeStep: 'review',
    personalInfo: { ...filledPersonal },
    addressInfo: { ...filledAddress },
    countries: defaultCountries,
  },
};

/** Step 3: Review with partial data (shows empty state styling) */
export const ReviewPartial: Story = {
  args: {
    activeStep: 'review',
    personalInfo: { firstName: 'Maria', lastName: '', email: 'maria@example.com', phone: '' },
    addressInfo: { street: '', city: 'Zurich', postalCode: '', country: 'CH' },
    countries: defaultCountries,
  },
};

/** Step 3: Review with no data */
export const ReviewEmpty: Story = {
  args: {
    activeStep: 'review',
    personalInfo: { ...emptyPersonal },
    addressInfo: { ...emptyAddress },
    countries: defaultCountries,
  },
};

/** Keyboard navigation on personal info step */
export const KeyboardNavigation: Story = {
  args: {
    activeStep: 'personal',
    personalInfo: { ...emptyPersonal },
    addressInfo: { ...emptyAddress },
    countries: defaultCountries,
  },
  parameters: {
    docs: {
      description: {
        story: `
Tab through form fields. Each input and select has:
- 3px outline focus indicator (not box-shadow)
- outline-offset: 2px
- min-height: 44px touch target
- Works in Windows High Contrast Mode
        `,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const firstInput = canvasElement.querySelector('input');
    (firstInput as HTMLElement)?.focus();
  },
};

/** Mobile viewport */
export const Mobile: Story = {
  args: {
    activeStep: 'personal',
    personalInfo: { ...emptyPersonal },
    addressInfo: { ...emptyAddress },
    countries: defaultCountries,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        story: 'Single column layout on mobile. Full viewport width, no narrow centering.',
      },
    },
  },
};

/** Tablet viewport */
export const Tablet: Story = {
  args: {
    activeStep: 'address',
    personalInfo: { ...filledPersonal },
    addressInfo: { ...emptyAddress, country: 'CH' },
    countries: defaultCountries,
  },
  parameters: {
    viewport: { defaultViewport: 'tablet' },
    docs: {
      description: {
        story: 'Two column grid on tablet. Street address spans full width.',
      },
    },
  },
};

/** Desktop viewport */
export const Desktop: Story = {
  args: {
    activeStep: 'address',
    personalInfo: { ...filledPersonal },
    addressInfo: { ...filledAddress },
    countries: defaultCountries,
  },
  parameters: {
    viewport: { defaultViewport: 'responsive' },
    docs: {
      description: {
        story: 'Three column grid on desktop. Full viewport width utilization.',
      },
    },
  },
};

/** All steps comparison */
export const AllSteps: Story = {
  render: () => ({
    props: {
      personalInfo: filledPersonal,
      addressInfo: filledAddress,
      countries: defaultCountries,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 3rem;">
        <div>
          <h3 style="font-size: 0.875rem; color: #666; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em;">Step 1: Personal Info</h3>
          <ui-registration-form
            activeStep="personal"
            [personalInfo]="personalInfo"
            [countries]="countries"
          ></ui-registration-form>
        </div>
        <hr style="border: none; border-top: 1px solid #e8e5e0;" />
        <div>
          <h3 style="font-size: 0.875rem; color: #666; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em;">Step 2: Address</h3>
          <ui-registration-form
            activeStep="address"
            [addressInfo]="addressInfo"
            [countries]="countries"
          ></ui-registration-form>
        </div>
        <hr style="border: none; border-top: 1px solid #e8e5e0;" />
        <div>
          <h3 style="font-size: 0.875rem; color: #666; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em;">Step 3: Review</h3>
          <ui-registration-form
            activeStep="review"
            [personalInfo]="personalInfo"
            [addressInfo]="addressInfo"
            [countries]="countries"
          ></ui-registration-form>
        </div>
      </div>
    `,
  }),
};
