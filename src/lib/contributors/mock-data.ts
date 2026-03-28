// src/lib/contributors/mock-data.ts — demo leaderboard; no API

import type { ContributorRow } from "./types";

/** Minh họa kỳ snapshot (LeaderboardSnapshot.periodStart / periodEnd). */
export const mockLeaderboardPeriod = {
  periodStart: "2026-01-01T00:00:00.000Z",
  periodEnd: "2026-03-28T23:59:59.999Z",
} as const;

const rawRows: Omit<ContributorRow, "rank">[] = [
  {
    userId: "usr_001",
    username: "an.nguyen",
    displayName: "An Nguyễn",
    avatarUrl: null,
    score: 2840,
    contributorOptOut: false,
    role: "VERIFIED_LAWYER",
  },
  {
    userId: "usr_002",
    username: "legaleditor",
    displayName: "Minh — biên tập pháp lý",
    avatarUrl: null,
    score: 2510,
    contributorOptOut: false,
    role: "VERIFIED_LAWYER",
  },
  {
    userId: "usr_003",
    username: "private_user",
    displayName: "Không hiển thị",
    avatarUrl: null,
    score: 2180,
    contributorOptOut: true,
    role: null,
  },
  {
    userId: "usr_004",
    username: "hub_helper_42",
    displayName: "Hub Helper",
    avatarUrl: null,
    score: 1840,
    contributorOptOut: false,
    role: null,
  },
  {
    userId: "usr_005",
    username: "blog_author_hcm",
    displayName: "Tác giả HCM",
    avatarUrl: null,
    score: 1620,
    contributorOptOut: false,
    role: "VERIFIED_LAWYER",
  },
  {
    userId: "usr_006",
    username: "quiet_contributor",
    displayName: null,
    avatarUrl: null,
    score: 945,
    contributorOptOut: true,
    role: null,
  },
  {
    userId: "usr_007",
    username: "student_law",
    displayName: "Sinh viên luật K",
    avatarUrl: null,
    score: 720,
    contributorOptOut: false,
    role: null,
  },
  {
    userId: "usr_008",
    username: "mod_alumni",
    displayName: "Cựu mod",
    avatarUrl: null,
    score: 510,
    contributorOptOut: false,
    role: null,
  },
  {
    userId: "usr_009",
    username: "new_voice",
    displayName: "Giọng mới",
    avatarUrl: null,
    score: 280,
    contributorOptOut: false,
    role: null,
  },
  {
    userId: "usr_010",
    username: "beta_tester",
    displayName: "Beta",
    avatarUrl: null,
    score: 95,
    contributorOptOut: false,
    role: null,
  },
];

/**
 * Bảng minh họa theo tổng điểm (UserContributionScore.score), giảm dần.
 * Người có contributorOptOut chỉ hiển thị công khai là thành viên ẩn danh.
 */
export function getContributorsLeaderboard(): ContributorRow[] {
  const sorted = [...rawRows].sort((a, b) => b.score - a.score);
  return sorted.map((row, index) => ({
    ...row,
    rank: index + 1,
  }));
}
