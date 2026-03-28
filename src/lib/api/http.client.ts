import { getApiBaseUrl } from "@/lib/api/config";
import { ApiError } from "@/lib/api/errors";
import type { ApiFailure, ApiSuccess } from "@/lib/api/types";
import { clearSessionCookies } from "@/lib/session/persistSession";
import { useAuthStore } from "@/stores/auth-store";

export type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  /** Bỏ qua refresh+retry (dùng cho request không cần phiên). */
  skipRefreshRetry?: boolean;
};

let refreshMutex: Promise<boolean> | null = null;

async function runClientRefresh(): Promise<boolean> {
  try {
    const r = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
    if (!r.ok) return false;
    const j = (await r.json()) as {
      accessToken: string;
      accessTokenExpiresAt: string;
    };
    useAuthStore.getState().setSession({
      accessToken: j.accessToken,
      accessTokenExpiresAt: j.accessTokenExpiresAt,
    });
    return true;
  } catch {
    return false;
  }
}

async function tryRefreshSession(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (!refreshMutex) {
    refreshMutex = runClientRefresh().finally(() => {
      refreshMutex = null;
    });
  }
  return refreshMutex;
}

async function logoutAndClear(): Promise<void> {
  useAuthStore.getState().clearSession();
  try {
    await clearSessionCookies();
  } catch {
    /* ignore */
  }
}

async function parseJsonResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) {
    throw new ApiError("Empty response", {
      status: res.status,
      code: "EMPTY_BODY",
    });
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text) as ApiSuccess<T> | ApiFailure;
  } catch {
    throw new ApiError("Invalid JSON", {
      status: res.status,
      code: "INVALID_JSON",
    });
  }
  const envelope = parsed as ApiSuccess<T> | ApiFailure;
  if (!envelope.success) {
    const e = envelope.error;
    throw new ApiError(e.message, {
      status: res.status,
      code: e.code,
      details: e.details,
    });
  }
  return envelope.data;
}

const AUTH_PATH_PREFIX = "/api/v1/auth";

function shouldAttemptRefresh(path: string, status: number): boolean {
  if (status !== 401) return false;
  if (path.includes(`${AUTH_PATH_PREFIX}/refresh`)) return false;
  if (path.includes(`${AUTH_PATH_PREFIX}/login`)) return false;
  if (path.includes(`${AUTH_PATH_PREFIX}/register`)) return false;
  if (path.includes(`${AUTH_PATH_PREFIX}/forgot-password`)) return false;
  return true;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    body,
    skipRefreshRetry = false,
    headers: initHeaders,
    ...init
  } = options;

  const url = `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(initHeaders);

  if (body !== undefined && body !== null && !(body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const token = useAuthStore.getState().accessToken;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const serializedBody =
    body === undefined || body === null
      ? undefined
      : body instanceof FormData
        ? body
        : JSON.stringify(body);

  const exec = () =>
    fetch(url, {
      ...init,
      headers,
      body: serializedBody,
    });

  let res = await exec();

  if (
    shouldAttemptRefresh(path, res.status) &&
    !skipRefreshRetry &&
    typeof window !== "undefined"
  ) {
    const ok = await tryRefreshSession();
    if (ok) {
      const h2 = new Headers(initHeaders);
      if (
        body !== undefined &&
        body !== null &&
        !(body instanceof FormData)
      ) {
        h2.set("Content-Type", "application/json");
      }
      const t2 = useAuthStore.getState().accessToken;
      if (t2) h2.set("Authorization", `Bearer ${t2}`);
      res = await fetch(url, {
        ...init,
        headers: h2,
        body: serializedBody,
      });
    } else {
      await logoutAndClear();
    }
  }

  if (!res.ok) {
    try {
      await parseJsonResponse<T>(res);
    } catch (e) {
      if (e instanceof ApiError) throw e;
    }
    throw new ApiError(`Request failed (${res.status})`, {
      status: res.status,
      code: "HTTP_ERROR",
    });
  }

  return parseJsonResponse<T>(res);
}
