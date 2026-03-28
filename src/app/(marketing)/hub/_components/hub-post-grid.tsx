// src/app/(marketing)/hub/_components/hub-post-grid.tsx
"use client";

import { useEffect, useMemo, useRef } from "react";
import { useQueryState } from "nuqs";
import { parseAsString } from "nuqs";

import { HubPostCard } from "@/app/(marketing)/hub/_components/hub-post-card";
import { Pagination } from "@/components/pagination/pagination";
import { hubPageParser, hubSortParser } from "@/lib/hub/nuqs-parsers";
import { paginateList } from "@/lib/pagination";
import { listHubPosts } from "@/lib/hub/queries";

const PAGE_SIZE = 6;

export function HubPostGrid() {
  const [q] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ shallow: true, throttleMs: 300 })
  );
  const [category] = useQueryState(
    "category",
    parseAsString.withOptions({ shallow: true, history: "replace" })
  );
  const [sort] = useQueryState("sort", hubSortParser.withOptions({ shallow: true }));

  const [page, setPage] = useQueryState(
    "page",
    hubPageParser.withOptions({ shallow: true, history: "replace" })
  );

  const filterKey = `${q ?? ""}|${category ?? ""}|${sort ?? "new"}`;
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

  const posts = useMemo(
    () =>
      listHubPosts({
        q: q ?? "",
        categorySlug: category,
        sort: sort ?? "new",
      }),
    [q, category, sort]
  );

  const { items, page: effectivePage, totalPages, totalItems } = useMemo(
    () => paginateList(posts, page ?? 1, PAGE_SIZE),
    [posts, page]
  );

  useEffect(() => {
    if (effectivePage !== (page ?? 1)) {
      void setPage(effectivePage);
    }
  }, [effectivePage, page, setPage]);

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/30 px-6 py-16 text-center backdrop-blur-sm">
        <p className="font-medium text-foreground">Không có bài phù hợp</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Thử bỏ bớt từ khóa hoặc chọn &ldquo;Tất cả&rdquo; danh mục.
        </p>
      </div>
    );
  }

  const from = (effectivePage - 1) * PAGE_SIZE + 1;
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
          <span className="font-medium text-foreground">{totalItems}</span> bài
          {totalPages > 1 ? (
            <>
              {" "}
              · Trang{" "}
              <span className="font-medium text-foreground">
                {effectivePage}/{totalPages}
              </span>
            </>
          ) : null}
        </p>
        <Pagination
          className="order-1 sm:order-2"
          page={effectivePage}
          totalPages={totalPages}
          onPageChange={(p) => void setPage(p)}
          ariaLabel="Phân trang danh sách Hub"
        />
      </div>
    </div>
  );
}
