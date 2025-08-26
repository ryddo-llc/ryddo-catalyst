export default function Loading() {
  return (
    <div className="h-full animate-pulse">
      {/* Simplified loading state - StreamableDashboard has its own detailed skeleton */}
      <div className="space-y-4">
        <div className="h-8 w-48 rounded bg-contrast-100" />
        <div className="h-96 rounded-xl bg-contrast-50" />
      </div>
    </div>
  );
}