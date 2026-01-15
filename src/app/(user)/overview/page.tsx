import DashboardOverview from "@/components/overview/DashboardOverview";
import {
  getExamVolumeByTime,
  getExamVolumeByType,
  getExamVolumePerDepartment,
  getRecentMaintenanceRecordsRaw,
} from "./actions";

function formatDateLabel(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

export default async function DashboardPage() {
  const filter = { mode: "month", date: new Date() } as const;

  const [volumeRes, typeRes, deptRes, maintenanceRes] = await Promise.all([
    getExamVolumeByTime(filter, "day"),
    getExamVolumeByType(filter),
    getExamVolumePerDepartment(filter),
    getRecentMaintenanceRecordsRaw(5),
  ]);

  const volumeSeries = volumeRes.data.map((row) => ({
    label: formatDateLabel(row.period),
    value: row.total,
  }));

  const typeDonut = typeRes.data.map((row) => ({
    name: row.label,
    value: row.total,
  }));

  const perUnit = deptRes.data.map((row) => ({
    unit: row.department,
    value: row.total,
  }));

  const maintenanceRows = maintenanceRes.data.map((row) => ({
    date: formatDateLabel(row.date),
    device: row.device,
    details: row.details,
  }));

  return (
    <div className="space-y-6">
      {/* ================= Header ================= */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        <div className="flex items-center gap-2">
          <div className="rounded-lg border px-3 py-1 text-sm text-gray-500">
            TODAY<br />
            <span className="font-medium text-gray-700">
              Nov 25, 2025
            </span>
          </div>

          <button className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">
            Change Period
          </button>
        </div>
      </div>

      <DashboardOverview
        volumeSeries={volumeSeries}
        typeDonut={typeDonut}
        perUnit={perUnit}
        maintenanceRows={maintenanceRows}
      />
    </div>
  );
}
