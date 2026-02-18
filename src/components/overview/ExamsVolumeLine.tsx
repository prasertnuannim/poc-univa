"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  type ChartOptions,
  type ScriptableContext,
} from "chart.js";
import { useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import ChartDataLabels, {
  type Context as DataLabelsContext,
} from "chartjs-plugin-datalabels";

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
  mode: string;
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

function getThaiHour() {
  const hour = new Date().getHours();
  return (hour + THAI_TIME_OFFSET_HOURS) % 24;
}

export default function ExamsVolumeLine({ data, mode }: ExamsVolumeLineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;

    if (mode !== "today") {
      container.scrollLeft = 0;
      return;
    }

    const thaiHour = getThaiHour();

    const index = data.findIndex((d) => {
      const match = /^(\d{2}):00$/.exec(d.label);
      return match && Number(match[1]) === thaiHour;
    });

    if (index !== -1) {
      const pointWidth = container.scrollWidth / data.length;
      const target = pointWidth * index - container.clientWidth / 2;

      container.scrollTo({
        left: target,
        behavior: "smooth",
      });
    }
  }, [mode, data]);


  const chartData = {
    labels: data.map((d) => toThaiHourLabel(d.label)),
    datasets: [
      {
        data: data.map((d) => d.value),
        borderColor: "#4F7BFF",
        backgroundColor: "#4F7BFF",
        borderWidth: 2,
        tension: 0.35,

        pointRadius: (ctx: ScriptableContext<"line">) => {
          const values = ctx.dataset.data as number[];
          const max = Math.max(...values);
          return ctx.raw === max ? 5 : 2; // 👈 ขยายเฉพาะจุดสูงสุด
        },

        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#4F7BFF",
        pointBorderWidth: 2,
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
          size: 10,
        },
        formatter: (value: number, context: DataLabelsContext) => {
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
        <div className="min-w-[1200px] h-[230px]">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
}
