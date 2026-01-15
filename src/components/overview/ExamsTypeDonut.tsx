"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#facc15", "#ef4444"];

type ExamsTypeDonutProps = {
  data: { name: string; value: number }[];
};

export default function ExamsTypeDonut({ data }: ExamsTypeDonutProps) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <h3 className="mb-4 font-semibold">Exams Type</h3>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} innerRadius={70} outerRadius={100} dataKey="value">
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
