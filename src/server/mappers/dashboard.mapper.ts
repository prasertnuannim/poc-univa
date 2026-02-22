import type {
  DrawerChartDTO,
  DrawerTabDTO,
  MainChartDTO,
} from "@/server/dto/dashboard.dto";

export function toChartDTO(args: {
  id: string;
  title: string;
  rows: { label: string; value: number }[];
  yLabel?: string;
}) {
  return {
    id: args.id,
    title: args.title,
    labels: args.rows.map((r) => r.label),
    values: args.rows.map((r) => r.value),
    yLabel: args.yLabel,
  };
}

export function toMainChartsActionDTO(charts: MainChartDTO[]): MainChartDTO[] {
  return charts.map((chart) => ({
    ...chart,
    labels: [...chart.labels],
    values: [...chart.values],
  }));
}

export function toDrawerTabsActionDTO(tabs: DrawerTabDTO[]): DrawerTabDTO[] {
  return tabs.map((tab) => ({ ...tab }));
}

export function toDrawerChartActionDTO(chart: DrawerChartDTO | null): DrawerChartDTO | null {
  if (!chart) return null;
  return {
    ...chart,
    data: chart.data.map((item) => ({ ...item })),
  };
}
