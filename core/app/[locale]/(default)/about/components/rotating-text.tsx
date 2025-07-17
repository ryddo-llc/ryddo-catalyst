'use client';

import React, { useEffect, useState } from 'react';

interface RotatingTextProps {
  className?: string;
  fadeDuration?: number;
  interval?: number;
  words: string[];
}

export const RotatingText: React.FC<RotatingTextProps> = ({ words, interval = 2000, className, fadeDuration = 300 }) => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (words.length === 0) {
      return;
    }

    const fadeOut = setTimeout(() => setFade(false), interval - fadeDuration);
    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % words.length);
      setFade(true);
    }, interval);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(fadeOut);
    };
  }, [index, interval, words.length, fadeDuration, words]);

  if (words.length === 0) {
    return null;
  }

  return (
    <span
      aria-label={`Rotating text: ${words.join(', ')}`}
      aria-live="polite"
      className={`transition-opacity duration-300 ${
        fade ? 'opacity-100' : 'opacity-0'
      }${className ? ` ${className}` : ''}`}
      role="status"
      style={{ color: '#F92F7B' }}
    >
      {words[index]}
    </span>
  );
}; 