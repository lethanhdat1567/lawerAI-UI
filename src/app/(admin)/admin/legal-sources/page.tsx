import { AdminPageHeader } from "@/app/(admin)/admin/_components/adminPageHeader";
import { AdminLegalSourcesManage } from "@/app/(admin)/admin/_components/adminLegalSourcesManage";

export default function AdminLegalSourcesPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Nguồn pháp lý"
        description="LegalSource — metadata (chunk RAG tách phase sau)."
      />
      <AdminLegalSourcesManage />
    </div>
  );
}
