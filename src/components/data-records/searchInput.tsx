"use client";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search by device, unit, exam type, operator or physician...",
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 w-[320px] rounded-md border px-3 text-sm"
    />
  );
}
