import type { BlogIdea, IdeaStatus } from "@/services/blog-automation/types";

export type BlogIdeaTabFilter = "all" | IdeaStatus;

export function filterBlogIdeasByTab(
  ideas: BlogIdea[],
  tab: BlogIdeaTabFilter,
): BlogIdea[] {
  if (tab === "all") {
    return ideas;
  }
  return ideas.filter((row) => row.status === tab);
}

export function filterBlogIdeasBySearch(
  ideas: BlogIdea[],
  rawQuery: string,
): BlogIdea[] {
  const q = rawQuery.trim().toLowerCase();
  if (!q) {
    return ideas;
  }
  return ideas.filter((row) => {
    const name = row.name.toLowerCase();
    const desc = row.description.toLowerCase();
    return name.includes(q) || desc.includes(q);
  });
}

export function filterBlogIdeasForTable(
  ideas: BlogIdea[],
  tab: BlogIdeaTabFilter,
  searchQuery: string,
): BlogIdea[] {
  return filterBlogIdeasBySearch(filterBlogIdeasByTab(ideas, tab), searchQuery);
}
