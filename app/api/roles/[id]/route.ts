import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { MASTER_PERMISSIONS } from "@/lib/master-permission";
import { prisma } from "@/lib/prisma";

const isSuperAdmin = (user: Awaited<ReturnType<typeof getAuthenticatedUser>>) =>
  user?.role.name === "Super Admin";

const normalizePermissions = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  return MASTER_PERMISSIONS.flatMap((master) => {
    const entry = value.find(
      (item) => typeof item === "object" && item !== null && "model" in item && item.model === master.model,
    ) as { actions?: unknown } | undefined;
    const actions = Array.isArray(entry?.actions)
      ? entry.actions.filter(
          (action): action is string => typeof action === "string" && master.actions.includes(action),
        )
      : [];
    return actions.length ? [{ model: master.model, actions }] : [];
  });
};

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (!isSuperAdmin(await getAuthenticatedUser()))
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  const { id } = await context.params;
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role)
    return NextResponse.json({ message: "Role tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ data: role });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (!isSuperAdmin(await getAuthenticatedUser()))
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  const { id } = await context.params;
  const payload = (await request.json()) as { name?: string; permission?: unknown };
  const name = payload.name?.trim();
  if (!name)
    return NextResponse.json({ message: "Nama role wajib diisi." }, { status: 400 });

  const role = await prisma.role.findUnique({ where: { id } });
  if (!role)
    return NextResponse.json({ message: "Role tidak ditemukan." }, { status: 404 });
  const duplicate = await prisma.role.findFirst({
    where: { id: { not: id }, name: { equals: name, mode: "insensitive" } },
  });
  if (duplicate)
    return NextResponse.json({ message: "Nama role sudah digunakan." }, { status: 409 });

  const data = await prisma.role.update({
    where: { id },
    data: {
      name,
      permission:
        role.name === "Super Admin" ? { all: true } : normalizePermissions(payload.permission),
    },
  });
  return NextResponse.json({ message: "Role berhasil diperbarui.", data });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (!isSuperAdmin(await getAuthenticatedUser()))
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  const { id } = await context.params;
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role)
    return NextResponse.json({ message: "Role tidak ditemukan." }, { status: 404 });
  if (role.name === "Super Admin")
    return NextResponse.json({ message: "Role Super Admin tidak dapat dihapus." }, { status: 400 });

  try {
    await prisma.role.delete({ where: { id } });
    return NextResponse.json({ message: "Role berhasil dihapus." });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003")
      return NextResponse.json(
        { message: "Role masih digunakan oleh pengguna dan tidak dapat dihapus." },
        { status: 409 },
      );
    throw error;
  }
}
