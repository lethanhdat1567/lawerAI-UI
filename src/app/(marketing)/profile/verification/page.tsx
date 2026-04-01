import type { Metadata } from "next";

import { LawyerVerificationPanel } from "@/app/(marketing)/profile/verification/_components/lawyerVerificationPanel";
import { PageShell } from "@/components/layout/pageShell";

export const metadata: Metadata = {
  title: "Xác minh luật sư",
};

export default function LawyerVerificationPage() {
  return (
    <PageShell
      title="Xác minh luật sư"
      description="Gửi và theo dõi hồ sơ xác minh tư cách luật sư của bạn."
    >
      <LawyerVerificationPanel />
    </PageShell>
  );
}
