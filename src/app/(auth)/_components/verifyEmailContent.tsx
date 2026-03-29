"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { ApiError } from "@/lib/api/errors";
import { applyAuthResponse } from "@/lib/auth/applyAuthResponse";
import { cn } from "@/lib/utils";
import { authService } from "@/services/authService";
import { isVerifyEmailWithTokens } from "@/services/authTypes";

interface VerifyEmailContentProps {
  token: string | undefined;
}

export function VerifyEmailContent({ token }: VerifyEmailContentProps) {
  const router = useRouter();
  const [status, setStatus] = useState<
    "idle" | "loading" | "ok" | "error" | "missing"
  >("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const t = token?.trim();
    if (!t) {
      setStatus("missing");
      return;
    }
    let cancelled = false;
    setStatus("loading");
    (async () => {
      try {
        const result = await authService.verifyEmail(t);
        if (cancelled) return;
        setMessage(result.message);

        if (isVerifyEmailWithTokens(result)) {
          console.log(result);

          await applyAuthResponse({
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            accessTokenExpiresAt: result.accessTokenExpiresAt,
          });
          router.push("/");
          router.refresh();
        }

        setStatus("ok");
      } catch (e) {
        if (cancelled) return;
        const msg =
          e instanceof ApiError ? e.message : "Không xác minh được email.";
        setMessage(msg);
        setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, router]);

  if (status === "missing") {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          Thiếu mã xác minh. Mở liên kết đầy đủ từ email hoặc đăng nhập lại để
          nhận hướng dẫn.
        </p>
        <Link href="/login" className={cn(buttonVariants(), "inline-flex")}>
          Đăng nhập
        </Link>
      </div>
    );
  }

  if (status === "loading" || status === "idle") {
    return <p className="text-sm text-muted-foreground">Đang xác minh…</p>;
  }

  return (
    <div className="space-y-4">
      <p
        className={
          status === "ok" ? "text-sm text-primary" : "text-sm text-red-400"
        }
        role="status"
      >
        {message}
      </p>
      <Link
        href="/login"
        className={cn(buttonVariants({ variant: "outline" }), "inline-flex")}
      >
        Về đăng nhập
      </Link>
    </div>
  );
}
