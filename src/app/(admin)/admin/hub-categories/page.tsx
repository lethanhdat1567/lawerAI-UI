import { AdminHubCategoryManage } from "@/app/(admin)/admin/_components/adminHubCategoryManage";
import { AdminPageHeader } from "@/app/(admin)/admin/_components/adminPageHeader";

export default function HubCategoriesPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Danh mục cộng đồng"
        description="Quản lý danh sách danh mục cộng đồng của bạn."
      />
      <AdminHubCategoryManage />
    </div>
  );
}
