// src/app/(admin)/admin/reports/page.tsx
import { AdminDataPlaceholder } from "@/components/admin/admin-data-placeholder";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Báo cáo"
        description="Report — target type (Hub, Bài blog, User, …), trạng thái OPEN / ACTIONED / DISMISSED."
      />
      <AdminDataPlaceholder
        columns={["Loại đích", "ID đích", "Người gửi", "Trạng thái", "Ngày tạo", "Thao tác"]}
      />
    </div>
  );
}
