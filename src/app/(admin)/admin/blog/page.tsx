import { AdminBlogManage } from "@/app/(admin)/admin/_components/adminBlogManage";
import { AdminPageHeader } from "@/app/(admin)/admin/_components/adminPageHeader";

export default function AdminBlogPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Bài viết"
        description="Quản lý danh sách bài viết của bạn."
      />
      <AdminBlogManage />
    </div>
  );
}
