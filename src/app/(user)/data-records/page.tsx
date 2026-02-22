"use client";
import FilterPanel from "@/components/data-records/filterPanel";
import Pagination from "@/components/data-records/PaginationBar";
import * as React from "react";
import type { DataRecordRow } from "@/types/data-records.type";
import { getDataRecordsAction } from "./action";

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

function exportToCsv(rows: DataRecordRow[], columns: readonly Column[]) {
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

  const [rows, setRows] = React.useState<DataRecordRow[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [serverTotal, setServerTotal] = React.useState(0);


  // รีเซ็ตหน้าทุกครั้งที่ filter เปลี่ยน (กันหลุดหน้า)
  React.useEffect(() => {
    setPage(1);
  }, [filter]);

  React.useEffect(() => {
    let active = true;

    setIsLoading(true);
    setLoadError(null);

    getDataRecordsAction({
      page,
      pageSize: PAGE_SIZE,
      q: filter.q,
    })
      .then((res) => {
        if (!active) return;
        setRows(res.data);
        setServerTotal(res.total);
      })
      .catch(() => {
        if (!active) return;
        setLoadError("Failed to load data records.");
      })
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, filter.q]);


  const visibleCols = allColumns.filter((c) => selectedCols.includes(c.key));

  // (ตัวอย่าง) filter rows แบบง่าย ๆ
  const filteredRows = React.useMemo(() => {
    const q = filter.q.trim().toLowerCase();

    return rows.filter((r) => {
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
  }, [filter, rows]);

  const totalRows = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));
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
        onDateClick={() => { }}
        onFilterClick={() => { }}
        onCustomizeClick={() => { }}
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
              {isLoading && (
                <tr>
                  <td
                    colSpan={visibleCols.length}
                    className="px-3 py-10 text-center text-sm text-gray-500"
                  >
                    Loading data...
                  </td>
                </tr>
              )}
              {!isLoading && loadError && (
                <tr>
                  <td
                    colSpan={visibleCols.length}
                    className="px-3 py-10 text-center text-sm text-red-500"
                  >
                    {loadError}
                  </td>
                </tr>
              )}
              {!isLoading &&
                !loadError &&
                pagedRows.map((r) => (
                  <tr key={r.id} className="text-sm text-gray-800 hover:bg-gray-50">
                    {visibleCols.map((c) => (
                      <td key={c.key} className="border-b border-gray-100 px-3 py-2">
                        {String(r[c.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              {!isLoading && !loadError && pagedRows.length === 0 && (
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
          total={serverTotal}
          onPageChange={setPage}
        />

      </div>
    </div>
  );
}
