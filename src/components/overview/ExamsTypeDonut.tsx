"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = [
  "#4F63FF", "#18E2B8", "#FFC43D", "#FF2D55",
  "#8B5CF6", "#22C55E", "#F97316", "#06B6D4",
  "#A3E635", "#FB7185", "#60A5FA", "#F59E0B",
  "#10B981", "#EF4444", "#6366F1", "#14B8A6",
];

type Row = { name: string; value: number };

type ExamsTypeDonutProps = {
  data: Row[];
  title?: string;
};

type PieLabelProps = {
  cx?: number;
  cy?: number;
  midAngle?: number;
  outerRadius?: number;
  value?: number | string;
};

export default function ExamsTypeDonut({
  data,
  title = "Exams Type",
}: ExamsTypeDonutProps) {
  const safeData = (data ?? []).map((d) => ({
    name: d.name,
    value: Number.isFinite(d.value) ? d.value : 0,
  }));

  const total = safeData.reduce((s, d) => s + d.value, 0);
  const percentText = (value: number) =>
    total ? `${Math.round((value / total) * 100)}%` : "0%";

  const renderLabel = (props: PieLabelProps) => {
    const { cx, cy, midAngle, outerRadius, value } = props;
    if (
      cx === undefined ||
      cy === undefined ||
      midAngle === undefined ||
      outerRadius === undefined
    ) {
      return null;
    }

    const numericValue = typeof value === "number" ? value : Number(value) || 0;

    const RAD = Math.PI / 180;
    const r = outerRadius + 24;
    const x = cx + r * Math.cos(-midAngle * RAD);
    const y = cy + r * Math.sin(-midAngle * RAD);
    const anchor = x > cx ? "start" : "end";

    return (
      <text x={x} y={y} textAnchor={anchor} dominantBaseline="middle">
        <tspan className="fill-gray-800 text-xs font-semibold">
          {numericValue}
        </tspan>
        <tspan x={x} dy={14} className="fill-gray-400 text-[11px]">
          {percentText(numericValue)}
        </tspan>
      </text>
    );
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-gray-800">{title}</h3>

      {/* แบ่งครึ่งซ้าย/ขวา */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left 50%: Donut */}
        <div className="min-w-0">
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={safeData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={78}
                  stroke="transparent"
                  labelLine={false}
                  label={renderLabel}
                  isAnimationActive={false}
                >
                  {safeData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 50%: Devices (2 columns) */}
        <div className="min-w-0">
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {safeData.map((d, i) => (
              <div key={d.name} className="flex min-w-0 items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="min-w-0 truncate text-xs text-gray-700">
                  {d.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
