// src/app/(marketing)/profile/page.tsx
import type { Metadata } from "next";

import { PageShell } from "@/components/layout/pageShell";
import { ProfileForm } from "@/app/(marketing)/profile/_components/profileForm";

export const metadata: Metadata = {
  title: "Hồ sơ",
};

export default function ProfilePage() {
  return (
    <PageShell
      title="Tài khoản"
      description="Quản lý thông tin cá nhân, ảnh đại diện và tùy chọn hiển thị đóng góp."
    >
      <ProfileForm />
    </PageShell>
  );
}
