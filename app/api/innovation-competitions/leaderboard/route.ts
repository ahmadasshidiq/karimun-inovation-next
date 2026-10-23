import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import {
  getActiveCompetitionPeriod,
  SUBMISSION_PERMISSION_MODELS,
  SUBMISSION_STATUSES,
  SUBMISSION_TRACKS,
} from "@/lib/innovation-submission";
import { hasPermission } from "@/lib/permission";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }
  if (
    !hasPermission(
      user.role.permission,
      SUBMISSION_PERMISSION_MODELS.COMPETITION,
      "get-all",
    )
  ) {
    return NextResponse.json(
      { message: "Anda tidak memiliki akses ke papan peringkat." },
      { status: 403 },
    );
  }

  const params = request.nextUrl.searchParams;
  const page = Math.max(1, Number(params.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(params.get("limit")) || 10));
  const filterValue = (key: string) => {
    const value = params.get(key)?.trim();
    return value && value !== "all" ? value : undefined;
  };
  const category = filterValue("category");

  const periods = await prisma.competitionPeriod.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true },
    orderBy: { startDate: "desc" },
  });
  // Tanpa pilihan periode, tampilkan periode yang sedang dibuka atau yang terbaru.
  const period =
    periods.find((item) => item.id === filterValue("periodId")) ??
    (await getActiveCompetitionPeriod()) ??
    periods[0] ??
    null;

  if (!period) {
    return NextResponse.json({
      data: [],
      total: 0,
      period: null,
      options: { periods },
    });
  }

  const submissions = await prisma.innovationSubmission.findMany({
    where: {
      track: SUBMISSION_TRACKS.COMPETITION,
      status: SUBMISSION_STATUSES.ACCEPTED,
      periodId: period.id,
      innovation: { deletedAt: null, ...(category ? { category } : {}) },
    },
    select: {
      id: true,
      submittedAt: true,
      innovation: {
        select: {
          id: true,
          name: true,
          category: true,
          stage: true,
          createdBy: { select: { institution: { select: { name: true } } } },
          indicatorAssessments: { select: { score: true } },
        },
      },
    },
  });

  // Peringkat membutuhkan skor seluruh peserta, jadi diurutkan setelah skor dihitung.
  const ranked = submissions
    .map((submission) => ({
      id: submission.id,
      innovationId: submission.innovation.id,
      innovationName: submission.innovation.name,
      institution: submission.innovation.createdBy.institution.name,
      category: submission.innovation.category,
      stage: submission.innovation.stage,
      submittedAt: submission.submittedAt,
      score: submission.innovation.indicatorAssessments.reduce(
        (total, assessment) => total + Number(assessment.score),
        0,
      ),
    }))
    .sort(
      (a, b) =>
        b.score - a.score || a.submittedAt.getTime() - b.submittedAt.getTime(),
    )
    .map((item, _index, items) => ({
      ...item,
      // Skor yang sama mendapat peringkat yang sama (1, 2, 2, 4).
      rank: items.findIndex((other) => other.score === item.score) + 1,
      submittedAt: item.submittedAt.toISOString(),
    }));

  const offset = (page - 1) * limit;

  return NextResponse.json({
    data: ranked.slice(offset, offset + limit),
    total: ranked.length,
    period: { id: period.id, name: period.name },
    options: { periods },
  });
}
