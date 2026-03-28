// src/lib/hub/nuqs-parsers.ts
import { parseAsInteger, parseAsStringEnum } from "nuqs";

import type { HubSortMode } from "@/lib/hub/types";

export const hubSortParser = parseAsStringEnum<HubSortMode>([
  "new",
  "updated",
]).withDefault("new");

/** Trang danh sách Hub (bắt đầu từ 1) */
export const hubPageParser = parseAsInteger.withDefault(1);
