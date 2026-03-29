import { apiRequest } from "@/lib/api/http.client";

export type AdminStats = {
  usersTotal: number;
  lawyerVerificationsPending: number;
  reportsOpen: number;
  hubPostsTotal: number;
  hubCommentsTotal: number;
  blogPostsPublished: number;
  assistantMessagesTotal: number;
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

export type AdminReportRow = {
  id: string;
  reporterId: string;
  targetType: string;
  targetId: string;
  reason: string;
  status: string;
  handledByUserId: string | null;
  createdAt: string;
  updatedAt: string;
  reporter: {
    id: string;
    email: string;
    username: string | null;
    displayName: string | null;
  };
  handledBy: {
    id: string;
    email: string;
    username: string | null;
  } | null;
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

export type AdminLegalSourceRow = {
  id: string;
  title: string;
  sourceUrl: string | null;
  jurisdiction: string | null;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function adminStats() {
  return apiRequest<{ stats: AdminStats }>("/api/v1/admin/stats");
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
  return apiRequest<{ user: AdminUserRow }>(`/api/v1/admin/users/${encodeURIComponent(userId)}`, {
    method: "PATCH",
    body: { role },
  });
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

export async function adminReportsList(params: {
  page?: number;
  pageSize?: number;
  status?: string;
}) {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page ?? 1));
  sp.set("pageSize", String(params.pageSize ?? 20));
  if (params.status) sp.set("status", params.status);
  return apiRequest<{
    items: AdminReportRow[];
    total: number;
    page: number;
    pageSize: number;
  }>(`/api/v1/admin/reports?${sp.toString()}`);
}

export async function adminPatchReport(
  id: string,
  body: { status: "ACTIONED" | "DISMISSED" },
) {
  return apiRequest<{ report: unknown }>(
    `/api/v1/admin/reports/${encodeURIComponent(id)}`,
    { method: "PATCH", body },
  );
}

export async function adminLeaderboard(params: { limit?: number; offset?: number }) {
  const sp = new URLSearchParams();
  sp.set("limit", String(params.limit ?? 100));
  sp.set("offset", String(params.offset ?? 0));
  return apiRequest<{
    items: AdminLeaderboardRow[];
    total: number;
  }>(`/api/v1/admin/leaderboard?${sp.toString()}`);
}

export async function adminLegalSourcesList(params: {
  page?: number;
  pageSize?: number;
  q?: string;
}) {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page ?? 1));
  sp.set("pageSize", String(params.pageSize ?? 20));
  if (params.q?.trim()) sp.set("q", params.q.trim());
  return apiRequest<{
    items: AdminLegalSourceRow[];
    total: number;
    page: number;
    pageSize: number;
  }>(`/api/v1/admin/legal-sources?${sp.toString()}`);
}

export async function adminCreateLegalSource(body: {
  title: string;
  sourceUrl?: string | null;
  jurisdiction?: string | null;
  effectiveFrom?: string | null;
  effectiveTo?: string | null;
}) {
  return apiRequest<{ source: AdminLegalSourceRow }>(
    "/api/v1/admin/legal-sources",
    { method: "POST", body },
  );
}

export async function adminPatchLegalSource(
  id: string,
  body: {
    title?: string;
    sourceUrl?: string | null;
    jurisdiction?: string | null;
    effectiveFrom?: string | null;
    effectiveTo?: string | null;
  },
) {
  return apiRequest<{ source: AdminLegalSourceRow }>(
    `/api/v1/admin/legal-sources/${encodeURIComponent(id)}`,
    { method: "PATCH", body },
  );
}

export async function adminDeleteLegalSource(id: string) {
  return apiRequest<{ ok: boolean }>(
    `/api/v1/admin/legal-sources/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );
}
