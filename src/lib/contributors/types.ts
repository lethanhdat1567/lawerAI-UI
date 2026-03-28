// src/lib/contributors/types.ts — contract aligned with UserContributionScore + Profile (FE mock)

/** Demo-only badge; maps loosely to LawyerVerification / verified authors. */
export type ContributorDemoRole = "VERIFIED_LAWYER" | null;

export interface ContributorRow {
  rank: number;
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  score: number;
  contributorOptOut: boolean;
  role?: ContributorDemoRole;
}

export type ReputationReasonKey =
  | "HUB_REPLY_HELPFUL"
  | "BLOG_QUALITY"
  | "MOD_ADJUSTMENT"
  | "ADMIN_BONUS"
  | "ADMIN_PENALTY";

export interface ReputationReasonExplainer {
  code: ReputationReasonKey;
  title: string;
  description: string;
}
