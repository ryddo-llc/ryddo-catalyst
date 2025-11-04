'use client';

import React from 'react';

import { Link } from '~/components/link';

export default function Copyright() {
  return (
    <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-blue-800 pt-6 text-sm text-blue-300 lg:flex-row">
      {/* Logo */}
      <div className="flex items-center">
        <span className="text-2xl font-semibold text-white">ryddo</span>
        <span className="text-3xl font-extrabold text-pink-500">.</span>
      </div>

      {/* Links */}
      <div className="flex gap-6">
        <Link className="hover:text-white" href="/privacy-policy/">
          Privacy Policy
        </Link>
        <Link className="hover:text-white" href="/terms-conditions/">
          Terms & conditions
        </Link>
      </div>

      {/* Copyright Text */}
      <div className="text-center lg:text-right">
        All rights reserved to <span className="text-pink-500">Ryddo</span> Ventures, Inc. Copyright{' '}
        {new Date().getFullYear()} © <span className="text-pink-500">Ryddo</span>
      </div>
    </div>
  );
}
