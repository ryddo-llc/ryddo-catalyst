import { ContactForm } from '@/vibes/soul/sections/contact-form';

// Mock action, will replace with actual server action later
async function contactAction(_state: unknown, _formData: unknown) {
  'use server';

  void _state;
  void _formData;
  
  // Dummy await to satisfy linter
  await new Promise((resolve) => setTimeout(resolve, 0));
  
  return {
    lastResult: null,
    successMessage: "Thank you! We've received your service inquiry and will be in touch soon.",
  };
}

export default function ServiceContactPage() {
  return (
    <div className="space-y-8">

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 text-left">
            Get in<span className='text-pink-500'> Touch</span>
          </h2>
          <p className="text-md font-bold mb-6 text-gray-600">
            Have questions about our service or need to schedule an appointment? We're here to help!
          </p>
          <ContactForm 
            action={contactAction}
            contactEmail="service@ryddo.com"
            contactPhone="(323) 676-7433"
            emailLabel="Email *"
            howDidYouFindUsLabel="How did you find us?"
            nameLabel="Name *"
            phoneLabel="Phone Number"
            submitLabel="Send"
            successMessage="Thank you! We've received your service inquiry and will be in touch soon."
          />
        </div>
      </div>
    </div>
  );
} 