import * as Skeleton from '@/vibes/soul/primitives/skeleton';

export function PerformanceComparisonSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading performance comparison"
      aria-live="polite"
      className="w-full relative flex flex-col overflow-hidden"
      role="status"
      style={{ backgroundColor: 'rgb(244, 244, 244)', margin: 0, padding: 0 }}
    >
      {/* Background circles */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div 
            className="absolute rounded-full border-gray-400 opacity-10"
            style={{
              width: 'clamp(1200px, 90vw, 3000px)',
              height: 'clamp(1200px, 90vw, 3000px)',
              left: 'clamp(-300px, 0vw, 0px)',
              top: '60%',
              transform: 'translate(0%, -50%)',
              borderWidth: 'clamp(1px, 2vw, 2px)',
              borderStyle: 'solid',
            }}
          />
          <div 
            className="absolute rounded-full border-gray-500 opacity-10"
            style={{
              width: 'clamp(1200px, 90vw, 3000px)',
              height: 'clamp(1200px, 90vw, 3000px)',
              left: 'clamp(400px, 30vw, 1200px)',
              top: '60%',
              transform: 'translate(0%, -50%)',
              borderWidth: 'clamp(1px, 2vw, 2px)',
              borderStyle: 'solid',
            }}
          />
        </div>
      </div>

      {/* PERFORM background image skeleton */}
      <div aria-hidden="true" className="absolute left-0 top-1/2 -translate-y-1/2 w-auto object-contain z-20">
        <div className="w-[200px] h-[600px] bg-gray-300 animate-pulse rounded" />
      </div>

      {/* Header skeleton */}
      <div aria-hidden="true" className="relative px-8 pt-20 pb-2 z-20">
        <div className="text-center">
          <div className="h-12 bg-gray-300 rounded animate-pulse mb-2 mx-auto" style={{ width: '300px' }} />
          <div className="h-6 bg-gray-300 rounded animate-pulse mx-auto" style={{ width: '400px' }} />
        </div>
      </div>

      {/* Desktop Layout skeleton */}
      <div aria-hidden="true" className="relative hidden xl:flex flex-col" style={{ height: 'auto', flex: '0 0 auto', overflow: 'hidden', marginTop: '0', minHeight: '0', paddingTop: '0' }}>
        <div className="relative flex items-center justify-center pointer-events-none xl:max-h-[65vh] lg:max-h-[75vh] md:max-h-[80vh] sm:max-h-[85vh]" style={{ height: 'auto', minHeight: '800px', marginTop: '0' }}>
          {/* Product image skeleton */}
          <Skeleton.Box className="object-contain w-auto h-auto relative z-10 animate-pulse max-w-[600px] max-h-[600px]" />
        </div>
      </div>

      {/* Mobile/Tablet Layout skeleton */}
      <div aria-hidden="true" className="xl:hidden">
        <div className="relative flex justify-center items-center pb-8 -mx-4 md:-mx-8">
          <div className="relative w-full">
            <Skeleton.Box className="object-contain w-full h-auto relative z-10 animate-pulse max-h-[60vh]" />
          </div>
        </div>

        <div className="px-6 md:px-8 pb-6">
          <div className="space-y-6">
            {Array.from({ length: 7 }).map((_, index) => (
              <div className="mb-6" key={index}>
                <Skeleton.Text characterCount={15} className="font-bold text-lg leading-tight mb-2" />
                <Skeleton.Box className="w-full h-2 rounded-full mb-2" />
                <Skeleton.Text characterCount={25} className="text-base" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 