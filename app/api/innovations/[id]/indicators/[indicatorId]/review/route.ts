import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { innovationVisibilityScope } from "@/lib/innovation-access";
import { syncInnovationSubmissionStatus } from "@/lib/innovation-completeness";
import { INDICATOR_REVIEW_STATUSES } from "@/lib/innovation-indicator";
import { hasPermission } from "@/lib/permission";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string; indicatorId: string }> },
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }
  const body = (await request.json()) as { action?: unknown; note?: unknown };
  const action =
    body.action === "approve" || body.action === "reject" ? body.action : null;
  const note = typeof body.note === "string" ? body.note.trim() : "";
  if (!action) {
    return NextResponse.json(
      { message: "Aksi verifikasi tidak valid." },
      { status: 400 },
    );
  }
  if (!hasPermission(user.role.permission, "innovation-approvals", action)) {
    return NextResponse.json(
      { message: "Anda tidak memiliki akses verifikasi indikator." },
      { status: 403 },
    );
  }
  if (action === "reject" && !note) {
    return NextResponse.json(
      { message: "Catatan penolakan wajib diisi." },
      { status: 400 },
    );
  }

  const { id, indicatorId: rawIndicatorId } = await context.params;
  const indicatorId = Number(rawIndicatorId);
  const assessment = Number.isInteger(indicatorId)
    ? await prisma.innovationIndicatorAssessment.findFirst({
        where: {
          innovationId: id,
          indicatorId,
          innovation: { deletedAt: null, ...innovationVisibilityScope(user) },
        },
        select: { id: true, _count: { select: { documents: true } } },
      })
    : null;
  if (!assessment) {
    return NextResponse.json(
      { message: "Indikator belum diisi." },
      { status: 404 },
    );
  }
  if (assessment._count.documents === 0) {
    return NextResponse.json(
      { message: "Indikator belum memiliki dokumen pendukung." },
      { status: 400 },
    );
  }

  const data = await prisma.innovationIndicatorAssessment.update({
    where: { id: assessment.id },
    data: {
      reviewStatus:
        action === "approve"
          ? INDICATOR_REVIEW_STATUSES.APPROVED
          : INDICATOR_REVIEW_STATUSES.REJECTED,
      reviewNote: note || null,
      reviewedById: user.id,
      reviewedAt: new Date(),
    },
  });
  await syncInnovationSubmissionStatus(id);

  return NextResponse.json({
    message:
      action === "approve"
        ? "Indikator berhasil disetujui."
        : "Indikator berhasil ditolak.",
    data,
  });
}
