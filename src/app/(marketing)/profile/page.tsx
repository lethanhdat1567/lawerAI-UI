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
      title="Hồ sơ"
      description="Cập nhật thông tin hiển thị, ảnh đại diện và tùy chọn đóng góp."
    >
      <ProfileForm />
    </PageShell>
  );
}
