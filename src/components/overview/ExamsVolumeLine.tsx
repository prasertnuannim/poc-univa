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
import { useEffect, useMemo, useRef } from "react";
import { Line } from "react-chartjs-2";
import ChartDataLabels, {
  type Context as DataLabelsContext,
} from "chartjs-plugin-datalabels";
import { getThaiHour, toThaiHourLabel } from "@/lib/utils";

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
  mode: string; // "today" | "custom" | "week" | ...
};

export default function ExamsVolumeLine({ data, mode }: ExamsVolumeLineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const chartLabels = useMemo(
    () => data.map((d) => toThaiHourLabel(d.label)),
    [data]
  );

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // helper: รอให้ DOM/Chart วาดเสร็จจริงก่อน (กัน scroll หลุด)
    const afterPaint = (fn: () => void) => {
      requestAnimationFrame(() => requestAnimationFrame(fn));
    };

    // ✅ ไม่ใช่ today: ชิดซ้ายกราฟ
    if (mode !== "today") {
      afterPaint(() => {
        container.scrollTo({ left: 0, behavior: "auto" });
      });
      return;
    }

    // ✅ today: เลื่อนไปชั่วโมงไทยปัจจุบัน
    afterPaint(() => {
      if (!chartLabels.length) return;

      const thaiHour = getThaiHour(); // ✅ คืน 0-23 "เวลาไทยจริง" (ห้าม +7 ซ้ำ)
      const targetLabel = `${String(thaiHour).padStart(2, "0")}:00`;

      const index = chartLabels.findIndex((label) => label === targetLabel);
      if (index === -1) return;

      const pointWidth = container.scrollWidth / Math.max(1, chartLabels.length);
      let target = pointWidth * index - container.clientWidth / 2;
      target = Math.max(0, target);

      container.scrollTo({ left: target, behavior: "smooth" });
    });
  }, [mode, data, chartLabels]);

  const chartData = {
    labels: chartLabels,
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
          return ctx.raw === max ? 5 : 2;
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
    layout: { padding: 0 },

    plugins: {
      datalabels: {
        color: "#4F7BFF",
        anchor: "end",
        align: "top",
        font: { weight: "bold", size: 10 },
        formatter: (value: number, context: DataLabelsContext) => {
          const ds = context.chart.data.datasets[0].data as number[];
          const max = Math.max(...ds);
          return value === max ? value : "";
        },
      },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#fff",
        bodyColor: "#fff",
        displayColors: false,
        callbacks: {
          title: (items) => `Time: ${items[0].label}`,
          label: (context) => `Total: ${context.parsed.y} Exams`,
        },
      },
    },

    scales: {
      x: {
        grid: { color: "#f1f5f9" },
        border: { display: false },
        ticks: { autoSkip: false, color: "#64748b" },
      },
      y: {
        beginAtZero: true,
        grace: "5%",
        ticks: { stepSize: 20, color: "#64748b" },
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
