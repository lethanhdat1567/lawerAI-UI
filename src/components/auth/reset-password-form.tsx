// src/components/auth/reset-password-form.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

import { AuthField } from "@/components/auth/auth-field";
import { AuthPasswordInput } from "@/components/auth/auth-password-input";
import { PASSWORD_MIN_LENGTH } from "@/components/auth/auth-validation";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ResetPasswordFormProps {
  token: string | undefined;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  if (!token?.trim()) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Liên khôi phục không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu gửi lại email.
        </p>
        <Link
          href="/forgot-password"
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-11 w-full rounded-xl border border-border bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90",
          )}
        >
          Yêu cầu link mới
        </Link>
        <p className="text-sm text-muted-foreground">
          <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
            Về trang đăng nhập
          </Link>
        </p>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setMessage("");

    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password") ?? "");
    const confirm = String(fd.get("confirmPassword") ?? "");

    const next: Record<string, string> = {};
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
    window.setTimeout(() => {
      setPending(false);
      setMessage(
        "Chức năng đang kết nối API. Token demo đã được gửi từ URL; backend sẽ xác thực và cập nhật mật khẩu.",
      );
    }, 450);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <p className="rounded-lg border border-border bg-muted px-3 py-2 font-mono text-xs text-muted-foreground break-all [overflow-wrap:anywhere]">
        token=<span className="text-foreground">{token}</span>
      </p>

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
        <p className="text-sm text-muted-foreground" role="status">
          {message}
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
