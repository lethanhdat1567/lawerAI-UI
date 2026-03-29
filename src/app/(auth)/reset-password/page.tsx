// src/app/(auth)/reset-password/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthPageLayout } from "@/app/(auth)/_components/authPageLayout";
import { ResetPasswordForm } from "@/app/(auth)/_components/resetPasswordForm";

export const metadata: Metadata = {
  title: "Đặt lại mật khẩu",
  description: "Đặt mật khẩu mới bằng mã từ email.",
};

export default function ResetPasswordPage() {
  return (
    <AuthPageLayout
      title="Đặt lại mật khẩu"
      description="Dùng mã số đã gửi tới email cùng với email tài khoản."
    >
      <Suspense fallback={<p className="text-sm text-muted-foreground">Đang tải…</p>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthPageLayout>
  );
}
