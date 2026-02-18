"use client";

import * as React from "react";
import HorizontalBarChart from "./horizontalBarChart";

type TabKey =
  | "devices"
  | "probes"
  | "units"
  | "examTypes"
  | "operators"
  | "physicians";

type DrawerTab = { key: TabKey; label: string };

type RightDrawerProps = {
  open: boolean;
  title: string;
  onClose: () => void;

  tabs?: DrawerTab[];
  activeTab?: TabKey;
  onTabChange?: (key: TabKey) => void;

  summary?: { name: string; total: number };
  chart?: { title: string; data: { labels: string[]; values: number[] } };
};

export default function RightPanel(props: RightDrawerProps) {
  const { open, title, onClose, tabs, activeTab, onTabChange, chart } =
    props;

  // ✅ แบ่งครึ่ง: ถ้าไม่เปิดก็ไม่ต้องแสดงฝั่งขวา
  if (!open) return null;

  return (
    <div className="w-full rounded-2xl border border-gray-200/60 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold truncate">{title}</div>
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>

        {/* ✅ Tabs */}
        {tabs && tabs.length > 0 && activeTab && onTabChange && (
          <div className="mt-3">
            <div className="inline-flex rounded-md border bg-gray-50 p-1">
              {tabs.map((t) => {
                const isActive = t.key === activeTab;
                return (
                  <button
                    key={t.key}
                    onClick={() => onTabChange(t.key)}
                    className={`px-3 py-1.5 text-xs rounded-md transition ${
                      isActive
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {/* ✅ Summary (ถ้ามี) */}
        {/* {summary && (
          <div className="rounded-lg border border-gray-200/60 bg-gray-50 p-3">
            <div className="text-xs text-gray-500">Selected</div>
            <div className="text-sm font-medium">{summary.name}</div>
            <div className="text-sm text-gray-600">Total: {summary.total}</div>
          </div>
        )} */}

        {chart && (
          <div className="rounded-lg border p-3">
            <HorizontalBarChart
              title={chart.title}
              labels={chart.data.labels}
              values={chart.data.values}
              height={280}
            />
          </div>
        )}
      </div>
    </div>
  );
}
