// src/app/(assistant)/assistant/page.tsx
import dynamic from "next/dynamic";
import type { Metadata } from "next";

const AssistantAppLazy = dynamic(
  () =>
    import("@/app/(assistant)/assistant/_components/assistantApp").then((m) => ({
      default: m.AssistantApp,
    })),
  {
    loading: () => (
      <div className="flex h-dvh items-center justify-center text-sm text-muted-foreground">
        Đang tải trợ lý…
      </div>
    ),
  },
);

export const metadata: Metadata = {
  title: "Tra cứu",
  description:
    "Trợ lý tra cứu pháp lý — mô tả tình huống để nhận gợi ý điều luật liên quan (demo UI).",
};

export default function AssistantPage() {
  return <AssistantAppLazy />;
}
