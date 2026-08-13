import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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

    return NextResponse.json({
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        role: user.role.name,
        institution: user.institution.name,
        nomenclature: user.institution.nomenclature.name,
      },
    });
  } catch {
    return unauthorized();
  }
}
