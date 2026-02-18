"use client";

import { DataRecord } from "@/types/data-records.type";

export default function DataTable({ rows }: { rows: DataRecord[] }) {
  return (
    <table className="w-full border text-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="border px-2 py-1">Time</th>
          <th className="border px-2 py-1">Device</th>
          <th className="border px-2 py-1">Probe</th>
          <th className="border px-2 py-1">Unit</th>
          <th className="border px-2 py-1">Exam type</th>
          <th className="border px-2 py-1">Operator</th>
          <th className="border px-2 py-1">Physician</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>
            <td className="border px-2 py-1">{r.time}</td>
            <td className="border px-2 py-1">{r.device}</td>
            <td className="border px-2 py-1">{r.probe}</td>
            <td className="border px-2 py-1">{r.unit}</td>
            <td className="border px-2 py-1">{r.examType}</td>
            <td className="border px-2 py-1">{r.operator}</td>
            <td className="border px-2 py-1">{r.physician}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
