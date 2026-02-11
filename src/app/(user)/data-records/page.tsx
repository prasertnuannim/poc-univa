"use client";
import FilterPanel from "@/components/data-records/filterPanel";
import Pagination from "@/components/data-records/paginationBar";
import { Filter } from "lucide-react";
import * as React from "react";

type FilterState = {
  q: string;
  datePreset: "today" | "last7" | "last30" | "custom";
  devices: string[];
  units: string[];
  examTypes: string[];
  operators: string[];
  physicians: string[];
};

const initial: FilterState = {
  q: "",
  datePreset: "today",
  devices: [],
  units: [],
  examTypes: [],
  operators: [],
  physicians: [],
};

type Row = {
  date: string;
  device: string;
  unit: string;
  examType: string;
  operator: string;
  physician: string;
  status: string;
  duration: number;
};

const mockRows: Row[] = Array.from({ length: 20 }, (_, i) => ({
  date: `2025-11-${String(10 + (i % 15)).padStart(2, "0")}`,
  device: `Device ${(i % 8) + 1}`,
  unit: ["Room A", "Room B", "Room C"][i % 3],
  examType: ["Abdomen", "Cardiac", "OB/GYN"][i % 3],
  operator: ["Somsak", "Nina", "Korn"][i % 3],
  physician: ["Dr. A", "Dr. B", "Dr. C"][i % 3],
  status: ["Done", "Pending", "Cancelled"][i % 3],
  duration: 10 + (i % 40),
}));

const allColumns = [
  { key: "date", label: "Date" },
  { key: "device", label: "Device" },
  { key: "unit", label: "Unit" },
  { key: "examType", label: "Exam Type" },
  { key: "operator", label: "Operator" },
  { key: "physician", label: "Physician" },
  { key: "status", label: "Status" },
  { key: "duration", label: "Duration" },
] as const;

type Column = (typeof allColumns)[number];
type ColumnKey = (typeof allColumns)[number]["key"];

const PAGE_SIZE = 10;

function exportToCsv(rows: Row[], columns: readonly Column[]) {
  const header = columns.map((c) => c.label).join(",");
  const lines = rows.map((r) =>
    columns
      .map((c) => {
        const value = String((r as Record<string, string | number>)[c.key] ?? "");
        return `"${value.replace(/"/g, '""')}"`;
      })
      .join(",")
  );
  const csv = [header, ...lines].join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "data-records.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function Page() {
  const [filter, setFilter] = React.useState<FilterState>(initial);
  const [selectedCols] = React.useState<ColumnKey[]>(
    allColumns.map((c) => c.key)
  );

  const [page, setPage] = React.useState(1);

  // รีเซ็ตหน้าทุกครั้งที่ filter เปลี่ยน (กันหลุดหน้า)
  React.useEffect(() => {
    setPage(1);
  }, [filter]);


  const visibleCols = allColumns.filter((c) => selectedCols.includes(c.key));

  // (ตัวอย่าง) filter mock rows แบบง่าย ๆ
  const filteredRows = React.useMemo(() => {
    const q = filter.q.trim().toLowerCase();

    return mockRows.filter((r) => {
      const matchQ =
        !q ||
        [r.device, r.unit, r.examType, r.operator, r.physician]
          .join(" ")
          .toLowerCase()
          .includes(q);

      const matchDevices =
        filter.devices.length === 0 || filter.devices.includes(r.device);
      const matchUnits =
        filter.units.length === 0 || filter.units.includes(r.unit);
      const matchTypes =
        filter.examTypes.length === 0 || filter.examTypes.includes(r.examType);
      const matchOperators =
        filter.operators.length === 0 || filter.operators.includes(r.operator);
      const matchPhysicians =
        filter.physicians.length === 0 || filter.physicians.includes(r.physician);

      // date preset: demo only (ไม่ทำ logic ลึก)
      const matchDate = true;

      return (
        matchQ &&
        matchDevices &&
        matchUnits &&
        matchTypes &&
        matchOperators &&
        matchPhysicians &&
        matchDate
      );
    });
  }, [filter]);

  const total = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pagedRows = React.useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, safePage]);


  return (
    <div className="p-6">
      <FilterPanel
        search={filter.q}
        onSearchChange={(q) => setFilter((prev) => ({ ...prev, q }))}
        dateLabel="TODAY · Nov 25, 2025"
        onDateClick={() => {}}
        onFilterClick={() => {}}
        onCustomizeClick={() => {}}
        onExportClick={() => exportToCsv(filteredRows, visibleCols)}
      />


      <div className="mt-6 rounded-2xl border border-gray-200/60 bg-white p-4">
        <div className="mb-3 text-sm font-semibold text-gray-900">
          Preview Rows ({filteredRows.length})
        </div>

        <div className="overflow-auto">
          <table className="min-w-[900px] w-full border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-xs text-gray-500">
                {visibleCols.map((c) => (
                  <th key={c.key} className="border-b border-gray-200/60 px-3 py-2">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((r, idx) => (
                <tr key={idx} className="text-sm text-gray-800 hover:bg-gray-50">
                  {visibleCols.map((c) => (
                    <td key={c.key} className="border-b border-gray-100 px-3 py-2">
                      {(r as any)[c.key]}
                    </td>
                  ))}
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td
                    colSpan={visibleCols.length}
                    className="px-3 py-10 text-center text-sm text-gray-500"
                  >
                    No data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      
      </div>
        <div className="mt-4">
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={setPage}
          />
        </div>
    </div>
  );
}
