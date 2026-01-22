'use client';

import React from 'react';

import { Image } from '~/components/image';

import { CountUpOnVisible } from './count-up-on-visible';

const BACKGROUND_IMAGE = '/images/backgrounds/los-angeles-background.webp';

const stats = [
  { value: 900, label: 'MPGe Average' },
  { value: 40, label: 'Mi./1kw ($.12)' },
  { value: 335, label: 'Miles / $1.00' },
];

export const AboutStats: React.FC = () => {
  return (
    <section
      className="relative w-full py-16 md:py-32 flex justify-center items-center"
    >
      <Image
        alt=""
        aria-hidden="true"
        className="object-cover -z-10"
        fill
        src={BACKGROUND_IMAGE}
      />
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 justify-center items-center w-full max-w-4xl">
        {stats.map((stat) => (
          <div
            className="bg-white/90 rounded-xl shadow-lg w-64 md:w-72 px-6 py-6 flex flex-col items-center"
            key={stat.label}
          >
            <span className="text-7xl font-extrabold text-[#F92F7B]">
              <CountUpOnVisible end={stat.value} />
            </span>
            <div className="text-lg font-bold -mt-4 text-gray-800">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}; 