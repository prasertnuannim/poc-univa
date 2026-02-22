"use client";

import { useMemo, useState } from "react";
import { MoreVertical } from "lucide-react";
import FilterPanel from "@/components/device-maintenance/filterPanel";
import Pagination from "@/components/device-maintenance/PaginationBar";

/* =====================
   TYPES
===================== */

type MaintenanceStatus =
  | "reported"
  | "in_progress"
  | "completed"
  | "cancelled";

type MaintenanceRow = {
  id: number;
  device: string;
  title: string;
  details: string;
  updatedAt: string;
  status: MaintenanceStatus;
};

/* =====================
   MOCK DATA
===================== */

const ROWS: MaintenanceRow[] = [
  {
    id: 1,
    device: "US-1",
    title: "Routine System Check",
    details:
      "Performed full system diagnostics, cleaned air vents, recalibrated image settings, and tested power supply stability.",
    updatedAt: "2024-08-18 18:25",
    status: "reported",
  },
  {
    id: 2,
    device: "US-2",
    title: "Probe Connection Repair",
    details:
      "Fixed intermittent probe connection issue, cleaned connector pins, and verified signal quality across all scan modes.",
    updatedAt: "2024-08-18 18:25",
    status: "reported",
  },
  {
    id: 3,
    device: "US-3",
    title: "Cooling System Maintenance",
    details: "Cooling System Maintenance",
    updatedAt: "2024-08-18 18:25",
    status: "cancelled",
  },
  {
    id: 4,
    device: "US-4",
    title: "Preventive Maintenance – Quarterly",
    details: "Probe Imaging Quality Test",
    updatedAt: "2024-08-18 18:25",
    status: "completed",
  },
  {
    id: 5,
    device: "US-5",
    title: "Probe Imaging Quality Test",
    details: "Preventive Maintenance – Quarterly",
    updatedAt: "2024-08-18 18:25",
    status: "in_progress",
  },
];

const PAGE_SIZE = 5;

/* =====================
   STATUS BADGE
===================== */

function StatusBadge({ status }: { status: MaintenanceStatus }) {
  const map = {
    reported: "bg-purple-100 text-purple-700 border-purple-300",
    in_progress: "bg-blue-100 text-blue-700 border-blue-300",
    completed: "bg-emerald-100 text-emerald-700 border-emerald-300",
    cancelled: "bg-red-100 text-red-700 border-red-300",
  };

  const label = {
    reported: "Reported",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${map[status]}`}
    >
      ● {label[status]}
    </span>
  );
}

/* =====================
   TABLE
===================== */

function MaintenanceTable({ rows }: { rows: MaintenanceRow[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-400">
          <tr>
            <th className="px-4 py-3 text-left w-12">No</th>
            <th className="px-4 py-3 text-left">Device name</th>
            <th className="px-4 py-3 text-left">Title</th>
            <th className="px-4 py-3 text-left">Details</th>
            <th className="px-4 py-3 text-left">Updated</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-right w-12">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.id}
              className="border-t hover:bg-gray-50"
            >
              <td className="px-4 py-3 text-gray-500">
                {index + 1}
              </td>

              <td className="px-4 py-3 max-w-[100px] truncate">
                <span className="rounded-full border px-3 py-1 text-xs">
                  {row.device}
                </span>
              </td>

              <td className="px-4 py-3 font-medium">
                {row.title}
              </td>

              <td className="px-4 py-3 text-gray-600 ">
                {row.details}
              </td>

              <td className="px-4 py-3 text-gray-500">
                {row.updatedAt}
              </td>

              <td className="px-4 py-3">
                <StatusBadge status={row.status} />
              </td>

              <td className="px-4 py-3 text-right">
                <button className="rounded-md p-2 hover:bg-gray-100">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* =====================
   PAGE
===================== */

export default function DeviceMaintenancePage() {
  const [filter, setFilter] = useState({ q: "" });
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    const q = filter.q.toLowerCase();

    return ROWS.filter(
      (r) =>
        r.device.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.details.toLowerCase().includes(q)
    );
  }, [filter.q]);

  const total = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pagedRows = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, safePage]);

  const visibleCols = [
    "device",
    "title",
    "details",
    "updatedAt",
    "status",
  ];

  function exportToCsv(rows: MaintenanceRow[], cols: string[]) {
    console.log("EXPORT CSV", rows, cols);
  }

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-xl font-semibold">
        Machine maintenance
      </h1>

      {/* ✅ ใช้ FilterPanel ของคุณตรง ๆ */}
      <FilterPanel
        search={filter.q}
        onSearchChange={(q) => {
          setFilter((prev) => ({ ...prev, q }));
          setPage(1);
        }}
        onFilterClick={() => {}}
        onCustomizeClick={() => {}}
        onExportClick={() =>
          exportToCsv(filteredRows, visibleCols)
        }
      />

      <MaintenanceTable rows={pagedRows} />
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
