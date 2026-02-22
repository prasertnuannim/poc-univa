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

const EMPTY_OVERVIEW_FIELDS: Pick<
  DashboardOverviewState,
  "volumeSeries" | "typeDonut" | "perUnit" | "maintenanceRows"
> = {
  volumeSeries: [],
  typeDonut: [],
  perUnit: [],
  maintenanceRows: [],
};

function createState(
  raw: OverviewInput,
  overrides: Partial<DashboardOverviewState>,
): DashboardOverviewState {
  return {
    data: null,
    ...EMPTY_OVERVIEW_FIELDS,
    loaded: false,
    errors: {},
    values: raw,
    error: null,
    ...overrides,
  };
}

function parseFormToOverviewInput(formData: FormData): OverviewInput {
  const rawMode = (formData.get("mode") ?? "today") as string;
  const normalizedMode = rawMode === "range" ? "custom" : rawMode;

  return {
    mode: normalizedMode as OverviewInput["mode"],
    date: formData.get("date") ? String(formData.get("date")) : undefined,
    start: formData.get("start") ? String(formData.get("start")) : undefined,
    end: formData.get("end") ? String(formData.get("end")) : undefined,
    granularity: (formData.get("granularity") ?? "day") as OverviewInput["granularity"],
  };
}

function toValidationErrors(raw: OverviewInput): Record<string, string> {
  const parsed = overviewSchema.safeParse(raw);
  if (parsed.success) return {};

  const errors: Record<string, string> = {};
  for (const issue of parsed.error.errors) {
    errors[String(issue.path[0] ?? "general")] = issue.message;
  }
  return errors;
}

async function executeOverviewUseCase(input: OverviewInput): Promise<DashboardOverviewDTO | null> {
  // const session = await getServerAuthSession();
  // await limiter.check(overviewRateLimitKey(session?.user?.id));
  await limiter.check(overviewRateLimitKey(null));

  const filter = buildFilterFromInput(input);
  const rawData = await fetchOverviewRaw({
    filter,
    granularity: input.granularity,
    maintenanceLimit: 5,
  });
  return toDashboardOverviewDTOOrNull(rawData);
}

export async function loadDashboardOverview(
  _prev: unknown,
  formData: FormData,
): Promise<DashboardOverviewState> {
  const raw = parseFormToOverviewInput(formData);

  try {
    const errors = toValidationErrors(raw);
    if (Object.keys(errors).length > 0) {
      return createState(raw, { errors });
    }

    const dto = await executeOverviewUseCase(raw);
    const safeDto = dto ?? {
      ...EMPTY_OVERVIEW_FIELDS,
    };

    return createState(raw, {
      data: dto,
      ...safeDto,
      loaded: true,
      errors: {},
    });
  } catch (err) {
    if (err instanceof Error && err.message === "Too many requests") {
      return createState(raw, {
        errors: { general: "Too many requests. Please try again later." },
      });
    }

    if (isAppError(err)) {
      return createState(raw, {
        errors: { general: err.message },
        error: err.message,
      });
    }

    return createState(raw, {
      errors: { general: "Failed to load overview." },
      error: "Failed to load overview.",
    });
  }
}
