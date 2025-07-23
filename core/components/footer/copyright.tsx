'use client';

import React from 'react';

export default function Copyright() {
  return (
    <div className='flex justify-center items-center mt-8 lg:mt-10 border-t border-gray-300 pt-4'>
      <span className='text-sm'>
        Copyright 2019 - {new Date().getFullYear()} ©&nbsp;
      </span>
      <span className='font-semibold text-lg'>ryddo</span>
      <span className='font-extrabold text-xl text-pink-500'>.</span>
    </div>
  );
}
