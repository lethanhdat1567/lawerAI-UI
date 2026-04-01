import { ApiError } from "@/lib/api/errors";
import { getApiBaseUrl } from "@/lib/api/config";
import { apiRequest } from "@/lib/api/http.client";
import type { ApiFailure } from "@/lib/api/types";
import { clearSessionCookies } from "@/lib/session/persistSession";
import type {
  ChatAiSession,
  ChatAiSessionDetail,
  ChatAiSessionQuery,
  CreateChatSessionBody,
  DeleteChatSessionResult,
  SendChatMessageBody,
  UpdateChatSessionTitleBody,
} from "@/services/chat-ai/chatAiTypes";
import { useAuthStore } from "@/stores/auth-store";

let refreshMutex: Promise<boolean> | null = null;

export const chatAiService = {
  async getSessions(query?: ChatAiSessionQuery): Promise<ChatAiSession[]> {
    const params = new URLSearchParams();
    const trimmedSearch = query?.search?.trim();

    if (trimmedSearch) {
      params.set("search", trimmedSearch);
    }

    const path = params.size
      ? `/api/v1/chat-ai/sessions?${params.toString()}`
      : "/api/v1/chat-ai/sessions";

    return apiRequest<ChatAiSession[]>(path, {
      method: "GET",
    });
  },

  async getSessionDetail(sessionId: string): Promise<ChatAiSessionDetail> {
    const normalizedSessionId = requireNonEmptyValue(
      sessionId,
      "sessionId is required",
    );

    return apiRequest<ChatAiSessionDetail>(
      `/api/v1/chat-ai/sessions/${encodeURIComponent(normalizedSessionId)}`,
      {
        method: "GET",
      },
    );
  },

  async createSession(body?: CreateChatSessionBody): Promise<ChatAiSession> {
    const normalizedBody =
      body?.title === undefined
        ? body
        : { title: requireNonEmptyValue(body.title, "title is required") };

    return apiRequest<ChatAiSession>("/api/v1/chat-ai/sessions", {
      method: "POST",
      body: normalizedBody,
    });
  },

  async updateSessionTitle(
    sessionId: string,
    body: UpdateChatSessionTitleBody,
  ): Promise<ChatAiSession> {
    const normalizedSessionId = requireNonEmptyValue(
      sessionId,
      "sessionId is required",
    );
    const normalizedTitle = requireNonEmptyValue(
      body.title,
      "title is required",
    );

    return apiRequest<ChatAiSession>(
      `/api/v1/chat-ai/sessions/${encodeURIComponent(normalizedSessionId)}`,
      {
        method: "PATCH",
        body: { title: normalizedTitle },
      },
    );
  },

  async deleteSession(sessionId: string): Promise<DeleteChatSessionResult> {
    const normalizedSessionId = requireNonEmptyValue(
      sessionId,
      "sessionId is required",
    );

    return apiRequest<DeleteChatSessionResult>(
      `/api/v1/chat-ai/sessions/${encodeURIComponent(normalizedSessionId)}`,
      {
        method: "DELETE",
      },
    );
  },

  async sendMessage(body: SendChatMessageBody): Promise<Response> {
    const normalizedBody = {
      sessionId: requireNonEmptyValue(body.sessionId, "sessionId is required"),
      message: requireNonEmptyValue(body.message, "message is required"),
    };
    const url = `${getApiBaseUrl()}/api/v1/chat-ai`;
    const execute = () => runStreamRequest(url, normalizedBody);

    let response = await execute();

    if (response.status === 401 && typeof window !== "undefined") {
      const refreshed = await tryRefreshSession();

      if (refreshed) {
        response = await execute();
      } else {
        await logoutAndClear();
      }
    }

    if (!response.ok) {
      throw await createStreamError(response);
    }

    return response;
  },
};

async function runStreamRequest(
  url: string,
  body: SendChatMessageBody,
): Promise<Response> {
  const headers = new Headers({
    "Content-Type": "application/json",
  });
  const token = useAuthStore.getState().accessToken;

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

async function tryRefreshSession(): Promise<boolean> {
  if (!refreshMutex) {
    refreshMutex = runClientRefresh().finally(() => {
      refreshMutex = null;
    });
  }

  return refreshMutex;
}

async function runClientRefresh(): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      return false;
    }

    const session = (await response.json()) as {
      accessToken: string;
      accessTokenExpiresAt: string;
    };

    useAuthStore.getState().setSession({
      accessToken: session.accessToken,
      accessTokenExpiresAt: session.accessTokenExpiresAt,
      user: useAuthStore.getState().user,
    });

    return true;
  } catch {
    return false;
  }
}

async function logoutAndClear(): Promise<void> {
  useAuthStore.getState().clearSession();

  try {
    await clearSessionCookies();
  } catch {
    /* ignore */
  }
}

async function createStreamError(response: Response): Promise<ApiError> {
  const fallbackMessage = `Request failed (${response.status})`;
  const text = await response.text();

  if (!text) {
    return new ApiError(fallbackMessage, {
      status: response.status,
      code: "EMPTY_BODY",
    });
  }

  try {
    const parsed = JSON.parse(text) as ApiFailure | { message?: string };

    if ("success" in parsed && parsed.success === false) {
      return new ApiError(parsed.error.message, {
        status: response.status,
        code: parsed.error.code,
        details: parsed.error.details,
      });
    }

    if ("message" in parsed && typeof parsed.message === "string") {
      return new ApiError(parsed.message, {
        status: response.status,
        code: "HTTP_ERROR",
      });
    }
  } catch {
    return new ApiError(fallbackMessage, {
      status: response.status,
      code: "INVALID_JSON",
    });
  }

  return new ApiError(fallbackMessage, {
    status: response.status,
    code: "HTTP_ERROR",
  });
}

function requireNonEmptyValue(value: string, message: string): string {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    throw new ApiError(message, {
      status: 400,
      code: "INVALID_INPUT",
    });
  }

  return normalizedValue;
}
