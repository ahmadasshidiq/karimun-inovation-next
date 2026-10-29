import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import {
  innovationVisibilityScope,
  isSuperAdmin,
} from "@/lib/innovation-access";
import {
  getAssessmentScore,
  getInnovationVideo,
} from "@/lib/innovation-indicator";
import {
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
  const filterValue = (key: string) => {
    const value = request.nextUrl.searchParams.get(key)?.trim();
    return value && value !== "all" ? value : undefined;
  };
  const search = filterValue("search");
  const institutionId = filterValue("institutionId");
  const governmentAffairs = filterValue("governmentAffairs");
  const innovationForm = filterValue("innovationForm");
  const type = filterValue("type");
  const stage = filterValue("stage");
  const thematic = filterValue("thematic");
  const pkpnCluster = filterValue("pkpnCluster");
  const psn = filterValue("psn");

  // Database inovasi memuat inovasi se-Kabupaten Karimun; draft instansi lain
  // hanya terlihat oleh super admin.
  const baseWhere = { deletedAt: null, ...innovationVisibilityScope(user) };
  const where = {
    ...baseWhere,
    ...(search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : {}),
    ...(institutionId ? { createdBy: { institutionId } } : {}),
    ...(governmentAffairs ? { governmentAffairs } : {}),
    ...(innovationForm ? { innovationForm } : {}),
    ...(type ? { type } : {}),
    ...(stage ? { stage } : {}),
    ...(thematic ? { thematic } : {}),
    ...(pkpnCluster ? { pkpnCluster } : {}),
    ...(psn ? { psn } : {}),
  };

  const distinctOptions = (
    field:
      | "governmentAffairs"
      | "innovationForm"
      | "type"
      | "stage"
      | "thematic"
      | "pkpnCluster"
      | "psn",
  ) =>
    prisma.innovation
      .findMany({
        where: { ...baseWhere, [field]: { not: null } },
        select: { [field]: true },
        distinct: [field],
        orderBy: { [field]: "asc" },
      })
      .then((rows) =>
        rows
          .map((row) => (row as unknown as Record<string, string | null>)[field])
          .filter((value): value is string => Boolean(value?.trim())),
      );

  const [records, total, institutions, ...fieldOptions] = await Promise.all([
    prisma.innovation.findMany({
      where,
      include: {
        createdBy: { select: { institution: { select: { name: true } } } },
        indicatorAssessments: {
          select: {
            indicatorId: true,
            score: true,
            reviewStatus: true,
            documents: {
              where: {
                OR: [
                  { mimeType: { startsWith: "video/" } },
                  { mimeType: { startsWith: "image/" } },
                ],
              },
              select: { id: true, mimeType: true },
              orderBy: { createdAt: "asc" },
            },
          },
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
    prisma.institution.findMany({
      where: {
        deletedAt: null,
        users: { some: { innovations: { some: baseWhere } } },
      },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    distinctOptions("governmentAffairs"),
    distinctOptions("innovationForm"),
    distinctOptions("type"),
    distinctOptions("stage"),
    distinctOptions("thematic"),
    distinctOptions("pkpnCluster"),
    distinctOptions("psn"),
  ]);
  const [
    governmentAffairOptions,
    innovationFormOptions,
    typeOptions,
    stageOptions,
    thematicOptions,
    pkpnClusterOptions,
    psnOptions,
  ] = fieldOptions;

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
    video: getInnovationVideo(record.id, record.indicatorAssessments),
  }));

  return NextResponse.json({
    data,
    total,
    canOpenDetail: isSuperAdmin(user),
    options: {
      institutions,
      governmentAffairs: governmentAffairOptions,
      innovationForms: innovationFormOptions,
      types: typeOptions,
      stages: stageOptions,
      thematics: thematicOptions,
      pkpnClusters: pkpnClusterOptions,
      psns: psnOptions,
    },
  });
}
