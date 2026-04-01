export type PublicProfile = {
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  contributorOptOut: boolean;
};

export type PublicUser = {
  id: string;
  email: string;
  role: string;
  emailVerifiedAt: string | null;
  username: string | null;
  profile: PublicProfile;
};

export type AuthTokensResponse = {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
};

export type TokenPair = Pick<
  AuthTokensResponse,
  "accessToken" | "refreshToken" | "accessTokenExpiresAt"
>;

export type RegisterResponse = {
  user: PublicUser;
  message: string;
};

export type VerifyEmailResult =
  | (AuthTokensResponse & { verified: true; message: string })
  | { verified: true; message: string };

export function isVerifyEmailWithTokens(
  r: VerifyEmailResult,
): r is AuthTokensResponse & { verified: true; message: string } {
  return "accessToken" in r && Boolean(r.accessToken);
}
