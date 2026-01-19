import * as Skeleton from '@/vibes/soul/primitives/skeleton';

export default function HomeLoading() {
  return (
    <Skeleton.Root pending>
      <div className="animate-pulse">
        {/* MarketplaceShowcase skeleton */}
        <section className="pb-5 md:pb-8 lg:pb-12">
          <div className="rounded-b-[30px] bg-blue-100 px-1 pb-2 pt-20 md:px-8 md:pb-3 md:pt-24 lg:pb-4">
            {/* Header skeleton */}
            <div className="mb-10 pl-8 sm:pl-12 md:mb-16 md:pl-16">
              <Skeleton.Text characterCount={15} className="mb-2 text-xl md:text-4xl" />
              <Skeleton.Text characterCount={20} className="text-4xl md:text-7xl" />
              <Skeleton.Text characterCount={25} className="mt-3 text-xl md:text-3xl" />
              <Skeleton.Text characterCount={18} className="mt-6 text-lg md:text-3xl" />
            </div>

            {/* Product cards skeleton */}
            <div className="flex gap-3 overflow-hidden pl-8 sm:pl-12 md:gap-4 md:pl-16">
              {[...Array(6)].map((_, i) => (
                <div
                  className="min-w-[110px] max-w-[180px] shrink-0 rounded-[24px] bg-white p-1"
                  key={i}
                >
                  <Skeleton.Box className="aspect-[3/4.2] rounded-[22px] bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BrandShowcase skeleton */}
        <section className="px-4 py-8 md:px-8 md:py-12">
          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton.Box className="h-48 rounded-[20px] bg-gray-100 md:h-64" key={i} />
            ))}
          </div>
        </section>

        {/* LegitBrands skeleton */}
        <section className="mb-12 px-4 md:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 rounded-[30px] bg-blue-50 p-8 md:flex-row">
            <div className="flex-1 space-y-4">
              <Skeleton.Text characterCount={20} className="text-2xl" />
              <Skeleton.Text characterCount={30} className="text-lg" />
              <Skeleton.Text characterCount={15} className="text-base" />
            </div>
            <Skeleton.Box className="aspect-video flex-1 rounded-[20px] bg-gray-200" />
          </div>
        </section>

        {/* ProcessSection skeleton */}
        <section className="rounded-[30px] bg-blue-500 px-4 py-12 md:px-8 md:py-16">
          <div className="mx-auto max-w-6xl space-y-8">
            <Skeleton.Text characterCount={25} className="text-2xl text-white/30" />
            <div className="grid gap-4 md:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton.Box className="h-64 rounded-[20px] bg-white/10" key={i} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </Skeleton.Root>
  );
}
