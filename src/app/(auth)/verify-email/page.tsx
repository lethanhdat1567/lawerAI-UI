// src/app/(auth)/verify-email/page.tsx
import type { Metadata } from "next";

import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { VerifyEmailContent } from "@/components/auth/verify-email-content";

export const metadata: Metadata = {
  title: "Xác minh email",
  description: "Xác minh địa chỉ email LawyerAI.",
};

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function VerifyEmailPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <AuthPageLayout
      title="Xác minh email"
      description="Hoàn tất xác minh để dùng đầy đủ tính năng tài khoản."
    >
      <VerifyEmailContent token={params.token} />
    </AuthPageLayout>
  );
}
