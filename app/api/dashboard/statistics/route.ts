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

  // Jumlah inovasi dihitung untuk seluruh Kabupaten Karimun berdasarkan tahun input.
  const [indices, innovationsPerYear] = await Promise.all([
    prisma.innovationIndex.findMany({ orderBy: { year: "asc" } }),
    prisma.$queryRaw<{ year: number; total: number }[]>`
      SELECT EXTRACT(YEAR FROM "created_at")::int AS "year",
             COUNT(*)::int AS "total"
      FROM "innovations"
      WHERE "deleted_at" IS NULL
      GROUP BY 1
      ORDER BY 1
    `,
  ]);

  return NextResponse.json({
    data: {
      innovationIndex: indices.map(toInnovationIndexDto),
      innovationsPerYear,
    },
  });
}
