import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  HostBinding,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepDefinition, StepStatus } from '../registration-form.model';

/**
 * Stepper Indicator (Dumb Component)
 *
 * Displays a horizontal progress indicator showing all steps in the
 * registration flow. Highlights the current step and marks completed steps.
 *
 * Behavioral Economics:
 * - Progress anchoring: visual progress bar motivates completion
 * - Chunking: numbered steps reduce cognitive load of the full process
 *
 * Accessibility:
 * - Uses aria-label on the nav element
 * - Each step has aria-current="step" when active
 * - Completed steps are announced via aria-label
 * - Keyboard navigable: completed steps are clickable buttons
 */
@Component({
  selector: 'ui-stepper-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stepper-indicator.component.html',
  styleUrl: './stepper-indicator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperIndicatorComponent {
  /** List of step definitions */
  @Input() steps: StepDefinition[] = [];

  /** Index of the currently active step (0-based) */
  @Input() currentStep = 0;

  /** Set of completed step indices */
  @Input() completedSteps: Set<number> = new Set();

  /** Emits when the user clicks a completed step to navigate back */
  @Output() stepClicked = new EventEmitter<number>();

  @HostBinding('class') hostClass = 'ui-stepper-indicator';

  getStepStatus(index: number): StepStatus {
    if (index === this.currentStep) return 'active';
    if (this.completedSteps.has(index)) return 'completed';
    return 'pending';
  }

  /** Progress percentage for the connecting line */
  get progressPercent(): number {
    if (this.steps.length <= 1) return 0;
    return (this.currentStep / (this.steps.length - 1)) * 100;
  }

  onStepClick(index: number): void {
    if (this.completedSteps.has(index)) {
      this.stepClicked.emit(index);
    }
  }

  isStepClickable(index: number): boolean {
    return this.completedSteps.has(index);
  }
}
