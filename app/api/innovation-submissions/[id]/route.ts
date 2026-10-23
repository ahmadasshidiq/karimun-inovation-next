import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { innovationOwnerScope } from "@/lib/innovation-access";
import {
  SUBMISSION_PERMISSION_MODELS,
  SUBMISSION_STATUSES,
  todayDate,
} from "@/lib/innovation-submission";
import { hasPermission } from "@/lib/permission";
import { prisma } from "@/lib/prisma";

// Pembatalan tidak menghapus data agar riwayat pengajuan tetap tersimpan.
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }

  const { id } = await context.params;
  const submission = await prisma.innovationSubmission.findFirst({
    where: {
      id,
      innovation: { deletedAt: null, ...innovationOwnerScope(user) },
    },
    select: {
      track: true,
      status: true,
      period: { select: { endDate: true } },
    },
  });
  if (!submission) {
    return NextResponse.json(
      { message: "Pengajuan tidak ditemukan." },
      { status: 404 },
    );
  }
  const permissionModel =
    SUBMISSION_PERMISSION_MODELS[
      submission.track as keyof typeof SUBMISSION_PERMISSION_MODELS
    ];
  if (!hasPermission(user.role.permission, permissionModel, "cancel")) {
    return NextResponse.json(
      { message: "Anda tidak memiliki akses membatalkan pengajuan." },
      { status: 403 },
    );
  }
  if (submission.status !== SUBMISSION_STATUSES.SUBMITTED) {
    return NextResponse.json(
      { message: "Hanya pengajuan yang belum diverifikasi yang dapat dibatalkan." },
      { status: 400 },
    );
  }
  if (submission.period && submission.period.endDate < todayDate()) {
    return NextResponse.json(
      { message: "Periode lomba sudah ditutup, pengajuan tidak dapat dibatalkan." },
      { status: 400 },
    );
  }

  await prisma.innovationSubmission.update({
    where: { id },
    data: {
      status: SUBMISSION_STATUSES.CANCELLED,
      cancelledAt: new Date(),
    },
  });

  return NextResponse.json({ message: "Pengajuan berhasil dibatalkan." });
}
