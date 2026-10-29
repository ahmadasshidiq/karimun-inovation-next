import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { syncInnovationSubmissionStatus } from "@/lib/innovation-completeness";
import {
  innovationOwnerScope,
  innovationVisibilityScope,
} from "@/lib/innovation-access";
import {
  canReviewIndicators,
  VIDEO_INDICATOR_ID,
  resetIndicatorReview,
} from "@/lib/innovation-indicator";
import { getMinioClient, minioBucket } from "@/lib/minio";
import { prisma } from "@/lib/prisma";

const findDocument = (
  id: string,
  indicatorId: string,
  documentId: string,
  user: Awaited<ReturnType<typeof getAuthenticatedUser>>,
  allowReviewer = false,
) =>
  prisma.innovationIndicatorDocument.findFirst({
    where: {
      id: documentId,
      assessment: {
        innovationId: id,
        indicatorId: Number(indicatorId),
        ...(user
          ? {
              innovation:
                // Video indikator 20 ditampilkan di Database Inovasi dashboard.
                allowReviewer &&
                (canReviewIndicators(user.role.permission) ||
                  Number(indicatorId) === VIDEO_INDICATOR_ID)
                  ? innovationVisibilityScope(user)
                  : innovationOwnerScope(user),
            }
          : {}),
      },
    },
  });

export async function GET(
  _request: NextRequest,
  context: {
    params: Promise<{ id: string; indicatorId: string; documentId: string }>;
  },
) {
  const user = await getAuthenticatedUser();
  if (!user)
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });

  const { id, indicatorId, documentId } = await context.params;
  const document = await findDocument(id, indicatorId, documentId, user, true);
  if (!document)
    return NextResponse.json(
      { message: "Dokumen tidak ditemukan." },
      { status: 404 },
    );

  try {
    const minio = getMinioClient();
    const url = await minio.presignedGetObject(
      minioBucket,
      document.objectName,
      15 * 60,
      {
        "response-content-disposition": `inline; filename="${document.originalName.replace(/"/g, "")}"`,
      },
    );
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Create MinIO document URL failed", error);
    return NextResponse.json(
      { message: "Gagal membuka dokumen." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: {
    params: Promise<{ id: string; indicatorId: string; documentId: string }>;
  },
) {
  const user = await getAuthenticatedUser();
  if (!user)
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });

  const { id, indicatorId, documentId } = await context.params;
  const document = await findDocument(id, indicatorId, documentId, user);
  if (!document)
    return NextResponse.json(
      { message: "Dokumen tidak ditemukan." },
      { status: 404 },
    );

  try {
    const minio = getMinioClient();
    await minio.removeObject(minioBucket, document.objectName);
    await prisma.$transaction([
      prisma.innovationIndicatorDocument.delete({
        where: { id: document.id },
      }),
      prisma.innovationIndicatorAssessment.update({
        where: { id: document.assessmentId },
        data: resetIndicatorReview,
      }),
    ]);
    await syncInnovationSubmissionStatus(id);
    return NextResponse.json({ message: "Dokumen berhasil dihapus." });
  } catch (error) {
    console.error("Delete MinIO document failed", error);
    return NextResponse.json(
      { message: "Gagal menghapus dokumen." },
      { status: 500 },
    );
  }
}
