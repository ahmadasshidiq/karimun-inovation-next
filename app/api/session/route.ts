import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { toSessionData } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

const unauthorized = () =>
  NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });

export async function GET() {
  try {
    const token = (await cookies()).get("auth_token")?.value;
    const jwtSecret = process.env["JWT_SECRET"];

    if (!token || !jwtSecret) return unauthorized();

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(jwtSecret),
    );

    if (!payload.sub) return unauthorized();

    const user = await prisma.user.findFirst({
      where: {
        id: payload.sub,
        currentToken: token,
        deletedAt: null,
        status: "ACTIVE",
      },
      include: {
        role: true,
        institution: {
          include: { nomenclature: true },
        },
      },
    });

    if (!user) return unauthorized();

    return NextResponse.json({ data: toSessionData(user) });
  } catch {
    return unauthorized();
  }
}
