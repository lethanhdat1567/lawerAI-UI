// src/components/auth/reset-password-form.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { AuthField } from "@/app/(auth)/_components/authField";
import { AuthPasswordInput } from "@/app/(auth)/_components/authPasswordInput";
import {
  isValidEmail,
  PASSWORD_MIN_LENGTH,
} from "@/app/(auth)/_components/authValidation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/errors";
import { authService } from "@/services/auth/authService";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const emailHint = searchParams.get("email")?.trim() ?? "";

  const [email, setEmail] = useState(emailHint);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{
    type: "ok" | "error";
    text: string;
  } | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setMessage(null);

    const fd = new FormData(e.currentTarget);
    const emailVal = String(fd.get("email") ?? "").trim();
    const code = String(fd.get("code") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    const confirm = String(fd.get("confirmPassword") ?? "");

    const next: Record<string, string> = {};
    if (!emailVal) next.email = "Nhập email.";
    else if (!isValidEmail(emailVal)) next.email = "Email không hợp lệ.";
    if (!code) next.code = "Nhập mã từ email.";
    if (!password) next.password = "Nhập mật khẩu mới.";
    else if (password.length < PASSWORD_MIN_LENGTH)
      next.password = `Mật khẩu tối thiểu ${PASSWORD_MIN_LENGTH} ký tự.`;
    if (!confirm) next.confirmPassword = "Nhập lại mật khẩu.";
    else if (confirm !== password) next.confirmPassword = "Mật khẩu không khớp.";

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    setPending(true);
    try {
      const { message: msg } = await authService.resetPassword({
        email: emailVal,
        code,
        newPassword: password,
      });
      setMessage({ type: "ok", text: msg });
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err instanceof ApiError
            ? err.message
            : "Không đặt lại được mật khẩu.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Nhập email đã dùng khi yêu cầu khôi phục và mã gồm các chữ số gửi qua email.
      </p>

      <AuthField label="Email" htmlFor="reset-email" error={errors.email}>
        <Input
          id="reset-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(errors.email)}
          placeholder="ban@example.com"
          className="h-10"
        />
      </AuthField>

      <AuthField label="Mã từ email" htmlFor="reset-code" error={errors.code}>
        <Input
          id="reset-code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          aria-invalid={Boolean(errors.code)}
          placeholder="123456"
          className="h-10 font-mono tracking-widest"
        />
      </AuthField>

      <AuthField label="Mật khẩu mới" htmlFor="reset-password" error={errors.password}>
        <AuthPasswordInput
          id="reset-password"
          name="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
        />
      </AuthField>

      <AuthField
        label="Xác nhận mật khẩu"
        htmlFor="reset-confirm"
        error={errors.confirmPassword}
      >
        <AuthPasswordInput
          id="reset-confirm"
          name="confirmPassword"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmPassword)}
        />
      </AuthField>

      {message ? (
        <p
          className={
            message.type === "error"
              ? "text-sm text-red-400"
              : "text-sm text-primary"
          }
          role="status"
        >
          {message.text}
        </p>
      ) : null}

      <Button
        type="submit"
        className="h-11 w-full rounded-xl border border-border bg-primary text-base font-semibold text-primary-foreground shadow-none hover:bg-primary/90"
        size="lg"
        disabled={pending}
      >
        {pending ? "Đang cập nhật…" : "Đặt lại mật khẩu"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
          Quay lại đăng nhập
        </Link>
      </p>
    </form>
  );
}
