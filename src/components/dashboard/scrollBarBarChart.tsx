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

export type ScrollBarBarChartProps = {
  title: string;
  labels: string[];
  values: number[];

  pxPerBar?: number; // ความกว้างต่อแท่ง (ยิ่งมาก ยิ่งต้องเลื่อน)
  height?: number; // ความสูงกราฟ
  minWidth?: number; // กันกราฟแคบเกิน

  yLabel?: string;
  showLegend?: boolean;

  onBarClick?: (payload: {
    index: number;
    label: string;
    value: number;
  }) => void;
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
    [safeLabels, safeValues, yLabel, pxPerBar],
  );

  const options: ChartOptions<"bar"> = React.useMemo(() => {
    const barCount = safeLabels.length;
    let rotation = 0;
    if (barCount > 18) rotation = 60;
    else if (barCount > 12) rotation = 45;
    else if (barCount > 8) rotation = 20;

    return {
      responsive: true,
      maintainAspectRatio: false,

      layout: {
        padding: {
          // Keep a little room for rotated x labels, but avoid pushing scrollbar too low.
          bottom: rotation >= 60 ? 16 : rotation > 0 ? 8 : 0,
        },
      },

      plugins: {
        legend: { display: showLegend },
        tooltip: {
          enabled: true,
          callbacks: {
            // 👇 Tooltip แสดง label เต็มเสมอ
            title: (items) => {
              const i = items[0]?.dataIndex;
              return safeLabels[i] ?? "";
            },
          },
        },
        datalabels: {
          color: "#fff",
          anchor: "center",
          offset: 4,
          font: {
            weight: 400,
            size: 10,
          },
          formatter: (value: number) => {
            return value; // ถ้าจะ format เพิ่มใส่ตรงนี้
          },
        },
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
          ticks: {
            autoSkip: false,
            minRotation: rotation,
            maxRotation: rotation,
            callback: function (_value, index) {
              const label = safeLabels[index];
              if (!label) return "";

              const maxLength = 14;

              // 🎯 ตัดจากด้านหน้า เก็บท้ายไว้ 14 ตัว
              return label.length > maxLength
                ? "…" + label.slice(-maxLength)
                : label;
            },
          },
        },

        y: {
          beginAtZero: true,
          grid: { color: "rgba(0,0,0,0.06)" },
          ticks: { precision: 0 },
          title: { display: true, text: yLabel },
        },
      },
    };
  }, [showLegend, yLabel, onBarClick, safeLabels, safeValues]);

  // วัดความกว้างพื้นที่จริงของการ์ด
  const { ref, w: containerW } = useContainerWidth<HTMLDivElement>();

  // ✅ innerWidth = max(พื้นที่จริง, จำนวนแท่ง * pxPerBar, minWidth)
  const innerWidth = React.useMemo(() => {
    const contentW = n * pxPerBar;
    return Math.max(containerW || 0, contentW, minWidth);
  }, [containerW, n, pxPerBar, minWidth]);

  return (
    <div className="rounded-2xl border border-gray-200/60 bg-white shadow-sm p-2">
      <div className="px-4 pt-4 pb-2 font-semibold">{title}</div>
      <div ref={ref} className="w-full overflow-x-auto px-4 pb-1">
        <div style={{ width: innerWidth, height }}>
          <Bar data={data} options={options} style={{ display: "block" }} />
        </div>
      </div>
    </div>
  );
}
