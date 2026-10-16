"use client";

import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

function pageList(page, count) {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const pages = new Set([1, count, page, page - 1, page + 1]);
  if (page <= 3) [2, 3, 4].forEach((p) => pages.add(p));
  if (page >= count - 2) [count - 1, count - 2, count - 3].forEach((p) => pages.add(p));
  const sorted = [...pages].filter((p) => p >= 1 && p <= count).sort((a, b) => a - b);
  const out = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push(`gap-${p}`);
    out.push(p);
  });
  return out;
}

/** "Showing 11–20 of 42" + numbered pages. Renders nothing for a single page unless `showSummary`. */
export function AdminPagination({ page, pageSize, total, onPageChange, className, disabled = false }) {
  const count = Math.max(1, Math.ceil(total / pageSize));
  const from = total ? (page - 1) * pageSize + 1 : 0;
  const to = Math.min(total, page * pageSize);

  return (
    <div className={cn("flex flex-col items-center justify-between gap-3 sm:flex-row", className)}>
      <p className="text-xs text-muted-foreground">
        Showing <span className="font-medium text-foreground">{from}</span>–<span className="font-medium text-foreground">{to}</span>{" "}
        of <span className="font-medium text-foreground">{total.toLocaleString("en-US")}</span>
      </p>
      {count > 1 && (
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => onPageChange(page - 1)} disabled={disabled || page <= 1} />
            </PaginationItem>
            {pageList(page, count).map((p) =>
              typeof p === "string" ? (
                <PaginationItem key={p} className="hidden sm:block">
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={p} className={cn(p !== page && "hidden sm:block")}>
                  <PaginationButton
                    isActive={p === page}
                    onClick={() => onPageChange(p)}
                    disabled={disabled}
                    aria-label={`Page ${p}`}
                    className="tabular-nums"
                  >
                    {p}
                  </PaginationButton>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext onClick={() => onPageChange(page + 1)} disabled={disabled || page >= count} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
