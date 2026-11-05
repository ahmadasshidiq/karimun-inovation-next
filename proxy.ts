import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const protectedPrefixes = [
  "/dashboard",
  "/innovations",
  "/innovation-contracts",
  "/innovation-competitions",
  "/lomba-inovasi",
  "/laporan-diklat",
  "/pengaturan",
];

const isDev = process.env.NODE_ENV !== "production";

function buildContentSecurityPolicy(nonce: string) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
    "media-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}

export async function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const contentSecurityPolicy = buildContentSecurityPolicy(nonce);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);

  const response = await handleAuth(request, requestHeaders);
  response.headers.set("Content-Security-Policy", contentSecurityPolicy);
  return response;
}

async function handleAuth(request: NextRequest, requestHeaders: Headers) {
  const pathname = request.nextUrl.pathname;
  const isAuthRoute =
    pathname === "/login" ||
    protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!isAuthRoute) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const token = request.cookies.get("auth_token")?.value;
  const jwtSecret = process.env["JWT_SECRET"];
  let authenticated = false;

  if (token && jwtSecret) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(jwtSecret),
      );

      if (payload.sub) {
        const activeSession = await prisma.user.findFirst({
          where: {
            id: payload.sub,
            currentToken: token,
            status: "ACTIVE",
            deletedAt: null,
          },
          select: { id: true },
        });

        authenticated = Boolean(activeSession);
      }
    } catch {
      authenticated = false;
    }
  }

  const isProtected = protectedPrefixes.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix),
  );

  if (!authenticated && token) {
    let response: NextResponse;

    if (isProtected) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("reason", "session_expired");
      response = NextResponse.redirect(loginUrl);
    } else {
      response = NextResponse.next({ request: { headers: requestHeaders } });
    }

    response.cookies.delete("auth_token");
    return response;
  }

  if (isProtected && !authenticated) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth_token");
    return response;
  }

  if (request.nextUrl.pathname === "/login" && authenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|images/).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
