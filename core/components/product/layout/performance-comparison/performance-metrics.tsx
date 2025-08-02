'use client';

import { useEffect, useRef, useState } from 'react';

import { 
  DEFAULT_CURVE_CONFIG,
  getAnimationDelay, 
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
}

export function PerformanceMetrics({ 
  metrics, 
  className = '', 
  wheelCenterX = 0, 
  wheelCenterY = 0, 
  wheelRadius = 150, 
  lineSpacing = 48, 
  barWidth = 350,
  topOffset = 50
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
    console.log('PerformanceMetrics: Component mounted, setting up animation');
    
    // Fallback timer to ensure animation triggers even if Intersection Observer fails
    const fallbackTimer = setTimeout(() => {
      console.log('PerformanceMetrics: Fallback timer triggered, setting isVisible to true');
      setIsVisible(true);
    }, 1000); // Trigger after 1 second as fallback

    // Trigger animation when it comes on the screen
    const observer = new IntersectionObserver(
      (entries) => {
        console.log('PerformanceMetrics: Intersection observer triggered', entries[0]?.isIntersecting);
        if (entries[0]?.isIntersecting) {
          console.log('PerformanceMetrics: Component is intersecting, setting isVisible to true');
          setIsVisible(true);
          clearTimeout(fallbackTimer); // Clear fallback if intersection works

          // Optional: Stop observing after first trigger
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
      console.log('PerformanceMetrics: Observing element', currentRef);
      observer.observe(currentRef);
    } else {
      console.log('PerformanceMetrics: No ref available');
    }

    return () => {
      console.log('PerformanceMetrics: Cleaning up');
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
      {/* Debug indicator */}
      <div className="text-xs text-red-500 mb-2">
        Debug: isVisible = {isVisible.toString()}, metrics count = {metrics.length}
      </div>
      
      {metrics.map((metric, index) => (
        <div className="mb-6 relative" key={`${metric.category}-${index}`}>
          {/* Desktop: Curved positioning (xl and up) */}
          <div className="hidden xl:block">
            <div
              className='font-bold text-gray-900 text-lg leading-tight mb-2'
              style={{ 
                position: 'relative', 
                left: getCurveOffset(index, metrics.length, curveConfig.labelYAdjust, curveConfig) 
              }}
            >
              {metric.label} - {metric.value}
            </div>
            <div
              className="bg-gray-200 rounded-full overflow-hidden mb-2"
              style={{
                position: 'relative',
                left: getCurveOffset(index, metrics.length, curveConfig.barYAdjust, curveConfig),
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
                left: getCurveOffset(index, metrics.length, curveConfig.sublabelYAdjust, curveConfig) 
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
