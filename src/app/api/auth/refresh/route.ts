import { NextResponse } from "next/server";

import { beRefresh } from "@/lib/auth/beClient";
import {
  accessTokenMaxAgeSec,
  baseCookieOptions,
  refreshCookieMaxAgeSec,
} from "@/lib/auth/cookieOptions";
import { COOKIE_ACCESS, COOKIE_REFRESH } from "@/lib/auth/cookieNames";
import { cookies } from "next/headers";

export async function POST() {
  const jar = await cookies();
  const refresh = jar.get(COOKIE_REFRESH)?.value;
  if (!refresh) {
    return NextResponse.json({ error: "No refresh session" }, { status: 401 });
  }

  let pair;
  try {
    pair = await beRefresh(refresh);
  } catch {
    const base = baseCookieOptions();
    const fail = NextResponse.json({ error: "Refresh failed" }, { status: 401 });
    fail.cookies.set(COOKIE_ACCESS, "", { ...base, maxAge: 0 });
    fail.cookies.set(COOKIE_REFRESH, "", { ...base, maxAge: 0 });
    return fail;
  }

  const base = baseCookieOptions();
  const res = NextResponse.json({
    accessToken: pair.accessToken,
    accessTokenExpiresAt: pair.accessTokenExpiresAt,
  });
  res.cookies.set(COOKIE_ACCESS, pair.accessToken, {
    ...base,
    maxAge: accessTokenMaxAgeSec(pair.accessTokenExpiresAt),
  });
  res.cookies.set(COOKIE_REFRESH, pair.refreshToken, {
    ...base,
    maxAge: refreshCookieMaxAgeSec(),
  });
  return res;
}
