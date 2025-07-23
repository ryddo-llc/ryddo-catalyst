'use client';

import { useState } from 'react';

import { 
  calculateAge,
  formatPhoneNumber,
  type FormData,
  getCountryCode,
  isFormValid 
} from '~/lib/utils/form-validation';
import { Button } from '~/vibes/soul/primitives/button';

import { AgreementSection, MinorsSection, PersonalInformationSection } from './form-sections';

export function TestRideWaiverForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    countryId: 'US',
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
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userAge = calculateAge(formData.dateOfBirth);
  const isMinor = userAge < 18;
  const isUnder16 = userAge < 16;

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    if (field === 'mobileNumber' && typeof value === 'string') {
      // Only format US phone numbers
      if (getCountryCode(formData.countryId) === '+1') {
        const formattedValue = formatPhoneNumber(value);
        
        setFormData(prev => ({ ...prev, [field]: formattedValue }));
        
        return;
      }
    }

    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      countryId: 'US',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid(formData, isUnder16, isMinor)) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
          
      setShowSuccess(true);
      resetForm();
    } catch {
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccessMessage = () => {
    setShowSuccess(false);
  };

  const closeErrorMessage = () => {
    setShowError(false);
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
              aria-label="Dismiss message"
              className="text-green-600 hover:text-green-800"
              onClick={closeSuccessMessage}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {showError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-red-800">Submission Failed</h3>
              <p className="text-red-700">There was an error submitting your waiver. Please try again.</p>
            </div>
            <button
              className="text-red-600 hover:text-red-800"
              onClick={closeErrorMessage}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <PersonalInformationSection 
          formData={formData}
          isMinor={isMinor}
          isUnder16={isUnder16}
          onInputChange={handleInputChange}
        />

        <AgreementSection 
          formData={formData}
          isMinor={isMinor}
          isUnder16={isUnder16}
          onInputChange={handleInputChange}
        />

        <MinorsSection 
          formData={formData}
          isMinor={isMinor}
          isUnder16={isUnder16}
          onInputChange={handleInputChange}
        />

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            className="px-8 py-3 text-white"
            disabled={!isFormValid(formData, isUnder16, isMinor) || isSubmitting}
            size="medium"
            type="submit"
            variant="primary"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>

        {!isFormValid(formData, isUnder16, isMinor) && (
          <div className="text-center text-gray-500 text-sm">
            Please complete all required fields and check the agreement boxes.
          </div>
        )}
      </form>
    </div>
  );
} 