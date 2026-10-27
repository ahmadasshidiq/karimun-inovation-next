import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import {
  findDuplicateIndexYear,
  parseInnovationIndexPayload,
  toInnovationIndexDto,
} from "@/lib/innovation-index";
import { hasPermission } from "@/lib/permission";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }
  if (
    !hasPermission(user.role.permission, "dashboard-configurations", "get-by-id")
  ) {
    return NextResponse.json(
      { message: "Anda tidak memiliki akses ke konfigurasi dashboard." },
      { status: 403 },
    );
  }

  const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 10),
  );

  const [data, total] = await Promise.all([
    prisma.innovationIndex.findMany({
      orderBy: { year: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.innovationIndex.count(),
  ]);

  return NextResponse.json({ data: data.map(toInnovationIndexDto), total });
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }
  if (
    !hasPermission(user.role.permission, "dashboard-configurations", "update")
  ) {
    return NextResponse.json(
      { message: "Anda tidak memiliki akses ke konfigurasi dashboard." },
      { status: 403 },
    );
  }

  const parsed = parseInnovationIndexPayload(
    (await request.json()) as Record<string, unknown>,
  );
  if (!parsed.data) {
    return NextResponse.json({ message: parsed.error }, { status: 400 });
  }
  if (await findDuplicateIndexYear(parsed.data.year)) {
    return NextResponse.json(
      { message: `Nilai indeks tahun ${parsed.data.year} sudah ada.` },
      { status: 409 },
    );
  }

  const index = await prisma.innovationIndex.create({ data: parsed.data });

  return NextResponse.json(
    {
      message: "Nilai indeks berhasil ditambahkan.",
      data: toInnovationIndexDto(index),
    },
    { status: 201 },
  );
}
