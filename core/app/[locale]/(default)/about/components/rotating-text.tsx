'use client';

import React, { useEffect, useState } from 'react';

interface RotatingTextProps {
  words: string[];
  interval?: number;
  className?: string;
}

export const RotatingText: React.FC<RotatingTextProps> = ({ words, interval = 2000, className }) => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const fadeOut = setTimeout(() => setFade(false), interval - 300);
    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % words.length);
      setFade(true);
    }, interval);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(fadeOut);
    };
  }, [index, interval, words.length]);

  return (
    <span
      className={`transition-opacity duration-300 ${
        fade ? 'opacity-100' : 'opacity-0'
      }${className ? ` ${className}` : ''}`}
      style={{ color: '#F92F7B' }}
    >
      {words[index]}
    </span>
  );
}; 