// src/app/(admin)/admin/users/page.tsx
import { AdminPageHeader } from "@/app/(admin)/admin/_components/adminPageHeader";
import { AdminUsersManage } from "@/app/(admin)/admin/_components/adminUsersManage";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Người dùng"
        description="Quản lý danh sách người dùng cùng quyền hạn của họ."
      />
      <AdminUsersManage />
    </div>
  );
}
