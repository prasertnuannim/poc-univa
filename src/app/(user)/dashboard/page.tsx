"use client";

import * as React from "react";
import ScrollBarBarChart from "@/components/dashboard/scrollBarBarChart";
import RightPanel from "@/components/dashboard/rightPanel";

import {
  type TabKey,
  type SelectedBar,
  TABS,
  getMockMainCharts,
  getDrawerTabs,
  getMockDrawerHorizontalChart,
} from "@/mocks/dashboardMock";
import { DashboardToolbar, DateFilter } from "@/components/dashboard/dashboardToolbar";

// ✅ ขยาย SelectedBar ให้รองรับหลายกราฟ
type SelectedBarEx = SelectedBar & {
  index: number;
  chartId: string;
};

export default function DashboardTabbedBarChart() {
  const [active, setActive] = React.useState<TabKey>("devices");

  // ✅ mainCharts เป็น array (หลายกราฟ)
  const mainCharts = React.useMemo(() => getMockMainCharts(active), [active]);

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<SelectedBarEx | null>(null);
  const [filter, setFilter] = React.useState<DateFilter>({ mode: "day", date: new Date() });

  const drawerTabs = React.useMemo(() => getDrawerTabs(active), [active]);
  const [drawerTab, setDrawerTab] = React.useState<TabKey>(
    drawerTabs[0]?.key ?? "probes"
  );

  React.useEffect(() => {
    setDrawerTab(drawerTabs[0]?.key ?? "probes");
  }, [active, drawerTabs]);

  const drawerChart = React.useMemo(() => {
    if (!selected) return undefined;

    // getMockDrawerHorizontalChart ของคุณรับ SelectedBar เดิม
    // เลยส่งเฉพาะ field ที่มันต้องใช้
    return getMockDrawerHorizontalChart(active, drawerTab, {
      label: selected.label,
      value: selected.value,
    });
  }, [active, drawerTab, selected]);

  return (
    <div className="w-full">
      {/* Main Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8 px-2">
          {TABS.map((t) => {
            const isActive = t.key === active;
            return (
              <button
                key={t.key}
                onClick={() => {
                  setActive(t.key);
                  setDrawerOpen(false);
                  setSelected(null);
                }}
                className={`relative py-3 text-sm transition ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t.label}
                {isActive && (
                  <span className="absolute -bottom-[1px] left-0 h-[2px] w-full bg-blue-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 px-2 lg:w-1/3">
      <DashboardToolbar
        value={filter}
        onChange={setFilter}
        onExport={() => {
          // ใส่ export logic ของคุณตรงนี้
          console.log("Export with filter:", filter);
        }}
      />
    </div>

      {/* ✅ Split layout */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* LEFT */}
        <div className={`min-w-0 ${drawerOpen ? "lg:col-span-1" : "lg:col-span-2"}`}>
          <div className="space-y-4">
            {mainCharts.map((c) => (
              <ScrollBarBarChart
                key={c.id}
                title={c.title}
                labels={c.labels}
                values={c.values}
                yLabel={c.yLabel}
                onBarClick={({ label, value, index }) => {
                  setSelected({ label, value, index, chartId: c.id });
                  setDrawerOpen(true);
                  setDrawerTab(drawerTabs[0]?.key ?? "probes");
                }}
              />
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className={`min-w-0 ${drawerOpen ? "block lg:sticky lg:top-4" : "hidden"}`}>
          <RightPanel
            open={drawerOpen}
            title={selected ? `${selected.label} • ${selected.chartId}` : "Details"}
            onClose={() => setDrawerOpen(false)}
            tabs={drawerTabs}
            activeTab={drawerTab}
            onTabChange={setDrawerTab}
            summary={selected ? { name: selected.label, total: selected.value } : undefined}
            chart={drawerChart ? { title: drawerChart.title, data: drawerChart.data } : undefined}
          />
        </div>
      </div>
    </div>
  );
}
