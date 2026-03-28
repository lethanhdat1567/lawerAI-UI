// src/app/(auth)/forgot-password/page.tsx
import type { Metadata } from "next";

import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Quên mật khẩu",
  description: "Khôi phục mật khẩu LawyerAI — gửi link qua email khi API sẵn sàng.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthPageLayout
      title="Quên mật khẩu"
      description="Chúng tôi gửi link đặt lại mật khẩu tới email của bạn (tích hợp LawyerAI-api sau)."
    >
      <ForgotPasswordForm />
    </AuthPageLayout>
  );
}
