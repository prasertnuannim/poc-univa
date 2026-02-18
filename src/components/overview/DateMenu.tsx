"use client";

import { useState, useRef, useEffect } from "react";

type DateItem = {
  date: string;
  score: number;
};

type Props = {
  items: DateItem[];
  selected: string;
  onSelect: (date: string) => void;
};

function formatDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function scoreColor(score: number) {
  if (score >= 90) return "text-green-600";
  if (score >= 70) return "text-orange-500";
  return "text-red-500";
}

export default function DateMenu({ items, selected, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm hover:bg-gray-50 min-w-[140px]">
        {formatDate(selected)}
      </button>

      {/* Menu */}
      {open && (
        <div
          className="
            absolute mt-2 w-35 max-h-80 overflow-y-auto
            rounded-xl border border-gray-200 bg-white shadow-lg
            z-50
          "
        >
          {items.map((item) => (
            <button
              key={item.date}
              onClick={() => {
                onSelect(item.date);
                setOpen(false);
              }}
              className="
                flex w-full items-center justify-between
                px-4 py-2 text-sm
                hover:bg-gray-100
              "
            >
              <span>{formatDate(item.date)}</span>
              <span
                className={`font-semibold ${scoreColor(item.score)}`}
              ></span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
