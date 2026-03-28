const REFRESH_MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7d, khớp default BE

export function baseCookieOptions() {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}

export function accessTokenMaxAgeSec(iso: string): number {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.max(60, Math.ceil(ms / 1000));
}

export function refreshCookieMaxAgeSec(): number {
  return REFRESH_MAX_AGE_SEC;
}
