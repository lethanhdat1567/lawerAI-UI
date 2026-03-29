import type { BlogCommentNode, BlogCommentWithAuthor } from "@/lib/blog/types";

export function buildBlogCommentTree(
  comments: BlogCommentWithAuthor[],
): BlogCommentNode[] {
  const withAuthors: BlogCommentNode[] = comments.map((c) => ({
    ...c,
    replies: [],
  }));

  const byId = new Map(withAuthors.map((c) => [c.id, c]));
  const roots: BlogCommentNode[] = [];

  for (const c of withAuthors) {
    if (c.parentId && byId.has(c.parentId)) {
      byId.get(c.parentId)!.replies.push(c);
    } else {
      roots.push(c);
    }
  }

  const sortNodes = (nodes: BlogCommentNode[]) => {
    nodes.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    for (const n of nodes) sortNodes(n.replies);
  };
  sortNodes(roots);
  return roots;
}
