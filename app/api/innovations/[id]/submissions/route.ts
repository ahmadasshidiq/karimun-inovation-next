import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { innovationOwnerScope } from "@/lib/innovation-access";
import {
  getMissingMandatoryIndicators,
  MANDATORY_INDICATOR_IDS,
  MANDATORY_INDICATORS,
} from "@/lib/innovation-indicator";
import {
  ACTIVE_SUBMISSION_STATUSES,
  getActiveCompetitionPeriod,
  isSubmissionTrack,
  SUBMISSION_PERMISSION_MODELS,
  SUBMISSION_TRACK_LABELS,
  SUBMISSION_TRACKS,
} from "@/lib/innovation-submission";
import { hasPermission } from "@/lib/permission";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }

  const payload = (await request.json()) as { track?: unknown };
  if (!isSubmissionTrack(payload.track)) {
    return NextResponse.json(
      { message: "Jalur pengajuan tidak valid." },
      { status: 400 },
    );
  }
  const track = payload.track;
  if (
    !hasPermission(
      user.role.permission,
      SUBMISSION_PERMISSION_MODELS[track],
      "submit",
    )
  ) {
    return NextResponse.json(
      {
        message: `Anda tidak memiliki akses mengirim ${SUBMISSION_TRACK_LABELS[track]}.`,
      },
      { status: 403 },
    );
  }

  const { id } = await context.params;
  const innovation = await prisma.innovation.findFirst({
    where: { id, deletedAt: null, ...innovationOwnerScope(user) },
    select: {
      id: true,
      indicatorAssessments: {
        where: { indicatorId: { in: MANDATORY_INDICATOR_IDS } },
        select: { indicatorId: true, _count: { select: { documents: true } } },
      },
    },
  });
  if (!innovation) {
    return NextResponse.json(
      { message: "Inovasi tidak ditemukan." },
      { status: 404 },
    );
  }
  const missingIndicators = getMissingMandatoryIndicators(
    innovation.indicatorAssessments.map((assessment) => ({
      indicatorId: assessment.indicatorId,
      documentCount: assessment._count.documents,
    })),
  );
  if (missingIndicators.length > 0) {
    const names = missingIndicators
      .map(
        (indicatorId) =>
          MANDATORY_INDICATORS[indicatorId as keyof typeof MANDATORY_INDICATORS],
      )
      .join(", ");
    return NextResponse.json(
      { message: `Lengkapi indikator wajib terlebih dahulu: ${names}.` },
      { status: 400 },
    );
  }

  const period =
    track === SUBMISSION_TRACKS.COMPETITION
      ? await getActiveCompetitionPeriod()
      : null;
  if (track === SUBMISSION_TRACKS.COMPETITION && !period) {
    return NextResponse.json(
      { message: "Pengajuan lomba hanya dapat dilakukan saat periode lomba dibuka." },
      { status: 400 },
    );
  }

  const duplicate = await prisma.innovationSubmission.findFirst({
    where: {
      innovationId: id,
      track,
      status: { in: ACTIVE_SUBMISSION_STATUSES },
      ...(period ? { periodId: period.id } : {}),
    },
    select: { id: true },
  });
  if (duplicate) {
    return NextResponse.json(
      { message: `Inovasi sudah dikirim sebagai ${SUBMISSION_TRACK_LABELS[track]}.` },
      { status: 409 },
    );
  }

  const submission = await prisma.innovationSubmission.create({
    data: {
      innovationId: id,
      track,
      periodId: period?.id ?? null,
      submittedById: user.id,
    },
  });

  return NextResponse.json(
    {
      message: `Inovasi berhasil dikirim sebagai ${SUBMISSION_TRACK_LABELS[track]}.`,
      data: submission,
    },
    { status: 201 },
  );
}
