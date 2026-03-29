// src/components/auth/auth-google-button.tsx
"use client";

import { FirebaseError } from "firebase/app";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/errors";
import { applyAuthResponse } from "@/lib/auth/applyAuthResponse";
import {
  getFirebaseAuth,
  googleAuthProvider,
  isFirebaseConfigured,
} from "@/lib/firebase/client";
import { cn } from "@/lib/utils";
import { authService } from "@/services/authService";

function describeFirebaseAuthError(err: unknown): string | null {
  if (!(err instanceof FirebaseError)) return null;
  if (err.code === "auth/configuration-not-found") {
    return (
      "Firebase không tải được cấu hình đăng nhập. Kiểm tra: (1) Firebase Console → Authentication → Get started → bật Sign-in method Google; " +
      "(2) Google Cloud → APIs → bật Identity Toolkit API; " +
      "(3) API key Web: hạn chế referrer phải gồm localhost và domain production, hoặc tạm thời để không hạn chế khi dev; " +
      "(4) Authentication → Settings → Authorized domains có localhost; " +
      "(5) Restart `npm run dev` sau khi sửa .env."
    );
  }
  if (err.code === "auth/unauthorized-domain") {
    return "Domain chưa được phép: thêm localhost (hoặc domain của bạn) trong Firebase → Authentication → Settings → Authorized domains.";
  }
  if (err.code === "auth/popup-closed-by-user") {
    return "Đã đóng cửa sổ đăng nhập Google.";
  }
  return err.message;
}

function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

interface AuthGoogleButtonProps {
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function AuthGoogleButton({
  label = "Tiếp tục với Google",
  disabled = false,
  className,
}: AuthGoogleButtonProps) {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setMsg("");
    if (!isFirebaseConfigured()) {
      setMsg("Chưa cấu hình Firebase (biến NEXT_PUBLIC_FIREBASE_*).");
      return;
    }
    setPending(true);
    try {
      const auth = getFirebaseAuth();
      const cred = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await cred.user.getIdToken();
      const data = await authService.firebaseSignIn({ idToken });
      await applyAuthResponse(data);
      router.push("/");
      router.refresh();
    } catch (err) {
      const text =
        err instanceof ApiError
          ? err.message
          : (describeFirebaseAuthError(err) ??
            (err instanceof Error
              ? err.message
              : "Đăng nhập Google thất bại."));
      setMsg(text);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        disabled={disabled || pending}
        onClick={() => void handleClick()}
        className={cn(
          "h-11 w-full gap-3 rounded-xl border-border bg-transparent text-base font-medium text-foreground hover:bg-muted",
          className,
        )}
      >
        <GoogleGlyph className="size-5 shrink-0" />
        {pending ? "Đang xử lý…" : label}
      </Button>
      {msg ? (
        <p className="text-center text-sm text-muted-foreground" role="status">
          {msg}
        </p>
      ) : null}
    </div>
  );
}
