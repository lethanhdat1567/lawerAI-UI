"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import {
  BlogPostCard,
  type BlogPostCardUserEngagement,
} from "@/app/(marketing)/blog/_components/blogPostCard";
import { Pagination } from "@/components/pagination/pagination";
import { ApiError } from "@/lib/api/errors";
import { blogMeEngagementBatch, blogMeSavedPosts } from "@/lib/blog/blogApi";
import type { BlogPostListItem } from "@/lib/blog/types";

const PAGE_SIZE = 6;

export function MySavedBlogGrid() {
  const [items, setItems] = useState<BlogPostListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [engagementByPostId, setEngagementByPostId] = useState<
    Record<string, Pick<BlogPostCardUserEngagement, "liked">>
  >({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { items: rows, total: t } = await blogMeSavedPosts({
        page,
        pageSize: PAGE_SIZE,
      });
      setItems(rows);
      setTotal(t);
    } catch (e) {
      const msg =
        e instanceof ApiError ? e.message : "Không tải được bài đã lưu.";
      toast.error(msg);
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void load();
  }, [load]);

  const itemsIdsKey = items.map((p) => p.id).join(",");

  useEffect(() => {
    if (items.length === 0) {
      setEngagementByPostId({});
      return;
    }
    const ids = items.map((p) => p.id);
    let cancelled = false;
    void (async () => {
      try {
        const { items: rows } = await blogMeEngagementBatch(ids);
        if (cancelled) return;
        const next: Record<string, Pick<BlogPostCardUserEngagement, "liked">> =
          {};
        for (const r of rows) {
          next[r.postId] = { liked: r.liked };
        }
        setEngagementByPostId(next);
      } catch {
        if (!cancelled) setEngagementByPostId({});
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [itemsIdsKey]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (page > maxPage) setPage(maxPage);
  }, [total, page]);

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-muted-foreground">
        <Loader2Icon className="size-8 animate-spin" aria-hidden />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/30 px-6 py-14 text-center backdrop-blur-sm">
        <p className="font-medium text-foreground">Chưa có bài đã lưu</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Trên trang chi tiết bài viết, chọn Lưu để xem lại tại đây.
        </p>
      </div>
    );
  }

  const from = (page - 1) * PAGE_SIZE + 1;
  const to = from + items.length - 1;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {items.map((post) => (
          <BlogPostCard
            key={post.id}
            post={post}
            userEngagement={{
              liked: engagementByPostId[post.id]?.liked ?? false,
              saved: true,
            }}
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
                    {page}/{totalPages}
                  </span>
                </>
              ) : null}
            </>
          ) : null}
        </p>
        <Pagination
          className="order-1 sm:order-2"
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          ariaLabel="Phân trang bài blog đã lưu"
        />
      </div>
    </div>
  );
}
