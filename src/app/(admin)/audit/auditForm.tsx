"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTable, Column } from "@/components/form/dataTable";
import { getAuditLogsAction } from "./actions";
import { mapAuditLogToRow } from "@/server/mappers/audit.mapper";
import type { AuditLogRow } from "@/types/audit.type";

type AuditColumnKey = "actor" | "module" | "action" | "target";

export default function AditForm() {
  const [logs, setLogs] = useState<AuditLogRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLogRow | null>(null);

  const fetchLogs = useCallback(async (): Promise<AuditLogRow[]> => {
    const result = await getAuditLogsAction();
    return result.map(mapAuditLogToRow);
  }, []);

  const syncLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchLogs();
      setLogs(data);
    } finally {
      setIsLoading(false);
    }
  }, [fetchLogs]);

  useEffect(() => {
    syncLogs();
  }, [syncLogs]);

  const columns: Column<AuditLogRow, AuditColumnKey>[] = [
    {
      key: "actor",
      header: "Actor",
      sortable: true,
      className: "break-all max-w-[220px]",
    },
    {
      key: "module",
      header: "Module",
      sortable: true,
    },

    {
      key: "target",
      header: "Target",
      render: (row) =>
        row.targetId ? `${row.target} (${row.targetId})` : row.target,
      className: "break-all max-w-[260px]",
    },
    {
      key: "action",
      header: "Action",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              row.severity === "critical"
                ? "bg-red-100 text-red-700"
                : row.severity === "warning"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {row.action}
          </span>

          {(row.before || row.after) && (
            <button
              onClick={() => setSelectedLog(row)}
              className="text-xs text-blue-600 hover:underline"
            >
              View
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-5">
      <DataTable<AuditLogRow, AuditColumnKey>
        data={logs}
        columns={columns}
        initialPageSize={10}
        initialSort={{ key: "module", dir: "asc" }}
        searchPlaceholder="Search actor / module / action / target…"
        isLoading={isLoading}
      />

      {/* ===== MODAL BEFORE / AFTER ===== */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg w-[90%] max-w-4xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">
                Change Detail – {selectedLog.action}
              </h2>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* BEFORE */}
              <div>
                <h3 className="text-sm font-medium mb-1 text-gray-600">
                  Before
                </h3>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-[400px]">
                  {selectedLog.before
                    ? JSON.stringify(selectedLog.before, null, 2)
                    : "—"}
                </pre>
              </div>

              {/* AFTER */}
              <div>
                <h3 className="text-sm font-medium mb-1 text-gray-600">
                  After
                </h3>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-[400px]">
                  {selectedLog.after
                    ? JSON.stringify(selectedLog.after, null, 2)
                    : "—"}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
