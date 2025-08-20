import React from 'react';
import { FaCcMastercard, FaCcVisa } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';

import { Link } from '~/components/link';

export default function InfoSection() {
  return (
    <div className="text-center md:text-left">
      <p className="mb-2 text-base font-extrabold md:text-md md:font-semibold">
        Cleaning up the air, one EV at a time
        <span className="text-pink-500">.</span>
      </p>

      <p className="mb-1 text-sm/7 text-gray-700">
        Turning our hobbies and passions into a business. We hope you'll come along for the
        ride.
      </p>

      <div>
        <Link
          className="my-3 flex items-center justify-center gap-1 font-bold text-pink-500 md:justify-start"
          href="/about"
        >
          Learn More About Our Mission <FiArrowRight />
        </Link>
      </div>

      <div className="mt-3 flex justify-center space-x-2 md:justify-start">
        <FaCcMastercard className="h-10 w-auto text-[#333333]" />
        <FaCcVisa className="h-10 w-auto text-[#333333]" />
      </div>
    </div>
  );
}
