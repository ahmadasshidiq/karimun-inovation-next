import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const jwtSecret = process.env["JWT_SECRET"];

  if (token && jwtSecret) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(jwtSecret),
      );

      if (payload.sub) {
        await prisma.user.updateMany({
          where: { id: payload.sub, currentToken: token },
          data: { currentToken: null },
        });
      }
    } catch {
      // Cookie tetap dihapus meskipun token sudah tidak valid.
    }
  }

  const response = NextResponse.json({ message: "Logout berhasil." });
  response.cookies.set("auth_token", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
