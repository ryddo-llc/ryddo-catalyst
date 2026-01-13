'use client';

import React from 'react';

import { Image } from '~/components/image';
import { Link } from '~/components/link';

interface CopyrightProps {
  logo: string | { src: string; alt: string };
}

export default function Copyright({ logo }: CopyrightProps) {
  return (
    <div className="-mx-3 mt-10 flex flex-col items-center justify-between gap-3 border-t border-blue-800 px-3 pt-2 text-sm text-blue-300 @xl:-mx-5 @xl:px-5 @4xl:-mx-8 @4xl:px-8 lg:flex-row">
      {/* Logo and Links */}
      <div className="flex flex-col items-center gap-3 lg:flex-row lg:gap-6">
        {/* Logo */}
        <div className="flex items-center">
          {typeof logo === 'string' ? (
            <>
              <span className="text-2xl font-semibold text-[rgb(0,94,255)]">{logo}</span>
              <span className="text-3xl font-extrabold text-pink-500">.</span>
            </>
          ) : (
            <Image
              alt={logo.alt}
              className="max-h-10 w-auto"
              height={40}
              preload
              src={logo.src}
              width={155}
            />
          )}
        </div>

        {/* Links */}
        <div className="flex gap-6">
          <Link
            className="font-[family-name:var(--font-family-body)] font-medium text-[rgb(0,94,255)] hover:text-white"
            href="/privacy-policy/"
          >
            Privacy Policy
          </Link>
          <Link
            className="font-[family-name:var(--font-family-body)] font-medium text-[rgb(0,94,255)] hover:text-white"
            href="/terms-conditions/"
          >
            Terms & conditions
          </Link>
        </div>
      </div>

      {/* Copyright Text */}
      <div className="text-center font-[family-name:var(--font-family-body)] font-medium text-[rgb(0,94,255)] lg:text-right">
        All rights reserved to <span className="text-[rgb(0,94,255)]">Ryddo</span> Ventures, Inc.
        Copyright {new Date().getFullYear()} © <span className="text-[rgb(0,94,255)]">Ryddo</span>
      </div>
    </div>
  );
}
