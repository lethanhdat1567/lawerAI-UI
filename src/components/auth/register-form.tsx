// src/components/auth/register-form.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

import { AuthField } from "@/components/auth/auth-field";
import { AuthGoogleButton } from "@/components/auth/auth-google-button";
import { AuthPasswordInput } from "@/components/auth/auth-password-input";
import {
  isValidEmail,
  isValidUsername,
  PASSWORD_MIN_LENGTH,
} from "@/components/auth/auth-validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RegisterForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setMessage("");

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const username = String(fd.get("username") ?? "").trim();
    const displayName = String(fd.get("displayName") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    const confirm = String(fd.get("confirmPassword") ?? "");

    const next: Record<string, string> = {};
    if (!email) next.email = "Nhập email.";
    else if (!isValidEmail(email)) next.email = "Email không hợp lệ.";

    if (!username) next.username = "Nhập tên đăng nhập.";
    else if (!isValidUsername(username))
      next.username = `3–32 ký tự: chữ, số, gạch ngang hoặc gạch dưới.`;

    if (displayName.length > 80)
      next.displayName = "Tên hiển thị tối đa 80 ký tự.";

    if (!password) next.password = "Nhập mật khẩu.";
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
        "Chức năng đang kết nối API. Sau khi đăng ký, bạn có thể cần xác thực email trước khi dùng đầy đủ tính năng.",
      );
    }, 400);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <AuthField label="Email" htmlFor="reg-email" error={errors.email}>
        <Input
          id="reg-email"
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          placeholder="ban@example.com"
          className="h-10"
        />
      </AuthField>

      <AuthField
        label="Tên đăng nhập"
        htmlFor="reg-username"
        hint="Dùng cho URL hồ sơ; không đổi dễ dàng sau này."
        error={errors.username}
      >
        <Input
          id="reg-username"
          name="username"
          autoComplete="username"
          aria-invalid={Boolean(errors.username)}
          placeholder="nguyen_van_a"
          className="h-10"
        />
      </AuthField>

      <AuthField
        label="Tên hiển thị (tuỳ chọn)"
        htmlFor="reg-display"
        error={errors.displayName}
      >
        <Input
          id="reg-display"
          name="displayName"
          autoComplete="name"
          aria-invalid={Boolean(errors.displayName)}
          placeholder="Nguyễn Văn A"
          className="h-10"
        />
      </AuthField>

      <AuthField label="Mật khẩu" htmlFor="reg-password" error={errors.password}>
        <AuthPasswordInput
          id="reg-password"
          name="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
        />
      </AuthField>

      <AuthField
        label="Xác nhận mật khẩu"
        htmlFor="reg-confirm"
        error={errors.confirmPassword}
      >
        <AuthPasswordInput
          id="reg-confirm"
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
        {pending ? "Đang xử lý…" : "Tạo tài khoản"}
      </Button>

      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <span className="bg-background px-3">hoặc</span>
        </div>
      </div>

      <AuthGoogleButton label="Đăng ký với Google" disabled={pending} />

      <p className="text-center text-sm text-muted-foreground">
        Đã có tài khoản?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Đăng nhập
        </Link>
      </p>
    </form>
  );
}
