import { apiRequest } from "@/lib/api/http.client";

export type ReputationReasonCode =
  | "HUB_REPLY_HELPFUL"
  | "BLOG_QUALITY"
  | "BLOG_COMMENT_HELPFUL"
  | "MOD_ADJUSTMENT"
  | "ADMIN_BONUS"
  | "ADMIN_PENALTY";

export type AdminReputationLedgerRow = {
  id: string;
  userId: string;
  delta: number;
  reason: ReputationReasonCode;
  refHubCommentId: string | null;
  refBlogPostId: string | null;
  refBlogCommentId: string | null;
  createdAt: string;
  username: string | null;
  email: string;
};

export async function adminReputationLedger(params: {
  page?: number;
  pageSize?: number;
  userId?: string;
}) {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page ?? 1));
  sp.set("pageSize", String(params.pageSize ?? 20));
  if (params.userId?.trim()) sp.set("userId", params.userId.trim());
  return apiRequest<{
    items: AdminReputationLedgerRow[];
    total: number;
    page: number;
    pageSize: number;
  }>(`/api/v1/admin/reputation/ledger?${sp.toString()}`);
}

export async function adminReputationAdjust(body: {
  userId: string;
  delta: number;
  reason: ReputationReasonCode;
  refHubCommentId?: string | null;
  refBlogPostId?: string | null;
  refBlogCommentId?: string | null;
}) {
  return apiRequest<{ score: number }>("/api/v1/admin/reputation/adjust", {
    method: "POST",
    body,
  });
}
