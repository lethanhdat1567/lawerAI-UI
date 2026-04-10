import { AdminPageHeader } from "@/app/(admin)/admin/_components/adminPageHeader";
import { AdminVerificationsManage } from "@/app/(admin)/admin/_components/adminVerificationsManage";

export default function AdminVerificationsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Xác minh luật sư"
        description="Hệ thống phê duyệt hồ sơ luật sư và kiểm soát quyền truy cập tài khoản."
      />
      <AdminVerificationsManage />
    </div>
  );
}
