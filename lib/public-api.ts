import { NextRequest, NextResponse } from "next/server";

import {
  getClientIp,
  incrementRateLimit,
  UNKNOWN_IP,
} from "@/lib/login-rate-limit";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;

const allowedOrigins = () =>
  (process.env.PUBLIC_API_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

export const publicApiHeaders = (request: NextRequest) => {
  const origin = request.headers.get("origin");
  const headers = new Headers({
    "Cache-Control": "public, max-age=60, s-maxage=60",
    Vary: "Origin",
  });

  if (origin && allowedOrigins().includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
  }

  return headers;
};

export const publicJson = <T>(
  request: NextRequest,
  body: T,
  init: ResponseInit = {},
) => {
  const headers = publicApiHeaders(request);
  new Headers(init.headers).forEach((value, key) => headers.set(key, value));

  return NextResponse.json(body, { ...init, headers });
};

export const methodNotAllowed = (request: NextRequest) =>
  publicJson(
    request,
    { success: false, message: "Method tidak diizinkan." },
    { status: 405, headers: { Allow: "GET, OPTIONS" } },
  );

export const optionsResponse = (request: NextRequest) =>
  new NextResponse(null, { status: 204, headers: publicApiHeaders(request) });

export const checkPublicApiRateLimit = async (request: NextRequest) => {
  const ip = getClientIp(request);
  if (ip === UNKNOWN_IP) return null;

  const entry = await incrementRateLimit(`public:ip:${ip}`, WINDOW_MS).catch(
    () => null,
  );
  if (!entry || entry.count <= MAX_REQUESTS) return null;

  const retryAfter = Math.max(1, Math.ceil((entry.resetAt - Date.now()) / 1_000));
  return publicJson(
    request,
    { success: false, message: "Terlalu banyak permintaan. Coba lagi nanti." },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
};
