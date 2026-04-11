/** Data model for the personal information step */
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

/** Data model for the address step */
export interface AddressInfo {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

/** Complete registration form data */
export interface RegistrationFormData {
  personal: PersonalInfo;
  address: AddressInfo;
}

/** Country option for the country selector */
export interface CountryOption {
  code: string;
  name: string;
}

/** Supported registration step identifiers */
export type RegistrationStep = 'personal' | 'address' | 'review';
