"use client";

import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type FilterRow = {
  column?: string;
  operator?: string;
  value?: string;
};

type FilterMenuProps = {
  filters: FilterRow[];
  onChange: (filters: FilterRow[]) => void;
  onClose?: () => void;
};

export default function FilterMenu({
  filters,
  onChange,
  onClose,
}: FilterMenuProps) {
  function updateRow(index: number, patch: Partial<FilterRow>) {
    const next = [...filters];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  function addRow() {
    onChange([...filters, {}]);
  }

  function removeRow(index: number) {
    onChange(filters.filter((_, i) => i !== index));
  }

  return (
    <div className="w-[420px] rounded-xl border bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-medium">Filter</div>
        <button onClick={onClose}>
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Filter rows */}
      <div className="space-y-2">
        {filters.map((row, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
            {/* Column */}
            <Select
              value={row.column}
              onValueChange={(v) =>
                updateRow(i, { column: v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Column" />
              </SelectTrigger>
              {/* <SelectContent>
                <SelectItem value="device">Device</SelectItem>
                <SelectItem value="unit">Unit</SelectItem>
                <SelectItem value="examType">Exam Type</SelectItem>
                <SelectItem value="operator">Operator</SelectItem>
                <SelectItem value="physician">Physician</SelectItem>
              </SelectContent> */}
            </Select>

            {/* Operator */}
            <Select
              value={row.operator}
              onValueChange={(v) =>
                updateRow(i, { operator: v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eq">Equals</SelectItem>
                <SelectItem value="neq">Not equal</SelectItem>
                <SelectItem value="contains">Contains</SelectItem>
                <SelectItem value="starts">Starts with</SelectItem>
              </SelectContent>
            </Select>

            {/* Value */}
            <Input
              placeholder="Value"
              value={row.value ?? ""}
              onChange={(e) =>
                updateRow(i, { value: e.target.value })
              }
            />

            {/* Remove */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeRow(i)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add filter */}
      <button
        onClick={addRow}
        className="mt-3 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <Plus className="h-4 w-4" />
        Add filter
      </button>
    </div>
  );
}
