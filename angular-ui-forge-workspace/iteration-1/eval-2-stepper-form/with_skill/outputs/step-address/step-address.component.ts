import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import {
  AddressData,
  CountryOption,
  COUNTRIES,
  detectCountryFromLocale,
} from '../registration-form.model';

/**
 * Step: Address (Dumb Component)
 *
 * Collects street, city, postal code, and country.
 * Pre-selects country from browser locale (smart default).
 *
 * Behavioral Economics:
 * - Default optimization: country auto-detected from browser locale
 * - Chunking: 4 fields (within optimal 3-5 range)
 * - Friction reduction: autocomplete attributes for browser autofill
 * - Progressive disclosure: only shown after personal info is complete
 *
 * Accessibility:
 * - All inputs have associated labels
 * - Country select has proper aria attributes
 * - Error messages linked via aria-describedby
 * - Touch targets meet 44px minimum
 */
@Component({
  selector: 'ui-step-address',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step-address.component.html',
  styleUrl: './step-address.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepAddressComponent implements OnInit {
  /** Pre-filled data (for returning to a completed step) */
  @Input() set data(value: AddressData | null) {
    if (value) {
      this.form.patchValue(value, { emitEvent: false });
      this._dataPreFilled = true;
    }
  }

  /** Emits valid form data when the user advances */
  @Output() stepCompleted = new EventEmitter<AddressData>();

  /** Emits when the user wants to go back */
  @Output() stepBack = new EventEmitter<void>();

  @HostBinding('class') hostClass = 'ui-step-address';

  countries: CountryOption[] = COUNTRIES;

  form = new FormGroup({
    street: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    postalCode: new FormControl('', [Validators.required, Validators.pattern(/^[\w\s\-]{3,10}$/)]),
    country: new FormControl('', [Validators.required]),
  });

  fieldTouched: Record<string, boolean> = {};

  private _dataPreFilled = false;

  ngOnInit(): void {
    // Smart default: detect country from browser locale
    if (!this._dataPreFilled && !this.form.get('country')?.value) {
      const detectedCountry = detectCountryFromLocale();
      this.form.patchValue({ country: detectedCountry });
    }
  }

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
    if (control.errors['pattern']) {
      return `Please enter a valid ${this.getFieldLabel(fieldName).toLowerCase()}`;
    }
    return '';
  }

  onSubmit(): void {
    Object.keys(this.form.controls).forEach(key => {
      this.fieldTouched[key] = true;
    });
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.stepCompleted.emit(this.form.value as AddressData);
    }
  }

  onBack(): void {
    this.stepBack.emit();
  }

  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      street: 'Street address',
      city: 'City',
      postalCode: 'Postal code',
      country: 'Country',
    };
    return labels[fieldName] ?? fieldName;
  }
}
