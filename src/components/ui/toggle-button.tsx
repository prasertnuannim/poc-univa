"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSidebar } from "@/context/sidebar-context";
import { TooltipButton } from "@/components/ui/tooltip-button";
import ChangePeriodFilter from "../overview/ChangePeriodFilter";

type ToggleLayoutProps = {
  sidebar: React.ReactNode;
  title?: string;
  children: React.ReactNode;
};

type Mode = "today" | "week" | "month" | "custom" | "year";

export default function ToggleButton({
  sidebar,
  title,
  children,
}: ToggleLayoutProps) {
  const { toggle, open } = useSidebar();
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();

  const rawMode = searchParams?.get("mode");
  const activeMode = ((rawMode === "day"
    ? "today"
    : rawMode === "range"
      ? "custom"
      : rawMode) ?? "today") as Mode;
  const rawDate = searchParams?.get("date");
  const rangeStart = searchParams?.get("start");
  const rangeEnd = searchParams?.get("end");
  const parsedDate = rawDate ? new Date(rawDate) : new Date();
  const parsedStart = rangeStart ? new Date(rangeStart) : null;
  const parsedEnd = rangeEnd ? new Date(rangeEnd) : null;

  const [isPending, setIsPending] = useState(false);

  const paramsKey = searchParams?.toString();
  const isOverviewPage =
    pathname === "/overview" || pathname.endsWith("/overview");

  useEffect(() => {
    if (!isOverviewPage) {
      const hide = setTimeout(() => {
        setIsPending(false);
      }, 0);
      return () => clearTimeout(hide);
    }

    const show = setTimeout(() => {
      setIsPending(true);
    }, 0);

    const hide = setTimeout(() => {
      setIsPending(false);
    }, 150);

    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [paramsKey, isOverviewPage]);

  const filter =
    activeMode === "today"
      ? { mode: "today" as const }
      : activeMode === "custom"
        ? {
            mode: "custom" as const,
            start: parsedStart ?? new Date(),
            end: parsedEnd ?? new Date(),
          }
        : {
            mode: activeMode,
            date: Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate,
          };

  const pathTitle = pathname
    .split("/")
    .filter(Boolean)
    .pop()
    ?.replace(/-/g, " ");

  const computedTitle =
    title ??
    (pathTitle
      ? pathTitle.replace(/\b\w/g, (c) => c.toUpperCase())
      : "Homepage");

  const currentDate = new Date().toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const label =
    filter.mode === "today"
      ? currentDate
      : filter.mode === "week"
        ? "This week"
        : filter.mode === "month"
          ? "This month"
          : filter.mode === "year"
            ? "This year"
            : filter.mode === "custom" && parsedStart && parsedEnd
              ? `${parsedStart.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })} - ${parsedEnd.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}`
              : filter.date?.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
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
                className="rounded-md p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-500"
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
                  key={`${filter.mode}-${label}`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="
                    sticky top-14 z-10
                    mx-4 mt-3 pr-4
                    flex items-center justify-between
                    rounded-xl border border-gray-200/60
                    bg-white/70 backdrop-blur
                    px-3 py-2 text-sm
                    shadow-sm
                  "
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <span className="rounded-md bg-linear-to-r from-orange-400 to-red-500 px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase text-white">
                        {filter.mode}
                      </span>
                      <span className="font-medium text-gray-800">{label}</span>
                    </div>
                    <div className="h-4 w-px bg-gray-200" />
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

function OverviewFilterSkeleton() {
  const shimmer =
    "bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 bg-size-[400px_100%] animate-[shimmer_3s_ease-in-out_infinite]";

  return (
    <div
      className="
        sticky top-14 z-10
        mx-4 mt-3 pr-4
        flex items-center justify-between
        rounded-xl border border-gray-200/60
        bg-white/70 backdrop-blur
        px-3 py-2 text-sm
        shadow-sm
      "
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`h-5 w-14 rounded ${shimmer}`} />
          <div className={`h-4 w-24 rounded ${shimmer}`} />
        </div>
        <div className="h-4 w-px bg-gray-200" />
      </div>
      <div className={`h-8 w-28 rounded-md ${shimmer}`} />
    </div>
  );
}

export function ToggleButtonSkeleton({
  sidebar,
}: {
  sidebar?: React.ReactNode;
}) {
  const shimmer =
    "bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 bg-size-[400px_100%] animate-[shimmer_3s_ease-in-out_infinite]";

  return (
    <div className="flex h-dvh">
      {sidebar ?? <div className="w-64 bg-white" />}

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex justify-between">
          <header className="flex h-14 items-center justify-between bg-white px-4">
            <div className="flex items-center gap-3">
              <div className={`h-8 w-8 rounded-md ${shimmer}`} />
              <div className={`h-4 w-28 rounded ${shimmer}`} />
            </div>
          </header>
          <div
            className="
              sticky top-14 z-10
              mx-4 mt-3 pr-4
              flex items-center justify-between
              rounded-xl border border-gray-200/60
              bg-white/70 backdrop-blur
              px-3 py-2 text-sm
              shadow-sm
            "
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`h-5 w-16 rounded ${shimmer}`} />
                <div className={`h-4 w-28 rounded ${shimmer}`} />
              </div>
              <div className="h-4 w-px bg-gray-200" />
            </div>
            <div className={`h-8 w-28 rounded-md ${shimmer}`} />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto px-4 py-3">
          <div className="space-y-4">
            <div className={`h-32 w-full rounded-xl ${shimmer}`} />
            <div className={`h-64 w-full rounded-xl ${shimmer}`} />
            <div className={`h-40 w-full rounded-xl ${shimmer}`} />
          </div>
        </main>
      </div>
    </div>
  );
}
