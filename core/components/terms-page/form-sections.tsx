import { COUNTRIES, US_STATES } from '~/lib/constants/countries-states';
import { testRideWaiverContent } from '~/lib/data/terms-conditions';
import { type FormData, getCountryCode, validateEmail, validateZipCode } from '~/lib/utils/form-validation';
import { createSanitizedHtml } from '~/lib/utils/sanitize-html';

interface FormSectionsProps {
  formData: FormData;
  isMinor: boolean;
  isUnder16: boolean;
  onInputChange: (field: keyof FormData, value: string | boolean) => void;
}

export function PersonalInformationSection({ formData, isUnder16, onInputChange }: FormSectionsProps) {
  return (
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
            onChange={(e) => onInputChange('firstName', e.target.value)}
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
            onChange={(e) => onInputChange('lastName', e.target.value)}
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
                onChange={(e) => onInputChange('countryId', e.target.value)}
                value={formData.countryId}
              >
                {COUNTRIES.map(country => (
                  <option key={`${country.id}-${country.name}`} value={country.id}>
                    {country.flag} {country.name} ({country.code})
                  </option>
                ))}
              </select>
              <div className="flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 min-w-[60px] justify-center h-[42px]">
                <span className="text-sm text-gray-700 font-medium">{getCountryCode(formData.countryId)}</span>
              </div>
            </div>
            <input
              className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              id="mobileNumber"
              onChange={(e) => onInputChange('mobileNumber', e.target.value)}
              placeholder={getCountryCode(formData.countryId) === '+1' ? '(555) 123-4567' : 'Enter phone number'}
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
            onChange={(e) => onInputChange('email', e.target.value)}
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
            onChange={(e) => onInputChange('dateOfBirth', e.target.value)}
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
            onChange={(e) => onInputChange('address', e.target.value)}
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
            onChange={(e) => onInputChange('city', e.target.value)}
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
            onChange={(e) => onInputChange('state', e.target.value)}
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
            onChange={(e) => onInputChange('zipCode', e.target.value)}
            placeholder={getCountryCode(formData.countryId) === '+1' && ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'].includes(formData.state) ? 'A1A 1A1' : '12345'}
            required
            type="text"
            value={formData.zipCode}
          />
          {formData.zipCode && !validateZipCode(formData.zipCode, formData.countryId, formData.state) ? (
            <p className="text-red-600 text-sm mt-1">
              {getCountryCode(formData.countryId) === '+1' && ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'].includes(formData.state) 
                ? 'Please enter a valid Canadian postal code (e.g., A1A 1A1)' 
                : 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)'}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function AgreementSection({ formData, onInputChange }: FormSectionsProps) {
  return (
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
                  <li className="text-gray-700" dangerouslySetInnerHTML={createSanitizedHtml(item)} key={index} />
                ))}
              </ol>
            ) : (
              <p className="text-gray-700" dangerouslySetInnerHTML={createSanitizedHtml(section.content || '')} />
            )}
          </div>
        ))}
      </div>

      <div className="flex items-start space-x-3 mb-4">
        <input
          checked={formData.agreement}
          className="mt-1 h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
          id="agreement"
          onChange={(e) => onInputChange('agreement', e.target.checked)}
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
  );
}

export function MinorsSection({ formData, isMinor, onInputChange }: FormSectionsProps) {
  return (
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
          onChange={(e) => onInputChange('minorsAgreement', e.target.checked)}
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
  );
} 