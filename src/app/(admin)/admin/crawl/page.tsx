import { AdminCrawlManage } from "@/app/(admin)/admin/_components/adminCrawlManage";
import { AdminPageHeader } from "@/app/(admin)/admin/_components/adminPageHeader";

export default function AdminCrawlPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Số hóa dữ liệu"
        description="Thu thập nội dung từ URL, biên tập định dạng và đồng bộ hệ thống."
      />
      <AdminCrawlManage />
    </div>
  );
}
