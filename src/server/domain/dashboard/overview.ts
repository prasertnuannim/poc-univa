import type { TimeGranularity } from "@/server/constants/dashboard";

export type DateFilter =
  | { mode: "today"; date: Date }
  | { mode: "week"; date: Date }
  | { mode: "month"; date: Date }
  | { mode: "year"; date: Date }
  | { mode: "all" }
  | { mode: "custom"; start: Date; end: Date };

export type OverviewQuery = {
  filter: DateFilter;
  granularity: TimeGranularity;
  maintenanceLimit: number;
};

export type OverviewRaw = {
  volume: { label: string; total: number }[];
  types: { label: string; total: number }[];
  departments: { department: string; total: number }[];
  maintenance: { id: string; date: Date; device: string; details: string }[];
};
