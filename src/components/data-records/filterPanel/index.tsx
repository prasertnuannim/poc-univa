"use client";

import { Filter, SlidersHorizontal, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FilterSelect from "./filterSelect";
import FilterMenu, { FilterRow } from "./filterMenu";
import { useState } from "react";
import FilterCustomize, { ColumnOption } from "./filterCustomize";

type TableToolbarProps = {
  search?: string;
  onSearchChange?: (v: string) => void;

  dateLabel?: string;
  onDateClick?: () => void;

  onFilterClick?: () => void;
  onCustomizeClick?: () => void;
  onExportClick?: () => void;
};

export default function FilterPanel({
  search,
  onSearchChange,
  dateLabel = "TODAY · Nov 25, 2025",
  onDateClick,
  onFilterClick,
  onCustomizeClick,
  onExportClick,
}: TableToolbarProps) {
  const [filters, setFilters] = useState<FilterRow[]>([{}]);
  const [openFilter, setOpenFilter] = useState(false);
  const [openCustomize, setOpenCustomize] = useState(false);

  const [columns, setColumns] = useState<ColumnOption[]>([
  { key: "time", label: "Time", visible: true },
  { key: "device", label: "Devices", visible: true },
  { key: "probe", label: "Probes", visible: true },
  { key: "unit", label: "Units", visible: true },
  { key: "examType", label: "Exam types", visible: true },
  { key: "operator", label: "Operator", visible: true },
  { key: "physician", label: "Physicians", visible: true },
    { key: "patient", label: "Patients", visible: false },
  ]);

  return (
    <div
      className="
        flex flex-wrap items-center gap-3
        rounded-xl border border-gray-200/60
        bg-white/70 px-3 py-2
        backdrop-blur
      "
    >
      {/* Search */}
      <Input
        value={search}
        onChange={(e) => onSearchChange?.(e.target.value)}
        placeholder="Search by device, unit, exam type, operator or physician ..."
        className="h-9 w-[320px]"
      />

      {/* Date select */}
      <FilterSelect
        label={dateLabel}
        onSelectPreset={(p) => {
          onDateClick?.();
          console.log("preset:", p);
        }}
        onApplyRange={(from, to) => {
          onDateClick?.();
          console.log("range:", from, to);
        }}
      />

      {/* Filter */}
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onFilterClick?.();
            setOpenFilter((prev) => !prev);
          }}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filter
        </Button>

        {openFilter && (
          <div className="absolute left-0 top-full z-10 mt-2">
            <FilterMenu
              filters={filters}
              onChange={setFilters}
              onClose={() => setOpenFilter(false)}
            />
          </div>
        )}
      </div>

      {/* Customize */}
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onCustomizeClick?.();
            setOpenCustomize((prev) => !prev);
          }}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Customize Column
        </Button>

        {openCustomize && (
          <div className="absolute left-0 top-full z-10 mt-2">
            <FilterCustomize
              columns={columns}
              onChange={setColumns}
              onClear={() =>
                setColumns(columns.map((c) => ({ ...c, visible: false })))
              }
            />
          </div>
        )}
      </div>

      {/* Export */}
      <Button size="sm" onClick={onExportClick} className="gap-2">
        <Download className="h-4 w-4" />
        Export CSV
      </Button>
    </div>
  );
}
