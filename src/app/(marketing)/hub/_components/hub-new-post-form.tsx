// src/app/(marketing)/hub/_components/hub-new-post-form.tsx
"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { RichContentPreview } from "@/components/rich-text-editor/rich-content-preview";
import { RichTextEditor } from "@/components/rich-text-editor/rich-text-editor";
import { isHtmlContentEffectivelyEmpty } from "@/lib/editor/plain-excerpt";
import { mockCategories } from "@/lib/hub/mock-data";

export function HubNewPostForm() {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<string>(
    mockCategories[0]?.id ?? "",
  );
  const [body, setBody] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || isHtmlContentEffectivelyEmpty(body)) {
      setMessage("Vui lòng nhập tiêu đề và nội dung.");
      return;
    }
    setMessage("Đã ghi nhận.");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-md sm:p-8"
    >
      <div>
        <label
          htmlFor="new-title"
          className="text-sm font-semibold text-foreground"
        >
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
        <label
          htmlFor="new-cat"
          className="text-sm font-semibold text-foreground"
        >
          Danh mục
        </label>
        <select
          id="new-cat"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="mt-2 h-11 w-full rounded-xl border border-border bg-background/50 px-3 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {mockCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p
          id="new-body-label"
          className="text-sm font-semibold text-foreground"
        >
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
          className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          Đăng bài
        </button>
      </div>

      {message ? (
        <p className="text-sm text-muted-foreground" role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
