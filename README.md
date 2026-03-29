# LawyerAI — UI (`LawyerAI-UI`)

Frontend **Next.js 15** (App Router), **Tailwind CSS v4**, **shadcn/ui** (base-nova), **Framer Motion**, **Zustand**, **nuqs**. Khớp đặc tả trong `DOCS/README.md` và API tại `LawyerAI-api`.

## Chạy local

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Cấu trúc chính

- `src/app/(marketing)/` — layout chung (header/footer), trang landing và các route marketing.
- `src/components/layout/` — `site-header`, `site-footer`, `page-shell`.
- `src/components/marketing/` — hero, bento tính năng, CTA (phong cách tham chiếu [Superior](https://superior-template.framer.website/)).
- `src/stores/ui-store.ts` — Zustand (ví dụ menu mobile).
- `src/components/providers.tsx` — `NuqsAdapter` cho tham số URL.

## Build

```bash
npm run build
```

## Biến môi trường (tùy chức năng)

- **`NEXT_PUBLIC_API_BASE_URL`** — URL gốc API (ví dụ `http://localhost:8000`).
- **`ALLOW_ADMIN_UI`** — Trên **production**, đặt `true` để bật route `/admin` (mặc định chặn). Development luôn cho phép URL admin (vẫn phải đăng nhập + cookie access hợp lệ).
- **`JWT_ACCESS_SECRET`** hoặc **`JWT_SECRET`** — Dùng **trên server Next** (middleware) để verify cookie `lawyerai_at`; giá trị phải **trùng** `JWT_ACCESS_SECRET` / `JWT_SECRET` của LawerAI-api khi ký access token.
