'use client';

import { useLayoutEffect, useRef, useState } from 'react';

import { Image } from '~/components/image';
import type { TransformedPerformanceData } from '~/data-transformers/performance-comparison-transformer';

import { getBikeConfig, type PerformanceComparisonConfig } from './config';
import { PerformanceMetrics } from './performance-metrics';
import { PulseRings } from './pulse-rings';
import { PerformanceComparisonProps } from './types';

// Helper function to merge configuration objects
const mergeConfig = <T extends object>(defaultConfig: T, dynamicConfig?: Partial<T>): T => {
  return dynamicConfig ? { ...defaultConfig, ...dynamicConfig } : defaultConfig;
};

export function PerformanceComparison({
  productTitle,
  productImage,
  metrics,
  className = '',
  config,
  dynamicData,
}: PerformanceComparisonProps & { 
  config?: PerformanceComparisonConfig;
  dynamicData?: TransformedPerformanceData;
}) {
  const performanceConfig = config || getBikeConfig();
  
  // Use dynamic data if available, otherwise fall back to props
  const finalMetrics = dynamicData?.metrics || metrics;
  const finalProductImage = productImage;
  
  const mergedWheelConfig = mergeConfig(performanceConfig.wheel, dynamicData?.wheelConfig);
  const mergedMetricsConfig = mergeConfig(performanceConfig.performanceMetrics, dynamicData?.metricsConfig);
  const mergedImageConfig = mergeConfig(performanceConfig.image, dynamicData?.imageConfig);

  const scaleWrapperRef = useRef<HTMLDivElement>(null);
  const [measuredHeight, setMeasuredHeight] = useState(0);

  // Measure actual height of scaled content
  useLayoutEffect(() => {
    if (scaleWrapperRef.current) {
      const rect = scaleWrapperRef.current.getBoundingClientRect();

      setMeasuredHeight(rect.height);
    }
  }, [mergedImageConfig.containerScale]);

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
            transform: `scale(${mergedImageConfig.containerScale})`,
            transformOrigin: 'bottom center',
          }}
        >
          <Image
            alt={productImage.alt || mergedImageConfig.alt}
            className="object-contain w-auto h-auto relative z-10"
            height={mergedImageConfig.height}
            priority
            src={productImage.src || mergedImageConfig.src}
            style={{
              maxWidth: `${mergedImageConfig.maxWidth || performanceConfig.image.maxWidth}px`,
              maxHeight: `${mergedImageConfig.maxHeight || performanceConfig.image.maxHeight}px`,
              transform: `translate(${mergedImageConfig.offsetX || performanceConfig.image.offsetX}px, ${mergedImageConfig.offsetY || performanceConfig.image.offsetY}px)`,
              zIndex: performanceConfig.image.zIndex || 10,
            }}
            width={mergedImageConfig.width}
          />

          <div
            className="absolute pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) translate(${mergedWheelConfig.centerX - mergedImageConfig.width / 2}px, ${mergedWheelConfig.centerY - mergedImageConfig.height / 2}px)`,
              zIndex: 1,
            }}
          >

            <PulseRings
              baseColor={mergedWheelConfig.baseColor}
              baseSize={mergedWheelConfig.radius * 2}
              disabledOnMobile={performanceConfig.disabledOnMobile}
              edgeColor={mergedWheelConfig.edgeColor}
              opacity={mergedWheelConfig.opacity}
              pulseSpeed={mergedWheelConfig.pulseSpeed}
              ringSpacing={mergedWheelConfig.ringSpacing}
            />
          </div>

          <div
            className="absolute pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) translate(${mergedWheelConfig.centerX - mergedImageConfig.width / 2 + mergedWheelConfig.radius * 1.2 + mergedMetricsConfig.gapFromWheel}px, ${mergedWheelConfig.centerY - mergedImageConfig.height / 2}px)`,
              zIndex: 1,
            }}
          >
            <PerformanceMetrics
              barWidth={mergedMetricsConfig.barWidth}
              className="w-full h-full"
              curveRadiusMultiplier={mergedMetricsConfig.curveRadiusMultiplier}
              gapFromWheel={mergedMetricsConfig.gapFromWheel}
              lineSpacing={mergedMetricsConfig.lineSpacing}
              metrics={finalMetrics}
              topOffset={mergedMetricsConfig.topOffset}
              wheelCenterX={0}
              wheelCenterY={0}
              wheelRadius={mergedWheelConfig.radius}
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
              alt={finalProductImage.alt || mergedImageConfig.alt}
              className="object-contain w-full h-auto relative z-10"
              height={mergedImageConfig.height}
              priority
              src={finalProductImage.src || mergedImageConfig.src}
              style={{
                maxHeight: '60vh',
              }}
              width={mergedImageConfig.width}
            />
            
            {/* Pulsing rings (hidden on mobile as configured) */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translate(${mergedWheelConfig.centerX - mergedImageConfig.width / 2}px, ${mergedWheelConfig.centerY - mergedImageConfig.height / 2}px)`,
              }}
            >
              <PulseRings
                baseColor={mergedWheelConfig.baseColor}
                baseSize={mergedWheelConfig.radius * 2}
                disabledOnMobile={performanceConfig.disabledOnMobile}
                edgeColor={mergedWheelConfig.edgeColor}
                opacity={mergedWheelConfig.opacity}
                pulseSpeed={mergedWheelConfig.pulseSpeed}
                ringSpacing={mergedWheelConfig.ringSpacing}
              />
            </div>

            {/* Static rings for mobile - positioned relative to image */}
            <div
              className="absolute pointer-events-none xl:hidden"
              style={{
                left: `${((mergedWheelConfig.centerX + (mergedWheelConfig.mobileOffsetX || 0)) / mergedImageConfig.width) * 100}%`,
                top: `${((mergedWheelConfig.centerY + (mergedWheelConfig.mobileOffsetY || 0)) / mergedImageConfig.height) * 100}%`,
                transform: 'translate(-50%, -50%) scale(0.3)',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: mergedWheelConfig.radius * 2 + mergedWheelConfig.ringSpacing * 3,
                  height: mergedWheelConfig.radius * 2 + mergedWheelConfig.ringSpacing * 3,
                }}
              >
                {/* Static center circle */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: mergedWheelConfig.radius * 2,
                    height: mergedWheelConfig.radius * 2,
                    borderRadius: '50%',
                    backgroundColor: mergedWheelConfig.baseColor,
                    opacity: mergedWheelConfig.opacity * 0.8,
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
                      width: mergedWheelConfig.radius * 2 + mergedWheelConfig.ringSpacing * multiplier,
                      height: mergedWheelConfig.radius * 2 + mergedWheelConfig.ringSpacing * multiplier,
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${mergedWheelConfig.baseColor} 60%, ${mergedWheelConfig.edgeColor} 100%)`,
                      opacity: mergedWheelConfig.opacity,
                      transform: 'translate(-50%, -50%) scale(0.95)',
                      WebkitMaskImage: `radial-gradient(circle, black calc(100% - 35px), rgba(0,0,0,0.8) calc(100% - 25px), transparent calc(100% - 15px))`,
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      WebkitMaskComposite: 'destination-out',
                      maskImage: `radial-gradient(circle, black calc(100% - 35px), rgba(0,0,0,0.8) calc(100% - 25px), transparent calc(100% - 15px))`,
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      maskComposite: 'exclude',
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
            barWidth={mergedMetricsConfig.barWidth}
            className="w-full"
            curveRadiusMultiplier={mergedMetricsConfig.curveRadiusMultiplier}
            gapFromWheel={mergedMetricsConfig.gapFromWheel}
            lineSpacing={mergedMetricsConfig.lineSpacing}
            metrics={finalMetrics}
            topOffset={mergedMetricsConfig.topOffset}
            wheelCenterX={mergedWheelConfig.centerX}
            wheelCenterY={mergedWheelConfig.centerY}
            wheelRadius={mergedWheelConfig.radius}
          />
        </div>
      </div>
    </div>
  );
}
