export type DashboardOverviewDTO = {
  volumeSeries: { label: string; value: number }[];
  typeDonut: { name: string; value: number }[];
  perUnit: { unit: string; value: number }[];
  maintenanceRows: { date: string; device: string; details: string }[];
};

export type DashboardOverviewState = {
  data: DashboardOverviewDTO | null;
  loaded: boolean;
  errors?: Record<string, string>;
  values?: Record<string, string>;
};
