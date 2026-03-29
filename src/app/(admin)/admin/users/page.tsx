// src/app/(admin)/admin/users/page.tsx
import { AdminPageHeader } from "@/app/(admin)/admin/_components/adminPageHeader";
import { AdminUsersManage } from "@/app/(admin)/admin/_components/adminUsersManage";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Người dùng"
        description="User + Profile — phân quyền USER / VERIFIED_LAWYER / ADMIN (schema Prisma)."
      />
      <AdminUsersManage />
    </div>
  );
}
