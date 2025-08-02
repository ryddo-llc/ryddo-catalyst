'use client';

import { useLayoutEffect, useRef, useState } from 'react';

import { Image } from '~/components/image';

import { getBikeConfig, type PerformanceComparisonConfig } from './config';
import { PerformanceMetrics } from './performance-metrics';
import { PulseRings } from './pulse-rings';
import { PerformanceComparisonProps } from './types';

export function PerformanceComparison({
  productTitle,
  productImage,
  metrics,
  className = '',
  config,
}: PerformanceComparisonProps & { config?: PerformanceComparisonConfig }) {
  const performanceConfig = config || getBikeConfig();

  const scaleWrapperRef = useRef<HTMLDivElement>(null);
  const [measuredHeight, setMeasuredHeight] = useState(0);

  // Measure actual height of scaled content
  useLayoutEffect(() => {
    if (scaleWrapperRef.current) {
      const rect = scaleWrapperRef.current.getBoundingClientRect();

      setMeasuredHeight(rect.height);
    }
  }, [performanceConfig.image.containerScale]);

  return (
    <div className={`bg-gray-50 w-full h-auto relative flex flex-col ${className}`} style={{ zIndex: 0 }}>
      <div className="absolute inset-0 pointer-events-none z-0">
        <Image
          alt=""
          className="absolute left-0 top-1/2 -translate-y-1/2 opacity-70 h-full w-auto object-contain"
          height={600}
          src="/images/backgrounds/PERFORM.webp"
          width={200}
        />
      </div>

      <div className="relative px-8 pt-2 pb-2">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Compare <span className="text-[#F92F7B]">Performance</span>
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl mt-1">
            Compare the {productTitle} to its competition
          </p>
        </div>
      </div>

      {/* Desktop Layout (xl and above) */}
      <div
        className="relative hidden xl:flex flex-col justify-end"
        style={{
          height: measuredHeight ? `${measuredHeight}px` : 'auto',
        }}
      >
        <div
          className="relative flex items-center justify-center pointer-events-none"
          ref={scaleWrapperRef}
          style={{
            transform: `scale(${performanceConfig.image.containerScale})`,
            transformOrigin: 'bottom center',
          }}
        >
          <Image
            alt={productImage.alt || performanceConfig.image.alt}
            className="object-cover w-auto h-auto relative z-10"
            height={performanceConfig.image.height}
            priority
            src={productImage.src || performanceConfig.image.src}
            style={{
              maxWidth: `${performanceConfig.image.maxWidth}px`,
              maxHeight: `${performanceConfig.image.maxHeight}px`,
              transform: `translate(${performanceConfig.image.offsetX}px, ${performanceConfig.image.offsetY}px)`,
            }}
            width={performanceConfig.image.width}
          />

          <div
            className="absolute pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) translate(${performanceConfig.image.offsetX + performanceConfig.wheel.centerX - performanceConfig.image.width / 2}px, ${performanceConfig.image.offsetY + performanceConfig.wheel.centerY - performanceConfig.image.height / 2}px)`,
            }}
          >
            <PulseRings
              baseColor={performanceConfig.wheel.baseColor}
              baseSize={performanceConfig.wheel.radius * 2}
              disabledOnMobile={performanceConfig.disabledOnMobile}
              edgeColor={performanceConfig.wheel.edgeColor}
              opacity={performanceConfig.wheel.opacity}
              pulseSpeed={performanceConfig.wheel.pulseSpeed}
              ringSpacing={performanceConfig.wheel.ringSpacing}
            />
          </div>

          <div
            className="absolute pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) translate(${performanceConfig.image.offsetX + performanceConfig.wheel.centerX - performanceConfig.image.width / 2 + performanceConfig.wheel.radius * 2.5 + performanceConfig.performanceMetrics.gapFromWheel}px, ${performanceConfig.image.offsetY + performanceConfig.wheel.centerY - performanceConfig.image.height / 2}px)`,
            }}
          >
            <PerformanceMetrics
              barWidth={performanceConfig.performanceMetrics.barWidth}
              className="w-full h-full"
              lineSpacing={performanceConfig.performanceMetrics.lineSpacing}
              metrics={metrics}
              topOffset={performanceConfig.performanceMetrics.topOffset}
              wheelCenterX={0}
              wheelCenterY={0}
              wheelRadius={performanceConfig.wheel.radius}
            />
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Layout (lg and below) */}
      <div className="xl:hidden">
        {/* Edge-to-edge Image Section with Rings */}
        <div className="relative flex justify-center items-center pb-8 -mx-4 md:-mx-8">
          <div className="relative w-full">
            <Image
              alt={productImage.alt || performanceConfig.image.alt}
              className="object-cover w-full h-auto relative z-10"
              height={performanceConfig.image.height}
              priority
              src={productImage.src || performanceConfig.image.src}
              style={{
                maxHeight: '60vh',
              }}
              width={performanceConfig.image.width}
            />
            
            {/* Pulsing rings (hidden on mobile as configured) */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translate(${performanceConfig.wheel.centerX - performanceConfig.image.width / 2}px, ${performanceConfig.wheel.centerY - performanceConfig.image.height / 2}px)`,
              }}
            >
              <PulseRings
                baseColor={performanceConfig.wheel.baseColor}
                baseSize={performanceConfig.wheel.radius * 2}
                disabledOnMobile={performanceConfig.disabledOnMobile}
                edgeColor={performanceConfig.wheel.edgeColor}
                opacity={performanceConfig.wheel.opacity}
                pulseSpeed={performanceConfig.wheel.pulseSpeed}
                ringSpacing={performanceConfig.wheel.ringSpacing}
              />
            </div>

            {/* Static rings for mobile - positioned relative to image */}
            <div
              className="absolute pointer-events-none xl:hidden"
              style={{
                left: `${((performanceConfig.wheel.centerX + (performanceConfig.wheel.mobileOffsetX || 0)) / performanceConfig.image.width) * 100}%`,
                top: `${((performanceConfig.wheel.centerY + (performanceConfig.wheel.mobileOffsetY || 0)) / performanceConfig.image.height) * 100}%`,
                transform: 'translate(-50%, -50%) scale(0.3)',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: performanceConfig.wheel.radius * 2 + performanceConfig.wheel.ringSpacing * 3,
                  height: performanceConfig.wheel.radius * 2 + performanceConfig.wheel.ringSpacing * 3,
                }}
              >
                {/* Static center circle */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: performanceConfig.wheel.radius * 2,
                    height: performanceConfig.wheel.radius * 2,
                    borderRadius: '50%',
                    backgroundColor: performanceConfig.wheel.baseColor,
                    opacity: performanceConfig.wheel.opacity * 0.8,
                    transform: 'translate(-50%, -50%)',
                  }}
                />

                {/* Static rings (no animation) */}
                {[1, 2, 3].map((multiplier) => (
                  <div
                    key={multiplier}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: performanceConfig.wheel.radius * 2 + performanceConfig.wheel.ringSpacing * multiplier,
                      height: performanceConfig.wheel.radius * 2 + performanceConfig.wheel.ringSpacing * multiplier,
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${performanceConfig.wheel.baseColor} 60%, ${performanceConfig.wheel.edgeColor} 100%)`,
                      opacity: performanceConfig.wheel.opacity,
                      transform: 'translate(-50%, -50%) scale(0.95)',
                      WebkitMaskImage: `radial-gradient(circle, black calc(100% - 35px), rgba(0,0,0,0.8) calc(100% - 25px), transparent calc(100% - 15px))`,
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      WebkitMaskComposite: 'destination-out',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Full-width Metrics Section */}
        <div className="px-6 md:px-8 pb-6">
          <PerformanceMetrics
            barWidth={performanceConfig.performanceMetrics.barWidth}
            className="w-full"
            lineSpacing={performanceConfig.performanceMetrics.lineSpacing}
            metrics={metrics}
            topOffset={0}
            wheelCenterX={0}
            wheelCenterY={0}
            wheelRadius={0} // No curves on mobile
          />
        </div>
      </div>
    </div>
  );
}
