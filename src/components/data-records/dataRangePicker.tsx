"use client";

export default function DateRangePicker({
  start,
  end,
  onChange,
}: {
  start?: string;
  end?: string;
  onChange: (s?: string, e?: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        className="border rounded px-2 py-1"
        value={start ?? ""}
        onChange={(e) => onChange(e.target.value, end)}
      />
      <span>to</span>
      <input
        type="date"
        className="border rounded px-2 py-1"
        value={end ?? ""}
        onChange={(e) => onChange(start, e.target.value)}
      />
    </div>
  );
}
