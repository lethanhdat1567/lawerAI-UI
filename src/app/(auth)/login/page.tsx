// src/app/(auth)/login/page.tsx
import type { Metadata } from "next";

import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập LawyerAI — kết nối API sau (session/JWT).",
};

export default function LoginPage() {
  return (
    <AuthPageLayout
      title="Đăng nhập"
      description="Truy cập tài khoản để lưu hội thoại tra cứu và đóng góp trên Hub."
    >
      <LoginForm />
    </AuthPageLayout>
  );
}
