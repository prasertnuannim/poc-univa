"use client";

import DashboardOverview from "@/components/overview/DashboardOverview";
import { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import type { DashboardOverviewState } from "./actions";
import { loadDashboardOverview } from "./actions";
import EmptyState from "@/components/ui/emptyState";
import { FileX } from "lucide-react";

const initialState: DashboardOverviewState = {
  data: null,
  volumeSeries: [],
  typeDonut: [],
  perUnit: [],
  maintenanceRows: [],
  loaded: false,
  error: null,
};

function DashboardOverviewSkeleton() {
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

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<DashboardOverviewState>(initialState);
  const [isPending, startTransition] = useTransition();
  const rawMode = searchParams?.get("mode");
  const mode =
    rawMode === "day"
      ? "today"
      : rawMode === "range"
        ? "custom"
        : rawMode ?? "today";
  const date = searchParams?.get("date") ?? "";
  const start = searchParams?.get("start") ?? "";
  const end = searchParams?.get("end") ?? "";
  useEffect(() => {
    const data = new FormData();
    data.set("mode", mode);
    if (mode === "custom") {
      if (start) data.set("start", start);
      if (end) data.set("end", end);
    } else if (mode !== "all") {
      const resolvedDate = date || new Date().toISOString().slice(0, 10);
      data.set("date", resolvedDate);
    }
    startTransition(() => {
      loadDashboardOverview(null, data)
        .then((next) => setState(next))
        .catch(() => {
          setState({
            ...initialState,
            error: "Failed to load overview.",
          });
        });
    });
  }, [mode, date, start, end, startTransition]);
  const isLoading = isPending || (!state.loaded && state.data !== null);

  return (
    <div className="flex flex-col space-y-6">
      {state.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {state.error}
        </div>
      ) : null}
      {isLoading ? (
        <DashboardOverviewSkeleton />
      ) : state.data === null ? (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <EmptyState
            title="No data available"
            description="Try changing the date or filter"
            icon={<FileX className="h-5 w-5 text-gray-500" aria-hidden="true" />}
          />
        </div>
      ) : (
        <DashboardOverview
          volumeSeries={state.data.volumeSeries}
          typeDonut={state.data.typeDonut}
          perUnit={state.data.perUnit}
          maintenanceRows={state.data.maintenanceRows}
        />
      )}
    </div>
  );
}
