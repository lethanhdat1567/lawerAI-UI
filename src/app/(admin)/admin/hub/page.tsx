// src/app/(admin)/admin/hub/page.tsx
import { AdminDataPlaceholder } from "@/components/admin/admin-data-placeholder";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function AdminHubPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Hub"
        description="HubPost — PUBLISHED / HIDDEN; quản lý danh mục HubCategory."
      />
      <AdminDataPlaceholder
        columns={["Tiêu đề", "Slug", "Danh mục", "Tác giả", "Trạng thái", "Cập nhật", "Thao tác"]}
      />
    </div>
  );
}
