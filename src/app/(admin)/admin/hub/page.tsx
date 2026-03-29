// src/app/(admin)/admin/hub/page.tsx
import { AdminHubManage } from "@/app/(admin)/admin/_components/adminHubManage";
import { AdminPageHeader } from "@/app/(admin)/admin/_components/adminPageHeader";

export default function AdminHubPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Hub"
        description="HubPost — PUBLISHED / HIDDEN; danh sách, chỉnh sửa, tạo và xóa mềm qua LawyerAI-api (quyền ADMIN)."
      />
      <AdminHubManage />
    </div>
  );
}
