"use client";

export default function CustomizeColumnButton({
  onClick,
}: {
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border px-3 py-2 text-sm"
    >
      Customize Columns
    </button>
  );
}
