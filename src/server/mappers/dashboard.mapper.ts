// server/mappers/dashboard.mapper.ts
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
