"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthStore } from "@/stores/auth-store";

export function HubNewPostAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const hydrated = useAuthStore((s) => s.hydrated);
  const signedIn = useAuthStore((s) => Boolean(s.user ?? s.accessToken));

  useEffect(() => {
    if (!hydrated) return;
    if (!signedIn) {
      router.replace(`/login?next=${encodeURIComponent("/hub/new")}`);
    }
  }, [hydrated, signedIn, router]);

  if (!hydrated) {
    return (
      <p className="text-sm text-muted-foreground">Đang kiểm tra phiên đăng nhập…</p>
    );
  }

  if (!signedIn) {
    return (
      <p className="text-sm text-muted-foreground">Đang chuyển đến trang đăng nhập…</p>
    );
  }

  return children;
}
