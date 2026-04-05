import { apiRequest } from "@/lib/api/http.client";

import type { BlogIdea, IdeaStatus } from "./types";

export type BlogIdeaListParams = {
  status?: "all" | IdeaStatus;
};

export async function blogIdeaList(params?: BlogIdeaListParams) {
  const q = new URLSearchParams();
  if (params?.status && params.status !== "all") {
    q.set("status", params.status);
  }
  const suffix = q.toString() ? `?${q.toString()}` : "";
  return apiRequest<{ ideas: BlogIdea[] }>(`/api/v1/blog-idea${suffix}`, {
    method: "GET",
  });
}

export async function blogIdeaCreate(body: { quantity: number }) {
  return apiRequest<string>("/api/v1/blog-idea", {
    method: "POST",
    body,
  });
}

export async function blogIdeaDelete(id: number) {
  return apiRequest<BlogIdea>(`/api/v1/blog-idea/${encodeURIComponent(String(id))}`, {
    method: "DELETE",
  });
}
