import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const protectedPrefixes = [
  "/dashboard",
  "/innovations",
  "/lomba-inovasi",
  "/laporan-diklat",
  "/pengaturan",
];

export async function proxy(request: NextRequest) {
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
      response = NextResponse.next();
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/innovations/:path*",
    "/lomba-inovasi/:path*",
    "/laporan-diklat/:path*",
    "/pengaturan/:path*",
  ],
};
