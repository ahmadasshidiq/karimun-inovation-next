import {
  getAssessmentScore,
  INDICATOR_REVIEW_STATUSES,
  MANDATORY_INDICATOR_IDS,
} from "@/lib/innovation-indicator";
import { prisma } from "@/lib/prisma";

type CertificateCheckInput = {
  submissionStatus: string;
  indicatorAssessments: {
    indicatorId: number;
    reviewStatus: string;
    documentCount: number;
  }[];
};

// Bukti verifikasi tersedia jika inovasi sudah dikirim dan seluruh indikator wajib
// (bertanda *) memiliki dokumen serta sudah disetujui verifikator.
export const isCertificateEligible = (innovation: CertificateCheckInput) =>
  innovation.submissionStatus === "SUBMITTED" &&
  MANDATORY_INDICATOR_IDS.every((indicatorId) =>
    innovation.indicatorAssessments.some(
      (assessment) =>
        assessment.indicatorId === indicatorId &&
        assessment.documentCount > 0 &&
        assessment.reviewStatus === INDICATOR_REVIEW_STATUSES.APPROVED,
    ),
  );

// Nomor bukti diturunkan dari id inovasi agar stabil tanpa kolom tambahan.
export const getCertificateNumber = (innovationId: string, year: number) =>
  `BVI/${year}/${innovationId.slice(0, 8).toUpperCase()}`;

export const findCertificate = async (
  innovationId: string,
  scope: Record<string, unknown> = {},
) => {
  const innovation = await prisma.innovation.findFirst({
    where: { id: innovationId, deletedAt: null, ...scope },
    include: {
      createdBy: { select: { institution: { select: { name: true } } } },
      indicatorAssessments: {
        select: {
          indicatorId: true,
          score: true,
          reviewStatus: true,
          reviewedAt: true,
          reviewedBy: { select: { fullname: true } },
          _count: { select: { documents: true } },
        },
      },
    },
  });
  if (!innovation) return null;

  const eligible = isCertificateEligible({
    submissionStatus: innovation.submissionStatus,
    indicatorAssessments: innovation.indicatorAssessments.map((assessment) => ({
      indicatorId: assessment.indicatorId,
      reviewStatus: assessment.reviewStatus,
      documentCount: assessment._count.documents,
    })),
  });
  // Tanggal dan verifikator diambil dari persetujuan indikator wajib terakhir.
  const lastReview = innovation.indicatorAssessments
    .filter(
      (assessment) =>
        MANDATORY_INDICATOR_IDS.includes(assessment.indicatorId) &&
        assessment.reviewedAt,
    )
    .sort(
      (a, b) => (b.reviewedAt?.getTime() ?? 0) - (a.reviewedAt?.getTime() ?? 0),
    )[0];
  const approvedAt = lastReview?.reviewedAt ?? innovation.updatedAt;

  return {
    eligible,
    id: innovation.id,
    number: getCertificateNumber(innovation.id, approvedAt.getFullYear()),
    name: innovation.name,
    institution: innovation.createdBy.institution.name,
    stage: innovation.stage,
    innovationForm: innovation.innovationForm,
    governmentAffairs: innovation.governmentAffairs,
    initiatorName: innovation.initiatorName,
    score: innovation.indicatorAssessments.reduce(
      (total, assessment) => total + getAssessmentScore(assessment),
      0,
    ),
    approvedAt: approvedAt.toISOString(),
    approvedBy: lastReview?.reviewedBy?.fullname ?? null,
  };
};

export type CertificateData = NonNullable<
  Awaited<ReturnType<typeof findCertificate>>
>;
