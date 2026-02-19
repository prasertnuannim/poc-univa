"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CalendarIcon, ChevronDown, ChevronUp } from "lucide-react";
import DateRangePicker from "@/components/ui/date-range-picker";

type Mode = "today" | "previous-day" | "week" | "month" | "year" | "custom";

export default function ChangePeriodFilter() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const rawMode = searchParams?.get("mode");
  const active: Mode =
    rawMode === "today" ||
    //rawMode === "previous-day" ||
    rawMode === "week" ||
    rawMode === "month" ||
    rawMode === "year" ||
    rawMode === "custom"
      ? rawMode
      : rawMode === "range"
      ? "custom"
      : "today";

  useEffect(() => {
    const mode = searchParams?.get("mode");
    if (mode !== "custom") return;
    // const start = searchParams?.get("start");
    // const end = searchParams?.get("end");
    // if (start || end) {
    //   console.log("range time", { start, end });
    // }
  }, [searchParams]);

  function push(params: URLSearchParams) {
    const q = params.toString();
    router.push(q ? `${pathname}?${q}` : pathname);
  }

  function select(mode: Mode) {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("mode", mode);
    params.delete("date");
    params.delete("start");
    params.delete("end");
    push(params);
    setOpen(false);
  }

  return (
    <div className="relative inline-flex pl-2" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-md px-4 py-1 text-gray-600 hover:bg-gray-100 cursor-pointer"
      >
        <CalendarIcon className="h-4 w-4" />
        <span>Change Period</span>
        {open ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 origin-top-right -mr-3">
          <DateFilterDropdown active={active} onSelect={select} />
        </div>
      )}
    </div>
  );
}

function DateFilterDropdown({
  active,
  onSelect,
}: {
  active: Mode;
  onSelect: (mode: Mode) => void;
}) {
  return (
    <div className="w-full rounded-lg border bg-white p-3 text-sm shadow-lg mt-2">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <span className="font-medium text-gray-800">Filter by Date</span>
        <button
          onClick={() => onSelect("today")}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          Clear
        </button>
      </div>

      {/* Presets */}
      <div className="mb-3 grid grid-cols-3 gap-2">
        {/* <Preset
          label="Today"
          active={active === "today"}
          onClick={() => onSelect("today")}
        /> */}
        <Preset
          label="Week"
          active={active === "week"}
          onClick={() => onSelect("week")}
        />
        <Preset
          label="Month"
          active={active === "month"}
          onClick={() => onSelect("month")}
        />
        <Preset
          label="Year"
          active={active === "year"}
          onClick={() => onSelect("year")}
        />
      </div>

      {/* Custom Range */}
      <div>
        <div className="mb-1 text-xs font-medium text-gray-500">
          Custom Range
        </div>
        <DateRangePicker />
      </div>
    </div>
  );
}

function Preset({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-sm transition
        ${
          active
            ? "bg-blue-500 text-white"
            : "border text-gray-600 hover:bg-gray-50"
        }`}
    >
      {label}
    </button>
  );
}
