import { AdminPageHeader } from "@/app/(admin)/admin/_components/adminPageHeader";
import { AdminReportsManage } from "@/app/(admin)/admin/_components/adminReportsManage";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Báo cáo"
        description="Report — xử lý báo cáo kiểm duyệt (OPEN → ACTIONED / DISMISSED)."
      />
      <AdminReportsManage />
    </div>
  );
}
