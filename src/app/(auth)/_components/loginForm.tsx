// src/components/auth/login-form.tsx
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { AuthField } from "@/app/(auth)/_components/authField";
import { AuthGoogleButton } from "@/app/(auth)/_components/authGoogleButton";
import { AuthPasswordInput } from "@/app/(auth)/_components/authPasswordInput";
import { isValidEmail } from "@/app/(auth)/_components/authValidation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/errors";
import { applyAuthResponse } from "@/lib/auth/applyAuthResponse";
import { authService } from "@/services/authService";

function safeNextPath(raw: string | null): string | null {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return null;
  return raw;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formMessage, setFormMessage] = useState<{
    type: "idle" | "info" | "error";
    text: string;
  }>({ type: "idle", text: "" });
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setFormMessage({ type: "idle", text: "" });

    const fd = new FormData(e.currentTarget);
    const emailVal = String(fd.get("email") ?? "").trim();
    const passwordVal = String(fd.get("password") ?? "");

    let ok = true;
    if (!emailVal) {
      setEmailError("Nhập email.");
      ok = false;
    } else if (!isValidEmail(emailVal)) {
      setEmailError("Email không hợp lệ.");
      ok = false;
    }
    if (!passwordVal) {
      setPasswordError("Nhập mật khẩu.");
      ok = false;
    }
    if (!ok) return;

    setPending(true);
    try {
      const data = await authService.login({
        email: emailVal,
        password: passwordVal,
      });
      await applyAuthResponse(data);
      setFormMessage({ type: "info", text: "Đăng nhập thành công." });
      const next = safeNextPath(searchParams.get("next"));
      router.push(next ?? "/");
      router.refresh();
    } catch (err) {
      const text =
        err instanceof ApiError
          ? err.message
          : "Đăng nhập thất bại. Thử lại sau.";
      setFormMessage({ type: "error", text });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <AuthField
        label="Email"
        htmlFor="login-email"
        error={emailError}
      >
        <Input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "login-email-error" : undefined}
          placeholder="ban@example.com"
          className="h-10"
        />
      </AuthField>

      <AuthField
        label="Mật khẩu"
        htmlFor="login-password"
        error={passwordError}
      >
        <AuthPasswordInput
          id="login-password"
          name="password"
          autoComplete="current-password"
          aria-invalid={Boolean(passwordError)}
          aria-describedby={passwordError ? "login-password-error" : undefined}
        />
      </AuthField>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <label className="flex cursor-pointer items-center gap-2 text-muted-foreground">
          <input
            name="remember"
            type="checkbox"
            className="size-4 rounded border-border bg-input/30 accent-primary"
          />
          Ghi nhớ đăng nhập
        </label>
        <Link
          href="/forgot-password"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Quên mật khẩu?
        </Link>
      </div>

      {formMessage.text ? (
        <p
          className={
            formMessage.type === "error" ? "text-sm text-red-400" : "text-sm text-muted-foreground"
          }
          role="status"
        >
          {formMessage.text}
        </p>
      ) : null}

      <Button
        type="submit"
        className="h-11 w-full rounded-xl border border-border bg-primary text-base font-semibold text-primary-foreground shadow-none hover:bg-primary/90"
        size="lg"
        disabled={pending}
      >
        {pending ? "Đang xử lý…" : "Đăng nhập"}
      </Button>

      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <span className="bg-background px-3">hoặc</span>
        </div>
      </div>

      <AuthGoogleButton disabled={pending} />

      <p className="text-center text-sm text-muted-foreground">
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Tạo tài khoản
        </Link>
      </p>
    </form>
  );
}
