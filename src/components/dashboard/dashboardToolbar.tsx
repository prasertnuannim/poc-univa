"use client";

import * as React from "react";
import {
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { CalendarIcon, ChevronDown, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toDateInputValue } from "@/lib/date";

export type DateFilter =
  | { mode: "day"; date: Date }
  | { mode: "week"; date: Date }
  | { mode: "month"; date: Date }
  | { mode: "year"; date: Date }
  | { mode: "all" }
  | { mode: "range"; from: Date; to: Date }
  | { mode: "custom"; start: Date; end: Date }; // backward compatible

function labelForFilter(f: DateFilter) {
  const fmt = (d: Date) => format(d, "MMM d, yyyy");

  switch (f.mode) {
    case "day":
      return `DAY : ${fmt(f.date)}`;
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
    case "range":
      return `RANGE : ${fmt(f.from)} – ${fmt(f.to)}`;
    case "custom":
      return `RANGE : ${fmt(f.start)} – ${fmt(f.end)}`;
  }
}

function parseDateInput(value: string) {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  if (Number.isNaN(date.getTime())) return null;
  if (
    date.getFullYear() !== y
    || date.getMonth() !== m - 1
    || date.getDate() !== d
  ) {
    return null;
  }
  return date;
}

function toMonthInputValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function parseMonthInput(value: string) {
  if (!/^\d{4}-\d{2}$/.test(value)) return null;
  const [y, m] = value.split("-").map(Number);
  if (!y || !m || m < 1 || m > 12) return null;
  return new Date(y, m - 1, 1);
}

type PastMode = "day" | "week" | "month" | "year";

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
  const [open, setOpen] = React.useState(false);
  const [pastMode, setPastMode] = React.useState<PastMode>("day");
  const [baseDate, setBaseDate] = React.useState(toDateInputValue(new Date()));
  const [monthValue, setMonthValue] = React.useState(toMonthInputValue(new Date()));
  const [yearValue, setYearValue] = React.useState(String(new Date().getFullYear()));
  const [rangeFrom, setRangeFrom] = React.useState(toDateInputValue(new Date()));
  const [rangeTo, setRangeTo] = React.useState(toDateInputValue(new Date()));

  React.useEffect(() => {
    if (value.mode === "day" || value.mode === "week") {
      setPastMode(value.mode);
      setBaseDate(toDateInputValue(value.date));
      return;
    }
    if (value.mode === "month") {
      setPastMode("month");
      setMonthValue(toMonthInputValue(value.date));
      return;
    }
    if (value.mode === "year") {
      setPastMode("year");
      setYearValue(String(value.date.getFullYear()));
      return;
    }
    if (value.mode === "range") {
      setRangeFrom(toDateInputValue(value.from));
      setRangeTo(toDateInputValue(value.to));
      return;
    }
    if (value.mode === "custom") {
      setRangeFrom(toDateInputValue(value.start));
      setRangeTo(toDateInputValue(value.end));
    }
  }, [value]);

  const text = React.useMemo(() => labelForFilter(value), [value]);
  const recentDayOptions = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Array.from({ length: 30 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - index);
      return {
        value: toDateInputValue(date),
        label: format(date, "MMM d, yyyy"),
      };
    });
  }, []);

  const selectedRecentDay = React.useMemo(() => {
    if (recentDayOptions.some((option) => option.value === baseDate)) {
      return baseDate;
    }
    return undefined;
  }, [baseDate, recentDayOptions]);

  const handleRecentDayChange = React.useCallback((nextValue: string) => {
    setPastMode("day");
    setBaseDate(nextValue);
    const parsed = parseDateInput(nextValue);
    if (!parsed) return;
    onChange({ mode: "day", date: parsed });
    setOpen(false);
  }, [onChange]);

  const applyPast = React.useCallback(() => {
    if (pastMode === "day" || pastMode === "week") {
      const parsed = parseDateInput(baseDate);
      if (!parsed) return;
      onChange({ mode: pastMode, date: parsed });
      setOpen(false);
      return;
    }
    if (pastMode === "month") {
      const parsed = parseMonthInput(monthValue);
      if (!parsed) return;
      onChange({ mode: "month", date: parsed });
      setOpen(false);
      return;
    }
    const year = Number(yearValue);
    if (Number.isNaN(year) || year < 1970 || year > 2100) return;
    onChange({ mode: "year", date: new Date(year, 0, 1) });
    setOpen(false);
  }, [baseDate, monthValue, onChange, pastMode, yearValue]);

  const applyRange = React.useCallback(() => {
    const from = parseDateInput(rangeFrom);
    const to = parseDateInput(rangeTo);
    if (!from || !to) return;
    if (from <= to) {
      onChange({ mode: "range", from, to });
    } else {
      onChange({ mode: "range", from: to, to: from });
    }
    setOpen(false);
  }, [onChange, rangeFrom, rangeTo]);

  return (
    <div className="rounded-xl border border-gray-200/60 bg-white/70 backdrop-blur shadow-sm">
      <div className="flex items-center justify-between gap-3 px-3 py-2">
        {/* Left: Select */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              className="
                flex min-w-0 w-[320px] flex-1 items-center gap-2
                rounded-lg border border-gray-200/60 bg-white
                px-3 py-2 text-sm text-gray-700 shadow-xs
                hover:bg-gray-50
              "
            >
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              <span className="truncate font-medium">{text}</span>
              <ChevronDown className="ml-auto h-4 w-4 text-gray-500" />
            </button>
          </PopoverTrigger>

          <PopoverContent align="start" className="w-[320px] p-3">
            <div className="space-y-3">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500">Filter by</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onChange({ mode: "day", date: new Date() });
                      setOpen(false);
                    }}
                  >
                    Today
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onChange({ mode: "week", date: new Date() });
                      setOpen(false);
                    }}
                  >
                    
                    
                    week
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onChange({ mode: "month", date: new Date() });
                      setOpen(false);
                    }}
                  >
                    Month
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onChange({ mode: "year", date: new Date() });
                      setOpen(false);
                    }}
                  >
                    Year
                  </Button>
                </div>
              </div>

              <div className="h-px bg-gray-200" />

              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500">
                  Select date (last 30 days)
                </p>
                <Select value={selectedRecentDay} onValueChange={handleRecentDayChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select date" />
                  </SelectTrigger>
                  <SelectContent>
                    {recentDayOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>
          </PopoverContent>
        </Popover>

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
