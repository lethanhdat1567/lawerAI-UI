import { apiRequest } from "@/lib/api/http.client";

export type AdminStats = {
  usersTotal: number;
  lawyerVerificationsPending: number;
  hubPostsTotal: number;
  hubCommentsTotal: number;
  blogPostsPublished: number;
  assistantMessagesTotal: number;
};

export type AdminDashboardRange = "7d" | "30d" | "3m";

export type AdminDashboardGranularity = "day";

export type AdminDashboardSnapshot = {
  usersTotal: number;
  usersNew7d: number;
  usersEmailVerifiedTotal: number;
  lawyerVerificationsPending: number;
  lawyerVerificationsApproved: number;
  blogPostsPublished: number;
  blogPostsPublishedUnverified: number;
  hubPostsTotal: number;
  hubCommentsTotal: number;
  contributorsActiveTotal: number;
  chatMessagesTotal: number;
  chatSessionsTotal: number;
  legacyAssistantMessagesTotal: number;
};

export type AdminDashboardQueues = {
  lawyerVerificationsPending: number;
  blogPostsPublishedUnverified: number;
  usersNew7d: number;
};

export type AdminDashboardTimeseriesPoint = {
  bucketStart: string;
  usersNew: number;
  hubPosts: number;
  hubComments: number;
  blogPublished: number;
  chatMessages: number;
};

export type AdminDashboardData = {
  range: AdminDashboardRange;
  granularity: AdminDashboardGranularity;
  metricSources: {
    legacyStatsChatTotal: "assistant_messages";
    dashboardChatTotal: "chat_messages";
    chartChatActivity: "chat_messages";
  };
  snapshot: AdminDashboardSnapshot;
  queues: AdminDashboardQueues;
  timeseries: AdminDashboardTimeseriesPoint[];
};

export type AdminStatsResponse = {
  stats: AdminStats;
  dashboard?: AdminDashboardData;
};

export type AdminUserRow = {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  emailVerifiedAt: string | null;
  username: string | null;
  displayName: string | null;
};

export type UserRoleCode = "USER" | "VERIFIED_LAWYER" | "ADMIN";

export type AdminLawyerVerificationRow = {
  id: string;
  userId: string;
  status: string;
  jurisdiction: string | null;
  barNumber: string | null;
  firmName: string | null;
  evidenceJson: unknown;
  note: string | null;
  reviewedAt: string | null;
  reviewedByUserId: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    role: string;
    username: string | null;
    displayName: string | null;
  };
  reviewedBy: { email: string; username: string | null } | null;
};

export type AdminLeaderboardRow = {
  rank: number;
  userId: string;
  email: string;
  score: number;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  userRole: string;
  tierCode: string;
  tierLabelVi: string;
};

export type PipelineTaskType =
  | "HTML_CLEANING"
  | "CLASSIFICATION"
  | "METADATA_EXTRACT"
  | "EMBEDDING";

export type AdminCrawlTaskOverride = {
  modelName?: string;
  promptName?: string;
  promptContent?: string;
};

export type AdminCrawlDraftRequest = {
  page_url: string;
};

export type AdminCrawlDraftMetadata = {
  chapter?: string | null;
  article?: string | null;
  tags: string[];
  summary?: string | null;
};

export type AdminCrawlLogRef = {
  id: string;
  url: string;
  status: "SUCCESS" | "FAILED" | "NO_CHANGE";
  startedAt?: string | null;
  finishedAt?: string | null;
};

export type AdminCrawlTaskExecutionConfig = {
  taskType: PipelineTaskType;
  modelName: string;
  promptId?: string;
  promptName: string;
  promptContent: string;
  isActive: boolean;
};

export type AdminCrawlApproveRequest = {
  crawlLogId: string;
  url: string;
  markdownDraft: string;
  category?: string | null;
  metadata: AdminCrawlDraftMetadata;
  desiredStatus?: "SUCCESS" | "FAILED";
};

export type AdminCrawlApproveResponse = {
  approved: boolean;
  crawlLog: AdminCrawlLogRef;
  syncDryRun: {
    target: "supabase";
    note: string;
    preview: {
      url: string;
      category: string | null;
      markdownLength: number;
      tagsCount: number;
      processedAt: string;
    };
  };
};

export type AdminPipelineTaskConfig = {
  taskType: PipelineTaskType;
  modelName: string;
  promptId?: string;
  promptName: string;
  promptContent: string;
  isActive: boolean;
};

export type AdminPipelineConfigResponse = {
  pipelineConfig: {
    byTask: Partial<Record<PipelineTaskType, AdminPipelineTaskConfig>>;
  };
};

export async function adminStats(params?: {
  range?: AdminDashboardRange;
  granularity?: AdminDashboardGranularity;
}) {
  const sp = new URLSearchParams();
  if (params?.range) sp.set("range", params.range);
  if (params?.granularity) sp.set("granularity", params.granularity);
  const query = sp.toString();
  return apiRequest<AdminStatsResponse>(
    query ? `/api/v1/admin/stats?${query}` : "/api/v1/admin/stats",
  );
}

export async function adminUsersList(params: {
  page?: number;
  pageSize?: number;
  q?: string;
  role?: UserRoleCode;
}) {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page ?? 1));
  sp.set("pageSize", String(params.pageSize ?? 20));
  if (params.q?.trim()) sp.set("q", params.q.trim());
  if (params.role) sp.set("role", params.role);
  return apiRequest<{
    items: AdminUserRow[];
    total: number;
    page: number;
    pageSize: number;
  }>(`/api/v1/admin/users?${sp.toString()}`);
}

export async function adminPatchUser(userId: string, role: UserRoleCode) {
  return apiRequest<{ user: AdminUserRow }>(
    `/api/v1/admin/users/${encodeURIComponent(userId)}`,
    {
      method: "PATCH",
      body: { role },
    },
  );
}

export async function adminLawyerVerificationsList(params: {
  page?: number;
  pageSize?: number;
  status?: string;
}) {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page ?? 1));
  sp.set("pageSize", String(params.pageSize ?? 20));
  if (params.status) sp.set("status", params.status);
  return apiRequest<{
    items: AdminLawyerVerificationRow[];
    total: number;
    page: number;
    pageSize: number;
  }>(`/api/v1/admin/lawyer-verifications?${sp.toString()}`);
}

export async function adminPatchLawyerVerification(
  id: string,
  body: { status: "APPROVED" | "REJECTED" | "REVOKED"; note?: string },
) {
  return apiRequest<{ verification: unknown }>(
    `/api/v1/admin/lawyer-verifications/${encodeURIComponent(id)}`,
    { method: "PATCH", body },
  );
}

export async function adminLeaderboard(params: {
  limit?: number;
  offset?: number;
}) {
  const sp = new URLSearchParams();
  sp.set("limit", String(params.limit ?? 100));
  sp.set("offset", String(params.offset ?? 0));
  return apiRequest<{
    items: AdminLeaderboardRow[];
    total: number;
  }>(`/api/v1/admin/leaderboard?${sp.toString()}`);
}

export async function adminCrawlDraft(body: AdminCrawlDraftRequest) {
  return apiRequest("/api/v1/admin/crawl", {
    method: "POST",
    body,
  });
}
