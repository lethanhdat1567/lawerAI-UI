// src/app/(admin)/admin/reputation/page.tsx
import { AdminDataPlaceholder } from "@/components/admin/admin-data-placeholder";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function AdminReputationPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Uy tín"
        description="ReputationLedger + UserContributionScore — điều chỉnh ADMIN_BONUS / ADMIN_PENALTY khi có API."
      />
      <AdminDataPlaceholder
        columns={["User", "Delta", "Lý do", "Tham chiếu", "Ngày"]}
      />
    </div>
  );
}
