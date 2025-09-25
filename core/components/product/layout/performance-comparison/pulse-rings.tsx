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
  
  @keyframes apulser-white-1 {
    0%, 100% {
      transform: translate(-50%, -50%) scale(0.95);
      opacity: var(--white-1-start, 0.3);
    }
    50% {
      transform: translate(-50%, -50%) scale(1.08);
      opacity: var(--white-1-mid, 0.1);
    }
  }
  
  @keyframes apulser-white-2 {
    0%, 100% {
      transform: translate(-50%, -50%) scale(0.95);
      opacity: var(--white-2-start, 0.2);
    }
    50% {
      transform: translate(-50%, -50%) scale(1.08);
      opacity: var(--white-2-mid, 0.05);
    }
  }
  
  @keyframes apulser-white-3 {
    0%, 100% {
      transform: translate(-50%, -50%) scale(0.95);
      opacity: var(--white-3-start, 0.1);
    }
    50% {
      transform: translate(-50%, -50%) scale(1.08);
      opacity: var(--white-3-mid, 0.02);
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
  showWhiteRings?: boolean;
  whiteRingOpacity?: number;
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
  showWhiteRings = false,
  whiteRingOpacity = 0.3,
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

      {/* White separation rings (optional) */}
      {showWhiteRings && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: baseSize + ringSpacing * 1 + 4,
              height: baseSize + ringSpacing * 1 + 4,
              borderRadius: '50%',
              border: `2px solid rgba(255, 255, 255, ${whiteRingOpacity})`,
              opacity: whiteRingOpacity,
              transform: 'translate(-50%, -50%) scale(0.95)',
              animation: `apulser-white-1 ${pulseSpeed}ms ease-in-out infinite`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: baseSize + ringSpacing * 2 + 4,
              height: baseSize + ringSpacing * 2 + 4,
              borderRadius: '50%',
              border: `2px solid rgba(255, 255, 255, ${whiteRingOpacity})`,
              opacity: whiteRingOpacity * 0.7,
              transform: 'translate(-50%, -50%) scale(0.95)',
              animation: `apulser-white-2 ${pulseSpeed}ms ease-in-out infinite`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: baseSize + ringSpacing * 3 + 4,
              height: baseSize + ringSpacing * 3 + 4,
              borderRadius: '50%',
              border: `2px solid rgba(255, 255, 255, ${whiteRingOpacity})`,
              opacity: whiteRingOpacity * 0.5,
              transform: 'translate(-50%, -50%) scale(0.95)',
              animation: `apulser-white-3 ${pulseSpeed}ms ease-in-out infinite`,
            }}
          />
        </>
      )}

      <style>{KEYFRAMES_CSS}</style>
    </div>
  );
}
