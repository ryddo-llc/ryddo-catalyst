'use client';
import { useRef, useLayoutEffect, useState } from 'react';
import { PerformanceComparisonProps } from './types';
import { PerformanceMetrics } from './PerformanceMetrics';
import { PulseRings } from './PulseRings';
import { Image } from '~/components/image';
import { getBikeConfig, type PerformanceComparisonConfig } from './config';

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
          src="/images/backgrounds/PERFORM.webp"
          alt=""
          width={200}
          height={600}
          className="absolute left-0 top-1/2 -translate-y-1/2 opacity-70 h-full w-auto object-contain"
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
          ref={scaleWrapperRef}
          className="relative flex items-center justify-center pointer-events-none"
          style={{
            transform: `scale(${performanceConfig.image.containerScale})`,
            transformOrigin: 'bottom center',
          }}
        >
          <Image
            src={productImage.src || performanceConfig.image.src}
            alt={productImage.alt || performanceConfig.image.alt}
            width={performanceConfig.image.width}
            height={performanceConfig.image.height}
            priority
            className="object-cover w-auto h-auto relative z-10"
            style={{
              maxWidth: `${performanceConfig.image.maxWidth}px`,
              maxHeight: `${performanceConfig.image.maxHeight}px`,
              transform: `translate(${performanceConfig.image.offsetX}px, ${performanceConfig.image.offsetY}px)`,
            }}
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
              baseSize={performanceConfig.wheel.radius * 2}
              ringSpacing={performanceConfig.wheel.ringSpacing}
              pulseSpeed={performanceConfig.wheel.pulseSpeed}
              baseColor={performanceConfig.wheel.baseColor}
              edgeColor={performanceConfig.wheel.edgeColor}
              opacity={performanceConfig.wheel.opacity}
              disabledOnMobile={performanceConfig.disabledOnMobile}
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
              metrics={metrics}
              className="w-full h-full"
              wheelCenterX={0}
              wheelCenterY={0}
              wheelRadius={performanceConfig.wheel.radius}
              lineSpacing={performanceConfig.performanceMetrics.lineSpacing}
              barWidth={performanceConfig.performanceMetrics.barWidth}
              topOffset={performanceConfig.performanceMetrics.topOffset}
            />
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Layout (lg and below) */}
      <div className="xl:hidden">
        {/* Edge-to-edge Image Section */}
        <div className="relative flex justify-center items-center pb-8 -mx-4 md:-mx-8">
          <div className="relative w-full">
            <Image
              src={productImage.src || performanceConfig.image.src}
              alt={productImage.alt || performanceConfig.image.alt}
              width={performanceConfig.image.width}
              height={performanceConfig.image.height}
              priority
              className="object-cover w-full h-auto relative z-10"
              style={{
                maxHeight: '60vh',
              }}
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
                baseSize={performanceConfig.wheel.radius * 2}
                ringSpacing={performanceConfig.wheel.ringSpacing}
                pulseSpeed={performanceConfig.wheel.pulseSpeed}
                baseColor={performanceConfig.wheel.baseColor}
                edgeColor={performanceConfig.wheel.edgeColor}
                opacity={performanceConfig.wheel.opacity}
                disabledOnMobile={performanceConfig.disabledOnMobile}
              />
            </div>
          </div>
        </div>

        {/* Full-width Metrics Section */}
        <div className="px-6 md:px-8 pb-6">
          <PerformanceMetrics
            metrics={metrics}
            className="w-full"
            wheelCenterX={0}
            wheelCenterY={0}
            wheelRadius={0} // No curves on mobile
            lineSpacing={performanceConfig.performanceMetrics.lineSpacing}
            barWidth={performanceConfig.performanceMetrics.barWidth}
            topOffset={0}
          />
        </div>
      </div>
    </div>
  );
}
