import { apiRequest } from "@/lib/api/http.client";
import type { BlogTag } from "@/lib/blog/types";

export interface BlogTagUpsertInput {
  name: string;
  slug?: string;
}

export async function blogPublicTags() {
  return apiRequest<{ tags: BlogTag[] }>("/api/v1/blog/tags", {
    skipRefreshRetry: true,
  });
}

export async function blogAdminCreateTag(body: BlogTagUpsertInput) {
  return apiRequest<{ tag: BlogTag }>("/api/v1/admin/blog/tags", {
    method: "POST",
    body,
  });
}

export async function blogAdminPatchTag(
  id: string,
  body: Partial<BlogTagUpsertInput>,
) {
  return apiRequest<{ tag: BlogTag }>(
    `/api/v1/admin/blog/tags/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body,
    },
  );
}

export async function blogAdminDeleteTag(id: string) {
  return apiRequest<{ ok: boolean }>(
    `/api/v1/admin/blog/tags/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    },
  );
}
