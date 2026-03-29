export function userProfilePath(username: string): string {
  const u = username.trim();
  return `/users/${encodeURIComponent(u)}`;
}
