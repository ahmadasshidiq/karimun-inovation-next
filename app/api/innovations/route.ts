import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { innovationOwnerScope } from "@/lib/innovation-access";
import {
  getAssessmentScore,
  getMissingMandatoryIndicators,
  MANDATORY_INDICATOR_IDS,
  VIDEO_INDICATOR_ID,
} from "@/lib/innovation-indicator";
import {
  ACTIVE_SUBMISSION_STATUSES,
  getActiveCompetitionPeriod,
  SUBMISSION_PERMISSION_MODELS,
  SUBMISSION_TRACKS,
} from "@/lib/innovation-submission";
import { hasPermission } from "@/lib/permission";
import {
  ensureMinioBucket,
  getMinioClient,
  minioBucket,
  minioPublicUrl,
} from "@/lib/minio";
import { prisma } from "@/lib/prisma";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const assessmentGroups = [
  { subject: "Kelembagaan", indicators: [1, 2, 3, 4, 5], maximumScore: 10 },
  { subject: "Tata Kelola", indicators: [6, 7, 8, 9, 10], maximumScore: 6 },
  { subject: "Pelayanan", indicators: [11, 12, 13, 14, 15], maximumScore: 7 },
  { subject: "Dampak", indicators: [16, 17, 18], maximumScore: 8 },
  { subject: "Keberlanjutan", indicators: [19, 20], maximumScore: 6 },
];

const documentUrl = (innovationId: string, documentId: string) =>
  `/api/innovations/${innovationId}/indicators/${VIDEO_INDICATOR_ID}/documents/${documentId}`;

// Video diambil dari dokumen indikator video; gambar pertama dipakai sebagai cover.
const getInnovationVideo = (
  innovationId: string,
  assessments: {
    indicatorId: number;
    documents: { id: string; mimeType: string }[];
  }[],
) => {
  const documents =
    assessments.find(
      (assessment) => assessment.indicatorId === VIDEO_INDICATOR_ID,
    )?.documents ?? [];
  const video = documents.find((document) =>
    document.mimeType.startsWith("video/"),
  );
  if (!video) return null;
  const poster = documents.find((document) =>
    document.mimeType.startsWith("image/"),
  );

  return {
    url: documentUrl(innovationId, video.id),
    posterUrl: poster ? documentUrl(innovationId, poster.id) : null,
  };
};

const dateOnly = (value: Date | null) =>
  value ? value.toISOString().slice(0, 10) : "";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user)
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });

  const params = request.nextUrl.searchParams;
  const category = params.get("category");
  const page = Math.max(1, Number(params.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(params.get("limit")) || 10));
  const filterValue = (key: string) => {
    const value = params.get(key)?.trim();
    return value && value !== "all" ? value : undefined;
  };
  const search = filterValue("search");
  const submissionStatus = filterValue("submissionStatus");
  const innovationForm = filterValue("innovationForm");
  const governmentAffair = filterValue("governmentAffair");
  const initiator = filterValue("initiator");
  const stage = filterValue("stage");

  const baseWhere = {
    deletedAt: null,
    ...innovationOwnerScope(user),
    ...(category ? { category } : {}),
  };
  const where = {
    ...baseWhere,
    ...(search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : {}),
    ...(submissionStatus ? { submissionStatus } : {}),
    ...(innovationForm ? { innovationForm } : {}),
    ...(governmentAffair ? { governmentAffairs: governmentAffair } : {}),
    ...(initiator ? { initiatorName: initiator } : {}),
    ...(stage ? { stage } : {}),
  };

  const [records, governmentAffairOptions, initiatorOptions, activePeriod] =
    await Promise.all([
      prisma.innovation.findMany({
        where,
        include: {
          createdBy: { include: { institution: true } },
          indicatorAssessments: {
            select: {
              indicatorId: true,
              score: true,
              reviewStatus: true,
              _count: { select: { documents: true } },
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
            where: { status: { in: ACTIVE_SUBMISSION_STATUSES } },
            select: { track: true, periodId: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.innovation.findMany({
        where: { ...baseWhere, governmentAffairs: { not: null } },
        distinct: ["governmentAffairs"],
        select: { governmentAffairs: true },
        orderBy: { governmentAffairs: "asc" },
      }),
      prisma.innovation.findMany({
        where: { ...baseWhere, initiatorName: { not: null } },
        distinct: ["initiatorName"],
        select: { initiatorName: true },
        orderBy: { initiatorName: "asc" },
      }),
      getActiveCompetitionPeriod(),
    ]);

  const innovations = records.map((item) => {
    const awardFile = Array.isArray(item.files)
      ? item.files.find(
        (file) =>
          typeof file === "object" &&
          file !== null &&
          "category" in file &&
          file.category === "award",
      )
      : null;

    return {
      id: item.id,
      submissionStatus: item.submissionStatus,
      approvalStatus: item.approvalStatus,
      approvalNote: item.approvalNote,
      organization: item.createdBy.institution.name,
      innovationName: item.name,
      innovationForm: item.innovationForm || "-",
      governmentAffair: item.governmentAffairs || "-",
      psn: item.psn || "-",
      initiator: item.initiatorName || "-",
      stage: item.stage || "-",
      trialDate: dateOnly(item.trialPeriod),
      ImplementationDate: dateOnly(item.implementationPeriod),
      DevelopmentDate: item.isDevelopment ? dateOnly(item.updatedAt) : "",
      latitude: item.latitude?.toString() || "",
      longitude: item.longitude?.toString() || "",
      awardFileUrl:
        awardFile &&
        typeof awardFile === "object" &&
        "url" in awardFile &&
        typeof awardFile.url === "string"
          ? awardFile.url
          : "",
      awarded: Boolean(awardFile),
      video: getInnovationVideo(item.id, item.indicatorAssessments),
      mandatoryIndicatorsFulfilled:
        MANDATORY_INDICATOR_IDS.length -
        getMissingMandatoryIndicators(
          item.indicatorAssessments.map((assessment) => ({
            indicatorId: assessment.indicatorId,
            documentCount: assessment._count.documents,
            reviewStatus: assessment.reviewStatus,
          })),
        ).length,
      contractSubmitted: item.submissions.some(
        (submission) => submission.track === SUBMISSION_TRACKS.CONTRACT,
      ),
      competitionSubmitted: item.submissions.some(
        (submission) =>
          submission.track === SUBMISSION_TRACKS.COMPETITION &&
          submission.periodId === activePeriod?.id,
      ),
      skor: ["PENDING_REVIEW", "APPROVED"].includes(item.approvalStatus)
        ? item.indicatorAssessments.reduce(
            (total, assessment) => total + getAssessmentScore(assessment),
            0,
          )
        : 0,
    };
  });

  // Data sudah difilter di database; summary dihitung dari seluruh hasil filter.
  const offset = (page - 1) * limit;
  const totalScore = innovations.reduce((total, item) => total + item.skor, 0);
  const innovationCount = innovations.length;
  const assessmentData = assessmentGroups.map((group) => {
    const score = records.reduce(
      (total, innovation) =>
        total +
        innovation.indicatorAssessments.reduce(
          (subtotal, assessment) =>
            group.indicators.includes(assessment.indicatorId)
              ? subtotal + getAssessmentScore(assessment)
              : subtotal,
          0,
        ),
      0,
    );
    const maximumScore = group.maximumScore * innovationCount;

    return {
      subject: group.subject,
      score,
      maximumScore,
      value: maximumScore > 0 ? (score / maximumScore) * 100 : 0,
    };
  });

  return NextResponse.json({
    data: innovations.slice(offset, offset + limit).map((item, index) => ({
      ...item,
      number: offset + index + 1,
    })),
    total: innovations.length,
    summary: {
      total: innovations.length,
      initiative: innovations.filter((item) => item.stage === "Inisiatif").length,
      trial: innovations.filter((item) => item.stage === "Uji Coba").length,
      implementation: innovations.filter((item) => item.stage === "Penerapan").length,
      award: innovations.filter((item) => item.awarded).length,
      totalScore,
      averageScore: innovations.length > 0 ? totalScore / innovations.length : 0,
    },
    mapData: innovations
      .filter(
        (item) =>
          Number.isFinite(Number(item.latitude)) &&
          Number.isFinite(Number(item.longitude)) &&
          item.latitude !== "" &&
          item.longitude !== "",
      )
      .map((item) => ({
        id: item.id,
        name: item.innovationName,
        institution: item.organization,
        latitude: Number(item.latitude),
        longitude: Number(item.longitude),
      })),
    assessmentData,
    submissionAccess: {
      contract: hasPermission(
        user.role.permission,
        SUBMISSION_PERMISSION_MODELS.CONTRACT,
        "submit",
      ),
      competition: hasPermission(
        user.role.permission,
        SUBMISSION_PERMISSION_MODELS.COMPETITION,
        "submit",
      ),
    },
    activeCompetitionPeriod: activePeriod
      ? {
          id: activePeriod.id,
          name: activePeriod.name,
          endDate: dateOnly(activePeriod.endDate),
        }
      : null,
    options: {
      governmentAffairs: governmentAffairOptions
        .map((item) => item.governmentAffairs)
        .filter((value): value is string => Boolean(value?.trim())),
      initiators: initiatorOptions
        .map((item) => item.initiatorName)
        .filter((value): value is string => Boolean(value?.trim())),
    },
  });
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user)
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });

  try {
    const formData = await request.formData();
    const rawPayload = formData.get("payload");
    if (typeof rawPayload !== "string") {
      return NextResponse.json({ message: "Data inovasi tidak valid." }, { status: 400 });
    }

    const payload = JSON.parse(rawPayload) as Record<string, unknown>;
    if (!String(payload.name || "").trim()) {
      return NextResponse.json({ message: "Nama inovasi wajib diisi." }, { status: 400 });
    }

    const categories = ["budget", "business-profile", "haki", "award"];
    const storedFiles: Array<Record<string, string | number>> = [];
    for (let index = 0; index < categories.length; index += 1) {
      const file = formData.get(`file_${index}`);
      if (!(file instanceof File) || file.size === 0) continue;
      if (file.type !== "application/pdf" || file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { message: "Dokumen harus berupa PDF dengan ukuran maksimal 2 MB." },
          { status: 400 },
        );
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const objectName = `innovations/${user.id}/${crypto.randomUUID()}-${safeName}`;
      await ensureMinioBucket();
      await getMinioClient().putObject(
        minioBucket,
        objectName,
        Buffer.from(await file.arrayBuffer()),
        file.size,
        { "Content-Type": file.type },
      );
      storedFiles.push({
        category: categories[index],
        name: file.name,
        size: file.size,
        objectName,
        url: minioPublicUrl(objectName),
      });
    }

    const nullableDate = (value: unknown) =>
      value ? new Date(`${String(value)}T00:00:00.000Z`) : null;
    const nullableNumber = (value: unknown) =>
      value === "" || value === null || value === undefined
        ? null
        : Number(value);

    const innovation = await prisma.innovation.create({
      data: {
        name: String(payload.name).trim(),
        latitude: nullableNumber(payload.latitude),
        longitude: nullableNumber(payload.longitude),
        status: payload.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
        submissionStatus: ["DRAFT", "SUBMITTED", "INCOMPLETE"].includes(String(payload.submissionStatus)) ? String(payload.submissionStatus) : "INCOMPLETE",
        approvalStatus: "PENDING_REVIEW",
        approvalNote: null,
        approvedById: null,
        approvedAt: null,
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
        files: storedFiles,
        createdById: user.id,
      },
    });

    return NextResponse.json(
      { message: "Inovasi berhasil disimpan.", data: { id: innovation.id } },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create innovation failed", error);
    return NextResponse.json({ message: "Gagal menyimpan inovasi." }, { status: 500 });
  }
}
