'use client';
import React from 'react';

interface PulseRingsProps {
  baseSize: number;
  ringSpacing: number;
  pulseSpeed: number;
  baseColor: string;
  edgeColor: string;
  opacity: number;
  disabledOnMobile?: boolean;
}

export function PulseRings({
  baseSize,
  ringSpacing,
  pulseSpeed,
  baseColor,
  edgeColor,
  opacity,
  disabledOnMobile = true,
}: PulseRingsProps) {
  const makeRing = (multiplier: number) => ({
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
    WebkitMaskImage: `radial-gradient(circle, black calc(100% - 35px), rgba(0,0,0,0.8) calc(100% - 25px), transparent calc(100% - 15px))`,
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    WebkitMaskComposite: 'destination-out',
  });

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

      <style jsx>{`
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
      `}</style>
    </div>
  );
}
