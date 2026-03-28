export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!raw) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not set (e.g. http://localhost:8000)",
    );
  }
  return raw.replace(/\/$/, "");
}
