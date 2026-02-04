import type { DashboardOverviewDTO } from "@/server/dto/overview.dto";

export function toDashboardOverviewDTOOrNull(raw: {
  volume: { label: string; total: number }[];
  types: { label: string; total: number }[];
  departments: { department: string; total: number }[];
  maintenance: { id: string; date: Date; device: string; details: string }[];
}): DashboardOverviewDTO | null {
  const hasAny =
    raw.volume.length > 0 ||
    raw.types.length > 0 ||
    raw.departments.length > 0 ||
    raw.maintenance.length > 0;

  if (!hasAny) return null;

  const iso = (v: Date | string) => {
    const d = v instanceof Date ? v : new Date(v);
    return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
  };

  return {
    volumeSeries: raw.volume.map((r) => ({ label: r.label, value: r.total })),
    typeDonut: raw.types.map((r) => ({ name: r.label, value: r.total })),
    perUnit: raw.departments.map((r) => ({ unit: r.department, value: r.total })),
    maintenanceRows: raw.maintenance.map((r) => ({
      date: iso(r.date),
      device: r.device,
      details: r.details,
    })),
  };
}
