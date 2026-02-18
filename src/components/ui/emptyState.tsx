type EmptyStateProps = {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  fullScreen?: boolean;
};

export default function EmptyState({
  title = "No data available",
  description = "Try changing the date or filter",
  icon = "",
  fullScreen = false,
}: EmptyStateProps) {
  return (
    <div
      className={
        fullScreen
          ? "flex min-h-[calc(100vh-4rem)] items-center justify-center"
          : ""
      }
    >
      <div className="rounded-xl border w-sm border-gray-200/60 bg-white/70 p-6 text-center backdrop-blur">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-lg">
          {icon}
        </div>

        <div className="text-sm font-medium text-gray-700">
          {title}
        </div>

        {description && (
          <div className="mt-1 text-xs text-gray-400">
            {description}
          </div>
        )}
      </div>
    </div>
  );
}
