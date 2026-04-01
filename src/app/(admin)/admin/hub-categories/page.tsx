import { AdminHubCategoryManage } from "@/app/(admin)/admin/_components/adminHubCategoryManage";
import { AdminPageHeader } from "@/app/(admin)/admin/_components/adminPageHeader";

export default function HubCategoriesPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Hub Categories"
        description="Quản lý danh mục Hub: tìm kiếm, tạo mới, chỉnh sửa, xóa mềm và phân trang ở giao diện admin."
      />
      <AdminHubCategoryManage />
    </div>
  );
}
