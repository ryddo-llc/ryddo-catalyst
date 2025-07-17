import React from 'react';

import { RotatingText } from './rotating-text';

export const AboutHero: React.FC = () => {
  return (
    <section className="w-full pt-16 pb-10 text-center">
      <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
        Cleaning up the air, one{' '}
        <RotatingText
          className="inline-block text-[#F92F7B]"
          interval={1800}
          words={["Dualtron", "Speedway", "Super73"]}
        />{' '}
        at a time.
      </h1>
      <p className="text-lg md:text-xl text-gray-600 font-medium">
        Turning our hobbies & passions into a business. We hope you’ll come along for the ride.
      </p>
    </section>
  );
}; 