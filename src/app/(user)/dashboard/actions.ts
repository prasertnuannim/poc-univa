// app/dashboard/actions.ts
"use server";

import {
  DateFilterDTO,
  DrawerChartDTO,
  DrawerTabDTO,
  MainChartDTO,
  SelectedBarDTO,
  TabKey,
} from "@/server/dto/dashboard.dto";
import {
  getDrawerChart,
  getDrawerTabs,
  getMainCharts,
} from "@/server/services/dashboardService";

type DateLike = Date | string | number;

type DashboardFilterInput = {
  mode?: "day" | "week" | "range" | "custom" | "month" | "year" | "all";
  date?: DateLike;
  from?: DateLike;
  to?: DateLike;
  start?: DateLike;
  end?: DateLike;
  monthISO?: string;
  month?: string;
  year?: string | number;
};

function toISODate(input: Date | string | number | null | undefined) {
  const value = input instanceof Date ? input : new Date(input ?? Date.now());
  return value.toISOString().slice(0, 10);
}

// แปลง DateFilter จาก client เป็น DTO (ส่งข้าม server/client ได้ชัวร์)
function normalizeFilter(filter: DashboardFilterInput | null | undefined): DateFilterDTO {
  if (filter?.mode === "day") {
    return { mode: "day", dateISO: toISODate(filter.date) };
  }
  if (filter?.mode === "week") {
    const base = new Date(filter.date ?? Date.now());
    const start = new Date(base);
    const diffToMonday = (base.getDay() + 6) % 7;
    start.setDate(base.getDate() - diffToMonday);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return { mode: "range", fromISO: toISODate(start), toISO: toISODate(end) };
  }
  if (filter?.mode === "range") {
    return { mode: "range", fromISO: toISODate(filter.from), toISO: toISODate(filter.to) };
  }
  if (filter?.mode === "custom") {
    return { mode: "range", fromISO: toISODate(filter.start), toISO: toISODate(filter.end) };
  }
  if (filter?.mode === "month") {
    const month = filter.monthISO
      ?? (filter.date ? toISODate(filter.date).slice(0, 7) : null)
      ?? filter.month;
    return { mode: "month", monthISO: String(month) };
  }
  if (filter?.mode === "year") {
    const year = filter.year ?? (filter.date ? String(new Date(filter.date).getFullYear()) : null);
    return { mode: "year", year: String(year) };
  }
  if (filter?.mode === "all") {
    return { mode: "range", fromISO: "1970-01-01", toISO: toISODate(new Date()) };
  }
  // default
  return { mode: "day", dateISO: toISODate(new Date()) };
}

export async function getMainChartsAction(
  active: TabKey,
  filter: DashboardFilterInput | null | undefined
): Promise<MainChartDTO[]> {
  return getMainCharts(active, normalizeFilter(filter));
}

export async function getDrawerTabsAction(active: TabKey): Promise<DrawerTabDTO[]> {
  return getDrawerTabs(active);
}

export async function getDrawerHorizontalChartAction(
  active: TabKey,
  drawerTab: TabKey,
  selected: SelectedBarDTO,
  filter: DashboardFilterInput | null | undefined
): Promise<DrawerChartDTO | null> {
  return getDrawerChart(active, drawerTab, selected, normalizeFilter(filter));
}
