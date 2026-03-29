import { AdminPageHeader } from "@/app/(admin)/admin/_components/adminPageHeader";
import { AdminVerificationsManage } from "@/app/(admin)/admin/_components/adminVerificationsManage";

export default function AdminVerificationsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Xác minh luật sư"
        description="LawyerVerification — duyệt / từ chối / thu hồi; cập nhật vai trò VERIFIED_LAWYER khi duyệt."
      />
      <AdminVerificationsManage />
    </div>
  );
}
