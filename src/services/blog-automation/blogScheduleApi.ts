import { apiRequest } from "@/lib/api/http.client";

import type { ScheduleBlogSystem } from "./types";

type AiGatewayModelsResponse = {
  data?: Array<{ id?: string | null }>;
};

const AI_GATEWAY_MODELS_URL = "https://ai-gateway.vercel.sh/v1/models";

export async function blogScheduleGet() {
  return apiRequest<{ schedule: ScheduleBlogSystem | null }>(
    "/api/v1/blog-schedule",
    { method: "GET" },
  );
}

export async function blogScheduleListModels(): Promise<string[]> {
  const response = await fetch(AI_GATEWAY_MODELS_URL, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch models (${response.status})`);
  }

  const payload = (await response.json()) as AiGatewayModelsResponse;
  const models = (payload.data ?? [])
    .map((item) => item.id?.trim() ?? "")
    .filter(Boolean);

  return [...new Set(models)];
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
