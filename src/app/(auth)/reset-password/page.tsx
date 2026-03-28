// src/app/(auth)/reset-password/page.tsx
import type { Metadata } from "next";

import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Đặt lại mật khẩu",
  description: "Đặt mật khẩu mới bằng token từ email.",
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  const token = params.token;

  return (
    <AuthPageLayout
      title="Đặt lại mật khẩu"
      description="Chọn mật khẩu mới cho tài khoản. Liên kết thường có dạng ?token=… từ email khôi phục."
    >
      <ResetPasswordForm token={token} />
    </AuthPageLayout>
  );
}
