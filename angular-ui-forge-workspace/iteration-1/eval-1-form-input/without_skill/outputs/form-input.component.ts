import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  OnInit,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

/** Supported input types for the form input component. */
export type FormInputType = 'text' | 'email' | 'tel' | 'number';

/** Validation state of the form input. */
export type FormInputState = 'default' | 'error' | 'success';

/** Unique ID counter for generating accessible label-input associations. */
let nextId = 0;

@Component({
  selector: 'ui-form-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true,
    },
  ],
})
export class FormInputComponent implements ControlValueAccessor, OnInit {
  /** HTML input type */
  @Input() type: FormInputType = 'text';

  /** Floating label text */
  @Input() label = '';

  /** Placeholder text (shown when input is empty and unfocused) */
  @Input() placeholder = ' ';

  /** Validation state controlling visual feedback */
  @Input() state: FormInputState = 'default';

  /** Error message displayed below the input in error state */
  @Input() errorMessage = '';

  /** Success message displayed below the input in success state */
  @Input() successMessage = '';

  /** Help text displayed below the input */
  @Input() helpText = '';

  /** Whether the input is disabled */
  @Input() disabled = false;

  /** Whether the input is required */
  @Input() required = false;

  /** Autocomplete attribute value */
  @Input() autocomplete = 'off';

  /** Minimum value (for number type) */
  @Input() min?: number;

  /** Maximum value (for number type) */
  @Input() max?: number;

  /** Step value (for number type) */
  @Input() step?: number;

  /** Pattern for validation (regex string) */
  @Input() pattern?: string;

  /** Maximum character length */
  @Input() maxlength?: number;

  /** Custom inputmode for mobile keyboards */
  @Input() inputMode?: string;

  /** Blur event emitter */
  @Output() blurred = new EventEmitter<FocusEvent>();

  /** Focus event emitter */
  @Output() focused = new EventEmitter<FocusEvent>();

  /** Value change emitter (in addition to CVA) */
  @Output() valueChange = new EventEmitter<string>();

  /** Internal unique ID for accessible label association */
  inputId = '';

  /** Internal unique ID for the description element */
  descriptionId = '';

  /** Whether the input currently has focus */
  isFocused = false;

  /** The current value of the input */
  value = '';

  @HostBinding('class') get hostClass(): string {
    const classes = ['ui-form-input'];
    if (this.state !== 'default') {
      classes.push(`ui-form-input--${this.state}`);
    }
    if (this.disabled) {
      classes.push('ui-form-input--disabled');
    }
    if (this.isFocused) {
      classes.push('ui-form-input--focused');
    }
    if (this.hasValue) {
      classes.push('ui-form-input--filled');
    }
    return classes.join(' ');
  }

  /** Whether the input has a non-empty value */
  get hasValue(): boolean {
    return this.value !== null && this.value !== undefined && this.value !== '';
  }

  /** Whether a description message should be displayed */
  get hasDescription(): boolean {
    return !!(
      (this.state === 'error' && this.errorMessage) ||
      (this.state === 'success' && this.successMessage) ||
      this.helpText
    );
  }

  /** The description text to display */
  get descriptionText(): string {
    if (this.state === 'error' && this.errorMessage) {
      return this.errorMessage;
    }
    if (this.state === 'success' && this.successMessage) {
      return this.successMessage;
    }
    return this.helpText;
  }

  /** The aria-describedby value for the input */
  get ariaDescribedBy(): string | null {
    return this.hasDescription ? this.descriptionId : null;
  }

  /** Resolved inputmode based on type */
  get resolvedInputMode(): string | undefined {
    if (this.inputMode) return this.inputMode;
    switch (this.type) {
      case 'email':
        return 'email';
      case 'tel':
        return 'tel';
      case 'number':
        return 'decimal';
      default:
        return undefined;
    }
  }

  // ControlValueAccessor callbacks
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    const id = nextId++;
    this.inputId = `ui-form-input-${id}`;
    this.descriptionId = `ui-form-input-desc-${id}`;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  onFocus(event: FocusEvent): void {
    this.isFocused = true;
    this.focused.emit(event);
  }

  onBlur(event: FocusEvent): void {
    this.isFocused = false;
    this.onTouched();
    this.blurred.emit(event);
  }

  // --- ControlValueAccessor implementation ---

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
