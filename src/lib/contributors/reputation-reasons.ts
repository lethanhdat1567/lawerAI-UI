// src/lib/contributors/reputation-reasons.ts — mirrors Prisma ReputationReason enum

import type { ReputationReasonExplainer } from "./types";

export const REPUTATION_REASON_EXPLAINERS: ReputationReasonExplainer[] = [
  {
    code: "HUB_REPLY_HELPFUL",
    title: "Trả lời / thích Hub hữu ích",
    description:
      "Điểm khi người khác thích bình luận của bạn trên Hub (không tính tự thích). Mỗi lượt thích hợp lệ được ghi vào sổ uy tín.",
  },
  {
    code: "BLOG_QUALITY",
    title: "Xuất bản bài Blog",
    description:
      "Điểm một lần khi bài blog chuyển sang xuất bản; thu hồi đối xứng nếu bài trở lại nháp hoặc bị gỡ khỏi công khai theo quy tắc nền tảng.",
  },
  {
    code: "BLOG_COMMENT_HELPFUL",
    title: "Bình luận Blog được thích",
    description:
      "Điểm khi người khác thích bình luận của bạn dưới bài blog (không tính tự thích).",
  },
  {
    code: "BLOG_POST_LIKED",
    title: "Bài Blog được thích",
    description:
      "Điểm cộng thêm theo số lượt thích hợp lệ trên bài blog đã xuất bản của bạn.",
  },
  {
    code: "MOD_ADJUSTMENT",
    title: "Điều chỉnh kiểm duyệt",
    description:
      "Thay đổi điểm sau khi đội điều phối xem xét báo cáo hoặc vi phạm quy chế.",
  },
];
