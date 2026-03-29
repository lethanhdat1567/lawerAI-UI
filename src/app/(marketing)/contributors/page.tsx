// src/app/(marketing)/contributors/page.tsx
import type { Metadata } from "next";

import { ContributorsLeaderboard } from "@/app/(marketing)/contributors/_components/contributorsLeaderboard";
import { ContributorsPageLayout } from "@/app/(marketing)/contributors/_components/contributorsPageLayout";
import { ContributorsScoringExplainer } from "@/app/(marketing)/contributors/_components/contributorsScoringExplainer";
import { fetchContributorsLeaderboard } from "@/lib/contributors/fetchLeaderboard";

export const metadata: Metadata = {
  title: "Tôn vinh đóng góp",
  description:
    "Bảng xếp hạng đóng góp Hub và Blog — minh bạch, tôn trọng quyền ẩn danh.",
};

export default async function ContributorsPage() {
  const data = await fetchContributorsLeaderboard({ limit: 50 });
  const fetchFailed = data === null;
  const rows = data?.items ?? [];
  const period = data?.period ?? "all_time";

  return (
    <ContributorsPageLayout
      title="Tôn vinh đóng góp"
      description="Những cá nhân đóng góp nổi bật cho Hub và blog — tiêu chí minh bạch, tôn trọng quyền ẩn danh trên bảng xếp hạng."
    >
      <ContributorsScoringExplainer />
      <ContributorsLeaderboard
        rows={rows}
        period={period}
        fetchFailed={fetchFailed}
      />
    </ContributorsPageLayout>
  );
}
