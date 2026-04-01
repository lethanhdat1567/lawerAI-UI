"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { BlogThumbnailUploadField } from "@/app/(marketing)/blog/_components/blogThumbnailUploadField";
import { RichTextEditor } from "@/components/rich-text-editor/richTextEditor";
import { ApiError } from "@/lib/api/errors";
import { isHtmlContentEffectivelyEmpty } from "@/lib/editor/plain-excerpt";
import { blogMePatchPost, blogMePostById } from "@/lib/blog/blogApi";
import { blogPublicTags } from "@/lib/blog/blogTagApi";
import type { BlogPostStatusUI, BlogTag } from "@/lib/blog/types";

export function BlogEditPostForm() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const router = useRouter();
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<BlogPostStatusUI>("DRAFT");
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const { tags: t } = await blogPublicTags();
        if (!cancelled) setTags(t);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setLoadFailed(false);
    void (async () => {
      try {
        const { post } = await blogMePostById(id);
        if (cancelled) return;
        setTitle(post.title);
        setExcerpt(post.excerpt ?? "");
        setBody(post.body);
        setStatus(post.status);
        setSelectedTagIds(new Set(post.tags.map((t) => t.id)));
      } catch (e) {
        if (cancelled) return;
        setLoadFailed(true);
        const msg =
          e instanceof ApiError ? e.message : "Không tải được bài để sửa.";
        toast.error(msg);
        if (e instanceof ApiError && e.status === 404) {
          router.replace("/my/blog");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  function toggleTag(tagId: string) {
    setSelectedTagIds((prev) => {
      const next = new Set(prev);
      if (next.has(tagId)) next.delete(tagId);
      else next.add(tagId);
      return next;
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!id) return;
    if (!title.trim() || isHtmlContentEffectivelyEmpty(body)) {
      toast.error("Vui lòng nhập tiêu đề và nội dung.");
      return;
    }
    setSubmitting(true);
    try {
      const { post } = await blogMePatchPost(id, {
        title: title.trim(),
        body,
        excerpt: excerpt.trim() ? excerpt.trim() : null,
        thumbnailUrl: thumbnailUrl.trim() ? thumbnailUrl.trim() : null,
        status,
        tagIds: [...selectedTagIds],
      });
      toast.success("Đã cập nhật bài blog.");
      if (post.status === "PUBLISHED") {
        router.push(`/blog/${post.slug}`);
      } else {
        router.push("/my/blog");
      }
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Cập nhật thất bại.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (!id) {
    return (
      <p className="text-sm text-muted-foreground">Thiếu mã bài hợp lệ.</p>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card/40 py-24">
        <Loader2Icon className="size-8 animate-spin text-muted-foreground" aria-hidden />
        <p className="text-sm text-muted-foreground">Đang tải bài…</p>
      </div>
    );
  }

  if (loadFailed) {
    return (
      <div className="rounded-2xl border border-border bg-card/40 px-6 py-14 text-center backdrop-blur-md">
        <p className="text-sm text-muted-foreground">
          Không tải được bài để sửa.
        </p>
        <Link
          href="/my/blog"
          className="mt-4 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Về Blog của tôi
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="space-y-8 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-md sm:p-8"
    >
      <div>
        <label htmlFor="blog-edit-title" className="text-sm font-semibold text-foreground">
          Tiêu đề
        </label>
        <input
          id="blog-edit-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2 h-11 w-full rounded-xl border border-border bg-background/50 px-3 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div>
        <label htmlFor="blog-edit-excerpt" className="text-sm font-semibold text-foreground">
          Tóm tắt (tuỳ chọn)
        </label>
        <textarea
          id="blog-edit-excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className="mt-2 w-full resize-y rounded-xl border border-border bg-background/50 px-3 py-2 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <BlogThumbnailUploadField
        id="blog-edit-thumb"
        value={thumbnailUrl}
        onChange={setThumbnailUrl}
        disabled={submitting || loading}
      />

      <div>
        <label htmlFor="blog-edit-status" className="text-sm font-semibold text-foreground">
          Trạng thái
        </label>
        <select
          id="blog-edit-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as BlogPostStatusUI)}
          className="mt-2 h-11 w-full rounded-xl border border-border bg-background/50 px-3 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="DRAFT">Nháp</option>
          <option value="PUBLISHED">Xuất bản</option>
        </select>
      </div>

      {tags.length > 0 ? (
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-foreground">Thẻ</legend>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <label
                key={t.id}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background/40 px-3 py-1.5 text-xs font-medium has-[:checked]:border-primary/50 has-[:checked]:bg-primary/10"
              >
                <input
                  type="checkbox"
                  checked={selectedTagIds.has(t.id)}
                  onChange={() => toggleTag(t.id)}
                  className="rounded border-border"
                />
                {t.name}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <div>
        <p id="blog-edit-body-label" className="text-sm font-semibold text-foreground">
          Nội dung
        </p>
        <div className="mt-2">
          <RichTextEditor
            value={body}
            onChange={setBody}
            aria-labelledby="blog-edit-body-label"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {submitting ? "Đang lưu…" : "Lưu thay đổi"}
        </button>
      </div>
    </form>
  );
}
