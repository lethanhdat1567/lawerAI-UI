# LawyerAI — tài liệu cốt lõi (UI)

**LawyerAI** gồm **ba trụ cột** và **một điểm nhấn cộng đồng**: (1) **Trợ lý tra cứu** — định hướng khung pháp; (2) **Không gian thảo luận** — cộng đồng + AI tổng hợp có kiểm soát; (3) **Kho tri thức** (Blog) — bài chuyên sâu với nhãn **Đã kiểm chứng** khi đối chiếu được CSDL pháp; (4) **Tôn vinh đóng góp** — trang **hall of fame** cho người đóng góp nổi bật. Toàn bộ AI mang tính **tham khảo**, không thay **tư vấn cá nhân** của luật sư.

## Trụ sản phẩm & cộng đồng

### 1. Trợ lý tra cứu (AI Assistant)

- User mô tả **tình huống** (đất đai, hợp đồng, …).
- AI **không** đưa lời khuyên cá nhân; **trích dẫn điều luật / văn bản hiện hành** liên quan (RAG), kèm **nguồn và thời điểm tra cứu**.
- Trình bày **dễ hiểu**, UI rõ ràng; có **đánh giá** (hữu ích, …) để cải thiện chất lượng — không đồng nghĩa “đúng/sai pháp lý tuyệt đối”.
- **Giá trị:** giúp user **hiểu mình đang đứng đâu trong khung pháp lý** trước khi gặp luật sư.

### 2. Không gian thảo luận (Community Hub)

- **User post** trình bày vấn đề thực tế, nhận phản hồi từ cộng đồng.
- **AI Oversight (thư ký):** cuối bài / luồng thảo luận — **tóm tắt các hướng ý kiến chính**, **gợi ý đối chiếu** chỗ có vẻ **không khớp** với văn bản pháp tại thời điểm tra cứu (có **link điều khoản**, ngôn ngữ **không chắc chắn tuyệt đối**, cho phép báo cáo).

### 3. Kho tri thức Verified (Blog)

- Nội dung **chuyên sâu** do **AI hoặc user** đóng góp.
- Nhãn **Đã kiểm chứng (Verified)** chỉ khi **đã so khớp / đối chiếu** với **CSDL pháp cập nhật** theo quy trình sản phẩm (tự động + admin duyệt khi cần); phân biệt rõ với “xác minh chính phủ”.
- Blog sẽ có các tags, có thể đa dạng

### 4. Tôn vinh đóng góp (Contributors / Hall of fame)

- Trang **công khai** giới thiệu **cá nhân đóng góp nổi bật** cho website (hub, kho tri thức, v.v.) — UI rõ ràng, có thể theo **chu kỳ** (tháng/quý) hoặc **bảng vàng** tổng.
- Điểm / thứ hạng dựa trên **chỉ số minh bạch** (vd: câu trả lời được đánh giá hữu ích, bài blog có giá trị, không vi phạm) — tránh “chỉ săn số lượng”; có chính sách **ẩn danh / không tham gia xếp hạng** nếu user chọn.
- **Admin** có thể **ghim**, **loại** khỏi danh sách khi gian lận hoặc vi phạm quy tắc.

## Vai trò

- **User:** tra cứu, đăng bài hub, đọc/ghi kho tri thức (theo quyền).
- **Verified lawyer:** như user + **blue-check** (nộp hồ sơ → admin duyệt / có thể thu hồi); uy tín minh bạch trên hub.
- **Admin:** người dùng, verification, kiểm duyệt, cấu hình nguồn RAG / nhãn kiểm chứng.

## Stack (xác nhận)

Next.js **15**, **Tailwind v4**, **shadcn/ui**, **Zustand**, **nuqs**; API + **Prisma** (server). RSC mặc định; client cho stream tra cứu & tương tác nặng.

## Trang chính (App Router — kế hoạch)

| Nhóm                | Routes (ví dụ)                                                                      |
| ------------------- | ----------------------------------------------------------------------------------- |
| Marketing / SEO     | `/`, `/about`, `/privacy`, `/terms`, `/what-is-verified`                            |
| Auth                | `/login`, `/register`, `/forgot-password`                                           |
| Tra cứu             | `/assistant` (hoặc `/tra-cuu`), `/assistant/[id]`                                   |
| Hub                 | `/hub`, `/hub/c/[slug]`, `/hub/p/[slug]`, `/hub/new`                                |
| Blog (kho tri thức) | `/blog`, `/blog/[slug]`, `/blog/tag/[slug]`, `/blog/new` (nếu cho phép viết bài)    |
| Tôn vinh            | `/contributors`, `/ton-vinh` hoặc `/hall-of-fame` (có thể `/contributors/[period]`) |
| Profile             | `/u/[username]`, `/settings`, `/apply-verification`                                 |
| Admin               | `/admin`, `/admin/users`, `/admin/verification`, `/admin/moderation`, `/admin/blog` |

Query (sort, page, tìm) dùng **nuqs** khi cần link chia sẻ.

## Roadmap (4 pha)

1. **Foundation** — shell Next.js, Tailwind + shadcn, stub ba khu vực, SEO/metadata.
2. **Auth & DB** — đăng nhập, RBAC, Prisma (user, vai trò, trạng thái verification / kiểm chứng bài).
3. **Core** — hub đầy đủ, kho tri thức MVP, nhãn Verified có quy trình, oversight AI có giới hạn copy an toàn; **trang tôn vinh đóng góp** (MVP: bảng xếp hạng đơn + tiêu chí rõ).
4. **AI & SEO** — RAG tra cứu production, streaming, tối ưu LCP/CLS, structured data.

## Tiêu chí thành công

**Mobile-first**; **< 2s** tới nội dung có ý nghĩa (đo composite rõ ràng); **SEO** cho landing, bài hub & bài kho tri thức; không lộ raw lỗi DB ra client.

## Quy ước backend (Prisma — ngắn gọn)

`cuid` id, `createdAt` / `updatedAt`, **soft delete** `deletedAt`; list **pagination**; **transaction** cho thao tác nhiều bước (vd: bài + điểm uy tín).

---

_Một file duy nhất — cập nhật khi route hoặc pha thay đổi._
