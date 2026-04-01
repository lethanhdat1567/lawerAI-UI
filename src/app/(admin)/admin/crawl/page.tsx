import { AdminCrawlManage } from "@/app/(admin)/admin/_components/adminCrawlManage";
import { AdminPageHeader } from "@/app/(admin)/admin/_components/adminPageHeader";

export default function AdminCrawlPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Crawl dữ liệu luật"
        description="Crawl URL, review/chỉnh sửa markdown rồi Approve & Sync."
      />
      <AdminCrawlManage />
    </div>
  );
}
