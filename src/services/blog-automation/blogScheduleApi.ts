import { apiRequest } from "@/lib/api/http.client";

import type { ScheduleBlogSystem } from "./types";

export async function blogScheduleGet() {
  return apiRequest<{ schedule: ScheduleBlogSystem | null }>(
    "/api/v1/blog-schedule",
    { method: "GET" },
  );
}

export async function blogScheduleToggleStatus(id: string) {
  return apiRequest<{ isActive: boolean }>(
    `/api/v1/blog-schedule/status/${encodeURIComponent(id)}`,
    { method: "PATCH" },
  );
}

export async function blogScheduleUpdate(
  id: string,
  body: { model: string; prompt: string },
) {
  return apiRequest<ScheduleBlogSystem>(
    `/api/v1/blog-schedule/${encodeURIComponent(id)}`,
    { method: "PATCH", body },
  );
}
