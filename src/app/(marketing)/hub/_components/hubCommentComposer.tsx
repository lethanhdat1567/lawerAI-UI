// src/app/(marketing)/hub/_components/hubCommentComposer.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api/errors";
import { hubMeCreateComment } from "@/lib/hub/hubApi";
import { useAuthStore } from "@/stores/auth-store";

export function HubCommentComposer({ postId }: { postId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useAuthStore((s) => s.hydrated);
  const signedIn = useAuthStore((s) => Boolean(s.user ?? s.accessToken));
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!body.trim() || !signedIn) return;
    setSubmitting(true);
    try {
      await hubMeCreateComment(postId, { body: body.trim(), parentId: null });
      toast.success("Đã gửi bình luận.");
      setBody("");
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Không gửi được bình luận.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
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
      onSubmit={(e) => void handleSubmit(e)}
      className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-md"
    >
      <label
        htmlFor="hub-comment"
        className="text-sm font-semibold text-foreground"
      >
        Viết bình luận
      </label>
      <textarea
        id="hub-comment"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        placeholder="Chia sẻ góc nhìn hoặc trích dẫn điều luật…"
        className="mt-3 w-full resize-y rounded-xl border border-border bg-background/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-10 cursor-pointer! items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {submitting ? "Đang gửi…" : "Gửi"}
        </button>
        <p className="text-xs text-muted-foreground">
          Bình luận hiển thị công khai dưới bài viết.
        </p>
      </div>
    </form>
  );
}
