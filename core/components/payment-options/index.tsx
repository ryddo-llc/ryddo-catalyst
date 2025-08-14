'use client';

import { Image } from '~/components/image';
import { Link } from '~/components/link';

import { PaymentOptionsAccordion, PaymentOptionsAccordionItem } from './payment-options-accordion';

export function PaymentOptions() {
  return (
    <section
      className="relative w-full h-screen max-h-[800px] overflow-hidden bg-cover bg-center py-20 font-['Nunito'] bg-[url(/images/backgrounds/payment-options-background.webp)] md:bg-fixed"
    >
      <div
        className="relative mx-auto lg:ml-[16vw] lg:mr-0
          w-[90vw] max-w-[500px] min-w-[320px]
          max-h-[70vh] flex-shrink-0 overflow-hidden rounded-xl"
      >
        <Image
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
          fill
          priority={false}
          src="/images/backgrounds/newsletter-form.webp"
        />

        <div className="relative flex flex-col h-full p-6 sm:p-8">
          <h2 className="text-4xl font-bold -mt-4 -mb-2 text-center">
            Payment Options
            <span className="text-[#F92F7B] text-5xl align-baseline">.</span>
          </h2>
          <div className="text-center text-neutral-700 text-lg font-medium mb-6">
            <div>we have great finance options</div>
            <div>as well as cash discounts</div>
          </div>

          {/* Scrollable inner accordion */}
          <div className="md:px-2 flex-1 overflow-y-auto">
            <PaymentOptionsAccordion collapsible defaultValue="klarna" type="single">
              <PaymentOptionsAccordionItem title="Finance with Klarna" value="klarna">
                <div>
                  Finance your new ride with <span className="text-pink-500 font-semibold">Klarna</span> and receive great rates with financing terms up to 36 months. Apply at <span className="text-pink-500 font-semibold">checkout</span> for an instant decision. <Link className="text-pink-500 font-semibold hover:text-[#D81B60] transition-colors" href="/payment-options/">Learn more</Link>
                </div>
              </PaymentOptionsAccordionItem>
              <PaymentOptionsAccordionItem title="ZIP Financing" value="zip">
                <div>
                  Split your payments in (4), <span className="text-pink-500 font-semibold">interest-free</span>, up to $3,000 with ZIP. <Link className="text-pink-500 font-semibold hover:text-[#D81B60] transition-colors" href="/payment-options/">Learn more</Link>
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
