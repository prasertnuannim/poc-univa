"use client";

import * as React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartDataLabels,
);

type HorizontalBarChartProps = {
  labels: string[];
  values: number[];
  title?: string;
  maxHeight?: number;
};

export default function HorizontalBarChart({
  labels,
  values,
  title,
  maxHeight,
}: HorizontalBarChartProps) {
  const rowHeight = 47;
  const maxRows = 10;

  const calculatedHeight = labels.length * rowHeight;
  const defaultMaxHeight = maxRows * rowHeight;
  const containerHeight = Math.min(
    calculatedHeight,
    maxHeight ?? defaultMaxHeight,
  );

  const data = React.useMemo(() => {
    const max = Math.max(...values, 1);

    return {
      labels,
      datasets: [
        {
          data: values,
          borderRadius: 6,
          barThickness: rowHeight - 12,
          backgroundColor: values.map((v) => {
            const ratio = v / max;
            if (ratio > 0.75) return "#0d9488";
            if (ratio > 0.45) return "#14b8a6";
            return "#99f6e4";
          }),
        },
      ],
    };
  }, [labels, values]);

  const options = React.useMemo<ChartOptions<"bar">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      animation: { duration: 250 },

      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
        datalabels: {
          anchor: "center",
          align: "right",
          clamp: true,
          color: "#111827",
          font: {
            weight: 500,
            size: 10,
          },
          formatter: (value: number) =>
            Number(value).toLocaleString(),
        },
      },

      scales: {
        x: {
           position: "top",
          beginAtZero: true,
          grid: { color: "rgba(0,0,0,0.06)" },
          border: { display: false },
          ticks: { precision: 0 },
        },
        y: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: "#374151" },
        },
      },
    }),
    [],
  );

  return (
    <div className="w-full h-full">
      {title && (
        <div className="mb-3 text-sm font-semibold text-gray-700">
          {title}
        </div>
      )}

      <div
        className="overflow-y-auto pr-2 scroll-smooth"
        style={{ height: containerHeight }}
      >
        <div style={{ height: calculatedHeight }}>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
}
