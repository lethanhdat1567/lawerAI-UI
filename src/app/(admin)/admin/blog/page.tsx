// src/app/(admin)/admin/blog/page.tsx
import { AdminDataPlaceholder } from "@/components/admin/admin-data-placeholder";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function AdminBlogPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Blog"
        description="BlogPost — DRAFT / PUBLISHED; isVerified và verifiedBy (kiểm chứng nội dung)."
      />
      <AdminDataPlaceholder
        columns={["Tiêu đề", "Slug", "Tác giả", "Trạng thái", "Đã kiểm chứng", "Cập nhật", "Thao tác"]}
      />
    </div>
  );
}
