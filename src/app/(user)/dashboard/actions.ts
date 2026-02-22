"use server";

import type {
  DateFilterDTO,
  DrawerChartDTO,
  DrawerTabDTO,
  MainChartDTO,
  SelectedBarDTO,
  TabKey,
} from "@/server/dto/dashboard.dto";
import {
  toDrawerChartActionDTO,
  toDrawerTabsActionDTO,
  toMainChartsActionDTO,
} from "@/server/mappers/dashboard.mapper";
import {
  getDrawerChart,
  getDrawerTabs,
  getMainCharts,
} from "@/server/services/dashboardService";
import { RateLimiter } from "@/server/security/rateLimiter";
import { isAppError } from "@/server/security/appError";
import {
  canViewDashboard,
  dashboardRateLimitKey,
} from "@/server/security/dashboardPolicy";
import {
  dashboardFilterInputSchema,
  selectedBarSchema,
  tabKeySchema,
  type DashboardFilter,
} from "@/server/schemas/dashboard.schema";

type DateLike = Date | string | number;

const TAB_FALLBACK: TabKey = "devices";
const DRAWER_FALLBACK: TabKey = "probes";
const limiter = RateLimiter(60, 60);

async function withDashboardSecurity<TResult>(
  fallback: TResult,
  execute: () => Promise<TResult>,
): Promise<TResult> {
  try {
    if (!canViewDashboard()) return fallback;

    // const session = await getServerAuthSession();
    // await limiter.check(dashboardRateLimitKey(session?.user?.id));
    await limiter.check(dashboardRateLimitKey(null));
    return await execute();
  } catch (err) {
    if (err instanceof Error && err.message === "Too many requests") return fallback;
    if (isAppError(err)) return fallback;
    throw err;
  }
}

function toISODate(input: DateLike | null | undefined, fallback = new Date()) {
  const value = input instanceof Date ? input : new Date(input ?? fallback);
  if (Number.isNaN(value.getTime())) {
    const safeFallback = new Date(fallback);
    return Number.isNaN(safeFallback.getTime())
      ? new Date().toISOString().slice(0, 10)
      : safeFallback.toISOString().slice(0, 10);
  }
  return value.toISOString().slice(0, 10);
}

function toYear(input: DateLike | null | undefined) {
  const value = input instanceof Date ? input : new Date(input ?? Date.now());
  if (Number.isNaN(value.getTime())) return null;
  return String(value.getFullYear());
}

function toRangeFromWeek(dateLike: DateLike | null | undefined): DateFilterDTO {
  const base = dateLike instanceof Date ? new Date(dateLike) : new Date(dateLike ?? Date.now());
  if (Number.isNaN(base.getTime())) {
    return { mode: "day", dateISO: toISODate(new Date()) };
  }

  const start = new Date(base);
  const diffToMonday = (base.getDay() + 6) % 7;
  start.setDate(base.getDate() - diffToMonday);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return { mode: "range", fromISO: toISODate(start), toISO: toISODate(end) };
}

function normalizeFilter(filter: DashboardFilter | null): DateFilterDTO {
  if (filter?.mode === "day") {
    return { mode: "day", dateISO: toISODate(filter.date) };
  }

  if (filter?.mode === "week") {
    return toRangeFromWeek(filter.date);
  }

  if (filter?.mode === "range") {
    return { mode: "range", fromISO: toISODate(filter.from), toISO: toISODate(filter.to) };
  }

  if (filter?.mode === "custom") {
    return { mode: "range", fromISO: toISODate(filter.start), toISO: toISODate(filter.end) };
  }

  if (filter?.mode === "month") {
    const monthISO = filter.monthISO
      ?? (filter.date ? toISODate(filter.date).slice(0, 7) : undefined)
      ?? filter.month
      ?? toISODate(new Date()).slice(0, 7);

    return { mode: "month", monthISO: String(monthISO) };
  }

  if (filter?.mode === "year") {
    const year = filter.year
      ?? (filter.date ? toYear(filter.date) : undefined)
      ?? String(new Date().getFullYear());

    return { mode: "year", year: String(year) };
  }

  if (filter?.mode === "all") {
    return { mode: "range", fromISO: "1970-01-01", toISO: toISODate(new Date()) };
  }

  return { mode: "day", dateISO: toISODate(new Date()) };
}

function parseTabKey(value: unknown, fallback: TabKey): TabKey {
  const parsed = tabKeySchema.safeParse(value);
  return parsed.success ? parsed.data : fallback;
}

function parseFilter(input: unknown): DashboardFilter | null {
  if (input == null) return null;
  const parsed = dashboardFilterInputSchema.safeParse(input);
  return parsed.success ? parsed.data : null;
}

function parseSelectedBar(input: unknown): SelectedBarDTO | null {
  const parsed = selectedBarSchema.safeParse(input);
  return parsed.success ? parsed.data : null;
}

export async function getMainChartsAction(
  active: TabKey,
  filter: DashboardFilter | null | undefined,
): Promise<MainChartDTO[]> {
  return withDashboardSecurity([], async () => {
    const activeTab = parseTabKey(active, TAB_FALLBACK);
    const parsedFilter = parseFilter(filter);
    const charts = await getMainCharts(activeTab, normalizeFilter(parsedFilter));
    return toMainChartsActionDTO(charts);
  });
}

export async function getDrawerTabsAction(active: TabKey): Promise<DrawerTabDTO[]> {
  return withDashboardSecurity([], async () => {
    const activeTab = parseTabKey(active, TAB_FALLBACK);
    const tabs = await getDrawerTabs(activeTab);
    return toDrawerTabsActionDTO(tabs);
  });
}

export async function getDrawerHorizontalChartAction(
  active: TabKey,
  drawerTab: TabKey,
  selected: SelectedBarDTO,
  filter: DashboardFilter | null | undefined,
): Promise<DrawerChartDTO | null> {
  const activeTab = parseTabKey(active, TAB_FALLBACK);
  const drawerFallback = activeTab === "devices" ? DRAWER_FALLBACK : TAB_FALLBACK;
  const drawer = parseTabKey(drawerTab, drawerFallback);
  const selectedBar = parseSelectedBar(selected);
  if (!selectedBar) return null;

  const parsedFilter = parseFilter(filter);
  return withDashboardSecurity(null, async () => {
    const chart = await getDrawerChart(
      activeTab,
      drawer,
      selectedBar,
      normalizeFilter(parsedFilter),
    );
    return toDrawerChartActionDTO(chart);
  });
}
