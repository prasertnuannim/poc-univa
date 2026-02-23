"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { useEffect, useMemo, useRef } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

type ExamsPerUnitBarProps = {
  data: { unit: string; value: number }[];
  mode: string;
};

export default function ExamsPerUnitBar({ data, mode }: ExamsPerUnitBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const labels = useMemo(() => data.map((d) => d.unit), [data]);
  const values = useMemo(() => data.map((d) => d.value), [data]);
  const hasData = values.length > 0 && values.some((v) => v > 0);
  const enableScroll = labels.length > 10;

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const afterPaint = (fn: () => void) => {
      requestAnimationFrame(() => requestAnimationFrame(fn));
    };

    // ถ้าไม่ต้อง scroll ก็ชิดซ้ายพอ
    if (!enableScroll) {
      afterPaint(() => container.scrollTo({ left: 0, behavior: "auto" }));
      return;
    }

    // ✅ ไม่ใช่ today: ชิดซ้าย
    if (mode !== "today") {
      afterPaint(() => container.scrollTo({ left: 0, behavior: "auto" }));
      return;
    }

    // ✅ today: เลื่อนไปแท่งที่ค่าสูงสุด (ปรับเป็น logic อื่นได้)
    afterPaint(() => {
      if (!labels.length) return;

      const max = Math.max(...values);
      const index = values.findIndex((v) => v === max);
      if (index === -1) return;

      const pointWidth = container.scrollWidth / Math.max(1, labels.length);
      let target = pointWidth * index - container.clientWidth / 2;
      target = Math.max(0, target);

      container.scrollTo({ left: target, behavior: "smooth" });
    });
  }, [mode, labels, values, enableScroll]);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: "#4F7BFF",
        borderRadius: 5,
        barPercentage: 0.7,
        categoryPercentage: 0.7,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#fff",
        bodyColor: "#fff",
        displayColors: false,
        callbacks: {
          title: (items) => `${items[0].label}`,
          label: (ctx) => `Total: ${ctx.parsed.y} times`,
        },
      },
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          autoSkip: false,
          color: "#64748b",
          font: { size: 11 },
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#f1f5f9" },
        border: { display: false },
        ticks: { color: "#64748b", font: { size: 11 } },
        title: {
          display: true,
          text: "times",
          color: "#9ca3af",
          font: { size: 11 },
        },
      },
    },
  };

  // ถ้ามากกว่า 10 ให้ขยายความกว้างตามจำนวนแท่งเพื่อให้เกิด scroll
  const minWidth = enableScroll ? Math.max(760, labels.length * 110) : "100%";

  return (
    <div className="rounded-xl bg-white p-5 border shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">
        Exams volume per unit
      </h3>

      {!hasData ? (
        <div className="flex h-[260px] items-center justify-center text-sm text-gray-400">
          No Data
        </div>
      ) : (
        <div
          ref={scrollRef}
          className={enableScroll ? "overflow-x-auto scrollbar-hide" : "overflow-x-hidden"}
        >
          <div className="h-[260px]" style={{ minWidth }}>
            <Bar data={chartData} options={options} />
          </div>
        </div>
      )}
    </div>
  );
}
