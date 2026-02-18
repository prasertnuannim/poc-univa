"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useTransition } from "react";
import { useSidebar } from "@/context/sidebar-context";
import { TooltipButton } from "@/components/ui/tooltip-button";
import ChangePeriodFilter from "../overview/ChangePeriodFilter";
import DateMenu from "../overview/DateMenu";

type Props = {
  sidebar: React.ReactNode;
  title?: string;
  children: React.ReactNode;
};

type DateMenuItem = {
  date: string;
  score: number;
};

/* ------------------ Date Utils ------------------ */

function todayISO() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function generatePastDates(days: number, baseDate: string) {
  const [y, m, d] = baseDate.split("-").map(Number);
  const base = new Date(y, m - 1, d);

  return Array.from({ length: days }, (_, i) => {
    const date = new Date(base);
    date.setDate(base.getDate() - i);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  });
}

function scoreFromDate(date: string) {
  return (
    date
      .replace(/-/g, "")
      .split("")
      .reduce((sum, value) => sum + Number(value), 0) % 101
  );
}

/* ------------------ Component ------------------ */

export default function ToggleLayout({ sidebar, title, children }: Props) {
  const { toggle, open } = useSidebar();
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentDate = todayISO();

  const pastDates = useMemo<DateMenuItem[]>(
    () =>
      generatePastDates(30, currentDate).map((date) => ({
        date,
        score: scoreFromDate(date),
      })),
    [currentDate]
  );

  const rawDate = searchParams?.get("date") ?? currentDate;
  const selectedDate = pastDates.some((item) => item.date === rawDate)
    ? rawDate
    : currentDate;

  const rawMode = searchParams?.get("mode") ?? "today";
  const activeMode =
    rawMode === "day" ? "today" : rawMode === "range" ? "custom" : rawMode;

  const isToday = selectedDate === currentDate;

  const handleChange = (value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams?.toString());
      params.set("mode", value === currentDate ? "today" : "day");
      params.set("date", value);
      params.delete("start");
      params.delete("end");
      router.push(`?${params.toString()}`);
    });
  };

  const handleResetToday = () => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams?.toString());
      params.set("mode", "today");
      params.set("date", currentDate);
      router.push(`?${params.toString()}`);
    });
  };

  const computedTitle =
    title ??
    pathname
      .split("/")
      .filter(Boolean)
      .pop()
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) ??
    "Homepage";

  const isOverviewPage =
    pathname === "/overview" || pathname.endsWith("/overview");

  return (
    <div className="flex h-dvh">
      {sidebar}

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex justify-between">
          <header className="flex h-14 items-center justify-between bg-white px-4">
            <div className="flex items-center gap-3">
              <TooltipButton
                label="Toggle sidebar"
                onClick={toggle}
                className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </TooltipButton>

              <h1 className="text-sm text-gray-400">{computedTitle}</h1>
            </div>
          </header>

          {isOverviewPage && (
            <AnimatePresence mode="wait">
              {isPending ? (
                <motion.div
                  key="overview-skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <OverviewFilterSkeleton />
                </motion.div>
              ) : (
                <motion.div
                  key={`${activeMode}-${selectedDate}`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="
                    sticky top-14 z-10
                    mx-4 mt-3
                    flex items-center justify-between
                    rounded-2xl border border-gray-200/70
                    bg-white/80 backdrop-blur
                    px-4 py-2 text-sm
                    shadow-md
                  "
                >
                  <div className="flex items-center gap-4">
                    {/* TODAY BUTTON */}
                    <button
                      onClick={handleResetToday}
                      className={`
                        rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition cursor-pointer
                        ${
                          isToday
                            ? "bg-linear-to-r from-orange-500 to-red-500 text-white shadow"
                            : "bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600"
                        }
                      `}
                    >
                      Today
                    </button>

                    {/* DATE SELECT */}
                    <DateMenu
                      items={pastDates}
                      selected={selectedDate}
                      onSelect={(date) => handleChange(date)}
                    />
                  </div>

                  <ChangePeriodFilter />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        <main className="flex-1 overflow-y-auto px-4 py-3">{children}</main>
      </div>
    </div>
  );
}

/* ------------------ Skeleton ------------------ */

function OverviewFilterSkeleton() {
  return (
    <div
      className="
        sticky top-14 z-10
        mx-4 mt-3
        flex items-center justify-between
        rounded-2xl border border-gray-200/70
        bg-white/80 backdrop-blur
        px-4 py-2
        shadow-md
      "
    >
      <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
      <div className="h-8 w-28 animate-pulse rounded bg-gray-200" />
    </div>
  );
}

type ToggleButtonSkeletonProps = {
  sidebar: React.ReactNode;
};

export function ToggleButtonSkeleton({
  sidebar,
}: ToggleButtonSkeletonProps) {
  return (
    <div className="flex h-dvh">
      {sidebar}

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center bg-white px-4">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        </header>

        <OverviewFilterSkeleton />

        <main className="flex-1 overflow-y-auto px-4 py-3">
          <div className="h-48 w-full animate-pulse rounded-xl bg-gray-100" />
        </main>
      </div>
    </div>
  );
}
