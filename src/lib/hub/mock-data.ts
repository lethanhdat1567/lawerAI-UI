// src/lib/hub/mock-data.ts — demo fixtures mirroring schema fields

import type {
  HubAuthor,
  HubCategoryUI,
  HubPostRecord,
} from "@/lib/hub/types";

export const mockAuthors: HubAuthor[] = [
  {
    id: "usr_1",
    username: "minh_thao",
    displayName: "Minh Thảo",
    avatarUrl: null,
  },
  {
    id: "usr_2",
    username: "an_khoi",
    displayName: "An Khôi",
    avatarUrl: null,
  },
  {
    id: "usr_3",
    username: "lan_luat",
    displayName: "Lan (Sinh viên luật)",
    avatarUrl: null,
  },
  {
    id: "usr_4",
    username: "bach_dang",
    displayName: "Bách Đăng",
    avatarUrl: null,
  },
];

export const mockCategories: HubCategoryUI[] = [
  { id: "cat_1", slug: "dat-dai", name: "Đất đai", sortOrder: 0 },
  { id: "cat_2", slug: "lao-dong", name: "Lao động", sortOrder: 1 },
  { id: "cat_3", slug: "hop-dong", name: "Hợp đồng", sortOrder: 2 },
  { id: "cat_4", slug: "hon-nhan", name: "Hôn nhân & gia đình", sortOrder: 3 },
];

const author = (username: string) => {
  const a = mockAuthors.find((x) => x.username === username);
  if (!a) throw new Error(`mock author ${username}`);
  return a;
};

export const mockPosts: HubPostRecord[] = [
  {
    id: "post_1",
    categoryId: "cat_1",
    authorId: author("minh_thao").id,
    slug: "tranh-chap-ranh-dat-bien-ban-do-dac",
    title: "Tranh chấp ranh đất — có biên bản đo đạc nhưng hàng xóm không ký",
    body: `Mình và hàng xóm tranh chấp một đoạn ranh giới khoảng 40 cm. UBND xã đã lập biên bản đo đạc nhưng phía hàng xóm không đồng ý ký nhận.

Theo hướng dẫn của cán bộ địa chính, mình cần xem xét các quy định về giải quyết tranh chấp đất đai tại cơ sở và thủ tục yêu cầu UBND cấp có thẩm quyền hòa giải / thẩm định.

**Câu hỏi:** Biên bản không có chữ ký đối phương có được coi là căn cứ pháp lý không, và nên làm đơn kiến nghị theo mẫu nào?`,
    status: "PUBLISHED",
    createdAt: "2025-03-10T08:30:00.000Z",
    updatedAt: "2025-03-12T14:00:00.000Z",
    comments: [
      {
        id: "c1",
        postId: "post_1",
        parentId: null,
        authorId: author("an_khoi").id,
        likeCount: 0,
        body: "Theo kinh nghiệm xử lý ở địa phương mình, thường vẫn cần hòa giải viên xác nhận và lập biên bản buổi làm việc. Bạn có thể kèm ảnh mốc giới cũ không?",
        createdAt: "2025-03-10T10:15:00.000Z",
      },
      {
        id: "c2",
        postId: "post_1",
        parentId: "c1",
        authorId: author("minh_thao").id,
        likeCount: 0,
        body: "Mình có ảnh mốc cũ và sổ đỏ bản photo công chứng. Sẽ bổ sung trong trả lời tiếp theo.",
        createdAt: "2025-03-10T11:00:00.000Z",
      },
      {
        id: "c3",
        postId: "post_1",
        parentId: null,
        authorId: author("lan_luat").id,
        likeCount: 0,
        body: "Bạn nên ghi rõ số thửa, tờ bản đồ và thời điểm đo — AI thư ký tóm tắt phía dưới cũng nhắc tới BLDS và Luật Đất đai, nhưng cần đối chiếu văn bản hiện hành.",
        createdAt: "2025-03-11T09:20:00.000Z",
      },
    ],
    oversightVersions: [
      {
        id: "ov1",
        postId: "post_1",
        version: 1,
        summaryText:
          "Tóm tắt: Tranh chấp ranh giới đất ở — đã có biên bản đo đạc nhưng thiếu chữ ký bên đối diện. Cần xác định quy trình hòa giải ở UBND xã và căn cứ BLDS / Luật Đất đai liên quan đến giải quyết tranh chấp đất đai.",
        suggestionsJson: {
          items: [
            "Kiểm tra thời hiệu yêu cầu hòa giải và thẩm quyền UBND cấp nào.",
            "Thu thập thêm chứng cứ: sổ đỏ, biên bản vi phạm hành chính (nếu có), ảnh mốc giới lịch sử.",
            "Xem xét mời Trung tâm hòa giằng hòa tại địa phương làm việc chung một buổi.",
          ],
        },
        legalCorpusVersion: "vn-legal-kit-2025.03",
        modelVersion: "oversight-1.2",
        isCurrent: false,
        createdAt: "2025-03-10T18:00:00.000Z",
      },
      {
        id: "ov2",
        postId: "post_1",
        version: 2,
        summaryText:
          "Bản cập nhật: Bổ sung gợi ý về giá trị chứng cứ hình ảnh và việc yêu cầu địa chính lập lại sơ đồ thửa nếu có sai lệch so với thực địa.",
        suggestionsJson: {
          items: [
            "Đính kèm ảnh mốc giới gắn metadata thời gian, vị trí (nếu có).",
            "Đối chiếu nội dung đơn kiến nghị với mẫu của địa phương (từng tỉnh khác nhau).",
          ],
        },
        legalCorpusVersion: "vn-legal-kit-2025.03",
        modelVersion: "oversight-1.3",
        isCurrent: true,
        createdAt: "2025-03-12T14:00:00.000Z",
      },
    ],
  },
  {
    id: "post_2",
    categoryId: "cat_2",
    authorId: author("an_khoi").id,
    slug: "sa-thai-hop-dong-thu-viec",
    title: "Bị chấm dứt hợp đồng thử việc trước hạn — có được bồi thường không?",
    body: `Startup báo chấm dứt HĐ thử việc sau 2 tuần, lý do \"không đạt KPI\" nhưng không có tiêu chí bằng văn bản.

Mình muốn biết quy trình và khả năng khiếu nại với Sở LĐTBXH.`,
    status: "PUBLISHED",
    createdAt: "2025-03-08T07:00:00.000Z",
    updatedAt: "2025-03-08T07:00:00.000Z",
    comments: [
      {
        id: "c4",
        postId: "post_2",
        parentId: null,
        authorId: author("bach_dang").id,
        likeCount: 0,
        body: "Nếu không có tiêu chí đánh giá thử việc thỏa thuận bằng văn bản, có thể đó là thiếu sót trình tự. Bạn có email thông báo chấm dứt không?",
        createdAt: "2025-03-08T09:00:00.000Z",
      },
    ],
    oversightVersions: [
      {
        id: "ov3",
        postId: "post_2",
        version: 1,
        summaryText:
          "Tóm tắt: Chấm dứt HĐ thử việc sớm với lý do KPI — cần xem BLLĐ về thử việc, thông báo bằng văn bản và tiêu chí đánh giá.",
        suggestionsJson: {
          items: [
            "Yêu cầu NS gửi lại quy chế đánh giá thử việc đã được công bố.",
            "Lưu log KPI / task board nếu có.",
            "Liên hệ Thanh tra LĐ nếu thương lượng không thành.",
          ],
        },
        legalCorpusVersion: "vn-legal-kit-2025.02",
        modelVersion: "oversight-1.2",
        isCurrent: true,
        createdAt: "2025-03-08T12:00:00.000Z",
      },
    ],
  },
  {
    id: "post_3",
    categoryId: "cat_3",
    authorId: author("lan_luat").id,
    slug: "dieu-khoan-phat-vi-pham-hop-dong-cung-cap-dich-vu",
    title: "Điều khoản phạt vi phạm trong hợp đồng cung cấp dịch vụ SaaS",
    body: `Team mình soạn HĐ với khách DN Việt Nam. Muốn giới hạn mức phạt và điều kiện áp dụng cho chậm thanh toán.

Có ai có mẫu clause an toàn hơn mức 8%/tháng không?`,
    status: "PUBLISHED",
    createdAt: "2025-03-05T16:45:00.000Z",
    updatedAt: "2025-03-06T10:00:00.000Z",
    comments: [],
    oversightVersions: [],
  },
  {
    id: "post_4",
    categoryId: "cat_4",
    authorId: author("bach_dang").id,
    slug: "thu-tuc-ly-hon-thuan-tai-toa",
    title: "Thủ tục ly hôn thuận tình tại TAND — hồ sơ cần chuẩn bị",
    body: `Hai bên đã thống nhất phân chia tài sản và nuôi con. Xin được checklist giấy tờ nộp một lần tại tòa.`,
    status: "PUBLISHED",
    createdAt: "2025-03-01T12:00:00.000Z",
    updatedAt: "2025-03-02T08:00:00.000Z",
    comments: [
      {
        id: "c5",
        postId: "post_4",
        parentId: null,
        authorId: author("minh_thao").id,
        likeCount: 0,
        body: "Thêm bản photo CMND/CCCD công chứng và giấy đăng ký kết hôn bản chính để đối chiếu.",
        createdAt: "2025-03-01T14:00:00.000Z",
      },
    ],
    oversightVersions: [
      {
        id: "ov4",
        postId: "post_4",
        version: 1,
        summaryText:
          "Tóm tắt: Ly hôn thuận tình — liệt kê hồ sơ theo BLHS và nghị quyết hướng dẫn thủ tục tại TAND.",
        suggestionsJson: { items: ["Xác nhận nơi thẩm quyền theo nơi cư trú.", "Bản thỏa thuận phân chia tài sản công chứng."] },
        legalCorpusVersion: "vn-legal-kit-2025.01",
        modelVersion: "oversight-1.1",
        isCurrent: true,
        createdAt: "2025-03-01T20:00:00.000Z",
      },
    ],
  },
  {
    id: "post_5",
    categoryId: "cat_1",
    authorId: author("minh_thao").id,
    slug: "cap-giay-phep-xay-dung-nho",
    title: "Cấp giấy phép xây dựng nhỏ trên đất ONT — có được miễn không?",
    body: `Diện tích xây dưới 50m², nhà cấp 4. Địa phương nói có thể làm theo quy định đơn giản hóa.`,
    status: "PUBLISHED",
    createdAt: "2025-02-28T09:00:00.000Z",
    updatedAt: "2025-02-28T09:00:00.000Z",
    comments: [],
    oversightVersions: [],
  },
  {
    id: "post_6",
    categoryId: "cat_2",
    authorId: author("lan_luat").id,
    slug: "tien-luong-thu-viec-80-doc-hai",
    title: "Tiền lương thử việc 80% có bắt buộc áp dụng cho mọi vị trí không?",
    body: `HR yêu cầu thỏa thuận 85% nhưng mình nghe nói pháp luật quy định không thấp hơn 85% so với lương chính thức — không rõ con số chính xác.`,
    status: "PUBLISHED",
    createdAt: "2025-02-25T11:00:00.000Z",
    updatedAt: "2025-02-26T15:30:00.000Z",
    comments: [
      {
        id: "c6",
        postId: "post_6",
        parentId: null,
        authorId: author("an_khoi").id,
        likeCount: 0,
        body: "BLLĐ sửa đổi đã điều chỉnh mức này — nên tra cứu điều khoản hiện hành theo năm áp dụng HĐ.",
        createdAt: "2025-02-25T13:00:00.000Z",
      },
    ],
    oversightVersions: [],
  },
  {
    id: "post_7_hidden",
    categoryId: "cat_3",
    authorId: author("an_khoi").id,
    slug: "bai-an-admin-an",
    title: "Bài ẩn — chỉ demo trạng thái HIDDEN",
    body: "Nội dung không hiển thị công khai.",
    status: "HIDDEN",
    createdAt: "2025-02-01T00:00:00.000Z",
    updatedAt: "2025-02-01T00:00:00.000Z",
    comments: [],
    oversightVersions: [],
  },
];

export function getAuthorById(id: string): HubAuthor {
  const a = mockAuthors.find((x) => x.id === id);
  if (!a) {
    return { id: "unknown", username: "unknown", displayName: "Ẩn danh", avatarUrl: null };
  }
  return a;
}

export function getCategoryById(id: string | null): HubCategoryUI | null {
  if (!id) return null;
  return mockCategories.find((c) => c.id === id) ?? null;
}
