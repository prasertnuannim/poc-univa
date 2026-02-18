export type TimeGranularity = "hour" | "day" | "week" | "month";

export const GRANULARITY_MAP: Record<TimeGranularity, string> = {
  hour: "hour",
  day: "day",
  week: "week",
  month: "month",
};

export const OVERVIEW_RATE_LIMIT = { max: 20, windowSec: 60 } as const;
