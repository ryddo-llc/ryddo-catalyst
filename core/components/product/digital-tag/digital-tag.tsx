'use client';

import { Suspense } from 'react';

import { Stream } from '@/vibes/soul/lib/streamable';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import { Link } from '~/components/link';

export interface DigitalTagData {
  brand: string;
  model: string;
  slug: string;
  range?: string;
  speed?: string;
  weight?: string;
  price?: number;
  currencyCode?: string;
  certClass?: string;
  battery?: string;
  motor?: string;
  chargeTime?: string;
  maxLoad?: string;
}

interface DigitalTagProps {
  data: DigitalTagData | Promise<DigitalTagData>;
}

export function DigitalTagSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading product tag"
      aria-live="polite"
      className="flex h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:min-h-screen sm:overflow-auto sm:p-8"
      role="status"
    >
      <div className="relative w-80">
        <div
          className="relative animate-pulse bg-gray-300 text-white shadow-[0_4px_8px_rgba(0,0,0,0.15)]"
          style={{
            clipPath:
              'polygon(10% 0%, 90% 0%, 100% 2%, 100% 64%, 95% 66%, 100% 68%, 100% 100%, 0% 100%, 0% 68%, 5% 66%, 0% 64%, 0% 2%)',
          }}
        >
          {/* Hole punch skeleton */}
          <div className="absolute left-1/2 top-4 h-8 w-8 -translate-x-1/2 rounded-full bg-gray-200" />
          
          {/* Brand section skeleton */}
          <div className="border-b-2 border-white/20 px-6 pb-4 pt-16">
            <Skeleton.Box className="mx-auto h-12 w-48" />
          </div>

          {/* Model section skeleton */}
          <div className="border-b-2 border-white/20 px-6 py-4">
            <Skeleton.Text characterCount={5} className="mb-1 text-xs" />
            <Skeleton.Box className="mx-auto h-7 w-32" />
          </div>

          {/* Specs sections skeleton */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div className="border-b-2 border-white/20 px-6 py-4" key={i}>
              <Skeleton.Text characterCount={8} className="mb-1 text-xs" />
              <Skeleton.Box className="h-8 w-24" />
            </div>
          ))}

          {/* Notice section skeleton */}
          <div className="px-6 py-3">
            <Skeleton.Text characterCount={180} className="text-xs" />
          </div>

          {/* Price section skeleton */}
          <div className="mt-px border-b-2 border-white/20 px-6 py-5">
            <Skeleton.Box className="mx-auto h-9 w-32" />
          </div>

          {/* Info section skeleton */}
          <div className="border-b-2 border-white/20 px-6 py-4">
            <div className="space-y-2">
              <Skeleton.Text characterCount={30} className="text-sm" />
              <Skeleton.Text characterCount={25} className="text-sm" />
            </div>
          </div>

          {/* CTA section skeleton */}
          <div className="p-6">
            <Skeleton.Box className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DigitalTagContent({ data }: { data: DigitalTagData }) {
  // Format price with currency
  const formattedPrice = data.price
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: data.currencyCode || 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(data.price)
    : 'Price TBD';

  // Clean up range value (remove "miles" if already included)
  const rangeValue = data.range?.replace(/\s*miles?\s*$/i, '');

  // Clean up speed value (remove "mph" if already included)
  const speedValue = data.speed?.replace(/\s*mph\s*$/i, '');

  // Responsive brand text sizing based on length
  const getBrandTextClasses = (brandName: string) => {
    const length = brandName.length;

    if (length <= 8) return 'text-4xl sm:text-5xl';
    if (length <= 12) return 'text-3xl sm:text-4xl';
    if (length <= 16) return 'text-2xl sm:text-3xl';

    return 'text-xl sm:text-2xl';
  };

  // Responsive padding based on text size
  const getBrandPadding = (brandName: string) => {
    return brandName.length > 16 ? 'px-4 pb-3 pt-16' : 'px-6 pb-4 pt-16';
  };

  return (
    <div className="flex h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:min-h-screen sm:overflow-auto sm:p-8">
      {/* Container */}
      <div className="relative">
        {/* The Tag with swinging animation */}
        <div
          className="relative w-80 animate-swing text-white shadow-[0_4px_8px_rgba(0,0,0,0.15),0_8px_16px_rgba(249,47,123,0.2),0_16px_32px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.3)] motion-reduce:animate-none"
          style={{
            background: 'linear-gradient(135deg, #F92F7B 0%, #E91E63 50%, #C2185B 100%)',
            boxShadow:
              'inset 2px 2px 4px rgba(255,255,255,0.1), inset -2px -2px 4px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.15), 0 8px 16px rgba(249,47,123,0.2), 0 16px 32px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.3)',
            clipPath:
              'polygon(10% 0%, 90% 0%, 100% 2%, 100% 64%, 95% 66%, 100% 68%, 100% 100%, 0% 100%, 0% 68%, 5% 66%, 0% 64%, 0% 2%)',
            transformOrigin: '50% 32px',
          }}
        >
          {/* Hole punch at top */}
          <div
            className="absolute left-1/2 top-4 h-8 w-8 -translate-x-1/2 rounded-full bg-gradient-to-br from-gray-50 to-gray-100"
            style={{
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), inset 0 -1px 2px rgba(255,255,255,0.1)',
            }}
          />

          {/* Optional hanging string effect */}
          <div className="absolute left-1/2 top-0 h-4 w-px animate-swing bg-gray-400 opacity-30 motion-reduce:animate-none" style={{ transformOrigin: '50% 0' }} />

          {/* Brand Section */}
          <div className={`border-b-2 border-white/90 ${getBrandPadding(data.brand)} flex items-center justify-center`}>
            <h1
              className={`text-center ${getBrandTextClasses(data.brand)} font-black uppercase tracking-wider text-black`}
              style={{
                textShadow:
                  '3px 3px 0 white, -3px -3px 0 white, 3px -3px 0 white, -3px 3px 0 white, 1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 0 0 12px white',
                fontWeight: '900',
              }}
            >
              {data.brand}
            </h1>
          </div>

          {/* Model Section */}
          <div className="border-b-2 border-white/90 px-6 py-4">
            <div className="mb-1 text-xs font-extrabold uppercase tracking-wider text-black">
              Model
            </div>
            <div className="text-center text-xl font-black text-white">{data.model}</div>
          </div>

          {/* Range Section */}
          <div className="border-b-2 border-white/90 px-6 py-4">
            <div className="mb-1 text-xs font-extrabold uppercase tracking-wider text-black">
              Range
            </div>
            <div className="text-2xl font-black text-yellow-400">
              {rangeValue || 'N/A'}
              {rangeValue ? <span className="ml-1 text-base font-extrabold">miles</span> : null}
            </div>
          </div>

          {/* Top Speed Section */}
          <div className="border-b-2 border-white/90 px-6 py-4">
            <div className="mb-1 text-xs font-extrabold uppercase tracking-wider text-black">
              Top Speed
            </div>
            <div className="text-2xl font-black text-yellow-400">
              {speedValue || 'N/A'}
              {speedValue ? <span className="ml-1 text-base font-extrabold">mph</span> : null}
            </div>
          </div>

          {/* Weight Section */}
          <div className="border-b-2 border-white/90 px-6 py-4">
            <div className="mb-1 text-xs font-extrabold uppercase tracking-wider text-black">
              Weight
            </div>
            <div className="text-2xl font-black text-yellow-400">{data.weight || 'N/A'}</div>
          </div>

          {/* Notice Section */}
          <div
            className="relative border-white/90 px-6 py-3"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23ffffff' opacity='0.08' viewBox='0 0 640 512'%3E%3Cpath d='M312 32c-13.3 0-24 10.7-24 24h25.7l34.6 64H222.9l-27.4-38C191 99.7 183.7 96 176 96H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h43.7l22.1 30.7-26.6 53.1c-10-2.5-20.5-3.8-31.2-3.8C57.3 224 0 281.3 0 352s57.3 128 128 128c65.3 0 119.1-48.9 127-112h49c7.9 63.1 61.7 112 127 112c70.7 0 128-57.3 128-128s-57.3-128-128-128c-13.5 0-26.5 2.1-38.7 6L375.4 87.1c2.7-.7 5.5-1.1 8.6-1.1H408c13.3 0 24-10.7 24-24s-10.7-24-24-24H384c-27.5 0-52.5 17.3-62.1 43.2L296.3 123.4 312 32zM441.3 384a80 80 0 1 1 69.3-69.3 80 80 0 1 1-69.3 69.3zM109.3 384a80 80 0 1 1 37.4 0 80 80 0 1 1-37.4 0z'/%3E%3C/svg%3E\")",
              backgroundSize: '100px 100px',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
            }}
          >
            <div className="relative z-10 text-xs font-semibold leading-tight text-black">
              Notice of Claims must be Filed in writing with an Officer of the Carrier within 14
              days maximum liability for baggage or personal property, $1,500, unless higher
              valuation declared and a slight extra charge paid in advance
            </div>
          </div>

          {/* Perforation Section */}
          <div className="relative -my-1 h-0 overflow-visible">
            <div className="absolute inset-x-0 flex items-center">
              {/* Dotted perforation line */}
              <div className="flex-1 border-b-[3px] border-dashed border-white/80" />
            </div>
          </div>

          {/* Price Section */}
          <div className="mt-px border-b-2 border-white/90 px-6 py-5">
            <div className="text-center text-3xl font-extrabold tracking-tight text-white">
              {formattedPrice}.
            </div>
          </div>

          {/* Info Stats Section */}
          <div className="border-b-2 border-white/90 px-6 py-4">
            <div className="space-y-2 text-sm">
              {data.battery ? (
                <div className="flex justify-between">
                  <span className="font-bold text-black">Battery:</span>
                  <span className="font-black text-yellow-400">{data.battery}</span>
                </div>
              ) : null}
              {data.motor ? (
                <div className="flex justify-between">
                  <span className="font-bold text-black">Motor:</span>
                  <span className="font-black text-yellow-400">{data.motor}</span>
                </div>
              ) : null}
              {!data.battery && !data.motor ? (
                <>
                  {data.chargeTime ? (
                    <div className="flex justify-between">
                      <span className="font-bold text-black">Charge Time:</span>
                      <span className="font-black text-yellow-400">{data.chargeTime}</span>
                    </div>
                  ) : null}
                  {data.maxLoad ? (
                    <div className="flex justify-between">
                      <span className="font-bold text-black">Max Load:</span>
                      <span className="font-black text-yellow-400">{data.maxLoad}</span>
                    </div>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>

          {/* CTA Section */}
          <div className="p-6">
            <Link href={`/product/${data.slug}`}>
              <button className="w-full transform rounded-lg bg-white px-4 py-3 font-bold text-[#F92F7B] shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-xl">
                View Full Product →
              </button>
            </Link>
          </div>

          {/* Bottom edge shadow for depth */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
        </div>
      </div>
    </div>
  );
}

export function DigitalTag({ data }: DigitalTagProps) {
  // Handle streaming data
  if (data instanceof Promise) {
    return (
      <Stream fallback={<DigitalTagSkeleton />} value={data}>
        {(resolvedData) => <DigitalTagContent data={resolvedData} />}
      </Stream>
    );
  }

  // Handle direct data
  return (
    <Suspense fallback={<DigitalTagSkeleton />}>
      <DigitalTagContent data={data} />
    </Suspense>
  );
}