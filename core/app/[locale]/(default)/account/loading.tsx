export default function Loading() {
  return (
    <div className="space-y-8">
      {/* Loading skeleton for dashboard widgets */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Stats cards skeleton */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div 
            key={i} 
            className="h-32 animate-pulse rounded-2xl bg-contrast-100"
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Main content area skeleton */}
      <div className="grid gap-8 xl:grid-cols-2">
        {/* Recent orders skeleton */}
        <div className="space-y-4">
          <div className="h-8 w-32 animate-pulse rounded bg-contrast-100" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div 
                key={i} 
                className="h-24 animate-pulse rounded-xl bg-contrast-100"
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        {/* Account status skeleton */}
        <div className="space-y-4">
          <div className="h-8 w-40 animate-pulse rounded bg-contrast-100" />
          <div className="h-64 animate-pulse rounded-xl bg-contrast-100" />
        </div>
      </div>

      {/* Additional sections skeleton */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Addresses skeleton */}
        <div className="space-y-4">
          <div className="h-8 w-36 animate-pulse rounded bg-contrast-100" />
          <div className="h-32 animate-pulse rounded-xl bg-contrast-100" />
        </div>

        {/* Wishlists skeleton */}
        <div className="space-y-4">
          <div className="h-8 w-28 animate-pulse rounded bg-contrast-100" />
          <div className="h-32 animate-pulse rounded-xl bg-contrast-100" />
        </div>
      </div>
    </div>
  );
}