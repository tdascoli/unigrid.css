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
import { FormsModule } from '@angular/forms';
import { FormInputType, FormInputState } from './form-input.model';

let nextId = 0;

@Component({
  selector: 'ui-form-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormInputComponent implements OnInit {
  /** The input type — determines keyboard on mobile via inputmode. */
  @Input() type: FormInputType = 'text';

  /** Floating label text. */
  @Input() label = '';

  /** Current value of the input. */
  @Input() value = '';

  /** Placeholder text (required for Bootstrap floating labels to work). */
  @Input() placeholder = '';

  /** Validation state: default, error, or success. */
  @Input() state: FormInputState = 'default';

  /** Error message shown when state is 'error'. */
  @Input() errorMessage = '';

  /** Success message shown when state is 'success'. */
  @Input() successMessage = '';

  /** Hint text displayed below the input in default state. */
  @Input() hint = '';

  /** Whether the input is disabled. */
  @Input() disabled = false;

  /** Whether the input is required. */
  @Input() required = false;

  /** Optional custom id. Auto-generated if not provided. */
  @Input() inputId = '';

  /** Emits when the value changes. */
  @Output() valueChange = new EventEmitter<string>();

  /** Emits on blur for triggering validation. */
  @Output() blurred = new EventEmitter<void>();

  /** Computed id for the feedback element, used by aria-describedby. */
  get feedbackId(): string {
    return `${this.inputId}-feedback`;
  }

  /** Computed id for the hint element, used by aria-describedby. */
  get hintId(): string {
    return `${this.inputId}-hint`;
  }

  /**
   * Build the aria-describedby value linking to feedback and/or hint.
   * Returns null when there is nothing to describe (keeps DOM clean).
   */
  get ariaDescribedBy(): string | null {
    const ids: string[] = [];
    if (this.state === 'error' && this.errorMessage) {
      ids.push(this.feedbackId);
    } else if (this.state === 'success' && this.successMessage) {
      ids.push(this.feedbackId);
    }
    if (this.hint && this.state === 'default') {
      ids.push(this.hintId);
    }
    return ids.length ? ids.join(' ') : null;
  }

  /** Map input type to the correct mobile inputmode attribute. */
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

  @HostBinding('class') readonly hostClass = 'ui-form-input';

  ngOnInit(): void {
    if (!this.inputId) {
      this.inputId = `ui-input-${nextId++}`;
    }
    if (!this.placeholder) {
      this.placeholder = this.label;
    }
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.valueChange.emit(this.value);
  }

  onBlur(): void {
    this.blurred.emit();
  }
}
