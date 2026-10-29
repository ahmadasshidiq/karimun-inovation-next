import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { syncInnovationSubmissionStatus } from "@/lib/innovation-completeness";
import { innovationOwnerScope } from "@/lib/innovation-access";
import { resetIndicatorReview } from "@/lib/innovation-indicator";
import { ensureMinioBucket, getMinioClient, minioBucket, minioPublicUrl } from "@/lib/minio";
import { prisma } from "@/lib/prisma";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MIME_BY_EXTENSION: Record<string, string> = {
  PDF: "application/pdf",
  JPG: "image/jpeg",
  JPEG: "image/jpeg",
  PNG: "image/png",
  MP4: "video/mp4",
};

const INDICATOR_FILE_TYPES: Record<number, string[]> = {
  1: ["PDF"], 2: ["PDF"], 3: ["PDF"], 4: ["PDF", "JPEG", "JPG", "PNG"],
  5: ["PDF"], 6: ["PDF"], 7: ["PDF", "JPEG", "JPG", "PNG"], 8: ["PDF"],
  9: ["PDF"], 10: ["JPEG", "JPG", "PNG"], 11: ["PDF", "JPG", "JPEG", "PNG"],
  12: ["JPEG", "JPG", "PNG"], 13: ["PDF"], 14: ["JPG", "JPEG", "PNG"],
  15: ["JPG", "JPEG", "PNG"], 16: ["PDF"], 17: ["PDF"],
  18: ["PDF", "JPG", "JPEG", "PNG"], 19: ["JPEG", "JPG", "PNG", "PDF"],
  20: ["MP4", "JPG", "JPEG", "PNG"],
};

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string; indicatorId: string }> },
) {
  const user = await getAuthenticatedUser();
  if (!user)
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });

  const { id, indicatorId: rawIndicatorId } = await context.params;
  const indicatorId = Number(rawIndicatorId);
  const formData = await request.formData();
  const file = formData.get("file");
  const documentTitle = String(formData.get("documentTitle") || "").trim();
  const innovation = await prisma.innovation.findFirst({
    where: {
      id,
      deletedAt: null,
      ...innovationOwnerScope(user),
    },
    select: { id: true },
  });
  if (!innovation)
    return NextResponse.json({ message: "Inovasi tidak ditemukan." }, { status: 404 });

  if (!Number.isInteger(indicatorId) || !(file instanceof File) || !documentTitle)
    return NextResponse.json({ message: "Data dokumen tidak lengkap." }, { status: 400 });
  const allowedExtensions = INDICATOR_FILE_TYPES[indicatorId];
  const extension = file.name.toUpperCase().split(".").pop() || "";
  const isAllowed = Boolean(
    allowedExtensions?.includes(extension) &&
      MIME_BY_EXTENSION[extension] === file.type,
  );
  if (!isAllowed || file.size > MAX_FILE_SIZE)
    return NextResponse.json(
      { message: `Format file tidak sesuai. Format yang diizinkan: ${allowedExtensions?.join("/") || "tidak tersedia"}. Ukuran maksimal 10 MB.` },
      { status: 400 },
    );

  const assessment = await prisma.innovationIndicatorAssessment.findUnique({
    where: { innovationId_indicatorId: { innovationId: id, indicatorId } },
  });
  if (!assessment)
    return NextResponse.json(
      { message: "Pilih parameter indikator terlebih dahulu." },
      { status: 400 },
    );

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const objectName = `innovations/${id}/indicators/${indicatorId}/${crypto.randomUUID()}-${safeName}`;

  try {
    await ensureMinioBucket();
    const minio = getMinioClient();
    await minio.putObject(
      minioBucket,
      objectName,
      Buffer.from(await file.arrayBuffer()),
      file.size,
      { "Content-Type": file.type },
    );

    const rawDate = String(formData.get("documentDate") || "");
    const [document] = await prisma.$transaction([
      prisma.innovationIndicatorDocument.create({
        data: {
          assessmentId: assessment.id,
          documentNumber: String(formData.get("documentNumber") || "").trim() || null,
          documentDate: rawDate ? new Date(`${rawDate}T00:00:00.000Z`) : null,
          documentTitle,
          originalName: file.name,
          objectName,
          url: minioPublicUrl(objectName),
          mimeType: file.type,
          size: file.size,
        },
      }),
      prisma.innovationIndicatorAssessment.update({
        where: { id: assessment.id },
        data: resetIndicatorReview,
      }),
    ]);
    await syncInnovationSubmissionStatus(id);

    return NextResponse.json(
      { message: "Dokumen berhasil diunggah.", data: { id: document.id } },
      { status: 201 },
    );
  } catch (error) {
    console.error("MinIO document upload failed", error);
    return NextResponse.json({ message: "Gagal mengunggah dokumen." }, { status: 500 });
  }
}
