"use client";

import StatCard from "./StatCard";
import ExamsVolumeLine from "./ExamsVolumeLine";
import ExamsTypeDonut from "./ExamsTypeDonut";
import ExamsPerUnitBar from "./ExamsPerUnitBar";
import RecentMaintenanceTable from "./RecentMaintenanceTable";

type DashboardOverviewProps = {
  volumeSeries: { label: string; value: number }[];
  typeDonut: { name: string; value: number }[];
  perUnit: { unit: string; value: number }[];
  maintenanceRows: { date: string; device: string; details: string }[];
  mode: string;
};

export default function DashboardOverview({
  volumeSeries,
  typeDonut,
  perUnit,
  maintenanceRows,
  mode,
}: DashboardOverviewProps) {
  const totalExams = volumeSeries.reduce((sum, row) => sum + row.value, 0);

  return (
    <div className="flex flex-col space-y-6">
      {/* Top stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total exams volume"
          value={totalExams}
          delta="+12%"
        />
        <StatCard title="Avg. Utilization Rate" value="78%" delta="+2%" />
        <StatCard title="Active devices" value={34} delta="0%" />
        <StatCard title="Referring Physician" value={10} delta="-1%" negative />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ExamsVolumeLine data={volumeSeries} mode={mode} />
        <ExamsTypeDonut data={typeDonut} />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ExamsPerUnitBar data={perUnit} />
        <RecentMaintenanceTable data={maintenanceRows} />
      </div>
    </div>
  );
}
