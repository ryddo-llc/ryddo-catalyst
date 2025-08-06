'use client';

import React from 'react';

// Keyframes CSS - needs to be inline for dynamic animation names
const KEYFRAMES_CSS = `
  @keyframes apulser-fade-1 {
    0%, 100% {
      transform: translate(-50%, -50%) scale(0.95);
      opacity: 1;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.08);
      opacity: 0.7;
    }
  }
  
  @keyframes apulser-fade-2 {
    0%, 100% {
      transform: translate(-50%, -50%) scale(0.95);
      opacity: 1;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.08);
      opacity: 0.5;
    }
  }
  
  @keyframes apulser-fade-3 {
    0%, 100% {
      transform: translate(-50%, -50%) scale(0.95);
      opacity: 1;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.08);
      opacity: 0.2;
    }
  }
`;

interface PulseRingsProps {
  baseSize: number;
  ringSpacing: number;
  pulseSpeed: number;
  baseColor: string;
  edgeColor: string;
  opacity: number;
  disabledOnMobile?: boolean;
  maskInner?: number;
  maskMiddle?: number;
  maskOuter?: number;
}

// Create a separate styles object for better maintainability
const createRingStyles = (
  baseSize: number,
  ringSpacing: number,
  multiplier: number,
  baseColor: string,
  edgeColor: string,
  opacity: number,
  pulseSpeed: number,
  maskInner: number,
  maskMiddle: number,
  maskOuter: number
) => ({
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  width: baseSize + ringSpacing * multiplier,
  height: baseSize + ringSpacing * multiplier,
  borderRadius: '50%',
  background: `radial-gradient(circle, ${baseColor} 60%, ${edgeColor} 100%)`,
  opacity,
  transform: 'translate(-50%, -50%) scale(0.95)',
  animation: `apulser-fade-${multiplier} ${pulseSpeed}ms ease-in-out infinite`,
  WebkitMaskImage: `radial-gradient(circle, black calc(100% - ${maskInner}px), rgba(0,0,0,0.8) calc(100% - ${maskMiddle}px), transparent calc(100% - ${maskOuter}px))`,
  WebkitMaskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
  WebkitMaskComposite: 'destination-out',
  maskImage: `radial-gradient(circle, black calc(100% - ${maskInner}px), rgba(0,0,0,0.8) calc(100% - ${maskMiddle}px), transparent calc(100% - ${maskOuter}px))`,
  maskRepeat: 'no-repeat',
  maskPosition: 'center',
  maskComposite: 'exclude', // Firefox's equivalent for 'destination-out'
});

export function PulseRings({
  baseSize,
  ringSpacing,
  pulseSpeed,
  baseColor,
  edgeColor,
  opacity,
  disabledOnMobile = true,
  maskInner = 35,
  maskMiddle = 25,
  maskOuter = 15,
}: PulseRingsProps) {
  const makeRing = (multiplier: number) => createRingStyles(
    baseSize,
    ringSpacing,
    multiplier,
    baseColor,
    edgeColor,
    opacity,
    pulseSpeed,
    maskInner,
    maskMiddle,
    maskOuter
  );

  return (
    <div
      className={`pointer-events-none ${disabledOnMobile ? 'hidden xl:block' : ''}`}
      style={{
        position: 'relative',
        width: baseSize + ringSpacing * 3,
        height: baseSize + ringSpacing * 3,
      }}
    >
      {/* Solid center circle */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: baseSize,
          height: baseSize,
          borderRadius: '50%',
          backgroundColor: baseColor,
          opacity: opacity * 0.8,
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Three pulsing rings with cascading fade levels */}
      <div style={makeRing(1)} />
      <div style={makeRing(2)} />
      <div style={makeRing(3)} />

      <style>{KEYFRAMES_CSS}</style>
    </div>
  );
}
