
export type TabKey =
  | "devices"
  | "probes"
  | "units"
  | "examTypes"
  | "operators"
  | "physicians";

export type DateFilterDTO =
  | { mode: "day"; dateISO: string } // YYYY-MM-DD
  | { mode: "range"; fromISO: string; toISO: string }
  | { mode: "month"; monthISO: string } // YYYY-MM
  | { mode: "year"; year: string }; // YYYY

export type MainChartDTO = {
  id: string;
  title: string;
  labels: string[];
  values: number[];
  yLabel?: string;
};

export type DrawerTabDTO = {
  key: TabKey;
  label: string;
};

export type SelectedBarDTO = {
  label: string;
  value: number;
};

export type DrawerChartDTO = {
  title: string;
  data: { label: string; value: number }[];
};
