import { AdminBlogTagManage } from "@/app/(admin)/admin/_components/adminBlogTagManage";
import { AdminPageHeader } from "@/app/(admin)/admin/_components/adminPageHeader";

export default function BlogTagsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Blog Tags"
        description="Quản lý blog tags ở giao diện admin: xem danh sách, tìm kiếm và tạo tag mới theo khả năng API backend hiện tại."
      />
      <AdminBlogTagManage />
    </div>
  );
}
