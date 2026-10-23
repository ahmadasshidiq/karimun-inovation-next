import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import {
  findOverlappingPeriod,
  parsePeriodPayload,
  periodSelect,
  toPeriodDto,
} from "@/lib/innovation-submission";
import { hasPermission } from "@/lib/permission";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }
  if (!hasPermission(user.role.permission, "competition-periods", "get-all")) {
    return NextResponse.json(
      { message: "Anda tidak memiliki akses ke periode lomba." },
      { status: 403 },
    );
  }

  const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 10),
  );
  const search = request.nextUrl.searchParams.get("search")?.trim() || "";

  const where = {
    deletedAt: null,
    ...(search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : {}),
  };

  const [data, total] = await Promise.all([
    prisma.competitionPeriod.findMany({
      where,
      select: periodSelect,
      orderBy: { startDate: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.competitionPeriod.count({ where }),
  ]);

  return NextResponse.json({ data: data.map(toPeriodDto), total });
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }
  if (!hasPermission(user.role.permission, "competition-periods", "create")) {
    return NextResponse.json(
      { message: "Anda tidak memiliki akses ke periode lomba." },
      { status: 403 },
    );
  }

  const parsed = parsePeriodPayload(
    (await request.json()) as Record<string, unknown>,
  );
  if (!parsed.data) {
    return NextResponse.json({ message: parsed.error }, { status: 400 });
  }

  const overlap = await findOverlappingPeriod(
    parsed.data.startDate,
    parsed.data.endDate,
  );
  if (overlap) {
    return NextResponse.json(
      { message: `Tanggal bertabrakan dengan periode "${overlap.name}".` },
      { status: 409 },
    );
  }

  const period = await prisma.competitionPeriod.create({
    data: parsed.data,
    select: periodSelect,
  });

  return NextResponse.json(
    { message: "Periode lomba berhasil dibuat.", data: toPeriodDto(period) },
    { status: 201 },
  );
}
