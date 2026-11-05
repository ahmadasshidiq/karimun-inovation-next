import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { hasPermission } from "@/lib/permission";
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
      include: {
        institution: { include: { nomenclature: true } },
        role: true,
      },
    });
  } catch {
    return null;
  }
}

export async function requirePermission(model: string, action: string) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        { message: "Sesi tidak valid." },
        { status: 401 },
      ),
    } as const;
  }

  if (!hasPermission(user.role.permission, model, action)) {
    return {
      user: null,
      response: NextResponse.json(
        { message: "Anda tidak memiliki akses untuk tindakan ini." },
        { status: 403 },
      ),
    } as const;
  }

  return { user, response: null } as const;
}

type AuthenticatedUser = NonNullable<
  Awaited<ReturnType<typeof getAuthenticatedUser>>
>;

const isPrivilegedRole = (role: { name: string; permission: unknown }) =>
  role.name === "Super Admin" ||
  (typeof role.permission === "object" &&
    role.permission !== null &&
    (role.permission as { all?: unknown }).all === true);

export async function canManageRole(
  actor: AuthenticatedUser,
  roleIds: string[],
) {
  if (isPrivilegedRole(actor.role)) return true;

  const roles = await prisma.role.findMany({
    where: { id: { in: roleIds } },
    select: { name: true, permission: true },
  });

  return !roles.some(isPrivilegedRole);
}
