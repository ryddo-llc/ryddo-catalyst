'use client';

import React, { useEffect, useRef, useState } from 'react';

interface CountUpOnVisibleProps {
  end: number;
  duration?: number; // ms
  className?: string;
}

export const CountUpOnVisible: React.FC<CountUpOnVisibleProps> = ({ end, duration = 1200, className }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const node = ref.current;

    if (!node) return;

    let observer: IntersectionObserver | null = null;

    const animate = () => {
      const start = 0;
      let startTime: number | null = null;

      setCount(0);

      const animateStep = (now: number) => {
        if (startTime === null) startTime = now;

        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const nextValue = Math.floor(start + (end - start) * progress);

        setCount(nextValue);

        if (progress < 1) {
          frame.current = requestAnimationFrame(animateStep);
        } else {
          setCount(end);
          setHasAnimated(true);
        }
      };
      
      frame.current = requestAnimationFrame(animateStep);
    };

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting && !hasAnimated) {
          animate();
          observer?.disconnect();
        }
      },
      { threshold: 0 }
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [end, duration, hasAnimated]);

  return (
    <span className={className} ref={ref}>
      {count}
    </span>
  );
}; 