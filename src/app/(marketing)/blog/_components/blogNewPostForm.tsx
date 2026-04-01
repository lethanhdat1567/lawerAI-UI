"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { BlogThumbnailUploadField } from "@/app/(marketing)/blog/_components/blogThumbnailUploadField";
import { RichTextEditor } from "@/components/rich-text-editor/richTextEditor";
import { ApiError } from "@/lib/api/errors";
import { isHtmlContentEffectivelyEmpty } from "@/lib/editor/plain-excerpt";
import { blogMeCreatePost } from "@/lib/blog/blogApi";
import { blogPublicTags } from "@/lib/blog/blogTagApi";
import type { BlogPostStatusUI, BlogTag } from "@/lib/blog/types";

export function BlogNewPostForm() {
  const router = useRouter();
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<BlogPostStatusUI>("DRAFT");
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(new Set());
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

  function toggleTag(id: string) {
    setSelectedTagIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || isHtmlContentEffectivelyEmpty(body)) {
      toast.error("Vui lòng nhập tiêu đề và nội dung.");
      return;
    }
    setSubmitting(true);
    try {
      const { post } = await blogMeCreatePost({
        title: title.trim(),
        body,
        excerpt: excerpt.trim() ? excerpt.trim() : null,
        thumbnailUrl: thumbnailUrl.trim() ? thumbnailUrl.trim() : null,
        status,
        tagIds: selectedTagIds.size ? [...selectedTagIds] : undefined,
      });
      toast.success(
        status === "PUBLISHED"
          ? "Đã xuất bản bài blog."
          : "Đã lưu bản nháp.",
      );
      if (post.status === "PUBLISHED") {
        router.push(`/blog/${post.slug}`);
      } else {
        router.push("/my/blog");
      }
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Không tạo được bài.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="space-y-8 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-md sm:p-8"
    >
      <div>
        <label htmlFor="blog-new-title" className="text-sm font-semibold text-foreground">
          Tiêu đề
        </label>
        <input
          id="blog-new-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2 h-11 w-full rounded-xl border border-border bg-background/50 px-3 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Tiêu đề bài viết"
        />
      </div>

      <div>
        <label htmlFor="blog-new-excerpt" className="text-sm font-semibold text-foreground">
          Tóm tắt (tuỳ chọn)
        </label>
        <textarea
          id="blog-new-excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className="mt-2 w-full resize-y rounded-xl border border-border bg-background/50 px-3 py-2 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Để trống sẽ tự tạo từ nội dung"
        />
      </div>

      <BlogThumbnailUploadField
        id="blog-new-thumb"
        value={thumbnailUrl}
        onChange={setThumbnailUrl}
        disabled={submitting}
      />

      <div>
        <label htmlFor="blog-new-status" className="text-sm font-semibold text-foreground">
          Trạng thái
        </label>
        <select
          id="blog-new-status"
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
        <p id="blog-new-body-label" className="text-sm font-semibold text-foreground">
          Nội dung
        </p>
        <div className="mt-2">
          <RichTextEditor
            value={body}
            onChange={setBody}
            placeholder="Soạn nội dung bài blog…"
            aria-labelledby="blog-new-body-label"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {submitting ? "Đang lưu…" : "Lưu bài"}
        </button>
      </div>
    </form>
  );
}
