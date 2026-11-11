import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { syncInnovationSubmissionStatus } from "@/lib/innovation-completeness";
import {
  innovationEditScope,
  innovationOwnerScope,
  innovationVisibilityScope,
} from "@/lib/innovation-access";
import { hasPermission } from "@/lib/permission";
import {
  canReviewIndicators,
  getAssessmentScore,
  resetIndicatorReview,
} from "@/lib/innovation-indicator";
import { prisma } from "@/lib/prisma";
import { withAudit } from "@/lib/audit-log";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getAuthenticatedUser();
  if (!user)
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });

  const { id } = await context.params;
  const canReview = canReviewIndicators(user.role.permission);
  if (
    !canReview &&
    !hasPermission(user.role.permission, "innovation-indicators", "get-all")
  )
    return NextResponse.json(
      { message: "Anda tidak memiliki akses untuk tindakan ini." },
      { status: 403 },
    );
  const data = await prisma.innovationIndicatorAssessment.findMany({
    where: {
      innovationId: id,
      innovation: {
        deletedAt: null,
        // Verifikator tidak dapat membuka indikator draft instansi lain.
        ...(canReview
          ? innovationVisibilityScope(user)
          : innovationOwnerScope(user)),
      },
    },
    include: {
      documents: { orderBy: { createdAt: "asc" } },
      reviewedBy: { select: { fullname: true } },
    },
    orderBy: { indicatorId: "asc" },
  });

  return NextResponse.json({
    canReview,
    data: data.map((item) => ({
      indicatorId: item.indicatorId,
      parameter: item.parameter,
      score: getAssessmentScore(item),
      weight: Number(item.score),
      review: {
        status: item.reviewStatus,
        note: item.reviewNote || "",
        reviewedBy: item.reviewedBy?.fullname || "",
        reviewedAt: item.reviewedAt?.toISOString() || "",
      },
      documents: item.documents.map((document) => ({
        id: document.id,
        documentNumber: document.documentNumber || "",
        documentDate: document.documentDate?.toISOString().slice(0, 10) || "",
        documentTitle: document.documentTitle,
        originalName: document.originalName,
        url: document.url,
        mimeType: document.mimeType,
        size: document.size,
      })),
    })),
  });
}

async function handlePut(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getAuthenticatedUser();
  if (!user)
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  if (!hasPermission(user.role.permission, "innovation-indicators", "update"))
    return NextResponse.json(
      { message: "Anda tidak memiliki akses untuk tindakan ini." },
      { status: 403 },
    );

  const { id } = await context.params;
  const payload = (await request.json()) as {
    indicatorId?: number;
    parameter?: string;
    score?: number;
  };
  if (
    !Number.isInteger(payload.indicatorId) ||
    !payload.indicatorId ||
    typeof payload.parameter !== "string" ||
    !payload.parameter.trim()
  )
    return NextResponse.json({ message: "Parameter indikator tidak valid." }, { status: 400 });

  const innovation = await prisma.innovation.findFirst({
    where: {
      id,
      deletedAt: null,
      ...innovationEditScope(user),
    },
    select: { id: true },
  });
  if (!innovation)
    return NextResponse.json({ message: "Inovasi tidak ditemukan." }, { status: 404 });

  const parameter = payload.parameter.trim();
  const current = await prisma.innovationIndicatorAssessment.findUnique({
    where: {
      innovationId_indicatorId: { innovationId: id, indicatorId: payload.indicatorId },
    },
    select: { parameter: true },
  });
  const assessment = await prisma.innovationIndicatorAssessment.upsert({
    where: {
      innovationId_indicatorId: { innovationId: id, indicatorId: payload.indicatorId },
    },
    create: {
      innovationId: id,
      indicatorId: payload.indicatorId,
      parameter,
      score: Number(payload.score) || 0,
    },
    update: {
      parameter,
      score: Number(payload.score) || 0,
      ...(current?.parameter !== parameter ? resetIndicatorReview : {}),
    },
  });
  await syncInnovationSubmissionStatus(id);

  return NextResponse.json({ message: "Parameter berhasil disimpan.", data: assessment });
}

export const PUT = withAudit("innovations/[id]/indicators", handlePut);
