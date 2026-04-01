// src/app/(marketing)/hub/_components/hubNewPostForm.tsx
"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { RichContentPreview } from "@/components/rich-text-editor/richContentPreview";
import { RichTextEditor } from "@/components/rich-text-editor/richTextEditor";
import { ApiError } from "@/lib/api/errors";
import { isHtmlContentEffectivelyEmpty } from "@/lib/editor/plain-excerpt";
import { hubMeCreatePost } from "@/lib/hub/hubApi";
import { hubPublicCategories } from "@/lib/hub/hubCategoryApi";
import type { HubCategoryUI } from "@/lib/hub/types";

export function HubNewPostForm() {
  const router = useRouter();
  const [categories, setCategories] = useState<HubCategoryUI[]>([]);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const { categories: c } = await hubPublicCategories();
        if (!cancelled) setCategories(c);
      } catch {
        /* public list — silent */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || isHtmlContentEffectivelyEmpty(body)) {
      toast.error("Vui lòng nhập tiêu đề và nội dung.");
      return;
    }
    setSubmitting(true);
    try {
      const { post } = await hubMeCreatePost({
        title: title.trim(),
        body,
        categoryId: categoryId.trim() ? categoryId.trim() : null,
      });
      toast.success("Đã đăng bài Hub.");
      router.push(`/hub/${post.slug}`);
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Đăng bài thất bại. Thử lại.";
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
        <label htmlFor="new-title" className="text-sm font-semibold text-foreground">
          Tiêu đề
        </label>
        <input
          id="new-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2 h-11 w-full rounded-xl border border-border bg-background/50 px-3 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Tóm tắt ngắn tình huống pháp lý…"
        />
      </div>

      <div>
        <label htmlFor="new-cat" className="text-sm font-semibold text-foreground">
          Danh mục
        </label>
        <select
          id="new-cat"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="mt-2 h-11 w-full rounded-xl border border-border bg-background/50 px-3 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">Không chọn danh mục</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p id="new-body-label" className="text-sm font-semibold text-foreground">
          Nội dung
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Định dạng đầy đủ: tiêu đề, danh sách, liên kết, hình ảnh, v.v.
        </p>
        <div className="mt-2">
          <RichTextEditor
            value={body}
            onChange={setBody}
            placeholder="Mô tả chi tiết, câu hỏi, và ngữ cảnh giúp cộng đồng trả lời…"
            aria-labelledby="new-body-label"
          />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Xem trước bài viết
        </p>
        <RichContentPreview html={body} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {submitting ? "Đang đăng…" : "Đăng bài"}
        </button>
      </div>
    </form>
  );
}
