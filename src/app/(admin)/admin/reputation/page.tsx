// src/app/(admin)/admin/reputation/page.tsx
import { AdminReputationManage } from "@/app/(admin)/admin/_components/adminReputationManage";
import { AdminPageHeader } from "@/app/(admin)/admin/_components/adminPageHeader";

export default function AdminReputationPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Uy tín"
        description="Sổ cái ReputationLedger — điều chỉnh điểm và xem lịch sử."
      />
      <AdminReputationManage />
    </div>
  );
}
