'use client';
import { PerformanceComparisonProps } from './types';
import { PerformanceMetrics } from './PerformanceMetrics';
import { PulseRings } from './PulseRings';
import { Image } from '~/components/image';
import { getBikeConfig, getContainerTransform, getPerformanceMetricsTransform, type PerformanceComparisonConfig } from './config';

export function PerformanceComparison({
  productTitle,
  productImage,
  metrics,
  animationConfig,
  className = '',
  config,
}: PerformanceComparisonProps & { config?: PerformanceComparisonConfig }) {
  // Use provided config or get default config based on product
  const performanceConfig = config || getBikeConfig();
  
  return (
    <div className={`bg-gray-50 w-full min-h-[90vh] max-h-[100vh] lg:max-h-[95vh] xl:max-h-[90vh] relative overflow-hidden ${className}`} style={{ zIndex: 0 }}>
      {/* Background PERFORM text */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Image
          src="/images/backgrounds/PERFORM.webp"
          alt=""
          width={200}
          height={600}
          className="absolute left-0 top-1/2 -translate-y-1/2 opacity-70 h-full w-auto object-contain"
        />
      </div>

      {/* Title Section - Normal Document Flow */}
      <div className="relative pt-8 md:pt-12 lg:pt-16 px-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Compare <span className="text-[#F92F7B]">Performance</span>
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl">
            Compare the {productTitle} to its competition
          </p>
        </div>
      </div>

      {/* Main Content Area - Single Container with All Elements Moving Together */}
      <div className="relative min-h-[90vh] max-h-[100vh] lg:max-h-[95vh] xl:max-h-[90vh] overflow-hidden">
        
        {/* Single Container for All Elements - This ensures they move together */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            transform: getPerformanceMetricsTransform(performanceConfig.image, performanceConfig.performanceMetrics.trackingMultiplier),
            zIndex: performanceConfig.performanceMetrics.zIndex,
          }}
        >
          <div 
            className="relative pointer-events-none"
            style={{
              width: `${performanceConfig.performanceMetrics.containerWidth}px`,
              height: `${performanceConfig.performanceMetrics.containerHeight}px`,
            }}
          >
            {/* Performance Metrics */}
            <div 
              className="absolute pointer-events-none"
              style={{
                left: `${performanceConfig.wheel.centerX + performanceConfig.image.offsetX + performanceConfig.wheel.radius + performanceConfig.performanceMetrics.gapFromWheel}px`,
                top: `${performanceConfig.wheel.centerY + performanceConfig.image.offsetY}px`,
                transform: 'translate(-50%, -50%)',
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
            
            {/* Pulse Rings - Positioned relative to the container, centered on wheel */}
            <div 
              className="absolute pointer-events-none"
              style={{
                left: `${performanceConfig.wheel.centerX + performanceConfig.image.offsetX}px`,
                top: `${performanceConfig.wheel.centerY + performanceConfig.image.offsetY}px`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <PulseRings
                x={0}
                y={0}
                baseSize={performanceConfig.wheel.radius * 2}
                ringSpacing={performanceConfig.wheel.ringSpacing}
                pulseSpeed={performanceConfig.wheel.pulseSpeed}
                baseColor={performanceConfig.wheel.baseColor}
                fadeColor={performanceConfig.wheel.fadeColor}
                opacity={performanceConfig.wheel.opacity}
                disabledOnMobile={performanceConfig.disabledOnMobile}
              />
            </div>
            
            {/* Bike Image - In front of rings */}
            <Image
              src={productImage.src || performanceConfig.image.src}
              alt={productImage.alt || performanceConfig.image.alt}
              width={performanceConfig.image.width}
              height={performanceConfig.image.height}
              priority
              className="object-cover w-auto h-auto absolute z-10"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translate(${performanceConfig.image.offsetX}px, ${performanceConfig.image.offsetY}px) scale(${performanceConfig.image.containerScale})`,
                maxWidth: `${performanceConfig.image.maxWidth}px`,
                maxHeight: `${performanceConfig.image.maxHeight}px`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
