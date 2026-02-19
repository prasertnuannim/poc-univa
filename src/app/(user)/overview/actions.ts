"use server";

import { RateLimiter } from "@/server/security/rateLimiter";
import { isAppError } from "@/server/security/appError";
import { OVERVIEW_RATE_LIMIT } from "@/server/constants/dashboard";
import { overviewSchema, type OverviewInput } from "@/server/schemas/overview.schema";
import { buildFilterFromInput, fetchOverviewRaw } from "@/server/services/overviewService";
import { overviewRateLimitKey } from "@/server/security/dashboardPolicy";
import { toDashboardOverviewDTOOrNull } from "@/server/mappers/overviewMapper";
import type { DashboardOverviewDTO } from "@/server/dto/overview.dto";


// import { getServerAuthSession } from "@/server/services/auth/sessionService"; // ถ้ามี

export type DashboardOverviewState = {
  data: DashboardOverviewDTO | null;
  volumeSeries: { label: string; value: number }[];
  typeDonut: { name: string; value: number }[];
  perUnit: { unit: string; value: number }[];
  maintenanceRows: { date: string; device: string; details: string }[];
  loaded: boolean;
  errors?: Record<string, string>;
  values?: OverviewInput;
  error?: string | null;
};

const limiter = RateLimiter(OVERVIEW_RATE_LIMIT.max, OVERVIEW_RATE_LIMIT.windowSec);

export async function loadDashboardOverview(
  _prev: unknown,
  formData: FormData
): Promise<DashboardOverviewState> {
  const rawMode = (formData.get("mode") ?? "today") as string;
  const normalizedMode = rawMode === "range" ? "custom" : rawMode;

  const raw: OverviewInput = {
    mode: normalizedMode as OverviewInput["mode"],
    date: formData.get("date") ? String(formData.get("date")) : undefined,
    start: formData.get("start") ? String(formData.get("start")) : undefined,
    end: formData.get("end") ? String(formData.get("end")) : undefined,
    granularity: (formData.get("granularity") ?? "day") as OverviewInput["granularity"],
  };

  try {
    const parsed = overviewSchema.safeParse(raw);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.errors.forEach((e) => (errors[String(e.path[0] ?? "general")] = e.message));
      return { data: null, volumeSeries: [], typeDonut: [], perUnit: [], maintenanceRows: [], loaded: false, errors, values: raw, error: null };
    }

    // const session = await getServerAuthSession();
    // await limiter.check(overviewRateLimitKey(session?.user?.id));
    await limiter.check(overviewRateLimitKey(null));

    const filter = buildFilterFromInput(parsed.data);
    const rawData = await fetchOverviewRaw({
      filter,
      granularity: parsed.data.granularity,
      maintenanceLimit: 5,
    });

    const dto = toDashboardOverviewDTOOrNull(rawData);
    const safeDto = dto ?? {
      volumeSeries: [],
      typeDonut: [],
      perUnit: [],
      maintenanceRows: [],
    };

    return { data: dto, ...safeDto, loaded: true, errors: {}, values: raw, error: null };
  } catch (err) {
    if (err instanceof Error && err.message === "Too many requests") {
      return { data: null, volumeSeries: [], typeDonut: [], perUnit: [], maintenanceRows: [], loaded: false, errors: { general: "Too many requests. Please try again later." }, values: raw, error: null };
    }
    if (isAppError(err)) {
      return { data: null, volumeSeries: [], typeDonut: [], perUnit: [], maintenanceRows: [], loaded: false, errors: { general: err.message }, values: raw, error: err.message };
    }
    return { data: null, volumeSeries: [], typeDonut: [], perUnit: [], maintenanceRows: [], loaded: false, errors: { general: "Failed to load overview." }, values: raw, error: "Failed to load overview." };
  }
}
