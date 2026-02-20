/**
 * Generate a safe, URL-friendly article ID from article data
 * Uses timestamp + source + index for uniqueness and URL safety
 */
export function createArticleId(
  article: {
    datetime?: number;
    url?: string;
    source?: string;
    headline?: string;
  },
  index: number,
): string {
  const base = `${article.datetime ?? 0}-${article.source ?? ""}-${index}`;
  // Remove non-ASCII characters for URL safety
  const safe = base
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase()
    .slice(0, 50);
  return safe || `article-${Date.now()}-${index}`;
}
