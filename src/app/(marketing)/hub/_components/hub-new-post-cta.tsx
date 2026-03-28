"use client";

import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";

import { useAuthStore } from "@/stores/auth-store";

const btnClass =
  "inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold shadow-[0_0_28px_-6px_oklch(0.62_0.22_285/0.75)] transition-[transform,box-shadow] hover:scale-[1.02] hover:shadow-[0_0_36px_-6px_oklch(0.68_0.2_285/0.9)]";

export function HubNewPostCta() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const signedIn = useAuthStore((s) => Boolean(s.user ?? s.accessToken));

  if (!hydrated) {
    return (
      <div
        className="inline-flex h-12 w-44 animate-pulse rounded-xl bg-muted/50"
        aria-hidden
      />
    );
  }

  if (!signedIn) {
    return (
      <Link
        href={`/login?next=${encodeURIComponent("/hub/new")}`}
        className={`${btnClass} border border-border bg-muted/80 text-foreground hover:bg-muted`}
      >
        Đăng nhập để đăng bài
        <ArrowUpRightIcon className="size-4" aria-hidden />
      </Link>
    );
  }

  return (
    <Link
      href="/hub/new"
      className={`${btnClass} bg-primary text-primary-foreground`}
    >
      Đăng bài
      <ArrowUpRightIcon className="size-4" aria-hidden />
    </Link>
  );
}
