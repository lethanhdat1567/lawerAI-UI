// src/app/(marketing)/blog/_components/blogPostGrid.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryState } from "nuqs";
import { parseAsString } from "nuqs";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import {
  BlogPostCard,
  type BlogPostCardUserEngagement,
} from "@/app/(marketing)/blog/_components/blogPostCard";
import { Pagination } from "@/components/pagination/pagination";
import { ApiError } from "@/lib/api/errors";
import {
  blogMeEngagementBatch,
  blogPublicPosts,
} from "@/lib/blog/blogApi";
import {
  blogPageParser,
  blogSortParser,
  blogVerifiedParser,
} from "@/lib/blog/nuqs-parsers";
import type { BlogPostListItem } from "@/lib/blog/types";
import { useAuthStore } from "@/stores/auth-store";

const PAGE_SIZE = 6;

export function BlogPostGrid() {
  const [q] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ shallow: true, throttleMs: 300 }),
  );
  const [tag] = useQueryState(
    "tag",
    parseAsString.withOptions({ shallow: true, history: "replace" }),
  );
  const [sort] = useQueryState(
    "sort",
    blogSortParser.withOptions({ shallow: true }),
  );
  const [verifiedOnly] = useQueryState(
    "verified",
    blogVerifiedParser.withOptions({ shallow: true, history: "replace" }),
  );

  const [page, setPage] = useQueryState(
    "page",
    blogPageParser.withOptions({ shallow: true, history: "replace" }),
  );

  const [items, setItems] = useState<BlogPostListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [engagementByPostId, setEngagementByPostId] = useState<
    Record<string, BlogPostCardUserEngagement>
  >({});

  const hydrated = useAuthStore((s) => s.hydrated);
  const signedIn = useAuthStore((s) => Boolean(s.user ?? s.accessToken));

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

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { items: rows, total: t } = await blogPublicPosts({
        q: q ?? "",
        tagSlug: tag ?? null,
        sort: sort ?? "new",
        verifiedOnly: verifiedOnly ?? false,
        page: page ?? 1,
        pageSize: PAGE_SIZE,
      });
      setItems(rows);
      setTotal(t);
    } catch (e) {
      const msg =
        e instanceof ApiError ? e.message : "Không tải được danh sách blog.";
      toast.error(msg);
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [q, tag, sort, verifiedOnly, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const itemsIdsKey = items.map((p) => p.id).join(",");

  useEffect(() => {
    if (!hydrated || !signedIn || itemsIdsKey === "") {
      setEngagementByPostId({});
      return;
    }
    const ids = itemsIdsKey.split(",").filter(Boolean);
    let cancelled = false;
    void (async () => {
      try {
        const { items: rows } = await blogMeEngagementBatch(ids);
        if (cancelled) return;
        const next: Record<string, BlogPostCardUserEngagement> = {};
        for (const r of rows) {
          next[r.postId] = { liked: r.liked, saved: r.saved };
        }
        setEngagementByPostId(next);
      } catch {
        if (!cancelled) setEngagementByPostId({});
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hydrated, signedIn, itemsIdsKey]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const effectivePage = page ?? 1;

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (effectivePage > maxPage) void setPage(maxPage);
  }, [total, effectivePage, setPage]);

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-muted-foreground">
        <Loader2Icon className="size-8 animate-spin" aria-hidden />
      </div>
    );
  }

  if (items.length === 0) {
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
          <BlogPostCard
            key={post.id}
            post={post}
            userEngagement={
              signedIn ? (engagementByPostId[post.id] ?? null) : null
            }
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
        <p className="order-2 text-center text-xs text-muted-foreground sm:order-1 sm:text-left">
          {total > 0 ? (
            <>
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
                    {effectivePage}/{totalPages}
                  </span>
                </>
              ) : null}
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
