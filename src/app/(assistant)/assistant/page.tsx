// src/app/(assistant)/assistant/page.tsx
import { AssistantApp } from "@/components/assistant/assistant-app";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tra cứu",
  description:
    "Trợ lý tra cứu pháp lý — mô tả tình huống để nhận gợi ý điều luật liên quan (demo UI).",
};

export default function AssistantPage() {
  return <AssistantApp />;
}
