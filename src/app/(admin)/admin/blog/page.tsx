import { AdminBlogManage } from "@/app/(admin)/admin/_components/adminBlogManage";
import { AdminPageHeader } from "@/app/(admin)/admin/_components/adminPageHeader";

export default function AdminBlogPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Blog"
        description="BlogPost — DRAFT / PUBLISHED; kiểm chứng nội dung (verified), legal corpus; CRUD đầy đủ."
      />
      <AdminBlogManage />
    </div>
  );
}
