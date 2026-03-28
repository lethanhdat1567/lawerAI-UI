import { NextResponse } from "next/server";

import {
  accessTokenMaxAgeSec,
  baseCookieOptions,
  refreshCookieMaxAgeSec,
} from "@/lib/auth/cookieOptions";
import { COOKIE_ACCESS, COOKIE_REFRESH } from "@/lib/auth/cookieNames";
import { beLogout } from "@/lib/auth/beClient";
import { cookies } from "next/headers";

type SessionBody = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
};

export async function POST(request: Request) {
  let body: SessionBody;
  try {
    body = (await request.json()) as SessionBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.accessToken || !body.refreshToken || !body.accessTokenExpiresAt) {
    return NextResponse.json({ error: "Missing tokens" }, { status: 400 });
  }

  const base = baseCookieOptions();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_ACCESS, body.accessToken, {
    ...base,
    maxAge: accessTokenMaxAgeSec(body.accessTokenExpiresAt),
  });
  res.cookies.set(COOKIE_REFRESH, body.refreshToken, {
    ...base,
    maxAge: refreshCookieMaxAgeSec(),
  });
  return res;
}

export async function DELETE() {
  const jar = await cookies();
  const refresh = jar.get(COOKIE_REFRESH)?.value;

  if (refresh) {
    try {
      await beLogout(refresh);
    } catch {
      /* best-effort */
    }
  }

  const base = baseCookieOptions();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_ACCESS, "", { ...base, maxAge: 0 });
  res.cookies.set(COOKIE_REFRESH, "", { ...base, maxAge: 0 });
  return res;
}
