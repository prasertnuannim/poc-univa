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

export type ScrollBarBarChartProps = {
  title: string;
  labels: string[];
  values: number[];

  pxPerBar?: number;   // ความกว้างต่อแท่ง (ยิ่งมาก ยิ่งต้องเลื่อน)
  height?: number;     // ความสูงกราฟ
  minWidth?: number;   // กันกราฟแคบเกิน

  yLabel?: string;
  showLegend?: boolean;

  onBarClick?: (payload: { index: number; label: string; value: number }) => void;
};

function useContainerWidth<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null);
  const [w, setW] = React.useState(0);

  React.useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    const ro = new ResizeObserver(([entry]) => {
      setW(Math.floor(entry.contentRect.width));
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, w };
}

export default function ScrollBarBarChart({
  title,
  labels,
  values,
  pxPerBar = 56,
  height = 260,
  minWidth = 720,
  yLabel = "Times",
  showLegend = false,
  onBarClick,
}: ScrollBarBarChartProps) {
  const n = Math.min(labels.length, values.length);
  const safeLabels = React.useMemo(() => labels.slice(0, n), [labels, n]);
  const safeValues = React.useMemo(() => values.slice(0, n), [values, n]);

  const data = React.useMemo(
    () => ({
      labels: safeLabels,
      datasets: [
        {
          label: yLabel,
          data: safeValues,
          borderRadius: 8,
          backgroundColor: "rgba(59,130,246,0.85)",
          hoverBackgroundColor: "rgba(59,130,246,1)",
          barThickness: Math.max(18, Math.floor(pxPerBar * 0.55)), // ให้แท่งสัมพันธ์กับ pxPerBar
        },
      ],
    }),
    [safeLabels, safeValues, yLabel, pxPerBar]
  );

  const options: ChartOptions<"bar"> = React.useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: showLegend },
        tooltip: { enabled: true },
      },
      onClick: (_event, elements) => {
        if (!onBarClick) return;
        const el = elements?.[0];
        if (!el) return;

        const i = el.index;
        onBarClick({
          index: i,
          label: safeLabels[i],
          value: safeValues[i],
        });
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { autoSkip: false, maxRotation: 0 },
        },
        y: {
          beginAtZero: true,
          grid: { color: "rgba(0,0,0,0.06)" },
          ticks: { precision: 0 },
          title: { display: true, text: yLabel },
        },
      },
    }),
    [showLegend, yLabel, onBarClick, safeLabels, safeValues]
  );

  // วัดความกว้างพื้นที่จริงของการ์ด
  const { ref, w: containerW } = useContainerWidth<HTMLDivElement>();

  // ✅ innerWidth = max(พื้นที่จริง, จำนวนแท่ง * pxPerBar, minWidth)
  const innerWidth = React.useMemo(() => {
    const contentW = n * pxPerBar;
    return Math.max(containerW || 0, contentW, minWidth);
  }, [containerW, n, pxPerBar, minWidth]);

  return (
    <div className="rounded-2xl border border-gray-200/60 bg-white shadow-sm">
      <div className="px-4 pt-4 pb-2 font-semibold">{title}</div>

      {/* ✅ Outer: fix ตามกล่อง + scrollbar */}
      <div ref={ref} className="w-full overflow-x-auto px-4 pb-4">
        {/* ✅ Inner: ความกว้างจริงของกราฟ (ทำให้ล้นแล้วเลื่อนได้) */}
        <div style={{ width: innerWidth }} className="h-[260px]">
          <Bar data={data} options={options} style={{ display: "block" }} />
        </div>
      </div>
    </div>
  );
}
