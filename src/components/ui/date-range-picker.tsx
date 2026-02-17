"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { toDateInputValue } from "@/lib/date";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export default function DateRangePicker() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  function applyRange() {
    if (!date?.from || !date?.to) return;

    const start = toDateInputValue(date.from);
    const end = toDateInputValue(date.to);

    router.push(`?mode=custom&start=${start}&end=${end}`, {
      scroll: false,
    });

    setOpen(false); // ✅ ปิดเฉพาะตอนกด Apply
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal>

      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[260px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from && date?.to ? (
            <>
              {format(date.from, "LLL dd, y")} –{" "}
              {format(date.to, "LLL dd, y")}
            </>
          ) : (
            <span>Select date range</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto p-3"
        align="start"
        onInteractOutside={(e) => e.preventDefault()}   // ⭐ ตัวเอก
        onOpenAutoFocus={(e) => e.preventDefault()}     // ⭐ กัน focus กระตุก
      >
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
        />

        {/* ACTIONS */}
        <div className="mt-3 flex items-center justify-end gap-2 border-t pt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            size="sm"
            disabled={!date?.from || !date?.to}
            onClick={applyRange}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
