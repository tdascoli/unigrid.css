import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperFormComponent, StepPanelDirective, StepConfig, StepChangeEvent } from '../stepper-form';
import {
  RegistrationFormComponent,
  PersonalInfo,
  AddressInfo,
  CountryOption,
  RegistrationStep,
} from '../registration-form';

/**
 * Smart (container) component for the multi-step registration form.
 *
 * Orchestrates:
 * - Step navigation state
 * - Form data collection across steps
 * - Country detection from browser locale (smart default)
 * - Form submission
 *
 * Passes all data down to the dumb components (StepperFormComponent
 * and RegistrationFormComponent) via property bindings and handles
 * events bubbled up from them.
 */
@Component({
  selector: 'feature-registration-form',
  standalone: true,
  imports: [
    CommonModule,
    StepperFormComponent,
    StepPanelDirective,
    RegistrationFormComponent,
  ],
  templateUrl: './registration-form-container.component.html',
  styleUrl: './registration-form-container.component.scss',
})
export class RegistrationFormContainerComponent {
  /** Step configuration for the stepper */
  steps: StepConfig[] = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'address', label: 'Address' },
    { id: 'review', label: 'Review & Submit' },
  ];

  /** Current active step index */
  currentStepIndex = 0;

  /** Personal information form data */
  personalInfo: PersonalInfo = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  };

  /** Address form data */
  addressInfo: AddressInfo = {
    street: '',
    city: '',
    postalCode: '',
    country: '',
  };

  /** Available countries */
  countries: CountryOption[] = [
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

  /** Whether form has been submitted */
  submitted = false;

  constructor() {
    this.detectCountry();
  }

  /** Get the step id for the current step index */
  get activeStep(): RegistrationStep {
    const stepIds: RegistrationStep[] = ['personal', 'address', 'review'];
    return stepIds[this.currentStepIndex] || 'personal';
  }

  /** Handle step indicator clicks from the stepper */
  onStepChange(event: StepChangeEvent): void {
    this.currentStepIndex = event.targetIndex;
  }

  /** Handle next button */
  onNextStep(): void {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
    }
  }

  /** Handle previous button */
  onPreviousStep(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
    }
  }

  /** Handle form submission */
  onFormSubmit(): void {
    this.submitted = true;
    // In a real app, this would call a service:
    // this.registrationService.submit({ personal: this.personalInfo, address: this.addressInfo });
    console.log('Registration submitted:', {
      personal: this.personalInfo,
      address: this.addressInfo,
    });
  }

  /** Handle personal info updates from the form */
  onPersonalInfoChange(data: PersonalInfo): void {
    this.personalInfo = data;
  }

  /** Handle address info updates from the form */
  onAddressInfoChange(data: AddressInfo): void {
    this.addressInfo = data;
  }

  /** Handle edit clicks from the review step */
  onEditStep(step: RegistrationStep): void {
    const stepMap: Record<RegistrationStep, number> = {
      personal: 0,
      address: 1,
      review: 2,
    };
    this.currentStepIndex = stepMap[step];
  }

  /**
   * Smart default: detect user's country from browser locale.
   * Behavioral economics: Default optimization reduces friction
   * and decision fatigue.
   */
  private detectCountry(): void {
    const locale = navigator.language || '';
    const localeCountryMap: Record<string, string> = {
      'de-CH': 'CH', 'fr-CH': 'CH', 'it-CH': 'CH', 'rm-CH': 'CH',
      'de-DE': 'DE', 'de-AT': 'AT', 'de-LI': 'LI',
      'fr-FR': 'FR', 'fr-BE': 'BE',
      'nl-NL': 'NL', 'nl-BE': 'BE',
      'it-IT': 'IT',
      'en-GB': 'GB', 'en-US': 'US', 'en-CA': 'CA',
    };

    let detected = localeCountryMap[locale];
    if (!detected) {
      const parts = locale.split('-');
      if (parts.length >= 2) {
        detected = parts[1].toUpperCase();
      }
    }

    if (detected && this.countries.some(c => c.code === detected)) {
      this.addressInfo.country = detected;
    }
  }
}
