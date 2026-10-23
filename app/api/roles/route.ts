import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { MASTER_PERMISSIONS } from "@/lib/master-permission";
import { prisma } from "@/lib/prisma";

const isSuperAdmin = (user: Awaited<ReturnType<typeof getAuthenticatedUser>>) =>
  user?.role.name === "Super Admin";

const normalizePermissions = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  return MASTER_PERMISSIONS.map((master) => {
    const entry = value.find(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "model" in item &&
        item.model === master.model,
    ) as { actions?: unknown } | undefined;
    const actions = Array.isArray(entry?.actions)
      ? entry.actions.filter(
          (action): action is string =>
            typeof action === "string" && master.actions.includes(action),
        )
      : [];
    return actions.length ? { model: master.model, actions } : null;
  }).filter((item) => item !== null);
};

export async function GET(request: NextRequest) {
  if (!isSuperAdmin(await getAuthenticatedUser()))
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });

  const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 10));
  const search = request.nextUrl.searchParams.get("search")?.trim() || "";
  const where = search
    ? { name: { contains: search, mode: "insensitive" as const } }
    : {};
  const [data, total] = await Promise.all([
    prisma.role.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.role.count({ where }),
  ]);

  return NextResponse.json({ data, total });
}

export async function POST(request: NextRequest) {
  if (!isSuperAdmin(await getAuthenticatedUser()))
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });

  const payload = (await request.json()) as { name?: string; permission?: unknown };
  const name = payload.name?.trim();
  if (!name)
    return NextResponse.json({ message: "Nama role wajib diisi." }, { status: 400 });

  const duplicate = await prisma.role.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });
  if (duplicate)
    return NextResponse.json({ message: "Nama role sudah digunakan." }, { status: 409 });

  const role = await prisma.role.create({
    data: { name, permission: normalizePermissions(payload.permission) },
  });
  return NextResponse.json({ message: "Role berhasil dibuat.", data: role }, { status: 201 });
}
