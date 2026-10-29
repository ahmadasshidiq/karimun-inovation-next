import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import {
  findMissingIndicatorNames,
  getSubmitBlockMessage,
  resolveSubmissionStatus,
} from "@/lib/innovation-completeness";
import { innovationOwnerScope } from "@/lib/innovation-access";
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
    psn: item.psn ?? "",
    trialPeriod: item.trialPeriod?.toISOString().slice(0, 10) ?? "",
    implementationPeriod:
      item.implementationPeriod?.toISOString().slice(0, 10) ?? "",
    description: item.description ?? "",
    purpose: item.purpose ?? "",
  };
};

const findInnovation = (id: string, user: Awaited<ReturnType<typeof getAuthenticatedUser>>) =>
  prisma.innovation.findFirst({
    where: {
      id,
      deletedAt: null,
      ...(user ? innovationOwnerScope(user) : {}),
    },
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
  const user = await getAuthenticatedUser();
  if (!user)
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });

  const { id } = await context.params;
  const item = await findInnovation(id, user);
  if (!item)
    return NextResponse.json({ message: "Inovasi tidak ditemukan." }, { status: 404 });

  return NextResponse.json({ data: serialize(item) });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getAuthenticatedUser();
  if (!user)
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });

  const { id } = await context.params;
  if (!(await findInnovation(id, user)))
    return NextResponse.json({ message: "Inovasi tidak ditemukan." }, { status: 404 });

  try {
    const payload = (await request.json()) as Record<string, unknown>;
    if (!String(payload.name || "").trim()) {
      return NextResponse.json({ message: "Nama inovasi wajib diisi." }, { status: 400 });
    }
    const missingIndicatorNames = await findMissingIndicatorNames(id);
    const submitBlockMessage = getSubmitBlockMessage(payload, missingIndicatorNames);
    if (payload.submissionStatus === "SUBMITTED" && submitBlockMessage) {
      return NextResponse.json({ message: submitBlockMessage }, { status: 400 });
    }
    const nullableDate = (value: unknown) =>
      value ? new Date(`${String(value)}T00:00:00.000Z`) : null;
    const nullableNumber = (value: unknown) =>
      value === "" || value === null || value === undefined ? null : Number(value);

    await prisma.innovation.update({
      where: { id },
      data: {
        name: String(payload.name || "").trim(),
        status: payload.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
        submissionStatus: resolveSubmissionStatus(
          payload,
          missingIndicatorNames.length,
        ),
        approvalStatus: "PENDING_REVIEW",
        approvalNote: null,
        approvedById: null,
        approvedAt: null,
        latitude: nullableNumber(payload.latitude),
        longitude: nullableNumber(payload.longitude),
        initiatorType: String(payload.initiatorType || "") || null,
        initiatorName: String(payload.initiatorName || "") || null,
        type: String(payload.type || "") || null,
        stage: String(payload.stage || "") || null,
        classification: String(payload.classification || "") || null,
        category: String(payload.category || "") || null,
        innovationForm: String(payload.innovationForm || "") || null,
        thematic: String(payload.thematic || "") || null,
        pkpnCluster: String(payload.pkpnCluster || "") || null,
        pkpnSubCluster: String(payload.pkpnSubCluster || "") || null,
        governmentAffairs: String(payload.governmentAffairs || "") || null,
        psn: String(payload.psn || "") || null,
        trialPeriod: nullableDate(payload.trialPeriod),
        implementationPeriod: nullableDate(payload.implementationPeriod),
        isDevelopment: Boolean(payload.isDevelopment),
        description: String(payload.description || "") || null,
        purpose: String(payload.purpose || "") || null,
      },
    });

    const item = await findInnovation(id, user);
    return NextResponse.json({ message: "Inovasi berhasil diperbarui.", data: serialize(item) });
  } catch {
    return NextResponse.json({ message: "Gagal memperbarui inovasi." }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getAuthenticatedUser();
  if (!user)
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });

  const { id } = await context.params;
  const result = await prisma.innovation.updateMany({
    where: {
      id,
      deletedAt: null,
      ...innovationOwnerScope(user),
    },
    data: { deletedAt: new Date() },
  });
  if (!result.count)
    return NextResponse.json({ message: "Inovasi tidak ditemukan." }, { status: 404 });

  return NextResponse.json({ message: "Inovasi berhasil dihapus." });
}
