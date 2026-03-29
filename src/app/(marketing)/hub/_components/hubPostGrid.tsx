// src/app/(marketing)/hub/_components/hubPostGrid.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryState } from "nuqs";
import { parseAsString } from "nuqs";

import { HubPostCard } from "@/app/(marketing)/hub/_components/hubPostCard";
import { Pagination } from "@/components/pagination/pagination";
import { ApiError } from "@/lib/api/errors";
import { hubPublicPosts } from "@/lib/hub/hubApi";
import { hubPageParser, hubSortParser } from "@/lib/hub/nuqs-parsers";
import type { HubPostListItem } from "@/lib/hub/types";

const PAGE_SIZE = 6;

export function HubPostGrid() {
  const [q] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ shallow: true, throttleMs: 300 }),
  );
  const [category] = useQueryState(
    "category",
    parseAsString.withOptions({ shallow: true, history: "replace" }),
  );
  const [sort] = useQueryState(
    "sort",
    hubSortParser.withOptions({ shallow: true }),
  );

  const [page, setPage] = useQueryState(
    "page",
    hubPageParser.withOptions({ shallow: true, history: "replace" }),
  );

  const [items, setItems] = useState<HubPostListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const effSort = sort ?? "new";
  const effPage = page ?? 1;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await hubPublicPosts({
        q: q ?? "",
        categorySlug: category,
        sort: effSort,
        page: effPage,
        pageSize: PAGE_SIZE,
      });
      setItems(res.items);
      setTotal(res.total);
    } catch (e) {
      const msg =
        e instanceof ApiError
          ? e.message
          : "Không tải được danh sách Hub. Kiểm tra API hoặc thử lại.";
      setError(msg);
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [q, category, effSort, effPage]);

  useEffect(() => {
    void load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const filterKey = `${q ?? ""}|${category ?? ""}|${effSort}`;
  const prevFilters = useRef<string | null>(null);
  useEffect(() => {
    if (prevFilters.current === null) {
      prevFilters.current = filterKey;
      return;
    }
    if (prevFilters.current !== filterKey) {
      prevFilters.current = filterKey;
      void setPage(1);
    }
  }, [filterKey, setPage]);

  useEffect(() => {
    if (effPage > totalPages && totalPages >= 1) {
      void setPage(totalPages);
    }
  }, [effPage, totalPages, setPage]);

  if (loading && items.length === 0) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-64 animate-pulse rounded-2xl border border-border/70 bg-muted/20"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center">
        <p className="font-medium text-destructive">{error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/30 px-6 py-16 text-center backdrop-blur-sm">
        <p className="font-medium text-foreground">Không có bài phù hợp</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Thử bỏ bớt từ khóa hoặc chọn &ldquo;Tất cả&rdquo; danh mục.
        </p>
      </div>
    );
  }

  const from = (effPage - 1) * PAGE_SIZE + 1;
  const to = from + items.length - 1;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {items.map((post) => (
          <HubPostCard key={post.id} post={post} />
        ))}
      </div>

      <div className="flex flex-col items-center gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
        <p className="order-2 text-center text-xs text-muted-foreground sm:order-1 sm:text-left">
          Hiển thị{" "}
          <span className="font-medium text-foreground">
            {from}–{to}
          </span>{" "}
          trong{" "}
          <span className="font-medium text-foreground">{total}</span> bài
          {totalPages > 1 ? (
            <>
              {" "}
              · Trang{" "}
              <span className="font-medium text-foreground">
                {effPage}/{totalPages}
              </span>
            </>
          ) : null}
        </p>
        <Pagination
          className="order-1 sm:order-2"
          page={effPage}
          totalPages={totalPages}
          onPageChange={(p) => void setPage(p)}
          ariaLabel="Phân trang danh sách Hub"
        />
      </div>
    </div>
  );
}
