'use client';

import { Image } from '~/components/image';
import { Link } from '~/components/link';
import { useIsTabletOrLarger } from '~/lib/use-is-tablet-or-larger';

import { PaymentOptionsAccordion, PaymentOptionsAccordionItem } from './payment-options-accordion';

export function PaymentOptions() {
  const isTabletOrLarger = useIsTabletOrLarger();
  const sectionStyle = {
    backgroundImage: 'url(/images/backgrounds/payment-options-background.webp)',
    ...(isTabletOrLarger ? { backgroundAttachment: 'fixed' } : {}),
  };

  return (
    <section
      className="relative flex items-center w-full h-auto md:h-[100vh] md:max-h-[760px] overflow-hidden bg-cover bg-center py-10 font-['Nunito']"
      style={sectionStyle}
    >
      <div
        className="relative flex flex-col justify-center h-auto
          mx-auto lg:ml-[16vw] lg:mr-0
          max-w-[90vw] sm:max-w-[75vw] md:max-w-[55vw] lg:max-w-[45vw] xl:max-w-[30vw] 
          -mt-[clamp(2%,4vw,4%)] overflow-hidden rounded-xl"
      >
        <Image
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          fill
          priority={false}
          src="/images/backgrounds/newsletter-form.webp"
        />
        <div className="relative p-6 sm:p-8">
        <h2 className="text-[7vw] sm:text-[5vw] lg:text-[2.5vw] font-bold -mt-4 -mb-2 text-center">
          Payment Options
          <span className="text-[#F92F7B] text-[10vw] sm:text-[6vw] lg:text-[3.5vw] align-baseline">.</span>
        </h2>
          <div className="text-center text-neutral-700 text-lg font-medium mb-6">
            <div>we have great finance options</div>
            <div>as well as cash discounts</div>
          </div>
          <div className="md:px-2">
            <PaymentOptionsAccordion collapsible defaultValue="klarna" type="single" >
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
