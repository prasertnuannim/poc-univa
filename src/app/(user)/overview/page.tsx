"use client";

import DashboardOverview from "@/components/overview/DashboardOverview";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { DashboardOverviewState } from "./actions";
import { loadDashboardOverview } from "./actions";
import EmptyState from "@/components/ui/emptyState";
import { FileX } from "lucide-react";
import { todayInTimeZone, yesterdayInTimeZone } from "@/lib/date";
import { SkeletonOverview } from "@/components/overview/SkeletonOverview";

const initialState: DashboardOverviewState = {
  data: null,
  volumeSeries: [],
  typeDonut: [],
  perUnit: [],
  maintenanceRows: [],
  loaded: false,
  error: null,
};

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<DashboardOverviewState>(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const rawMode = searchParams?.get("mode");
  const mode =
    rawMode === "range" ? "custom" : rawMode ?? "today";
  const date = searchParams?.get("date") ?? "";
  const start = searchParams?.get("start") ?? "";
  const end = searchParams?.get("end") ?? "";

  useEffect(() => {
    const controller = new AbortController();

    async function fetchOverview() {
      try {
        setIsLoading(true);
        const form = new FormData();
        form.set("mode", mode);
        if (mode === "custom") {
          if (start) form.set("start", start);
          if (end) form.set("end", end);
        } else if (mode !== "all") {
          let resolvedDate = date;

          if (!resolvedDate) {
            if (mode === "previous-day") resolvedDate = yesterdayInTimeZone();
            else resolvedDate = todayInTimeZone();
          }
          form.set("date", resolvedDate);
        }
        const result = await loadDashboardOverview(null, form);
        if (!controller.signal.aborted) {
          setState(result);
        }
      } catch {
        if (!controller.signal.aborted) {
          setState({
            ...initialState,
            error: "Failed to load overview.",
          });
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }
    fetchOverview();
    return () => controller.abort();
  }, [mode, date, start, end]);

  return (
    <div className="flex flex-col space-y-6">
      {state.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {isLoading ? (
        <SkeletonOverview />
      ) : state.data === null ? (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <EmptyState
            title="No data available"
            description="Try changing the date or filter"
            icon={<FileX className="h-5 w-5 text-gray-500" />}
          />
        </div>
      ) : (
        <DashboardOverview
          volumeSeries={state.data.volumeSeries}
          typeDonut={state.data.typeDonut}
          perUnit={state.data.perUnit}
          maintenanceRows={state.data.maintenanceRows}
          mode={mode}
        />
      )}
    </div>
  );
}
