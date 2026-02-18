"use client";

import * as React from "react";
import { format, startOfWeek, endOfWeek, startOfMonth, startOfYear } from "date-fns";
import { CalendarIcon, ChevronDown, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type DateFilter =
  | { mode: "day"; date: Date }
  | { mode: "week"; date: Date }
  | { mode: "month"; date: Date }
  | { mode: "year"; date: Date }
  | { mode: "all" }
  | { mode: "custom"; start: Date; end: Date };

function labelForFilter(f: DateFilter) {
  const fmt = (d: Date) => format(d, "MMM d, yyyy");

  switch (f.mode) {
    case "day":
      return `TODAY : ${fmt(f.date)}`;
    case "week": {
      const s = startOfWeek(f.date, { weekStartsOn: 1 });
      const e = endOfWeek(f.date, { weekStartsOn: 1 });
      return `WEEK : ${fmt(s)} – ${fmt(e)}`;
    }
    case "month":
      return `MONTH : ${format(startOfMonth(f.date), "MMM yyyy")}`;
    case "year":
      return `YEAR : ${format(startOfYear(f.date), "yyyy")}`;
    case "all":
      return "ALL : All time";
    case "custom":
      return `RANGE : ${fmt(f.start)} – ${fmt(f.end)}`;
  }
}

export function DashboardToolbar({
  value,
  onChange,
  onExport,
  exporting = false,
}: {
  value: DateFilter;
  onChange: (next: DateFilter) => void;
  onExport?: () => void;
  exporting?: boolean;
}) {
  const text = React.useMemo(() => labelForFilter(value), [value]);

  return (
    <div className="rounded-xl border border-gray-200/60 bg-white/70 backdrop-blur shadow-sm">
      <div className="flex items-center justify-between gap-3 px-3 py-2">
        {/* Left: Select */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="
                flex min-w-0 flex-1 items-center gap-2
                rounded-lg border border-gray-200/60 bg-white
                px-3 py-2 text-sm text-gray-700 shadow-xs
                hover:bg-gray-50
              "
            >
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              <span className="truncate font-medium">{text}</span>
              <ChevronDown className="ml-auto h-4 w-4 text-gray-500" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-[320px]">
            <DropdownMenuItem onClick={() => onChange({ mode: "day", date: new Date() })}>
              Today
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onChange({ mode: "week", date: new Date() })}>
              This week
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onChange({ mode: "month", date: new Date() })}>
              This month
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onChange({ mode: "year", date: new Date() })}>
              This year
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onChange({ mode: "all" })}>
              All time
            </DropdownMenuItem>

            {/* ถ้าคุณมี date-range picker อยู่แล้ว ค่อยผูก custom ตรงนี้ */}
            <DropdownMenuItem
              onClick={() =>
                onChange({
                  mode: "custom",
                  start: new Date(),
                  end: new Date(),
                })
              }
            >
              Custom range…
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Right: Export */}
        <Button
          className="min-w-[140px]"
          onClick={onExport}
          disabled={!onExport || exporting}
        >
          <Download className="mr-2 h-4 w-4" />
          {exporting ? "Exporting..." : "Export"}
        </Button>
      </div>
    </div>
  );
}
