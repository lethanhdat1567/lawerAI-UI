import { AdminPageHeader } from "@/app/(admin)/admin/_components/adminPageHeader";
import { AdminLeaderboardManage } from "@/app/(admin)/admin/_components/adminLeaderboardManage";

export default function AdminLeaderboardPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Bảng xếp hạng"
        description="UserContributionScore — điểm đóng góp (admin xem kèm email)."
      />
      <AdminLeaderboardManage />
    </div>
  );
}
