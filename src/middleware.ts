// src/middleware.ts
//
// Bảo vệ /admin: production mặc định chặn cho tới khi bật cờ + sau này kiểm tra session ADMIN.
// - Đặt ALLOW_ADMIN_UI=true trong .env (build/server) để mở giao diện admin trên môi trường deploy.
// - TODO: Khi LawerAI-api có cookie/session, xác minh User.role === ADMIN trước khi cho qua.
//
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const allow =
    process.env.NODE_ENV !== "production" || process.env.ALLOW_ADMIN_UI === "true";

  if (!allow) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
