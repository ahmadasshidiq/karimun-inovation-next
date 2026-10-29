import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { toInnovationIndexDto } from "@/lib/innovation-index";
import { hasPermission } from "@/lib/permission";
import { prisma } from "@/lib/prisma";

export async function GET() {
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

  // Statistik dihitung dari inovasi terkirim se-Kabupaten Karimun sehingga tampilan sama untuk semua role.
  const [indices, innovationsPerYear, stageGroups] = await Promise.all([
    prisma.innovationIndex.findMany({ orderBy: { year: "asc" } }),
    prisma.$queryRaw<{ year: number; total: number }[]>`
      SELECT EXTRACT(YEAR FROM "created_at")::int AS "year",
             COUNT(*)::int AS "total"
      FROM "innovations"
      WHERE "deleted_at" IS NULL
        AND "submission_status" = 'SUBMITTED'
      GROUP BY 1
      ORDER BY 1
    `,
    prisma.innovation.groupBy({
      by: ["stage"],
      where: { deletedAt: null, submissionStatus: "SUBMITTED" },
      _count: { _all: true },
    }),
  ]);

  const countStage = (stage: string) =>
    stageGroups.find((group) => group.stage === stage)?._count._all ?? 0;
  const latestIndex = indices.at(-1);

  return NextResponse.json({
    data: {
      innovationIndex: indices.map(toInnovationIndexDto),
      innovationsPerYear,
      summary: {
        total: stageGroups.reduce((total, group) => total + group._count._all, 0),
        initiative: countStage("Inisiatif"),
        trial: countStage("Uji Coba"),
        implementation: countStage("Penerapan"),
        indexScore: latestIndex ? Number(latestIndex.score.toString()) : 0,
        indexYear: latestIndex?.year ?? null,
      },
    },
  });
}
