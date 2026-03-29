"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthStore } from "@/stores/auth-store";

export function BlogPostAuthGuard({
  children,
  loginNext,
}: {
  children: React.ReactNode;
  loginNext: string;
}) {
  const router = useRouter();
  const hydrated = useAuthStore((s) => s.hydrated);
  const signedIn = useAuthStore((s) => Boolean(s.user ?? s.accessToken));

  useEffect(() => {
    if (!hydrated) return;
    if (!signedIn) {
      router.replace(`/login?next=${encodeURIComponent(loginNext)}`);
    }
  }, [hydrated, signedIn, router, loginNext]);

  if (!hydrated) {
    return (
      <p className="text-sm text-muted-foreground">
        Đang kiểm tra phiên đăng nhập…
      </p>
    );
  }

  if (!signedIn) {
    return (
      <p className="text-sm text-muted-foreground">
        Đang chuyển đến trang đăng nhập…
      </p>
    );
  }

  return children;
}
