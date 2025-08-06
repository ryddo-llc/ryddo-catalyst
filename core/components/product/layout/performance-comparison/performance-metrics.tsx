'use client';

import { useEffect, useRef, useState } from 'react';

import { 
  DEFAULT_CURVE_CONFIG,
  getCurveOffset
} from './curve-config';
import { PerformanceMetric } from './types';

interface PerformanceMetricsProps {
  metrics: PerformanceMetric[];
  className?: string;
  wheelCenterX?: number;  // Wheel center X coordinate (same as PulseRings x)
  wheelCenterY?: number;  // Wheel center Y coordinate (same as PulseRings y)
  wheelRadius?: number;   // Wheel radius
  lineSpacing?: number;   // Space between metrics
  barWidth?: number;      // Progress bar width
  topOffset?: number;     // Top offset for metrics container
  curveRadiusMultiplier?: number; // Multiplier for curve radius
  gapFromWheel?: number;  // Gap from wheel to metrics
}

export function PerformanceMetrics({ 
  metrics, 
  className = '', 
  wheelCenterX = 0, 
  wheelCenterY = 0, 
  wheelRadius = 150, 
  lineSpacing = 48, 
  barWidth = 350,
  topOffset = 50,
  curveRadiusMultiplier = 0.6,
  gapFromWheel = 0
}: PerformanceMetricsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Create curve configuration using wheel center coordinates (same as PulseRings)
  const curveConfig = {
    ...DEFAULT_CURVE_CONFIG,
    curveRadius: wheelRadius,
    curveCenterX: wheelCenterX,
    curveCenterY: wheelCenterY,
    lineSpacing,
    barWidth
  };

  useEffect(() => {
    // Fallback timer to ensure animation triggers even if Intersection Observer fails
    const fallbackTimer = setTimeout(() => {
      setIsVisible(true);
    }, 1000); // Trigger after 1 second as fallback

    // Trigger animation when it comes on the screen
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          clearTimeout(fallbackTimer); // Clear fallback if intersection works

          // Stop observing after first trigger
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: '0px 0px -50px 0px', // Trigger 50px before entering viewport
      }
    );

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      clearTimeout(fallbackTimer);
      
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div 
      className={`space-y-4 ${className}`} 
      ref={ref} 
      style={{ 
        position: 'relative', 
        top: `${topOffset}px`
      }}
    >
      {metrics.map((metric, index) => (
        <div className="mb-6 relative" key={`${metric.category}-${index}`}>
          {/* Desktop: Curved positioning (xl and up) */}
          <div className="hidden xl:block">
            <div
              className='font-bold text-gray-900 text-lg leading-tight mb-2'
              style={{ 
                position: 'relative', 
                left: getCurveOffset(index, metrics.length, curveConfig.labelYAdjust, curveConfig, curveRadiusMultiplier, gapFromWheel) 
              }}
            >
              {metric.label} - {metric.value}
            </div>
            <div
              className="bg-gray-200 rounded-full overflow-hidden mb-2"
              style={{
                position: 'relative',
                left: getCurveOffset(index, metrics.length, curveConfig.barYAdjust, curveConfig, curveRadiusMultiplier, gapFromWheel),
                width: `${curveConfig.barWidth}px`,
                height: '8px',
                borderRadius: '4px',
              }}
            >
              <div
                className="rounded-full transition-all duration-1000 ease-out bg-[#F92F7B]"
                style={{
                  width: isVisible ? `${metric.percentage}%` : '0%',
                  transitionDelay: `${index * 150}ms`,
                  height: '8px',
                  borderRadius: '4px',
                }}
              />
            </div>
            <div
              className='text-base text-gray-500'
              style={{ 
                position: 'relative', 
                left: getCurveOffset(index, metrics.length, curveConfig.sublabelYAdjust, curveConfig, curveRadiusMultiplier, gapFromWheel) 
              }}
            >
              {metric.sublabel}
            </div>
          </div>

          {/* Mobile: Normal vertical layout (below xl) */}
          <div className="block xl:hidden">
            <div className='font-bold text-gray-900 text-lg leading-tight mb-2'>
              {metric.label} - {metric.value}
            </div>
            <div 
              className="w-full bg-gray-200 rounded-full overflow-hidden mb-2"
              style={{
                height: '8px',
                borderRadius: '4px',
              }}
            >
              <div
                className="rounded-full transition-all duration-1000 ease-out bg-[#F92F7B]"
                style={{
                  width: isVisible ? `${metric.percentage}%` : '0%',
                  height: '8px',
                  borderRadius: '4px',
                  transitionDelay: `${index * 150}ms`,
                }}
              />
            </div>
            <div className='text-base text-gray-500'>
              {metric.sublabel}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
