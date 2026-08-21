import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { ensureMinioBucket, minio, minioBucket, minioPublicUrl } from "@/lib/minio";
import { prisma } from "@/lib/prisma";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string; indicatorId: string }> },
) {
  if (!(await getAuthenticatedUser()))
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });

  const { id, indicatorId: rawIndicatorId } = await context.params;
  const indicatorId = Number(rawIndicatorId);
  const formData = await request.formData();
  const file = formData.get("file");
  const documentTitle = String(formData.get("documentTitle") || "").trim();

  if (!Number.isInteger(indicatorId) || !(file instanceof File) || !documentTitle)
    return NextResponse.json({ message: "Data dokumen tidak lengkap." }, { status: 400 });
  if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_SIZE)
    return NextResponse.json(
      { message: "File harus PDF/JPG/PNG dengan ukuran maksimal 10 MB." },
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
    await minio.putObject(
      minioBucket,
      objectName,
      Buffer.from(await file.arrayBuffer()),
      file.size,
      { "Content-Type": file.type },
    );

    const rawDate = String(formData.get("documentDate") || "");
    const document = await prisma.innovationIndicatorDocument.create({
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
    });

    return NextResponse.json(
      { message: "Dokumen berhasil diunggah.", data: { id: document.id } },
      { status: 201 },
    );
  } catch (error) {
    console.error("MinIO document upload failed", error);
    return NextResponse.json({ message: "Gagal mengunggah dokumen." }, { status: 500 });
  }
}
