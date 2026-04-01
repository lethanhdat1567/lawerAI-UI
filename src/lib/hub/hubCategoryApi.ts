import { apiRequest } from "@/lib/api/http.client";
import type { HubCategoryUI } from "@/lib/hub/types";

export interface HubCategoryUpsertInput {
  name: string;
  slug: string;
  sortOrder?: number;
}

export async function hubPublicCategories() {
  return apiRequest<{ categories: HubCategoryUI[] }>(
    "/api/v1/hub/categories",
    { skipRefreshRetry: true },
  );
}

export async function hubAdminCreateCategory(body: HubCategoryUpsertInput) {
  return apiRequest<{ category: HubCategoryUI }>("/api/v1/admin/hub/categories", {
    method: "POST",
    body,
  });
}

export async function hubAdminPatchCategory(
  id: string,
  body: Partial<HubCategoryUpsertInput>,
) {
  return apiRequest<{ category: HubCategoryUI }>(
    `/api/v1/admin/hub/categories/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body,
    },
  );
}

export async function hubAdminDeleteCategory(id: string) {
  return apiRequest<{ ok: boolean }>(
    `/api/v1/admin/hub/categories/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    },
  );
}
