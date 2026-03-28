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
