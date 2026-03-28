// src/app/(admin)/admin/users/page.tsx
import { AdminDataPlaceholder } from "@/components/admin/admin-data-placeholder";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Người dùng"
        description="User + Profile — phân quyền USER / VERIFIED_LAWYER / ADMIN (schema Prisma)."
      />
      <AdminDataPlaceholder columns={["Email", "Vai trò", "Username", "Ngày tạo", "Thao tác"]} />
    </div>
  );
}
