'use client';
import React from 'react';

import { Link } from '../link';
import { Image } from '../image';

const brandLogos = {
  cake: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 25'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Arial' font-size='14' font-weight='bold'%3ECAKE%3C/text%3E%3C/svg%3E",
  super73:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 25'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Arial' font-size='12' font-weight='bold'%3ESUPER73%3C/text%3E%3C/svg%3E",
  minimotors:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 25'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Arial' font-size='10' font-weight='bold'%3EMINIMOTORS%3C/text%3E%3C/svg%3E",
};

type BrandProps = {
  name: string;
  image: string;
};

export default function PartnersContactBar() {
  const brands = [
    { name: 'Super73', image: brandLogos.cake },
    { name: 'Cake', image: brandLogos.super73 },
    { name: 'MiniMotors', image: brandLogos.minimotors },
  ];

  return (
    <section className="sticky bottom-0 left-0 right-0 z-50 flex w-full flex-col items-stretch rounded-none border-0 bg-black text-xs font-bold text-white sm:text-sm lg:flex-row">
      {/* Newsletter Signup Section */}
      <div className="xl:px-18 flex h-12 items-center justify-center border-b border-white px-3 transition-colors duration-200 hover:bg-[#F92F7B] sm:h-14 sm:px-6 md:h-16 md:px-10 lg:border-b-0 lg:border-r lg:px-12">
        <Link
          href={'/'}
          className="h-auto p-0 text-center text-white hover:bg-transparent hover:text-white"
        >
          <span className="hidden sm:inline">Sign up for Free ryddo adventures</span>
          <span className="sm:hidden">Free adventures</span>
          <span className="ml-1 text-[#F92F7B]">^</span>
        </Link>
      </div>

      {/* Partners/Brands Section */}
      <div className="flex min-h-[48px] flex-1 items-center justify-center gap-3 px-3 py-2 sm:min-h-[56px] sm:gap-6 sm:px-6 sm:py-3 md:min-h-[64px] md:gap-8 md:px-8 md:py-4 lg:gap-12 lg:px-10 lg:py-0 xl:gap-20 2xl:gap-32">
        {brands.map((brand: BrandProps) => (
          <Link
            key={brand.name}
            href="/products"
            className="h-auto flex-shrink-0 p-0 transition-opacity duration-200 hover:bg-transparent hover:opacity-80"
            onClick={() => (window.location.href = '/products')}
          >
            <Image
              src={brand.image}
              width={80}
              height={20}
              alt={brand.name}
              className="h-auto w-16 max-w-[124px] sm:w-20 md:w-24 lg:w-28 xl:w-32"
            />
          </Link>
        ))}
      </div>

      {/* Contact Actions Section */}
      <div className="flex w-full border-t lg:w-auto lg:border-t-0">
        {/* Phone Number */}
        <div className="flex h-12 w-1/2 items-center justify-center border-l border-white transition-colors duration-200 hover:bg-[#F92F7B] sm:h-14 md:h-16 lg:w-44 xl:w-52 2xl:w-60">
          <Link href="tel:3236767433" className="px-2 text-center">
            <span className="hidden sm:inline">323.676.7433</span>
            <span className="text-xs sm:hidden">Call Us</span>
          </Link>
        </div>

        {/* Book Now Button */}
        <Link
          href="/service"
          className="flex h-12 w-1/2 items-center justify-center bg-[#F92F7B] transition-colors duration-200 hover:bg-[#d41f63] sm:h-14 md:h-16 lg:w-44 xl:w-52 2xl:w-60"
        >
          <p className="font-bold">Book Now</p>
        </Link>
      </div>
    </section>
  );
}
