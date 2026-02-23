"use client";
import FilterPanel from "@/components/data-records/filterPanel";
import Pagination from "@/components/data-records/paginationBar";
import * as React from "react";
import type { DataRecordRow } from "@/types/data-records.type";
import { getDataRecordsAction } from "./action";
import { todayInTimeZone } from "@/lib/date";

type FilterState = {
  q: string;
  date: string;
  datePreset: "today" | "last7" | "last30" | "custom";
  devices: string[];
  units: string[];
  examTypes: string[];
  operators: string[];
  physicians: string[];
};

const initial: FilterState = {
  q: "",
  date: todayInTimeZone(),
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

const LIMIT_OPTIONS = [10, 25, 50] as const;

function formatDateLabel(dateISO: string) {
  const parsed = new Date(`${dateISO}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "Invalid date";
  const label = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
  return label;
}

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
  const [limit, setLimit] = React.useState<number>(LIMIT_OPTIONS[0]);
  const [serverTotal, setServerTotal] = React.useState(0);

  React.useEffect(() => {
    setPage(1);
  }, [filter.q, filter.date, limit]);

  React.useEffect(() => {
    let active = true;
    setIsLoading(true);
    setLoadError(null);
    getDataRecordsAction({
      page,
      pageSize: limit,
      q: filter.q,
      date: filter.date,
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
  }, [page, filter.q, filter.date, limit]);

  const visibleCols = allColumns.filter((c) => selectedCols.includes(c.key));
  const totalPages = Math.max(1, Math.ceil(serverTotal / limit));
  const rangeStart = serverTotal === 0 ? 0 : (page - 1) * limit + 1;
  const rangeEnd = serverTotal === 0 ? 0 : Math.min(page * limit, serverTotal);

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <div className="p-6">
      <FilterPanel
        search={filter.q}
        onSearchChange={(q) => setFilter((prev) => ({ ...prev, q }))}
        dateLabel={formatDateLabel(filter.date)}
        onDateChange={(dateISO) => setFilter((prev) => ({ ...prev, date: dateISO }))}
        onFilterClick={() => { }}
        onCustomizeClick={() => { }}
        onExportClick={() => exportToCsv(rows, visibleCols)}
      />
      <div className="mt-6 rounded-2xl border border-gray-200/60 bg-white p-4">
        <div className="mb-3 text-sm font-semibold text-gray-900">
          Preview Rows ({rangeStart}-{rangeEnd} of {serverTotal})
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
                rows.map((r) => (
                  <tr key={r.id} className="text-sm text-gray-800 hover:bg-gray-50">
                    {visibleCols.map((c) => (
                      <td key={c.key} className="border-b border-gray-100 px-3 py-2">
                        {String(r[c.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              {!isLoading && !loadError && rows.length === 0 && (
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
        <div className="flex items-center justify-end gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            Limit
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="h-8 rounded-md border border-gray-200 px-2 text-sm text-gray-700"
            >
              {LIMIT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <Pagination
            page={page}
            pageSize={limit}
            total={serverTotal}
            onPageChange={setPage}
          />
        </div>

      </div>
    </div>
  );
}
