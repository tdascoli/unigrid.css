import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormInputType, FormInputState, FormInputSize } from './form-input.model';

/**
 * FormInputComponent — Dumb / Presentational
 *
 * A reusable form input with floating label, inline validation,
 * error/success states, and full accessibility support.
 *
 * Supports text, email, tel, and number input types.
 * Mobile-first, rhythm-aligned to unigrid.css vertical grid.
 *
 * Design decisions:
 *  - Floating label reduces visual noise (progressive disclosure)
 *  - Inline validation prevents errors at the source (friction reduction / loss aversion)
 *  - Smart inputmode per type for correct mobile keyboards (friction reduction)
 *  - Optional fields labelled "(optional)" instead of asterisks on required (behavioral economics)
 *  - Success state provides positive reinforcement (anchoring / framing)
 */
@Component({
  selector: 'ui-form-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormInputComponent implements AfterViewInit, OnDestroy {
  // ─── Inputs ──────────────────────────────────────────────

  /** Floating label text (also used as accessible label). */
  @Input() label = '';

  /** HTML input type. */
  @Input() type: FormInputType = 'text';

  /** Current value of the input. */
  @Input() value: string | number = '';

  /** Placeholder shown when the input is empty and not focused. */
  @Input() placeholder = ' ';

  /** Unique ID for the input element. Auto-generated if not provided. */
  @Input() inputId: string = `ui-input-${FormInputComponent.nextId++}`;

  /** Name attribute for the native input. */
  @Input() name = '';

  /** Validation state — controls visual appearance and ARIA attributes. */
  @Input() state: FormInputState = 'default';

  /** Error message displayed below the input when state is 'error'. */
  @Input() errorMessage = '';

  /** Success message displayed below the input when state is 'success'. */
  @Input() successMessage = '';

  /** Hint / help text displayed below the input in default state. */
  @Input() hint = '';

  /** Whether the field is required. */
  @Input() required = false;

  /** Whether the field is disabled. */
  @Input() disabled = false;

  /** Whether the field is readonly. */
  @Input() readonly = false;

  /** Size variant following the spacing scale. */
  @Input() size: FormInputSize = 'md';

  /** Autocomplete attribute for browser autofill. */
  @Input() autocomplete = '';

  /** Maximum length for the input value. */
  @Input() maxlength: number | null = null;

  /** Minimum value for number inputs. */
  @Input() min: number | null = null;

  /** Maximum value for number inputs. */
  @Input() max: number | null = null;

  /** Step value for number inputs. */
  @Input() step: number | null = null;

  /** Pattern for input validation (regex string). */
  @Input() pattern = '';

  // ─── Outputs ─────────────────────────────────────────────

  /** Emits the current value on every input event. */
  @Output() valueChange = new EventEmitter<string | number>();

  /** Emits on blur for validation triggering. */
  @Output() blurred = new EventEmitter<FocusEvent>();

  /** Emits on focus. */
  @Output() focused = new EventEmitter<FocusEvent>();

  // ─── Internal ────────────────────────────────────────────

  @ViewChild('inputEl') inputRef!: ElementRef<HTMLInputElement>;

  /** Auto-increment counter for unique IDs. */
  private static nextId = 0;

  /** Tracks whether the input currently has focus. */
  isFocused = false;

  /** Tracks whether the user has interacted with the field (for dirty state). */
  isTouched = false;

  // ─── Host bindings ───────────────────────────────────────

  @HostBinding('class') get hostClass(): string {
    const classes = [
      'ui-form-input',
      `ui-form-input--${this.size}`,
      `ui-form-input--${this.state}`,
    ];
    if (this.isFocused) classes.push('ui-form-input--focused');
    if (this.disabled) classes.push('ui-form-input--disabled');
    if (this.hasValue) classes.push('ui-form-input--has-value');
    return classes.join(' ');
  }

  // ─── Computed properties ─────────────────────────────────

  /** Whether the input has a non-empty value. */
  get hasValue(): boolean {
    return this.value !== '' && this.value !== null && this.value !== undefined;
  }

  /** The floating label should be raised when focused or has value. */
  get isLabelFloated(): boolean {
    return this.isFocused || this.hasValue;
  }

  /** Resolved inputmode for mobile keyboards. */
  get inputMode(): string {
    switch (this.type) {
      case 'email':
        return 'email';
      case 'tel':
        return 'tel';
      case 'number':
        return 'decimal';
      default:
        return 'text';
    }
  }

  /** ID for the description/error element (aria-describedby target). */
  get descriptionId(): string {
    return `${this.inputId}-desc`;
  }

  /** The message displayed below the input. */
  get feedbackMessage(): string {
    if (this.state === 'error' && this.errorMessage) return this.errorMessage;
    if (this.state === 'success' && this.successMessage) return this.successMessage;
    return this.hint;
  }

  /** Whether any feedback message is present. */
  get hasFeedback(): boolean {
    return !!this.feedbackMessage;
  }

  /** ARIA invalid attribute value. */
  get ariaInvalid(): boolean {
    return this.state === 'error';
  }

  // ─── Lifecycle ───────────────────────────────────────────

  ngAfterViewInit(): void {
    // No-op placeholder for future enhancements (e.g. autofocus).
  }

  ngOnDestroy(): void {
    // Clean up if needed.
  }

  // ─── Event handlers ──────────────────────────────────────

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newValue = this.type === 'number' ? target.valueAsNumber : target.value;
    this.value = newValue;
    this.valueChange.emit(newValue);
  }

  onFocus(event: FocusEvent): void {
    this.isFocused = true;
    this.focused.emit(event);
  }

  onBlur(event: FocusEvent): void {
    this.isFocused = false;
    this.isTouched = true;
    this.blurred.emit(event);
  }
}
