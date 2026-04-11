import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ContentChildren,
  QueryList,
  AfterContentInit,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepConfig, StepChangeEvent, StepState } from './stepper-form.model';
import { StepPanelDirective } from './step-panel.directive';

/**
 * Dumb (presentational) stepper form component.
 *
 * Displays a multi-step navigation header with progress bar,
 * and projects step content via ng-content. All state is driven
 * by inputs -- this component has zero services injected.
 *
 * Accessibility:
 * - Step buttons have aria-current="step" for the active step
 * - Progress bar uses role="progressbar" with aria-valuenow
 * - Step changes are announced via an aria-live region
 * - All interactive elements meet 44px minimum touch target
 * - Focus indicators use outline (not box-shadow)
 */
@Component({
  selector: 'ui-stepper-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stepper-form.component.html',
  styleUrl: './stepper-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperFormComponent implements AfterContentInit {
  /** Configuration for all steps (id, label, optional) */
  @Input() steps: StepConfig[] = [];

  /** Index of the currently active step (0-based) */
  @Input() currentStepIndex = 0;

  /** Whether to show the progress bar below the step header */
  @Input() showProgressBar = true;

  /** Emitted when the user clicks a step indicator to navigate */
  @Output() stepChange = new EventEmitter<StepChangeEvent>();

  /** Emitted when the user clicks the "previous" navigation button */
  @Output() previousStep = new EventEmitter<void>();

  /** Emitted when the user clicks the "next" navigation button */
  @Output() nextStep = new EventEmitter<void>();

  /** Emitted when the user clicks the submit button on the last step */
  @Output() formSubmit = new EventEmitter<void>();

  @ContentChildren(StepPanelDirective) stepPanels!: QueryList<StepPanelDirective>;

  /** Screen reader announcement text */
  srAnnouncement = '';

  ngAfterContentInit(): void {
    // Initial announcement
    this.announce();
  }

  /** Get the state of a step by index */
  getStepState(index: number): StepState {
    if (index === this.currentStepIndex) return 'active';
    if (index < this.currentStepIndex) return 'completed';
    return 'pending';
  }

  /** Progress percentage (0-100) */
  get progressPercent(): number {
    if (this.steps.length === 0) return 0;
    return Math.round(((this.currentStepIndex + 1) / this.steps.length) * 100);
  }

  /** Whether we're on the first step */
  get isFirstStep(): boolean {
    return this.currentStepIndex === 0;
  }

  /** Whether we're on the last step */
  get isLastStep(): boolean {
    return this.currentStepIndex === this.steps.length - 1;
  }

  /** Handle click on a step indicator */
  onStepClick(targetIndex: number): void {
    if (targetIndex === this.currentStepIndex) return;
    this.stepChange.emit({
      targetIndex,
      currentIndex: this.currentStepIndex,
    });
  }

  /** Handle previous button click */
  onPrevious(): void {
    this.previousStep.emit();
  }

  /** Handle next/submit button click */
  onNext(): void {
    if (this.isLastStep) {
      this.formSubmit.emit();
    } else {
      this.nextStep.emit();
    }
  }

  /** Get the template for a specific step index */
  getStepTemplate(index: number): TemplateRef<unknown> | null {
    if (!this.stepPanels) return null;
    const panel = this.stepPanels.toArray()[index];
    return panel ? panel.templateRef : null;
  }

  /** Label for the next/submit button */
  get nextButtonLabel(): string {
    if (this.isLastStep) return 'Submit Registration';
    if (this.currentStepIndex === this.steps.length - 2) return 'Review';
    return 'Continue';
  }

  /** Variant for the next/submit button */
  get nextButtonVariant(): string {
    return this.isLastStep ? 'btn--success' : 'btn--primary';
  }

  private announce(): void {
    if (this.steps.length === 0) return;
    const step = this.steps[this.currentStepIndex];
    this.srAnnouncement = '';
    // Reset then set to trigger aria-live
    setTimeout(() => {
      this.srAnnouncement = `Step ${this.currentStepIndex + 1} of ${this.steps.length}: ${step.label}`;
    }, 100);
  }
}
