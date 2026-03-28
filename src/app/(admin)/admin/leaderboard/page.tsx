// src/app/(admin)/admin/leaderboard/page.tsx
import { AdminDataPlaceholder } from "@/components/admin/admin-data-placeholder";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function AdminLeaderboardPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Bảng xếp hạng"
        description="LeaderboardSnapshot — payload JSON theo kỳ (đọc / xuất từ API)."
      />
      <AdminDataPlaceholder columns={["Kỳ bắt đầu", "Kỳ kết thúc", "Tạo lúc", "Xem JSON"]} />
    </div>
  );
}
