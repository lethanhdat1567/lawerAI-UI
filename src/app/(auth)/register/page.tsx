// src/app/(auth)/register/page.tsx
import type { Metadata } from "next";

import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Tạo tài khoản",
  description: "Đăng ký LawyerAI — email, tên đăng nhập và hồ sơ.",
};

export default function RegisterPage() {
  return (
    <AuthPageLayout
      variant="wide"
      title="Tạo tài khoản"
      description="Một tài khoản dùng cho Tra cứu, Hub và Blog. Sau đăng ký, bạn có thể cần xác thực email (emailVerifiedAt) trước khi bật đủ tính năng."
      footer={
        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          Bằng việc tạo tài khoản, bạn đồng ý với các điều khoản và chính sách của
          LawyerAI khi nền tảng áp dụng.
        </p>
      }
    >
      <RegisterForm />
    </AuthPageLayout>
  );
}
