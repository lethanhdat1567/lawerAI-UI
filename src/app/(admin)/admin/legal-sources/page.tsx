// src/app/(admin)/admin/legal-sources/page.tsx
import { AdminDataPlaceholder } from "@/components/admin/admin-data-placeholder";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function AdminLegalSourcesPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Nguồn pháp lý (RAG)"
        description="LegalSource + LegalDocumentChunk — quản trị corpus nội bộ."
      />
      <AdminDataPlaceholder columns={["Tiêu đề", "URL", "Khu vực", "Hiệu lực", "Chunks", "Thao tác"]} />
    </div>
  );
}
