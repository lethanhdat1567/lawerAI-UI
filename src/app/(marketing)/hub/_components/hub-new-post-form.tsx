// src/app/(marketing)/hub/_components/hub-new-post-form.tsx
"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";

import { mockCategories } from "@/lib/hub/mock-data";

export function HubNewPostForm() {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<string>(mockCategories[0]?.id ?? "");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const previewExcerpt = useMemo(() => {
    const t = body.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\n+/g, " ").trim();
    if (t.length <= 160) return t || "…";
    return `${t.slice(0, 160)}…`;
  }, [body]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setMessage("Vui lòng nhập tiêu đề và nội dung.");
      return;
    }
    setMessage(
      "Đã ghi nhận trên UI demo — API LawyerAI sẽ xử lý đăng bài sau."
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
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
          {mockCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="new-body" className="text-sm font-semibold text-foreground">
          Nội dung
        </label>
        <p className="mt-1 text-xs text-muted-foreground">
          Có thể dùng **in đậm** với cặp dấu sao kép như Markdown đơn giản.
        </p>
        <textarea
          id="new-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={12}
          className="mt-2 w-full resize-y rounded-xl border border-border bg-background/50 px-3 py-2 font-mono text-sm leading-relaxed focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Mô tả chi tiết, câu hỏi, và bất kỳ ngữ cảnh nào giúp cộng đồng trả lời…"
        />
      </div>

      <div className="rounded-xl border border-border bg-muted/40 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Xem trước đoạn trích
        </p>
        <p className="mt-2 text-sm text-foreground/90">{previewExcerpt}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          Đăng bài (demo)
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
