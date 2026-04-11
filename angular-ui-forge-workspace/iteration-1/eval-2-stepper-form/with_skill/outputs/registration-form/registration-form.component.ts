import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperIndicatorComponent } from '../stepper-indicator/stepper-indicator.component';
import { StepPersonalInfoComponent } from '../step-personal-info/step-personal-info.component';
import { StepAddressComponent } from '../step-address/step-address.component';
import { StepReviewComponent } from '../step-review/step-review.component';
import {
  StepDefinition,
  PersonalInfoData,
  AddressData,
  RegistrationFormData,
} from '../registration-form.model';

/**
 * Registration Form (Smart/Container Component)
 *
 * Orchestrates the 3-step registration flow:
 *   1. Personal Info
 *   2. Address
 *   3. Review & Submit
 *
 * This smart component:
 * - Manages the current step index and navigation
 * - Holds all collected form data in state
 * - Tracks which steps are completed
 * - Handles final form submission (delegates to a service in production)
 * - Passes data down to dumb step components via property bindings
 * - Handles events bubbled up from dumb components
 *
 * The component uses NO inline template or styles (separate files always).
 */
@Component({
  selector: 'feature-registration-form',
  standalone: true,
  imports: [
    CommonModule,
    StepperIndicatorComponent,
    StepPersonalInfoComponent,
    StepAddressComponent,
    StepReviewComponent,
  ],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss',
})
export class RegistrationFormComponent implements OnInit {
  /** Step definitions for the stepper indicator */
  steps: StepDefinition[] = [
    { index: 0, label: 'Personal Info', description: 'Name, email, and phone' },
    { index: 1, label: 'Address', description: 'Street, city, and country' },
    { index: 2, label: 'Review', description: 'Confirm and submit' },
  ];

  /** Current active step (0-based) */
  currentStep = 0;

  /** Tracks which steps have been completed */
  completedSteps = new Set<number>();

  /** Collected form data */
  personalInfoData: PersonalInfoData | null = null;
  addressData: AddressData | null = null;

  /** Submission state */
  submitting = false;
  submitted = false;

  ngOnInit(): void {
    // Smart container initialization
    // In production, could pre-fill from a user profile service
  }

  /** Computed: full registration data for the review step */
  get registrationData(): RegistrationFormData | null {
    if (this.personalInfoData && this.addressData) {
      return {
        personalInfo: this.personalInfoData,
        address: this.addressData,
      };
    }
    return null;
  }

  // --- Event handlers from dumb components ---

  onPersonalInfoCompleted(data: PersonalInfoData): void {
    this.personalInfoData = data;
    this.completedSteps.add(0);
    this.currentStep = 1;
  }

  onAddressCompleted(data: AddressData): void {
    this.addressData = data;
    this.completedSteps.add(1);
    this.currentStep = 2;
  }

  onStepBack(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  onEditStep(stepIndex: number): void {
    this.currentStep = stepIndex;
  }

  onStepClicked(stepIndex: number): void {
    // Only allow navigating to completed steps
    if (this.completedSteps.has(stepIndex)) {
      this.currentStep = stepIndex;
    }
  }

  onSubmit(): void {
    if (this.submitting || !this.registrationData) return;

    this.submitting = true;

    // In production, this would call a RegistrationService
    // this.registrationService.register(this.registrationData).subscribe(...)
    // Simulating API call:
    setTimeout(() => {
      this.submitting = false;
      this.submitted = true;
      this.completedSteps.add(2);
      // In production: navigate to success page or show success state
    }, 1500);
  }
}
