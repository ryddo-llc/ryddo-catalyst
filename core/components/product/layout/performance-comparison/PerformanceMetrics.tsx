'use client';
import { PerformanceMetric } from './types';
import { useEffect, useState, useRef } from 'react';
import { 
  CurveConfig, 
  DEFAULT_CURVE_CONFIG, 
  getCurveOffset, 
  getAnimationDelay
} from './curve-config';

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
    lineSpacing: lineSpacing,
    barWidth: barWidth,
  };

  useEffect(() => {
    // Trigger animation when it comes on the screen
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
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
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div 
      ref={ref} 
      className={`space-y-4 ${className}`} 
      style={{ 
        position: 'relative', 
        top: `${topOffset}px`
      }}
    >
      {metrics.map((metric, index) => (
        <div key={`${metric.category}-${index}`} className="mb-6 relative">
          {/* Desktop: Curved positioning (lg and up) */}
          <div className="hidden lg:block">
            <div
              className='font-bold text-gray-900 text-lg leading-tight'
              style={{ 
                position: 'relative', 
                left: getCurveOffset(index, metrics.length, curveConfig.labelYAdjust, curveConfig) 
              }}
            >
              {metric.label} - {metric.value}
            </div>
            <div
              className="w-full bg-gray-200 rounded-full overflow-hidden mt-1"
              style={{
                position: 'relative',
                left: getCurveOffset(index, metrics.length, curveConfig.barYAdjust, curveConfig),
                width: `${curveConfig.barWidth}px`,
                height: `${curveConfig.barHeight}px`,
                borderRadius: `${curveConfig.barBorderRadius}px`,
              }}
            >
              <div
                className="rounded-full transition-all duration-1000 ease-out"
                style={{
                  backgroundColor: '#F92F7B',
                  width: isVisible ? `${metric.percentage}%` : '0%',
                  transitionDelay: `${getAnimationDelay(index, curveConfig)}ms`,
                  height: `${curveConfig.barHeight}px`,
                  borderRadius: `${curveConfig.barBorderRadius}px`,
                }}
              ></div>
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

          {/* Mobile: Normal vertical layout (below lg) */}
          <div className="block lg:hidden">
            <div className='font-bold text-gray-900 text-lg leading-tight'>
              {metric.label} - {metric.value}
            </div>
            <div 
              className="w-full bg-gray-200 rounded-full overflow-hidden mt-1"
              style={{
                height: `${curveConfig.barHeight}px`,
                borderRadius: `${curveConfig.barBorderRadius}px`,
              }}
            >
              <div
                className="rounded-full transition-all duration-1000 ease-out"
                style={{
                  backgroundColor: '#F92F7B',
                  width: isVisible ? `${metric.percentage}%` : '0%',
                  transitionDelay: `${getAnimationDelay(index, curveConfig)}ms`,
                  height: `${curveConfig.barHeight}px`,
                  borderRadius: `${curveConfig.barBorderRadius}px`,
                }}
              ></div>
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
