"use client";

import * as React from "react";
import HorizontalBarChart from "./HorizontalBarChart";

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
  const { open, title, onClose, tabs, activeTab, onTabChange, summary, chart } =
    props;


  if (!open) return null;

  return (
    <div className="w-full h-full flex flex-col rounded-2xl border border-gray-200/60 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold truncate">{title}</div>
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Tabs */}
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

        {/* Summary */}
        {summary && (
          <div className="mt-3 text-xs text-gray-500">
            <span className="font-medium text-gray-700">{summary.name}</span> •
            Total:{" "}
            <span className="font-semibold text-gray-900">{summary.total}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 p-4 space-y-4 w-full">
        {chart && (
         <div className="flex-1 p-4 flex flex-col">
            <HorizontalBarChart
              title={chart.title}
              labels={chart.data.labels}
              values={chart.data.values}
              maxHeight={500}
            />
          </div>
        )}

        {!chart && (
          <div className="text-sm text-gray-400">No data available</div>
        )}
      </div>
    </div>
  );
}
