'use client';


import { Image } from '~/components/image';
import type { TransformedPerformanceData } from '~/data-transformers/performance-comparison-transformer';

import { getPerformanceConfig, type PerformanceComparisonConfig } from './config';
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
  dynamicData?: TransformedPerformanceData | null;
}) {
  const performanceConfig = config || getPerformanceConfig();
  
  // Use dynamic data if available, otherwise fall back to props
  const finalMetrics = dynamicData?.metrics || metrics;
  const finalProductImage = productImage;
  
  const mergedWheelConfig = mergeConfig(performanceConfig.wheel, dynamicData?.wheelConfig);
  const mergedMetricsConfig = mergeConfig(performanceConfig.performanceMetrics, dynamicData?.metricsConfig);
  const mergedImageConfig = mergeConfig(performanceConfig.image, dynamicData?.imageConfig);

  return (
      <div className={`w-full relative flex flex-col overflow-hidden ${className}`} style={{ backgroundColor: 'rgb(244, 244, 244)', margin: 0, padding: 0 }}>
        <div aria-hidden="true" className="absolute inset-0 z-0">
          {/* Dots background pattern */}
          <div className="absolute inset-0 pointer-events-none">
            <Image
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-30"
              height={800}
              src="/images/backgrounds/performance_bg_dots.png"
              width={1200}
            />
          </div>
        
        <Image
          alt=""
          className="absolute left-0 top-1/2 -translate-y-1/2 opacity-70 w-auto object-contain"
          height={550}
          src="/images/backgrounds/PERFORM.webp"
          style={{ maxHeight: '100%', height: 'auto' }}
          width={200}
        />
      </div>

      {/* Desktop Layout (xl and above) */}
      <div
        className="relative hidden xl:flex flex-col"
        style={{
          height: 'auto',
          flex: '0 0 auto',
          overflow: 'hidden',
          marginTop: '0',
          minHeight: '0',
          paddingTop: '0',
        }}
      >
        <div
          className="relative flex items-center justify-center pointer-events-none"
          style={{
            height: 'auto',
            minHeight: '800px',
            marginTop: '0',
            transform: `scale(${mergedImageConfig.containerScale})`,
            transformOrigin: 'center center',
          }}
        >
          <Image
            alt={productImage.alt || mergedImageConfig.alt || ""}
            className="object-contain w-auto h-auto relative z-10"
            height={mergedImageConfig.height}
            src={productImage.src || mergedImageConfig.src}
            style={{
              maxWidth: `${mergedImageConfig.maxWidth || performanceConfig.image.maxWidth}px`,
              maxHeight: `${mergedImageConfig.maxHeight || performanceConfig.image.maxHeight}px`,
              transform: `translate(${mergedImageConfig.offsetX || performanceConfig.image.offsetX}px, ${mergedImageConfig.offsetY || performanceConfig.image.offsetY}px)`,
            }}
            width={mergedImageConfig.width}
          />

          {/* Compare Performance text overlay - positioned absolutely to not interfere with image */}
          <div className="absolute top-32 right-8 z-20 pointer-events-none">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-kanit leading-tight italic text-right">
              COMPARE <span className="text-[#F92F7B]">PERFORMANCE</span>
            </h2>
            <p className="text-stone-500 text-lg sm:text-xl lg:text-3xl font-bold font-inter italic -mt-3 text-center">
              Compare the {productTitle} to its competition
            </p>
          </div>

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

          <div
            className="absolute pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) translate(${mergedWheelConfig.centerX - mergedImageConfig.width / 2 + mergedWheelConfig.radius * 1.2 + mergedMetricsConfig.gapFromWheel}px, ${mergedWheelConfig.centerY - mergedImageConfig.height / 2}px)`,
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
              alt={finalProductImage.alt || mergedImageConfig.alt || ""}
              className="object-contain w-full h-auto relative z-10"
              height={mergedImageConfig.height}
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
                      // Fallback for browsers that don't support mask-composite
                      backgroundColor: mergedWheelConfig.baseColor,
                      // Modern browsers: use mask-composite for ring effect
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
