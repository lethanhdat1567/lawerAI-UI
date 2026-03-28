// src/app/(marketing)/profile/page.tsx
import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { ProfileForm } from "@/components/profile/profile-form";

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
