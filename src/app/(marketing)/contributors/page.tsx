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

  return (
    <ContributorsPageLayout
      title="Những gương mặt nổi bật"
      description="Nơi tôn vinh các thành viên có đóng góp xuất sắc cho Hub và Blog. Chúng tôi đề cao sự minh bạch trong đánh giá và tôn trọng quyền riêng tư của mỗi cá nhân."
    >
      <ContributorsLeaderboard rows={rows} fetchFailed={fetchFailed} />
      <ContributorsScoringExplainer />
    </ContributorsPageLayout>
  );
}
