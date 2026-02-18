"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ExamsPerUnitBarProps = {
  data: { unit: string; value: number }[];
};

export default function ExamsPerUnitBar({ data }: ExamsPerUnitBarProps) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <h3 className="mb-4 font-semibold">Exams volume per unit</h3>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <XAxis dataKey="unit" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
