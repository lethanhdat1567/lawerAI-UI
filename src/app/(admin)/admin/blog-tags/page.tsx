import { AdminBlogTagManage } from "@/app/(admin)/admin/_components/adminBlogTagManage";
import { AdminPageHeader } from "@/app/(admin)/admin/_components/adminPageHeader";

export default function BlogTagsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tags bài viết"
        description="Quản lý danh sách tags bài viết của bạn."
      />
      <AdminBlogTagManage />
    </div>
  );
}
