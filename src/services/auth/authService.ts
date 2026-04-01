import { apiRequest } from "@/lib/api/http.client";

import type {
  AuthTokensResponse,
  PublicUser,
  RegisterResponse,
  TokenPair,
  VerifyEmailResult,
} from "@/services/auth/authTypes";

export type LoginBody = { email: string; password: string };

export type RegisterBody = {
  email: string;
  password: string;
  username: string;
};

export type RefreshBody = { refreshToken: string };

export type ForgotBody = { email: string };

export type ResetBody = {
  email: string;
  code: string;
  newPassword: string;
};

export type FirebaseBody = { idToken: string };

export const authService = {
  async login(body: LoginBody): Promise<AuthTokensResponse> {
    return apiRequest<AuthTokensResponse>("/api/v1/auth/login", {
      method: "POST",
      body,
    });
  },

  async register(body: RegisterBody): Promise<RegisterResponse> {
    return apiRequest<RegisterResponse>("/api/v1/auth/register", {
      method: "POST",
      body,
    });
  },

  async refresh(body: RefreshBody): Promise<TokenPair> {
    return apiRequest<TokenPair>("/api/v1/auth/refresh", {
      method: "POST",
      body,
      skipRefreshRetry: true,
    });
  },

  async logout(refreshToken: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>("/api/v1/auth/logout", {
      method: "POST",
      body: { refreshToken },
      skipRefreshRetry: true,
    });
  },

  async verifyEmail(token: string): Promise<VerifyEmailResult> {
    const q = new URLSearchParams({ token });
    return apiRequest<VerifyEmailResult>(
      `/api/v1/auth/verify-email?${q.toString()}`,
      { method: "GET", skipRefreshRetry: true },
    );
  },

  async forgotPassword(body: ForgotBody): Promise<{ message: string }> {
    return apiRequest<{ message: string }>("/api/v1/auth/forgot-password", {
      method: "POST",
      body,
      skipRefreshRetry: true,
    });
  },

  async resetPassword(body: ResetBody): Promise<{ message: string }> {
    return apiRequest<{ message: string }>("/api/v1/auth/reset-password", {
      method: "POST",
      body,
      skipRefreshRetry: true,
    });
  },

  async firebaseSignIn(body: FirebaseBody): Promise<AuthTokensResponse> {
    return apiRequest<AuthTokensResponse>("/api/v1/auth/firebase", {
      method: "POST",
      body,
    });
  },

  async me(): Promise<{ user: PublicUser | null }> {
    return apiRequest<{ user: PublicUser | null }>("/api/v1/auth/me", {
      method: "GET",
    });
  },

  async uploadImage(file: File): Promise<{ url: string }> {
    const form = new FormData();
    form.append("file", file);
    return apiRequest<{ url: string }>("/api/v1/upload/image", {
      method: "POST",
      body: form,
    });
  },

  async updateProfile(body: {
    username?: string;
    displayName?: string | null;
    bio?: string | null;
    avatarUrl?: string | null;
    contributorOptOut?: boolean;
  }): Promise<{ user: PublicUser }> {
    return apiRequest<{ user: PublicUser }>("/api/v1/auth/profile", {
      method: "PATCH",
      body,
    });
  },
};
