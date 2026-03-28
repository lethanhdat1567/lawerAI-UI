// src/components/pagination/pagination.tsx — reusable UI (Tailwind, không phụ thuộc shadcn Button)
"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import type { PageItem } from "@/lib/pagination";
import { getVisiblePageNumbers } from "@/lib/pagination";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  /** Trang hiện tại (bắt đầu từ 1) */
  page: number;
  /** Tổng số trang (tối thiểu 1) */
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  /** Gắn id cho landmark a11y */
  id?: string;
  /** Nhãn khu vực (screen reader) */
  ariaLabel?: string;
}

const btnBase =
  "inline-flex size-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-40";

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
  id,
  ariaLabel = "Phân trang",
}: PaginationProps) {
  const safeTotal = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(1, page), safeTotal);

  if (safeTotal <= 1) {
    return null;
  }

  const items: PageItem[] = getVisiblePageNumbers(safePage, safeTotal);

  return (
    <nav
      id={id}
      aria-label={ariaLabel}
      className={cn(
        "flex flex-wrap items-center justify-center gap-1",
        className,
      )}
    >
      <button
        type="button"
        className={cn(
          btnBase,
          "border-border bg-card/50 text-foreground hover:border-primary/40",
        )}
        onClick={() => onPageChange(safePage - 1)}
        disabled={safePage <= 1}
        aria-label="Trang trước"
      >
        <ChevronLeftIcon className="size-4" aria-hidden />
      </button>

      {items.map((item, i) =>
        item === "ellipsis" ? (
          <span
            key={`e-${i}`}
            className="inline-flex size-9 items-center justify-center text-sm text-muted-foreground"
            aria-hidden
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={cn(
              btnBase,
              item === safePage
                ? "border-primary/50 bg-primary/15 text-primary"
                : "border-border bg-card/40 text-muted-foreground hover:border-border hover:text-foreground",
            )}
            onClick={() => onPageChange(item)}
            aria-label={`Trang ${item}`}
            aria-current={item === safePage ? "page" : undefined}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        className={cn(
          btnBase,
          "border-border bg-card/50 text-foreground hover:border-primary/40",
        )}
        onClick={() => onPageChange(safePage + 1)}
        disabled={safePage >= safeTotal}
        aria-label="Trang sau"
      >
        <ChevronRightIcon className="size-4" aria-hidden />
      </button>
    </nav>
  );
}
