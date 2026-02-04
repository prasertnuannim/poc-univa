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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type HorizontalBarChartProps = {
  labels: string[];
  values: number[];
  title?: string;
  height?: number; // px
};

export default function HorizontalBarChart({
  labels,
  values,
  title,
  height = 260,
}: HorizontalBarChartProps) {
  const data = React.useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: title ?? "Breakdown",
          data: values,
          borderWidth: 1,
          borderRadius: 8,
          barThickness: 14,
        },
      ],
    }),
    [labels, values, title],
  );

  const options = React.useMemo<ChartOptions<"bar">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y", // ✅ ทำให้เป็น Horizontal Bar
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { display: true },
          border: { display: false },
          ticks: { precision: 0 },
        },
        y: {
          grid: { display: false },
          border: { display: false },
        },
      },
    }),
    [],
  );

  return (
    <div className="w-full">
      {title ? <div className="mb-2 text-sm font-medium">{title}</div> : null}
      <div style={{ height }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
