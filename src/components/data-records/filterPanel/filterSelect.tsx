"use client";

import * as React from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type FilterSelectProps = {
  label?: string;
  onSelectPreset?: (preset: "today" | "week" | "month" | "all") => void;
  onApplyRange?: (from: string, to: string) => void;
};

export default function FilterSelect({
  label = "TODAY · Nov 25, 2025",
  onSelectPreset,
  onApplyRange,
}: FilterSelectProps) {
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 whitespace-nowrap"
        >
          <Calendar className="h-4 w-4" />
          {label}
          <ChevronDown className="h-4 w-4 opacity-60" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-[260px] p-3">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Filter by Date</span>
            <button className="hover:underline">Clear</button>
          </div>

          {/* Presets */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onSelectPreset?.("today")}
            >
              Today
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSelectPreset?.("week")}
            >
              This week
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSelectPreset?.("month")}
            >
              This month
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSelectPreset?.("all")}
            >
              All Dates
            </Button>
          </div>

          {/* Custom range */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              Custom Range
            </div>

            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="mm/dd/yyyy"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
              <Input
                type="text"
                placeholder="mm/dd/yyyy"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>

            <Button
              size="sm"
              className="w-full"
              onClick={() => onApplyRange?.(from, to)}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
