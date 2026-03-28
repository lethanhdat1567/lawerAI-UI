// src/app/(marketing)/hub/_components/hub-comment-composer.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

import { useAuthStore } from "@/stores/auth-store";

export function HubCommentComposer() {
  const pathname = usePathname();
  const hydrated = useAuthStore((s) => s.hydrated);
  const signedIn = useAuthStore((s) => Boolean(s.user ?? s.accessToken));
  const [body, setBody] = useState("");
  const [hint, setHint] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!body.trim() || !signedIn) return;
    setHint("Chỉ hiển thị trên UI demo — chưa gửi lên server.");
    setBody("");
  }

  const loginHref = `/login?next=${encodeURIComponent(pathname || "/hub")}`;

  if (!hydrated) {
    return (
      <div className="h-32 animate-pulse rounded-2xl border border-border bg-muted/20" />
    );
  }

  if (!signedIn) {
    return (
      <div className="rounded-2xl border border-border bg-card/40 px-5 py-6 backdrop-blur-md">
        <p className="text-sm font-medium text-foreground">
          Đăng nhập để viết bình luận
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Chỉ thành viên đã đăng nhập mới có thể bình luận.
        </p>
        <Link
          href={loginHref}
          className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground"
        >
          Đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-md"
    >
      <label htmlFor="hub-comment" className="text-sm font-semibold text-foreground">
        Viết bình luận
      </label>
      <textarea
        id="hub-comment"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        placeholder="Chia sẻ góc nhìn hoặc trích dẫn điều luật (demo)…"
        className="mt-3 w-full resize-y rounded-xl border border-border bg-background/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground"
        >
          Gửi
        </button>
        {hint ? (
          <p className="text-xs text-muted-foreground">{hint}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Demo: không lưu dữ liệu.
          </p>
        )}
      </div>
    </form>
  );
}
