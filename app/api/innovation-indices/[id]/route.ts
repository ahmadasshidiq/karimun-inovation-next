import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import {
  findDuplicateIndexYear,
  parseInnovationIndexPayload,
  toInnovationIndexDto,
} from "@/lib/innovation-index";
import { hasPermission } from "@/lib/permission";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

const forbidden = () =>
  NextResponse.json(
    { message: "Anda tidak memiliki akses ke konfigurasi dashboard." },
    { status: 403 },
  );

const notFound = () =>
  NextResponse.json(
    { message: "Nilai indeks tidak ditemukan." },
    { status: 404 },
  );

export async function PUT(request: NextRequest, context: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }
  if (
    !hasPermission(user.role.permission, "dashboard-configurations", "update")
  ) {
    return forbidden();
  }

  const { id } = await context.params;
  if (!(await prisma.innovationIndex.findUnique({ where: { id } }))) {
    return notFound();
  }

  const parsed = parseInnovationIndexPayload(
    (await request.json()) as Record<string, unknown>,
  );
  if (!parsed.data) {
    return NextResponse.json({ message: parsed.error }, { status: 400 });
  }
  if (await findDuplicateIndexYear(parsed.data.year, id)) {
    return NextResponse.json(
      { message: `Nilai indeks tahun ${parsed.data.year} sudah ada.` },
      { status: 409 },
    );
  }

  const index = await prisma.innovationIndex.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json({
    message: "Nilai indeks berhasil diperbarui.",
    data: toInnovationIndexDto(index),
  });
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }
  if (
    !hasPermission(user.role.permission, "dashboard-configurations", "update")
  ) {
    return forbidden();
  }

  const { id } = await context.params;
  if (!(await prisma.innovationIndex.findUnique({ where: { id } }))) {
    return notFound();
  }

  await prisma.innovationIndex.delete({ where: { id } });

  return NextResponse.json({ message: "Nilai indeks berhasil dihapus." });
}
