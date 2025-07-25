import React from 'react';

import { SectionLayout } from '@/vibes/soul/sections/section-layout';

const values = [
  {
    title: 'Warwick Hunt',
    background: 'FOUNDER',
    description: (
      <>
        With 20 years of experience in Landscape Architecture, Warwick brings a love for the environment and a discerning eye to the electric transportation world. He believes in a clean design aesthetic and <strong>outstanding build-quality</strong> & looks for that in every product Ryddo sells.
      </>
    ),
  },
  {
    title: 'Sustainability',
    background: 'GO GREEN',
    description: (
      <>
        What’s not to love about Los Angeles except perhaps the traffic and air quality? As locals know, there is nothing as beautiful in L.A. as a crisp, clear, cloudless day. Do yourself (and the environment) a favor and buy one of our eco-friendly products!
      </>
    ),
  },
  {
    title: 'Safety',
    background: 'QUALITY',
    description: (
      <>
        Ryddo’s approach is safety first. We sell products with the safest battery packs, the best suspension, the best build quality, the best brakes and the protective gear to accompany that. We offer <strong>free scooter safety lessons</strong> at a demo center in downtown Los Angeles.
      </>
    ),
  },
];

export const AboutValuesGrid: React.FC = () => {
  return (
    <SectionLayout className="md:px-10" containerSize="2xl">
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-10 md:gap-12">
        {values.map((item) => (
          <div className="flex flex-col items-start relative" key={item.title}>
            <span
              aria-hidden="true"
              className="block font-extrabold uppercase select-none opacity-10 text-gray-500 text-[8vw] md:text-[6vw] lg:text-[4vw] xl:text-[5vw] 2xl:text-[5rem] leading-none mb-[-1rem] md:mb-[-1.5rem]"
            >
              {item.background}
            </span>
            <h3 className="text-2xl font-extrabold text-black font-['Nunito'] w-full relative">
              {item.title}
            </h3>
            <div className="text-base text-gray-700 font-['Nunito'] relative">{item.description}</div>
          </div>
        ))}
      </div>
    </SectionLayout>
  );
}; 