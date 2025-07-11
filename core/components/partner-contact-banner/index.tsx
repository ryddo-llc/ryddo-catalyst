'use client';

import type { StaticImageData } from 'next/image';
import React from 'react';

import { Image } from '../image';
import { Link } from '../link';

import cake from './brand-logos/cake-logo.svg';
import minimotors from './brand-logos/Minimotors-logo1.svg';
import super73 from './brand-logos/super-73-logo.svg';

interface BrandProps {
  image: string | StaticImageData;
  name: string;
}

export default function PartnersContactBar() {
  const brands: BrandProps[] = [
    { name: 'Super73', image: super73 },
    { name: 'Cake', image: cake },
    { name: 'MiniMotors', image: minimotors },
  ];

  return (
    <section className="sticky bottom-0 left-0 right-0 z-50 flex w-full flex-col items-stretch bg-black text-xs font-bold text-white sm:text-sm lg:flex-row">
      {/* Newsletter Signup Section */}
      <div className="xl:px-18 flex h-12 items-center justify-center border-b border-white px-3 transition-colors duration-200 hover:bg-[#F92F7B] md:h-16 md:border-b-0 md:border-r md:px-10 lg:px-12">
        <Link
          className="h-auto whitespace-nowrap p-0 text-center text-white hover:bg-transparent hover:text-white"
          href="/"
        >
          <span className="hidden md:inline">Sign up for Free ryddo adventures</span>
          <span className="md:hidden">Free adventures</span>
          <span className="ml-1 text-[#F92F7B]">^</span>
        </Link>
      </div>

      {/* Partners/Brands Section */}
      <div className="flex min-h-[48px] flex-1 items-center justify-center gap-3 px-3 py-2 md:min-h-[64px] md:gap-8 md:px-8 md:py-0 lg:gap-12 lg:px-10 xl:gap-20 2xl:gap-32">
        {brands.map((brand: BrandProps) => (
          <Link
            className="h-auto flex-shrink-0 p-0 transition-opacity duration-200 hover:bg-transparent hover:opacity-80"
            href="/products"
            key={brand.name}
          >
            <Image
              alt={brand.name}
              className="h-auto w-16 max-w-[124px] md:w-24 lg:w-28 xl:w-32"
              height={20}
              src={brand.image}
              width={80}
            />
          </Link>
        ))}
      </div>

      {/* Contact Actions Section */}
      <div className="flex w-full border-t lg:w-auto lg:border-t-0">
        {/* Phone Number */}
        <div className="flex h-12 w-1/2 items-center justify-center border-l border-white transition-colors duration-200 hover:bg-[#F92F7B] sm:h-14 md:h-16 lg:w-44 xl:w-52 2xl:w-60">
          <Link className="px-2 text-center" href="tel:3236767433">
            <span className="hidden sm:inline">323.676.7433</span>
            <span className="text-xs sm:hidden">Call Us</span>
          </Link>
        </div>

        {/* Book Now Button */}
        <Link
          className="flex h-12 w-1/2 items-center justify-center bg-[#F92F7B] transition-colors duration-200 hover:bg-[#d41f63] sm:h-14 md:h-16 lg:w-44 xl:w-52 2xl:w-60"
          href="/service"
        >
          <span className="font-bold">Book Now</span>
        </Link>
      </div>
    </section>
  );
}
