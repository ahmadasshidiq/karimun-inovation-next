import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { innovationOwnerScope } from "@/lib/innovation-access";
import { getAssessmentScore } from "@/lib/innovation-indicator";
import {
  SUBMISSION_PERMISSION_MODELS,
  SUBMISSION_STATUSES,
  SUBMISSION_TRACKS,
} from "@/lib/innovation-submission";
import { hasPermission } from "@/lib/permission";
import { prisma } from "@/lib/prisma";

const dateOnly = (value: Date | null) =>
  value ? value.toISOString().slice(0, 10) : "";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }
  if (!hasPermission(user.role.permission, "dashboard", "view")) {
    return NextResponse.json(
      { message: "Anda tidak memiliki akses ke dashboard." },
      { status: 403 },
    );
  }

  const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 5),
  );
  // Verifikator melihat inovasi semua instansi, pengguna lain hanya instansinya.
  const canVerify = Object.values(SUBMISSION_PERMISSION_MODELS).some((model) =>
    hasPermission(user.role.permission, model, "verify"),
  );

  const where = {
    deletedAt: null,
    ...(canVerify ? {} : innovationOwnerScope(user)),
    submissions: { some: { status: { not: SUBMISSION_STATUSES.CANCELLED } } },
  };

  const [records, total] = await Promise.all([
    prisma.innovation.findMany({
      where,
      include: {
        createdBy: { select: { institution: { select: { name: true } } } },
        indicatorAssessments: {
          select: { score: true, reviewStatus: true },
        },
        submissions: {
          where: { status: { not: SUBMISSION_STATUSES.CANCELLED } },
          include: { period: { select: { name: true } } },
          orderBy: { submittedAt: "desc" },
        },
      },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.innovation.count({ where }),
  ]);

  const toResult = (
    submission: (typeof records)[number]["submissions"][number] | undefined,
  ) =>
    submission
      ? {
          status: submission.status,
          periodName: submission.period?.name ?? null,
          submittedAt: submission.submittedAt.toISOString(),
          reviewedAt: submission.reviewedAt?.toISOString() ?? null,
          reviewNote: submission.reviewNote,
        }
      : null;

  const data = records.map((record, index) => ({
    id: record.id,
    number: (page - 1) * limit + index + 1,
    name: record.name,
    institution: record.createdBy.institution.name,
    stage: record.stage,
    innovationForm: record.innovationForm,
    governmentAffairs: record.governmentAffairs,
    initiatorName: record.initiatorName,
    trialPeriod: dateOnly(record.trialPeriod),
    implementationPeriod: dateOnly(record.implementationPeriod),
    description: record.description,
    purpose: record.purpose,
    score: record.indicatorAssessments.reduce(
      (sum, assessment) => sum + getAssessmentScore(assessment),
      0,
    ),
    contract: toResult(
      record.submissions.find(
        (submission) => submission.track === SUBMISSION_TRACKS.CONTRACT,
      ),
    ),
    competition: toResult(
      record.submissions.find(
        (submission) => submission.track === SUBMISSION_TRACKS.COMPETITION,
      ),
    ),
  }));

  return NextResponse.json({ data, total });
}
