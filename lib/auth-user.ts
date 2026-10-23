import { jwtVerify } from "jose";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

export async function getAuthenticatedUser() {
  const token = (await cookies()).get("auth_token")?.value;
  const secret = process.env["JWT_SECRET"];

  if (!token || !secret) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
    );

    if (!payload.sub) return null;

    return prisma.user.findFirst({
      where: {
        id: payload.sub,
        currentToken: token,
        status: "ACTIVE",
        deletedAt: null,
      },
      include: { institution: true, role: true },
    });
  } catch {
    return null;
  }
}
