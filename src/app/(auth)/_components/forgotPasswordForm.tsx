// src/app/(auth)/_components/forgotPasswordForm.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

import { AuthField } from "@/app/(auth)/_components/authField";
import { isValidEmail } from "@/app/(auth)/_components/authValidation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/errors";
import { authService } from "@/services/auth/authService";

export function ForgotPasswordForm() {
  const [error, setError] = useState("");
  const [sentMessage, setSentMessage] = useState("");
  const [sentEmail, setSentEmail] = useState("");
  const [formMessage, setFormMessage] = useState<{
    type: "idle" | "info" | "error";
    text: string;
  }>({ type: "idle", text: "" });
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSentMessage("");
    setSentEmail("");
    setFormMessage({ type: "idle", text: "" });

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
      setSentEmail(email);
    } catch (err) {
      const text =
        err instanceof ApiError ? err.message : "Không gửi được yêu cầu.";
      setFormMessage({ type: "error", text });
    } finally {
      setPending(false);
    }
  }

  const resetHref =
    sentEmail.length > 0
      ? `/reset-password?email=${encodeURIComponent(sentEmail)}`
      : "/reset-password";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <AuthField label="Email" htmlFor="forgot-email" error={error}>
        <Input
          id="forgot-email"
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(error)}
          className="h-10"
        />
      </AuthField>

      {formMessage.text ? (
        <p
          className={
            formMessage.type === "error"
              ? "text-sm text-red-400"
              : "text-sm text-muted-foreground"
          }
          role="status"
        >
          {formMessage.text}
        </p>
      ) : null}

      {sentMessage ? (
        <div className="space-y-3 rounded-none border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-primary">
          <p>{sentMessage}</p>
          <Link
            href={resetHref}
            className="inline-flex h-10 w-full items-center justify-center rounded-none border border-border bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-none hover:bg-primary/90"
          >
            Tiếp tục đặt lại mật khẩu
          </Link>
        </div>
      ) : null}

      <Button
        type="submit"
        className="h-11 w-full rounded-none border border-border bg-primary text-base font-semibold text-primary-foreground shadow-none hover:bg-primary/90"
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
