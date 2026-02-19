export function SkeletonOverviewFilter() {
  return (
    <div
      className="
        sticky top-14 z-10
        mx-4 mt-3
        flex items-center justify-between
        rounded-2xl border border-gray-200/70
        bg-white/80 backdrop-blur
        px-4 py-2
        shadow-md
      "
    >
      <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
      <div className="h-8 w-28 animate-pulse rounded bg-gray-200" />
    </div>
  );
}