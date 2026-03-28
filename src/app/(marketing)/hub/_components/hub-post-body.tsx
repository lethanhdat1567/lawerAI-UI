// src/app/(marketing)/hub/_components/hub-post-body.tsx
import { ArticleBody } from "@/components/article/article-body";

export function HubPostBody({ body }: { body: string }) {
  return <ArticleBody body={body} />;
}
