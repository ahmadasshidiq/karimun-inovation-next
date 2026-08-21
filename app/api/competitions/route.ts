import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

const unauthorized = () => NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return unauthorized();

  const params = request.nextUrl.searchParams;
  const page = Math.max(1, Number(params.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(params.get("limit")) || 10));
  const search = (params.get("search") || "").trim();
  const status = params.get("status") || "all";
  const stage = params.get("stage") || "all";
  const institutionId = params.get("institutionId") || "all";

  const period = await prisma.competitionPeriod.findFirst({
    where: { isActive: true },
    orderBy: { year: "desc" },
  });
  if (!period) return NextResponse.json({ period: null, data: [], total: 0, summary: {} });

  const where = {
    periodId: period.id,
    ...(status !== "all" ? { status: status as never } : {}),
    ...(institutionId !== "all" ? { institutionId } : {}),
    innovation: {
      deletedAt: null,
      ...(search ? { name: { contains: search, mode: "insensitive" as const } } : {}),
    },
  };
  const records = await prisma.competitionParticipant.findMany({
    where,
    include: { innovation: true, institution: true, judgeAssignments: true, assessments: true },
    orderBy: { createdAt: "desc" },
  });
  const filtered = records.filter((item) => {
    const itemStage = item.innovation.implementationPeriod ? "Penerapan" : item.innovation.trialPeriod ? "Uji Coba" : "Inisiatif";
    return stage === "all" || itemStage === stage;
  });
  const allStatuses = await prisma.competitionParticipant.groupBy({
    by: ["status"], where: { periodId: period.id }, _count: { _all: true },
  });
  const count = (value: string) => allStatuses.find((item) => item.status === value)?._count._all || 0;
  const offset = (page - 1) * limit;
  const data = filtered.slice(offset, offset + limit).map((item, index) => ({
    id: item.id,
    number: offset + index + 1,
    institutionId: item.institutionId,
    organization: item.institution.name,
    innovationName: item.innovation.name,
    governmentAffair: item.innovation.governmentAffairs || "-",
    stage: item.innovation.implementationPeriod ? "Penerapan" : item.innovation.trialPeriod ? "Uji Coba" : "Inisiatif",
    trialDate: item.innovation.trialPeriod?.toISOString().slice(0, 10) || "",
    ImplementationDate: item.innovation.implementationPeriod?.toISOString().slice(0, 10) || "",
    DevelopmentDate: item.innovation.isDevelopment ? item.innovation.updatedAt.toISOString().slice(0, 10) : "",
    score: Number(item.finalScore || 0),
    status: item.status,
    assessmentProgress: `${item.assessments.filter((assessment) => assessment.status === "SUBMITTED").length}/${item.judgeAssignments.length}`,
  }));

  return NextResponse.json({
    period,
    data,
    total: filtered.length,
    summary: {
      total: allStatuses.reduce((sum, item) => sum + item._count._all, 0),
      waiting: count("WAITING_VERIFICATION") + count("SUBMITTED") + count("RESUBMITTED"),
      revision: count("NEEDS_REVISION"),
      verified: count("VERIFIED"),
      assessing: count("UNDER_ASSESSMENT"),
      assessed: count("ASSESSED") + count("FINALIST"),
    },
  });
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return unauthorized();
  const body = await request.json().catch(() => ({}));
  const innovationId = typeof body.innovationId === "string" ? body.innovationId : "";
  const period = await prisma.competitionPeriod.findFirst({ where: { isActive: true } });
  if (!period) return NextResponse.json({ message: "Periode lomba aktif tidak ditemukan." }, { status: 400 });
  const innovation = await prisma.innovation.findFirst({
    where: { id: innovationId, deletedAt: null, createdBy: { institutionId: user.institutionId } },
  });
  if (!innovation) return NextResponse.json({ message: "Inovasi tidak tersedia untuk OPD Anda." }, { status: 404 });
  try {
    const participant = await prisma.competitionParticipant.create({
      data: { periodId: period.id, innovationId, institutionId: user.institutionId, createdById: user.id,
        activityLogs: { create: { userId: user.id, activity: "Inovasi didaftarkan", description: "Inovasi ditambahkan sebagai draft lomba." } } },
    });
    return NextResponse.json({ message: "Inovasi berhasil didaftarkan sebagai Draft Lomba.", data: participant }, { status: 201 });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") {
      return NextResponse.json({ message: "Inovasi ini sudah terdaftar pada periode yang sama." }, { status: 409 });
    }
    return NextResponse.json({ message: "Gagal mendaftarkan inovasi." }, { status: 500 });
  }
}

