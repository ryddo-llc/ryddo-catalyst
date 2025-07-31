'use client';
import React from 'react';

interface PulseRingsProps {
  x: number;
  y: number;
  baseSize: number;
  ringSpacing: number;
  pulseSpeed: number;
  baseColor: string;
  fadeColor: string;
  opacity: number;
  disabledOnMobile?: boolean;
}

export function PulseRings({
  x,
  y,
  baseSize,
  ringSpacing,
  pulseSpeed,
  baseColor,
  fadeColor,
  opacity,
  disabledOnMobile = true,
}: PulseRingsProps) {
  const uniqueId = React.useId();
  const radius = baseSize / 2;

  return (
    <div
      className={`pointer-events-none ${disabledOnMobile ? 'hidden md:block' : ''}`}
      style={{
        position: 'relative',
        width: baseSize,
        height: baseSize,
      }}
    >
      {/* Static center circle - same size as wheel */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: radius * 2, // Same as wheel diameter
          height: radius * 2, // Same as wheel diameter
          borderRadius: '50%',
          backgroundColor: baseColor,
          opacity: opacity * 0.3,
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Pulsing rings - all same width, extending outward */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: radius * 2 + ringSpacing,
          height: radius * 2 + ringSpacing,
          borderRadius: '50%',
          border: `4px solid ${baseColor}`,
          opacity: opacity * 0.6,
          animation: `pulse-ring-1 ${pulseSpeed}ms ease-in-out infinite`,
        }}
      />

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: radius * 2 + ringSpacing * 2,
          height: radius * 2 + ringSpacing * 2,
          borderRadius: '50%',
          border: `4px solid ${baseColor}`,
          opacity: opacity * 0.4,
          animation: `pulse-ring-2 ${pulseSpeed}ms ease-in-out infinite`,
          animationDelay: `${pulseSpeed * 0.3}ms`,
        }}
      />

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: radius * 2 + ringSpacing * 3,
          height: radius * 2 + ringSpacing * 3,
          borderRadius: '50%',
          border: `4px solid ${baseColor}`,
          opacity: opacity * 0.2,
          animation: `pulse-ring-3 ${pulseSpeed}ms ease-in-out infinite`,
          animationDelay: `${pulseSpeed * 0.6}ms`,
        }}
      />

      <style jsx>{`
        @keyframes pulse-ring-1 {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: ${opacity * 0.6};
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: ${opacity * 0.3};
          }
        }

        @keyframes pulse-ring-2 {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: ${opacity * 0.4};
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: ${opacity * 0.2};
          }
        }

        @keyframes pulse-ring-3 {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: ${opacity * 0.2};
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: ${opacity * 0.1};
          }
        }
      `}</style>
    </div>
  );
}
