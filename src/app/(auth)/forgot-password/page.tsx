// src/app/(auth)/forgot-password/page.tsx
import type { Metadata } from "next";

import { AuthPageLayout } from "@/app/(auth)/_components/authPageLayout";
import { ForgotPasswordForm } from "@/app/(auth)/_components/forgotPasswordForm";

export const metadata: Metadata = {
  title: "Quên mật khẩu",
  description:
    "Khôi phục mật khẩu LawyerAI — nhận mã 6 số qua email và đặt lại mật khẩu.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthPageLayout
      title="Quên mật khẩu"
      description="Nhập email tài khoản. Nếu có tài khoản, bạn sẽ nhận mã 6 số qua email để đặt lại mật khẩu."
    >
      <ForgotPasswordForm />
    </AuthPageLayout>
  );
}
