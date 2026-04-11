import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  PersonalInfo,
  AddressInfo,
  RegistrationFormData,
  CountryOption,
  RegistrationStep,
} from './registration-form.model';

/**
 * Dumb (presentational) registration form component.
 *
 * Renders form fields for a specific step of the registration process.
 * Displays personal info fields, address fields, or a review summary
 * depending on the `activeStep` input.
 *
 * Uses Tailwind utility classes for layout (full viewport width,
 * responsive grid columns). The component SCSS handles only complex
 * states and animations.
 *
 * Behavioral economics applied:
 * - Progressive disclosure: one step at a time
 * - Smart defaults: country pre-detected from browser locale
 * - Chunking: 3-4 fields per step
 * - Friction reduction: autocomplete attributes, proper inputmode
 * - Trust signal on review step
 * - Positive framing: optional fields marked "(optional)" not required with "*"
 */
@Component({
  selector: 'ui-registration-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationFormComponent {
  /** Which step to render: 'personal', 'address', or 'review' */
  @Input() activeStep: RegistrationStep = 'personal';

  /** Current personal info data (two-way binding via ngModel in template) */
  @Input() personalInfo: PersonalInfo = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  };

  /** Current address data */
  @Input() addressInfo: AddressInfo = {
    street: '',
    city: '',
    postalCode: '',
    country: '',
  };

  /** List of country options for the selector */
  @Input() countries: CountryOption[] = [];

  /** Emitted whenever personal info fields change */
  @Output() personalInfoChange = new EventEmitter<PersonalInfo>();

  /** Emitted whenever address fields change */
  @Output() addressInfoChange = new EventEmitter<AddressInfo>();

  /** Emitted when user clicks "Edit" on a review section (emits the step id) */
  @Output() editStep = new EventEmitter<RegistrationStep>();

  /** Handle personal info field changes */
  onPersonalChange(): void {
    this.personalInfoChange.emit({ ...this.personalInfo });
  }

  /** Handle address field changes */
  onAddressChange(): void {
    this.addressInfoChange.emit({ ...this.addressInfo });
  }

  /** Navigate to a step from the review panel */
  onEditClick(step: RegistrationStep): void {
    this.editStep.emit(step);
  }

  /** Get the display name for a country code */
  getCountryName(code: string): string {
    const country = this.countries.find(c => c.code === code);
    return country ? country.name : code || 'Not selected';
  }

  /** Get the combined form data for the review step */
  get formData(): RegistrationFormData {
    return {
      personal: this.personalInfo,
      address: this.addressInfo,
    };
  }
}
