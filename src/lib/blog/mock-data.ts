// src/lib/blog/mock-data.ts

import type {
  BlogAuthor,
  BlogPostStatusUI,
  BlogTag,
} from "@/lib/blog/types";

export const mockBlogAuthors: BlogAuthor[] = [
  {
    id: "ba_1",
    username: "btv_legal",
    displayName: "Ban biên tập",
    avatarUrl: null,
  },
  {
    id: "ba_2",
    username: "ls_guest",
    displayName: "Cộng tác viên LS",
    avatarUrl: null,
  },
  {
    id: "ba_3",
    username: "content_team",
    displayName: "Nhóm nội dung",
    avatarUrl: null,
  },
];

export const mockBlogTags: BlogTag[] = [
  { id: "bt_1", slug: "dat-dai", name: "Đất đai" },
  { id: "bt_2", slug: "lao-dong", name: "Lao động" },
  { id: "bt_3", slug: "doanh-nghiep", name: "Doanh nghiệp" },
  { id: "bt_4", slug: "hop-dong", name: "Hợp đồng" },
  { id: "bt_5", slug: "verified-series", name: "Chuỗi Verified" },
];

export interface BlogPostRecord {
  id: string;
  authorId: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  status: BlogPostStatusUI;
  isVerified: boolean;
  verifiedAt: string | null;
  verifiedByUserId: string | null;
  verificationNotes: string | null;
  legalCorpusVersion: string | null;
  createdAt: string;
  updatedAt: string;
  tagSlugs: string[];
}

export const mockBlogPosts: BlogPostRecord[] = [
  {
    id: "bp_1",
    authorId: "ba_1",
    slug: "luat-dat-dai-2024-diem-moi-ong-gop",
    title: "Luật Đất đai 2024: điểm mới người dân thường hỏi",
    excerpt:
      "Tóm tắt một số thay đổi liên quan thu hồi, bồi thường và thủ tục giao dịch — luôn đối chiếu văn bản chính thức.",
    body: `Luật Đất đai sửa đổi mang lại nhiều thay đổi về trình tự và quyền của người sử dụng đất.

**Lưu ý:** Bài viết mang tính tham khảo; quyết định cụ thể phụ thuộc văn bản pháp luật hiện hành tại thời điểm áp dụng.

Khi nghiên cứu, bạn nên ghi rõ số điều khoản và ngày tra cứu để tiện đối chiếu sau này.`,
    status: "PUBLISHED",
    isVerified: true,
    verifiedAt: "2025-03-01T10:00:00.000Z",
    verifiedByUserId: "mod_1",
    verificationNotes:
      "Đã đối chiếu với bản PDF công báo và CSDL pháp luật quốc gia (bản demo).",
    legalCorpusVersion: "vn-legal-kit-2025.03",
    createdAt: "2025-02-20T09:00:00.000Z",
    updatedAt: "2025-03-01T10:00:00.000Z",
    tagSlugs: ["dat-dai", "verified-series"],
  },
  {
    id: "bp_2",
    authorId: "ba_2",
    slug: "thu-viec-va-nghi-viec-thoa-thuan",
    title: "Thử việc và chấm dứt HĐ: những điểm cần có văn bản",
    excerpt:
      "Checklist tối thiểu: tiêu chí thử việc, thông báo bằng văn bản, và thời hiệu khiếu nại.",
    body: `Doanh nghiệp và người lao động nên **thỏa thuận rõ** tiêu chí đánh giá thử việc bằng văn bản.

Khi chấm dứt hợp đồng, cần lưu chứng cứ thông báo và lý do để giảm rủi ro tranh chấp.`,
    status: "PUBLISHED",
    isVerified: true,
    verifiedAt: "2025-02-15T14:00:00.000Z",
    verifiedByUserId: "mod_1",
    verificationNotes: "Đối chiếu BLLĐ và một số hướng dẫn liên quan (demo).",
    legalCorpusVersion: "vn-legal-kit-2025.02",
    createdAt: "2025-02-10T11:00:00.000Z",
    updatedAt: "2025-02-15T14:00:00.000Z",
    tagSlugs: ["lao-dong", "hop-dong"],
  },
  {
    id: "bp_3",
    authorId: "ba_3",
    slug: "mau-dieu-le-cong-ty-me-va-con",
    title: "Gợi ý cấu trúc điều lệ công ty mẹ — con (tham khảo)",
    excerpt:
      "Khung mục lục điều lệ phổ biến khi có công ty thành viên; không phải mẫu pháp định.",
    body: `Điều lệ cần phản ánh **quyền và nghĩa vụ** cổ đông, hội đồng quản trị và ban điều hành.

Với mô hình công ty con, cân nhắc điều khoản về giao dịch liên kết và báo cáo hợp nhất.`,
    status: "PUBLISHED",
    isVerified: false,
    verifiedAt: null,
    verifiedByUserId: null,
    verificationNotes: null,
    legalCorpusVersion: null,
    createdAt: "2025-02-05T08:00:00.000Z",
    updatedAt: "2025-02-28T16:00:00.000Z",
    tagSlugs: ["doanh-nghiep"],
  },
  {
    id: "bp_4",
    authorId: "ba_1",
    slug: "hop-dong-dich-vu-template-checklist",
    title: "Checklist điều khoản trong hợp đồng cung cấp dịch vụ B2B",
    excerpt:
      "Phạm vi, SLA, thanh toán, bảo mật và giới hạn trách nhiệm — danh sách rà soát nhanh.",
    body: `Trước khi ký, rà soát **điều khoản thanh toán**, ân hạn và lãi chậm trả.

Với dịch vụ SaaS, làm rõ sở hữu dữ liệu và thời điểm chấm dứt quyền truy cập.`,
    status: "PUBLISHED",
    isVerified: true,
    verifiedAt: "2025-01-28T12:00:00.000Z",
    verifiedByUserId: "mod_1",
    verificationNotes: null,
    legalCorpusVersion: "vn-legal-kit-2025.01",
    createdAt: "2025-01-22T09:30:00.000Z",
    updatedAt: "2025-01-28T12:00:00.000Z",
    tagSlugs: ["hop-dong", "doanh-nghiep"],
  },
  {
    id: "bp_5",
    authorId: "ba_2",
    slug: "quyen-cua-nguoi-thue-dat-on-tren",
    title: "Quyền của người thuê đất ONT khi Nhà nước thu hồi (tổng quan)",
    excerpt:
      "Khung pháp lý tham khảo về bồi thường và hỗ trợ — cần xác định thẩm quyền địa phương.",
    body: `Thu hồi đất liên quan nhiều quy định **theo từng giai đoạn** và dự án cụ thể.

Người dân nên lưu giữ sổ đỏ, hợp đồng thuê và quyết định thuế/phiếu thu liên quan.`,
    status: "PUBLISHED",
    isVerified: false,
    verifiedAt: null,
    verifiedByUserId: null,
    verificationNotes: null,
    legalCorpusVersion: null,
    createdAt: "2025-01-10T10:00:00.000Z",
    updatedAt: "2025-01-10T10:00:00.000Z",
    tagSlugs: ["dat-dai"],
  },
  {
    id: "bp_6",
    authorId: "ba_3",
    slug: "bao-mat-du-lieu-khach-hang-toi-thieu",
    title: "Tối thiểu pháp lý về bảo vệ dữ liệu trong hợp đồng với khách hàng",
    excerpt:
      "Điều khoản xử lý dữ liệu cá nhân, subprocessors và thông báo sự cố — hướng tham khảo.",
    body: `Hợp đồng nên nêu rõ **mục đích** xử lý dữ liệu và thời gian lưu trữ.

Thêm điều khoản hợp tác khi cơ quan nhà nước yêu cầu cung cấp thông tin theo quy định.`,
    status: "PUBLISHED",
    isVerified: false,
    verifiedAt: null,
    verifiedByUserId: null,
    verificationNotes: null,
    legalCorpusVersion: null,
    createdAt: "2024-12-18T14:00:00.000Z",
    updatedAt: "2025-01-02T09:00:00.000Z",
    tagSlugs: ["doanh-nghiep", "hop-dong"],
  },
  {
    id: "bp_7",
    authorId: "ba_1",
    slug: "series-verified-cach-doc-trich-dan",
    title: "Chuỗi Verified: cách đọc trích dẫn và dẫn nguồn trong bài",
    excerpt:
      "Thống nhất cách ghi điều khoản, ngày hiệu lực và phiên bản văn bản pháp luật được dùng.",
    body: `Mỗi bài Verified gắn **phiên bản corpus** và thời điểm kiểm chứng.

Khi trích dẫn, ưu tiên số hiệu văn bản, điều khoản và URL/ mã tham chiếu nếu có.`,
    status: "PUBLISHED",
    isVerified: true,
    verifiedAt: "2025-03-12T08:00:00.000Z",
    verifiedByUserId: "mod_1",
    verificationNotes: "Chuẩn hóa format trích dẫn nội bộ (demo).",
    legalCorpusVersion: "vn-legal-kit-2025.03",
    createdAt: "2025-03-08T07:00:00.000Z",
    updatedAt: "2025-03-12T08:00:00.000Z",
    tagSlugs: ["verified-series"],
  },
  {
    id: "bp_draft_1",
    authorId: "ba_1",
    slug: "bai-nhap-chua-xuat-ban",
    title: "Bài nháp — không hiển thị công khai",
    excerpt: "Draft only.",
    body: "Nội dung draft.",
    status: "DRAFT",
    isVerified: false,
    verifiedAt: null,
    verifiedByUserId: null,
    verificationNotes: null,
    legalCorpusVersion: null,
    createdAt: "2025-03-01T00:00:00.000Z",
    updatedAt: "2025-03-01T00:00:00.000Z",
    tagSlugs: ["dat-dai"],
  },
];

export function getBlogAuthorById(id: string): BlogAuthor {
  const a = mockBlogAuthors.find((x) => x.id === id);
  if (!a) {
    return {
      id: "unknown",
      username: "unknown",
      displayName: "Tác giả",
      avatarUrl: null,
    };
  }
  return a;
}

export function resolveBlogTags(slugs: string[]): BlogTag[] {
  return slugs
    .map((s) => mockBlogTags.find((t) => t.slug === s))
    .filter((t): t is BlogTag => Boolean(t));
}
