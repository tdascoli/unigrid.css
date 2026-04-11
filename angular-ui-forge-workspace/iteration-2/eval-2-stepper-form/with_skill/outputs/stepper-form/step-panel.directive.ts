import { Directive, TemplateRef } from '@angular/core';

/**
 * Structural directive used to mark step content templates
 * within the stepper form.
 *
 * Usage:
 * ```html
 * <ui-stepper-form [steps]="steps" [currentStepIndex]="current">
 *   <ng-template uiStepPanel>
 *     <!-- Step 1 content -->
 *   </ng-template>
 *   <ng-template uiStepPanel>
 *     <!-- Step 2 content -->
 *   </ng-template>
 * </ui-stepper-form>
 * ```
 */
@Directive({
  selector: '[uiStepPanel]',
  standalone: true,
})
export class StepPanelDirective {
  constructor(public readonly templateRef: TemplateRef<unknown>) {}
}
