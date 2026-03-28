import { getApiBaseUrl } from "@/lib/api/config";

/**
 * URL ảnh public: `http(s)://...` giữ nguyên; path upload (`/upload/...`, `/uploads/...`)
 * nối với `NEXT_PUBLIC_API_BASE_URL`. Path khác trả về `null`.
 */
export function resolvePublicImageUrl(
  src: string | null | undefined,
): string | null {
  if (!src?.trim()) return null;
  const s = src.trim();
  if (/^https?:\/\//i.test(s)) return s;

  let path = s.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  if (!path.startsWith("/upload")) {
    return null;
  }

  const base = getApiBaseUrl().replace(/\/$/, "");
  return `${base}${path}`;
}
