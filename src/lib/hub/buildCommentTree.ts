import type { HubCommentNode, HubCommentWithAuthor } from "@/lib/hub/types";

export function buildCommentTree(
  comments: HubCommentWithAuthor[],
): HubCommentNode[] {
  const withAuthors: HubCommentNode[] = comments.map((c) => ({
    ...c,
    author: c.author,
    replies: [],
  }));

  const byId = new Map(withAuthors.map((c) => [c.id, c]));
  const roots: HubCommentNode[] = [];

  for (const c of withAuthors) {
    if (c.parentId && byId.has(c.parentId)) {
      byId.get(c.parentId)!.replies.push(c);
    } else {
      roots.push(c);
    }
  }

  const sortNodes = (nodes: HubCommentNode[]) => {
    nodes.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    for (const n of nodes) sortNodes(n.replies);
  };
  sortNodes(roots);
  return roots;
}
