import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!(await getAuthenticatedUser()))
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  const data = await prisma.dashboardConfiguration.findFirst({ orderBy: { createdAt: "asc" } });
  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest) {
  if (!(await getAuthenticatedUser()))
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  const payload = (await request.json()) as { countdownTarget?: string; countdownActive?: boolean };
  const target = payload.countdownTarget ? new Date(payload.countdownTarget) : null;
  if (!target || Number.isNaN(target.getTime()))
    return NextResponse.json({ message: "Tanggal target hitungan mundur wajib diisi." }, { status: 400 });
  const existing = await prisma.dashboardConfiguration.findFirst({ orderBy: { createdAt: "asc" } });
  const data = existing
    ? await prisma.dashboardConfiguration.update({
        where: { id: existing.id },
        data: { countdownTarget: target, countdownActive: Boolean(payload.countdownActive) },
      })
    : await prisma.dashboardConfiguration.create({
        data: { countdownTarget: target, countdownActive: Boolean(payload.countdownActive) },
      });
  return NextResponse.json({ message: "Konfigurasi dashboard berhasil disimpan.", data });
}
