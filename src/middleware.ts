// src/middleware.ts
//
// Bảo vệ /admin:
// - Production: cần ALLOW_ADMIN_UI=true (build/server) để bật giao diện admin.
// - Kiểm tra cookie lawyerai_at (JWT access) khớp JWT_ACCESS_SECRET / JWT_SECRET với LawerAI-api,
//   payload typ === "access" và role === ADMIN.
//
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

import { COOKIE_ACCESS } from "@/lib/auth/cookieNames";

const ADMIN_ROLE = "ADMIN";
const ACCESS_TYP = "access";

function loginRedirect(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  url.searchParams.set("next", nextPath);
  return NextResponse.redirect(url);
}

function homeRedirect(request: NextRequest): NextResponse {
  return NextResponse.redirect(new URL("/", request.url));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const allowUi =
    process.env.NODE_ENV !== "production" ||
    process.env.ALLOW_ADMIN_UI === "true";

  if (!allowUi) {
    return homeRedirect(request);
  }

  const secretRaw =
    process.env.JWT_ACCESS_SECRET?.trim() || process.env.JWT_SECRET?.trim();
  if (!secretRaw) {
    return loginRedirect(request);
  }

  const token = request.cookies.get(COOKIE_ACCESS)?.value;
  if (!token) {
    return loginRedirect(request);
  }

  try {
    const key = new TextEncoder().encode(secretRaw);
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });

    if (payload.typ !== ACCESS_TYP) {
      return loginRedirect(request);
    }

    const rawRole =
      typeof payload.role === "string"
        ? payload.role
        : typeof payload.role === "number"
          ? String(payload.role)
          : String(payload.role ?? "");
    const role = rawRole.trim().toUpperCase();

    // Chỉ ADMIN được vào mọi route /admin; user khác (đã đăng nhập) về trang chủ — không cho lọt admin.
    if (role !== ADMIN_ROLE) {
      return homeRedirect(request);
    }
  } catch {
    return loginRedirect(request);
  }

  return NextResponse.next();
}

export const config = {
  // `/admin` tường minh: một số phiên bản Next không khớp `:path*` với path không có segment sau `/admin`.
  matcher: ["/admin", "/admin/:path*"],
};
