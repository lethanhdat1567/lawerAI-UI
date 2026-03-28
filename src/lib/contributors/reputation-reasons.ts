// src/lib/contributors/reputation-reasons.ts — mirrors Prisma ReputationReason enum

import type { ReputationReasonExplainer } from "./types";

export const REPUTATION_REASON_EXPLAINERS: ReputationReasonExplainer[] = [
  {
    code: "HUB_REPLY_HELPFUL",
    title: "Trả lời Hub hữu ích",
    description:
      "Điểm khi cộng đồng hoặc hệ thống ghi nhận câu trả lời trong Hub giúp ích cho người đặt câu hỏi.",
  },
  {
    code: "BLOG_QUALITY",
    title: "Chất lượng bài Blog",
    description:
      "Đóng góp nội dung blog được đánh giá tốt về độ rõ ràng, nguồn và tính hữu ích.",
  },
  {
    code: "MOD_ADJUSTMENT",
    title: "Điều chỉnh kiểm duyệt",
    description:
      "Thay đổi điểm sau khi đội điều phối xem xét báo cáo hoặc vi phạm quy chế.",
  },
  {
    code: "ADMIN_BONUS",
    title: "Thưởng quản trị",
    description:
      "Ghi nhận đặc biệt từ quản trị (ví dụ báo lỗi nghiêm trọng, đóng góp xây dựng cộng đồng).",
  },
  {
    code: "ADMIN_PENALTY",
    title: "Trừ điểm quản trị",
    description:
      "Áp dụng khi có vi phạm nghiêm trọng hoặc hành vi gây hại nền tảng.",
  },
];
