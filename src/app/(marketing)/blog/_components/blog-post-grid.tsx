// src/app/(marketing)/blog/_components/blog-post-grid.tsx
"use client";

import { useEffect, useMemo, useRef } from "react";
import { useQueryState } from "nuqs";
import { parseAsString } from "nuqs";

import { BlogPostCard } from "@/app/(marketing)/blog/_components/blog-post-card";
import { Pagination } from "@/components/pagination/pagination";
import {
  blogPageParser,
  blogSortParser,
  blogVerifiedParser,
} from "@/lib/blog/nuqs-parsers";
import { paginateList } from "@/lib/pagination";
import { listBlogPosts } from "@/lib/blog/queries";

const PAGE_SIZE = 6;

export function BlogPostGrid() {
  const [q] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ shallow: true, throttleMs: 300 })
  );
  const [tag] = useQueryState(
    "tag",
    parseAsString.withOptions({ shallow: true, history: "replace" })
  );
  const [sort] = useQueryState("sort", blogSortParser.withOptions({ shallow: true }));
  const [verifiedOnly] = useQueryState(
    "verified",
    blogVerifiedParser.withOptions({ shallow: true, history: "replace" })
  );

  const [page, setPage] = useQueryState(
    "page",
    blogPageParser.withOptions({ shallow: true, history: "replace" })
  );

  const filterKey = `${q ?? ""}|${tag ?? ""}|${sort ?? "new"}|${verifiedOnly ? "1" : "0"}`;
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
      listBlogPosts({
        q: q ?? "",
        tagSlug: tag,
        sort: sort ?? "new",
        verifiedOnly: verifiedOnly ?? false,
      }),
    [q, tag, sort, verifiedOnly]
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
          Thử bỏ bộ lọc hoặc từ khóa tìm kiếm.
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
          <BlogPostCard key={post.id} post={post} />
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
          ariaLabel="Phân trang danh sách Blog"
        />
      </div>
    </div>
  );
}
