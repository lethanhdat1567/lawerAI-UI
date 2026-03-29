import "server-only";

import { getApiBaseUrl } from "@/lib/api/config";
import type { ApiFailure, ApiSuccess } from "@/lib/api/types";

import type { ContributorRow } from "./types";

export type ContributorsLeaderboardPeriod = "all_time";

export type ContributorsLeaderboardApiItem = {
  rank: number;
  userId: string;
  score: number;
  contributorOptOut: boolean;
  tierCode: string;
  tierLabelVi: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  isVerifiedLawyer: boolean;
};

export type ContributorsLeaderboardPayload = {
  period: ContributorsLeaderboardPeriod;
  items: ContributorRow[];
};

export async function fetchContributorsLeaderboard(params?: {
  limit?: number;
}): Promise<ContributorsLeaderboardPayload | null> {
  const limit = params?.limit ?? 50;
  const url = `${getApiBaseUrl()}/api/v1/contributors/leaderboard?limit=${limit}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  const text = await res.text();
  if (!text || !res.ok) return null;

  let parsed: ApiSuccess<{
    period: ContributorsLeaderboardPeriod;
    items: ContributorsLeaderboardApiItem[];
  }> | ApiFailure;
  try {
    parsed = JSON.parse(text) as ApiSuccess<{
      period: ContributorsLeaderboardPeriod;
      items: ContributorsLeaderboardApiItem[];
    }> | ApiFailure;
  } catch {
    return null;
  }
  if (!parsed.success) return null;

  const items: ContributorRow[] = parsed.data.items.map((it) => ({
    rank: it.rank,
    userId: it.userId,
    username: it.username ?? "",
    displayName: it.displayName,
    avatarUrl: it.avatarUrl,
    score: it.score,
    contributorOptOut: it.contributorOptOut,
    role: it.isVerifiedLawyer ? "VERIFIED_LAWYER" : null,
    tierCode: it.tierCode,
    tierLabelVi: it.tierLabelVi,
  }));

  return { period: parsed.data.period, items };
}
