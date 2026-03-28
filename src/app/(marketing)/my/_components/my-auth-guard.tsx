"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthStore } from "@/stores/auth-store";

export function MyAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthStore((s) => s.hydrated);
  const signedIn = useAuthStore((s) => Boolean(s.user ?? s.accessToken));

  useEffect(() => {
    if (!hydrated) return;
    if (!signedIn) {
      router.replace(`/login?next=${encodeURIComponent("/my")}`);
    }
  }, [hydrated, signedIn, router]);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16">
        <p className="text-sm text-muted-foreground">
          Đang kiểm tra phiên đăng nhập…
        </p>
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16">
        <p className="text-sm text-muted-foreground">
          Đang chuyển đến trang đăng nhập…
        </p>
      </div>
    );
  }

  return children;
}
