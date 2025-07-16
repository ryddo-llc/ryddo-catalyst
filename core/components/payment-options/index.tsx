'use client';

import { Image } from '~/components/image';
import { useIsDesktop } from '~/lib/use-is-desktop';

import { PaymentOptionsAccordion } from './payment-options-accordion';
import { PaymentOptionsAccordionItem } from './payment-options-accordion-item';

export function PaymentOptions() {
  const isDesktop = useIsDesktop();
  const sectionStyle = {
    backgroundImage: 'url(/images/backgrounds/payment-options-background.jpg)',
    ...(isDesktop ? { backgroundAttachment: 'fixed' } : {}),
  };

  return (
    <section
      className="w-full h-[100vh] overflow-hidden relative flex items-center bg-cover bg-center font-['Nunito']"
      style={sectionStyle}
    >
      <div className="relative flex flex-col justify-center w-full max-w-md h-auto md:min-h-[420px] md:max-h-[540px] mx-4 md:ml-[16%] md:mr-0 -mt-[4%] overflow-hidden rounded-xl">
        {/* Background image with opacity */}
        <Image
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          fill
          priority={false}
          src="/images/backgrounds/newsletterform.png"
        />
        {/* Content */}
        <div className="relative p-6 sm:p-8">
          <h2 className="text-3xl sm:text-4xl font-bold -mt-8 -mb-2 text-center">
            Payment Options<span className="text-[#F92F7B] text-6xl">.</span>
          </h2>
          <div className="text-center text-neutral-700 text-lg font-bold mb-6">
            <div>we have great finance options</div>
            <div>as well as cash discounts</div>
          </div>
          <div className="md:px-2">
            <PaymentOptionsAccordion collapsible defaultValue="klarna" type="single" >
              <PaymentOptionsAccordionItem title="Finance with Klarna" value="klarna">
                <div>
                  Finance your new ride with <span className="text-pink-500 font-semibold">Klarna</span> and receive great rates with financing terms up to 36 months. Apply at <span className="text-pink-500 font-semibold">checkout</span> for an instant decision. <span className="text-pink-500 font-semibold">Learn more</span>
                </div>
              </PaymentOptionsAccordionItem>
              <PaymentOptionsAccordionItem title="ZIP Financing" value="zip">
                <div>
                  Split your payments in (4), <span className="text-pink-500 font-semibold">interest-free</span>, up to $3,000 with ZIP. <span className="text-pink-500 font-semibold">Learn more</span>
                </div>
              </PaymentOptionsAccordionItem>
              <PaymentOptionsAccordionItem title="Cash Discounts" value="cash">
                <div>
                  Receive a 2% in-store <span className="text-pink-500 font-semibold">discount</span> with a <span className="text-pink-500 font-semibold">cash payment</span>.
                </div>
              </PaymentOptionsAccordionItem>
            </PaymentOptionsAccordion>
          </div>
        </div>
      </div>
    </section>
  );
}
