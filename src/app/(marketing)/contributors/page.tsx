// src/app/(marketing)/contributors/page.tsx
import { ContributorsLeaderboard } from "@/app/(marketing)/contributors/_components/contributors-leaderboard";
import { ContributorsPageLayout } from "@/app/(marketing)/contributors/_components/contributors-page-layout";
import { ContributorsScoringExplainer } from "@/app/(marketing)/contributors/_components/contributors-scoring-explainer";
import { getContributorsLeaderboard } from "@/lib/contributors/mock-data";

export default function ContributorsPage() {
  const leaderboard = getContributorsLeaderboard();

  return (
    <ContributorsPageLayout
      title="Tôn vinh đóng góp"
      description="Những cá nhân đóng góp nổi bật cho Hub và blog — tiêu chí minh bạch, tôn trọng quyền không xếp hạng."
    >
      <ContributorsScoringExplainer />
      <ContributorsLeaderboard rows={leaderboard} />
    </ContributorsPageLayout>
  );
}
