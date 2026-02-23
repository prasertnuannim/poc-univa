type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

type PageToken = number | "ellipsis";

function buildPageTokens(page: number, totalPages: number): PageToken[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, totalPages, page - 1, page, page + 1]);

  if (page <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }

  if (page >= totalPages - 2) {
    pages.add(totalPages - 1);
    pages.add(totalPages - 2);
    pages.add(totalPages - 3);
  }

  const sortedPages = [...pages]
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b);

  const tokens: PageToken[] = [];
  for (let i = 0; i < sortedPages.length; i += 1) {
    const current = sortedPages[i];
    const previous = sortedPages[i - 1];

    if (i > 0 && current - previous > 1) {
      tokens.push("ellipsis");
    }
    tokens.push(current);
  }
  return tokens;
}

export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = total === 0 ? 0 : Math.min(safePage * pageSize, total);
  const tokens = buildPageTokens(safePage, totalPages);

  return (
    <div className="flex min-w-0 items-center justify-end gap-2 text-sm text-gray-600">
      <div className="whitespace-nowrap pr-2 text-gray-400">
        {start} – {end} of {total}
      </div>
      <div className="flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => onPageChange(Math.max(1, safePage - 1))}
          disabled={safePage === 1 || total === 0}
          className="rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-40"
        >
          &lt;
        </button>

        {tokens.map((token, index) => {
          if (token === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-1 text-xs text-gray-400"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={token}
              onClick={() => onPageChange(token)}
              className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs ${
                safePage === token
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {token}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
          disabled={safePage === totalPages || total === 0}
          className="rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-40"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
