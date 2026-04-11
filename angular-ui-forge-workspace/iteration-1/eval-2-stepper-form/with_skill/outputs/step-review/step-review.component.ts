import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  HostBinding,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RegistrationFormData,
  COUNTRIES,
} from '../registration-form.model';

/**
 * Step: Review & Submit (Dumb Component)
 *
 * Displays a summary of all collected data for user review before submission.
 * Allows editing individual sections by navigating back to specific steps.
 *
 * Behavioral Economics:
 * - Loss aversion: review step prevents accidental submission of wrong data
 * - Anchoring: progress indicator shows "almost done" to motivate completion
 * - Social proof: trust signal at the bottom reassures data handling
 * - Positive framing: "Almost there!" encourages completion
 *
 * Accessibility:
 * - Summary uses definition list (dl/dt/dd) for semantic structure
 * - Edit buttons have descriptive aria-labels
 * - Submit button is visually prominent (primary action)
 */
@Component({
  selector: 'ui-step-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-review.component.html',
  styleUrl: './step-review.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepReviewComponent {
  /** Complete registration data to review */
  @Input() formData: RegistrationFormData | null = null;

  /** Whether submission is in progress */
  @Input() submitting = false;

  /** Emits when user confirms and submits */
  @Output() submitForm = new EventEmitter<void>();

  /** Emits when user wants to go back */
  @Output() stepBack = new EventEmitter<void>();

  /** Emits a step index when user wants to edit a specific section */
  @Output() editStep = new EventEmitter<number>();

  @HostBinding('class') hostClass = 'ui-step-review';

  /** Resolve country code to display name */
  getCountryName(code: string): string {
    return COUNTRIES.find(c => c.code === code)?.name ?? code;
  }

  /** Format phone for display, or show a placeholder */
  getPhoneDisplay(phone: string | undefined): string {
    return phone || 'Not provided';
  }

  onSubmit(): void {
    if (!this.submitting) {
      this.submitForm.emit();
    }
  }

  onBack(): void {
    this.stepBack.emit();
  }

  onEditPersonalInfo(): void {
    this.editStep.emit(0);
  }

  onEditAddress(): void {
    this.editStep.emit(1);
  }
}
