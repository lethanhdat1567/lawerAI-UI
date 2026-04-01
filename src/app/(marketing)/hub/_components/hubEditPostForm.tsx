// src/app/(marketing)/hub/_components/hubEditPostForm.tsx
"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { RichContentPreview } from "@/components/rich-text-editor/richContentPreview";
import { RichTextEditor } from "@/components/rich-text-editor/richTextEditor";
import { ApiError } from "@/lib/api/errors";
import { isHtmlContentEffectivelyEmpty } from "@/lib/editor/plain-excerpt";
import { hubPublicCategories } from "@/lib/hub/hubCategoryApi";
import {
  hubMePatchPost,
  hubMePostById,
} from "@/lib/hub/hubApi";
import type { HubCategoryUI, HubPostStatusUI } from "@/lib/hub/types";

export function HubEditPostForm() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const router = useRouter();
  const [categories, setCategories] = useState<HubCategoryUI[]>([]);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<HubPostStatusUI>("PUBLISHED");
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
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
        const { post } = await hubMePostById(id);
        if (cancelled) return;
        setTitle(post.title);
        setBody(post.body);
        setCategoryId(post.category?.id ?? "");
        setStatus(post.status);
      } catch (e) {
        if (cancelled) return;
        setLoadFailed(true);
        const msg =
          e instanceof ApiError ? e.message : "Không tải được bài để sửa.";
        toast.error(msg);
        if (e instanceof ApiError && e.status === 404) {
          router.replace("/my/hub");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!id) return;
    if (!title.trim() || isHtmlContentEffectivelyEmpty(body)) {
      toast.error("Vui lòng nhập tiêu đề và nội dung.");
      return;
    }
    setSubmitting(true);
    try {
      const { post } = await hubMePatchPost(id, {
        title: title.trim(),
        body,
        categoryId: categoryId.trim() ? categoryId.trim() : null,
        status,
      });
      toast.success("Đã cập nhật bài Hub.");
      router.push(`/hub/${post.slug}`);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "Cập nhật thất bại. Thử lại.";
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
          Không tải được bài để sửa. Thử lại hoặc quay về danh sách.
        </p>
        <Link
          href="/my/hub"
          className="mt-4 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Về quản lý bài Hub
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
        <label htmlFor="edit-title" className="text-sm font-semibold text-foreground">
          Tiêu đề
        </label>
        <input
          id="edit-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2 h-11 w-full rounded-xl border border-border bg-background/50 px-3 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Tóm tắt ngắn tình huống pháp lý…"
        />
      </div>

      <div>
        <label htmlFor="edit-cat" className="text-sm font-semibold text-foreground">
          Danh mục
        </label>
        <select
          id="edit-cat"
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
        <label htmlFor="edit-status" className="text-sm font-semibold text-foreground">
          Trạng thái
        </label>
        <select
          id="edit-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as HubPostStatusUI)}
          className="mt-2 h-11 w-full rounded-xl border border-border bg-background/50 px-3 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="PUBLISHED">Đã đăng</option>
          <option value="HIDDEN">Đã ẩn</option>
        </select>
      </div>

      <div>
        <p id="edit-body-label" className="text-sm font-semibold text-foreground">
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
            aria-labelledby="edit-body-label"
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
          {submitting ? "Đang lưu…" : "Lưu thay đổi"}
        </button>
      </div>
    </form>
  );
}
