"use client";

import { exportCSV } from "@/server/utils/DataRecords";
import { DataRecord } from "@/types/data-records.type";


export default function ExportCSVButton({ rows }: { rows: DataRecord[] }) {
  function onExport() {
    const csv = exportCSV(rows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "data-records.csv";
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={onExport}
      className="ml-auto rounded bg-indigo-600 px-4 py-2 text-sm text-white"
    >
      Export CSV
    </button>
  );
}
