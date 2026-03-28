// src/app/(admin)/admin/verifications/page.tsx
import { AdminDataPlaceholder } from "@/components/admin/admin-data-placeholder";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function AdminVerificationsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Xác minh luật sư"
        description="Hàng chờ LawyerVerification — PENDING, APPROVED, REJECTED, REVOKED."
      />
      <AdminDataPlaceholder
        columns={["Người nộp", "Trạng thái", "Khu vực", "Số thẻ", "Ngày tạo", "Thao tác"]}
      />
    </div>
  );
}
