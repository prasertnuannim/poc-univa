"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  ChartDataLabels,
);

type ExamsVolumeLineProps = {
  data: { label: string; value: number }[];
};

const THAI_TIME_OFFSET_HOURS = 7;
const HOUR_LABEL_REGEX = /^(\d{2}):00$/;

function toThaiHourLabel(label: string) {
  const match = HOUR_LABEL_REGEX.exec(label);
  if (!match) return label;

  const hour = Number(match[1]);
  if (Number.isNaN(hour) || hour < 0 || hour > 23) return label;

  const thaiHour = (hour + THAI_TIME_OFFSET_HOURS) % 24;
  return `${String(thaiHour).padStart(2, "0")}:00`;
}

export default function ExamsVolumeLine({ data }: ExamsVolumeLineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []);
  const chartData = {
    labels: data.map((d) => toThaiHourLabel(d.label)),
    datasets: [
      {
        data: data.map((d) => d.value),
        borderColor: "#4F7BFF",
        backgroundColor: "#4F7BFF",
        borderWidth: 2,
        tension: 0.35,

        pointRadius: (ctx: any) => {
          const values = ctx.dataset.data as number[];
          const max = Math.max(...values);
          return ctx.raw === max ? 8 : 4; // 👈 ขยายเฉพาะจุดสูงสุด
        },

        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#4F7BFF",
        pointBorderWidth: 3,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,

    layout: {
      padding: 0, // 👈 ไม่มีช่องว่างภายใน canvas
    },

    plugins: {
      datalabels: {
        color: "#4F7BFF",
        anchor: "end",
        align: "top",
        font: {
          weight: "bold",
          size: 13,
        },
        formatter: (value: number, context: any) => {
          const data = context.chart.data.datasets[0].data as number[];
          const max = Math.max(...data);
          return value === max ? value : "";
        },
      },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#fff",
        bodyColor: "#fff",
        displayColors: false, 
        callbacks: {
        title: (items) => {
          return `Time: ${items[0].label}`;
        },
        label: (context) => {
          return `Total: ${context.parsed.y} Exams`;
        },
      },
      },
    },

    scales: {
      x: {
        grid: { color: "#f1f5f9" },
        border: { display: false },
        ticks: {
          autoSkip: false,
          color: "#64748b",
        },
      },
      y: {
        beginAtZero: true,
        max: 100, // 👈 fix max
        ticks: {
          stepSize: 20, // 👈 0,20,40,60,80,100
          color: "#64748b",
        },
      },
    },
  };

  return (
    <div className="rounded-xl bg-white p-5 border shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">Exams volume</h3>
      <div ref={scrollRef} className="overflow-x-auto scrollbar-hide">
        <div className="min-w-[1200px] h-[280px]">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
}
