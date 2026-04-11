/** Configuration for a single step in the stepper */
export interface StepConfig {
  /** Unique identifier for the step */
  id: string;
  /** Display label shown in the stepper header */
  label: string;
  /** Whether the step is optional (affects validation) */
  optional?: boolean;
}

/** Possible states for a step indicator */
export type StepState = 'pending' | 'active' | 'completed';

/** Emitted when the user requests to navigate to a step */
export interface StepChangeEvent {
  /** The index of the step the user wants to navigate to */
  targetIndex: number;
  /** The index of the current step before navigation */
  currentIndex: number;
}
