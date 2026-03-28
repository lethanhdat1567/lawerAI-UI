// src/lib/assistant/mock-data.ts
import type { AssistantConversationWithMessages } from "./types";

const DEMO_USER_ID = "demo_user_1";

/** Phiên khách: chat thử trên client; sidebar không hiển thị danh sách lịch sử. */
export const GUEST_USER_ID = "guest_ephemeral";

/** Hạt giống mock — clone khi “đăng nhập” demo để state có thể chỉnh trên client. */
export const ASSISTANT_MOCK_SEED: AssistantConversationWithMessages[] = [
  {
    id: "conv_seed_1",
    userId: DEMO_USER_ID,
    title: "Thời hiệu khởi kiện hợp đồng",
    createdAt: "2026-03-20T08:00:00.000Z",
    updatedAt: "2026-03-20T08:15:00.000Z",
    messages: [
      {
        id: "msg_1_1",
        conversationId: "conv_seed_1",
        role: "USER",
        content:
          "Hợp đồng mua bán vi phạm từ tháng 8/2025, tôi muốn biết **thời hiệu khởi kiện** theo pháp luật hiện hành cần lưu ý gì?",
        createdAt: "2026-03-20T08:00:30.000Z",
        metadataJson: null,
      },
      {
        id: "msg_1_2",
        conversationId: "conv_seed_1",
        role: "ASSISTANT",
        content:
          "Dưới góc nhìn tra cứu (không phải tư vấn trực tiếp), bạn cần đối chiếu **Bộ luật Dân sự** về thời hiệu và loại tranh chấp (mua bán dân sự thường có quy định riêng so với một số hợp đồng thương mại).\n\n**Gợi ý bước tiếp:** thu thập ngày biết quyền bị xâm phạm, xem có thoả thuận trọng tài không, và đối chiếu văn bản pháp luật tại thời điểm phát sinh tranh chấp.",
        createdAt: "2026-03-20T08:01:00.000Z",
        metadataJson: { corpusHint: "demo" },
      },
    ],
  },
  {
    id: "conv_seed_2",
    userId: DEMO_USER_ID,
    title: "Lái xe say rượu — mức xử phạt hành chính",
    createdAt: "2026-03-18T10:00:00.000Z",
    updatedAt: "2026-03-18T10:05:00.000Z",
    messages: [
      {
        id: "msg_2_1",
        conversationId: "conv_seed_2",
        role: "USER",
        content: "Mức phạt hành chính khi nồng độ cồn vượt mức cho phép là bao nhiêu? (tham khảo)",
        createdAt: "2026-03-18T10:01:00.000Z",
      },
      {
        id: "msg_2_2",
        conversationId: "conv_seed_2",
        role: "ASSISTANT",
        content:
          "Mức xử phạt phụ thuộc **Nghị định xử phạt vi phạm hành chính** hiện hành và tình tiết cụ thể (mức cồn, phương tiện, tái phạm). Bạn nên tra cứu khung phạt mới nhất trên CSDL quy phạm pháp luật.",
        createdAt: "2026-03-18T10:02:00.000Z",
      },
    ],
  },
  {
    id: "conv_seed_3",
    userId: DEMO_USER_ID,
    title: null,
    createdAt: "2026-03-15T14:00:00.000Z",
    updatedAt: "2026-03-15T14:01:00.000Z",
    messages: [
      {
        id: "msg_3_1",
        conversationId: "conv_seed_3",
        role: "SYSTEM",
        content:
          "Hệ thống: phiên bản corpus nội bộ **v2026.03** (minh hoạ). Tiêu đề cuộc trò chuyện có thể được tạo từ tin nhắn đầu.",
        createdAt: "2026-03-15T14:00:00.000Z",
      },
    ],
  },
];

export function cloneMockConversations(): AssistantConversationWithMessages[] {
  return JSON.parse(JSON.stringify(ASSISTANT_MOCK_SEED)) as AssistantConversationWithMessages[];
}

export { DEMO_USER_ID };
