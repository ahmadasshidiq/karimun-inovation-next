import { prisma } from "@/lib/prisma";

type InnovationIndexRecord = {
  id: string;
  year: number;
  score: { toString(): string };
  predicate: string | null;
};

export const toInnovationIndexDto = (index: InnovationIndexRecord) => ({
  id: index.id,
  year: index.year,
  score: Number(index.score.toString()),
  predicate: index.predicate,
});

export const parseInnovationIndexPayload = (
  payload: Record<string, unknown>,
) => {
  const year = Number(payload.year);
  const score = Number(payload.score);
  const predicate =
    typeof payload.predicate === "string" && payload.predicate.trim()
      ? payload.predicate.trim()
      : null;

  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    return { error: "Tahun tidak valid." };
  }
  if (!Number.isFinite(score) || score < 0 || score > 9999.99) {
    return { error: "Nilai indeks tidak valid." };
  }

  return { data: { year, score, predicate } };
};

export const findDuplicateIndexYear = (year: number, excludeId?: string) =>
  prisma.innovationIndex.findFirst({
    where: { year, ...(excludeId ? { id: { not: excludeId } } : {}) },
    select: { id: true },
  });
