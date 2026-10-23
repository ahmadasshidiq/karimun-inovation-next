import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import {
  SUBMISSION_PERMISSION_MODELS,
  SUBMISSION_STATUSES,
} from "@/lib/innovation-submission";
import { hasPermission } from "@/lib/permission";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }

  const payload = (await request.json()) as {
    decision?: unknown;
    note?: unknown;
  };
  const decision =
    payload.decision === "accept" || payload.decision === "return"
      ? payload.decision
      : null;
  const note = typeof payload.note === "string" ? payload.note.trim() : "";
  if (!decision) {
    return NextResponse.json(
      { message: "Keputusan verifikasi tidak valid." },
      { status: 400 },
    );
  }
  if (decision === "return" && !note) {
    return NextResponse.json(
      { message: "Catatan wajib diisi saat mengembalikan pengajuan." },
      { status: 400 },
    );
  }

  const { id } = await context.params;
  const submission = await prisma.innovationSubmission.findFirst({
    where: { id, innovation: { deletedAt: null } },
    select: { track: true, status: true },
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
  if (!hasPermission(user.role.permission, permissionModel, "verify")) {
    return NextResponse.json(
      { message: "Anda tidak memiliki akses memverifikasi pengajuan." },
      { status: 403 },
    );
  }
  if (submission.status !== SUBMISSION_STATUSES.SUBMITTED) {
    return NextResponse.json(
      { message: "Pengajuan ini sudah diproses." },
      { status: 400 },
    );
  }

  await prisma.innovationSubmission.update({
    where: { id },
    data: {
      status:
        decision === "accept"
          ? SUBMISSION_STATUSES.ACCEPTED
          : SUBMISSION_STATUSES.RETURNED,
      reviewNote: note || null,
      reviewedById: user.id,
      reviewedAt: new Date(),
    },
  });

  return NextResponse.json({
    message:
      decision === "accept"
        ? "Pengajuan berhasil diterima."
        : "Pengajuan dikembalikan untuk diperbaiki.",
  });
}
