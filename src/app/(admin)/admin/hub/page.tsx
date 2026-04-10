// src/app/(admin)/admin/hub/page.tsx
import { AdminHubManage } from "@/app/(admin)/admin/_components/adminHubManage";
import { AdminPageHeader } from "@/app/(admin)/admin/_components/adminPageHeader";

export default function AdminHubPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Cộng đồng"
        description="Quản lý danh sách bài viết cộng đồng của bạn."
      />
      <AdminHubManage />
    </div>
  );
}
