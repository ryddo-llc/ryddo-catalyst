'use client';

import { useState } from 'react';

import { testRideWaiverContent } from '~/lib/data/terms-conditions';
import { Button } from '~/vibes/soul/primitives/button';
import { COUNTRIES, US_STATES } from '~/lib/constants/countries-states';

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
    
    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
          
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
    } catch (error) {
      console.error('Failed to submit waiver:', error);
      // Show error message to user
    } finally {
      setIsSubmitting(false);
    }
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