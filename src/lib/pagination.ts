// src/lib/pagination.ts — shared list slicing + page math

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export function clampPage(page: number, totalPages: number): number {
  if (totalPages < 1) return 1;
  return Math.min(Math.max(1, Math.floor(page) || 1), totalPages);
}

export function paginateList<T>(
  all: T[],
  page: number,
  pageSize: number
): PaginatedResult<T> {
  const totalItems = all.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / Math.max(1, pageSize)));
  const safePage = clampPage(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const items = all.slice(start, start + pageSize);
  return {
    items,
    page: safePage,
    pageSize,
    totalItems,
    totalPages,
  };
}

export type PageItem = number | "ellipsis";

/**
 * Compact page list with ellipses for large totals (e.g. [1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]).
 */
export function getVisiblePageNumbers(
  currentPage: number,
  totalPages: number,
  maxNumericButtons = 7
): PageItem[] {
  if (totalPages <= maxNumericButtons) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const boundary = new Set<number>([
    1,
    totalPages,
    currentPage,
    currentPage - 1,
    currentPage + 1,
  ]);

  for (const x of [...boundary]) {
    if (x < 1 || x > totalPages) boundary.delete(x);
  }

  const sorted = [...boundary].sort((a, b) => a - b);
  const out: PageItem[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const n = sorted[i]!;
    if (i > 0 && n - sorted[i - 1]! > 1) {
      out.push("ellipsis");
    }
    out.push(n);
  }

  return out;
}
