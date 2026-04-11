import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  HostBinding,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { PersonalInfoData } from '../registration-form.model';

/**
 * Step: Personal Info (Dumb Component)
 *
 * Collects first name, last name, email, and phone number.
 * Uses reactive forms with inline validation.
 *
 * Behavioral Economics:
 * - Chunking: only 4 fields (within the 3-5 optimal range)
 * - Friction reduction: appropriate input types for mobile keyboards
 * - Smart defaults: email and phone use correct inputmode attributes
 * - Loss aversion: inline validation prevents errors before submission
 *
 * Accessibility:
 * - All inputs have associated labels
 * - Error messages linked via aria-describedby
 * - aria-invalid on fields with errors
 * - Touch targets meet 44px minimum
 */
@Component({
  selector: 'ui-step-personal-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step-personal-info.component.html',
  styleUrl: './step-personal-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepPersonalInfoComponent {
  /** Pre-filled data (for returning to a completed step) */
  @Input() set data(value: PersonalInfoData | null) {
    if (value) {
      this.form.patchValue(value, { emitEvent: false });
    }
  }

  /** Emits valid form data when the user advances */
  @Output() stepCompleted = new EventEmitter<PersonalInfoData>();

  /** Emits when the user wants to go back (disabled on step 1) */
  @Output() stepBack = new EventEmitter<void>();

  @HostBinding('class') hostClass = 'ui-step-personal-info';

  form = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.pattern(/^\+?[\d\s\-()]{7,}$/)]),
  });

  /** Track which fields the user has interacted with (for inline validation) */
  fieldTouched: Record<string, boolean> = {};

  onFieldBlur(fieldName: string): void {
    this.fieldTouched[fieldName] = true;
  }

  shouldShowError(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control && control.invalid && this.fieldTouched[fieldName]);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (control.errors['minlength']) {
      return `${this.getFieldLabel(fieldName)} must be at least ${control.errors['minlength'].requiredLength} characters`;
    }
    if (control.errors['email']) {
      return 'Please enter a valid email address';
    }
    if (control.errors['pattern']) {
      return 'Please enter a valid phone number';
    }
    return '';
  }

  onSubmit(): void {
    // Mark all fields as touched to show any remaining errors
    Object.keys(this.form.controls).forEach(key => {
      this.fieldTouched[key] = true;
    });
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.stepCompleted.emit(this.form.value as PersonalInfoData);
    }
  }

  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      phone: 'Phone',
    };
    return labels[fieldName] ?? fieldName;
  }
}
