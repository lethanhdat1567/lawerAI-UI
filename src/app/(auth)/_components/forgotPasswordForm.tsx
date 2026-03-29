// src/components/auth/forgot-password-form.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

import { AuthField } from "@/app/(auth)/_components/authField";
import { isValidEmail } from "@/app/(auth)/_components/authValidation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/errors";
import { authService } from "@/services/authService";

export function ForgotPasswordForm() {
  const [error, setError] = useState("");
  const [sentMessage, setSentMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSentMessage("");

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();

    if (!email) {
      setError("Nhập email đã dùng khi đăng ký.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Email không hợp lệ.");
      return;
    }

    setPending(true);
    try {
      const { message } = await authService.forgotPassword({ email });
      setSentMessage(message);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Không gửi được yêu cầu.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Nhập email tài khoản. Nếu khớp với hệ thống, chúng tôi gửi mã đặt lại mật khẩu qua
        email.
      </p>

      <AuthField label="Email" htmlFor="forgot-email" error={error}>
        <Input
          id="forgot-email"
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(error)}
          placeholder="ban@example.com"
          className="h-10"
        />
      </AuthField>

      {sentMessage ? (
        <p className="rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-primary">
          {sentMessage}
        </p>
      ) : null}

      <Button
        type="submit"
        className="h-11 w-full rounded-xl border border-border bg-primary text-base font-semibold text-primary-foreground shadow-none hover:bg-primary/90"
        size="lg"
        disabled={pending}
      >
        {pending ? "Đang gửi…" : "Gửi mã khôi phục"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link
          href="/login"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Quay lại đăng nhập
        </Link>
      </p>
    </form>
  );
}
