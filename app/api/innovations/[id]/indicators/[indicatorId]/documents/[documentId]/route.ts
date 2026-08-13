import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { minio, minioBucket } from "@/lib/minio";
import { prisma } from "@/lib/prisma";

const findDocument = (
  id: string,
  indicatorId: string,
  documentId: string,
) =>
  prisma.innovationIndicatorDocument.findFirst({
    where: {
      id: documentId,
      assessment: { innovationId: id, indicatorId: Number(indicatorId) },
    },
  });

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string; indicatorId: string; documentId: string }> },
) {
  if (!(await getAuthenticatedUser()))
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });

  const { id, indicatorId, documentId } = await context.params;
  const document = await findDocument(id, indicatorId, documentId);
  if (!document)
    return NextResponse.json({ message: "Dokumen tidak ditemukan." }, { status: 404 });

  try {
    const url = await minio.presignedGetObject(
      minioBucket,
      document.objectName,
      15 * 60,
      { "response-content-disposition": `inline; filename="${document.originalName.replace(/"/g, "")}"` },
    );
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Create MinIO document URL failed", error);
    return NextResponse.json({ message: "Gagal membuka dokumen." }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string; indicatorId: string; documentId: string }> },
) {
  if (!(await getAuthenticatedUser()))
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });

  const { id, indicatorId, documentId } = await context.params;
  const document = await findDocument(id, indicatorId, documentId);
  if (!document)
    return NextResponse.json({ message: "Dokumen tidak ditemukan." }, { status: 404 });

  try {
    await minio.removeObject(minioBucket, document.objectName);
    await prisma.innovationIndicatorDocument.delete({ where: { id: document.id } });
    return NextResponse.json({ message: "Dokumen berhasil dihapus." });
  } catch (error) {
    console.error("Delete MinIO document failed", error);
    return NextResponse.json({ message: "Gagal menghapus dokumen." }, { status: 500 });
  }
}
