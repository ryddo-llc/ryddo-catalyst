import { COUNTRIES } from '~/lib/constants/countries-states';

// Helper function to get country code from country ID
export const getCountryCode = (countryId: string): string => {
  const country = COUNTRIES.find(c => c.id === countryId);
  
  return country?.code || '+1';
};

// Validate email format
export const validateEmail = (email: string): boolean => {
  if (!email) return false;
  
  // Basic email regex pattern
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  // Check if email matches basic pattern
  if (!emailPattern.test(email)) return false;
  
  // Additional checks
  const parts = email.split('@');

  if (parts.length !== 2) return false;
  
  const [localPart, domain] = parts;
  
  // Local part checks
  if (!localPart || localPart.length === 0 || localPart.length > 64) return false;
  if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
  if (localPart.includes('..')) return false;
  
  // Domain checks
  if (!domain || domain.length === 0 || domain.length > 253) return false;
  if (domain.startsWith('.') || domain.endsWith('.')) return false;
  if (domain.includes('..')) return false;
  
  // Check for valid TLD (at least 2 characters)
  const tld = domain.split('.').pop();

  if (!tld || tld.length < 2) return false;
  
  return true;
};

// Validate zip code based on country
export const validateZipCode = (zipCode: string, countryId: string, state: string): boolean => {
  if (!zipCode) return false;
  
  if ((countryId === 'US' || countryId === 'CA') && ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'].includes(state)) {
    // Canadian postal codes: A1A 1A1 format
    const canadianPostalPattern = /^[A-Za-z]\d[A-Za-z][\s-]?\d[A-Za-z]\d$/i;

    return canadianPostalPattern.test(zipCode);
  } else if (countryId === 'US' || countryId === 'CA') {
    // US ZIP codes: 5 digits or ZIP+4 format
    const usZipPattern = /^\d{5}(-\d{4})?$/;
    
    return usZipPattern.test(zipCode);
  }
  
  // For other countries, accept any non-empty value
  return zipCode.trim().length > 0;
};

// Calculate age from date of birth
export const calculateAge = (dateOfBirth: string): number => {
  if (!dateOfBirth) return 0;

  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let calculatedAge = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    calculatedAge -= 1;
  }

  return calculatedAge;
};

// Format phone number as user types (US format)
export const formatPhoneNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, '');

  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;

  return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
};

export interface FormData {
  firstName: string;
  lastName: string;
  countryId: string;
  mobileNumber: string;
  email: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  agreement: boolean;
  minorsAgreement: boolean;
}

// Check if all required fields are filled
export const areRequiredFieldsFilled = (formData: FormData): boolean => {
  const requiredFields = [
    formData.firstName,
    formData.lastName,
    formData.mobileNumber,
    formData.email,
    formData.dateOfBirth,
    formData.address,
    formData.city,
    formData.state,
    formData.zipCode
  ];

  return requiredFields.every(field => field.trim() !== '');
};

// Check if agreements are valid
export const areAgreementsValid = (formData: FormData, isMinor: boolean): boolean => {
  const agreementChecked = formData.agreement;
  const minorsAgreementValid = isMinor ? formData.minorsAgreement : true;
  
  return agreementChecked && minorsAgreementValid;
};

// Check if form is valid
export const isFormValid = (formData: FormData, isUnder16: boolean, isMinor: boolean): boolean => {
  const allFieldsFilled = areRequiredFieldsFilled(formData);
  const ageValid = !isUnder16;
  const agreementsValid = areAgreementsValid(formData, isMinor);
  const emailValid = validateEmail(formData.email);
  const zipCodeValid = validateZipCode(formData.zipCode, formData.countryId, formData.state);

  return allFieldsFilled && ageValid && agreementsValid && emailValid && zipCodeValid;
}; 