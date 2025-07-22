'use client';

import { useState } from 'react';

import { testRideWaiverContent } from '~/lib/data/terms-conditions';
import { Button } from '~/vibes/soul/primitives/button';

interface FormData {
  firstName: string;
  lastName: string;
  countryCode: string;
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

// Create a sorted list of countries with US and Canada at the top
const COUNTRIES = [
  // Most relevant countries first
  { code: '+1', flag: '🇺🇸', name: 'United States' },
  { code: '+1', flag: '🇨🇦', name: 'Canada' },
  
  // Then alphabetical by country name
  { code: '+93', flag: '🇦🇫', name: 'Afghanistan' },
  { code: '+355', flag: '🇦🇱', name: 'Albania' },
  { code: '+213', flag: '🇩🇿', name: 'Algeria' },
  { code: '+376', flag: '🇦🇩', name: 'Andorra' },
  { code: '+244', flag: '🇦🇴', name: 'Angola' },
  { code: '+1264', flag: '🇦🇮', name: 'Anguilla' },
  { code: '+672', flag: '🇦🇶', name: 'Antarctica' },
  { code: '+1268', flag: '🇦🇬', name: 'Antigua and Barbuda' },
  { code: '+54', flag: '🇦🇷', name: 'Argentina' },
  { code: '+374', flag: '🇦🇲', name: 'Armenia' },
  { code: '+297', flag: '🇦🇼', name: 'Aruba' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+43', flag: '🇦🇹', name: 'Austria' },
  { code: '+994', flag: '🇦🇿', name: 'Azerbaijan' },
  { code: '+1242', flag: '🇧🇸', name: 'Bahamas' },
  { code: '+973', flag: '🇧🇭', name: 'Bahrain' },
  { code: '+880', flag: '🇧🇩', name: 'Bangladesh' },
  { code: '+1246', flag: '🇧🇧', name: 'Barbados' },
  { code: '+375', flag: '🇧🇾', name: 'Belarus' },
  { code: '+32', flag: '🇧🇪', name: 'Belgium' },
  { code: '+501', flag: '🇧🇿', name: 'Belize' },
  { code: '+229', flag: '🇧🇯', name: 'Benin' },
  { code: '+1441', flag: '🇧🇲', name: 'Bermuda' },
  { code: '+975', flag: '🇧🇹', name: 'Bhutan' },
  { code: '+591', flag: '🇧🇴', name: 'Bolivia' },
  { code: '+387', flag: '🇧🇦', name: 'Bosnia and Herzegovina' },
  { code: '+267', flag: '🇧🇼', name: 'Botswana' },
  { code: '+55', flag: '🇧🇷', name: 'Brazil' },
  { code: '+673', flag: '🇧🇳', name: 'Brunei' },
  { code: '+359', flag: '🇧🇬', name: 'Bulgaria' },
  { code: '+226', flag: '🇧🇫', name: 'Burkina Faso' },
  { code: '+257', flag: '🇧🇮', name: 'Burundi' },
  { code: '+855', flag: '🇰🇭', name: 'Cambodia' },
  { code: '+237', flag: '🇨🇲', name: 'Cameroon' },
  { code: '+238', flag: '🇨🇻', name: 'Cape Verde' },
  { code: '+1345', flag: '🇰🇾', name: 'Cayman Islands' },
  { code: '+236', flag: '🇨🇫', name: 'Central African Republic' },
  { code: '+235', flag: '🇹🇩', name: 'Chad' },
  { code: '+56', flag: '🇨🇱', name: 'Chile' },
  { code: '+86', flag: '🇨🇳', name: 'China' },
  { code: '+57', flag: '🇨🇴', name: 'Colombia' },
  { code: '+269', flag: '🇰🇲', name: 'Comoros' },
  { code: '+242', flag: '🇨🇬', name: 'Republic of the Congo' },
  { code: '+243', flag: '🇨🇩', name: 'Democratic Republic of the Congo' },
  { code: '+506', flag: '🇨🇷', name: 'Costa Rica' },
  { code: '+385', flag: '🇭🇷', name: 'Croatia' },
  { code: '+53', flag: '🇨🇺', name: 'Cuba' },
  { code: '+357', flag: '🇨🇾', name: 'Cyprus' },
  { code: '+420', flag: '🇨🇿', name: 'Czech Republic' },
  { code: '+45', flag: '🇩🇰', name: 'Denmark' },
  { code: '+253', flag: '🇩🇯', name: 'Djibouti' },
  { code: '+1767', flag: '🇩🇲', name: 'Dominica' },
  { code: '+1809', flag: '🇩🇴', name: 'Dominican Republic' },
  { code: '+593', flag: '🇪🇨', name: 'Ecuador' },
  { code: '+20', flag: '🇪🇬', name: 'Egypt' },
  { code: '+503', flag: '🇸🇻', name: 'El Salvador' },
  { code: '+240', flag: '🇬🇶', name: 'Equatorial Guinea' },
  { code: '+291', flag: '🇪🇷', name: 'Eritrea' },
  { code: '+372', flag: '🇪🇪', name: 'Estonia' },
  { code: '+251', flag: '🇪🇹', name: 'Ethiopia' },
  { code: '+298', flag: '🇫🇴', name: 'Faroe Islands' },
  { code: '+679', flag: '🇫🇯', name: 'Fiji' },
  { code: '+358', flag: '🇫🇮', name: 'Finland' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+594', flag: '🇬🇫', name: 'French Guiana' },
  { code: '+689', flag: '🇵🇫', name: 'French Polynesia' },
  { code: '+241', flag: '🇬🇦', name: 'Gabon' },
  { code: '+220', flag: '🇬🇲', name: 'Gambia' },
  { code: '+995', flag: '🇬🇪', name: 'Georgia' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+233', flag: '🇬🇭', name: 'Ghana' },
  { code: '+350', flag: '🇬🇮', name: 'Gibraltar' },
  { code: '+30', flag: '🇬🇷', name: 'Greece' },
  { code: '+299', flag: '🇬🇱', name: 'Greenland' },
  { code: '+1473', flag: '🇬🇩', name: 'Grenada' },
  { code: '+590', flag: '🇬🇵', name: 'Guadeloupe' },
  { code: '+1671', flag: '🇬🇺', name: 'Guam' },
  { code: '+502', flag: '🇬🇹', name: 'Guatemala' },
  { code: '+224', flag: '🇬🇳', name: 'Guinea' },
  { code: '+245', flag: '🇬🇼', name: 'Guinea-Bissau' },
  { code: '+592', flag: '🇬🇾', name: 'Guyana' },
  { code: '+509', flag: '🇭🇹', name: 'Haiti' },
  { code: '+504', flag: '🇭🇳', name: 'Honduras' },
  { code: '+852', flag: '🇭🇰', name: 'Hong Kong' },
  { code: '+36', flag: '🇭🇺', name: 'Hungary' },
  { code: '+354', flag: '🇮🇸', name: 'Iceland' },
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+62', flag: '🇮🇩', name: 'Indonesia' },
  { code: '+964', flag: '🇮🇶', name: 'Iraq' },
  { code: '+353', flag: '🇮🇪', name: 'Ireland' },
  { code: '+972', flag: '🇮🇱', name: 'Israel' },
  { code: '+39', flag: '🇮🇹', name: 'Italy' },
  { code: '+1876', flag: '🇯🇲', name: 'Jamaica' },
  { code: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: '+962', flag: '🇯🇴', name: 'Jordan' },
  { code: '+7', flag: '🇰🇿', name: 'Kazakhstan' },
  { code: '+254', flag: '🇰🇪', name: 'Kenya' },
  { code: '+82', flag: '🇰🇷', name: 'South Korea' },
  { code: '+965', flag: '🇰🇼', name: 'Kuwait' },
  { code: '+996', flag: '🇰🇬', name: 'Kyrgyzstan' },
  { code: '+856', flag: '🇱🇦', name: 'Laos' },
  { code: '+371', flag: '🇱🇻', name: 'Latvia' },
  { code: '+961', flag: '🇱🇧', name: 'Lebanon' },
  { code: '+423', flag: '🇱🇮', name: 'Liechtenstein' },
  { code: '+370', flag: '🇱🇹', name: 'Lithuania' },
  { code: '+352', flag: '🇱🇺', name: 'Luxembourg' },
  { code: '+853', flag: '🇲🇴', name: 'Macau' },
  { code: '+389', flag: '🇲🇰', name: 'North Macedonia' },
  { code: '+261', flag: '🇲🇬', name: 'Madagascar' },
  { code: '+265', flag: '🇲🇼', name: 'Malawi' },
  { code: '+60', flag: '🇲🇾', name: 'Malaysia' },
  { code: '+960', flag: '🇲🇻', name: 'Maldives' },
  { code: '+223', flag: '🇲🇱', name: 'Mali' },
  { code: '+356', flag: '🇲🇹', name: 'Malta' },
  { code: '+596', flag: '🇲🇶', name: 'Martinique' },
  { code: '+222', flag: '🇲🇷', name: 'Mauritania' },
  { code: '+230', flag: '🇲🇺', name: 'Mauritius' },
  { code: '+52', flag: '🇲🇽', name: 'Mexico' },
  { code: '+373', flag: '🇲🇩', name: 'Moldova' },
  { code: '+377', flag: '🇲🇨', name: 'Monaco' },
  { code: '+976', flag: '🇲🇳', name: 'Mongolia' },
  { code: '+382', flag: '🇲🇪', name: 'Montenegro' },
  { code: '+1664', flag: '🇲🇸', name: 'Montserrat' },
  { code: '+212', flag: '🇲🇦', name: 'Morocco' },
  { code: '+258', flag: '🇲🇿', name: 'Mozambique' },
  { code: '+95', flag: '🇲🇲', name: 'Myanmar' },
  { code: '+264', flag: '🇳🇦', name: 'Namibia' },
  { code: '+977', flag: '🇳🇵', name: 'Nepal' },
  { code: '+31', flag: '🇳🇱', name: 'Netherlands' },
  { code: '+687', flag: '🇳🇨', name: 'New Caledonia' },
  { code: '+64', flag: '🇳🇿', name: 'New Zealand' },
  { code: '+505', flag: '🇳🇮', name: 'Nicaragua' },
  { code: '+227', flag: '🇳🇪', name: 'Niger' },
  { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+47', flag: '🇳🇴', name: 'Norway' },
  { code: '+968', flag: '🇴🇲', name: 'Oman' },
  { code: '+92', flag: '🇵🇰', name: 'Pakistan' },
  { code: '+507', flag: '🇵🇦', name: 'Panama' },
  { code: '+675', flag: '🇵🇬', name: 'Papua New Guinea' },
  { code: '+595', flag: '🇵🇾', name: 'Paraguay' },
  { code: '+51', flag: '🇵🇪', name: 'Peru' },
  { code: '+63', flag: '🇵🇭', name: 'Philippines' },
  { code: '+48', flag: '🇵🇱', name: 'Poland' },
  { code: '+351', flag: '🇵🇹', name: 'Portugal' },
  { code: '+1787', flag: '🇵🇷', name: 'Puerto Rico' },
  { code: '+974', flag: '🇶🇦', name: 'Qatar' },
  { code: '+40', flag: '🇷🇴', name: 'Romania' },
  { code: '+250', flag: '🇷🇼', name: 'Rwanda' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+221', flag: '🇸🇳', name: 'Senegal' },
  { code: '+381', flag: '🇷🇸', name: 'Serbia' },
  { code: '+65', flag: '🇸🇬', name: 'Singapore' },
  { code: '+421', flag: '🇸🇰', name: 'Slovakia' },
  { code: '+386', flag: '🇸🇮', name: 'Slovenia' },
  { code: '+27', flag: '🇿🇦', name: 'South Africa' },
  { code: '+34', flag: '🇪🇸', name: 'Spain' },
  { code: '+94', flag: '🇱🇰', name: 'Sri Lanka' },
  { code: '+249', flag: '🇸🇩', name: 'Sudan' },
  { code: '+597', flag: '🇸🇷', name: 'Suriname' },
  { code: '+46', flag: '🇸🇪', name: 'Sweden' },
  { code: '+41', flag: '🇨🇭', name: 'Switzerland' },
  { code: '+963', flag: '🇸🇾', name: 'Syria' },
  { code: '+886', flag: '🇹🇼', name: 'Taiwan' },
  { code: '+992', flag: '🇹🇯', name: 'Tajikistan' },
  { code: '+255', flag: '🇹🇿', name: 'Tanzania' },
  { code: '+66', flag: '🇹🇭', name: 'Thailand' },
  { code: '+670', flag: '🇹🇱', name: 'Timor-Leste' },
  { code: '+228', flag: '🇹🇬', name: 'Togo' },
  { code: '+216', flag: '🇹🇳', name: 'Tunisia' },
  { code: '+90', flag: '🇹🇷', name: 'Turkey' },
  { code: '+993', flag: '🇹🇲', name: 'Turkmenistan' },
  { code: '+1649', flag: '🇹🇨', name: 'Turks and Caicos Islands' },
  { code: '+256', flag: '🇺🇬', name: 'Uganda' },
  { code: '+380', flag: '🇺🇦', name: 'Ukraine' },
  { code: '+971', flag: '🇦🇪', name: 'United Arab Emirates' },
  { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+598', flag: '🇺🇾', name: 'Uruguay' },
  { code: '+998', flag: '🇺🇿', name: 'Uzbekistan' },
  { code: '+58', flag: '🇻🇪', name: 'Venezuela' },
  { code: '+84', flag: '🇻🇳', name: 'Vietnam' },
  { code: '+967', flag: '🇾🇪', name: 'Yemen' },
  { code: '+260', flag: '🇿🇲', name: 'Zambia' },
  { code: '+263', flag: '🇿🇼', name: 'Zimbabwe' }
];

const US_STATES = [
  { value: '', label: '- Select Province/State -' },
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'DC', label: 'District of Columbia' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  // Canadian Provinces
  { value: 'AB', label: 'Alberta' },
  { value: 'BC', label: 'British Columbia' },
  { value: 'MB', label: 'Manitoba' },
  { value: 'NB', label: 'New Brunswick' },
  { value: 'NL', label: 'Newfoundland and Labrador' },
  { value: 'NS', label: 'Nova Scotia' },
  { value: 'NT', label: 'Northwest Territories' },
  { value: 'NU', label: 'Nunavut' },
  { value: 'ON', label: 'Ontario' },
  { value: 'PE', label: 'Prince Edward Island' },
  { value: 'QC', label: 'Quebec' },
  { value: 'SK', label: 'Saskatchewan' },
  { value: 'YT', label: 'Yukon' }
];

export function TestRideWaiverForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    countryCode: '+1',
    mobileNumber: '',
    email: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    agreement: false,
    minorsAgreement: false
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate email format
  const validateEmail = (email: string): boolean => {
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
  const validateZipCode = (zipCode: string, countryCode: string): boolean => {
    if (!zipCode) return false;
    
    if (countryCode === '+1' && ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'].includes(formData.state)) {
      // Canadian postal codes: A1A 1A1 format
      const canadianPostalPattern = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;

      return canadianPostalPattern.test(zipCode);
    } else if (countryCode === '+1') {
      // US ZIP codes: 5 digits or ZIP+4 format
      const usZipPattern = /^\d{5}(-\d{4})?$/;
      
      return usZipPattern.test(zipCode);
    }
    
    // For other countries, accept any non-empty value
    return zipCode.trim().length > 0;
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
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

  const userAge = calculateAge(formData.dateOfBirth);
  const isMinor = userAge < 18;
  const isUnder16 = userAge < 16;

  // Check if form is valid
  const isFormValid = () => {
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

    const allFieldsFilled = requiredFields.every(field => field.trim() !== '');
    const ageValid = !isUnder16;
    const agreementChecked = formData.agreement;
    const minorsAgreementValid = isMinor ? formData.minorsAgreement : true;
    const emailValid = validateEmail(formData.email);
    const zipCodeValid = validateZipCode(formData.zipCode, formData.countryCode);

    return allFieldsFilled && ageValid && agreementChecked && minorsAgreementValid && emailValid && zipCodeValid;
  };

  // Format phone number as user types (US format)
  const formatPhoneNumber = (value: string): string => {
    const numbers = value.replace(/\D/g, '');

    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;

    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    if (field === 'mobileNumber' && typeof value === 'string') {
      // Only format US phone numbers
      if (formData.countryCode === '+1') {
        const formattedValue = formatPhoneNumber(value);
        
        setFormData(prev => ({ ...prev, [field]: formattedValue }));
        
        return;
      }
    }

    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      countryCode: '+1',
      mobileNumber: '',
      email: '',
      dateOfBirth: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      agreement: false,
      minorsAgreement: false
    });
  };

  const closeSuccessMessage = () => {
    setShowSuccess(false);
  };

  return (
    <div className="w-full max-w-none">
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-green-800">Thank you!</h3>
              <p className="text-green-700">Your waiver has been submitted successfully.</p>
            </div>
            <button
              className="text-green-600 hover:text-green-800"
              onClick={closeSuccessMessage}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Personal Information */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="firstName">
                Name of Rider (Please Print) First Name *
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                id="firstName"
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
                type="text"
                value={formData.firstName}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lastName">
                Last Name *
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                id="lastName"
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
                type="text"
                value={formData.lastName}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="mobileNumber">
                Mobile Number *
              </label>
              <div className="flex items-end">
                <div className="relative">
                  <select
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleInputChange('countryCode', e.target.value)}
                    value={formData.countryCode}
                  >
                    {COUNTRIES.map(country => (
                      <option key={`${country.code}-${country.name}`} value={country.code}>
                        {country.flag} {country.name} ({country.code})
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 min-w-[60px] justify-center h-[42px]">
                    <span className="text-sm text-gray-700 font-medium">{formData.countryCode}</span>
                  </div>
                </div>
                <input
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  id="mobileNumber"
                  onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                  placeholder={formData.countryCode === '+1' ? '(555) 123-4567' : 'Enter phone number'}
                  required
                  type="tel"
                  value={formData.mobileNumber}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                Email Address *
              </label>
              <input
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  formData.email && !validateEmail(formData.email)
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300'
                }`}
                id="email"
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                type="email"
                value={formData.email}
              />
              {formData.email && !validateEmail(formData.email) ? (
                <p className="text-red-600 text-sm mt-1">Please enter a valid email address.</p>
              ) : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="dateOfBirth">
                Date of Birth *
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                id="dateOfBirth"
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                required
                type="date"
                value={formData.dateOfBirth}
              />
              {isUnder16 && (
                <p className="text-red-600 text-sm mt-1">Minimum age is 16 years old.</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address">
                Address *
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                id="address"
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
                type="text"
                value={formData.address}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="city">
                City *
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                id="city"
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
                type="text"
                value={formData.city}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="state">
                State *
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                id="state"
                onChange={(e) => handleInputChange('state', e.target.value)}
                required
                value={formData.state}
              >
                {US_STATES.map(state => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="zipCode">
                Zip Code *
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                id="zipCode"
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                placeholder={formData.countryCode === '+1' && ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'].includes(formData.state) ? 'A1A 1A1' : '12345'}
                required
                type="text"
                value={formData.zipCode}
              />
              {formData.zipCode && !validateZipCode(formData.zipCode, formData.countryCode) ? (
                <p className="text-red-600 text-sm mt-1">
                  {formData.countryCode === '+1' && ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'].includes(formData.state) 
                    ? 'Please enter a valid Canadian postal code (e.g., A1A 1A1)' 
                    : 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)'}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Agreement Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{testRideWaiverContent.title}</h2>
          
          <div className="prose prose-sm text-gray-700 mb-4 max-w-none">
            <p>
              {testRideWaiverContent.description}
            </p>
            
            {testRideWaiverContent.sections.map((section) => (
              <div className="mt-4" key={section.id}>
                <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                {section.type === 'numbered-list' ? (
                  <ol className="list-decimal list-inside space-y-2">
                    {section.items?.map((item, index) => (
                      <li className="text-gray-700" dangerouslySetInnerHTML={{ __html: item }} key={index} />
                    ))}
                  </ol>
                ) : (
                  <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: section.content || '' }} />
                )}
              </div>
            ))}
          </div>

          <div className="flex items-start space-x-3 mb-4">
            <input
              checked={formData.agreement}
              className="mt-1 h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              id="agreement"
              onChange={(e) => handleInputChange('agreement', e.target.checked)}
              required
              type="checkbox"
            />
            <div>
              <label className="text-sm text-gray-700" htmlFor="agreement">
                By checking this box, I am signing this document and agree to all of the above statements.
              </label>
              <div className="mt-1">
                <a
                  className="text-pink-600 hover:text-pink-700 underline text-sm"
                  href="/privacy-policy/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Privacy Policy *
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Minors Section */}
        <div className={`bg-white p-6 rounded-lg border ${isMinor ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'}`}>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {testRideWaiverContent.minorsSection.title}
            {isMinor && <span className="text-yellow-700 text-sm font-normal ml-2">(This section applies to you)</span>}
          </h2>
          
          <div className="prose prose-sm text-gray-700 mb-4 max-w-none">
            <p>
              {testRideWaiverContent.minorsSection.description}
            </p>
            <p className="font-semibold uppercase">
              {testRideWaiverContent.minorsSection.agreement}
            </p>
          </div>

          <div className="flex items-start space-x-3">
            <input
              checked={formData.minorsAgreement}
              className="mt-1 h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              disabled={!isMinor}
              id="minorsAgreement"
              onChange={(e) => handleInputChange('minorsAgreement', e.target.checked)}
              required={isMinor}
              type="checkbox"
            />
            <div>
              <label className={`text-sm ${!isMinor ? 'text-gray-400' : 'text-gray-700'}`} htmlFor="minorsAgreement">
                By checking this box, I am signing this document and agree to the above statement.
              </label>
              <div className="mt-1">
                <a
                  className="text-pink-600 hover:text-pink-700 underline text-sm"
                  href="/privacy-policy/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Privacy Policy *
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            className="px-8 py-3 text-white"
            disabled={!isFormValid() || isSubmitting}
            size="medium"
            type="submit"
            variant="primary"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>

        {!isFormValid() && (
          <div className="text-center text-gray-500 text-sm">
            Please complete all required fields and check the agreement boxes.
          </div>
        )}
      </form>
    </div>
  );
} 