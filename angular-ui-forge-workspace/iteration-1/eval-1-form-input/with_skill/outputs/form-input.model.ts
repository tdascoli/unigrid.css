/**
 * Form Input Component — Type Definitions
 *
 * Shared types for the FormInputComponent dumb component.
 * Exported from the library's public API via index.ts.
 */

/** Supported HTML input types for the form input component. */
export type FormInputType = 'text' | 'email' | 'tel' | 'number';

/** Validation state of the form input. */
export type FormInputState = 'default' | 'error' | 'success';

/** Size variants following the unigrid spacing scale. */
export type FormInputSize = 'sm' | 'md' | 'lg';
