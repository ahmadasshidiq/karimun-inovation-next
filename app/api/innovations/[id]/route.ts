import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

const serialize = (item: Awaited<ReturnType<typeof findInnovation>>) => {
  if (!item) return null;
  return {
    ...item,
    latitude: item.latitude?.toString() ?? "",
    longitude: item.longitude?.toString() ?? "",
    initiatorType: item.initiatorType ?? "",
    initiatorName: item.initiatorName ?? "",
    type: item.type ?? "",
    stage: item.stage ?? "",
    classification: item.classification ?? "",
    innovationForm: item.innovationForm ?? "",
    thematic: item.thematic ?? "",
    pkpnCluster: item.pkpnCluster ?? "",
    pkpnSubCluster: item.pkpnSubCluster ?? "",
    governmentAffairs: item.governmentAffairs ?? "",
    trialPeriod: item.trialPeriod?.toISOString().slice(0, 10) ?? "",
    implementationPeriod:
      item.implementationPeriod?.toISOString().slice(0, 10) ?? "",
    description: item.description ?? "",
    purpose: item.purpose ?? "",
  };
};

const findInnovation = (id: string) =>
  prisma.innovation.findFirst({
    where: { id, deletedAt: null },
    include: {
      createdBy: {
        select: { id: true, username: true, fullname: true, email: true },
      },
    },
  });

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await getAuthenticatedUser()))
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });

  const { id } = await context.params;
  const item = await findInnovation(id);
  if (!item)
    return NextResponse.json({ message: "Inovasi tidak ditemukan." }, { status: 404 });

  return NextResponse.json({ data: serialize(item) });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await getAuthenticatedUser()))
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });

  const { id } = await context.params;
  if (!(await findInnovation(id)))
    return NextResponse.json({ message: "Inovasi tidak ditemukan." }, { status: 404 });

  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const nullableDate = (value: unknown) =>
      value ? new Date(`${String(value)}T00:00:00.000Z`) : null;
    const nullableNumber = (value: unknown) =>
      value === "" || value === null || value === undefined ? null : Number(value);

    await prisma.innovation.update({
      where: { id },
      data: {
        name: String(payload.name || "").trim(),
        status: payload.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
        latitude: nullableNumber(payload.latitude),
        longitude: nullableNumber(payload.longitude),
        initiatorType: String(payload.initiatorType || "") || null,
        initiatorName: String(payload.initiatorName || "") || null,
        type: String(payload.type || "") || null,
        stage: String(payload.stage || "") || null,
        classification: String(payload.classification || "") || null,
        innovationForm: String(payload.innovationForm || "") || null,
        thematic: String(payload.thematic || "") || null,
        pkpnCluster: String(payload.pkpnCluster || "") || null,
        pkpnSubCluster: String(payload.pkpnSubCluster || "") || null,
        governmentAffairs: String(payload.governmentAffairs || "") || null,
        trialPeriod: nullableDate(payload.trialPeriod),
        implementationPeriod: nullableDate(payload.implementationPeriod),
        isDevelopment: Boolean(payload.isDevelopment),
        description: String(payload.description || "") || null,
        purpose: String(payload.purpose || "") || null,
      },
    });

    const item = await findInnovation(id);
    return NextResponse.json({ message: "Inovasi berhasil diperbarui.", data: serialize(item) });
  } catch {
    return NextResponse.json({ message: "Gagal memperbarui inovasi." }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await getAuthenticatedUser()))
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });

  const { id } = await context.params;
  const result = await prisma.innovation.updateMany({
    where: { id, deletedAt: null },
    data: { deletedAt: new Date() },
  });
  if (!result.count)
    return NextResponse.json({ message: "Inovasi tidak ditemukan." }, { status: 404 });

  return NextResponse.json({ message: "Inovasi berhasil dihapus." });
}
