// src/lib/blog/nuqs-parsers.ts
import { parseAsBoolean, parseAsInteger, parseAsStringEnum } from "nuqs";

import type { BlogSortMode } from "@/lib/blog/types";

export const blogSortParser = parseAsStringEnum<BlogSortMode>([
  "new",
  "updated",
]).withDefault("new");

export const blogPageParser = parseAsInteger.withDefault(1);

/** ?verified=true — chỉ bài đã kiểm chứng */
export const blogVerifiedParser = parseAsBoolean.withDefault(false);
