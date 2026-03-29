export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
