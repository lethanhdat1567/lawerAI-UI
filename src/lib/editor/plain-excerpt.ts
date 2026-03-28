/** Strip tags and condense whitespace for preview text from stored HTML. */
export function htmlToPlainText(html: string): string {
  if (!html.trim()) return ""
  const withoutTags = html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
  return withoutTags.replace(/\s+/g, " ").trim()
}

/** Short plain excerpt for cards / previews (default max 160 chars). */
export function plainExcerptFromHtml(
  html: string,
  maxLen = 160,
): string {
  const flat = htmlToPlainText(html)
  if (!flat) return "…"
  if (flat.length <= maxLen) return flat
  return `${flat.slice(0, maxLen).trim()}…`
}

/** Block / media tags that count as content even when there is no plain text. */
const HAS_NON_TEXT_BODY_HTML = /<(img|video|iframe|audio|embed|object|picture|hr)\b/i

/**
 * True when editor HTML has nothing meaningful to show (e.g. empty `<p></p>`).
 * Image-only (or other media-only) posts are not empty — plain text strips `<img>`.
 */
export function isHtmlContentEffectivelyEmpty(html: string): boolean {
  const trimmed = html.trim()
  if (!trimmed) return true
  if (HAS_NON_TEXT_BODY_HTML.test(trimmed)) return false
  return htmlToPlainText(html).trim().length === 0
}
