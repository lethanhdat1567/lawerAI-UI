// src/app/(auth)/login/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthPageLayout } from "@/app/(auth)/_components/authPageLayout";
import { LoginForm } from "@/app/(auth)/_components/loginForm";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập LawyerAI — kết nối API sau (session/JWT).",
};

export default function LoginPage() {
  return (
    <AuthPageLayout
      title="Đăng nhập"
      description="Trở thành thành viên để cá nhân hóa trải nghiệm tra cứu luật, lưu trữ lịch sử tư vấn AI và đóng góp giá trị cho cộng đồng LawyerAI Hub."
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthPageLayout>
  );
}
