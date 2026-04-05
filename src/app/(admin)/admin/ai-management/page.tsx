import { AdminAiPromptsForm } from "@/app/(admin)/admin/ai-management/_components/adminAiPromptsForm";

export default function AiManagementPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6 md:px-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Quản lý prompt AI
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cấu hình system prompt cho từng luồng AI trên nền tảng.
        </p>
      </div>
      <AdminAiPromptsForm />
    </div>
  );
}
