"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
);

type ExamsVolumeLineProps = {
  data: { label: string; value: number }[];
};

export default function ExamsVolumeLine({ data }: ExamsVolumeLineProps) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.value),
        borderColor: "#4F7BFF", // ฟ้าแบบในภาพ
        backgroundColor: "#4F7BFF",
        borderWidth: 2,
        tension: 0.35,

        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#4F7BFF",
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 10,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: "#f1f5f9",
        },
        ticks: {
          color: "#64748b",
          font: { size: 12 },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#f1f5f9",
        },
        ticks: {
          stepSize: 20,
          color: "#64748b",
          precision: 0,
        },
        title: {
          display: true,
          text: "Time",
          color: "#64748b",
          font: {
            size: 12,
            weight: 500,
          },
          padding: {
            bottom: 8,
          },
        },
      },
    },
  };

  return (
    <div className="rounded-lg bg-white p-4 border">
      <h3 className="mb-3 text-sm font-semibold text-gray-700">Exams volume</h3>

      <div className="h-[260px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
