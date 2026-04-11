/**
 * Registration Form — Shared Models
 *
 * All interfaces and types used across the registration stepper components.
 */

/** Step metadata for the stepper indicator */
export interface StepDefinition {
  index: number;
  label: string;
  description?: string;
  icon?: string;
}

/** Step completion status */
export type StepStatus = 'pending' | 'active' | 'completed' | 'error';

/** Personal Info step form data */
export interface PersonalInfoData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

/** Address step form data */
export interface AddressData {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

/** Complete registration form data */
export interface RegistrationFormData {
  personalInfo: PersonalInfoData;
  address: AddressData;
}

/** Country option for the country select */
export interface CountryOption {
  code: string;
  name: string;
}

/** Common countries list (subset for demonstration) */
export const COUNTRIES: CountryOption[] = [
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgium' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'DE', name: 'Germany' },
  { code: 'DK', name: 'Denmark' },
  { code: 'ES', name: 'Spain' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IT', name: 'Italy' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NO', name: 'Norway' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'SE', name: 'Sweden' },
  { code: 'US', name: 'United States' },
];

/** Map of browser locale prefixes to country codes for smart defaults */
export const LOCALE_COUNTRY_MAP: Record<string, string> = {
  'de-CH': 'CH',
  'fr-CH': 'CH',
  'it-CH': 'CH',
  'de-DE': 'DE',
  'de-AT': 'AT',
  'fr-FR': 'FR',
  'fr-BE': 'BE',
  'nl-BE': 'BE',
  'nl-NL': 'NL',
  'en-GB': 'GB',
  'en-US': 'US',
  'en-IE': 'IE',
  'it-IT': 'IT',
  'es-ES': 'ES',
  'pt-PT': 'PT',
  'pl-PL': 'PL',
  'da-DK': 'DK',
  'sv-SE': 'SE',
  'nb-NO': 'NO',
  'fi-FI': 'FI',
  'de': 'DE',
  'fr': 'FR',
  'it': 'IT',
  'en': 'US',
  'es': 'ES',
  'pt': 'PT',
  'nl': 'NL',
  'pl': 'PL',
  'da': 'DK',
  'sv': 'SE',
  'nb': 'NO',
  'fi': 'FI',
};

/**
 * Detect country from browser locale.
 * Tries navigator.language first (e.g. "de-CH" -> "CH"),
 * then falls back to the base language (e.g. "de" -> "DE").
 */
export function detectCountryFromLocale(): string {
  if (typeof navigator === 'undefined') {
    return 'CH'; // SSR fallback
  }
  const locale = navigator.language;
  if (LOCALE_COUNTRY_MAP[locale]) {
    return LOCALE_COUNTRY_MAP[locale];
  }
  const base = locale.split('-')[0];
  return LOCALE_COUNTRY_MAP[base] ?? 'CH';
}
