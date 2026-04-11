import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

interface StepConfig {
  label: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
})
export class RegistrationFormComponent implements OnInit {
  currentStep = signal(0);
  submitted = signal(false);
  submitting = signal(false);

  steps: StepConfig[] = [
    {
      label: 'Personal Info',
      icon: 'person',
      description: 'Tell us about yourself',
    },
    {
      label: 'Address',
      icon: 'home',
      description: 'Where do you live?',
    },
    {
      label: 'Review & Submit',
      icon: 'check_circle',
      description: 'Confirm your details',
    },
  ];

  personalInfoForm!: FormGroup;
  addressForm!: FormGroup;

  isFirstStep = computed(() => this.currentStep() === 0);
  isLastStep = computed(() => this.currentStep() === this.steps.length - 1);
  progressPercent = computed(
    () => ((this.currentStep() + 1) / this.steps.length) * 100
  );

  private detectedCountry = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.detectedCountry = this.detectCountryFromLocale();
    this.initForms();
  }

  private initForms(): void {
    this.personalInfoForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-()]{7,15}$/)]],
    });

    this.addressForm = this.fb.group({
      street: ['', [Validators.required, Validators.minLength(3)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      postalCode: ['', [Validators.required, Validators.pattern(/^[\w\s\-]{3,10}$/)]],
      country: [this.detectedCountry, [Validators.required]],
    });
  }

  private detectCountryFromLocale(): string {
    try {
      const locale = navigator.language || 'en-US';
      const parts = locale.split('-');
      const regionCode = parts.length > 1 ? parts[1].toUpperCase() : 'US';
      return this.mapRegionToCountry(regionCode);
    } catch {
      return 'United States';
    }
  }

  private mapRegionToCountry(code: string): string {
    const countryMap: Record<string, string> = {
      US: 'United States',
      GB: 'United Kingdom',
      DE: 'Germany',
      FR: 'France',
      ES: 'Spain',
      IT: 'Italy',
      NL: 'Netherlands',
      BE: 'Belgium',
      AT: 'Austria',
      CH: 'Switzerland',
      CA: 'Canada',
      AU: 'Australia',
      NZ: 'New Zealand',
      JP: 'Japan',
      KR: 'South Korea',
      CN: 'China',
      IN: 'India',
      BR: 'Brazil',
      MX: 'Mexico',
      SE: 'Sweden',
      NO: 'Norway',
      DK: 'Denmark',
      FI: 'Finland',
      PL: 'Poland',
      PT: 'Portugal',
      IE: 'Ireland',
    };
    return countryMap[code] ?? 'United States';
  }

  get countries(): string[] {
    return [
      'Australia',
      'Austria',
      'Belgium',
      'Brazil',
      'Canada',
      'China',
      'Denmark',
      'Finland',
      'France',
      'Germany',
      'India',
      'Ireland',
      'Italy',
      'Japan',
      'Mexico',
      'Netherlands',
      'New Zealand',
      'Norway',
      'Poland',
      'Portugal',
      'South Korea',
      'Spain',
      'Sweden',
      'Switzerland',
      'United Kingdom',
      'United States',
    ];
  }

  get currentFormGroup(): FormGroup | null {
    switch (this.currentStep()) {
      case 0:
        return this.personalInfoForm;
      case 1:
        return this.addressForm;
      default:
        return null;
    }
  }

  canProceed(): boolean {
    const form = this.currentFormGroup;
    return form ? form.valid : true;
  }

  nextStep(): void {
    const form = this.currentFormGroup;
    if (form) {
      form.markAllAsTouched();
      if (!form.valid) return;
    }
    if (this.currentStep() < this.steps.length - 1) {
      this.currentStep.update((s) => s + 1);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 0) {
      this.currentStep.update((s) => s - 1);
    }
  }

  goToStep(index: number): void {
    if (index < this.currentStep()) {
      this.currentStep.set(index);
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.personalInfoForm.valid || !this.addressForm.valid) return;

    this.submitting.set(true);

    const payload = {
      ...this.personalInfoForm.value,
      ...this.addressForm.value,
    };

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Registration submitted:', payload);
      this.submitted.set(true);
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      this.submitting.set(false);
    }
  }

  resetForm(): void {
    this.personalInfoForm.reset();
    this.addressForm.reset({ country: this.detectedCountry });
    this.currentStep.set(0);
    this.submitted.set(false);
  }

  getFieldError(form: FormGroup, field: string): string {
    const control = form.get(field);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) return `${this.formatFieldName(field)} is required`;
    if (control.errors['email']) return 'Please enter a valid email address';
    if (control.errors['minlength']) {
      const min = control.errors['minlength'].requiredLength;
      return `Must be at least ${min} characters`;
    }
    if (control.errors['pattern']) return `Please enter a valid ${this.formatFieldName(field)}`;
    return 'Invalid value';
  }

  private formatFieldName(field: string): string {
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (s) => s.toUpperCase())
      .trim();
  }
}
