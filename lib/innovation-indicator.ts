import { hasPermission } from "@/lib/permission";

// Indikator wajib dipenuhi sebelum inovasi dikirim ke Perjanjian Kinerja atau Lomba Inovasi.
export const MANDATORY_INDICATORS = {
  1: "Regulasi Inovasi Daerah",
  2: "Ketersediaan dan peran SDM terhadap inovasi daerah",
  17: "Kecepatan penciptaan inovasi",
  18: "Kemanfaatan inovasi",
  20: "Video inovasi daerah",
} as const;

export const MANDATORY_INDICATOR_IDS = Object.keys(MANDATORY_INDICATORS).map(
  Number,
);

export const isMandatoryIndicator = (indicatorId: number) =>
  MANDATORY_INDICATOR_IDS.includes(indicatorId);

export const INDICATOR_REVIEW_STATUSES = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type IndicatorReviewStatus =
  (typeof INDICATOR_REVIEW_STATUSES)[keyof typeof INDICATOR_REVIEW_STATUSES];

// Verifikator indikator mengikuti permission approval inovasi.
export const canReviewIndicators = (permission: unknown) =>
  hasPermission(permission, "innovation-approvals", "approve") ||
  hasPermission(permission, "innovation-approvals", "reject");

// Bobot indikator yang ditolak verifikator tidak dihitung ke skor inovasi.
export const getAssessmentScore = (assessment: {
  score: unknown;
  reviewStatus?: string | null;
}) =>
  assessment.reviewStatus === INDICATOR_REVIEW_STATUSES.REJECTED
    ? 0
    : Number(assessment.score) || 0;

// Perubahan parameter/dokumen membuat hasil verifikasi sebelumnya tidak berlaku.
export const resetIndicatorReview = {
  reviewStatus: INDICATOR_REVIEW_STATUSES.PENDING,
  reviewNote: null,
  reviewedById: null,
  reviewedAt: null,
};

// Indikator dianggap terpenuhi jika parameter sudah dipilih, ada dokumen pendukung,
// dan tidak ditolak verifikator.
export const getMissingMandatoryIndicators = (
  assessments: {
    indicatorId: number;
    documentCount: number;
    reviewStatus?: string | null;
  }[],
) =>
  MANDATORY_INDICATOR_IDS.filter(
    (indicatorId) =>
      !assessments.some(
        (assessment) =>
          assessment.indicatorId === indicatorId &&
          assessment.documentCount > 0 &&
          assessment.reviewStatus !== INDICATOR_REVIEW_STATUSES.REJECTED,
      ),
  );

// Indikator "Video inovasi daerah": berisi video penerapan dan cover thumbnail.
export const VIDEO_INDICATOR_ID = 20;

const documentUrl = (innovationId: string, documentId: string) =>
  `/api/innovations/${innovationId}/indicators/${VIDEO_INDICATOR_ID}/documents/${documentId}`;

// Video diambil dari dokumen indikator video; gambar pertama dipakai sebagai cover.
// Jika indikator hanya berisi gambar, url bernilai null dan gambar ditampilkan saja.
export const getInnovationVideo = (
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
  const poster = documents.find((document) =>
    document.mimeType.startsWith("image/"),
  );
  if (!video && !poster) return null;

  return {
    url: video ? documentUrl(innovationId, video.id) : null,
    posterUrl: poster ? documentUrl(innovationId, poster.id) : null,
  };
};
