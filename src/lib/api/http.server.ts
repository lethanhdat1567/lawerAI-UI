import "server-only";

import { getApiBaseUrl } from "@/lib/api/config";
import { ApiError } from "@/lib/api/errors";
import type { ApiFailure, ApiSuccess } from "@/lib/api/types";
import { COOKIE_ACCESS } from "@/lib/auth/cookieNames";
import { cookies } from "next/headers";

/**
 * Gọi BE từ Server Action / Route Handler với Bearer lấy từ cookie access.
 * Không tự refresh — nếu 401, client cần gọi `/api/auth/refresh` trước.
 */
export async function apiRequestServer<T>(
  path: string,
  init: { method?: string; body?: unknown } = {},
): Promise<T> {
  const jar = await cookies();
  const access = jar.get(COOKIE_ACCESS)?.value;

  const url = `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  if (access) {
    headers.set("Authorization", `Bearer ${access}`);
  }

  const res = await fetch(url, {
    method: init.method ?? "GET",
    headers,
    body:
      init.body !== undefined ? JSON.stringify(init.body) : undefined,
  });

  const text = await res.text();
  if (!text) {
    throw new ApiError("Empty response", {
      status: res.status,
      code: "EMPTY_BODY",
    });
  }

  let parsed: ApiSuccess<T> | ApiFailure;
  try {
    parsed = JSON.parse(text) as ApiSuccess<T> | ApiFailure;
  } catch {
    throw new ApiError("Invalid JSON", {
      status: res.status,
      code: "INVALID_JSON",
    });
  }

  if (!parsed.success) {
    throw new ApiError(parsed.error.message, {
      status: res.status,
      code: parsed.error.code,
      details: parsed.error.details,
    });
  }

  if (!res.ok) {
    throw new ApiError(`HTTP ${res.status}`, {
      status: res.status,
      code: "HTTP_ERROR",
    });
  }

  return parsed.data;
}
