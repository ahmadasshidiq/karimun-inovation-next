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

type RouteContext = { params: Promise<{ id: string }> };

const findPeriod = (id: string) =>
  prisma.competitionPeriod.findFirst({
    where: { id, deletedAt: null },
    select: periodSelect,
  });

export async function GET(_request: NextRequest, context: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }
  if (!hasPermission(user.role.permission, "competition-periods", "get-by-id")) {
    return NextResponse.json(
      { message: "Anda tidak memiliki akses ke periode lomba." },
      { status: 403 },
    );
  }

  const { id } = await context.params;
  const period = await findPeriod(id);
  if (!period) {
    return NextResponse.json(
      { message: "Periode lomba tidak ditemukan." },
      { status: 404 },
    );
  }

  return NextResponse.json({ data: toPeriodDto(period) });
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }
  if (!hasPermission(user.role.permission, "competition-periods", "update")) {
    return NextResponse.json(
      { message: "Anda tidak memiliki akses ke periode lomba." },
      { status: 403 },
    );
  }

  const { id } = await context.params;
  if (!(await findPeriod(id))) {
    return NextResponse.json(
      { message: "Periode lomba tidak ditemukan." },
      { status: 404 },
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
    id,
  );
  if (overlap) {
    return NextResponse.json(
      { message: `Tanggal bertabrakan dengan periode "${overlap.name}".` },
      { status: 409 },
    );
  }

  const period = await prisma.competitionPeriod.update({
    where: { id },
    data: parsed.data,
    select: periodSelect,
  });

  return NextResponse.json({
    message: "Periode lomba berhasil diperbarui.",
    data: toPeriodDto(period),
  });
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }
  if (!hasPermission(user.role.permission, "competition-periods", "delete")) {
    return NextResponse.json(
      { message: "Anda tidak memiliki akses ke periode lomba." },
      { status: 403 },
    );
  }

  const { id } = await context.params;
  const period = await findPeriod(id);
  if (!period) {
    return NextResponse.json(
      { message: "Periode lomba tidak ditemukan." },
      { status: 404 },
    );
  }

  const submissionCount = await prisma.innovationSubmission.count({
    where: { periodId: id },
  });
  if (submissionCount > 0) {
    return NextResponse.json(
      { message: "Periode yang sudah memiliki pengajuan tidak dapat dihapus." },
      { status: 409 },
    );
  }

  await prisma.competitionPeriod.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json({ message: "Periode lomba berhasil dihapus." });
}
