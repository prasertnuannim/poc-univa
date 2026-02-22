"use client";

import * as React from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toDateInputValue } from "@/lib/date";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type FilterSelectProps = {
  label?: string;
  className?: string;
  onApplyRange?: (from: string, to: string) => void;
};

function formatDisplayDate(dateISO: string) {
  const date = new Date(`${dateISO}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateISO;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function FilterSelect({
  label = "",
  className,
  onApplyRange,
}: FilterSelectProps) {
  const [open, setOpen] = React.useState(false);
  const today = React.useMemo(() => toDateInputValue(new Date()), []);
  const displayLabel = label || formatDisplayDate(today);

  const recentDayOptions = React.useMemo(() => {
    const base = new Date();
    base.setHours(0, 0, 0, 0);

    return Array.from({ length: 30 }, (_, index) => {
      const date = new Date(base);
      date.setDate(base.getDate() - index);
      return {
        value: toDateInputValue(date),
        label: new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }).format(date),
      };
    });
  }, []);

  const [selectedRecentDay, setSelectedRecentDay] = React.useState(
    recentDayOptions[0]?.value ?? today,
  );

  const handleClear = React.useCallback(() => {
    setSelectedRecentDay(today);
    onApplyRange?.(today, today);
    setOpen(false);
  }, [onApplyRange, today]);

  const handleRecentDayChange = React.useCallback((value: string) => {
    setSelectedRecentDay(value);
    onApplyRange?.(value, value);
    setOpen(false);
  }, [onApplyRange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("gap-2 whitespace-nowrap", className)}
        >
          <Calendar className="h-4 w-4" />
          {displayLabel}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] p-3"
      >
        <div className="space-y-3">
          <div className="flex justify-end text-xs text-muted-foreground">
            <button
              type="button"
              className="hover:underline"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>

          <div className="max-h-64 overflow-auto rounded-md border border-gray-200">
            {recentDayOptions.map((option) => {
              const isActive = option.value === selectedRecentDay;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleRecentDayChange(option.value)}
                  className={`w-full px-3 py-2 text-left text-sm ${
                    isActive ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
