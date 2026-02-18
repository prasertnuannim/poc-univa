"use client";

import { Check } from "lucide-react";

export type ColumnOption = {
  key: string;
  label: string;
  visible: boolean;
};

type FilterCustomizeProps = {
  columns: ColumnOption[];
  onChange: (cols: ColumnOption[]) => void;
  onClear?: () => void;
};

export default function FilterCustomize({
  columns,
  onChange,
  onClear,
}: FilterCustomizeProps) {
  function toggle(key: string) {
    onChange(
      columns.map((c) =>
        c.key === key ? { ...c, visible: !c.visible } : c
      )
    );
  }

  return (
    <div className="w-[220px] rounded-xl border bg-white p-3 shadow-sm">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs font-medium text-muted-foreground">
          Column
        </div>
        <button
          onClick={onClear}
          className="text-xs text-muted-foreground hover:underline"
        >
          Clear
        </button>
      </div>

      {/* List */}
      <div className="space-y-1">
        {columns.map((col) => (
          <button
            key={col.key}
            onClick={() => toggle(col.key)}
            className="
              flex w-full items-center gap-2 rounded-md px-2 py-1.5
              text-sm hover:bg-gray-100
            "
          >
            <span
              className={`
                flex h-4 w-4 items-center justify-center rounded
                border
                ${col.visible ? "bg-emerald-500 border-emerald-500" : ""}
              `}
            >
              {col.visible && (
                <Check className="h-3 w-3 text-white" />
              )}
            </span>

            <span className="flex-1 text-left">
              {col.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
