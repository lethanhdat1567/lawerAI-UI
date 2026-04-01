// src/lib/contributors/types.ts — contract aligned with UserContributionScore + Profile (FE mock)

/** Demo-only badge; maps loosely to LawyerVerification / verified authors. */
export type ContributorDemoRole = "VERIFIED_LAWYER" | null;

export interface ContributorRow {
  rank: number;
  userId: string;
  /** Rỗng khi contributorOptOut (API ẩn PII). */
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  score: number;
  contributorOptOut: boolean;
  role?: ContributorDemoRole;
  tierCode?: string;
  tierLabelVi?: string;
}

export type ReputationReasonKey =
  | "HUB_REPLY_HELPFUL"
  | "BLOG_QUALITY"
  | "BLOG_COMMENT_HELPFUL"
  | "BLOG_POST_LIKED"
  | "MOD_ADJUSTMENT";

export interface ReputationReasonExplainer {
  code: ReputationReasonKey;
  title: string;
  description: string;
}
