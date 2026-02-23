"use client";

import * as React from "react";
import ScrollBarBarChart from "@/components/dashboard/ScrollBarBarChart";
import RightPanel from "@/components/dashboard/rightPanel";
import {
  DashboardToolbar,
  DateFilter,
} from "@/components/dashboard/DashboardToolbar";
import {
  type DrawerTabDTO,
  type MainChartDTO,
  type SelectedBarDTO,
  type TabKey,
} from "@/server/dto/dashboard.dto";
import {
  getDrawerHorizontalChartAction,
  getDrawerTabsAction,
  getMainChartsAction,
} from "./actions";

type SelectedBarEx = SelectedBarDTO & {
  index: number;
  chartId: string;
};

type DrawerChartView = {
  title: string;
  data: {
    labels: string[];
    values: number[];
  };
};

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: "devices", label: "Devices" },
  { key: "probes", label: "Probes" },
  { key: "units", label: "Units" },
  { key: "examTypes", label: "Exam types" },
  { key: "operators", label: "Operators" },
  { key: "physicians", label: "Physicians" },
];

export default function DashboardTabbedBarChart() {
  const [active, setActive] = React.useState<TabKey>("devices");
  const [mainCharts, setMainCharts] = React.useState<MainChartDTO[]>([]);
  const [drawerTabs, setDrawerTabs] = React.useState<DrawerTabDTO[]>([]);
  const [drawerChart, setDrawerChart] = React.useState<DrawerChartView>();

  const [filter, setFilter] = React.useState<DateFilter>({
    mode: "day",
    date: new Date(),
  });
  const [drawerTab, setDrawerTab] = React.useState<TabKey>("probes");
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<SelectedBarEx | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const charts = await getMainChartsAction(active, filter);
        if (!cancelled) setMainCharts(charts);
      } catch (error) {
        console.error("Failed to load main charts", error);
        if (!cancelled) setMainCharts([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [active, filter]);

  React.useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const tabs = await getDrawerTabsAction(active);
        if (!cancelled) setDrawerTabs(tabs);
      } catch (error) {
        console.error("Failed to load drawer tabs", error);
        if (!cancelled) setDrawerTabs([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [active]);

  React.useEffect(() => {
    setDrawerTab(drawerTabs[0]?.key ?? "probes");
  }, [drawerTabs]);

  React.useEffect(() => {
    if (!selected) {
      setDrawerChart(undefined);
      return;
    }
    let cancelled = false;

    void (async () => {
      try {
        const chart = await getDrawerHorizontalChartAction(
          active,
          drawerTab,
          {
            label: selected.label,
            value: selected.value,
          },
          filter,
        );

        if (cancelled) return;
        if (!chart) {
          setDrawerChart(undefined);
          return;
        }

        setDrawerChart({
          title: chart.title,
          data: {
            labels: chart.data.map((item) => item.label),
            values: chart.data.map((item) => item.value),
          },
        });
      } catch (error) {
        console.error("Failed to load drawer chart", error);
        if (!cancelled) setDrawerChart(undefined);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [active, drawerTab, selected, filter]);

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
                  <span className="absolute -bottom-px left-0 h-0.5 w-full bg-blue-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex mt-3 px-2 lg:w-1/3">
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
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* LEFT */}
        <div
          className={`min-w-0 ${drawerOpen ? "lg:col-span-1" : "lg:col-span-2"}`}
        >
          <div className="space-y-4">
            {mainCharts.map((c) => (
              <ScrollBarBarChart
                key={c.id}
                title={c.title}
                labels={c.labels}
                values={c.values}
                yLabel={c.yLabel}
                height={mainCharts.length === 1 ? 420 : 280}
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
        <div
          className={`min-w-0 ${drawerOpen ? "block lg:sticky lg:top-4" : "hidden"}`}
        >
          <RightPanel
            open={drawerOpen}
            title={
              selected ? `${selected.label} • ${selected.chartId}` : "Details"
            }
            onClose={() => setDrawerOpen(false)}
            tabs={drawerTabs}
            activeTab={drawerTab}
            onTabChange={setDrawerTab}
            summary={
              selected
                ? { name: selected.label, total: selected.value }
                : undefined
            }
            chart={
              drawerChart
                ? { title: drawerChart.title, data: drawerChart.data }
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}
