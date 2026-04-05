// src/components/auth/register-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AuthField } from "@/app/(auth)/_components/authField";
import { AuthGoogleButton } from "@/app/(auth)/_components/authGoogleButton";
import { AuthPasswordInput } from "@/app/(auth)/_components/authPasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/errors";
import {
  registerFormSchema,
  type RegisterFormValues,
} from "@/lib/validators/registerForm";
import { authService } from "@/services/auth/authService";

export function RegisterForm() {
  const [message, setMessage] = useState<{
    type: "ok" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      username: "",
      displayName: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    setMessage(null);
    const { email, username, password } = data;
    try {
      const res = await authService.register({ email, password, username });
      reset();
      setMessage({
        type: "ok",
        text: `${res.message} Bạn có thể đăng nhập sau khi xác minh email bằng liên kết đã gửi.`,
      });
    } catch (err) {
      const text =
        err instanceof ApiError
          ? "Email đã tồn tại."
          : "Tạo tài khoản thất bại. Thử lại sau.";
      setMessage({ type: "error", text });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <AuthField
        label="Email"
        htmlFor="reg-email"
        error={errors.email?.message}
      >
        <Input
          id="reg-email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          className="h-10"
          {...register("email")}
        />
      </AuthField>

      <AuthField
        label="Tên đăng nhập"
        htmlFor="reg-username"
        hint="Dùng cho URL hồ sơ; không đổi dễ dàng sau này."
        error={errors.username?.message}
      >
        <Input
          id="reg-username"
          autoComplete="username"
          aria-invalid={Boolean(errors.username)}
          className="h-10"
          {...register("username")}
        />
      </AuthField>

      <AuthField
        label="Tên hiển thị (tuỳ chọn)"
        htmlFor="reg-display"
        error={errors.displayName?.message}
      >
        <Input
          id="reg-display"
          autoComplete="name"
          aria-invalid={Boolean(errors.displayName)}
          className="h-10"
          {...register("displayName")}
        />
      </AuthField>

      <AuthField
        label="Mật khẩu"
        htmlFor="reg-password"
        error={errors.password?.message}
      >
        <AuthPasswordInput
          id="reg-password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          {...register("password")}
        />
      </AuthField>

      <AuthField
        label="Xác nhận mật khẩu"
        htmlFor="reg-confirm"
        error={errors.confirmPassword?.message}
      >
        <AuthPasswordInput
          id="reg-confirm"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmPassword)}
          {...register("confirmPassword")}
        />
      </AuthField>

      {message ? (
        <p
          className={
            message.type === "error"
              ? "text-sm text-red-400"
              : "text-sm text-muted-foreground"
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
        disabled={isSubmitting}
      >
        {isSubmitting ? "Đang xử lý…" : "Tạo tài khoản"}
      </Button>

      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <span className="bg-background px-3">hoặc</span>
        </div>
      </div>

      <AuthGoogleButton label="Đăng ký với Google" disabled={isSubmitting} />

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
