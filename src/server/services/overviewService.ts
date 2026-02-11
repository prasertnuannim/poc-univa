import type { OverviewQuery, DateFilter, OverviewRaw } from "@/server/domain/dashboard/overview";
import type { TimeGranularity } from "@/server/constants/dashboard";
import * as repo from "@/server/query/overviewRepo";
import { createAppError } from "@/server/security/appError";

function parseDateOrThrow(v: string, name: string) {
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) throw createAppError("INVALID_DATE", `Invalid ${name}.`);
  return d;
}

function resolveDateRange(filter: DateFilter) {
  let start: Date;
  let end: Date;
  switch (filter.mode) {
    case "today":
      console.log("today case")
      start = new Date(filter.date); start.setHours(0,0,0,0);
      end = new Date(start); end.setDate(end.getDate() + 1);
      break;

    case "week":
      start = new Date(filter.date);
      start.setDate(start.getDate() - start.getDay());
      start.setHours(0,0,0,0);
      end = new Date(start); end.setDate(end.getDate() + 7);
      break;

    case "month":
      start = new Date(filter.date); start.setDate(1); start.setHours(0,0,0,0);
      end = new Date(start); end.setMonth(end.getMonth() + 1);
      break;

    case "year":
      start = new Date(filter.date); start.setMonth(0,1); start.setHours(0,0,0,0);
      end = new Date(start); end.setFullYear(end.getFullYear() + 1);
      break;

    case "custom":
      start = new Date(filter.start); start.setHours(0,0,0,0);
      end = new Date(filter.end); end.setHours(0,0,0,0);
      end.setDate(end.getDate() + 1); // exclusive
      break;

    case "all":
      start = new Date(0);
      end = new Date(8640000000000000);
      break;
  }

  return { start, end };
}

function resolveGranularityFromFilter(_filter: DateFilter): TimeGranularity {
  return "hour";
}

export async function fetchOverviewRaw(query: OverviewQuery): Promise<OverviewRaw> {
  const { start, end } = resolveDateRange(query.filter);
  console.log(" start, end>> ",  start, end)
  console.log("query>>",query)
  const granularity = resolveGranularityFromFilter(query.filter);

  const [volume, types, departments, maintenance] = await Promise.all([
    repo.getVolumeByTime(start, end, granularity),
    repo.getVolumeByType(start, end),
    repo.getVolumeByDepartment(start, end),
    repo.getRecentMaintenance(query.maintenanceLimit),
  ]);

  return { volume, types, departments, maintenance };
}

export function buildFilterFromInput(input: {
  mode: "today" | "week" | "month" | "year" | "all" | "custom";
  date?: string;
  start?: string;
  end?: string;
}): DateFilter {
  if (input.mode === "all") return { mode: "all" };
  if (input.mode === "custom") {
    return { mode: "custom", start: parseDateOrThrow(input.start!, "start"), end: parseDateOrThrow(input.end!, "end") };
  }
  return { mode: input.mode, date: parseDateOrThrow(input.date!, "date") } as DateFilter;
}
