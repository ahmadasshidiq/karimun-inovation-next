import {
  getMissingMandatoryIndicators,
  MANDATORY_INDICATORS,
} from "@/lib/innovation-indicator";
import { prisma } from "@/lib/prisma";

// Field wajib pada form inovasi; dipakai untuk menentukan status pengiriman.
export const INNOVATION_REQUIRED_FIELDS = [
  "name",
  "stage",
  "type",
  "initiatorType",
  "initiatorName",
  "classification",
  "innovationForm",
  "governmentAffairs",
  "thematic",
  "trialPeriod",
  "implementationPeriod",
] as const;

export const isInnovationComplete = (payload: Record<string, unknown>) =>
  INNOVATION_REQUIRED_FIELDS.every((field) =>
    Boolean(String(payload[field] ?? "").trim()),
  );

// Indikator wajib yang belum terpenuhi (parameter + dokumen, tidak ditolak).
export const findMissingIndicatorNames = async (innovationId: string) => {
  const assessments = await prisma.innovationIndicatorAssessment.findMany({
    where: { innovationId },
    select: {
      indicatorId: true,
      reviewStatus: true,
      _count: { select: { documents: true } },
    },
  });

  return getMissingMandatoryIndicators(
    assessments.map((assessment) => ({
      indicatorId: assessment.indicatorId,
      documentCount: assessment._count.documents,
      reviewStatus: assessment.reviewStatus,
    })),
  ).map(
    (indicatorId) =>
      MANDATORY_INDICATORS[indicatorId as keyof typeof MANDATORY_INDICATORS],
  );
};

// INCOMPLETE: data inovasi/indikator wajib belum lengkap,
// DRAFT: lengkap tetapi belum dikirim, SUBMITTED: lengkap dan dikirim.
export const resolveSubmissionStatus = (
  payload: Record<string, unknown>,
  missingIndicatorCount: number,
) => {
  if (!isInnovationComplete(payload) || missingIndicatorCount > 0) {
    return "INCOMPLETE";
  }
  return payload.submissionStatus === "SUBMITTED" ? "SUBMITTED" : "DRAFT";
};

export const getSubmitBlockMessage = (
  payload: Record<string, unknown>,
  missingIndicatorNames: string[],
) => {
  if (!isInnovationComplete(payload)) {
    return "Lengkapi seluruh field wajib sebelum mengirim data.";
  }
  if (missingIndicatorNames.length > 0) {
    return `Lengkapi indikator wajib terlebih dahulu: ${missingIndicatorNames.join(", ")}.`;
  }
  return null;
};

// Dipanggil setelah indikator/dokumen berubah. Inovasi yang menjadi tidak lengkap
// turun ke INCOMPLETE; setelah dilengkapi kembali menjadi DRAFT dan perlu dikirim ulang.
export const syncInnovationSubmissionStatus = async (innovationId: string) => {
  const innovation = await prisma.innovation.findUnique({
    where: { id: innovationId },
  });
  if (!innovation) return;

  const missingIndicatorNames = await findMissingIndicatorNames(innovationId);
  const payload = {
    ...innovation,
    submissionStatus:
      innovation.submissionStatus === "SUBMITTED" ? "SUBMITTED" : "DRAFT",
  } as Record<string, unknown>;
  const submissionStatus = resolveSubmissionStatus(
    payload,
    missingIndicatorNames.length,
  );

  if (submissionStatus !== innovation.submissionStatus) {
    await prisma.innovation.update({
      where: { id: innovationId },
      data: { submissionStatus },
    });
  }
};
