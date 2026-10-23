import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { innovationOwnerScope } from "@/lib/innovation-access";
import {
  isSubmissionTrack,
  SUBMISSION_PERMISSION_MODELS,
  SUBMISSION_STATUSES,
  SUBMISSION_TRACKS,
  todayDate,
} from "@/lib/innovation-submission";
import { hasPermission } from "@/lib/permission";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }

  const params = request.nextUrl.searchParams;
  const track = params.get("track");
  if (!isSubmissionTrack(track)) {
    return NextResponse.json(
      { message: "Jalur pengajuan tidak valid." },
      { status: 400 },
    );
  }

  const permissionModel = SUBMISSION_PERMISSION_MODELS[track];
  if (!hasPermission(user.role.permission, permissionModel, "get-all")) {
    return NextResponse.json(
      { message: "Anda tidak memiliki akses ke data ini." },
      { status: 403 },
    );
  }
  const canVerify = hasPermission(
    user.role.permission,
    permissionModel,
    "verify",
  );
  const canCancel = hasPermission(
    user.role.permission,
    permissionModel,
    "cancel",
  );

  const page = Math.max(1, Number(params.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(params.get("limit")) || 10));
  const filterValue = (key: string) => {
    const value = params.get(key)?.trim();
    return value && value !== "all" ? value : undefined;
  };
  const search = filterValue("search");
  const status = filterValue("status");
  const category = filterValue("category");
  const periodId = filterValue("periodId");

  const where = {
    track,
    ...(status ? { status } : {}),
    ...(periodId ? { periodId } : {}),
    innovation: {
      deletedAt: null,
      // Verifikator memeriksa pengajuan dari semua instansi.
      ...(canVerify ? {} : innovationOwnerScope(user)),
      ...(category ? { category } : {}),
      ...(search
        ? { name: { contains: search, mode: "insensitive" as const } }
        : {}),
    },
  };

  const [records, total, periods] = await Promise.all([
    prisma.innovationSubmission.findMany({
      where,
      include: {
        innovation: {
          select: {
            id: true,
            name: true,
            category: true,
            stage: true,
            createdBy: { select: { institution: { select: { name: true } } } },
          },
        },
        period: { select: { id: true, name: true, endDate: true } },
        submittedBy: { select: { fullname: true } },
      },
      orderBy: { submittedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.innovationSubmission.count({ where }),
    track === SUBMISSION_TRACKS.COMPETITION
      ? prisma.competitionPeriod.findMany({
          where: { deletedAt: null },
          select: { id: true, name: true },
          orderBy: { startDate: "desc" },
        })
      : [],
  ]);

  const today = todayDate();
  const data = records.map((record, index) => ({
    id: record.id,
    number: (page - 1) * limit + index + 1,
    innovationId: record.innovation.id,
    innovationName: record.innovation.name,
    institution: record.innovation.createdBy.institution.name,
    category: record.innovation.category,
    stage: record.innovation.stage,
    period: record.period
      ? { id: record.period.id, name: record.period.name }
      : null,
    status: record.status,
    submittedAt: record.submittedAt.toISOString(),
    submittedBy: record.submittedBy.fullname,
    reviewNote: record.reviewNote,
    canCancel:
      canCancel &&
      record.status === SUBMISSION_STATUSES.SUBMITTED &&
      (!record.period || record.period.endDate >= today),
    canVerify: canVerify && record.status === SUBMISSION_STATUSES.SUBMITTED,
  }));

  return NextResponse.json({ data, total, options: { periods } });
}
