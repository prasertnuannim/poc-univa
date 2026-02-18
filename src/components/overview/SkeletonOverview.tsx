export function SkeletonOverview() {
  const shimmer =
    "bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 bg-size-[400px_100%] animate-[shimmer_3s_ease-in-out_infinite]";
  return (
    <div className="flex flex-col space-y-6" aria-busy="true">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="rounded-xl bg-white p-4 shadow-sm">
            <div className={`h-4 w-2/3 rounded ${shimmer}`} />
            <div className={`mt-3 h-8 w-1/2 rounded ${shimmer}`} />
            <div className={`mt-2 h-3 w-1/3 rounded ${shimmer}`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {[...Array(2)].map((_, index) => (
          <div key={index} className="rounded-xl bg-white p-4 shadow-sm">
            <div className={`h-4 w-40 rounded ${shimmer}`} />
            <div className={`mt-4 h-56 w-full rounded ${shimmer}`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className={`h-4 w-40 rounded ${shimmer}`} />
          <div className={`mt-4 h-56 w-full rounded ${shimmer}`} />
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className={`h-4 w-40 rounded ${shimmer}`} />
          <div className="mt-4 space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`h-3 w-20 rounded ${shimmer}`} />
                <div className={`h-3 flex-1 rounded ${shimmer}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}