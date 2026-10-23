import { prisma } from "@/lib/prisma";

export const SUBMISSION_TRACKS = {
  CONTRACT: "CONTRACT",
  COMPETITION: "COMPETITION",
} as const;

export type SubmissionTrack =
  (typeof SUBMISSION_TRACKS)[keyof typeof SUBMISSION_TRACKS];

export const SUBMISSION_STATUSES = {
  SUBMITTED: "SUBMITTED",
  ACCEPTED: "ACCEPTED",
  RETURNED: "RETURNED",
  CANCELLED: "CANCELLED",
} as const;

// Pengajuan yang masih berjalan; inovasi tidak boleh dikirim ulang ke jalur yang sama.
export const ACTIVE_SUBMISSION_STATUSES: string[] = [
  SUBMISSION_STATUSES.SUBMITTED,
  SUBMISSION_STATUSES.ACCEPTED,
];

export const SUBMISSION_PERMISSION_MODELS = {
  CONTRACT: "innovation-contracts",
  COMPETITION: "innovation-competitions",
} as const;

export const SUBMISSION_TRACK_LABELS = {
  CONTRACT: "Perjanjian Kinerja",
  COMPETITION: "Lomba Inovasi",
} as const;

export const isSubmissionTrack = (value: unknown): value is SubmissionTrack =>
  value === SUBMISSION_TRACKS.CONTRACT ||
  value === SUBMISSION_TRACKS.COMPETITION;

export const dateOnly = (value: Date) => value.toISOString().slice(0, 10);

// Kolom @db.Date disimpan sebagai tengah malam UTC, jadi "hari ini" mengikuti
// tanggal WIB lalu diubah ke format yang sama agar perbandingannya tepat.
export const todayDate = () =>
  parseDateOnly(
    new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(
      new Date(),
    ),
  );

export const parseDateOnly = (value: string) =>
  new Date(`${value}T00:00:00.000Z`);

export const getActiveCompetitionPeriod = () => {
  const today = todayDate();

  return prisma.competitionPeriod.findFirst({
    where: {
      deletedAt: null,
      startDate: { lte: today },
      endDate: { gte: today },
    },
    select: { id: true, name: true, startDate: true, endDate: true },
    orderBy: { startDate: "desc" },
  });
};

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const periodSelect = {
  id: true,
  name: true,
  startDate: true,
  endDate: true,
  description: true,
  _count: {
    select: {
      submissions: { where: { status: { in: ACTIVE_SUBMISSION_STATUSES } } },
    },
  },
} as const;

type PeriodRecord = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  description: string | null;
  _count: { submissions: number };
};

const getPeriodStatus = (period: PeriodRecord) => {
  const today = todayDate();
  if (period.startDate > today) return "UPCOMING";
  if (period.endDate < today) return "CLOSED";
  return "OPEN";
};

export const toPeriodDto = (period: PeriodRecord) => ({
  id: period.id,
  name: period.name,
  startDate: dateOnly(period.startDate),
  endDate: dateOnly(period.endDate),
  description: period.description,
  status: getPeriodStatus(period),
  submissionCount: period._count.submissions,
});

export const parsePeriodPayload = (payload: Record<string, unknown>) => {
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const startDate =
    typeof payload.startDate === "string" ? payload.startDate : "";
  const endDate = typeof payload.endDate === "string" ? payload.endDate : "";
  const description =
    typeof payload.description === "string" && payload.description.trim()
      ? payload.description.trim()
      : null;

  if (!name || !DATE_PATTERN.test(startDate) || !DATE_PATTERN.test(endDate)) {
    return { error: "Nama periode, tanggal buka, dan tanggal tutup wajib diisi." };
  }
  if (startDate > endDate) {
    return { error: "Tanggal tutup tidak boleh sebelum tanggal buka." };
  }

  return {
    data: {
      name,
      startDate: parseDateOnly(startDate),
      endDate: parseDateOnly(endDate),
      description,
    },
  };
};

export const findOverlappingPeriod = (
  startDate: Date,
  endDate: Date,
  excludeId?: string,
) =>
  prisma.competitionPeriod.findFirst({
    where: {
      deletedAt: null,
      ...(excludeId ? { id: { not: excludeId } } : {}),
      startDate: { lte: endDate },
      endDate: { gte: startDate },
    },
    select: { name: true },
  });
